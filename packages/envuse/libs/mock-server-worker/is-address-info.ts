import { AddressInfo } from "net";

export const isAddressInfo = (val: any): val is AddressInfo =>
  typeof val === "object" && val !== null && "port" in val;
