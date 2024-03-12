<template>
  <el-card>
    <el-form :inline="true" :disabled="prop.disabled">
      <el-form-item
        v-for="(item, index) in categoryList"
        :key="item.name"
        :label="item.name">
        <el-select
          :disabled="item.data.length === 0"
          v-model="item.select"
          placeholder="请选择"
          @change="
            index + 1 === categoryList.length
              ? lastItemChange()
              : getGoodsCategory(categoryList[index + 1].name)
          ">
          <el-option
            v-for="ite in item.data"
            :key="ite.name"
            :label="ite.name"
            :value="ite.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reqGoodsCategory } from "@/api/goods";
import type { CategoryListItemData } from "@/api/goods/type";
interface CategoryItem {
    name:string,
    select:string|number,
    data:CategoryListItemData[]
}
const emit = defineEmits(["selectId"]);
const prop = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
const categoryList = ref(<CategoryItem[]>[
  { name: "一级分类", data: [], select: "" },
  { name: "二级分类", data: [], select: "" },
  { name: "三级分类", data: [], select: "" },
]);
const getGoodsCategory = async (name: string) => {
  let res;
  const index = categoryList.value.findIndex((item) => item.name == name);
  if (index === -1) return;
  //选中前一个时要把后面的数据清了
  categoryList.value.forEach((item, ind) => {
    if (ind >= index) {
      item.data = []
      item.select = ''
    }
    if (ind === categoryList.value.length - 1) {
      lastItemChange();
    }
  });
  if (name === "一级分类") {
    res = await reqGoodsCategory();
  } else {
    res = await reqGoodsCategory(
      name,
      categoryList.value[index - 1].select
    );
  }

  if (res?.code === 200 && res.data) {
    categoryList.value[index].data = res.data
  }
};

//第三个数据变了的时候要调用此方法
const lastItemChange = () => {
  let arr = categoryList.value.map((item) => item.select);
  emit("selectId", arr);
};

onMounted(() => {
  if (categoryList.value[0].data.length === 0) {
    getGoodsCategory("一级分类");
  } else {
    lastItemChange();
  }
});
</script>
