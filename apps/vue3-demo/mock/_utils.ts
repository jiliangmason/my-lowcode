export function resultSuccess(data: Record<string, any>) {
    return {
      result: 1,
      msg: 'ok',
      data,
    };
  }
  