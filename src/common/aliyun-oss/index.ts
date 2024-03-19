import { getRelativePath, getUrlParams, hasOwn, invalidQueryValues, isObject, serializeUrl } from "../utils";
import { base64url_encode } from "@/libs/aliyun/text_base64";

// 图片处理接口
export const serializeOSSImage = (filePath: string, optionsList: any = []) => {
  if (!filePath) {
    return "";
  }
  let queryString = "";
  for (let index = 0; index < optionsList.length; index++) {
    const options = optionsList[index];
    let ossString = "/" + (options.dispose || "resize");
    if (isObject(options)) {
      for (const key in options) {
        let value: string = options[key];
        if (~invalidQueryValues.indexOf(value + "")) {
          continue;
        }
        if (key === "text") {
          value = base64url_encode(value);
        }
        if (key !== "dispose") {
          ossString += `,${key}${value !== "" ? "_" + value : ""}`;
        }
      }
    } else {
      ossString += `,${options}`;
    }
    queryString += ossString;
  }
  const query = getUrlParams(filePath);
  const src = getRelativePath(filePath);
  if (hasOwn(query, "x-oss-process")) {
    query["x-oss-process"] = query["x-oss-process"] + queryString;
    filePath = serializeUrl(src, query);
  } else {
    if (!filePath.match(/\?/)) {
      filePath += "?";
    }
    filePath = filePath + "&x-oss-process=image" + queryString;
    filePath = filePath.replace(/\?&/, "?").replace(/\?$/, "");
  }
  return filePath;
};

// 获取图片信息
export const getOSSImageInfo = (filePath: string) => {
  return new Promise<OSSImageInfoResult["data"]>((resolve, reject) => {
    filePath = serializeOSSImage(filePath, [{ dispose: "info" }]);
    uni.request({
      url: filePath,
      success: (res) => {
        if (res.statusCode === 200) {
          const result = res.data as OSSImageInfoResult["data"];
          resolve(result);
        } else {
          reject();
        }
      },
      fail: () => {
        reject();
      }
    });
  });
};

// 获取图片主图颜色
export const getOSSImageColor = (filePath: string) => {
  return new Promise<string>((resolve) => {
    filePath = serializeOSSImage(filePath, [{ dispose: "average-hue" }]);
    uni.request({
      url: filePath,
      success: (res: any) => {
        if (res.statusCode === 200) {
          resolve(res.data.RGB.replace("0x", "#"));
        } else {
          resolve("");
        }
      },
      fail: () => {
        resolve("");
      }
    });
  });
};
