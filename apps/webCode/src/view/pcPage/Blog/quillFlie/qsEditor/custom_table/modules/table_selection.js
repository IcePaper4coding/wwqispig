import Quill from 'quill'
import { TableCell,TableRow } from '../formats/table'

export default class TableSelection{
    constructor(table, quill){
        if(!table){
            return;
        }
        this.table = table;
        this.quill = quill;
        this.initFn();
    }
    
    /* 初始化选区 */
    initFn(){
        this.clearSelectionFn();
        this.moveBool = false;/* 是否可以拖动选区 */
        this.selectTdArr = [];/* 选中的单元格对象数组 */
        this.startTd = null;/* 选区初始单元格对象 */
        this.startTdObj = null;/* 选区初始单元格位置信息 */
        this.endTd = null;/* 选区初始单元格对象 */
        this.endTdObj = null;/* 选区初始单元格位置信息 */

        this.startTdColIndex = -1;/* 选区开始单元格所在的列 */

        this.rowspan = 0;/* 选区所占行数 */
        this.colspan = 0;/* 选区所占列数 */
    }
    /* 鼠标手动设置选区 */
    setSelectionFn(clickEvent){
        this.initFn();
        this.moveBool = true;
        this.quill.root.addEventListener('mousemove',moveHandlerFn.bind(this),false);/* 监听mousemove事件 */
        
        const tableContainer = Quill.find(this.table);
        if(!tableContainer){
            return;
        };
        /* 获取表格中所有单元格的数组 */
        const tableCellArr = tableContainer.descendants(TableCell);
        
        /* 设置选区初始单元格对象 */
        this.startTd = clickEvent.target.closest('td[data-row]');
        if(!this.startTd) {
            return;
        }
        /* 设置选区初始单元格对象位置信息 */
        this.startTdObj = this.startTd.getBoundingClientRect() || {};
        if(!this.startTdObj) {
            return;
        }        
        function moveHandlerFn(moveEvent){
            if (clickEvent.pageX === moveEvent.pageX && clickEvent.pageY === moveEvent.pageY) {/* 点击时禁止触发 mousemove */
                return false;
            }
            if(!this.moveBool) return;
            if(this.endTd !== this.quill.curTdObj){
                this.clearSelectionFn();
                this.endTd = this.quill.curTdObj;/* 鼠标悬停在单元时设置好的当前单元格对象 */
                if(!this.endTd) {
                    return;
                }
                this.endTdObj = this.endTd.getBoundingClientRect() || {};
                const tableCellArr = tableContainer.descendants(TableCell);
                tableCellArr.forEach(tableCell => {
                    var curCellRect = tableCell.domNode.getBoundingClientRect() || {};
                    var centerObj = {};/* 计算单元格中心点 */
                    centerObj.x = (curCellRect.left + curCellRect.right)/2;
                    centerObj.y = (curCellRect.top + curCellRect.bottom)/2;
                    if(centerObj.x > (this.startTdObj || {}).left && centerObj.x < (this.endTdObj || {}).right && 
                    centerObj.y > (this.startTdObj || {}).top && centerObj.y < (this.endTdObj || {}).bottom){
                        this.selectTdArr.push(tableCell);
                    }
                })  
                if(this.selectTdArr.length > 1){
                    /* 拖动时清除所有光标 */
                    this.quill.selectionObj.removeAllRanges();
                }
                this.selectTdArr.forEach(td=>{
                    td.domNode.classList.add('ql-selected-cell');
                })
            }
        }
        /* 鼠标松开 */
        document.addEventListener('mouseup',mouseUpFn.bind(this));
        function mouseUpFn(){
            document.removeEventListener('mouseup',mouseUpFn.bind(this));
            this.quill.root.removeEventListener('mousemove', moveHandlerFn.bind(this),false);
            this.moveBool = false;
            if(!tableCellArr || !tableContainer || !this.startTdObj){
                return;
            }
            /* 计算当前单元格所在的列 */
            let mergeCellArr = [];/* 合并了的单元格 */
            let affectCellArr = [];
            tableCellArr.forEach(cell=>{
                let cellObj = cell.domNode.getBoundingClientRect() || {};
                let colspan = parseInt(cell.domNode.getAttribute('colspan'));
                if(cellObj.left < this.startTdObj.left){
                    if(this.startTdObj.top >= cellObj.top && this.startTdObj.bottom <= cellObj.bottom){
                        if(colspan > 1){/* 跨行数大于 1 */
                            mergeCellArr.push(cell);
                        }else {
                            affectCellArr.push(cell);
                        }
                    }else if(Math.abs(this.startTdObj.top - cellObj.top) < 5){
                        affectCellArr.push(cell);
                    }
                }
            })
            let mergeCellColspan = mergeCellArr.reduce((total,cell)=>{
                let colspan = parseInt(cell.domNode.getAttribute("colspan"));
                return total + colspan;
            },0);
            this.startTdColIndex = mergeCellColspan + affectCellArr.length;/* 开始单元格所在的列索引 */
            
            let tableRowArr = tableContainer.descendants(TableRow);
            /* 选区的所占的行数量 */
            let selectTrArr = [];
            tableRowArr.forEach((row,index)=>{
                let curRowRect = row.domNode.getBoundingClientRect() || {};
                let centerObj = {};/* 计算当前行高中心点行高的一半是否在选区中 */
                centerObj.x = (curRowRect.left + curRowRect.right) / 2;
                centerObj.y = (curRowRect.top + curRowRect.bottom) / 2;
                if(centerObj.y > (this.startTdObj || {}).top && centerObj.y < (this.endTdObj || {}).bottom){
                    selectTrArr.push(row);
                }
            })
            this.rowspan = selectTrArr.length;

            /* 把 td 分行去重 */
            var selectTdObj = {};
            this.selectTdArr.forEach(td=>{
                var row = td.parent.domNode.getAttribute('data-row');
                selectTdObj[row] = [];
            })
            /* 把当前行的 td push到行中 */
            this.selectTdArr.forEach(td=>{
                var row = td.parent.domNode.getAttribute('data-row');
                for(let prop in selectTdObj){
                    if(prop === row){
                        selectTdObj[prop].push(td);
                    }
                }
            })
            /* 计算选区所在最大行列数量 */
            var rowColArr = [];
            for(let prop in selectTdObj){
                let rowArr = selectTdObj[prop];
                const rowColspanNum = rowArr.reduce((total,tableCell)=>{
                    let colspan = parseInt(tableCell.domNode.getAttribute('colspan'));
                    return total + colspan;
                },0);
                rowColArr.push(rowColspanNum);/* 各行所占的列数 */
            }
            if(rowColArr.length){
                this.colspan = Math.max.apply(null,rowColArr);/* 选区所占列的数量 */
            }
        }
    }
    /* 清除选区 */
    clearSelectionFn(){
        this.selectTdArr = [];
        const tableContainer = Quill.find(this.table);
        if(!tableContainer){
            return;
        }
        const tableCellArr = tableContainer.descendants(TableCell);
        tableCellArr.forEach(tableCell => {
            tableCell.domNode.classList.remove('ql-selected-cell');
        });
    }
}