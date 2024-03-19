import { showToast } from "../dialog";
import { logInfo } from "../log";
import { getGlobalData, getStorage } from "../storage";
import { isString, removeEmptyValues, serializeUrl } from "../utils";
import { CONTENT_TYPE_MAP, cryptoDecrypt, normalizeResponseData, responseStatusMap } from "./utils";

export function request({
  url,
  path,
  query = {},
  data = {},
  header = {},
  contentType = "json",
  method = "GET",
  withToken = true,
  showDialog = false
}: ServiceOptions) {
  let requestUrl = url ? url : import.meta.env.VITE_SERVICE_URL + path;
  // 添加 query 数据
  requestUrl = serializeUrl(requestUrl, query);
  // 添加 contentType
  header["content-type"] = CONTENT_TYPE_MAP[contentType];
  // 添加guid
  header["guid"] = getGlobalData("GUID") || "";
  // 添加 token
  if (withToken) {
    const tokenInfo = getStorage("tokenInfo");
    header["X-Access-Token"] = tokenInfo ? tokenInfo.token : "";
  }

  return new Promise<any>((resolve) => {
    uni.request({
      url: requestUrl,
      data: removeEmptyValues(data),
      header,
      method,
      success: (res) => {
        if (res.statusCode === 200) {
          const result = normalizeResponseData(
            isString(res.data) && !import.meta.env.VITE_ENV ? cryptoDecrypt(res.data) : res.data
          );
          logInfo(`@${requestUrl}`, data, result);
          if (result._status === responseStatusMap.FAIL) {
            if (showDialog) {
              // 错误时是否弹出提示
              showToast(result._msg);
            }
          }
          resolve(result);
        } else {
          resolve(
            normalizeResponseData({
              message: "请检查当前网络后重试",
              code: responseStatusMap.NOT_NETWOKE,
              result: "fail"
            })
          );
        }
      },
      fail: (err) => {
        resolve(
          normalizeResponseData({
            message: "服务器异常，请稍后重试",
            code: responseStatusMap.NOT_NETWOKE,
            result: "mainError"
          })
        );
      }
    });
  });
}
