import Quill from 'quill'
import TableColumnTool from './modules/table-column-tool'
import TableSelection from './modules/table-selection'
import { css, getRelativeRect } from './utils'
// import table node matchers
import {
  matchTableCell,
  matchTableHeader,
  matchTable
} from './utils/node-matchers'

import { getEventComposedPath } from './utils/index'

const Module = Quill.import('core/module')
const Delta = Quill.import('delta')
const ERROR_LIMIT = 5
var vue = null
var readonly = false
import {
  TableCol,
  TableColGroup,
  TableCellLine,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableViewWrapper,
  rowId,
  cellId
} from './formats/table';

class BetterTable extends Module {
  static register() {
    Quill.register(TableCol, true);
    Quill.register(TableColGroup, true);
    Quill.register(TableCellLine, true);
    Quill.register(TableCell, true);
    Quill.register(TableRow, true);
    Quill.register(TableBody, true);
    Quill.register(TableContainer, true);
    Quill.register(TableViewWrapper, true);
    Quill.register(TableViewWrapper, true);
    // register customized Header，overwriting quill built-in Header
    // Quill.register('formats/header', Header, true);
  }

  constructor(quill, options) {
    super(quill, options);
    
    // handle click on quill-better-table
    this.quill.root.addEventListener('click', (evt) => {
      // bugfix: evt.path is undefined in Safari, FF, Micro Edge
      const path = getEventComposedPath(evt)
      
      if (!path || path.length <= 0) return

      const tableNode = path.filter(node => {
        return node.tagName &&
          node.tagName.toUpperCase() === 'TABLE' &&
          node.classList.contains('quill-better-table')
      })[0]
      if(readonly){
        return
      }
      if (tableNode) {
        // current table clicked
        if (this.table === tableNode) {
            vue.tableConfig.showTool = true
            return
        }
        else{
            vue.tableConfig.showTool = false
        }
        // other table clicked
        if (this.table) this.hideTableTools()
        this.showTableTools(tableNode, quill, options)
      } else if (this.table) {
        // other clicked
        this.hideTableTools()
      }
    }, false)
    // add keyboard binding：Backspace
    // prevent user hits backspace to delete table cell
    const KeyBoard = quill.getModule('keyboard')
    quill.keyboard.addBinding(
      { key: 'Backspace' },
      {},
      function (range, context) {
        if (range.index === 0 || this.quill.getLength() <= 1) return true;
        const [line] = this.quill.getLine(range.index);
        if (context.offset === 0) {
          const [prev] = this.quill.getLine(range.index - 1);
          if (prev != null) {
            if (prev.statics.blotName === 'table-cell-line' &&
              line.statics.blotName !== 'table-cell-line') return false;
          }
        }
        return true
      })
    // since only one matched bindings callback will excute.
    // expected my binding callback excute first
    // I changed the order of binding callbacks
    let thisBinding = quill.keyboard.bindings['Backspace'].pop()
    quill.keyboard.bindings['Backspace'].splice(0, 1, thisBinding)

    // add Matchers to match and render quill-better-table for initialization
    // or pasting
    quill.clipboard.addMatcher('td', matchTableCell)
    quill.clipboard.addMatcher('th', matchTableHeader)
    quill.clipboard.addMatcher('table', matchTable)
    // quill.clipboard.addMatcher('h1, h2, h3, h4, h5, h6', matchHeader)

    // remove matcher for tr tag
    quill.clipboard.matchers = quill.clipboard.matchers.filter(matcher => {
      return matcher[0] !== 'tr'
    })
  }
  tableSelectionFunc(evt){

  }
  getTable(range = this.quill.getSelection()) {
    if (range == null) return [null, null, null, -1];
    const [cellLine, offset] = this.quill.getLine(range.index);
    if (cellLine == null || cellLine.statics.blotName !== TableCellLine.blotName) {
      return [null, null, null, -1];
    }
    const cell = cellLine.tableCell();
    const row = cell.row();
    const table = row.table();
    return [table, row, cell, offset];
  }
  insertTable(rows, columns) {
    const range = this.quill.getSelection(true)
    if (range == null) return
    let currentBlot = this.quill.getLeaf(range.index)[0]
    let delta = new Delta().retain(range.index)

    if (isInTableCell(currentBlot)) {
      console.warn(`Can not insert table into a table cell.`)
      return;
    }

    delta.insert('\n')
    // insert table column
    delta = new Array(columns).fill('\n').reduce((memo, text) => {
      memo.insert(text, { 'table-col': true })
      return memo
    }, delta)
    // insert table cell line with empty line
    delta = new Array(rows).fill(0).reduce(memo => {
      let tableRowId = rowId()
      return new Array(columns).fill('\n').reduce((memo, text) => {
        memo.insert(text, { 'table-cell-line': {row: tableRowId, cell: cellId()} });
        return memo
      }, memo)
    }, delta)

    this.quill.updateContents(delta, Quill.sources.USER)
    this.quill.setSelection(range.index + columns + 1, Quill.sources.API)
  }
  insertRowUp(){
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        this.boundary = this.tableSelection.boundary
        const tableContainer = Quill.find(this.table)
        const affectedCells = tableContainer.insertRow(
          this.boundary,
          false,
          this.quill.root.parentNode
        )
        this.quill.update(Quill.sources.USER)
        this.quill.setSelection(
          this.quill.getIndex(affectedCells[0]),
          0,
          Quill.sources.SILENT
        )
        this.tableSelection.setSelection(
          affectedCells[0].domNode.getBoundingClientRect(),
          affectedCells[0].domNode.getBoundingClientRect()
        )
  }
  insertRowDown(){
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        this.boundary = this.tableSelection.boundary
        const tableContainer = Quill.find(this.table)
        const affectedCells = tableContainer.insertRow(
          this.boundary,
          true,
          this.quill.root.parentNode
        )
        this.quill.update(Quill.sources.USER)
        this.quill.setSelection(
          this.quill.getIndex(affectedCells[0]),
          0,
          Quill.sources.SILENT
        )
        this.tableSelection.setSelection(
          affectedCells[0].domNode.getBoundingClientRect(),
          affectedCells[0].domNode.getBoundingClientRect()
        )
  }
  deleteRow(){
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        this.boundary = this.tableSelection.boundary
        const tableContainer = Quill.find(this.table)
        tableContainer.deleteRow(
          this.boundary,
          this.quill.root.parentNode
        )
        this.quill.update(Quill.sources.USER)
        this.tableSelection.clearSelection()
  }
  insertColumnLeft(){
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        this.boundary = this.tableSelection.boundary
        const betterTableModule = this.quill.getModule('better-table')
        this.tableColumnTool = betterTableModule.columnTool
        this.columnToolCells = this.tableColumnTool.colToolCells()
        const tableContainer = Quill.find(this.table)
        let colIndex = this.getColToolCellIndexByBoundary(
          this.columnToolCells,
          this.boundary,
          (cellRect, boundary) => {
            return Math.abs(cellRect.x - boundary.x) <= ERROR_LIMIT
          },
          this.quill.root.parentNode
        )
  
        const newColumn = tableContainer.insertColumn(
          this.boundary,
          colIndex,
          false,
          this.quill.root.parentNode)
  
        this.tableColumnTool.updateToolCells()
        this.quill.update(Quill.sources.USER)
        this.quill.setSelection(
          this.quill.getIndex(newColumn[0]),
          0,
          Quill.sources.SILENT
        )
        this.tableSelection.setSelection(
          newColumn[0].domNode.getBoundingClientRect(),
          newColumn[0].domNode.getBoundingClientRect()
        )
  }
  insertColumnRight(){
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        this.boundary = this.tableSelection.boundary
        const betterTableModule = this.quill.getModule('better-table')
        this.tableColumnTool = betterTableModule.columnTool
        this.columnToolCells = this.tableColumnTool.colToolCells()
        const tableContainer = Quill.find(this.table)
        let colIndex = this.getColToolCellIndexByBoundary(
          this.columnToolCells,
          this.boundary,
          (cellRect, boundary) => {
            return Math.abs(cellRect.x + cellRect.width - boundary.x1) <= ERROR_LIMIT
          },
          this.quill.root.parentNode
        )
        const newColumn = tableContainer.insertColumn(
          this.boundary,
          colIndex,
          true,
          this.quill.root.parentNode)
  
        this.tableColumnTool.updateToolCells()
        this.quill.update(Quill.sources.USER)
        this.quill.setSelection(
          this.quill.getIndex(newColumn[0]),
          0,
          Quill.sources.SILENT
        )
        this.tableSelection.setSelection(
          newColumn[0].domNode.getBoundingClientRect(),
          newColumn[0].domNode.getBoundingClientRect()
        )
  }
  deleteColumn(){
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        this.boundary = this.tableSelection.boundary
        const betterTableModule = this.quill.getModule('better-table')
        this.tableColumnTool = betterTableModule.columnTool
        this.columnToolCells = this.tableColumnTool.colToolCells()
        const tableContainer = Quill.find(this.table)
        let colIndexes = this.getColToolCellIndexesByBoundary(
          this.columnToolCells,
          this.boundary,
          (cellRect, boundary) => {
            return cellRect.x + ERROR_LIMIT > boundary.x &&
              cellRect.x + cellRect.width - ERROR_LIMIT < boundary.x1
          },
          this.quill.root.parentNode
        )
  
        let isDeleteTable = tableContainer.deleteColumns(
          this.boundary,
          colIndexes,
          this.quill.root.parentNode
        )
        if (!isDeleteTable) {
          this.tableColumnTool.updateToolCells()
          this.quill.update(Quill.sources.USER)
          this.tableSelection.clearSelection()
        }
  }
  mergeCells(){
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        this.boundary = this.tableSelection.boundary
        const betterTableModule = this.quill.getModule('better-table')
        this.tableColumnTool = betterTableModule.columnTool
        this.columnToolCells = this.tableColumnTool.colToolCells()
        const tableContainer = Quill.find(this.table)
        // compute merged Cell rowspan, equal to length of selected rows
        const rowspan = tableContainer.rows().reduce((sum, row) => {
          let rowRect  = getRelativeRect(
            row.domNode.getBoundingClientRect(),
            this.quill.root.parentNode
          )
          if (
            rowRect.y > this.boundary.y - ERROR_LIMIT &&
            rowRect.y + rowRect.height < this.boundary.y + this.boundary.height + ERROR_LIMIT
          ) {
            sum += 1
          }
          return sum
        }, 0)
        // compute merged cell colspan, equal to length of selected cols
        const colspan = this.columnToolCells.reduce((sum, cell) => {
          let cellRect = getRelativeRect(
            cell.getBoundingClientRect(),
            this.quill.root.parentNode
          )
          if (
            cellRect.x > this.boundary.x - ERROR_LIMIT &&
            cellRect.x + cellRect.width < this.boundary.x + this.boundary.width + ERROR_LIMIT
          ) {
            sum += 1
          }
          return sum
        }, 0)
  
        const mergedCell = tableContainer.mergeCells(
          this.boundary,
          this.tableSelection.selectedTds,
          rowspan,
          colspan,
          this.quill.root.parentNode
        )
        this.quill.update(Quill.sources.USER)
        this.tableSelection.setSelection(
          mergedCell.domNode.getBoundingClientRect(),
          mergedCell.domNode.getBoundingClientRect()
        )
  }
  unmergeCells(){
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        this.boundary = this.tableSelection.boundary
        const tableContainer = Quill.find(this.table)
        tableContainer.unmergeCells(
          this.tableSelection.selectedTds,
          this.quill.root.parentNode
        )
        this.quill.update(Quill.sources.USER)
        this.tableSelection.clearSelection()
  }
  deleteTable() {
    const betterTableModule = this.quill.getModule('better-table')
    const tableContainer = Quill.find(this.table)
    betterTableModule.hideTableTools()
    tableContainer.remove()
    this.quill.update(Quill.sources.USER)
  }
  getColToolCellIndexByBoundary (cells, boundary, conditionFn, container) {
    return cells.reduce((findIndex, cell) => {
      let cellRect = getRelativeRect(cell.getBoundingClientRect(), container)
      if (conditionFn(cellRect, boundary)) {
        findIndex = cells.indexOf(cell)
      }
      return findIndex
    }, false)
  }
  
