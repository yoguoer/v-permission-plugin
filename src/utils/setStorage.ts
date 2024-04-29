import type { StorageOptionsType } from "@/types/token";

const storageOptions: StorageOptionsType = {
    type: "cookie",
    expires: undefined
};
export function setStorage(options: StorageOptionsType) {
    const { type, expires } = options
    if (type) storageOptions.type = type
    if (expires) storageOptions.expires = expires
}
export default storageOptions;