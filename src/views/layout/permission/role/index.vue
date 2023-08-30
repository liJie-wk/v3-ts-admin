<template>
  <div class="">
    <el-card class="common-bottom-margin">
      <SearchTable
        v-model="roleData.searchStr"
        label="职位名称"
        placeholder="请输入职位名称"
        @refresh="getRoles"></SearchTable>
    </el-card>
    <el-card>
      <template #header>
        <div>
          <el-button
            type="primary"
            :disabled="!!roleData.searchStr"
            icon="Plus"
            v-authority="'btn.Role.add'"
            @click="refAddOrEdit.changeShow(true)"
            >添加职位</el-button
          >
        </div>
      </template>
      <el-table
        class="common-bottom-margin"
        v-loading="roleData.tableLoading"
        :data="roleData.list"
        :max-height="setStore.document.clientHeight - 380"
        border
        :row-class-name="data => isSlect(data.row)?'warning-row':''">
        <el-table-column align="center" type="index" width="50" label="#" />
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="职位名称"
          prop="roleName"></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"></el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          prop="updateTime"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #="{ row }">
            <el-form
              :disabled="isSlect(row)">
              <el-button
                type="primary"
                size="default"
                v-authority="'btn.Role.assgin'"
                @click="refAssignPermissions.changeShow(true, row.id)"
                title="分配权限"
                icon="User"></el-button>
                <el-button
                type="warning"
                size="default"
                v-authority="'btn.Role.update'"
                :disabled="row.level === 1"
                icon="Edit"
                title="编辑"
                @click="refAddOrEdit.changeShow(true, row)">
              </el-button>
              <el-popconfirm
                width="200"
                title="你确定要删除这个吗？"
                @confirm="rmRoles([row.id])">
                <template #reference>
                  <el-button
                    v-authority="'btn.Role.remove'"
                    type="danger"
                    size="default"
                    :disabled="row.level === 1"
                    icon="Delete"
                    title="删除"
                    ></el-button
                  >
                </template>
              </el-popconfirm>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="roleData.total"
        :page-size="PageSize"
        @update:currentChange="getRoles" :currentChange="roleData.currentPage"></Pagination>
    </el-card>
    <AddOrEdit ref="refAddOrEdit" @refresh="refreshRoles"></AddOrEdit>
    <AssignPermissions ref="refAssignPermissions"></AssignPermissions>
  </div>
</template>

<script setup lang="ts">
import SearchTable from "../components/SearchTable.vue";
import AddOrEdit from "./components/AddOrEdit.vue";
import AssignPermissions from "./components/AssignPermissions.vue";
import { reqGetRoles,reqRoleBatchRemove } from "@/api/user";
import type { AssignRole } from "@/api/user/type";

//不需要响应式
const PageSize = 10;

const userStore = useUserStore();
const setStore = useSetStore()
const refAddOrEdit = ref();
const refAssignPermissions = ref();

const roleData = reactive({
  searchStr: "",
  total: 0,
  list: <AssignRole[]>[],
  tableLoading: false,
  currentPage:1
});

const getRoles = async (page = 1) => {
  roleData.tableLoading = true;
  roleData.currentPage = page;
  let res = await reqGetRoles(page, PageSize, roleData.searchStr);
  if (res.code === 200 && res.data) {
    if (res.data.records) roleData.list = res.data.records;
    roleData.total = res.data.total;
  } else {
    ElMessage.error("获取数据失败");
    roleData.list = [];
    roleData.total = 0;
  }
  roleData.tableLoading = false;
};

type refreshRolesParams = {
  type: "update" | "save";
  data?: AssignRole;
};
const refreshRoles = (params: refreshRolesParams) => {
  switch (params.type) {
    case "update":
      if (params.data) {
        let item = roleData.list.find((item) => item.id === params.data?.id);
        if (item) item.roleName = params.data.roleName;
      }
      break;
    case "save":
      getRoles();
      break;

    default:
      break;
  }
};

//删除
const rmRoles = async (ids:number[]) => {
  let res = await reqRoleBatchRemove(ids)
  if(res.code === 200) {
    ElMessage.success('删除成功')
    if(roleData.currentPage === 1 || (roleData.list.length - ids.length) > 0) {
      getRoles(roleData.currentPage)
    } else {
      getRoles()
    }
  } else {
    ElMessage.error('删除失败')
  }
}

const isSlect = (params:AssignRole) => {
  return userStore.userData?.roles.includes(params.roleName)
}
onMounted(() => {
  getRoles();
});
</script>

<style scoped lang="scss"></style>
