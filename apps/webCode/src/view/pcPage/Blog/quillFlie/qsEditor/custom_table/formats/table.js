import Quill from 'quill'
import { getRelativeRect } from '../utils'
import TableTool from '../modules/table_tool'

const Break = Quill.import("blots/break")
const Block = Quill.import("blots/block")
const Container = Quill.import("blots/container")

const COL_ATTRIBUTES = ["width"]
const COL_DEFAULT = {
    width: 50
}
const CELL_IDENTITY_KEYS = ["row", "cell"]
const CELL_ATTRIBUTES = ["rowspan", "colspan", "height"]
const CELL_DEFAULT = {
    rowspan: 1,
    colspan: 1
}
const ERROR_LIMIT = 5;

class TableCellLine extends Block {
    static create(value) {
        const node = super.create(value)
        CELL_IDENTITY_KEYS.forEach(key => {
            let identityMaker = key === 'row'
                ? rowId : cellId
            node.setAttribute(`data-${key}`, value[key] || identityMaker())
        })

        CELL_ATTRIBUTES.forEach(attrName => {
            node.setAttribute(`data-${attrName}`, value[attrName] || CELL_DEFAULT[attrName])
        })
        return node
    }

    static formats(domNode) {
        const formats = {}

        return CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS).reduce((formats, attribute) => {
            if (domNode.hasAttribute(`data-${attribute}`)) {
                formats[attribute] = domNode.getAttribute(`data-${attribute}`) || undefined
            }
            return formats
        }, formats)
    }

    format(name, value) {
        if (CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS).indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(`data-${name}`, value)
            } else {
                this.domNode.removeAttribute(`data-${name}`)
            }
        } else if (name === 'height') {
            if (value) {
                this.domNode.setAttribute('height', value)
            } else {
                this.domNode.removeAttribute('height')
            }
        } else if (name === 'header') {
            if (!value) return;
            const { row, cell, rowspan, colspan } = TableCellLine.formats(this.domNode)
            super.format(name, {
                value,
                row,
                cell,
                rowspan,
                colspan
            })
        } else {
            super.format(name, value)
        }
    }

    optimize(context) {
        const rowId = this.domNode.getAttribute('data-row');
        const rowspan = this.domNode.getAttribute('data-rowspan');
        const colspan = this.domNode.getAttribute('data-colspan');
        const heightStr = this.domNode.getAttribute('data-height');
        if (this.statics.requiredContainer &&
            !(this.parent instanceof this.statics.requiredContainer)) {
            this.wrap(this.statics.requiredContainer.blotName, {
                row: rowId,
                colspan,
                rowspan,
                height: heightStr
            })
        }
        super.optimize(context)
    }

    tableCell() {
        return this.parent
    }
}
TableCellLine.blotName = "table-cell-line"
TableCellLine.ClassName = "qlbt-cell-line"
TableCellLine.tagName = "DIV"

class TableCell extends Container {
    constructor(scroll, domNode) {
        super(scroll, domNode);
        const quill = Quill.find(scroll.domNode.parentNode);
        this.setCurCellFn(scroll, quill);
    }

    checkMerge() {
        if (super.checkMerge() && this.next.children.head != null) {
            const thisHead = this.children.head.formats()[this.children.head.statics.blotName]
            const thisTail = this.children.tail.formats()[this.children.tail.statics.blotName]
            const nextHead = this.next.children.head.formats()[this.next.children.head.statics.blotName]
            const nextTail = this.next.children.tail.formats()[this.next.children.tail.statics.blotName]
            return (
                thisHead.cell === thisTail.cell &&
                thisHead.cell === nextHead.cell &&
                thisHead.cell === nextTail.cell
            )
        }
        return false
    }

    static create(value) {
        const node = super.create(value)
        node.setAttribute("data-row", value.row);
        node.setAttribute("style", `height:${value['height']}px`);

        CELL_ATTRIBUTES.forEach(attrName => {
            if (value[attrName]) {
                node.setAttribute(attrName, value[attrName])
            }
        })
        return node
    }

