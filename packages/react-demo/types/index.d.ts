declare global {
    interface Window {
      xxx: {
        jump: (url: string, mode?: '_blank' | '_self') => void;
      };
    }
  }
  export {};
  