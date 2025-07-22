import * as React from 'react'
import { CommonButton } from '.'

type Props = {
  onClickPrev?: () => void
  className?: string
}

/**
 * フォームのボタン一式を表示するブロック
 * @param param0
 * @returns
 */
export const BackButton = ({
  onClickPrev,
  className,
}: React.PropsWithChildren<Props>) => {
  return (
    <div className={`w-100 flex justify-evenly pb-3 pt-3 ${className ?? ''}`}>
      <CommonButton
        variant="outline"
        onClick={onClickPrev}
        className="min-w-[200px] shadow-[0px_4px_8px_#00000065]"
      >
        戻る
      </CommonButton>
    </div>
  )
}
