import { SettingAttrFields } from '../../types'

export const defaultSettingFields: SettingAttrFields[] = [
  {
    physicalName: 'code',
    name: 'コード',
    description: '',
    dataType: 'string',
    defaultValue: '',
    isRequired: true,
    isShowedOnList: true,
    length: '255',
  },
  {
    physicalName: 'name',
    name: '名称',
    description: '',
    dataType: 'string',
    isRequired: true,
    isShowedOnList: true,
    length: '255',
  },
  {
    physicalName: 'seq',
    name: '並び順',
    description: '',
    dataType: 'number',
    defaultValue: '',
    isRequired: false,
    isShowedOnList: true,
  },
]

export const defaultPhysicalSettingField = defaultSettingFields.map(
  (field) => field.physicalName
)
