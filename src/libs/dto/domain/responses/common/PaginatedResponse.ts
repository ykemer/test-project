type PaginatedResponse<Data> = {
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  total: number;
  data: Data[];
};

export type {PaginatedResponse};
