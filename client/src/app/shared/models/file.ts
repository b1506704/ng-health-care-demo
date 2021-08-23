export interface Properties {
  createdOn: string;
  lastModified: string;
  etag: string;
  contentLength: number;
  contentType: string;
  contentEncoding: string;
  contentLanguage: string;
  contentMD5: ContentMD5;
  contentDisposition: string;
  cacheControl: string;
  blobType: string;
  leaseStatus: string;
  leaseState: string;
  serverEncrypted: boolean;
  accessTier: string;
  accessTierInferred: boolean;
  'Content-CRC64': string;
}

export interface ContentMD5 {
  type: string;
  data: string;
}

export interface CustomMetaData {
  sourceID: string;
  category: string;
  title: string;
}

export interface File {  
  url: string;
  name: string;
  properties: Properties;
  metadata: CustomMetaData;
}
