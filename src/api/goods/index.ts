import request from "@/utils/request";
import type {
  TrademarkResultData,
  Record,
  CategoryListData,
  RootAttrInfo,
  RootSPUList,
  ItemSpuRecord,
  BrandList,
  SpuImageList,
  AttrInfoList,
  SpuSaleAttrListResult,
  BaseSaleAttrList,
  AddSkuItem,
  ItemSpuResult,
  ItemSkuResult,
  SkuListResult,
} from "./type";
import type { PublicResultType } from "@/api/type";
//品牌管理
export const reqTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResultData>(
    `/admin/product/baseTrademark/${page}/${limit}`
  );

export const reqRemoveTrademark = (id: number) =>
  request.delete<any, PublicResultType>(
    `/admin/product/baseTrademark/remove/${id}`
  );

export const reqSaveOrUpdateTrademark = (data: Record) => {
  if (data.id) {
    return request.put<any, PublicResultType>(
      "/admin/product/baseTrademark/update",
      data
    );
  } else {
    return request.post<any, PublicResultType>(
      "/admin/product/baseTrademark/save",
      data
    );
  }
};

//属性管理相关

export const reqGoodsCategory = (name?: string, id?: number | string) => {
  let url;
  switch (name) {
    case "二级分类":
      url = `/admin/product/getCategory2/${id}`;
      break;
    case "三级分类":
      url = `/admin/product/getCategory3/${id}`;
      break;
    default:
      url = "/admin/product/getCategory1";
      break;
  }
  return request.get<any, CategoryListData>(url);
};

export const reqAttrInfoList = (
  category1Id: number,
  category2Id: number,
  category3Id: number
) => {
  return request.get<any, RootAttrInfo>(
    `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
  );
};

export const reqUpdateOrSaveAttrInfo = (data: AttrInfoList) => {
  //有id就是修改，反之添加
  return request.post<any, PublicResultType>(
    "/admin/product/saveAttrInfo",
    data
  );
};

export const reqDeleteAttr = (attrId: number) => {
  return request.delete<any, PublicResultType>(
    `/admin/product/deleteAttr/${attrId}`
  );
};

//SPU相关
export const reqSPUList = (
  page: number,
  limit: number,
  category3Id: number
) => {
  return request.get<any, RootSPUList>(`/admin/product/${page}/${limit}`, {
    params: {
      category3Id,
    },
  });
};

export const reqBrandList = () => {
  //获取品牌列表
  return request.get<any, BrandList>(
    "/admin/product/baseTrademark/getTrademarkList"
  );
};

export const reqSpuImageList = (spuId: number) => {
  //获取spu图片列表
  return request.get<any, SpuImageList>(`/admin/product/spuImageList/${spuId}`);
};
export const reqSpuSaleAttrList = (spuId: number) => {
  //获取某个spuid下的销售属性
  return request.get<any, SpuSaleAttrListResult>(
    `/admin/product/spuSaleAttrList/${spuId}`
  );
};
export const reqBaseSaleAttrList = () => {
  //获取全部销售属性
  return request.get<any, BaseSaleAttrList>("/admin/product/baseSaleAttrList");
};
export const resEditOrAdd = (data: ItemSpuRecord) => {
  //更新或添加spu
  if (data.id) {
    return request.post<any, PublicResultType>(
      "/admin/product/updateSpuInfo",
      data
    );
  } else {
    return request.post<any, PublicResultType>(
      "/admin/product/saveSpuInfo",
      data
    );
  }
};

export const reqAddSkuItem = (data: AddSkuItem) => {
  return request.post<any, PublicResultType>(
    "/admin/product/saveSkuInfo",
    data
  );
};

export const reqFindBySpuId = (spuId: number) => {
  return request.get<any, ItemSpuResult>(`/admin/product/findBySpuId/${spuId}`);
};

export const reqDelSpuItem = (spuId: number) => {
  return request.delete<any, PublicResultType>(
    `/admin/product/deleteSpu/${spuId}`
  );
};

export const reqSkuList = (page: number, limit: number) => {
  return request.get<any, SkuListResult>(
    `/admin/product/list/${page}/${limit}`
  );
};

type Sale = 0 | 1 ;
export const reqChangeSkuItemSale = (skuId: number, sale: Sale) => {
  let str = "";
  if (sale === 1) {
    str = `/admin/product/cancelSale/${skuId}`;
  } else {
    str = `/admin/product/onSale/${skuId}`;
  }
  return request.get<any,PublicResultType>(str);
};

export const reqSkuInfo = (skuId: number) => {
  return request.get<any,ItemSkuResult>(`/admin/product/getSkuInfo/${skuId}`)
};

export const reqDeleteSku = (skuId: number) => {
  return request.delete<any,PublicResultType>(`/admin/product/deleteSku/${skuId}`)
};

