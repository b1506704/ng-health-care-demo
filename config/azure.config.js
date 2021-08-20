import { StorageSharedKeyCredential } from "@azure/storage-blob";
import * as dotenv from "dotenv";
dotenv.config();

const account = process.env.ACCOUNT_NAME || "";
const accountKey = process.env.ACCOUNT_KEY || "";

export const getAccountName = () => {
  return account;
};

export const getAccountKey = () => {
  return accountKey;
};

export const getCredential = () => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey
  );
  return sharedKeyCredential;
};
