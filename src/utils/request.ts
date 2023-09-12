import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/index";
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
});
let userStore:any = null

request.interceptors.request.use((config) => {
  if(userStore === null) userStore = useUserStore();
  if (userStore.token) config.headers.token = userStore.token;
  return config;
});
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    //处理网络错误
    let msg = "";
    let status = error.response?.status || error.code;
    switch (status) {
      case 401:
        msg = "token过期";
        break;
      case 403:
        msg = "无权访问";
        break;
      case 404:
        msg = "请求地址错误";
        break;
      case 500:
        msg = "服务器出现问题";
        break;
      case "ECONNABORTED":
        msg = "请求超时";
        break;
      default:
        msg = "无网络";
        break;
    }
    ElMessage({
      type: "error",
      message: msg,
    });
    return { code: status, message: msg };
  }
);
export default request;
