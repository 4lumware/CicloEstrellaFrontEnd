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
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface FormalityParamsFilter {
  title?: string;
  description?: string;
  from?: Date | null;
  to?: Date | null;
  page?: number;
  size?: number;
}
