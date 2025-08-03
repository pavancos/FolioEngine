export type PersonalInformation = {
  name: string;
  email: string;
  bio: string;
  about: string;
  githubLink: string;
  linkedinLink: string;
  twitterLink: string;
  resumeLink: string;
};
export type Skills = {
  languages?: string[];
  tools?: string[];
  frameworks?: string[];
};
export type Projects = {
  title: string;
  description: string;
  techStack: string[];
  image: string;
  repoLink: string;
  liveLink: string;
}[];
export type WorkExperience = {
  role: string;
  company: string;
  techStack: string[];
  description: string;
}[];

export type Meta = {
  folioName: string;
  folioAvatar: string;
  craftId: string;
  craftName: string;
  repoLink?: string;
  status: "inProgress" | "published";
  createdAt?: string;
  lastUpdated?: string;
};

export type FolioConfig = {
  personalInformation: PersonalInformation;
  skills: Skills;
  projects: Projects;
  workExperience: WorkExperience;
};
