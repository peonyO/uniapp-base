declare type ArrayItemType<T> = T extends (infer U)[] ? U : never;
declare type MyValue<T, U extends keyof T> = T[U];
declare type PageStatus = "success" | "loading" | "error" | "serviceError" | "empty";
declare type ImageMode =
  | "scaleToFill"
  | "aspectFit"
  | "aspectFill"
  | "widthFix"
  | "heightFix"
  | "top"
  | "bottom"
  | "center"
  | "left"
  | "right"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right";
