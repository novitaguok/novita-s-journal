import { GitHubRepository } from "../../domain/github/repository";
import { ContributionDay } from "../../domain/github/types";
import { GitHubContributionsClient } from "../../infrastructure/github/GitHubContributionsClient";

export class GetGithubContributionsUseCase {
  constructor(
    private githubRepo: GitHubRepository = new GitHubContributionsClient()
  ) {}

  async execute(username: string): Promise<ContributionDay[]> {
    return this.githubRepo.getContributions(username);
  }
}
