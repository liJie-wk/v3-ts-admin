<template>
  <el-drawer title="主题设置" v-model="show">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          :model-value="nowColor"
          @change="changeColor"
          :predefine="predefineColors"
          size="large" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch :model-value="isDark" @change="toggleDark()" size="large" />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
const setStore = useSetStore();
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);
const show = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val: boolean) => {
    emit("update:modelValue", val);
  },
});

//主题颜色
type ColorType = string | null;
const color = ref(<ColorType>null);
const nowColor = computed(() => {
  if (color.value) {
    return color.value;
  } else if (setStore.document.themeColor) {
    return setStore.document.themeColor;
  } else {
    return setStore.document.defaultThemeColor;
  }
});
const predefineColors = ref([
  "#409eff",
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#c71585",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
]);
const changeColor = (value: ColorType) => {
  color.value = value;
  setStore.setThemeColor(value);
  show.value = false
};

//暗黑模式
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style scoped lang="scss"></style>
