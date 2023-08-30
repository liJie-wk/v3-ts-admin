
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import type { App } from "vue";

const globalComponents = Object.assign({ },ElementPlusIconsVue);

export default {
  install(app: App) {
    Object.entries(globalComponents).forEach(([k, v]) => {
      app.component(k, v);
    });
  },
};
