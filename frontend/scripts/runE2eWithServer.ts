import tcpPortUsed from 'tcp-port-used'
import path from 'path'
import process from 'process'

const PORT = {
  FE: 4321,
  BE: 4322,
  STUB: 4323,
}

const DIR = {
  FE: path.resolve(__dirname, '../'),
  BE: path.resolve(__dirname, '../../backend'),
  STUB: path.resolve(__dirname, '../../stubs'),
}

const main = async (args: string[]) => {
  const { $ } = await import('execa')

  const checkPorts = async () => {
    const ports = Object.values(PORT)
    const checkPorts = ports.map((port) => tcpPortUsed.check(port))

    const usingPorts = await Promise.all(checkPorts).then((result) => ports.filter((_, idx) => result[idx]))
    const availablePorts = ports.filter((port) => !usingPorts.includes(port))

    console.log(`E2E: Currently available ports: ${availablePorts.join(',')}`)

    return {
      availablePorts,
      usingPorts,
    }
  }

  const startFE = () => $({ cwd: DIR.FE, stderr: 'inherit', shell: true })`npm run start`

  const startBE = () =>
    $({
      cwd: DIR.BE,
      stderr: 'inherit',
      shell: true,
    })`./gradlew bootRun --args='--spring.profiles.active=local --MOCK_SERVER_URL=http://localhost:4323'`

  const startSTUB = () =>
    $({
      cwd: DIR.STUB,
      stderr: 'inherit',
      shell: true,
    })`docker-compose up`

  const startServices = async (availablePorts: number[]) => {
    if (availablePorts.length <= 0) {
      return []
    }

    const processes = availablePorts.map((port) => {
      switch (port) {
        case PORT.BE:
          console.log(`E2E: Try to start BE service`)
          return startBE()
        case PORT.FE:
          console.log(`E2E: Try to start FE service`)
          return startFE()
        case PORT.STUB:
          console.log(`E2E: Try to start STUB service`)
          return startSTUB()
      }
    })

    await Promise.all(
      availablePorts.map((port) =>
        tcpPortUsed
          .waitUntilUsed(port, 1000, 30000)
          .then(() => console.log(`E2E: Port ${port} is now started`))
          .catch((err) => {
            console.error(`E2E: Port ${port} start failed for reason ${err}`)
            process.exit(1)
          })
      )
    )

    return processes
  }

  const e2eCommand = args[0]

  const { availablePorts } = await checkPorts()
  const newlyStartProcesses = await startServices(availablePorts)
  const e2eProcess = $({ cwd: DIR.FE, stdout: 'inherit', stderr: 'inherit', shell: true })`${e2eCommand}`

  e2eProcess.on('close', (code: number, signal: string) => {
    console.log(`E2E: Testing done. Code: ${code}; signal: ${signal}.`)

    newlyStartProcesses.forEach((pro) => {
      console.log(`E2E: clean up process ${pro?.pid}`)
      pro?.kill()
    })

    process.exit()
  })
}

const [execPath, scriptPath, ...args] = process.argv

main(args)
