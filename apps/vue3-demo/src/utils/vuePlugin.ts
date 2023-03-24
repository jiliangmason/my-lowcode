import type { App } from 'vue';

type ViewModel = {
  _isVue?: boolean;
  __isVue?: boolean;
  $root: ViewModel;
  $parent?: ViewModel;
  $props: { [key: string]: any };
  $options?: {
    name?: string;
    propsData?: { [key: string]: any };
    _componentTag?: string;
    __file?: string;
  };
};
const ANONYMOUS_COMPONENT_NAME = '<Anonymous>';
const ROOT_COMPONENT_NAME = '<Root>';

const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str: string): string =>
  str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, '');

export const formatComponentName = (vm?: ViewModel, includeFile?: boolean): string => {
  if (!vm) {
    return ANONYMOUS_COMPONENT_NAME;
  }

  if (vm.$root === vm) {
    return ROOT_COMPONENT_NAME;
  }

  // https://github.com/getsentry/sentry-javascript/issues/5204 $options can be undefined
  if (!vm.$options) {
    return ANONYMOUS_COMPONENT_NAME;
  }

  const options = vm.$options;

  let name = options.name || options._componentTag;
  const file = options.__file;
  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/);
    if (match) {
      name = match[1];
    }
  }

  return (
    (name ? `<${classify(name)}>` : ANONYMOUS_COMPONENT_NAME) +
    (file && includeFile !== false ? ` at ${file}` : '')
  );
};

const repeat = (str: string, n: number) => {
  let res = '';
  while (n) {
    if (n % 2 === 1) {
      res += str;
    }
    if (n > 1) {
      str += str;
    }
    n >>= 1;
    return res;
  }
};

const generateComponentTrace = (vm?: ViewModel): string => {
  if ((vm?._isVue || vm?.__isVue) && vm?.$parent) {
    const tree = [];
    let currentRecursiveSequence = 0;
    while (vm) {
      if (tree.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const last = tree[tree.length - 1] as any;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (last.constructor === vm.constructor) {
          currentRecursiveSequence += 1;
          vm = vm.$parent; // eslint-disable-line no-param-reassign
          continue;
        } else if (currentRecursiveSequence > 0) {
          tree[tree.length - 1] = [last, currentRecursiveSequence];
          currentRecursiveSequence = 0;
        }
      }
      tree.push(vm);
      vm = vm.$parent; // eslint-disable-line no-param-reassign
    }

    const formattedTree = tree
      .map(
        (vm, i) =>
          `${
            (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) +
            (Array.isArray(vm)
              ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
              : formatComponentName(vm))
          }`,
      )
      .join('\n');

    return `\n\nfound in\n\n${formattedTree}`;
  }

  return `\n\n(found in ${formatComponentName(vm)})`;
};

/**
 * Vue 异常收集
 * @param app
 */
function vueErrorHandlePlugin(app: App) {
  const prevErrorHandler = app.config.errorHandler;

  app.config.errorHandler = function (err, vm, lifecycleHook: string) {
    const componentName = formatComponentName(vm as ViewModel, false);
    const trace = vm ? generateComponentTrace(vm as ViewModel) : '';
    const metadata: Record<string, unknown> = {
      componentName,
      lifecycleHook,
      trace,
    };
    if (vm) {
      if (vm.$options && vm.$options.propsData) {
        metadata.propsData = vm.$options.propsData;
      } else if (vm.$props) {
        metadata.propsData = vm.$props;
      }
    }

    if (prevErrorHandler && typeof prevErrorHandler === 'function') {
      prevErrorHandler.call(app, err, vm, lifecycleHook);
    } else if (window.console) {
      window.console.error(err);
    }
  };
}

export { vueErrorHandlePlugin };