  getColToolCellIndexesByBoundary (cells, boundary, conditionFn, container) {
    return cells.reduce((findIndexes, cell) => {
      let cellRect = getRelativeRect(
        cell.getBoundingClientRect(),
        container
      )
      if (conditionFn(cellRect, boundary)) {
        findIndexes.push(cells.indexOf(cell))
      }
      return findIndexes
    }, [])
  }
  showTableTools (table, quill, options) {
    this.table = table
    this.columnTool = new TableColumnTool(table, quill, options)
    this.tableSelection = new TableSelection(table, quill, options)
  }

  hideTableTools () {
    this.columnTool && this.columnTool.destroy()
    this.tableSelection && this.tableSelection.destroy()
    this.tableOperationMenu && this.tableOperationMenu.destroy()
    this.columnTool = null
    this.tableSelection = null
    this.tableOperationMenu = null
    this.table = null
    vue.tableConfig.showTool = false
  }
  getToolsShow(that){
    vue = that
  }
  enable(bool){
    readonly = bool
  }
}

BetterTable.keyboardBindings = {
  'table-cell-line backspace': {
    key: 'Backspace',
    format: ['table-cell-line'],
    collapsed: true,
    offset: 0,
    handler(range, context) {
      const [line, offset] = this.quill.getLine(range.index)
      if (!line.prev || line.prev.statics.blotName !== 'table-cell-line') {
        return false
      }
      return true
    },
  },

  'table-cell-line delete': {
    key: 'Delete',
    format: ['table-cell-line'],
    collapsed: true,
    suffix: /^$/,
    handler() {},
  },

  'table-cell-line enter': {
    key: 'Enter',
    shiftKey: null,
    format: ['table-cell-line'],
    handler(range, context) {
      // bugfix: a unexpected new line inserted when user compositionend with hitting Enter
      if (this.quill.selection && this.quill.selection.composing) return
      const Scope = Quill.imports.parchment.Scope
      if (range.length > 0) {
        this.quill.scroll.deleteAt(range.index, range.length); // So we do not trigger text-change
      }
      const lineFormats = Object.keys(context.format).reduce((formats, format) => {
        if (
          this.quill.scroll.query(format, Scope.BLOCK) &&
          !Array.isArray(context.format[format])
        ) {
          formats[format] = context.format[format];
        }
        return formats;
      }, {});
      // insert new cellLine with lineFormats
      this.quill.insertText(range.index, '\n', lineFormats['table-cell-line'], Quill.sources.USER);
      // Earlier scroll.deleteAt might have messed up our selection,
      // so insertText's built in selection preservation is not reliable
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
      this.quill.focus();
      Object.keys(context.format).forEach(name => {
        if (lineFormats[name] != null) return;
        if (Array.isArray(context.format[name])) return;
        if (name === 'link') return;
        this.quill.format(name, context.format[name], Quill.sources.USER);
      });
    },
  },

  'table-cell-line up': makeTableArrowHandler(true),
  'table-cell-line down': makeTableArrowHandler(false),
  'down-to-table': {
    key: 'ArrowDown',
    collapsed: true,
    handler(range, context) {
      const target = context.line.next
      if (target && target.statics.blotName === 'table-view') {
        const targetCell = target.table().rows()[0].children.head
        const targetLine = targetCell.children.head
        
        this.quill.setSelection(
          targetLine.offset(this.quill.scroll),
          0,
          Quill.sources.USER
        )

        return false
      }
      return true
    }
  },
  'up-to-table': {
    key: 'ArrowUp',
    collapsed: true,
    handler(range, context) {
      const target = context.line.prev
      if (target && target.statics.blotName === 'table-view') {
        const rows = target.table().rows()
        const targetCell = rows[rows.length - 1].children.head
        const targetLine = targetCell.children.head
        
        this.quill.setSelection(
          targetLine.offset(this.quill.scroll),
          0,
          Quill.sources.USER
        )

        return false
      }
      return true
    }
  }
}

