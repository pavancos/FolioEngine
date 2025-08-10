import { classic } from "./classic.js";

export const templates: { [key: string]: (data: any) => string } = {
  classic: (data: any) => classic(data)
};