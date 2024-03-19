declare interface OSSImageInfoResult {
  data: {
    FileSize: OSSImageInfoResultItem;
    Format: OSSImageInfoResultItem;
    FrameCount: OSSImageInfoResultItem;
    ImageHeight: OSSImageInfoResultItem;
    ImageWidth: OSSImageInfoResultItem;
    ResolutionUnit: OSSImageInfoResultItem;
    XResolution: OSSImageInfoResultItem;
    YResolution: OSSImageInfoResultItem;
  };
}
declare interface OSSImageInfoResultItem {
  value: string;
}
