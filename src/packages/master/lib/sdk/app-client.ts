import axios, { AxiosInstance } from 'axios'
import { UnauthorizedException } from '../../exceptions/exception'
import { Auth, withSSRContext } from 'aws-amplify'
import { GetServerSidePropsContext } from 'next'

/**
 * トークンのハンドラ、基底クラス
 */
export abstract class TokenHandlerBase {
  public constructor(protected serverSideContext?: GetServerSidePropsContext) {}

  /**
   * ハンドラクラスを取得
   * @param serverSideContext
   * @returns
   */
  public static init(
    serverSideContext?: GetServerSidePropsContext
  ): TokenHandlerBase {
    // テスト環境の場合、テスト用のTokenHandlerを返す
    if (process.env.NEXT_PUBLIC_ENV_PLAYWRIGHT === 'true') {
      return new TestTokenHandler(serverSideContext)
    }
    // それ以外は通常
    return new DefaultTokenHandler(serverSideContext)
  }
  public abstract getToken(): Promise<string>
}

/**
 * 通常の場合のTokenHandler
 */
export class DefaultTokenHandler extends TokenHandlerBase {
  public async getToken(): Promise<string> {
    // サーバーサイドの処理の場合
    if (!!this.serverSideContext) {
      const { Auth: AuthSSR } = withSSRContext({
        req: this.serverSideContext.req,
      })
      return (await AuthSSR.currentSession()).getIdToken().getJwtToken()
    } else {
      return (await Auth.currentSession()).getIdToken().getJwtToken()
    }
  }
}

/**
 * テストの場合のTokenHandler
 */
export class TestTokenHandler extends TokenHandlerBase {
  public async getToken(): Promise<string> {
    return 'test'
  }
}

export class AppClient {
  private static instance: AxiosInstance

  public static getAppClientInstance(
    token?: string | (() => Promise<string>),
    headers?: Record<string, string>
  ): AxiosInstance {
    if (!AppClient.instance) {
      AppClient.instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_MASTER_API_BASE,
        headers: {
          ...headers,
        },
      })
    }
    AppClient.instance.interceptors.request.use(
      async (config) => {
        let tokenString = ''
        if (token) {
          tokenString = typeof token === 'string' ? token : await token()
        }
        config.headers.Authorization = `Bearer ${tokenString}`
        return config
      },
      (error) => Promise.reject(error)
    )
    return AppClient.instance
  }
}

export const getClientInstance = (headers?: Record<string, string>) => {
  const tokenHandler = TokenHandlerBase.init()

  const token = () =>
    tokenHandler
      .getToken()
      .then((token) => token)
      .catch((err) => {
        const error = new UnauthorizedException(
          null,
          err,
          'アクセストークンの取得に失敗しました。認証が切れています。'
        )
        return Promise.reject(error)
      })
  return AppClient.getAppClientInstance(token, headers)
}
