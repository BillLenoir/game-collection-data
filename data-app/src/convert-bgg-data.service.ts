import convert from "xml-js";
import type { ConvertBggDataInput, DataResponse } from "./utils/data.types";

export const convertBggData = async <T>({
  xml,
  options,
}: ConvertBggDataInput): Promise<DataResponse<T>> => {
  try {
    const convertedBggData: T = JSON.parse(convert.xml2json(xml, options));
    return {
      ok: true,
      data: convertedBggData,
      message: "Successfully converted the BGG data!",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : JSON.stringify(error),
    };
  }
};
