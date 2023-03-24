export const getClient = () => {
  const ua = navigator.userAgent;
  return {
    isWechat: /MicroMessenger/i.test(ua),
    // @ts-expect-error ignore
    isIOS: /iPad|iPhone|iPod/.test(ua) && !window.MSStream,
    isPC: !/Mobile/i.test(ua),
  };
};

/**
 * 截取url字符串中的参数
 *
 * @export
 * @param {string} url 传入标准的url
 * @returns {object} 截取到url上的参数
 */
export function getQuery(url: string) {
  const queryArr = url.slice(1).split('?');
  const returnString = {} as any;
  if (queryArr.length === 0 || queryArr.length === 1) {
    return returnString;
  }
  const queryStr = queryArr.slice(1)[0];
  const queryStrArr = queryStr.split('&');
  for (let i = 0; i < queryStrArr.length; i++) {
    const obj = queryStrArr[i].split('=');
    if (obj.length) {
      returnString[obj[0]] = obj[1];
    }
  }
  return returnString;
}

/**
 * 获取url上面的参数
 *
 * @export
 * @returns {object} 截取到url上的参数
 */
export function getQueryString() {
  const href: string = window.location.href;
  return getQuery(href);
}

/** 获取支付渠道，return 参考 EPayWay 枚举 */
export const getPayWay = () => {
  const client = getClient();
  if (client.isWechat) return EPayWay.H5;
  if (client.isIOS) return EPayWay.IOS;
  if (client.isPC) return EPayWay.PC;
  return EPayWay.ANDROID;
};

/**
 * 获取cookie中的值
 *
 * @export
 * @param {string} name
 * @returns
 */
export const getCookieByName = (name: string) => {
  if (!document.cookie) {
    return '';
  }
  const cookieObj = document.cookie.split(';').reduce<{ [key: string]: string }>((memo, item) => {
    const pair = item.split('=');
    if (pair[0]) {
      memo[pair[0].trim()] = pair[1] ? pair[1].trim() : '';
    }
    return memo;
  }, {});
  return cookieObj[name];
};
