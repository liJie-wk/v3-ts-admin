<template>
  <div class="">
    <el-card class="common-bottom-margin">
      <SearchTable
        v-model="usersData.searchUsername"
        @refresh="getUsers"></SearchTable>
    </el-card>
    <el-card>
      <template #header>
        <div>
          <el-button
            type="primary"
            :disabled="!!usersData.searchUsername"
            @click="openAddOrEdit()"
            v-authority="'btn.User.add'"
            >添加</el-button
          >
          <el-popconfirm
            width="200"
            title="你确定要批量删除吗？"
            @confirm="batchDeletion">
            <template #reference>
              <el-button
                type="danger"
                v-authority="'btn.User.remove'"
                :disabled="usersData.selectList.length === 0"
                >批量删除</el-button
              >
            </template>
          </el-popconfirm>
        </div>
      </template>
      <el-table
        class="common-bottom-margin"
        :row-class-name="(data) => (isSlect(data.row) ? '' : 'warning-row')"
        v-loading="usersData.tableLoading"
        @selection-change="usersData.selectList = $event"
        :data="usersData.list"
        border>
        <el-table-column
          align="center"
          type="selection"
          :selectable="isSlect"></el-table-column>

        <el-table-column align="center" type="index" width="50" label="#" />
        <el-table-column align="center" label="id" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="用户名字"
          prop="username"></el-table-column>
        <el-table-column
          align="center"
          label="用户名称"
          prop="name"></el-table-column>
        <el-table-column
          align="center"
          label="用户角色"
          prop="roleName"></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"></el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          prop="updateTime"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template #="{ row }">
            <el-form :disabled="!isSlect(row)">
              <el-button
                type="primary"
                size="default"
                @click="refAssignRoles.changeShow(true, row)"
                title="分配角色"
                icon="User"
                v-authority="'btn.User.assgin'"></el-button>
              <el-button
                type="warning"
                size="default"
                v-authority="'btn.User.update'"
                :disabled="row.level === 1"
                icon="Edit"
                title="编辑"
                @click="openAddOrEdit(row)">
              </el-button>
              <el-popconfirm
                width="200"
                title="你确定要删除这个吗？"
                @confirm="batchRemoveUsers([row.id])">
                <template #reference>
                  <el-button
                    v-authority="'btn.User.remove'"
                    type="danger"
                    size="default"
                    :disabled="row.level === 1"
                    icon="Delete"
                    title="删除"></el-button>
                </template>
              </el-popconfirm>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="usersData.total"
        :page-size="PageSize"
        @update:currentChange="getUsers" :currentChange="usersData.currentPage"></Pagination>
    </el-card>
    <AddOrEdit ref="refAddOrEdit" @refresh="refreshUsers"></AddOrEdit>
    <AssignRoles ref="refAssignRoles" @refresh="refreshUsers"></AssignRoles>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store";
import { reqGetUsers, reqBatchRemoveUsers } from "@/api/user";
import type { ItemUserRecord } from "@/api/user/type";
import SearchTable from "../components/SearchTable.vue";
import AddOrEdit from "./components/AddOrEdit.vue";
import AssignRoles from "./components/AssignRoles.vue";
const PageSize = 5;

const userStore = useUserStore();
const usersData = reactive({
  total: 0,
  tableLoading: false,
  list: <ItemUserRecord[]>[],
  searchUsername: "",
  selectList: <ItemUserRecord[]>[],
    currentPage:1
});

const getUsers = async (page = 1) => {
  usersData.tableLoading = true;
  usersData.currentPage = page;
  let res = await reqGetUsers(page, PageSize, usersData.searchUsername);
  if (res.code === 200 && res.data) {
    usersData.list = res.data.records;
    usersData.total = res.data.total;
  } else {
    ElMessage.error("获取数据失败");
    usersData.list = [];
    usersData.total = 0;
  }
  usersData.tableLoading = false;
};

type refreshUsersParams = {
  type: string;
  data?: ItemUserRecord;
};
const refreshUsers = (params: refreshUsersParams) => {
  switch (params.type) {
    case "change":
      let { data } = params;
      if (data) {
        let item = usersData.list.find((item) => item.id === data?.id);
        if (item) Object.assign(item, data);
      }

      break;

    case "add":
      getUsers();
      break;

    default:
      getUsers();
      break;
  }
};

const refAddOrEdit = ref();
const openAddOrEdit = (data?: ItemUserRecord) => {
  refAddOrEdit.value.changeShow(true, data);
};

const refAssignRoles = ref();

//批量删除相关
const isSlect = (params: ItemUserRecord) => {
  return !(params.username === userStore.userData?.name);
};
const batchDeletion = () => {
  batchRemoveUsers(usersData.selectList.map((item) => item.id));
  usersData.selectList = [];
};
const batchRemoveUsers = async (ids: number[]) => {
  usersData.tableLoading = true;
  let res = await reqBatchRemoveUsers(ids);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    if (usersData.currentPage === 1 || usersData.list.length - ids.length > 0) {
      getUsers(usersData.currentPage);
    } else {
      getUsers(usersData.currentPage - 1);
    }
  } else {
    ElMessage.error("删除失败");
    getUsers(usersData.currentPage);
  }
};

onMounted(() => {
  getUsers();
});
</script>

<style scoped lang="scss"></style>
