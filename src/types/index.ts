export type Skill = {
  title: string;
  src: string;
};

export type AppProject = {
  id: number;
  title: string;
  year: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  url: string;
  screenshotUrl: string;
  category: "web" | "mobile" | "ai";
};

export type Illustration = {
  id: number;
  title: string;
  description: string;
  medium: string;
  year: string;
  src: string;
  aspectRatio: number;
};

export type ArchProject = {
  id: number;
  title: string;
  description: string;
  location: string;
  year: string;
  style: string;
  src: string;
};

export type WorkExperience = {
  id: number;
  role: string;
  company: string;
  type: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
};
