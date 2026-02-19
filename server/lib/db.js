const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'database', 'tos.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Initialize schema if tables don't exist
    const hasCompanies = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='companies'"
    ).get();

    if (!hasCompanies) {
      const schema = fs.readFileSync(
        path.join(__dirname, '..', 'database', 'schema.sql'),
        'utf-8'
      );
      db.exec(schema);
    }
  }
  return db;
}

// Query helpers
function all(sql, params = []) {
  return getDb().prepare(sql).all(...(Array.isArray(params) ? params : [params]));
}

function get(sql, params = []) {
  return getDb().prepare(sql).get(...(Array.isArray(params) ? params : [params]));
}

function run(sql, params = []) {
  return getDb().prepare(sql).run(...(Array.isArray(params) ? params : [params]));
}

function search(table, query, limit = 20) {
  return getDb()
    .prepare(`SELECT * FROM ${table}_fts WHERE ${table}_fts MATCH ? LIMIT ?`)
    .all(query, limit);
}

module.exports = { getDb, all, get, run, search };
