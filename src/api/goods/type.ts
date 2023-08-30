import type { PublicResultType,PublicPagingType } from "../type";

//品牌管理相关
export interface Record {
  id?: number;
  createTime?: string;
  updateTime?: string;
  tmName: string;
  logoUrl: string;
}

interface TrademarkData extends PublicPagingType {
  records: Record[];
}

export interface TrademarkResultData extends PublicResultType {
  data: TrademarkData;
}


//属性管理相关
export interface CategoryListItemData {
  category1Id: number;
  createTime: string;
  id: number;
  name: string;
  updateTime: string;
}
export interface CategoryListData extends PublicResultType {
  data: CategoryListItemData[];
}

export interface AttrValueList {
  id?: number;
  createTime?: any;
  updateTime?: any;
  valueName: string;
  attrId?: number;
  flag?: boolean;
  refEl?: HTMLInputElement;
}

export interface AttrInfoList {
  id?: number;
  createTime?: any;
  updateTime?: any;
  attrName: string;
  categoryId: number;
  categoryLevel: number;
  attrValueList: AttrValueList[];
  checkData?:number
}

export interface RootAttrInfo extends PublicResultType {
  data: AttrInfoList[];
}


//SPU相关
export interface ItemBrandList {
  createTime: string;
  id: number;
  logoUrl: string;
  tmName: string;
  updateTime: string;
}
export interface BrandList extends PublicResultType {
  data: ItemBrandList[];
}

export interface ItemSpuImageList {
  createTime?: string;
  id?: number;
  imgName: string;
  imgUrl: string;
  spuId?: number;
  updateTime?: string;
}
export interface SpuImageList extends PublicResultType {
	data: ItemSpuImageList[];
}


export interface SpuSaleAttrValueList {
  baseSaleAttrId?: number;
  createTim?: string;
  id?: number;
  isChecked?: string;
  saleAttrName: string;
  saleAttrValueName: string;
  spuId?: number;
  updateTime?: string;
}

export interface SpuSaleAttrList {
  show?:boolean,
  refEl?:HTMLElement;
  inputValue?:string | number;
  baseSaleAttrId: number;
  createTime?: string;
  id?: number;
  saleAttrName: string;
  spuId?: number;
  spuSaleAttrValueList: SpuSaleAttrValueList[];
  updateTime?: string;
}

export interface SpuSaleAttrListResult extends PublicResultType {
  data:SpuSaleAttrList[]
}

export interface ItemSpuRecord {
  category3Id: number;
  description: string;
  spuName: string;
  tmId?: number;
  spuImageList: ItemSpuImageList[];
  spuSaleAttrList: SpuSaleAttrList[];
  spuPosterList?: ItemSpuImageList[];
  id?: number;
  createTime?: string;
  updateTime?: string;
}

export interface ItemSpu {
  records: ItemSpuRecord[];
  total: number;
  size: number;
  pages: number;
}

export interface RootSPUList extends PublicResultType {
  data: ItemSpu;
}

export interface ItemBaseSaleAttrList {
  id: number;
  createTime: string;
  updateTime: string;
  name:string
}
export interface BaseSaleAttrList extends PublicResultType {
  data:ItemBaseSaleAttrList[]
}


//sku相关

export interface SkuAttrValueList {//平台属性
	attrId: number;
	valueId: number;
  valueName?:string;
}
export interface SkuSaleAttrValueList {//销售属性
	saleAttrId: number;
	saleAttrValueId: number;
  saleAttrValueName?:string;
}
export interface skuItemImage {
	id: number;
	createTime: string;
	updateTime: string;
	skuId: number;
	imgName: string;
	imgUrl: string;
	spuImgId: number;
	isDefault: string;
}
export interface AddSkuItem {
  id?:number;
	category3Id: number;
	price: number;
	skuDesc: string;
	skuName: string;
	spuId: number;
	tmId: number;
	weight: number;
  isSale?: 0 | 1;
  skuDefaultImg:string;
	skuAttrValueList: SkuAttrValueList[];
	skuSaleAttrValueList: SkuSaleAttrValueList[];
  skuImageList?:skuItemImage[];
}
export interface ItemSpuResult extends PublicResultType {
  data:AddSkuItem[];
}
export interface ItemSkuResult extends PublicResultType {
  data:AddSkuItem;
}


export interface SkuListItem extends PublicPagingType {
	records: AddSkuItem[];
}

export interface SkuListResult extends PublicResultType {
	data: SkuListItem;
}

