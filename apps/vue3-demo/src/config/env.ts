export enum EEnv {
    PROD = 'production',
    STAGING = 'staging',
    BETA = 'beta',
    TEST = 'test',
  }
  
  const ENV = import.meta.env.VITE_ENV;
  
  // 是否为prod
  const IS_PROD = ENV === 'prod';
  
  const getEnv = () => {
    switch (ENV) {
      case 'prod':
        return EEnv.PROD;
      case 'beta':
        return EEnv.BETA;
      case 'staging':
        return EEnv.STAGING;
      default:
        return EEnv.TEST;
    }
  };
  
  export { IS_PROD, getEnv, ENV };
  