<template>
  <div>
    <el-table
      v-loading="tableLoading"
      :data="permissionList"
      :expand-row-keys="['1']"
      border
      row-key="id">
      <el-table-column label="名称" prop="name" />
      <el-table-column label="权限值" prop="code" />
      <el-table-column label="修改时间" prop="createTime" />
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button
            type="primary"
            size="default"
            v-authority="'btn.Permission.add'"
            @click="refAddOrEdit.changeShow(true, row)"
            :disabled="row.level === 4">
            {{ row.level === 3 ? "添加功能" : "添加菜单" }}
          </el-button>
          <el-button
            type="warning"
            size="default"
            v-authority="'btn.Permission.update'"
            :disabled="row.level === 1"
            @click="refAddOrEdit.changeShow(true, row, 'edit')">
            编辑
          </el-button>
          <el-popconfirm
            width="200"
            title="你确定要删除这个吗？"
            @confirm="rmPermission(row.id)">
            <template #reference>
              <el-button
                v-authority="'btn.Permission.remove'"
                type="danger"
                size="default"
                :disabled="row.level === 1"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <AddOrEdit ref="refAddOrEdit" @refresh="getPermissionList"></AddOrEdit>
  </div>
</template>

<script setup lang="ts">
import { reqGetPermissionList, reqRmPermission } from "@/api/user";
import type { ItemRoleAssignPermission } from "@/api/user/type";

import AddOrEdit from "./components/AddOrEdit.vue";

const permissionList = ref(<ItemRoleAssignPermission[]>[]);
const tableLoading = ref(false);
const getPermissionList = async () => {
  tableLoading.value = true;
  let result = await reqGetPermissionList();
  if (result.code === 200 && result.data) {
    permissionList.value = result.data;
  } else {
    permissionList.value = [];
    ElMessage.error("获取数据失败");
  }
  tableLoading.value = false;
};

const refAddOrEdit = ref();

const rmPermission = async (id: number) => {
  let res = await reqRmPermission(id);
  if (res.code === 200) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  getPermissionList();
};

onMounted(() => {
  getPermissionList();
});
</script>

<style scoped lang="scss"></style>
