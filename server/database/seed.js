const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'tos.db');
const DATA_DIR = path.join(__dirname, 'data');

// Remove existing DB for clean seed
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('Removed existing database.');
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Load and execute schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);
console.log('Schema created.');

// ===== Seed Red Flag Definitions =====
const redFlags = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'red-flags.json'), 'utf-8')
);

const insertFlag = db.prepare(`
  INSERT INTO red_flag_definitions (slug, name, category, description, severity, search_terms, long_description)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const seedFlags = db.transaction(() => {
  for (const flag of redFlags) {
    insertFlag.run(
      flag.slug, flag.name, flag.category, flag.description,
      flag.severity, flag.search_terms, flag.long_description
    );
  }
});
seedFlags();
console.log(`Seeded ${redFlags.length} red flag definitions.`);

// ===== Seed Companies =====
const companiesDir = path.join(DATA_DIR, 'companies');
const companyFiles = fs.readdirSync(companiesDir).filter(f => f.endsWith('.json'));

const insertCompany = db.prepare(`
  INSERT INTO companies (slug, name, parent_company, industry, category, founded_year, headquarters,
    tos_url, tos_last_updated, risk_score, overall_risk, word_count, estimated_read_time,
    summary, detailed_analysis, key_concerns, what_they_collect, what_they_share, user_rights)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertCompanyFlag = db.prepare(`
  INSERT INTO company_red_flags (company_id, flag_id, evidence, notes)
  VALUES (?, ?, ?, ?)
`);

const insertSection = db.prepare(`
  INSERT INTO tos_sections (company_id, section_order, title, original_text, plain_english, risk_level)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Build flag slug -> id map
const flagMap = {};
const allFlags = db.prepare('SELECT id, slug FROM red_flag_definitions').all();
for (const f of allFlags) {
  flagMap[f.slug] = f.id;
}

const seedCompanies = db.transaction(() => {
  for (const file of companyFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(companiesDir, file), 'utf-8'));

    const result = insertCompany.run(
      data.slug, data.name, data.parent_company || null, data.industry, data.category,
      data.founded_year || null, data.headquarters || null,
      data.tos_url || null, data.tos_last_updated || null,
      data.risk_score, data.overall_risk, data.word_count || 0, data.estimated_read_time || 0,
      data.summary, data.detailed_analysis || '',
      data.key_concerns || null, data.what_they_collect || null,
      data.what_they_share || null, data.user_rights || null
    );
    const companyId = result.lastInsertRowid;

    // Insert red flags
    if (data.red_flags) {
      for (const flagSlug of data.red_flags) {
        const flagId = flagMap[flagSlug];
        if (flagId) {
          const evidence = data.flag_evidence?.[flagSlug] || null;
          insertCompanyFlag.run(companyId, flagId, evidence, null);
        } else {
          console.warn(`  Warning: Unknown flag slug "${flagSlug}" for ${data.name}`);
        }
      }
    }

    // Insert TOS sections
    if (data.sections) {
      for (let i = 0; i < data.sections.length; i++) {
        const s = data.sections[i];
        insertSection.run(
          companyId, i + 1, s.title, s.original_text || null,
          s.plain_english, s.risk_level || 'low'
        );
      }
    }

    console.log(`  Seeded ${data.name} (${data.red_flags?.length || 0} flags, ${data.sections?.length || 0} sections)`);
  }
});
seedCompanies();
console.log(`Seeded ${companyFiles.length} companies.`);

// ===== Seed Articles =====
const articlesDir = path.join(DATA_DIR, 'articles');
if (fs.existsSync(articlesDir)) {
  const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));

  const insertArticle = db.prepare(`
    INSERT INTO articles (slug, title, subtitle, author, category, summary, content, read_time, is_flagship, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedArticles = db.transaction(() => {
    for (const file of articleFiles) {
      const data = JSON.parse(fs.readFileSync(path.join(articlesDir, file), 'utf-8'));
      insertArticle.run(
        data.slug, data.title, data.subtitle || null, data.author || 'TOS SparkNotes',
        data.category, data.summary, data.content,
        data.read_time || 5, data.is_flagship ? 1 : 0, data.sort_order || 0
      );
      console.log(`  Seeded article: ${data.title}`);
    }
  });
  seedArticles();
  console.log(`Seeded ${articleFiles.length} articles.`);
}

// ===== Seed Glossary =====
const glossaryPath = path.join(DATA_DIR, 'glossary.json');
if (fs.existsSync(glossaryPath)) {
  const glossary = JSON.parse(fs.readFileSync(glossaryPath, 'utf-8'));

  const insertGlossary = db.prepare(`
    INSERT INTO glossary (term, definition, category, related_flags, see_also)
    VALUES (?, ?, ?, ?, ?)
  `);

  const seedGlossary = db.transaction(() => {
    for (const item of glossary) {
      insertGlossary.run(
        item.term, item.definition, item.category || null,
        item.related_flags || null, item.see_also || null
      );
    }
  });
  seedGlossary();
  console.log(`Seeded ${glossary.length} glossary terms.`);
}

db.close();
console.log('\nSeed complete! Database ready at', DB_PATH);
