// import Quill from 'quill'
import Quill from 'quill'
/* 自定义表格选区 */
import TableSelection from './modules/table_selection'
// import table node matchers
import {
    matchTableCell,
    matchTableHeader,
    matchTable
} from './utils/node-matchers'

import { getEventComposedPath } from './utils/index'

const Module = Quill.import('core/module')
const Delta = Quill.import('delta')

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

class CustomTable extends Module {
    static register() {
        Quill.register(TableContainer, true);
        Quill.register(TableCol, true);
        Quill.register(TableColGroup, true);
        Quill.register(TableCellLine, true);
        Quill.register(TableCell, true);
        Quill.register(TableRow, true);
        Quill.register(TableBody, true);
        Quill.register(TableViewWrapper, true);
    }
    constructor(quill, options) {
        super(quill, options);
        this.quill.root.addEventListener('mousedown', (evt) => {
            const path = getEventComposedPath(evt)
            if (!path || path.length <= 0) return
            const tableNode = path.filter(node => {
                return node.tagName &&
                    node.tagName.toUpperCase() === 'TABLE'
                    && node.classList.contains('quill-better-table');
            })[0];
            if (tableNode) {
                this.table = tableNode;
                this.tableSelection = new TableSelection(tableNode, quill);/* 创建表格选区 */
                this.tableSelection.setSelectionFn.bind(this.tableSelection)(evt);
                this.quill.selectionObj = window.getSelection() || document.selection;
            }
        }, false);

        quill.keyboard.addBinding(
            { key: 'Backspace' }, {},
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
                return true;
            })
        let thisBinding = quill.keyboard.bindings['Backspace'].pop();
        quill.keyboard.bindings['Backspace'].splice(0, 1, thisBinding);

        quill.clipboard.addMatcher('td', matchTableCell);
        quill.clipboard.addMatcher('th', matchTableHeader);
        quill.clipboard.addMatcher('table', matchTable);

        quill.clipboard.matchers = quill.clipboard.matchers.filter(matcher => {
            return matcher[0] !== 'tr';
        })
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
    /* 插入表格 */
    insertTable(rows, columns) {
        const range = this.quill.getSelection(true);
        if (range == null) return;
        let currentBlot = this.quill.getLeaf(range.index)[0];
        let delta = new Delta().retain(range.index);

        if (isInTableCell(currentBlot)) {
            console.warn(`Can not insert table into a table cell.`);
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
                memo.insert(text, { 'table-cell-line': { row: tableRowId, cell: cellId() } });
                return memo
            }, memo)
        }, delta)

        this.quill.updateContents(delta, Quill.sources.USER)
        this.quill.setSelection(range.index + columns + 1, Quill.sources.API);
    }
    /* 删除表格 */
    deleteTableFn() {
        if (this.table == null) return;
        let tableId = this.table.id;
        this.quill[tableId].destroyFn();/* 销毁工具条 */
        this.table.remove();

        this.quill.update(Quill.sources.USER);
    }
    /* 此前插入行 */
    insertRowAboveFn() {
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        const tableContainer = Quill.find(this.table);
        tableContainer.insertRowFn(this.tableSelection.startTd, 'above');
        this.tableSelection.initFn();
        this.quill.update(Quill.sources.USER);
    }
    /* 此后插入行 */
    insertRowBelowFn() {
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        const tableContainer = Quill.find(this.table);
        tableContainer.insertRowFn(this.tableSelection.startTd, 'below');
        this.tableSelection.initFn();
        this.quill.update(Quill.sources.USER);
    }
    /* 删除行 */
    deleteRowFn() {
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        const tableContainer = Quill.find(this.table);
        tableContainer.deleteRowFn(this.tableSelection.startTd);
        this.tableSelection.initFn();
        this.quill.update(Quill.sources.USER);
    }
    /* 此前插入列 */
    insertColLeftFn() {
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        const tableContainer = Quill.find(this.table);
        const startColIndex = this.tableSelection.startTdColIndex;
        tableContainer.insertColFn(this.tableSelection.startTd, 'left', startColIndex);
        this.tableSelection.initFn();
        this.quill.update(Quill.sources.USER);
    }
    /* 此后插入列 */
    insertColRightFn() {
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        const tableContainer = Quill.find(this.table);
        const startColIndex = this.tableSelection.startTdColIndex;
        tableContainer.insertColFn(this.tableSelection.startTd, 'right', startColIndex);
        this.tableSelection.initFn();
        this.quill.update(Quill.sources.USER);
    }
    /* 删除列 */
    deleteColFn() {
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        const tableContainer = Quill.find(this.table);
        const startColIndex = this.tableSelection.startTdColIndex;
        tableContainer.deleteColFn(this.tableSelection.startTd, startColIndex);
        this.tableSelection.initFn();
        this.quill.update(Quill.sources.USER);
    }
    /* 合并单元格 */
    mergeCellFn() {
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        const tableContainer = Quill.find(this.table);
        const rowspan = this.tableSelection.rowspan;
        const colspan = this.tableSelection.colspan;
        tableContainer.mergeCellFn(this.tableSelection.selectTdArr, rowspan, colspan);
        this.quill.update(Quill.sources.USER);
    }
    /* 拆分单元格 */
    splitCellFn() {
        if (!this.table || !Quill.find(this.table)) {
            return;
        }
        const tableContainer = Quill.find(this.table);
        const startColIndex = this.tableSelection.startTdColIndex;
        tableContainer.splitCellFn(this.tableSelection.startTd, startColIndex);
        this.quill.update(Quill.sources.USER);
    }
}

CustomTable.keyboardBindings = {
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
        handler() { },
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

function makeTableArrowHandler(up) {
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

function isTableCell(blot) {
    return blot.statics.blotName === TableCell.blotName
}

function isInTableCell(current) {
    return current && current.parent
        ? isTableCell(current.parent)
            ? true
            : isInTableCell(current.parent)
        : false
}

export default CustomTable;
