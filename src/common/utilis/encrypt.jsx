export const encodeId = (id) => btoa(id.toString());       // encode
export const decodeId = (encoded) => atob(encoded);        