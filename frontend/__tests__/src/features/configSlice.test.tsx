import configReducer, { updateProjectName } from '@src/features/config/configSlice'

describe('config reducer', () => {
  it('should be empty project name when init render config page', () => {
    const config = configReducer(undefined, { type: 'unknown' })

    expect(config.projectName).toEqual('')
  })

  it('should update project name when change project name input', () => {
    const config = configReducer(
      {
        projectName: '',
      },
      updateProjectName('mock project name')
    )

    expect(config.projectName).toEqual('mock project name')
  })
})
