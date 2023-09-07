import vue from "@vitejs/plugin-vue";
import { ConfigEnv, UserConfigExport, loadEnv } from "vite";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: "./",
    server: {
      proxy: {
        // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_DOMAIN,
          changeOrigin: true,
          rewrite(path) {
            return path.replace(/^\/(dev_api|prod_api)/, "");
          },
        },
      },
    },
    plugins: [
      vue(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        imports: [
          "vue",
          "@vueuse/core",
          "vue-router",
          "pinia",
          {
            "@/store": ["useSetStore", "useUserStore"],
            "@/utils/publicMethod": [
              "objectFilter",
              "adjustBrightness",
              "fileUploadAction",
              "beforeAvatarUpload",
              "fileUploadAction",
              "AppTitle",
              "compatibleHttpImg",
            ],
          },
        ],
        vueTemplate: true,
        resolvers: [ElementPlusResolver()],
        dts: "src/auto-imports.d.ts",
      }),
      Components({
        dts: "src/components.d.ts",
        dirs: ["src/components/"],
        extensions: ["vue"],// 配置需要将哪些后缀类型的文件进行自动按需引入
        resolvers: [ElementPlusResolver()],
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/images/svg")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]",
      }),
      VitePWA(),
      viteCompression({
        threshold: 10240, // the unit is Bytes
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/assets/styles/variable.scss";',
        },
      },
    },
  };
};
