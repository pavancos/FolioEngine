import { classic } from "./classic.js";
import { minimal } from "./minimal.js";

export const templates: { [key: string]: (data: any) => string } = {
  classic: (data: any) => classic(data),
  minimal: (data: any) => minimal(data)
};