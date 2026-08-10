import { ArticlesRepository } from "../../domain/articles/repository";
import { LocalArticlesRepository } from "./LocalArticlesRepository";
import { GitHubArticlesRepository } from "./GitHubArticlesRepository";

export interface ArticlesRepositories {
  primary: ArticlesRepository;
  local: ArticlesRepository;
  github: ArticlesRepository;
}

/**
 * Resolves the default (primary) article source from the environment:
 * the local filesystem in development, otherwise GitHub as the CMS.
 * Override with GITHUB_USE_LOCAL=true in production for testing.
 */
export function createArticlesRepositories(): ArticlesRepositories {
  const local = new LocalArticlesRepository();
  const github = new GitHubArticlesRepository();

  const useLocal =
    process.env.NODE_ENV === "development" ||
    process.env.GITHUB_USE_LOCAL === "true";

  return {
    primary: useLocal ? local : github,
    local,
    github,
  };
}
