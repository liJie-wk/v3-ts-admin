import { reqLogin, reqUserInfo, reqLogout } from "@/api/user/index";

import type { loginFormData, checkUser } from "@/api/user/type";

import { verifyPermissionsRoutes } from "@/router";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: useStorage<string | null>("TOKEN", null),
      userData: <checkUser | undefined>undefined,
    };
  },
  getters: {},
  actions: {
    async userLogin(data: loginFormData) {
      let res = await reqLogin(data);
      if (res.code === 200 && res.data) {
        this.token = res.data;
        this.userInfo();
      }
      return { code: res.code, msg: res.message };
    },
     userInfo() {
      if (!this.token) return;
      return new Promise(async(resolve, reject) => {
        let res = await reqUserInfo();
        if (res.code === 200 && res.data) {
          this.userData = res.data;
          this.routesDisabled(verifyPermissionsRoutes.value);
          resolve({code:200})
        } else {
          this.clearUserData();
          resolve({code:404})

        }
      });

    },
    clearUserData() {
      reqLogout();
      this.userData = undefined;
      this.token = null;
    },
    routesDisabled(routes: any[]) {
      routes.forEach((currentItem) => {
        currentItem.meta.isDisabled = !this.userData?.routes.includes(
          currentItem.name
        );

        if (currentItem.children && currentItem.children.length > 0) {
          this.routesDisabled(currentItem.children);
        }
      });
    },
  },
});

const windowSize = useWindowSize();
const styleTag = useStyleTag("");
const rootPrimaryColor = useCssVar(
  "--el-color-primary",
  document.documentElement
);
const isCollapse = useStorage("isCollapse", false);
const toggleCollapse = useToggle(isCollapse);

export const useSetStore = defineStore("set", {
  state: () => {
    return {
      isCollapse: isCollapse, //是否收起
      document: {
        clientWidth: windowSize.width,
        clientHeight: windowSize.height,
        themeColor: useStorage<string | null>("themeColor", null),
        defaultThemeColor: "#409eff",
      },
    };
  },
  actions: {
    changeCollapse() {
      toggleCollapse();
    },
    setThemeColor(value: string | null) {
      this.document.themeColor = value;
      if (value) {
        let maxDarkColor = adjustBrightness(value, -30),
          darkColor = adjustBrightness(value, -20),
          lightColor = adjustBrightness(value, 20);
        styleTag.css.value = `
            .el-button--primary.el-button:focus,
            .el-button--primary.el-button:hover {background-color:${darkColor};border-color:${darkColor};}
            .el-button--primary.is-disabled,
            .el-button--primary.is-disabled:focus,
            .el-button--primary.is-disabled:hover {background-color:${maxDarkColor} !important;border-color:${maxDarkColor}!important;}
            .el-button--primary.el-button:active {background-color:${lightColor};border-color:${lightColor};}
          `;
        rootPrimaryColor.value = value;
      } else {
        styleTag.unload();
        rootPrimaryColor.value = this.document.defaultThemeColor;
      }
    },
  },
});
