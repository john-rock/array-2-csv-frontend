import JSON5 from "json5";
import { DataItem } from "@/types/types";

export const sanitizeJsonInput = (inputText: string): string => {
  try {
    // Parse the input using JSON5 to handle relaxed JSON syntax
    const parsedJson = JSON5.parse(inputText);
    // Convert back to a standard JSON string with proper formatting
    const sanitizedJson = JSON.stringify(parsedJson, null, 2);

    return sanitizedJson;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const parseJson = (jsonString: string): DataItem[] => {
  return JSON5.parse(jsonString);
};
