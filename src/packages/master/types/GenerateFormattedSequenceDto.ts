/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SequenceParamsDto } from './SequenceParamsDto'
export type GenerateFormattedSequenceDto = {
  /**
   * Date for sequence generation.
   */
  date?: string
  rotateBy: GenerateFormattedSequenceDto.rotateBy
  tenantCode: string
  typeCode: string
  /**
   * Parameters for generating the sequence. code1, code2,code3, code4, code5
   */
  params: SequenceParamsDto
  /**
   * Optional prefix to prepend to the formatted sequence.
   */
  prefix?: string
  /**
   * Optional postfix to append to the formatted sequence.
   */
  postfix?: string
}
export namespace GenerateFormattedSequenceDto {
  export enum rotateBy {
    FISCAL_YEARLY = 'fiscal_yearly',
    YEARLY = 'yearly',
    MONTHLY = 'monthly',
    DAILY = 'daily',
    NONE = 'none',
  }
}
