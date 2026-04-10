import { spawn } from 'node:child_process';

const existingNodeOptions = process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : '';
const env = {
  ...process.env,
  NODE_OPTIONS: `${existingNodeOptions}--disable-warning=DEP0169`.trim(),
};

const child = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  env,
  shell: true,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

