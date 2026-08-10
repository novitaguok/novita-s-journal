export const CUSTOM_SNIPPETS: Record<string, string> = {
  "novitaguok/BudgetIN": `Widget build(BuildContext context) {\n  return Scaffold(\n    appBar: AppBar(title: Text('BudgetIN')),\n    body: Center(child: Text('Invest your money')),\n  );\n}`,
  "novitaguok/Android-Face-Recognition": `Mat rgba = new Mat();\nUtils.bitmapToMat(bitmap, rgba);\nImgproc.cvtColor(rgba, gray, Imgproc.COLOR_RGBA2GRAY);\nfaceDetector.detectMultiScale(gray, faces);`,
  "novitaguok/ethereum-boilerplate": `const { authenticate, isAuthenticated } = useMoralis();\nif (!isAuthenticated) {\n  return <button onClick={() => authenticate()}>\n    Connect Wallet\n  </button>\n}`,
  "novitaguok/ANN-from-Scratch": `def forward(self, X):\n    self.z = np.dot(X, self.W1)\n    self.z2 = self.sigmoid(self.z)\n    self.z3 = np.dot(self.z2, self.W2)\n    o = self.sigmoid(self.z3)\n    return o`,
  "novitaguok/Chinese-HCR": `model = Sequential()\nmodel.add(Conv2D(32, kernel_size=(3, 3), activation='relu'))\nmodel.add(MaxPooling2D(pool_size=(2, 2)))\nmodel.add(Dense(num_classes, activation='softmax'))`,
  "novitaguok/Data-Analytics-Project-BootUp": `import pandas as pd\ndf = pd.read_csv('dataset.csv')\nclean_df = df.dropna().groupby('category').mean()\nprint(clean_df.head())`,
  "Owlite-Team/shelter-it-be": `// Add your custom snippet here`,
  "Owlite-Team/noveats-be": `// Add your custom snippet here`,
  "Owlite-Team/shelter-it-android": `// Add your custom snippet here`,
  "Owlite-Team/cinlok-be": `// Add your custom snippet here`,
};

export const TAG_COLORS: Record<
  string,
  { bg: string; text: string; darkBg: string; darkText: string }
> = {
  "Software Engineering": {
    bg: "rgba(49,120,198,0.12)",
    text: "#3178c6",
    darkBg: "rgba(49,120,198,0.2)",
    darkText: "#79b8ff",
  },
  AI: {
    bg: "rgba(147,51,234,0.12)",
    text: "#9333ea",
    darkBg: "rgba(147,51,234,0.2)",
    darkText: "#c084fc",
  },
  Events: {
    bg: "rgba(234,88,12,0.12)",
    text: "#ea580c",
    darkBg: "rgba(234,88,12,0.2)",
    darkText: "#fb923c",
  },
  design: {
    bg: "rgba(219,88,115,0.12)",
    text: "#c45a72",
    darkBg: "rgba(219,88,115,0.2)",
    darkText: "#f4a8b8",
  },
  essay: {
    bg: "rgba(94,158,85,0.12)",
    text: "#5a9a52",
    darkBg: "rgba(94,158,85,0.2)",
    darkText: "#85e89d",
  },
};

const SOFTWARE_ENGINEERING_KEYWORDS = [
  "android", "ios", "swift", "swiftui", "mobile-dev", "python", "javascript", 
  "typescript", "gamedev", "engineering", "software engineering", "software-engineering", 
  "frontend", "backend", "iosdev", "appledeveloper", "hackingwithswift", "twostraws"
];

const AI_KEYWORDS = [
  "ai", "llm", "prompt-engineering", "gemma", "artificial-intelligence", 
  "machine-learning", "agentic-ai", "antigravity"
];

const EVENTS_KEYWORDS = [
  "events", "gdg", "googlecloud", "hackathon", "tech-community", "cloudnext", 
  "conference", "gdgcloudjakarta", "kodingdeepdive", "appledeveloperacademy", "paulhudson"
];

const DESIGN_KEYWORDS = [
  "design", "ui-ux", "figma", "prototyping", "typography", "branding"
];

const ESSAY_KEYWORDS = [
  "essay", "growth-mindset", "career", "women-in-tech", "reflections", "learning",
  "growthmindset", "womenintech"
];

export function mapTagsToCategories(
  input: string | string[] | undefined | null
): string[] {
  const rawTags = Array.isArray(input)
    ? input
    : typeof input === "string"
    ? input.split(",").map((s) => s.trim())
    : [];

  const mapped = new Set<string>();

  for (const t of rawTags) {
    if (typeof t === "string" && t) {
      const normalized = t.toLowerCase().trim();
      if (AI_KEYWORDS.includes(normalized)) {
        mapped.add("AI");
      } else if (EVENTS_KEYWORDS.includes(normalized)) {
        mapped.add("Events");
      } else if (SOFTWARE_ENGINEERING_KEYWORDS.includes(normalized)) {
        mapped.add("Software Engineering");
      } else if (DESIGN_KEYWORDS.includes(normalized)) {
        mapped.add("design");
      } else if (ESSAY_KEYWORDS.includes(normalized)) {
        mapped.add("essay");
      } else {
        mapped.add(t);
      }
    }
  }

  if (mapped.size === 0) {
    mapped.add("Software Engineering");
  }

  return Array.from(mapped);
}

export function mapTagsToCategory(
  input: string | string[] | undefined | null
): string {
  const categories = mapTagsToCategories(input);
  return categories[0] || "Software Engineering";
}

export const STATUS_META: Record<string, { label: string; color: string }> = {
  active: { label: "active", color: "#3fb950" },
  stable: { label: "stable", color: "#e3b341" },
  archived: { label: "archived", color: "#8b949e" },
};
