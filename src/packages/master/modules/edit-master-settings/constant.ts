export const statusLabelMap: Record<string, string> = {
  CREATED: '作成済み',
  QUEUED: 'キュー待ち',
  PROCESSING: '処理中',
  STARTED: '開始済み',
  FINISHED: '完了',
  COMPLETED: '終了',
  ERRORED: 'エラー発生',
  FAILED: '失敗',
}

export const statusClassMap: Record<string, string> = {
  CREATED: '!bg-[#DBEAFE] !text-[#1E3A8A] !border-[#93C5FD]', // blue-100 bg / blue-800 text / blue-300 border
  QUEUED: '!bg-[#E0E7FF] !text-[#3730A3] !border-[#A5B4FC]', // indigo-100 / indigo-800 / indigo-300
  PROCESSING: '!bg-[#FEF9C3] !text-[#92400E] !border-[#FDE68A]', // yellow-100 / yellow-800 / yellow-300
  STARTED: '!bg-[#CCFBF1] !text-[#115E59] !border-[#5EEAD4]', // teal-100 / teal-800 / teal-300
  FINISHED: '!bg-[#DCFCE7] !text-[#166534] !border-[#86EFAC]', // green-100 / green-800 / green-300
  COMPLETED: '!bg-[#BBF7D0] !text-[#14532D] !border-[#4ADE80]', // green-200 / green-900 / green-400
  ERRORED: '!bg-[#FFEDD5] !text-[#C2410C] !border-[#FDBA74]', // orange-100 / orange-800 / orange-300
  FAILED: '!bg-[#FECACA] !text-[#991B1B] !border-[#FCA5A5]', // red-100 / red-800 / red-300
}