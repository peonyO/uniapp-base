import { isArray, isString } from "../utils";

/**
 * 消息提示框
 * @param options 同 uni.showToast ，外加 string 类型，mask 默认 true
 */
const showToast = (options: UniApp.ShowToastOptions | string) => {
  if (isString(options)) {
    options = { title: options };
  }
  options = {
    icon: "none",
    mask: true,
    ...options
  };
  /**
   * 这个地方延时为了避免 uni.hideLoading 和 uni.showToast 同时使用时，把 showToast 给删除掉Bug
   */
  setTimeout(() => {
    uni.showToast(options as UniApp.ShowToastOptions);
  }, 50);
};

/**
 * 模态框
 * @param options 同 uni.showModal
 */
const showModal = (options: UniApp.ShowModalOptions) => {
  const { success, fail } = options;
  options = {
    title: "提示",
    ...options,
    success: (res) => {
      if (res.confirm) {
        success && success(res);
      }
      if (res.cancel) {
        fail && fail(res);
      }
    },
    fail: (err) => {
      fail && fail(err);
    }
  };
  uni.showModal(options);
};

/**
 * loading 框
 * @param options 同 uni.showLoading title 默认值为 “请稍后...” mask 默认为 true
 */
const showLoading = (options?: UniApp.ShowLoadingOptions | string) => {
  if (isString(options)) {
    options = {
      title: options
    };
  }
  options = {
    title: "请稍后...",
    mask: true,
    ...options
  };

  uni.showLoading(options);
};

const showActionSheet = <T extends string[] | Record<string, any>[]>(options: ShowActionSheetOptions<T>) => {
  uni.showActionSheet({
    alertText: "请选择",
    ...options,
    itemList: options.itemList.map((item) => {
      if (isString(item)) {
        return item;
      } else {
        // @ts-ignore
        return item[options.keyName];
      }
    }),
    success: (result) => {
      const selectIndex = result.tapIndex;
      const info = options.itemList[selectIndex];
      options.success &&
        options.success({
          // @ts-ignore
          info,
          index: selectIndex
        });
    }
  });
};

/**
 * 预览图片
 */
const previewImage = (imageSrc: string | string[], current = 0) => {
  uni.previewImage({
    urls: isArray(imageSrc) ? imageSrc : [imageSrc],
    current,
    indicator: "number"
  });
};

export { showToast, showModal, showLoading, showActionSheet, previewImage };
