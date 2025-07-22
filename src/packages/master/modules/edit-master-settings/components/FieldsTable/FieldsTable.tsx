import {
  closestCenter,
  DndContext,
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Edit3,
  GripVertical,
  Loader2,
  MoreVertical,
  Trash2,
} from 'lucide-react'
import * as React from 'react'
import { defaultPhysicalSettingField } from '../../settingFields'
import { MasterRdsEntity } from '../../../../types/MasterRdsEntity'
import { SettingAttrFields } from '../../../../types'
import { formatDate } from '../../../../lib/utils/datetime'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu'

export function SortableRow({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    position: isDragging ? 'relative' : 'static',
    backgroundColor: isDragging && 'white',
  }

  const updatedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childElement = child as React.ReactElement<any>
      const dragHandle = childElement.props.children

      if (
        React.isValidElement(dragHandle) &&
        typeof dragHandle.props === 'object' &&
        dragHandle.props?.['data-drag-handle']
      ) {
        return React.cloneElement(childElement, {
          ...childElement.props,
          children: React.cloneElement(dragHandle, {
            ...(dragHandle.props || {}),
            ...listeners,
            ...attributes,
          }),
        })
      }

      return childElement
    }

    return child
  })

  return (
    <TableRow ref={setNodeRef} style={style}>
      {updatedChildren}
    </TableRow>
  )
}

const DataType = {
  string: '文字列',
  number: '数値',
  auto_number: '自動採番',
  json: 'JSON',
  date: '日付',
  'text-area': 'テキストエリア',
  'text-html': 'HTML形式',
  'text-markdown': 'Markdown形式',
  array: '文字列(配列)',
}
interface Props {
  disabled?: boolean
  isFetching?: boolean
  data?: SettingAttrFields[]
  onEditField: (index: number) => void
  onDeletedField: (index: number) => void
  sensors?: SensorDescriptor<SensorOptions>[]
  handleDragEnd?: (event: DragEndEvent) => void
  formatOptions: MasterRdsEntity[]
}

