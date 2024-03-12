import { createApp } from "vue"
import App from "@/App.vue"
const app = createApp(App)

//样式
import "@/assets/styles/index.scss"
import "nprogress/nprogress.css";
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createPinia } from "pinia"
app.use(createPinia())

import router from "@/router/index"
app.use(router)

//全局组件
import globalComponents from "./components/index"
app.use(globalComponents)
import "virtual:svg-icons-register"

//自定义指令
import customInstructions from './utils/customInstructions';
app.use(customInstructions)

app.mount("#app")
