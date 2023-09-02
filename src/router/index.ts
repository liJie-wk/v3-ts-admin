import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import NotFoundComponent from '@/views/404/index.vue';
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import NProgress from "nprogress";

//需要验证权限的路由, 需要响应式变化，所以用ref
export const verifyPermissionsRoutes = ref(<RouteRecordRaw[]>[
  {
    path: "/permission",
    name: "Acl",
    redirect: { name: "User" },
    meta: {
      title: "权限管理",
      icon: "Lock",
      isDisabled: false,
    },
    children: [
      {
        path: "users",
        name: "User",
        component: () => import("@/views/layout/permission/users/index.vue"),
        meta: {
          title: "用户管理",
          icon: "User",
        },
      },
      {
        path: "role",
        name: "Role",
        component: () => import("@/views/layout/permission/role/index.vue"),
        meta: {
          title: "角色管理",
          icon: "UserFilled",
        },
      },
      {
        path: "menu",
        name: "Permission",
        component: () => import("@/views/layout/permission/menu/index.vue"),
        meta: {
          title: "菜单管理",
          icon: "Menu",
        },
      },
    ],
  },
  {
    path: "/goods",
    name: "Product",
    redirect: { name: "Trademark" },
    meta: {
      title: "商品管理",
      icon: "ShoppingBag",
    },
    children: [
      {
        path: "brand",
        name: "Trademark",
        component: () => import("@/views/layout/goods/brand/index.vue"),
        meta: {
          title: "品牌管理",
          icon: "ShoppingCartFull",
        },
      },
      {
        path: "property",
        name: "Attr",
        component: () => import("@/views/layout/goods/property/index.vue"),
        meta: {
          title: "属性管理",
          icon: "UserFilled",
        },
      },
      {
        path: "spu",
        name: "Spu",
        component: () => import("@/views/layout/goods/spu/index.vue"),
        meta: {
          title: "SPU管理",
          icon: "Menu",
        },
      },
      {
        path: "sku",
        name: "Sku",
        component: () => import("@/views/layout/goods/sku/index.vue"),
        meta: {
          title: "SKU管理",
          icon: "Menu",
        },
      },
    ],
  },
]);

//静态侧栏列表
export const appSliderList: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/layout/home/index.vue"),
    meta: {
      title: "首页",
      icon: "HomeFilled",
    },
  },
  ...verifyPermissionsRoutes.value,
];

//一级路由，但需要显示在侧栏里
export const screen: RouteRecordRaw = {
  path: "/screen",
  name: "screen",
  component: () => import("@/views/screen/index.vue"),
  meta: {
    title: "数据大屏",
    icon: "Platform",
  },
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "layout",
      redirect: { name: "home" },
      component: () => import("@/views/layout/index.vue"),
      children: appSliderList,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
    },
    screen,
    {
      path: "/:pathMatch(.*)",
      name: "404",
      component: NotFoundComponent 
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      //前进或后退会触发，像原生浏览器的行为
      return savedPosition;
    } else {
      //切换路由会触发
      return { top: 100, behavior: "smooth" };
    }
  },
});

router.beforeEach(async (to: any, from: any) => {
  const userStore = useUserStore();
  NProgress.start();
  //这里应该还要判断token是否过期
  if (userStore.token) {
    if (userStore.userData) {
      if (to.name === "login" || to.meta.isDisabled) {
        return { name: from.name, replace: true };
      }
    } else if (to.name !== "404") {
      await userStore.userInfo();
      return { name: to.name, replace: true };
    }
  } else {
    if (to.name !== "login") {
      return { name: "login", replace: true };
    }
  }
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
