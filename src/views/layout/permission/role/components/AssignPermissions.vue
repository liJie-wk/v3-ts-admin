<template>
  <el-drawer title="分配可操作的功能权限" v-model="show" size="30%">
    <el-tree
      v-loading="tableLoading"
      ref="refElT"
      :data="roleAPData"
      show-checkbox
      node-key="id"
      :default-checked-keys="checkedKeys"
      :props="defaultProps" />
    <template #footer>
      <el-button size="default" @click="changeShow(false)">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { reqRoleAssignPermission, reqDoAssignPermission } from "@/api/user";
import type { ItemRoleAssignPermission } from "@/api/user/type";

//选择树相关
const defaultProps = {
  children: "children",
  label: "name",
};
const refElT = ref();
const tableLoading = ref(false);
const roleAPData = ref(<ItemRoleAssignPermission[]>[]);
const checkedKeys = ref(<number[]>[]);
const getSelectedIds = (
  params: ItemRoleAssignPermission[],
  initialValue: number[] = []
) => {
  return params.reduce((pre, now) => {
    if (now.select) {
      if (now.children && now.children.length > 0) {
        getSelectedIds(now.children, pre);
      } else {
        pre.push(now.id);
      }
    }

    return pre;
  }, initialValue);
};

const show = ref(false);
const roleId = ref(0);
const changeShow = (flag: boolean, id?: number) => {
  if (flag && id) {
    tableLoading.value = true;
    roleId.value = id;
    reqRoleAssignPermission(id).then((result) => {
      if (result.code === 200 && result.data) {
        roleAPData.value = result.data;
        checkedKeys.value = getSelectedIds(result.data);
      }
      tableLoading.value = false;
    });
  } else {
    roleAPData.value = [];
    checkedKeys.value = [];
  }
  show.value = flag;
};

const save = async () => {
  let res = await reqDoAssignPermission(roleId.value, [
    ...refElT.value.getCheckedKeys(),
    ...refElT.value.getHalfCheckedKeys(),
  ]);
  if (res.code === 200) {
    ElMessage.success("保存成功");
    changeShow(false);
  } else {
    ElMessage.error("保存失败");
  }
};
defineExpose({ changeShow });
</script>

<style scoped lang="scss"></style>
