declare const process: {
    env: {
      NODE_ENV: 'production' | 'development';
      RELEASE: string;
      BUILD_ENV: 'test' | 'staging';
      REACT_APP_BUILD_ENV: 'test' | 'staging' | undefined;
    };
  };
  declare global {
    interface Window {
      uc: (params: any) => void;
    }
  }
  declare module '*.png' {
    const content: any;
    export default content;
  }
  
  declare module '*.less' {
    const classes: {
      [key: string]: string;
    };
    export default classes;
  }
  
  declare module '*.module.less' {
    const classes: {
      [key: string]: string;
    };
    export default classes;
  }
  