    static formats(domNode) {
        const formats = {}

        if (domNode.hasAttribute("data-row")) {
            formats["row"] = domNode.getAttribute("data-row");
        }

        if (domNode.hasAttribute("height")) {
            formats["height"] = domNode.getAttribute("height");
        }

        return CELL_ATTRIBUTES.reduce((formats, attribute) => {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, formats)
    }

    cellOffset() {
        if (this.parent) {
            return this.parent.children.indexOf(this);
        }
        return -1
    }

    formats() {
        const formats = {};
        if (this.domNode.hasAttribute("data-row")) {
            formats["row"] = this.domNode.getAttribute("data-row")
        }

        if (this.domNode.hasAttribute("height")) {
            formats["height"] = this.domNode.getAttribute("height")
        }

        return CELL_ATTRIBUTES.reduce((formats, attribute) => {
            if (this.domNode.hasAttribute(attribute)) {
                formats[attribute] = this.domNode.getAttribute(attribute)
            }

            return formats
        }, formats)
    }

    toggleAttribute(name, value) {
        if (value) {
            this.domNode.setAttribute(name, value)
        } else {
            this.domNode.removeAttribute(name)
        }
    }

    formatChildren(name, value) {
        this.children.forEach(child => {
            child.format(name, value)
        })
    }

    format(name, value) {
        if (name == 'height') {
            this.domNode.setAttribute('style', `height:${value}px`);
        }
        if (CELL_ATTRIBUTES.indexOf(name) > -1) {
            this.toggleAttribute(name, value)
            this.formatChildren(name, value)
        } else if (['row'].indexOf(name) > -1) {
            this.toggleAttribute(`data-${name}`, value)
            this.formatChildren(name, value)
        } else {
            super.format(name, value)
        }
    }

    optimize(context) {
        const rowId = this.domNode.getAttribute("data-row")
        if (this.statics.requiredContainer &&
            !(this.parent instanceof this.statics.requiredContainer)) {
            this.wrap(this.statics.requiredContainer.blotName, {
                row: rowId,
            })
        }        
        super.optimize(context)
    }

    row() {
        return this.parent
    }

    rowOffset() {
        if (this.row()) {
            return this.row().rowOffset()
        }
        return -1;
    }

    table() {
        return this.row() && this.row().table()
    }
    /* 鼠标悬停，设置当前激活单元格对象 */
    setCurCellFn(scroll, quill) {
        this.domNode.addEventListener('mouseenter', (e) => {
            if (!quill.isMouseMoveBindBool) {
                quill.activeCellObj = getRelativeRect(this.domNode.getBoundingClientRect(), quill.root.parentNode);
                quill.curTdObj = this.domNode;
                let table = this.domNode.parentNode.parentNode.parentNode;
                let tableId = table.getAttribute('id');
                if(quill[tableId]){
                    quill[tableId].initTableTool();
                }
            }
        }, false);
    }
}
TableCell.blotName = "table"
TableCell.tagName = "TD"
class TableRow extends Container {
    checkMerge() {
        if (super.checkMerge() && this.next.children.head != null) {
            const thisHead = this.children.head.formats()
            const thisTail = this.children.tail.formats()
            const nextHead = this.next.children.head.formats()
            const nextTail = this.next.children.tail.formats()

            return (
                thisHead.row === thisTail.row &&
                thisHead.row === nextHead.row &&
                thisHead.row === nextTail.row
            )
        }
        return false
    }

    static create(value) {
        const node = super.create(value)
        node.setAttribute("data-row", value.row);
        CELL_ATTRIBUTES.forEach(attrName => {
            if (value[attrName]) {
                node.setAttribute(attrName, value[attrName])
            }
        })
        return node
    }

    format(name, value) {
        this.domNode.setAttribute(`${name}`, value);
    }

    formats() {
        return ["row"].reduce((formats, attrName) => {
            if (this.domNode.hasAttribute(`data-${attrName}`)) {
                formats[attrName] = this.domNode.getAttribute(`data-${attrName}`)
            }
            return formats
        }, {})
    }

    optimize(context) {
        // optimize function of ShadowBlot
        if (
            this.statics.requiredContainer &&
            !(this.parent instanceof this.statics.requiredContainer)
        ) {
            this.wrap(this.statics.requiredContainer.blotName)
        }

        // optimize function of ParentBlot
        // note: modified this optimize function because
        // TableRow should not be removed when the length of its children was 0
        this.enforceAllowedChildren();
        if (this.uiNode != null && this.uiNode !== this.domNode.firstChild) {
            this.domNode.insertBefore(this.uiNode, this.domNode.firstChild)
        }

        // optimize function of ContainerBlot
        if (this.children.length > 0 && this.next != null && this.checkMerge()) {
            this.next.moveChildren(this)
            this.next.remove()
        }
    }

    rowOffset() {
        if (this.parent) {
            return this.parent.children.indexOf(this)
        }
        return -1
    }

