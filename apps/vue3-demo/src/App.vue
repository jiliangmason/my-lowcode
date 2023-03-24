<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { RouterView } from 'vue-router';
import { getQueryString } from '@/utils';

function dynamicImportVconsole() {
  const script = document.createElement('script');
  if (!document.getElementById('v-console')) {
    script.src = 'vconsole.js';
    script.defer = true;
    script.async = true;
    script.id = 'v-console';
    script.type = 'text/javascript';
    document.body.appendChild(script);
    script.onload = function () {
      // 加载vconsole
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new window.VConsole({});
    };
  }
}
onMounted(() => {
  const { debug } = getQueryString();
  nextTick(() => {
    +debug === 1 && dynamicImportVconsole();
  });
});
</script>

<template>
  <RouterView />
</template>

<style></style>
