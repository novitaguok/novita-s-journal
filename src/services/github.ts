export async function getGithubContributions(username: string) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) throw new Error("Missing GITHUB_TOKEN in environment variables");

  const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { userName: username } }),
    next: { revalidate: 43200 },
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);

  const weeks =
    json.data.user.contributionsCollection.contributionCalendar.weeks;

  const calendarData: { date: string; count: number; level: number }[] = [];
  let maxCount = 1;

  weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      if (day.contributionCount > maxCount) maxCount = day.contributionCount;
    });
  });

  weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      const count = day.contributionCount;
      const level = count === 0 ? 0 : Math.ceil((count / maxCount) * 4);

      calendarData.push({
        date: day.date,
        count: count,
        level: level,
      });
    });
  });

  return calendarData;
}
