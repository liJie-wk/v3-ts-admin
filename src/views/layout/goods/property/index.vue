<template>
  <div class="property">
    <CategoryList
      :disabled="switchCard"
      @select-id="getSelectId"
      class="common-bottom-margin"></CategoryList>
    <el-card>
      <div v-show="!switchCard">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!selectId"
          class="common-bottom-margin"
          @click="openEditProp()"
          v-authority="'btn.Attr.add'"

          >添加属性</el-button
        >
        <el-table max-height="620" v-loading="loading" :data="attrInfo" border stripe>
          <el-table-column
            type="index"
            width="80"
            label="序号"
            align="center" />
          <el-table-column label="属性名" prop="attrName"></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row }">
              <el-tag
                style="margin: 5px"
                type="success"
                v-for="item in row.attrValueList"
                :keu="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row }">
              <el-button
                type="warning"
                size="default"
                v-authority="'btn.Attr.update'"
                :disabled="row.level === 1"
                icon="Edit"
                title="编辑"
                @click="openEditProp(row)">
              </el-button>
              <el-popconfirm
                width="200"
                title="你确定要删除这个吗？"
                @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button
                    v-authority="'btn.Attr.remove'"
                    type="danger"
                    size="default"
                    :disabled="row.level === 1"
                    icon="Delete"
                    title="删除"
                    ></el-button
                  >
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <edit-prop
      ref="refEditProp"
      :attrInfo="attrInfo"
      @refresh-switch-card="(bol:boolean) => switchCard = bol"
      @refresh-list="getAttrInfoList"></edit-prop>
    </el-card>
  </div>
</template>

<script lang="ts">
import { reqAttrInfoList, reqDeleteAttr } from "@/api/goods";
import type { AttrInfoList } from "@/api/goods/type";
import CategoryList from '../components/CategoryList.vue';
import EditProp from "./components/EditProp.vue";

type RefEditProp = InstanceType<typeof EditProp>;

interface AllDataType {
  selectId: number;
  selectIdList: [number, number, number];
  attrInfo: AttrInfoList[];
  switchCard: boolean;
  loading: boolean;
}
export default {
  data(): AllDataType {
    return {
      selectId: 0,
      selectIdList: [0, 0, 0],
      attrInfo: [],
      switchCard: false,
      loading:false
    };
  },
  methods: {
    getSelectId(arr: [number, number, number]) {
      this.selectIdList = arr;
      this.selectId = arr[arr.length - 1];
      if (this.selectId) {
        this.getAttrInfoList();
      } else {
        this.attrInfo = [];
      }
    },
    async getAttrInfoList() {
      this.loading = true
      let res = await reqAttrInfoList(...this.selectIdList);
      if (res.code === 200 && res.data) {
        this.attrInfo = res.data;
      } else {
        this.attrInfo = []
      }
      this.loading = false
    },
    openEditProp(row?: AttrInfoList) {
      return (this.$refs.refEditProp as RefEditProp).changeSwitchCard({
        show: true,
        row,
        categoryId: this.selectId,
      });
    },
    async deleteAttr(id:number) {
      let res = await reqDeleteAttr(id)
      if(res.code === 200) {
        ElMessage.success('删除成功')
      } else {
        ElMessage.error('删除失败')
      }
      this.getAttrInfoList()
    }
  },
  components: {
    EditProp,
    CategoryList
  },
};
</script>

<style scoped lang="scss">

</style>
