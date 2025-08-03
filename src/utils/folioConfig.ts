import { FolioConfig } from "../types/folioConfigTypes.js";

export function verifyConfig(folioConfig: FolioConfig): boolean {
  const { personalInformation, skills, projects, workExperience } = folioConfig;
  if (!personalInformation) {
    return false;
  }
  if (
    !skills ||
    !Array.isArray(skills.languages) ||
    !Array.isArray(skills.tools) ||
    !Array.isArray(skills.frameworks)
  ) {
    return false;
  }
  if (!projects || !Array.isArray(projects)) {
    return false;
  }
  if (!workExperience || !Array.isArray(workExperience)) {
    return false;
  }

  return true;
}
