<template>
  <div v-show="switchCard">
    <el-form
      :inline="true"
      @submit.native.prevent
      :disabled="
        itemAttrInfo.id ? true : itemAttrInfo.attrValueList.length !== 0
      ">
      <el-form-item label="属性名">
        <el-input
          v-model.trim="itemAttrInfo.attrName"
          placeholder="请输入属性名"
          ref="addPropInput"
          @keyup.enter.native="addOrEditProp"></el-input>
      </el-form-item>
    </el-form>
    <div class="common-bottom-margin">
      <el-button
        type="primary"
        icon="Plus"
        :disabled="!itemAttrInfo.attrName"
        @click="addOrEditProp"
        >添加属性</el-button
      >
      <el-button @click="cancelProp" v-if="!itemAttrInfo.id">取消</el-button>
    </div>
    <el-table
      class="common-bottom-margin"
      :data="itemAttrInfo.attrValueList"
      border
      stripe>
      <el-table-column type="index" width="80" label="序号" />
      <el-table-column label="属性值">
        <template #="{ row, $index }">
          <div v-show="row.flag">
            <el-input
              :minlength="1"
              v-model.trim="row.valueName"
              placeholder="请输入属性值"
              :ref="el => row.refEl = el"
              @keyup.enter.native="row.refEl.blur()"
              @blur="editPropDataBlur($index)"></el-input>
          </div>
          <div
            v-show="!row.flag"
            @click="changeItemAttrValueFlag($index, true)">
            {{ row.valueName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="属性值操作">
        <template #="{ $index }">
          <el-button
            icon="Delete"
            type="danger"
            @click="delItemAttrValue($index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      type="primary"
      :disabled="saveDisabled"
      @click="updateOrSaveAttrInfo"
      >保存</el-button
    >
    <el-button type="default" @click="changeSwitchCard({ show: false })"
      >关闭</el-button
    >
  </div>
</template>

<script lang="ts">
import { reqUpdateOrSaveAttrInfo } from "@/api/goods";
import type {  AttrInfoList,AttrValueList } from "@/api/goods/type";
interface AllDataType {
  switchCard: boolean;
  itemAttrInfo: AttrInfoList;
}
export default {
  props: {
    attrInfo: {
      type: Array,
      required: true,
    },
  },
  data(): AllDataType {
    return {
      switchCard: false,
      itemAttrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  computed: {
    saveDisabled() {
      return (
        this.itemAttrInfo.attrValueList.length === 0 ||
        this.itemAttrInfo.attrValueList.some(
          (item) => item.valueName === "" || item.flag
        )
      );
    },
  },
  methods: {
    changeSwitchCard(obj: {
      show: boolean;
      row?: AttrInfoList;
      categoryId?: number;
    }) {
      if (obj.show) {
        if (obj.categoryId) this.itemAttrInfo.categoryId = obj.categoryId;
        if (obj.row) {
          const { attrName, attrValueList, categoryId, categoryLevel, id } =
            obj.row;
          this.itemAttrInfo = {
            attrName,
            attrValueList: JSON.parse(JSON.stringify(attrValueList)),
            categoryId,
            categoryLevel,
            id,
          };
        } else {
          this.$nextTick(() => {
            (this.$refs.addPropInput as HTMLElement).focus();
          });
        }
      } else {
        this.itemAttrInfo = {
          attrName: "",
          attrValueList: [],
          categoryId: 0,
          categoryLevel: 3,
        };
      }
      this.switchCard = obj.show;
      this.$emit("refreshSwitchCard", obj.show);
    },
    addOrEditProp() {
      if (!this.itemAttrInfo.attrName) return;
      if (this.itemAttrInfo.id) {
      } else {
        if (
          (this.attrInfo as AttrInfoList[]).some(
            (item) => item.attrName === this.itemAttrInfo.attrName
          )
        ) {
          this.itemAttrInfo.attrName = "";
          return ElMessage.error("该属性名已存在");
        }
      }

      let length = this.itemAttrInfo.attrValueList.push({
        valueName: "",
        flag: false,
      });
      this.changeItemAttrValueFlag(length - 1, true);
    },
    changeItemAttrValueFlag(ind: number, bol: boolean) {
      this.itemAttrInfo.attrValueList[ind].flag = bol;
      if (bol) {
        nextTick(() => {
          this.itemAttrInfo.attrValueList[ind].refEl?.focus();
        });
      } else {
      }
    },
    editPropDataBlur(ind: number) {
      let valueName = this.itemAttrInfo.attrValueList[ind].valueName;
      if (valueName) {
        if (
          this.itemAttrInfo.attrValueList.some(
            (item, index) => item.valueName === valueName && index !== ind
          )
        ) {
          this.delItemAttrValue(ind);
          ElMessage.error("该属性值已存在");
        } else {
          this.changeItemAttrValueFlag(ind, false);
        }
      } else {
        this.delItemAttrValue(ind);
        ElMessage.error("请输入属性值");
      }
    },
    delItemAttrValue(ind: number) {
      this.itemAttrInfo.attrValueList.splice(ind, 1);
    },
    cancelProp() {
      this.itemAttrInfo.attrName = "";
      this.itemAttrInfo.attrValueList = [];
    },
    async updateOrSaveAttrInfo() {
      //要去除无用数据
      const arr: AttrValueList[] = this.itemAttrInfo.attrValueList.map((item) => {
        if (this.itemAttrInfo.id) {
          return {
            valueName: item.valueName,
            attrId: item.attrId,
            id: item.id,
          };
        } else {
          return { valueName: item.valueName };
        }
      });
      //这里不是直接对原对象的attrValueList赋值新的，是因为直接赋值会导致上面的数组刷新
      let obj = objectFilter([], this.itemAttrInfo);
      obj.attrValueList = arr;

      let res = await reqUpdateOrSaveAttrInfo(<AttrInfoList>obj);
      if (res.code === 200) {
        ElMessage.success("保存成功");
      } else {
        ElMessage.error("保存失败");
      }
      this.changeSwitchCard({ show: false });
      this.$emit("refreshList");
    },
  },
};
</script>

<style scoped lang="scss"></style>
