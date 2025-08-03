import { Schema, model, Types } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  avatar: {
    type: String,
    required: true,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  recentConfig: {
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
    workexperience: [{
      role: String,
      company: String,
      techStack: [String],
      description: String,
    }],
  },
  craftBenches: [{ type: Types.ObjectId, ref: "CraftBench" }],
  createdOn: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  lastCreation: { type: Date, default: Date.now },
});

export default model("User", UserSchema);
