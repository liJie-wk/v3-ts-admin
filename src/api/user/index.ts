import request from "@/utils/request";
import type {
  loginFormData,
  loginResultData,
  userInfoResultData,
  UsersResult,
  ItemUserRecord,
  UserAssignResult,
  DoAssignRoleParams,
  RolesListResult,
  RoleAssignPermissionResult,
  MenuParams
} from "./type";
import { PublicResultType } from "../type";

//登录相关
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResultData>("/admin/acl/index/login", data);
export const reqLogout = () =>
  request.post<any, loginResultData>("/admin/acl/index/logout");

//用户信息相关
export const reqUserInfo = () =>
  request.get<any, userInfoResultData>("/admin/acl/index/info");

//用户管理相关
export const reqGetUsers = (page:number,limit:number,username = '') => {
  return request.get<any,UsersResult>(`/admin/acl/user/${page}/${limit}`,{
    params:{
      username
    }
  })
};

export const reqSaveOrUpdate = (data:ItemUserRecord) => {
  if(data.id) {
    return request.put<any,PublicResultType>('/admin/acl/user/update',data)
  } else {
    return request.post<any,PublicResultType>('/admin/acl/user/save',data)
  }
};


export const reqGetUserAssign = (adminId:number) => {
  return request.get<any,UserAssignResult>(`/admin/acl/user/toAssign/${adminId}`)
};

export const reqDoAssignRole = (data:DoAssignRoleParams) => {
  return request.post<any,PublicResultType>('/admin/acl/user/doAssignRole',data)
};

export const reqBatchRemoveUsers = (idList:number[]) => {
  return request.delete<any,PublicResultType>('/admin/acl/user/batchRemove',{data:idList})
};

//角色管理相关
export const reqGetRoles = (page:number,limit:number,roleName = '') => {
  return request.get<any,RolesListResult>(`/admin/acl/role/${page}/${limit}`,{params:{roleName}})
};
export const reqSaveOrUpdateRole = (roleName:string,id?:number) => {
  if(id) {
    return request.put<any,PublicResultType>('/admin/acl/role/update',{roleName,id})
  } else {
    return request.post<any,PublicResultType>('/admin/acl/role/save',{roleName})
  }
};

export const reqRoleAssignPermission = (roleId:number) => {
  return request.get<any,RoleAssignPermissionResult>(`/admin/acl/permission/toAssign/${roleId}`)
};

export const reqDoAssignPermission = (roleId:number,permissionId:number[]) => {
  console.log(roleId,permissionId);
  return request.post<any,PublicResultType>('/admin/acl/permission/doAssign',undefined,{params:{
    roleId,
    permissionId:permissionId.join(',')
  }})
};

export const reqRoleBatchRemove = (idList:number[]) => {
  return request.delete<any,PublicResultType>('/admin/acl/role/batchRemove',{data:idList})
};

//菜单管理
export const reqGetPermissionList = () => {
  return request.get<any,RoleAssignPermissionResult>('/admin/acl/permission')
};


export const reqSaveOrUpdatePermission = (data:MenuParams) => {
  if(data.id) {
    return request.put<any,PublicResultType>('/admin/acl/permission/update',data)
  } else {
    return request.post<any,PublicResultType>('/admin/acl/permission/save',data)
  }
};

export const reqRmPermission = (id:number) => {
  return request.delete<any,PublicResultType>(`/admin/acl/permission/remove/${id}`)
};
