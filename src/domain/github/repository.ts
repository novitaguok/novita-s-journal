import { ContributionDay } from "./types";

export interface GitHubRepository {
  getContributions(username: string): Promise<ContributionDay[]>;
}
