import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  row_getCenterVisibleCells,
  row_getLeftVisibleCells,
  row_getRightVisibleCells,
} from '../column-pinning/ColumnPinning.utils'
import {
  column_getCanHide,
  column_getIsVisible,
  column_getToggleVisibilityHandler,
  column_toggleVisibility,
  getDefaultColumnVisibilityState,
  row_getAllVisibleCells,
  row_getVisibleCells,
  table_getIsAllColumnsVisible,
  table_getIsSomeColumnsVisible,
  table_getToggleAllColumnsVisibilityHandler,
  table_getVisibleFlatColumns,
  table_getVisibleLeafColumns,
  table_resetColumnVisibility,
  table_setColumnVisibility,
  table_toggleAllColumnsVisible,
} from './ColumnVisibility.utils'
import type { TableState_All } from '../../types/TableState'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'
import type {
  Column_ColumnVisibility,
  Row_ColumnVisibility,
  VisibilityDefaultOptions,
} from './ColumnVisibility.types'

/**
 * The Column Visibility feature adds column visibility state and APIs to the table, row, and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility)
 */
export const ColumnVisibility: TableFeature = {
  getInitialState: (
    initialState: Partial<TableState_All>,
  ): Partial<TableState_All> => {
    return {
      columnVisibility: getDefaultColumnVisibilityState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ): VisibilityDefaultOptions => {
    return {
      onColumnVisibilityChange: makeStateUpdater('columnVisibility', table),
    }
  },

  constructColumnAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> & Partial<Column_ColumnVisibility>,
  ): void => {
    assignAPIs(column, [
      {
        fn: () => column_getIsVisible(column),
        memoDeps: () => [
          column.table.options.columns,
          column.table.options.state?.columnVisibility,
          column.columns,
        ],
      },
      {
        fn: () => column_getCanHide(column),
      },
      {
        fn: () => column_getToggleVisibilityHandler(column),
      },
      {
        fn: (visible) => column_toggleVisibility(column, visible),
      },
    ])
  },

  constructRowAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> &
      Partial<Row_ColumnVisibility<TFeatures, TData>>,
  ): void => {
    assignAPIs(row, [
      {
        fn: () => row_getAllVisibleCells(row),
        memoDeps: () => [
          row.getAllCells(),
          row.table.options.state?.columnVisibility,
        ],
      },
      {
        fn: (left, center, right) => row_getVisibleCells(left, center, right),
        memoDeps: () => [
          row_getLeftVisibleCells(row),
          row_getCenterVisibleCells(row),
          row_getRightVisibleCells(row),
        ],
      },
    ])
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ): void => {
    assignAPIs(table, [
      {
        fn: () => table_getVisibleFlatColumns(table),
        memoDeps: () => [
          table.options.state?.columnVisibility,
          table.options.columns,
        ],
      },
      {
        fn: () => table_getVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.state?.columnVisibility,
          table.options.columns,
        ],
      },
      {
        fn: (updater) => table_setColumnVisibility(table, updater),
      },
      {
        fn: (defaultState) => table_resetColumnVisibility(table, defaultState),
      },
      {
        fn: (value) => table_toggleAllColumnsVisible(table, value),
      },
      {
        fn: () => table_getIsAllColumnsVisible(table),
      },
      {
        fn: () => table_getIsSomeColumnsVisible(table),
      },
      {
        fn: () => table_getToggleAllColumnsVisibilityHandler(table),
      },
    ])
  },
}
