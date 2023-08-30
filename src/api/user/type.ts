import type { PublicResultType,PublicPagingType } from "../type";

export interface loginFormData {
  username: string;
  password: string;
}

export interface loginResultData extends PublicResultType {
  data: string;
}

export interface checkUser {
  avatar: string;
  buttons: string[];
  name: string;
  roles: string[];
  routes: string[];
}
export interface userInfoResultData extends PublicResultType {
  data: checkUser;
}

//用户管理
export interface ItemUserRecord {
  id: number;
  createTime: string;
  updateTime: string;
  username: string;
  password: string;
  name: string;
  phone?: any;
  roleName: string;
}

export interface ItemUser extends PublicPagingType {
  records: ItemUserRecord[];
}

export interface UsersResult extends PublicResultType {
  data: ItemUser;
}

export interface AssignRole {
  id: number;
  createTime: string;
  updateTime: string;
  roleName: string;
  remark?: any;
}

export interface UserAssignData {
  assignRoles: AssignRole[];
  allRolesList: AssignRole[];
}

export interface UserAssignResult extends PublicResultType {
  data: UserAssignData;
}

export interface DoAssignRoleParams {
  roleIdList: number[];
  userId: number;
}


//角色管理
export interface RolesData extends PublicPagingType {
	records: AssignRole[];
}
export interface RolesListResult extends PublicResultType {
  data:RolesData
}


export interface ItemRoleAssignPermission {
	id: number;
	pid: number;
	name: string;
	code?: string;
	level: number;
	createTime: string;
	updateTime: string;
	toCode?: any;
	type: number;
	status?: any;
	children: ItemRoleAssignPermission[];
	select: boolean;
}

export interface RoleAssignPermissionResult extends PublicResultType {
	data:ItemRoleAssignPermission[]
}

//菜单管理
export interface MenuParams {
  id?:number,
  pid: number;
	name: string;
	code: string;
  level: number;
}