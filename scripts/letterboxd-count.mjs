#!/usr/bin/env node
/**
 * Reads Adam's total logged-film count from Letterboxd and writes public/letterboxd.json.
 *
 * Letterboxd has no public API, so this parses the profile page. That means a
 * Letterboxd redesign can break it. The design rule here is: NEVER write a number
 * this script is not confident about. If parsing or validation fails, it exits
 * non-zero and leaves the existing JSON untouched, so the site keeps showing the
 * last known-good count instead of a wrong one.
 *
 * Usage:
 *   node scripts/letterboxd-count.mjs            write public/letterboxd.json
 *   node scripts/letterboxd-count.mjs --dry-run  print what it found, write nothing
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const USER = 'ACWArob'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'letterboxd.json')
const DRY = process.argv.includes('--dry-run')

const UA = 'acwa-portfolio-filmcount/1.0 (+https://acwa-portfolio.netlify.app)'

function fail(msg) {
  console.error(`FAIL: ${msg}`)
  console.error('Leaving public/letterboxd.json untouched. The site keeps the last known-good count.')
  process.exit(1)
}

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } })
  if (!res.ok) throw new Error(`${url} returned ${res.status}`)
  return res.text()
}

/**
 * Strategy 1: the profile page statistics block.
 * Expected shape: <span class="value">1,043</span> <span class="definition">Films</span>
 * Order is sometimes reversed, so both directions are tried.
 */
function fromProfile(html) {
  const forward = html.match(
    /<span[^>]*class="[^"]*\bvalue\b[^"]*"[^>]*>\s*([\d,]+)\s*<\/span>\s*<span[^>]*class="[^"]*\bdefinition\b[^"]*"[^>]*>\s*Films\s*<\/span>/i
  )
  if (forward) return forward[1]

  const reverse = html.match(
    /<span[^>]*class="[^"]*\bdefinition\b[^"]*"[^>]*>\s*Films\s*<\/span>\s*<span[^>]*class="[^"]*\bvalue\b[^"]*"[^>]*>\s*([\d,]+)\s*<\/span>/i
  )
  if (reverse) return reverse[1]

  return null
}

/**
 * Strategy 2: the /films/ page heading, e.g. "1,043 Films" or "1,043 films".
 * Only accepts a match where the number and the word are adjacent, to avoid
 * grabbing an unrelated figure from elsewhere on the page.
 */
function fromFilmsPage(html) {
  const m = html.match(/>\s*([\d,]{1,7})\s*<\/?[^>]*>?\s*[Ff]ilms\b/)
  return m ? m[1] : null
}

function toInt(raw) {
  if (!raw) return null
  const n = Number.parseInt(String(raw).replace(/,/g, ''), 10)
  return Number.isFinite(n) ? n : null
}

function readPrevious() {
  try {
    const prev = JSON.parse(readFileSync(OUT, 'utf8'))
    return typeof prev.films === 'number' ? prev : null
  } catch {
    return null
  }
}

const previous = readPrevious()

let count = null
let source = null

try {
  count = toInt(fromProfile(await get(`https://letterboxd.com/${USER}/`)))
  if (count) source = 'profile page'
} catch (err) {
  console.error(`profile page unavailable: ${err.message}`)
}

if (!count) {
  try {
    count = toInt(fromFilmsPage(await get(`https://letterboxd.com/${USER}/films/`)))
    if (count) source = 'films page'
  } catch (err) {
    console.error(`films page unavailable: ${err.message}`)
  }
}

if (!count) {
  fail('could not parse a film count from either page. Letterboxd markup has probably changed.')
}

// Sanity checks. A logged-film total only ever goes up, and it is not in the millions.
if (count < 1 || count > 100000) {
  fail(`parsed ${count}, which is outside the plausible range. Refusing to write it.`)
}

if (previous && count < previous.films) {
  fail(
    `parsed ${count}, which is LOWER than the stored ${previous.films}. ` +
    'A watched-film total does not go down, so this is almost certainly the wrong element on the page.'
  )
}

console.log(`Parsed ${count} films from the ${source}.`)
if (previous) console.log(`Previous stored value: ${previous.films}.`)

if (DRY) {
  console.log('Dry run, nothing written.')
  process.exit(0)
}

if (previous && previous.films === count) {
  console.log('Unchanged. Nothing to write.')
  process.exit(0)
}

const payload = {
  films: count,
  source: `https://letterboxd.com/${USER}/`,
  updated: new Date().toISOString().slice(0, 10),
}

writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n')
console.log(`Wrote public/letterboxd.json: ${previous ? previous.films : 'none'} -> ${count}`)
