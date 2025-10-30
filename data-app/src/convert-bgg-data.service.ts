import convert from "xml-js";
import { DataResponse } from "./utils/data.types";

export const convertBggData = async ({
  xml,
  options,
}: {
  xml: string;
  options: {
    compact: boolean;
    spaces: number;
  };
}): Promise<DataResponse> => {
  try {
    const convertedBggData = convert.xml2json(xml, options);
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
