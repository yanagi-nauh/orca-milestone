import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { test } from 'node:test'
import { resolveOrcaCli } from '../src/orca-cli.mjs'
import { makeHome } from './helpers.mjs'

async function place(path) {
  await mkdir(join(path, '..'), { recursive: true })
  await writeFile(path, '')
  return path
}

test('on macOS the CLI is the one in the app bundle, else orca on PATH', async () => {
  const root = await makeHome()
  const execPath = join(root, 'Orca.app', 'Contents', 'MacOS', 'Orca')
  assert.equal(resolveOrcaCli(execPath, 'darwin'), 'orca')
  const bundled = await place(join(root, 'Orca.app', 'Contents', 'Resources', 'bin', 'orca'))
  assert.equal(resolveOrcaCli(execPath, 'darwin'), bundled)
})

test('on Linux the CLI is orca-ide in the app, else orca-ide on PATH, never the screen reader', async () => {
  const root = await makeHome()
  const execPath = join(root, 'orca-ide')
  assert.equal(resolveOrcaCli(execPath, 'linux'), 'orca-ide')
  const bundled = await place(join(root, 'resources', 'bin', 'orca-ide'))
  assert.equal(resolveOrcaCli(execPath, 'linux'), bundled)
})