    table() {
        return this.parent && this.parent.parent
    }
}
TableRow.blotName = "table-row"
TableRow.tagName = "TR"

class TableBody extends Container { }
TableBody.blotName = "table-body"
TableBody.tagName = "TBODY"

class TableCol extends Block {
    static create(value) {
        let node = super.create(value)
        COL_ATTRIBUTES.forEach(attrName => {
            node.setAttribute(`${attrName}`, value[attrName] || COL_DEFAULT[attrName])
        })
        return node
    }

    static formats(domNode) {
        return COL_ATTRIBUTES.reduce((formats, attribute) => {
            if (domNode.hasAttribute(`${attribute}`)) {
                formats[attribute] =
                    domNode.getAttribute(`${attribute}`) || undefined
            }
            return formats
        }, {})
    }

    format(name, value) {
        if (COL_ATTRIBUTES.indexOf(name) > -1) {
            this.domNode.setAttribute(`${name}`, value || COL_DEFAULT[name])
        } else {
            super.format(name, value)
        }
    }

    html() {
        return this.domNode.outerHTML
    }
}
TableCol.blotName = "table-col"
TableCol.tagName = "col"

class TableColGroup extends Container { }
TableColGroup.blotName = "table-col-group"
TableColGroup.tagName = "colgroup"

class TableContainer extends Container {
    static create() {
        let node = super.create();
        let tableArr = document.querySelectorAll('.quill-better-table');
        node.setAttribute("id",'table_' + tableArr.length);
        return node;
    }
    constructor(scroll, domNode) {
        super(scroll, domNode);
        const quill = Quill.find(scroll.domNode.parentNode);
        let tableId = domNode.getAttribute("id");
        setTimeout(()=>{
            if(domNode.children.length){
                quill[tableId] = new TableTool(domNode, quill);
            }
        })
    }
    cells(column) {
        return this.rows().map(row => row.children.at(column));
    }
    colGroup() {
        return this.children.head
    }
    format(name, value) {
        this.domNode.setAttribute(`${name}`, value);
    }
    tableDestroy() {
        const quill = Quill.find(this.scroll.domNode.parentNode);
        this.remove();
        quill.update(Quill.sources.USER);
    }
    /* 插入单元格 */
    insertCell(tableRow, ref) {
        const id = cellId();
        const rId = tableRow.formats().row;
        const tableCell = this.scroll.create(TableCell.blotName,Object.assign({}, CELL_DEFAULT, {row: rId}));
        const cellLine = this.scroll.create(TableCellLine.blotName, {row: rId,cell: id});
        var cellLineArr = tableCell.children;
        if (cellLineArr.length < 2) {
            tableCell.appendChild(cellLine);
        }
        if (ref) {
            tableRow.insertBefore(tableCell, ref);
        } else {
            tableRow.appendChild(tableCell);
        }
    }
    /* 插入列 */
    insertColFn(selectTd, dirStr ,colIndex) {
        if (!selectTd) {
            return;
        }
        const [body] = this.descendants(TableBody);
        const [tableColGroup] = this.descendants(TableColGroup);
        if (body == null || body.children.head == null) {
            return;
        }
        let tableCellArr = this.descendants(TableCell);
        let selectTdObj = selectTd.getBoundingClientRect();
        let modifyCellArr = [];/* 需要调整 colspan 的单元格 */
        let affectCellArr = [];/* 需要插入的单元格 */
        tableCellArr.forEach(cell=>{
            let cellObj = cell.domNode.getBoundingClientRect();
            let colspan = parseInt(cell.domNode.getAttribute('colspan'),10);
            let leftEqualBool = Math.abs(selectTdObj.left - cellObj.left) < ERROR_LIMIT;/* 是否左侧对齐 */
            if(selectTdObj.left >= cellObj.left && selectTdObj.right <= cellObj.right && cell.domNode !== selectTd){
                if(colspan > 1){/* 跨列数大于 1 */
                    if(dirStr === 'left' && !leftEqualBool){
                        modifyCellArr.push(cell);
                    }else if(dirStr === 'right'){
                        modifyCellArr.push(cell);
                    }
                }else {
                    affectCellArr.push(cell);
                }
            }else if(Math.abs(selectTdObj.right - cellObj.right) < ERROR_LIMIT){
                affectCellArr.push(cell);
            }
        })
        if(!modifyCellArr.length){
            affectCellArr = [];
            tableCellArr.forEach(cell=>{
                let cellObj = cell.domNode.getBoundingClientRect();
                if(Math.abs(cellObj.left - selectTdObj.left) < ERROR_LIMIT){
                    affectCellArr.push(cell);
                }
            })
        }
        /* 修改 colspan */
        modifyCellArr.forEach((cell)=>{
            let colspan = parseInt(cell.domNode.getAttribute('colspan'),10);
            cell.format('colspan',colspan + 1);
        })
        /* 插入列 */
        affectCellArr.forEach(cell => {
            const ref = dirStr === 'right' ? cell.next : cell;
            const id = cellId();
            const tableRow = cell.parent;
            const rId = tableRow.formats().row;
            const cellFormats = cell.formats();
            const tableCell = this.scroll.create(TableCell.blotName,{ row: rId, rowspan: cellFormats.rowspan });/* 创建单元格 */
            const cellLine = this.scroll.create(TableCellLine.blotName, { row: rId, cell: id, rowspan: cellFormats.rowspan });/* 创建单元格行 */
            tableCell.appendChild(cellLine);/* 将单元格行添加到单元格中 */
            if (ref) {
                tableRow.insertBefore(tableCell, ref);
            } else {
                tableRow.appendChild(tableCell);
            };
        })
        /* 插入col Blot */
        const tableCol = this.scroll.create(TableCol.blotName, true);
        const tableColArr = this.descendants(TableCol);
        let colRef = dirStr === 'right' ? tableColArr[colIndex].next : tableColArr[colIndex];
        if (colRef) {
            tableColGroup.insertBefore(tableCol, colRef);
        } else {
            tableColGroup.appendChild(tableCol);
        }
    }
    /* 删除列 */
    deleteColFn(selectTd,colIndex) {
        const [body] = this.descendants(TableBody)
        if (!selectTd || !body || !body.children.head) {
            return;
        }
        let tableCellArr = this.descendants(TableCell);
        let selectTdObj = selectTd.getBoundingClientRect();
        let modifyCellArr = [];/* 需要调整 colspan 的单元格 */
        let affectCellArr = [];/* 需要删除的单元格的行 */
        tableCellArr.forEach(cell=>{
            let cellObj = cell.domNode.getBoundingClientRect();
            let colspan = parseInt(cell.domNode.getAttribute('colspan'),10);
            if(selectTdObj.left >= cellObj.left && selectTdObj.right <= cellObj.right && cell.domNode !== selectTd){
                if(colspan > 1){/* 跨列数大于 1 */
                    modifyCellArr.push(cell);
                }else {
                    affectCellArr.push(cell);
                }
            }else if(selectTdObj.left <= cellObj.left && selectTdObj.right >= cellObj.right){
                affectCellArr.push(cell);
            }
        })
        /* 修改 colspan */
        let curRowspan = parseInt(selectTd.getAttribute('colspan'),10) || 1;
        modifyCellArr.forEach((cell)=>{
            let colspan = parseInt(cell.domNode.getAttribute('colspan'),10) || 1;
            cell.format('colspan',colspan - curRowspan);
        })
        /* 移除单元格 */
        affectCellArr.forEach(cell => {
            cell.remove();
        })
        /* 只有一列时销毁表格 */
        if (affectCellArr.length === tableCellArr.length) {
            this.tableDestroy();
            return true;
        }
        /* 移除列对应的 col Blot */
        if (this.colGroup().children.at(colIndex)) {
            this.colGroup().children.at(colIndex).remove();
        }
    }
    /* 插入行 */
    insertRowFn(selectTd, dirStr) {
        if (!selectTd) {
            return;
        }
        const [body] = this.descendants(TableBody);
        if (body == null || body.children.head == null) return;

        /* 判断表格最大列数 */
        const tableRowArr = this.descendants(TableRow);
        var rowColNumArr = [];
        tableRowArr.forEach((row)=>{
            var rowCellArr = row.children;
            let colNum = rowCellArr.reduce((total,curCell)=>{
                let colNum = parseInt(curCell.domNode.getAttribute('colspan'),10);
                return total + colNum;
            },0);
            rowColNumArr.push(colNum);
        })
        let maxColNum = Math.max.apply(null,rowColNumArr);/* 表格的最大列数 */

        let tableCellArr = this.descendants(TableCell);
        let selectTdObj = selectTd.getBoundingClientRect() || {};
        let modifyCellArr = [];/* 需要调整 rowspan 的单元格 */
        let affectCellArr = [];/* 需要插入的单元格列 */
        tableCellArr.forEach(cell=>{
            let cellObj = cell.domNode.getBoundingClientRect() || {};
            let rowspan = parseInt(cell.domNode.getAttribute('rowspan'),10);
            let topEqualBool = Math.abs(selectTdObj.top - cellObj.top) < ERROR_LIMIT;/* 是否顶部对齐 */
            if(selectTdObj.top >= cellObj.top && selectTdObj.bottom <= cellObj.bottom && cell.domNode !== selectTd){
                if(rowspan > 1){/* 跨行数大于 1 */
                    if(dirStr === 'above' && !topEqualBool){
                        modifyCellArr.push(cell);
                    }else if(dirStr === 'below'){
                        modifyCellArr.push(cell);
                    }
                }else {
                    affectCellArr.push(cell);
                }
            }else if(Math.abs(selectTdObj.bottom - cellObj.bottom) < ERROR_LIMIT){
                affectCellArr.push(cell);
            }
        })
        /* 计算要插入新行的列数 */
        maxColNum = affectCellArr.reduce((total,cell)=>{
            let colspan = parseInt(cell.domNode.getAttribute('colspan'),10) || 1;
            return total + colspan;
        },0);
        if(!modifyCellArr.length || !affectCellArr.length){
            maxColNum = Math.max.apply(null,rowColNumArr);
        }
        /* 修改 rowspan */
        modifyCellArr.forEach((cell)=>{
            let rowspan = parseInt(cell.domNode.getAttribute('rowspan'),10);
            if(maxColNum === Math.max.apply(null,rowColNumArr)){
                return;
            }
            cell.format('rowspan',rowspan + 1);
        })
        /* 创建新行 */
        const rId = rowId();
        const newRow = this.scroll.create(TableRow.blotName, { row: rId });
        let refRow = Quill.find(selectTd).parent;/* 默认向上插入行 */
        if (dirStr === 'below') {/* 向下插入行 */
            let rowspan = parseInt(selectTd.getAttribute('rowspan'),10);
            for(let i = 0;i < rowspan;i++){
                if(refRow){
                    refRow = refRow.next;
                }
            }
        }
        /* 创建单元格 */
        for(let col = 0;col < maxColNum;col++){
            const cId = cellId();
            const tableCell = this.scroll.create(TableCell.blotName,{row: rId,colspan: 1 });
            const cellLine = this.scroll.create(TableCellLine.blotName, {row: rId,cell:cId,colspan: 1});/* 创建单元格行 */
            const empty = this.scroll.create(Break.blotName);/* 创建空行 */
            cellLine.appendChild(empty);/* 将空行插入到单元格行中 */
            tableCell.appendChild(cellLine);/* 将单元格行插入到单元格中 */
            newRow.appendChild(tableCell);/* 将单元格插入到表格行中 */
        }
        
        body.insertBefore(newRow, refRow);/* 将新增的 blot 插入到表格中 */
    }
    /* 删除行 */
    deleteRowFn(selectTd) {
        if(!selectTd || !Quill.find(selectTd)){
            return;
        }
        var curRow = Quill.find(selectTd).parent;
        if (curRow) {
            let tableCellArr = this.descendants(TableCell);
            let selectTdObj = selectTd.getBoundingClientRect();
            let modifyCellArr = [];/* 需要调整 rowspan 的单元格 */
            let affectCellArr = [];/* 需要插入的单元格列 */
            tableCellArr.forEach(cell=>{
                let cellObj = cell.domNode.getBoundingClientRect();
                let rowspan = parseInt(cell.domNode.getAttribute('rowspan'));
                if(selectTdObj.top >= cellObj.top && selectTdObj.bottom <= cellObj.bottom && cell.domNode !== selectTd){
                    if(rowspan > 1){/* 跨行数大于 1 */
                        modifyCellArr.push(cell);
                    }else {
                        affectCellArr.push(cell);
                    }
                }else if(Math.abs(selectTdObj.bottom - cellObj.bottom) < ERROR_LIMIT){
                    affectCellArr.push(cell);
                }
            })
            let firstLineBool = false;/* 当前选中行是否与合并单元格同一行 */
            modifyCellArr.forEach((cell)=>{
                let cellObj = cell.domNode.getBoundingClientRect();
                if(Math.abs(selectTdObj.top - cellObj.top) < ERROR_LIMIT){
                    firstLineBool = true;
                }
            })
            if(!firstLineBool){
                let curRowspan = parseInt(selectTd.getAttribute('rowspan'),10) || 1;
                /* 修改 rowspan */
                modifyCellArr.forEach((cell)=>{
                    let rowspan = parseInt(cell.domNode.getAttribute('rowspan'),10) || 1;
                    cell.format('rowspan',rowspan - curRowspan);
                })
                for(let i = 0;i < curRowspan;i++){
                    if(curRow){
                        curRow.remove();
                        curRow = curRow.next;
                    }
                }
            }else {
                let rowspanArr = [];/* 存放合并单元格中的 rowspan  */
                modifyCellArr.forEach((cell)=>{
                    let rowspan = parseInt(cell.domNode.getAttribute('rowspan'),10);
                    rowspanArr.push(rowspan);
                })
                let maxRowspanNum = Math.max.apply(null,rowspanArr);
                let nextRow = curRow;
                for(let i = 0;i < maxRowspanNum;i++){
                    if(nextRow){
                        nextRow.remove();
                        nextRow = nextRow.next;
                    }
                }
            }
        }
    }
    /* 合并单元格 */
    mergeCellFn(selectTdArr, rowspan, colspan) {
        if(selectTdArr.length < 2){
            return;
        }
        selectTdArr.forEach((tableCell, index)=>{
            if (index !== 0) {
                tableCell.remove();
            } else {
                tableCell.format('colspan', colspan);
                tableCell.format('rowspan', rowspan);
            }
        });
    }
    /* 拆分合并表格 */
    splitCellFn(startTd,startColIndex) {
        const tableCell = Quill.find(startTd);
        let cellFormats = tableCell.formats();
        let cellRowspan = cellFormats.rowspan || 1;
        let cellColspan = cellFormats.colspan || 1;
        if(cellColspan < 2 && cellRowspan < 2){
            return;
        }
        /* 单元格列超过1 */
        if (cellColspan > 1) {
            tableCell.format('colspan', 1);
            let nextCell = tableCell.next;
            for(let i = 1; i < cellColspan ; i++){
                this.insertCell(tableCell.parent,nextCell);
            }
        }
        /* 单元格行超过1 */
        if (cellRowspan > 1) {
            tableCell.format('rowspan', 1);
            let nextRow = tableCell.row().next;
            for(let row = 1; row < cellRowspan ; row++){
                let colIndex = startColIndex;
                for(let col = 0; col < cellColspan ; col++){
                    if(nextRow){
                        let nextNode = nextRow.domNode.children[colIndex];
                        let nextCell = Quill.find(nextNode);
                        this.insertCell(nextRow,nextCell);
                        colIndex++;
                    }
                }
                nextRow = nextRow.next;
            }
        }
    }
    rows() {
        const body = this.children.tail
        if (body == null) return []
        return body.children.map(row => row)
    }
}
TableContainer.blotName = "table-container"
TableContainer.className = "quill-better-table"
TableContainer.tagName = "TABLE"

class TableViewWrapper extends Container {
    constructor(scroll, domNode) {
        super(scroll, domNode)
        const quill = Quill.find(scroll.domNode.parentNode);
    }

