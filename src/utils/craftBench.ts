import { templates } from "../folios/index.js";
import CraftBench from "../models/CraftBench.js";
import { Meta } from "../types/folioConfigTypes.js";

export function getMetaDataFromUsers(craftBenches: any[]): any[] {
  return craftBenches.map((bench) => ({
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

export const generateHTMLContent = async (craftId: string) => {
  const cb = await CraftBench.findOne({ _id: craftId }).populate({
    path: "folioSelected",
    select: "folioName",
    model: "Folio",
  });

  if (!cb) {
    throw new Error("CraftBench not found");
  }
  const folio = cb.folioSelected as { folioName?: string };

  if (!folio || !folio.folioName) {
    throw new Error("Folio not found");
  }
  const template = templates[folio.folioName];
  const generatedHTML = template ? template(cb.currentConfig) : "";
  return {
    html: generatedHTML,
    craftName: cb.craftName
  };
};
