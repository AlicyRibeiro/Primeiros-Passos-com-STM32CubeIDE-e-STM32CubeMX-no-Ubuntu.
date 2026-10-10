export interface DocHeading {
  level: number;
  text: string;
  slug: string;
}

export interface DocArticle {
  id: string;
  title: string;
  section: string;
  content: string;
  headings: DocHeading[];
  index: number;
}

export interface DocSection {
  name: string;
  articles: DocArticle[];
}

export interface SearchResult {
  article: DocArticle;
  matchedHeading?: string;
  previewSnippet: string;
}
