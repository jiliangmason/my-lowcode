/** 大于10w 再转成w 并且转为千分位 */
export const formatToTenThousand =
  (precise: number = 2) =>
  (value: string | number): string => {
    if (!value && value !== 0) {
      return '--';
    }
    if (value >= 100000) {
      return `${toThousandHandle((+value / 10000).toFixed(precise))}w`;
    }
    return `${toThousandHandle((+value).toFixed(precise))}`;
  };

/** 大于10w 再转成w */
export const formatTenThousand =
  (precise: number = 2) =>
  (value: string | number): string => {
    if (!value && value !== 0) {
      return '--';
    }
    if (value >= 100000) {
      return `${(+value / 10000).toFixed(precise)}w`;
    }
    return `${(+value).toFixed(precise)}`;
  };

/** 金额单位为厘，转换为元展示精确到2位小数 */
export const formatToMoney = (
  value: string | number,
  toThousand: boolean = true,
  precise?: number,
) => {
  if (toThousand) {
    return formatToTenThousand(precise)(+value / 1000);
  }
  return formatTenThousand(precise)(+value / 1000);
};

export const formatToFixed =
  (precise: number = 2) =>
  (value: string | number) => {
    if (isNaN(+value) || (!value && value !== 0)) {
      return '--';
    }
    return (+value).toFixed(precise);
  };

/**
 * 数字取指定小数位，多余位数直接舍去，不进行四舍五入
 */
export const floorByPrecise = (num: number, precise: number): string => {
  return (
    Math.floor(parseFloat((num * Math.pow(10, precise)).toPrecision(12))) / Math.pow(10, precise)
  ).toFixed(precise);
};

/**
 * 按要求处理传入的数值
 * @param num 待处理数值
 * @param {
 *  precise: number 保留小数位数
 *  toThousand: boolean 是否需要添加千位分隔符
 * }
 * @return {string} 处理后的字符串
 */
const DEFAULT_LENGTH = 3;
export const toThousandHandle = (num: number | string): string => {
  const numStr = num.toString();
  let isAlreadyInt = false;
  let intNumber = numStr.split('.')[0];
  if (intNumber === numStr) {
    isAlreadyInt = true;
  }
  let intLength = intNumber.length;
  while (intLength > DEFAULT_LENGTH) {
    intLength -= DEFAULT_LENGTH;
    intNumber = intNumber.slice(0, intLength) + ',' + intNumber.slice(intLength);
  }
  return isAlreadyInt ? intNumber : numStr.replace(/^.*\./g, intNumber + '.');
};

/**
 * 按要求处理传入的数值
 * @param num 待处理数值
 * @param {
 *  precise: number 保留小数位数
 *  toThousand: boolean 是否需要添加千位分隔符
 *  roundoff: 四舍五入还是抹去最后一位
 * }
 * @return {string} 处理后的字符串
 */
const DEFAULT_PRECISE = 2;
export const toFixedHandle = (
  num: number,
  { precise = DEFAULT_PRECISE, toThousand = false, roundoff = false } = {},
): string => {
  if (Number.isNaN(num) || num === Infinity || num === undefined) {
    return (0).toFixed(precise);
  }
  const value = roundoff ? num.toFixed(precise) : floorByPrecise(num, precise).toString();
  return toThousand ? toThousandHandle(value) : value;
};

/** 金额单位为厘，转换为元展示精确到2位小数 */
export const formatToCommaMoney = (value: string | number): string =>
  toFixedHandle(+value / 1000, {
    precise: 2,
    toThousand: true,
    roundoff: true,
  });
