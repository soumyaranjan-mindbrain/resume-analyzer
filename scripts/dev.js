const { spawn } = require("child_process");
const net = require("net");

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

const services = [
  {
    name: "backend",
    command: process.platform === "win32" ? "cmd.exe" : "npm",
    args: process.platform === "win32"
      ? ["/c", "npm", "run", "dev", "--prefix", "Backend"]
      : ["run", "dev", "--prefix", "Backend"],
    defaultPort: 5000,
    portEnvKey: "PORT",
  },
  {
    name: "frontend",
    command: process.platform === "win32" ? "cmd.exe" : "npm",
    args: process.platform === "win32"
      ? ["/c", "npm", "run", "dev", "--prefix", "frontend"]
      : ["run", "dev", "--prefix", "frontend"],
    defaultPort: 5173,
    extraArgs: (port) => process.platform === "win32"
      ? ["/c", "npm", "run", "dev", "--prefix", "frontend", "--", "--port", String(port)]
      : ["run", "dev", "--prefix", "frontend", "--", "--port", String(port)],
  },
];

const children = [];
let shuttingDown = false;

function colorize(color, text) {
  return `${color}${text}${colors.reset}`;
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => resolve(false));
    server.listen({ port, host: "127.0.0.1" }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function findFreePort(startPort) {
  let port = startPort;
  while (!(await isPortFree(port))) {
    console.log(colorize(colors.yellow, `[port] ${port} is busy, trying ${port + 1}`));
    port += 1;
  }
  return port;
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

async function startService(service) {
  const port = await findFreePort(service.defaultPort);
  const env = { ...process.env };
  if (service.portEnvKey) {
    env[service.portEnvKey] = String(port);
  }

  const args = service.extraArgs ? service.extraArgs(port) : service.args;
  const child = spawn(service.command, args, {
    stdio: ["ignore", "pipe", "pipe"],
    env,
  });

  children.push(child);

  const label = service.name === "backend" ? colors.cyan : colors.green;
  const errLabel = service.name === "backend" ? colors.red : colors.magenta;

  child.stdout.on("data", (data) => {
    process.stdout.write(colorize(label, `[${service.name}:${port}] `) + data);
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(colorize(errLabel, `[${service.name}:${port} err] `) + data);
  });

  child.on("exit", (code) => {
    if (!shuttingDown) {
      console.log(colorize(colors.yellow, `[${service.name}:${port}] exited with code ${code}`));
      shutdown(code ?? 1);
    }
  });

  console.log(colorize(label, `[${service.name}] started on port ${port}`));
}

(async () => {
  console.log(colorize(colors.cyan, "Starting backend and frontend..."));
  await Promise.all(services.map(startService));
})();
