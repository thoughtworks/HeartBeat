import { classificationMapper } from '@src/mapper/ClassificationMapper'

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
        id: 1,
        name: 'FS Work Type',
        values: [
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
