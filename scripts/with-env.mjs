#!/usr/bin/env node
/**
 * Runs a command with the environment for a given Sanity dataset.
 *
 *   node scripts/with-env.mjs <develop|prod> <command> [...args]
 *
 * It loads the root `.env`, layers `.env.<name>` on top, then derives the
 * `SANITY_STUDIO_*` variables Vite needs from their `SANITY_*` counterparts —
 * so the dataset is defined once, in one file, instead of being kept in sync
 * by hand across the web app and the Studio.
 *
 * Values already present in the real environment always win, which keeps cloud
 * builds (Vercel, CI) working unchanged: they inject env vars directly and
 * never call this script.
 */
import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Keep in sync with the SanityDataset enum in shared/types/base.ts. This file
// is plain ESM run by node directly, so it cannot import the TypeScript enum.
const DATASETS = ['develop', 'prod']

// SANITY_* -> SANITY_STUDIO_* pairs. Vite only exposes SANITY_STUDIO_-prefixed
// vars to the Studio bundle, so these have to exist under both names.
const DERIVED = {
  SANITY_PROJECT_ID: 'SANITY_STUDIO_PROJECT_ID',
}

/**
 * Minimal dotenv parser: `KEY=value`, with optional single/double quotes and
 * `\n` escapes inside double quotes (the GSC private key relies on this).
 */
function parseEnv(contents) {
  const parsed = {}

  for (const rawLine of contents.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separator = line.indexOf('=')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    if (!key) continue

    let value = line.slice(separator + 1).trim()

    if (value.startsWith('"') && value.endsWith('"') && value.length > 1) {
      value = value.slice(1, -1).replace(/\\n/g, '\n')
    } else if (
      value.startsWith("'") &&
      value.endsWith("'") &&
      value.length > 1
    ) {
      value = value.slice(1, -1)
    }

    parsed[key] = value
  }

  return parsed
}

function loadEnvFile(name, { required }) {
  const path = resolve(ROOT, name)

  if (!existsSync(path)) {
    if (required) {
      console.warn(
        `[with-env] ${name} not found — continuing without it. Copy ${name}.example to get started.`
      )
    }
    return {}
  }

  return parseEnv(readFileSync(path, 'utf8'))
}

const [datasetArg, ...command] = process.argv.slice(2)

if (!datasetArg || !DATASETS.includes(datasetArg)) {
  console.error(
    `[with-env] Expected a dataset (${DATASETS.join(' | ')}) as the first argument.\n` +
      '           Usage: node scripts/with-env.mjs <dataset> <command> [...args]'
  )
  process.exit(1)
}

if (command.length === 0) {
  console.error('[with-env] No command given.')
  process.exit(1)
}

const fileEnv = {
  ...loadEnvFile('.env', { required: false }),
  ...loadEnvFile(`.env.${datasetArg}`, { required: true }),
}

// Real environment wins over the files, so an inline override still works.
const env = { ...fileEnv, ...process.env }

// The dataset argument is the whole point of this script, so it overrides
// whatever the files or the shell say — under both names, or the Studio CLI
// would keep defaulting to a stale value left over in the shell.
env.SANITY_DATASET = datasetArg
env.SANITY_STUDIO_DATASET = datasetArg

for (const [source, target] of Object.entries(DERIVED)) {
  if (env[source] && !process.env[target]) {
    env[target] = env[source]
  }
}

// stderr, not stdout — the wrapped command's stdout is often piped
// (e.g. `turbo run build --dry=json`) and must stay machine-readable.
console.error(`[with-env] dataset=${datasetArg} → ${command.join(' ')}`)

const child = spawn(command[0], command.slice(1), {
  cwd: ROOT,
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

child.on('error', error => {
  console.error(`[with-env] Failed to start "${command[0]}":`, error.message)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
