import { NextRequest, NextResponse } from "next/server";
import { Project } from "@/src/types";
import { CUSTOM_SNIPPETS } from "@/src/lib/data";

export const runtime = "edge";

const getLangColor = (lang: string | null) => {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    Rust: "#dea584",
  };
  return lang && colors[lang] ? colors[lang] : "#8b949e";
};

const generateSnippet = (r: any) => {
  const safeDesc = (r.description || '').replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 80) + ((r.description && r.description.length > 80) ? '...' : '');
  const lang = (r.language || 'text').toLowerCase();
  const repoName = r.name.replace(/[^a-zA-Z0-9_]/g, '_') || 'project';
  
  if (lang === 'python') {
    return `class ${repoName}:\n    language = "${r.language}"\n    stars = ${r.stargazers_count}\n    description = "${safeDesc}"`;
  }
  if (lang === 'java' || lang === 'kotlin') {
    return `public class ${repoName} {\n    String lang = "${r.language}";\n    int stars = ${r.stargazers_count};\n}`;
  }
  if (lang === 'dart') {
    return `class ${repoName} {\n  final String lang = "${r.language}";\n  final int stars = ${r.stargazers_count};\n}`;
  }
  if (lang === 'html' || lang === 'css') {
    return `<div id="${repoName}">\n  <span class="lang">${r.language}</span>\n  <span class="stars">${r.stargazers_count}</span>\n</div>`;
  }
  
  // Default to TS/JS syntax
  return `const ${repoName} = {\n  lang: "${r.language || 'Unknown'}",\n  stars: ${r.stargazers_count},\n  desc: "${safeDesc}"\n};`;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") as any) ?? undefined;
  const pinnedOnly = searchParams.get("isPinned") === "true";

  try {
    const githubRes = await fetch("https://api.github.com/users/novitaguok/repos?per_page=100&sort=pushed", {
      next: { revalidate: 3600 }
    });
    
    if (!githubRes.ok) throw new Error("Failed to fetch from GitHub API");

    const githubRepos = await githubRes.json();

    const pinnedRepoNames = [
      "Owlite-Team/shelter-it-be",
      "Owlite-Team/noveats-be",
      "Owlite-Team/shelter-it-android",
      "Owlite-Team/cinlok-be"
    ];

    const extraRepoPromises = pinnedRepoNames.map(repo => 
      fetch(`https://api.github.com/repos/${repo}`, { next: { revalidate: 3600 } }).then(res => res.ok ? res.json() : null)
    );
    const extraReposData = (await Promise.all(extraRepoPromises)).filter(Boolean);
    githubRepos.push(...extraReposData);

    // Map GitHub repos to Project interface
    let projects: Project[] = githubRepos.map((r: any, idx: number) => ({
      id: r.id,
      repo: r.full_name,
      title: r.name,
      isPinned: false, // Will determine based on stars next
      status: r.archived ? "archived" : (new Date(r.pushed_at) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 180) ? "active" : "stable"),
      desc: r.description || "No description provided.",
      longDesc: r.description || "No description provided.",
      stack: r.topics || [],
      lang: r.language || "Markdown",
      langColor: getLangColor(r.language),
      stars: r.stargazers_count,
      forks: r.forks_count,
      year: new Date(r.created_at).getFullYear().toString(),
      demoUrl: r.homepage || null,
      snippet: CUSTOM_SNIPPETS[r.full_name] || generateSnippet(r),
      sortOrder: idx,
      createdAt: r.created_at,
    }));

    // Sort by stars descending to determine 'pinned'
    projects.sort((a, b) => b.stars - a.stars);
    
    let pinnedCount = 0;
    
    // First, pin explicitly defined pinned repos
    projects.forEach(p => {
      if (pinnedRepoNames.includes(p.repo)) {
        p.isPinned = true;
        pinnedCount++;
      }
    });

    // Then fill the rest up to 6 with top starred repos
    projects.forEach((p) => {
      if (!p.isPinned && pinnedCount < 6) {
        p.isPinned = true;
        pinnedCount++;
      }
    });

    if (pinnedOnly) {
      projects = projects.filter(p => p.isPinned);
    }
    if (status) {
      projects = projects.filter(p => p.status === status);
    }

    return NextResponse.json({ data: projects, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: [], error: err.message },
      { status: 500 },
    );
  }
}