export default function FieldsTable({
  disabled,
  isFetching,
  data,
  onEditField,
  onDeletedField,
  sensors,
  handleDragEnd,
  formatOptions,
}: Props) {
  const columns: {
    title: React.ReactNode
    dataIndex?: any
    className?: string
    headClassName?: string
    align?: 'center' | 'right' | 'left'
    render?: (record: any) => React.ReactNode
  }[] = [
    // {
    //   title: '',
    //   align: 'center' as const,
    //   headClassName: 'w-[48px] sticky left-0',
    //   className: 'w-[48px] sticky left-0',
    //   render: (_: any) => (
    //     <div className="cursor-grab" data-drag-handle>
    //       <GripVertical className="mx-auto text-muted-foreground" size={16} />
    //     </div>
    //   ),
    // },
    {
      title: 'コード',
      dataIndex: 'physicalName',
      headClassName: ' sticky left-[52px] bg-emphasis w-[170px]',
      className: 'sticky w-[170px] left-[52px]  word-wrap bg-background',
      render: (record: any) => (
        <div className="w-[150px] truncate text-center">
          {record.physicalName}
        </div>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      headClassName:
        "sticky w-[170px] left-[222px] bg-emphasis after:content-[''] after:w-[30px] after:block after:absolute after:top-0 after:bottom-0 after:right-0 after:[box-shadow:inset_10px_0_8px_-8px_rgba(5,5,5,0.06)] after:translate-x-[100%]",
      className:
        "sticky w-[170px] left-[222px]  word-wrap pr-[30px] bg-background after:content-[''] after:w-[30px] after:block after:absolute after:top-0 after:bottom-0 after:right-0 after:[box-shadow:inset_10px_0_8px_-8px_rgba(5,5,5,0.06)] after:translate-x-[100%]",
      render: (record: any) => (
        <div className="w-[150px] truncate text-center">{record.name}</div>
      ),
    },

    {
      title: '説明',
      dataIndex: 'description',
      render: (record: any) => (
        <div className="max-w-[150px] truncate text-center">
          {record.description}
        </div>
      ),
    },
    {
      title: 'データ型',
      dataIndex: 'dataType',
      render: (record: any) => {
        return <div className="text-center">{DataType[record?.dataType]}</div>
      },
    },
    {
      title: 'フォーマット',
      dataIndex: 'dataFormat',
      render: (record: any) => {
        return (
          <div className="whitespace-nowrap text-nowrap text-center">
            {DataType[record?.dataType] === DataType.auto_number
              ? `${
                  formatOptions.find((el) => {
                    if (record['formatCode']) {
                      return el.sk === record['formatCode']
                    } else {
                      return el.sk === record['dataFormat']
                    }
                  })?.name
                }`
              : ''}
          </div>
        )
      },
    },
    {
      title: (
        <div className="w-full text-center">
          <div>Min/Max</div>
          <div>文字数</div>
        </div>
      ),
      render: (record: any) => (
        <div className="text-center">
          {record?.length ? (
            record.length
          ) : record?.min && record?.max ? (
            `${record?.min} ~ ${record?.max}`
          ) : (
            <></>
          )}
        </div>
      ),
    },
    // {
    //   title: '最大行数',
    //   dataIndex: 'maxRow',
    //   align: 'center',
    // },
    {
      title: 'デフォルト値',
      dataIndex: 'defaultValue',
      render: (record: any) => (
        <div className="max-w-[200px] truncate text-center">
          {record?.dataType === 'date'
            ? formatDate(record?.defaultValue)
            : record?.dataType === 'boolean'
              ? `${record?.defaultValue}`
              : record?.defaultValue}
        </div>
      ),
    },
    {
      title: '必須',
      dataIndex: 'isRequired',
      align: 'center',
      render: (record: any) => (record.isRequired ? '◯' : <></>),
    },
    {
      title: '一覧表示',
      dataIndex: 'isShowedOnList',
      align: 'center',
      render: (record: any) => (record.isShowedOnList ? '◯' : <></>),
    },
  ]

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table className="bg-white">
          <TableHeader>
            <TableRow className="bg-emphasis hover:bg-emphasis">
              <TableHead className="sticky left-0 w-[52px] whitespace-nowrap bg-emphasis text-center font-bold !text-white" />
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    'whitespace-nowrap font-bold !text-white',
                    `text-${col.align}`,
                    `${col.headClassName}`
                  )}
                >
                  {col.title}
                </TableHead>
              ))}
              <TableHead className="sticky right-0 w-[52px] whitespace-nowrap bg-emphasis text-center font-bold text-white after:absolute after:bottom-0 after:left-0 after:top-0 after:block after:w-[30px] after:translate-x-[-100%] after:content-[''] after:[box-shadow:inset_-10px_0_8px_-8px_rgba(5,5,5,0.06)]">
                アクション
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={14}>
                  <div className="flex justify-center">
                    <Loader2 size={36} />
                  </div>
                </TableCell>
              </TableRow>
            ) : !data || !data.length ? (
              <TableRow>
                <TableCell colSpan={14}>
                  <div className="text-center">
                    項目を追加するには、「項目追加」ボタンを押してください。
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <SortableContext
                items={data.map((item) => item.name)}
                strategy={verticalListSortingStrategy}
              >
                {data.map((item, index) => (
                  <SortableRow id={item.name} key={item.name}>
                    {disabled ? (
                      <TableCell className="sticky left-0 w-[48px] bg-background">
                        <div>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            className="h-8 w-8"
                            disabled={disabled}
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell className="sticky left-0 w-[48px] bg-background">
                        <div className="cursor-grab" data-drag-handle>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            className="h-8 w-8"
                            disabled={disabled}
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    {columns.map(
                      ({ dataIndex, className, align, render }, colIndex) => (
                        <TableCell
                          className={cn(`text-${align}`, className)}
                          key={colIndex}
                        >
                          {render ? (
                            render(item)
                          ) : dataIndex ? (
                            item[dataIndex]?.toString()
                          ) : (
                            <></>
                          )}
                        </TableCell>
                      )
                    )}
                    <TableCell className="sticky right-0 flex justify-center bg-white after:absolute after:bottom-0 after:left-0 after:top-0 after:block after:w-[30px] after:translate-x-[-100%] after:content-[''] after:[box-shadow:inset_-10px_0_8px_-8px_rgba(5,5,5,0.06)]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            className="h-8 w-8"
                            disabled={disabled}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white" align="end">
                          <DropdownMenuItem
                            className="hover:cursor-pointer hover:bg-[hsl(var(--accent))]"
                            onClick={() => onEditField(index)}
                          >
                            <Edit3 className="mr-2 h-4 w-4 text-muted-foreground" />
                            編集
                          </DropdownMenuItem>
                          {!defaultPhysicalSettingField.includes(
                            item.physicalName
                          ) && (
                            <DropdownMenuItem
                              className="text-danger hover:cursor-pointer hover:bg-[hsl(var(--accent))]"
                              onClick={() => onDeletedField(index)}
                            >
                              <Trash2 className="text-danger mr-2 h-4 w-4" />
                              削除
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </SortableRow>
                ))}
              </SortableContext>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}
