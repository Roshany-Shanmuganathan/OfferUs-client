const { spawn } = require('child_process');

const buildProcess = spawn('next', ['build'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
});

let stdoutBuffer = '';
let stderrBuffer = '';

// Helper function to filter warnings from output
function filterWarnings(text) {
  const lines = text.split(/\r?\n/);
  return lines
    .filter(line => !(line.includes('baseline-browser-mapping') && line.includes('over two months old')))
    .join('\n');
}

// Handle stdout
buildProcess.stdout.on('data', (data) => {
  stdoutBuffer += data.toString();
  const lines = stdoutBuffer.split(/\r?\n/);
  stdoutBuffer = lines.pop() || ''; // Keep incomplete line in buffer
  
  lines.forEach(line => {
    if (!(line.includes('baseline-browser-mapping') && line.includes('over two months old'))) {
      process.stdout.write(line + '\n');
    }
  });
});

// Handle stderr
buildProcess.stderr.on('data', (data) => {
  stderrBuffer += data.toString();
  const lines = stderrBuffer.split(/\r?\n/);
  stderrBuffer = lines.pop() || ''; // Keep incomplete line in buffer
  
  lines.forEach(line => {
    if (!(line.includes('baseline-browser-mapping') && line.includes('over two months old'))) {
      process.stderr.write(line + '\n');
    }
  });
});

// Flush remaining buffers on close
buildProcess.stdout.on('end', () => {
  if (stdoutBuffer && !(stdoutBuffer.includes('baseline-browser-mapping') && stdoutBuffer.includes('over two months old'))) {
    process.stdout.write(stdoutBuffer);
  }
});

buildProcess.stderr.on('end', () => {
  if (stderrBuffer && !(stderrBuffer.includes('baseline-browser-mapping') && stderrBuffer.includes('over two months old'))) {
    process.stderr.write(stderrBuffer);
  }
});

buildProcess.on('close', (code) => {
  process.exit(code);
});

buildProcess.on('error', (error) => {
  console.error('Build process error:', error);
  process.exit(1);
});
