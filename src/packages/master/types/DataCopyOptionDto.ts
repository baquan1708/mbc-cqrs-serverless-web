/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DataCopyOptionDto = {
  /**
   * Whether to copy all master_data or only specific ones
   */
  mode: DataCopyOptionDto.mode;
  /**
   * Required only if mode is PARTIAL. List of master_data IDs to copy.
   */
  id?: Array<string>;
};
export namespace DataCopyOptionDto {
  /**
   * Whether to copy all master_data or only specific ones
   */
  export enum mode {
    ALL = 'ALL',
    PARTIAL = 'PARTIAL',
  }
}

