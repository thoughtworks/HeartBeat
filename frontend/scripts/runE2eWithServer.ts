import tcpPortUsed from 'tcp-port-used'
import path from 'path'
import process from 'process'

const PORT = {
  FRONT_END: 4321,
  BACK_END: 4322,
  STUB: 4323,
}

const DIR = {
  FRONT_END: path.resolve(__dirname, '../'),
  BACK_END: path.resolve(__dirname, '../../backend'),
  STUB: path.resolve(__dirname, '../../stubs'),
}

const main = async (args: string[]) => {
  const { $ } = await import('execa')

  const checkPorts = async () => {
    const ports = Object.values(PORT)
    const checkPorts = ports.map((port) => tcpPortUsed.check(port, 'localhost'))
    const checkingResult = await Promise.all(checkPorts)
    const usingPorts = ports.filter((_, idx) => checkingResult[idx])
    const availablePorts = ports.filter((port) => !usingPorts.includes(port))

    console.log(`Successfully detect available ports: ${availablePorts.join(',')}`)

    return {
      availablePorts,
      usingPorts,
    }
  }

  const startFE = () => $({ cwd: DIR.FRONT_END, stderr: 'inherit', shell: true })`pnpm run start`

  const startBE = () =>
    $({
      cwd: DIR.BACK_END,
      stderr: 'inherit',
      shell: true,
    })`./gradlew bootRun --args='--spring.profiles.active=local --MOCK_SERVER_URL=http://localhost:4323'`

  const startSTUB = () =>
    $({
      cwd: DIR.STUB,
      stderr: 'inherit',
      shell: true,
    })`docker-compose up`

  const waitForPort = async (port: number) => {
    try {
      await tcpPortUsed.waitUntilUsedOnHost(port, 'localhost', 1000, 30000)
      console.log(`Successfully run service on port ${port}`)
    } catch (err) {
      console.error(`Failed to run service on port ${port} for reason ${err}`)
      process.exit(1)
    }
  }

  const startServices = async (availablePorts: number[]) => {
    if (availablePorts.length <= 0) {
      return []
    }

    const processes = availablePorts.map((port) => {
      switch (port) {
        case PORT.BACK_END:
          console.log(`Start to run back-end service`)
          return startBE()
        case PORT.FRONT_END:
          console.log(`Start to run front-end service`)
          return startFE()
        case PORT.STUB:
          console.log(`Start to run stub service`)
          return startSTUB()
      }
    })

    await Promise.all(availablePorts.map(waitForPort))

    return processes
  }

  const e2eCommand = args[0]

  const { availablePorts } = await checkPorts()
  const newlyStartProcesses = await startServices(availablePorts)
  const e2eProcess = $({ cwd: DIR.FRONT_END, stdout: 'inherit', stderr: 'inherit', shell: true })`${e2eCommand}`

  e2eProcess.on('close', (code: number, signal: string) => {
    if (code === 0) {
      console.log(`Successfully finish E2E testing. Code: ${code}; signal: ${signal}.`)
    } else {
      console.log(`Failed to run E2E testing. Code: ${code}; signal: ${signal}.`)
    }

    newlyStartProcesses.forEach((pro) => {
      console.log(`Start to clean up process ${pro?.pid}`)
      pro?.kill()
    })

    process.exit(code)
  })
}

const [_, __, ...args] = process.argv

main(args)
