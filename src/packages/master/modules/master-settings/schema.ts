export const sampleSettingJson = JSON.stringify([
  {
    code: '',
    name: '',
    attributes: {
      description: '',
      fields: [
        {
          physicalName: '',
          name: '',
          description: '',
          dataType: '',
          min: '',
          max: '',
          length: '',
          maxRow: 1,
          defaultValue: '',
          isRequired: false,
          isShowedOnList: false,
        },
      ],
    },
  },
])

const isObject = (data: any) => {
  return typeof data === 'object' && !Array.isArray(data) && data !== null
}
const isArray = (data: any) => {
  return typeof data === 'object' && Array.isArray(data) && data !== null
}

export const isValidSettingJson = (data: any) => {
  if (!isArray(data)) {
    return false
  }
  for (const item of data) {
    if (!isObject(item)) {
      return false
    }
    if (!item?.code || !item?.name || !item?.attributes) {
      return false
    }
    if (!isObject(item.attributes)) {
      return false
    }
    const attrs = item.attributes
    if (!attrs?.fields || !isArray(attrs.fields)) {
      return false
    }
    for (const field of attrs.fields) {
      if (
        !field?.physicalName ||
        !field?.name ||
        !field?.dataType ||
        typeof field?.isRequired !== 'boolean' ||
        typeof field?.isShowedOnList !== 'boolean'
      ) {
        return false
      }
    }
  }
  return true
}
