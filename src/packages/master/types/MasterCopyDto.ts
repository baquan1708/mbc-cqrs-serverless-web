/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataCopyOptionDto } from './DataCopyOptionDto'
export type MasterCopyDto = {
  /**
   * The ID of the master_setting to copy from
   */
  masterSettingId: string
  /**
   * Target tenants as an array of tenant codes
   */
  targetTenants: Array<string>
  /**
   * What to copy: only setting, only data, or both
   */
  copyType: MasterCopyDto.copyType
  /**
   * Options for data copy (required when copyType is DATA_ONLY or BOTH)
   */
  dataCopyOption?: DataCopyOptionDto
}
export namespace MasterCopyDto {
  /**
   * What to copy: only setting, only data, or both
   */
  export enum copyType {
    SETTING_ONLY = 'SETTING_ONLY',
    DATA_ONLY = 'DATA_ONLY',
    BOTH = 'BOTH',
  }
}
