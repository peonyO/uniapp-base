declare type StorageKey = keyof StorageValue;
declare interface StorageValue {
  tokenInfo?: TokenInfo;
  cacheImage?: {
    [key: string]: {
      src: string;
      size: number;
    };
  };
}
declare type RemoveStorage = (key: StorageKey) => void;

declare interface TokenInfo {
  expireTime: number;
  login: boolean;
  token: string;
  real: boolean;
}

declare type GlobalDataKey = keyof GlobalDataValue;
declare interface GlobalDataValue {
  loginCallback?: ActiveLoginHook;
  GUID?: string;
}
declare type SetGlobalData = (key: GlobalDataKey) => void;
