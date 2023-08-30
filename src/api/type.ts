export interface PublicResultType {
  code: number;
  message: string;
  ok: boolean;
}

export interface PublicPagingType {
  records: any[];
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  hitCount: boolean;
  countId: any;
  maxLimit: any;
  searchCount: boolean;
  pages: number;
}