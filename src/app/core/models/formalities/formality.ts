export interface FormalityModel {
  idFormality: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface FormalityModelCreate {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface FormalityModelUpdate {
  idFormality: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface FormalityParamsFilter {
  keyword?: string;
  from?: Date | null;
  to?: Date | null;
  page?: number;
  size?: number;
}
