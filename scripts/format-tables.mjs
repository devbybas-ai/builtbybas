#!/usr/bin/env node
/**
 * Markdown Table Formatter
 * Reads markdown files and aligns all table columns for consistent formatting.
 * Used for document format enforcement across all Rosario project docs.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

const FILES = [
  'docs/TESTING-PLAN.md',
  'docs/AGENT-PERSONAS.md',
  'docs/AGENT-PERFORMANCE.md',
  'docs/DIRECTORY-STRUCTURE.md',
  'docs/SITEMAP.md',
  'docs/DOCUMENT-INDEX.md',
  'docs/HANDOFF.md',
  'AUDIT.md',
  'RAI-POLICY.md',
  'PROJECT-SETUP.md',
  '.claude/CLAUDE.md',
];

function formatTable(lines) {
  // Parse cells from each line
  const rows = lines.map(line => {
    // Remove leading/trailing pipes and split
    const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    return trimmed.split('|').map(cell => cell.trim());
  });

  // Determine max width per column
  const colCount = rows[0].length;
  const maxWidths = Array(colCount).fill(0);

  for (const row of rows) {
    for (let i = 0; i < colCount && i < row.length; i++) {
      // For separator rows (---), don't count them for width
      if (!/^[-:]+$/.test(row[i])) {
        maxWidths[i] = Math.max(maxWidths[i], row[i].length);
      }
    }
  }

  // Ensure minimum width of 3 for separator dashes
  for (let i = 0; i < colCount; i++) {
    maxWidths[i] = Math.max(maxWidths[i], 3);
  }

  // Rebuild each line with padding
  return rows.map(row => {
    const cells = [];
    for (let i = 0; i < colCount; i++) {
      const cell = (i < row.length) ? row[i] : '';
      if (/^[-:]+$/.test(cell)) {
        // Separator row — fill with dashes
        cells.push('-'.repeat(maxWidths[i]));
      } else {
        // Content row — pad with spaces
        cells.push(cell.padEnd(maxWidths[i]));
      }
    }
    return '| ' + cells.join(' | ') + ' |';
  });
}

function formatMarkdownTables(content) {
  const lines = content.split('\n');
  const result = [];
  let tableBuffer = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = /^\s*\|/.test(line) && line.trim().includes('|');

    if (isTableLine) {
      tableBuffer.push(line);
      inTable = true;
    } else {
      if (inTable && tableBuffer.length >= 2) {
        // Format the collected table
        const formatted = formatTable(tableBuffer);
        result.push(...formatted);
      } else if (tableBuffer.length > 0) {
        // Not really a table, push as-is
        result.push(...tableBuffer);
      }
      tableBuffer = [];
      inTable = false;
      result.push(line);
    }
  }

  // Handle table at end of file
  if (inTable && tableBuffer.length >= 2) {
    const formatted = formatTable(tableBuffer);
    result.push(...formatted);
  } else if (tableBuffer.length > 0) {
    result.push(...tableBuffer);
  }

  return result.join('\n');
}

// Process each file
let totalFormatted = 0;

for (const relPath of FILES) {
  const fullPath = resolve(ROOT, relPath);
  try {
    const original = readFileSync(fullPath, 'utf-8');
    const formatted = formatMarkdownTables(original);

    if (original !== formatted) {
      writeFileSync(fullPath, formatted, 'utf-8');
      console.log(`✓ Formatted: ${relPath}`);
      totalFormatted++;
    } else {
      console.log(`  No changes: ${relPath}`);
    }
  } catch (err) {
    console.error(`✗ Error processing ${relPath}: ${err.message}`);
  }
}

console.log(`\nDone. ${totalFormatted} file(s) formatted.`);
