// /lib/constants/StagingUrlProvider.ts

import { IUrlProvider } from 'mbc-cqrs-serverless-web'

/**
 * A custom URL provider for the staging environment.
 * It prefixes all URLs with '/staging'.
 */
class TestUrlProvider implements IUrlProvider {
  protected readonly baseUrl: string

  public readonly SETTINGS_PAGE_URL: string
  public readonly ADD_SETTINGS_PAGE_URL: string
  public readonly EDIT_SETTINGS_PAGE_URL: string
  public readonly DATA_PAGE_URL: string
  public readonly ADD_DATA_PAGE_URL: string
  public readonly EDIT_DATA_PAGE_URL: string
  public readonly FAQ_CATEGORY_PAGE_URL: string
  public readonly TOP_URL: string

  constructor(segment: 'system_admin' | 'tenant') {
    // Add the /staging prefix to the base URL
    this.baseUrl = `/${segment}`

    this.SETTINGS_PAGE_URL = `${this.baseUrl}/master-setting`
    this.ADD_SETTINGS_PAGE_URL = `${this.baseUrl}/master-setting/new`
    this.EDIT_SETTINGS_PAGE_URL = this.SETTINGS_PAGE_URL
    this.DATA_PAGE_URL = `${this.baseUrl}/master-data`
    this.ADD_DATA_PAGE_URL = `${this.baseUrl}/master-data/new`
    this.EDIT_DATA_PAGE_URL = this.DATA_PAGE_URL
    this.FAQ_CATEGORY_PAGE_URL = `${this.baseUrl}/faq-category`
    this.TOP_URL = '/'
  }

  public getCopySettingPageUrl(id: string): string {
    return `${this.baseUrl}/master-setting/${id}/copy/new`
  }

  public getDetailedCopySettingPageUrl(id: string): string {
    return `${this.baseUrl}/master-setting/${id}/copy`
  }
}

export default TestUrlProvider
