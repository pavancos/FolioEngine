import { Schema, model, Types } from "mongoose";

const CraftBenchSchema = new Schema({
  craftName: { type: String, required: true },
  repoLink: { type: String },
  currentConfig: {
    personalInformation: {
      name: String,
      email: String,
      bio: String,
      about: String,
      githubLink: String,
      linkedinLink: String,
      twitterLink: String,
      resumeLink: String,
    },
    skills: {
      languages: [String],
      tools: [String],
      frameworks: [String],
    },
    projects: [{
      title: String,
      description: String,
      techStack: [String],
      image: String,
      repoLink: String,
      liveLink: String,
    }],
    workExperience: [{
      role: String,
      company: String,
      techStack: [String],
      description: String,
    }]
  },
  createdAt:{type:Date, default:Date.now},
  lastUpdated: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["published", "inProgress"],
    default: "inProgress",
  },
  userCreated: { type: Types.ObjectId, ref: "User" },
  folioSelected: { type: Types.ObjectId, ref: "Folio" },
});

const CraftBench = model("CraftBench", CraftBenchSchema);
export default CraftBench;