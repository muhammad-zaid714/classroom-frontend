import {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
import { SUBJECTS_MOCK_DATA } from "./mock-data/subjects";

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    return {
      data: SUBJECTS_MOCK_DATA as unknown as TData[],
      total: SUBJECTS_MOCK_DATA.length,
    };
  },
  getOne: async () => {
    throw new Error("This function is not present in mock");
  },
  create: async () => {
    throw new Error("This function is not present in mock");
  },
  update: async () => {
    throw new Error("This function is not present in mock");
  },
  deleteOne: async () => {
    throw new Error("This function is not present in mock");
  },
  getApiUrl: () => {
    throw new Error("This function is not present in mock");
  },
  custom: async () => {
    throw new Error("This function is not present in mock");
  },
};