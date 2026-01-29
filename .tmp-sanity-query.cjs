const fs = require('fs')
const { createClient } = require('@sanity/client')

const env = fs.readFileSync('.env', 'utf8').split(/\r?\n/)
for (const line of env) {
  if (!line || line.startsWith('#') || !line.includes('=')) continue
  const i = line.indexOf('=')
  const key = line.slice(0, i).trim()
  let val = line.slice(i + 1).trim()
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1)
  }
  process.env[key] = val
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'published',
  ...(process.env.SANITY_API_READ_TOKEN
    ? { token: process.env.SANITY_API_READ_TOKEN }
    : {}),
})

const query = '{"projectCount": count(*[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))])}'

client
  .fetch(query)
  .then(res => {
    console.log(JSON.stringify(res, null, 2))
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
