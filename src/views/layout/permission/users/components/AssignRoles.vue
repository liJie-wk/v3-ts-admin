<template>
  <el-drawer v-model="show" @close="drawerClose">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form label-width="auto">
        <el-form-item label="用户姓名">
          <el-input disabled :value="assignRolesData.username"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <div>
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange">
              <el-checkbox
                v-for="city in allRolesList"
                :key="city.id"
                :label="city.id"
                >{{ city.roleName }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="changeShow(false)">取消</el-button>
        <el-button type="primary" @click="confirmClick">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type {
  ItemUserRecord,
  AssignRole,
  DoAssignRoleParams,
} from "@/api/user/type";
import type { CheckboxValueType } from "element-plus";

import { reqGetUserAssign, reqDoAssignRole } from "@/api/user";

const emit = defineEmits(["refresh"]);

//单个用户的角色信息
const assignRolesData = ref(<ItemUserRecord>{});
//所有角色数据
let allRolesList = ref(<AssignRole[]>[]);
//所有角色id
let allRolesListIds = <number[]>[];
//枚举角色名字与id
let enumRolesList = <{ [name: string | number]: string | number }>{};

const show = ref(false);
const changeShow = (flag: boolean, data?: ItemUserRecord) => {
  if (flag && data) {
    assignRolesData.value = data;
    if (allRolesList.value.length === 0) {
      reqGetUserAssign(data.id).then((res) => {
        if (res.code === 200 && res.data && res.data.allRolesList) {
          allRolesList.value = res.data.allRolesList;
          res.data.allRolesList.forEach((item) => {
            enumRolesList[item.id] = item.roleName;
            enumRolesList[item.roleName] = item.id;
            allRolesListIds.push(item.id)
          });
          roleNameToId();
        }
      });
    } else {
      roleNameToId();
    }
  } else {
  }
  show.value = flag;
};
const drawerClose = () => {
  //清空选项数据
  checkAll.value = false;
  isIndeterminate.value = false;
  checkedCities.value = [];
};

const roleNameToId = () => {
  if (assignRolesData.value.roleName)
    checkedCities.value = assignRolesData.value.roleName
      .split(",")
      .reduce((preval, nowval) => {
        let ite = allRolesList.value.find((item) => item.roleName === nowval);
        if (ite) preval.push(ite.id);
        return preval;
      }, <number[]>[]);
};

const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkedCities = ref(<number[]>[]);

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedCities.value = val ? allRolesListIds : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value: any) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === allRolesList.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRolesList.value.length;
};

const confirmClick = async () => {
  let data: DoAssignRoleParams = {
    roleIdList: checkedCities.value,
    userId: assignRolesData.value.id,
  };
  let res = await reqDoAssignRole(data);
  if (res.code === 200) {
    ElMessage.success("保存成功");
    let roleName = checkedCities.value.reduce((preval, val) => {
        preval.push(enumRolesList[val])
      return preval;
    }, <any[]>[]).join(',');
    emit("refresh", {
      type: "change",
      data: {
        roleName,
        id:assignRolesData.value.id
      },
    });
    changeShow(false);
  } else {
    ElMessage.error("保存失败");
  }
};
defineExpose({ changeShow });
</script>

<style scoped lang="scss"></style>
