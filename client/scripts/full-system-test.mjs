import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { io } from 'socket.io-client';

const SERVER_CWD = new URL('../../server/', import.meta.url);
const CLIENT_CWD = new URL('../', import.meta.url);
const SERVER_URL = 'http://localhost:5001';
const CLIENT_URL = 'http://localhost:3000';

const SERVER_START_PATTERN = /Server running in .* mode on port 5001/;
const CLIENT_START_PATTERN = /Ready in|started server on/i;

function logStep(message) {
  console.log(`\n[system-test] ${message}`);
}

function spawnNpm(command, cwdUrl) {
  const cwd = fileURLToPath(cwdUrl);
  const child = spawn('cmd.exe', ['/d', '/s', '/c', `npm run ${command}`], {
    cwd,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  return child;
}

async function waitForPattern(child, pattern, timeoutMs, name) {
  let buffer = '';
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`${name} did not become ready within ${timeoutMs}ms`));
    }, timeoutMs);

    function onData(chunk) {
      buffer += chunk;
      process.stdout.write(`[${name}] ${chunk}`);
      if (pattern.test(buffer)) {
        cleanup();
        resolve();
      }
    }

    function onExit(code) {
      cleanup();
      reject(new Error(`${name} exited early with code ${code}`));
    }

    function cleanup() {
      clearTimeout(timeout);
      child.stdout.off('data', onData);
      child.stderr.off('data', onData);
      child.off('exit', onExit);
    }

    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', onExit);
  });
}

async function fetchJsonOrText(url) {
  const response = await fetch(url);
  const text = await response.text();
  let body = text;
  try {
    body = JSON.parse(text);
  } catch {
    // Keep text body when JSON parsing fails.
  }
  return { response, body };
}

async function assertBackendChecks() {
  logStep('Checking backend health and core endpoints');
  const health = await fetch(`${SERVER_URL}/`);
  const healthText = await health.text();
  if (!health.ok || !healthText.includes('API is running successfully')) {
    throw new Error(`Backend health check failed: status=${health.status}`);
  }

  const publicRoutes = ['/api/services', '/api/blogs', '/api/gallery'];
  for (const path of publicRoutes) {
    const { response, body } = await fetchJsonOrText(`${SERVER_URL}${path}`);
    if (!response.ok) {
      throw new Error(`Expected 2xx for ${path}, got ${response.status}`);
    }
    if (typeof body !== 'object' || body === null || !('success' in body)) {
      throw new Error(`Unexpected response shape for ${path}`);
    }
    console.log(`[system-test] ${path} -> ${response.status}`);
  }

  const protectedRoute = await fetch(`${SERVER_URL}/api/history`);
  if (protectedRoute.status !== 401) {
    throw new Error(`Expected 401 for /api/history without token, got ${protectedRoute.status}`);
  }
  console.log('[system-test] /api/history unauthenticated -> 401 (expected)');
}

async function assertSocketChecks() {
  logStep('Checking realtime socket connection and admin channel event');
  await new Promise((resolve, reject) => {
    const socket = io(SERVER_URL, {
      transports: ['websocket'],
      timeout: 8000,
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      reject(new Error('Timed out waiting for realtime socket events'));
    }, 10000);

    function done(err) {
      clearTimeout(timeout);
      socket.disconnect();
      if (err) reject(err);
      else resolve();
    }

    socket.on('connect', () => {
      console.log(`[system-test] socket connected: ${socket.id}`);
      socket.emit('admin_join');
    });

    socket.on('active_chats_initial', (payload) => {
      if (!Array.isArray(payload)) {
        done(new Error('active_chats_initial payload is not an array'));
        return;
      }
      console.log(`[system-test] active_chats_initial received: ${payload.length} chats`);
      done();
    });

    socket.on('connect_error', (err) => {
      done(new Error(`Socket connection error: ${err.message}`));
    });
  });
}

async function assertFrontendChecks() {
  logStep('Checking frontend routes');
  const routes = ['/', '/gallery', '/blog', '/capabilities', '/admin'];
  for (const route of routes) {
    const res = await fetch(`${CLIENT_URL}${route}`);
    if (!res.ok) {
      throw new Error(`Frontend route ${route} returned ${res.status}`);
    }
    console.log(`[system-test] ${route} -> ${res.status}`);
  }
}

async function killProcessTree(child) {
  if (!child || child.killed) return;
  await new Promise((resolve) => {
    const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
      stdio: 'ignore',
    });
    killer.on('exit', () => resolve());
    killer.on('error', () => resolve());
  });
}

async function main() {
  let serverProcess;
  let clientProcess;

  try {
    logStep('Starting backend');
    serverProcess = spawnNpm('start', SERVER_CWD);
    await waitForPattern(serverProcess, SERVER_START_PATTERN, 20000, 'server');
    await delay(500);

    await assertBackendChecks();
    await assertSocketChecks();

    logStep('Building frontend for production check');
    await new Promise((resolve, reject) => {
      const build = spawnNpm('build', CLIENT_CWD);
      build.stdout.on('data', (chunk) => process.stdout.write(`[client-build] ${chunk}`));
      build.stderr.on('data', (chunk) => process.stderr.write(`[client-build] ${chunk}`));
      build.on('exit', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Client build failed with code ${code}`));
      });
      build.on('error', (err) => reject(err));
    });

    logStep('Starting frontend');
    clientProcess = spawnNpm('start', CLIENT_CWD);
    await waitForPattern(clientProcess, CLIENT_START_PATTERN, 20000, 'client');
    await delay(500);

    await assertFrontendChecks();
    logStep('All automated system checks passed');
  } finally {
    logStep('Cleaning up processes');
    await killProcessTree(clientProcess);
    await killProcessTree(serverProcess);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\n[system-test] FAILED: ${error.message}`);
    process.exit(1);
  });
