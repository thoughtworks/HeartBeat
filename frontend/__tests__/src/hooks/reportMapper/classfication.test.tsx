import { classificationMapper } from '@src/hooks/reportMapper/classification'

describe('classification data mapper', () => {
  const mockClassificationRes = [
    {
      fieldName: 'FS Work Type',
      pairs: [
        {
          name: 'Feature Work - Planned',
          value: '57.14%',
        },
        {
          name: 'Operational Work - Planned',
          value: '35.71%',
        },
        {
          name: 'Feature Work - Unplanned',
          value: '7.14%',
        },
      ],
    },
  ]
  it('maps response Classification values to ui display value', () => {
    const expectedClassificationValues = [
      {
        id: 0,
        name: 'FS Work Type',
        valuesList: [
          { name: 'Feature Work - Planned', value: '57.14%' },
          { name: 'Operational Work - Planned', value: '35.71%' },
          { name: 'Feature Work - Unplanned', value: '7.14%' },
        ],
      },
    ]
    const mappedClassifications = classificationMapper(mockClassificationRes)

    expect(mappedClassifications).toEqual(expectedClassificationValues)
  })
})
