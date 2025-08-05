import { Meta } from "../types/folioConfigTypes.js";

export function getMetaDataFromUsers(craftBenches: any[]): any[] {
  return craftBenches.map(bench => ({
    craftName: bench.craftName,
    createdAt: bench.createdAt,
    lastUpdated: bench.lastUpdated,
    folioName: bench.folioSelected.folioName,
    folioAvatar: bench.folioSelected.folioAvatar,
    craftId: bench._id,
    repoLink: bench.repoLink,
    status: bench.status,
  }));
}