function makeTableArrowHandler (up) {
  return {
    key: up ? 'ArrowUp' : 'ArrowDown',
    collapsed: true,
    format: ['table-cell-line'],
    handler(range, context) {
      // TODO move to table module
      const key = up ? 'prev' : 'next'
      const targetLine = context.line[key]
      if (targetLine != null) return true

      const cell = context.line.parent
      const targetRow = cell.parent[key]

      if (targetRow != null && targetRow.statics.blotName === 'table-row') {
        let targetCell = targetRow.children.head
        let totalColspanOfTargetCell = parseInt(targetCell.formats()['colspan'], 10)
        let cur = cell
        let totalColspanOfCur = parseInt(cur.formats()['colspan'], 10)

        // get targetCell above current cell depends on colspan
        while (cur.prev != null) {
          cur = cur.prev
          totalColspanOfCur += parseInt(cur.formats()['colspan'], 10)
        }
        
        while (targetCell.next != null && totalColspanOfTargetCell < totalColspanOfCur) {
          targetCell = targetCell.next
          totalColspanOfTargetCell += parseInt(targetCell.formats()['colspan'], 10)
        }

        const index = targetCell.offset(this.quill.scroll)
        this.quill.setSelection(index, 0, Quill.sources.USER)
      } else {
        const targetLine = cell.table().parent[key]
        if (targetLine != null) {
          if (up) {
            this.quill.setSelection(
              targetLine.offset(this.quill.scroll) + targetLine.length() - 1,
              0,
              Quill.sources.USER
            )
          } else {
            this.quill.setSelection(
              targetLine.offset(this.quill.scroll),
              0,
              Quill.sources.USER
            )
          }
        }
      }
      return false;
    },
  };
}

function isTableCell (blot) {
  return blot.statics.blotName === TableCell.blotName
}

function isInTableCell (current) {
  return current && current.parent
    ? isTableCell(current.parent)
      ? true
      : isInTableCell(current.parent)
    : false
}

export default BetterTable;
