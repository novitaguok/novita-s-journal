import { Project } from "./types";

export interface ProjectsRepository {
  getProjects(opts?: {
    status?: "active" | "stable" | "archived";
    pinnedOnly?: boolean;
  }): Promise<Project[]>;
}
