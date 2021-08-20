export interface Properties {
  lastModified: string;
  etag: string;
  leaseStatus: string;
  leaseState: string;
  hasImmutabilityPolicy: boolean;
  hasLegalHold: boolean;
  defaultEncryptionScope: string;
  preventEncryptionScopeOverride: boolean;
  ImmutableStorageWithVersioningEnabled: string;
}
export interface Container {
  name: string;
  properties: Properties;
}