    table() {
        return this.children.head
    }
}
TableViewWrapper.blotName = "table-view"
TableViewWrapper.className = "quill-better-table-wrapper"
TableViewWrapper.tagName = "DIV"


TableViewWrapper.allowedChildren = [TableContainer]
TableContainer.requiredContainer = TableViewWrapper

TableContainer.allowedChildren = [TableBody, TableColGroup]
TableBody.requiredContainer = TableContainer

TableBody.allowedChildren = [TableRow]
TableRow.requiredContainer = TableBody

TableRow.allowedChildren = [TableCell]
TableCell.requiredContainer = TableRow

TableCell.allowedChildren = [TableCellLine]
TableCellLine.requiredContainer = TableCell

TableColGroup.allowedChildren = [TableCol]
TableColGroup.requiredContainer = TableContainer

TableCol.requiredContainer = TableColGroup


function rowId() {
    const id = Math.random()
        .toString(36)
        .slice(2, 6)
    return `row-${id}`
}

function cellId() {
    const id = Math.random()
        .toString(36)
        .slice(2, 6)
    return `cell-${id}`
}

export {
    // blots
    TableCol,
    TableColGroup,
    TableCellLine,
    TableCell,
    TableRow,
    TableBody,
    TableContainer,
    TableViewWrapper,

    // identity getters
    rowId,
    cellId,

    // attributes
    CELL_IDENTITY_KEYS,
    CELL_ATTRIBUTES
}

