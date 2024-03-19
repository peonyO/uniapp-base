import CryptoJS from "crypto-js";

/**
 * 解密数据
 * @param options 解密的字符串
 * @returns
 */
export const cryptoDecrypt = (options: string) => {
  if (!options) return "";
  options = options.replace(new RegExp("_", "gm"), "=");
  const parsedOptions = CryptoJS.enc.Base64.parse(options);
  options = parsedOptions.toString(CryptoJS.enc.Utf8);
  const publicKey = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_PARSE_KEY);
  const decryptOptions = CryptoJS.AES.decrypt(options, publicKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  const result = CryptoJS.enc.Utf8.stringify(decryptOptions).toString();
  return JSON.parse(result);
};

/**
 * 加密数据
 * @param options 加密键值对
 * @returns @String
 */
export const encrypt = (options: Record<string, any>) => {
  if (!options) return "";
  return CryptoJS.AES.encrypt(JSON.stringify(options), CryptoJS.enc.Utf8.parse(import.meta.env.VITE_ENCRYPT_KEY), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
};

// 请求头信息中的 content-type
export const CONTENT_TYPE_MAP = {
  form: "application/x-www-form-urlencoded",
  json: "application/json"
} as const;

export const responseStatusMap = {
  SUCCESS: 200, // 请求成功且操作成功，对应 request 方法的 success 回调。
  FAIL: 500, // 请求成功但操作失败，对应 request 方法的 success 回调。
  NOT_NETWOKE: 2, // 当前无网络，请稍后重试
  MAIN_ERROR: 1 // request 调用失败，原因未知
};

export function normalizeResponseData(data: AnyObject) {
  let _status = responseStatusMap.SUCCESS;
  const _code = data.code;
  const _msg = data.message;
  if (_code !== 200) {
    if (_code === 1) {
      _status = responseStatusMap.MAIN_ERROR;
    } else if (_code === 2) {
      _status = responseStatusMap.NOT_NETWOKE;
    } else {
      _status = responseStatusMap.FAIL;
    }
  }
  return {
    ...data,
    _status,
    _msg
  };
}

export function initGUID() {
  const { deviceId, platform, SDKVersion, deviceModel, system, version, deviceType } = uni.getSystemInfoSync();
  const { appId } = uni.getAccountInfoSync ? uni.getAccountInfoSync().miniProgram : { appId: "h5" };
  return encrypt({
    deviceId,
    platform,
    SDKVersion,
    deviceModel,
    system,
    version,
    deviceType,
    appid: appId
  });
}
