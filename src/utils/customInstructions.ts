import type { App } from "vue";

export default {
  install(app: App) {
    const userStore = useUserStore();

    app.directive("authority", {
      mounted(el, binding) {
        if (
          binding.value &&
          !userStore.userData?.buttons?.includes(binding.value)
        ) {
          el.parentNode.removeChild(el);
        }
      },
    });
  },
};
