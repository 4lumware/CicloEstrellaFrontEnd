export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  offset: number;
  sort: Sort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface PageResponse<T> {
  status: number;
  message: string;
  data: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: T;
    number: number;
    sort: Sort;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: Pageable;
    empty: boolean;
  };
}
