import fetch from 'node-fetch';
import process from 'process';
import path from 'path';

const LOCALHOST_LIST = ['http://127.0.0.1', 'http://localhost'];
const WAIT_TIMEOUT = 30000;
const WAIT_INTERVAL = 3000;

const HEALTH_ENDPOINT_SUFFIX = {
  FRONT_END: ':4321/',
  BACK_END: ':4322/api/v1/health',
  STUB: ':4323/health',
};

const DIR = {
  FRONT_END: path.resolve(__dirname, '../'),
  BACK_END: path.resolve(__dirname, '../../backend'),
  STUB: path.resolve(__dirname, '../../stubs'),
};

const main = async (args: string[]) => {
  const { $ } = await import('execa');

  const healthCheck = async (suffix: string) => {
    const requests = LOCALHOST_LIST.map((host) => healthCheckUrl(`${host}${suffix}`));
    const results = await Promise.all(requests);

    return results.some((res) => res);
  };

  const healthCheckUrl = (url: string) =>
    new Promise((resolve) =>
      fetch(url)
        .then((response) => {
          if (response.ok) {
            console.log(`Successfully detected service health at ${url}`);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => resolve(false)),
    );

  const checkEndpoints = async () => {
    const endpoints = Object.values(HEALTH_ENDPOINT_SUFFIX);
    const checkEndpoints = endpoints.map((url) => healthCheck(url));
    const checkingResult = await Promise.all(checkEndpoints);
    const healthyEndpoints = endpoints.filter((_, idx) => checkingResult[idx]);
    const unhealthyEndpoints = endpoints.filter((name) => !healthyEndpoints.includes(name));

    return {
      unhealthyEndpoints,
      healthyEndpoints,
    };
  };

  const startFE = () => $({ cwd: DIR.FRONT_END, stderr: 'inherit', shell: true })`pnpm run start`;

  const startBE = () =>
    $({
      cwd: DIR.BACK_END,
      stderr: 'inherit',
      shell: true,
    })`./gradlew bootRun --args='--spring.profiles.active=local --MOCK_SERVER_URL=http://localhost:4323'`;

  const startSTUB = () =>
    $({
      cwd: DIR.STUB,
      stderr: 'inherit',
      shell: true,
    })`docker-compose up`;

  const waitForUrl = (url: string) =>
    new Promise((resolve) => {
      const startTime = Date.now();
      const check = () => {
        healthCheck(url).then((result) => {
          if (result) {
            resolve(true);
            return;
          }

          const elapsedTime = Date.now() - startTime;
          if (elapsedTime < WAIT_TIMEOUT) {
            setTimeout(check, WAIT_INTERVAL);
          } else {
            console.error(`Failed to detect service health at ${url}`);
            process.exit(1);
          }
        });
      };

      check();
    });

  const startServices = async (unhealthyEndpoints: string[]) => {
    if (unhealthyEndpoints.length <= 0) {
      return [];
    }

    const processes = unhealthyEndpoints.map((name) => {
      switch (name) {
        case HEALTH_ENDPOINT_SUFFIX.BACK_END:
          console.log(`Start to run back-end service`);
          return startBE();
        case HEALTH_ENDPOINT_SUFFIX.FRONT_END:
          console.log(`Start to run front-end service`);
          return startFE();
        case HEALTH_ENDPOINT_SUFFIX.STUB:
          console.log(`Start to run stub service`);
          return startSTUB();
        default:
          console.error(`Failed to run service: ${name}`);
      }
    });

    await Promise.all(unhealthyEndpoints.map((url) => waitForUrl(url)));

    return processes;
  };

  const e2eCommand = args[0];

  console.log('Start to check E2E rely on services');
  const { unhealthyEndpoints } = await checkEndpoints();
  const newlyStartProcesses = await startServices(unhealthyEndpoints);

  console.log('Start to run E2E');
  const e2eProcess = $({ cwd: DIR.FRONT_END, stdout: 'inherit', stderr: 'inherit', shell: true })`${e2eCommand}`;

  e2eProcess.on('close', (code: number, signal: string) => {
    if (code === 0) {
      console.log(`Successfully finish E2E testing. Code: ${code}; signal: ${signal}.`);
    } else {
      console.error(`Failed to run E2E testing. Code: ${code}; signal: ${signal}.`);
    }

    newlyStartProcesses.forEach((pro) => {
      console.log(`Start to clean up process ${pro?.pid}`);
      pro?.kill();
    });

    process.exit(code);
  });
};

const args = process.argv.slice(2);

main(args);
