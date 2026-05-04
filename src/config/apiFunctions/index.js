import axios from "axios";
import { LOCAL_STORAGE } from "../../app/constants";
import nProgress from "nprogress";
import i18n from "../../i18n";

let controller;
axios.interceptors.request.use((config) => {
  nProgress.start();
  return config;
});
axios.interceptors.response.use(
  (response) => {
    nProgress.done();
    return response;
  },
  (error) => {
    nProgress.done();
    return Promise.reject(error);
  }
);
export function getRequest(URL) {
  let payload = {},
    headers = {};
  return apiRequest(URL, payload, "get", headers);
}

export function postRequest(URL, payload, headers = {}) {
  return apiRequest(URL, payload, "post", headers);
}

export function putRequest(URL, payload, headers = {}) {
  return apiRequest(URL, payload, "put", headers);
}
export function patchRequest(URL, payload, headers = {}) {
  return apiRequest(URL, payload, "patch", headers);
}

export function deleteRequest(URL, payload, headers = {}) {
  return apiRequest(URL, payload, "delete", headers);
}

export function cancelRequest() {
  console.log(controller);
  if (controller) {
    controller.abort();
    controller = null;
  }
}


export async function apiRequest(endPoint, data, method = {}) {
  // if(controller !== undefined){
  //   cancelRequest();
  // }

  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
    const headers = {
      Accept: "application/json",
    };

    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }

    headers["Accept-Language"] = i18n.language || "en";

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    controller = new AbortController();
    const signal = controller.signal;

    axios({
      method: method,
      url: endPoint,
      headers: headers,
      data: data,
      signal: signal,
    })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
          localStorage.removeItem(LOCAL_STORAGE.PROFILE_PICTURE);
          localStorage.removeItem(LOCAL_STORAGE.USER);
          navigate(ROUTES.login);
        }
        if (axios.isCancel(error)) {
          return reject(new Error("Request canceled by user"));
        }
        return reject(error);
      });
  });
}
