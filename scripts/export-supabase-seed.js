const { execFileSync } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const dbPath = process.env.SQLITE_SEED_DB || path.join(process.cwd(), 'prisma', 'dev.db');
const outputDir = process.env.SEED_EXPORT_DIR || path.join(process.cwd(), 'exports', 'supabase');

const tables = [
  {
    name: 'User',
    columns: ['id', 'name', 'email', 'emailVerified', 'role'],
    dateColumns: ['emailVerified'],
  },
  {
    name: 'Trainer',
    columns: ['id', 'email', 'name', 'createdAt'],
    dateColumns: ['createdAt'],
  },
  {
    name: 'Customer',
    columns: ['id', 'email', 'name', 'phone', 'notes', 'createdAt'],
    dateColumns: ['createdAt'],
  },
  {
    name: 'Dog',
    columns: ['id', 'name', 'age', 'breed', 'status', 'owner', 'lastIncident', 'profileImageUrl', 'trainerId', 'customerId'],
  },
  {
    name: 'CustomerServiceAccess',
    columns: ['id', 'serviceKey', 'createdAt', 'customerId'],
    dateColumns: ['createdAt'],
  },
  {
    name: 'Consultation',
    columns: [
      'id',
      'date',
      'focus',
      'outcome',
      'generalDescription',
      'dogBreed',
      'learningHistory',
      'situation',
      'nutrition',
      'health',
      'hormoneAnalysis',
      'activation',
      'stimulusAnalysis',
      'prescribedPlan',
      'dogId',
    ],
    dateColumns: ['date'],
  },
  {
    name: 'Observation',
    columns: ['id', 'category', 'severity', 'trigger', 'notes', 'loggedAt', 'dogId'],
    dateColumns: ['loggedAt'],
  },
  {
    name: 'ServiceSession',
    columns: [
      'id',
      'serviceKey',
      'date',
      'focus',
      'outcome',
      'generalDescription',
      'dogBreed',
      'learningHistory',
      'situation',
      'nutrition',
      'health',
      'hormoneAnalysis',
      'activation',
      'stimulusAnalysis',
      'prescribedPlan',
      'dogId',
    ],
    dateColumns: ['date'],
  },
];

function sqliteJson(sql) {
  const output = execFileSync('sqlite3', ['-json', dbPath, sql], { encoding: 'utf8' });
  return JSON.parse(output || '[]');
}

function normalizeDate(value) {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    const millis = value > 100000000000 ? value : value * 1000;
    return new Date(millis).toISOString();
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return normalizeDate(Number(value));
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

function normalizeRows(table, rows) {
  const dateColumns = new Set(table.dateColumns || []);
  return rows.map((row) => {
    const normalized = {};

    for (const column of table.columns) {
      normalized[column] = dateColumns.has(column) ? normalizeDate(row[column]) : row[column] ?? null;
    }

    return normalized;
  });
}

function sqlIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

function sqlLiteral(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  return `'${String(value).replaceAll("'", "''")}'`;
}

function insertSql(table, rows) {
  if (!rows.length) return `-- ${table.name}: 0 rows\n`;

  const columns = table.columns.map(sqlIdentifier).join(', ');
  const values = rows
    .map((row) => `(${table.columns.map((column) => sqlLiteral(row[column])).join(', ')})`)
    .join(',\n');

  return `INSERT INTO ${sqlIdentifier(table.name)} (${columns}) VALUES\n${values}\nON CONFLICT DO NOTHING;\n`;
}

function main() {
  mkdirSync(outputDir, { recursive: true });

  const exportedAt = new Date().toISOString();
  const data = {};
  const counts = {};

  for (const table of tables) {
    const rows = sqliteJson(`SELECT ${table.columns.map(sqlIdentifier).join(', ')} FROM ${sqlIdentifier(table.name)};`);
    data[table.name] = normalizeRows(table, rows);
    counts[table.name] = data[table.name].length;
  }

  const manifest = {
    exportedAt,
    source: dbPath,
    privacyMode: 'real-dev-db-data',
    excludedTables: ['Account', 'Session', 'VerificationToken', '_prisma_migrations'],
    counts,
  };

  const seedJsonPath = path.join(outputDir, 'seed.json');
  const manifestPath = path.join(outputDir, 'manifest.json');
  const seedSqlPath = path.join(outputDir, 'seed.sql');

  writeFileSync(seedJsonPath, `${JSON.stringify(data, null, 2)}\n`);
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const sql = [
    '-- Doglog real-data seed export from local prisma/dev.db.',
    '-- Contains PII approved for production demo seeding. Keep this file untracked.',
    'BEGIN;',
    'TRUNCATE TABLE "ServiceSession", "Consultation", "Observation", "CustomerServiceAccess", "Dog", "Customer", "Trainer", "User" RESTART IDENTITY CASCADE;',
    ...tables.map((table) => insertSql(table, data[table.name])),
    'COMMIT;',
    '',
  ].join('\n\n');

  writeFileSync(seedSqlPath, sql);

  console.log(`Wrote ${manifestPath}`);
  console.log(`Wrote ${seedJsonPath}`);
  console.log(`Wrote ${seedSqlPath}`);
  console.log(JSON.stringify(counts, null, 2));
}

main();
