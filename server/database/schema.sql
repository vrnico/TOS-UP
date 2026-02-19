-- TOS SparkNotes Database Schema

CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  parent_company TEXT,
  industry TEXT NOT NULL,
  category TEXT NOT NULL,
  founded_year INTEGER,
  headquarters TEXT,
  tos_url TEXT,
  tos_last_updated TEXT,
  risk_score INTEGER NOT NULL DEFAULT 0,
  overall_risk TEXT NOT NULL DEFAULT 'medium',
  word_count INTEGER DEFAULT 0,
  estimated_read_time INTEGER DEFAULT 0,
  summary TEXT NOT NULL,
  detailed_analysis TEXT NOT NULL,
  key_concerns TEXT,
  what_they_collect TEXT,
  what_they_share TEXT,
  user_rights TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS red_flag_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'high',
  search_terms TEXT NOT NULL,
  long_description TEXT
);

CREATE TABLE IF NOT EXISTS company_red_flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  flag_id INTEGER NOT NULL,
  evidence TEXT,
  notes TEXT,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (flag_id) REFERENCES red_flag_definitions(id),
  UNIQUE(company_id, flag_id)
);

CREATE TABLE IF NOT EXISTS tos_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  section_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  original_text TEXT,
  plain_english TEXT NOT NULL,
  risk_level TEXT DEFAULT 'low',
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT DEFAULT 'TOS SparkNotes',
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  read_time INTEGER DEFAULT 5,
  is_flagship INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS glossary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT UNIQUE NOT NULL,
  definition TEXT NOT NULL,
  category TEXT,
  related_flags TEXT,
  see_also TEXT
);

-- Users (GitHub OAuth)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  github_id INTEGER UNIQUE NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Comments on companies and articles
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  target_type TEXT NOT NULL,
  target_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  parent_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
);

CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id);

-- User-submitted company analyses (contribution pipeline)
CREATE TABLE IF NOT EXISTS contributions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  company_slug TEXT NOT NULL,
  company_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  data TEXT NOT NULL,
  reviewer_notes TEXT,
  reviewed_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Votes on flag assessments (agree/disagree)
CREATE TABLE IF NOT EXISTS flag_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  flag_id INTEGER NOT NULL,
  vote INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (flag_id) REFERENCES red_flag_definitions(id),
  UNIQUE(user_id, company_id, flag_id)
);

-- Full-text search indexes
CREATE VIRTUAL TABLE IF NOT EXISTS companies_fts USING fts5(
  name, summary, detailed_analysis, key_concerns,
  content='companies',
  content_rowid='id'
);

CREATE VIRTUAL TABLE IF NOT EXISTS articles_fts USING fts5(
  title, summary, content,
  content='articles',
  content_rowid='id'
);

CREATE VIRTUAL TABLE IF NOT EXISTS glossary_fts USING fts5(
  term, definition,
  content='glossary',
  content_rowid='id'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS companies_ai AFTER INSERT ON companies BEGIN
  INSERT INTO companies_fts(rowid, name, summary, detailed_analysis, key_concerns)
  VALUES (new.id, new.name, new.summary, new.detailed_analysis, new.key_concerns);
END;

CREATE TRIGGER IF NOT EXISTS articles_ai AFTER INSERT ON articles BEGIN
  INSERT INTO articles_fts(rowid, title, summary, content)
  VALUES (new.id, new.title, new.summary, new.content);
END;

CREATE TRIGGER IF NOT EXISTS glossary_ai AFTER INSERT ON glossary BEGIN
  INSERT INTO glossary_fts(rowid, term, definition)
  VALUES (new.id, new.term, new.definition);
END;
