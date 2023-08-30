export const objectFilter = (
  blackList: string[],
  obj: any,
  flag = false
): any => {
  //浅拷贝，返回新的对象,flag为true时，黑名单转为白名单
  const arr = Object.entries(obj).filter(([key, val]) => {
    let bol = blackList.some((item) => item === key);
    return flag ? bol : !bol;
  });
  return Object.fromEntries(arr);
};

/**
 * // Lighten
const NewColor = LightenDarkenColor("#F06D06", 20); 

// Darken
const NewColor = LightenDarkenColor("#F06D06", -20); 
 * @desc 将一个颜色加深或减淡
 */
export function adjustBrightness(col: string, amt: number) {
  const num = parseInt(col.charAt(0) === "#" ? col.slice(1) : col, 16);

  const clamp = (val: number) => (val < 0 ? 0 : val > 255 ? 255 : val);

  return (
    (col.charAt(0) === "#" ? "#" : "") +
    [0, 8, 16]
      .map((shift) => clamp(((num >> shift) & 0xff) + amt) << shift)
      .reduce((a, c) => a + c, 0)
      .toString(16)
      .padStart(6, "0")
  );
}

//上传图片校验
import type { UploadProps } from "element-plus";
export const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (!/image/.test(rawFile.type)) {
    ElMessage.error("请选择图片!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error("文件大小不能超过4MB!");
    return false;
  }
  return true;
};

export const compatibleHttpImg = (url:string) => {
  if(/^http:\/\//.test(url)) {
    return url.replace('http:','')
  } else {
    return url
  }
};


//常量
export const fileUploadAction =
  import.meta.env.VITE_APP_BASE_API + "/admin/product/fileUpload";

export const AppTitle = import.meta.env.VITE_APP_TITLE;
