import Quill from 'quill'
import { css } from '../utils'

export default class TableTool {
    constructor (table, quill) {
        if (!table) return null;
        this.table = table;
        this.quill = quill;
        this.domNode = null;
        this.tdArr = [];

        const parent = this.quill.root.parentNode;
        this.domNode = document.createElement('div');
        this.domNode.classList.add('ql-table-tool');
        this.tableId = table.getAttribute('id');
        this.domNode.setAttribute('tableId',this.tableId);
        parent.appendChild(this.domNode);
    
        this.helperLine = document.createElement('div');
        this.helperLine.classList.add('ql-table-helperline');
        this.helperLine.setAttribute('tableId',this.tableId);
        parent.appendChild(this.helperLine);
        this.createToolCellLineFn();

        /* 监听表格样式变化设置辅助线样式 */
        this.quill.on('editor-change',(type,...args)=>{
            setTimeout(()=>{
                let curTable = document.getElementById(this.quill.curTableId);
                if(curTable){
                    if(this.isToolRBool){
                        css(this.helperLine, {
                            height:`${curTable.offsetHeight}px`
                        })
                    }
                    if(this.isToolBBool){
                        css(this.helperLine, {
                            width:`${curTable.offsetWidth - 3}px`
                        })
                    }
                }
            })
        })
        /* 监听编辑器滚动表格位置变化设置辅助线位置信息 */
        this.scrollEl = document.getElementsByClassName('ql-editor')[0];
        this.scrollEl.addEventListener('scroll',(e)=>{
            let curTable = document.getElementById(this.quill.curTableId);
            if(curTable){
                let topNum = curTable.parentNode.offsetTop - this.scrollEl.scrollTop;
                css(this.helperLine, {
                    top:`${topNum}px`
                })
            }
        });
    }
    /* 初始化 */
    initTableTool () {
        let curCellObj = this.quill.activeCellObj;
        if(curCellObj){
            if(this.domNode){
                css(this.domNode, {
                    display:'block',
                    width: `${curCellObj.width}px`,
                    height: `${curCellObj.height}px`,
                    left: `${curCellObj.x}px`,
                    top: `${curCellObj.y}px`
                })
            }
        }
    }
    /* 创建辅助线 */
    createToolCellLineFn () {
        var fragmentObj = document.createDocumentFragment(); 
        const cellRight = document.createElement('div');
        const cellBottom = document.createElement('div');
        
        cellRight.classList.add('ql-table-cell-tool');
        cellBottom.classList.add('ql-table-cell-tool');
        cellRight.classList.add('ql-table-cell-right');
        cellBottom.classList.add('ql-table-cell-bottom');
        
        fragmentObj.appendChild(cellRight);
        fragmentObj.appendChild(cellBottom);
        
        this.domNode.appendChild(fragmentObj);
        /* 显示辅助线 */
        document.addEventListener('mousedown', (e) => {
            if(typeof e.target.className === 'string' && e.target.className.indexOf('ql-table-cell-tool') > -1){
                this.quill.isMouseMoveBindBool = true;
                this.updateHelperLineFn(e.target);
                this.mouseDownPosX = e.clientX;
                this.quill.curTableId = e.target.parentNode.getAttribute('tableId');
                this.curTableId = this.table.getAttribute('id');
                document.addEventListener('mousemove',this.moveHelperLineFn.bind(this),false);
                document.addEventListener('mouseup', this.resizeTableFn.bind(this),false);
            }
            /* 取消辅助线 */
            document.addEventListener('mouseup',this.resizeTableFn.bind(this),false);
        },false)
    }
    /* 更新拖动辅助线样式 */
    updateHelperLineFn(target){   
        /* 拖动时清除所有光标 */
        (window.getSelection() || document.selection).removeAllRanges();
        if(this.helperLine.getAttribute('tableId') !== target.parentNode.getAttribute('tableId')){ return; };
        if(!this.table || !this.quill.curTdObj){
            return;
        }
        const tableRect = this.table.getBoundingClientRect() || {};
        const toolObj = this.domNode.style;
        /* 计算当前单元格所在的列索引 */
        let mergeTdArr = [];/* 合并了的单元格 */
        let affectTdArr = [];
        let tdArr = this.table.querySelectorAll('td');
        var curTdObj = {};
        var curTdObj = this.quill.curTdObj.getBoundingClientRect() || {};
        tdArr.forEach(td=>{
            let cellObj = td.getBoundingClientRect() || {};
            if(cellObj.left < curTdObj.left){
                if(curTdObj.top >= cellObj.top && curTdObj.bottom <= cellObj.bottom){
                    let colspan = parseInt(td.getAttribute('colspan'),10);
                    if(colspan > 1){/* 跨列数大于 1 */
                        mergeTdArr.push(td);
                    }else {
                        affectTdArr.push(td);
                    }
                }else if(Math.abs(curTdObj.top - cellObj.top) < 5){
                    affectTdArr.push(td);
                }
            }
        })
        let mergeCellColspan = mergeTdArr.reduce((total,td)=>{
            let colspan = parseInt(td.getAttribute("colspan"),10);
            return total + colspan;
        },0);
        let curColspan = parseInt(this.quill.curTdObj.getAttribute('colspan'),10);
        this.colIndex = mergeCellColspan + affectTdArr.length + curColspan - 1;/* 当前单元格所在的列索引 */

        this.isToolRBool = target.className.indexOf('ql-table-cell-right') > -1;
        this.isToolBBool = target.className.indexOf('ql-table-cell-bottom') > -1;
        if(this.isToolRBool){
            var leftStr = ((parseInt(toolObj.left) + parseInt(toolObj.width)) + 'px');
            css(this.helperLine, {
                cursor:'ew-resize',
                display:'block',
                width: `2px`,
                height: `${tableRect.height}px`,
                left: `${leftStr}`,
                top: `${(this.table.parentNode || {}).offsetTop - this.scrollEl.scrollTop}px`
            })
        }
        if(this.isToolBBool){
            var topStr = (parseInt(toolObj.top) + parseInt(toolObj.height) - 2 + 'px');
            css(this.helperLine, {
                cursor:'ns-resize',
                display:'block',
                height: `2px`,
                width: `${tableRect.width - 2}px`,
                left: `${this.table.offsetLeft}px`,
                top: `${topStr}`
            })
        }
    }
    /* 移动辅助线位置 */
    moveHelperLineFn(e){
        if(this.quill.isMouseMoveBindBool){
            if(this.quill.curTableId !== this.curTableId){
                return;
            }
            const tableContainer = Quill.find(this.table);
            if(!this.table || !tableContainer){
                return;
            }
            const wraperRect = this.table.parentNode.getBoundingClientRect() || {};
            const toolObj = this.domNode.style;
            const containerRect = this.quill.root.getBoundingClientRect() || {};
            let colBlot = tableContainer.colGroup().children.at(this.colIndex);/* 当前列 */
            let colNextBlot = tableContainer.colGroup().children.at(this.colIndex + 1);/* 当前列的下一列 */
            var x = e.clientX;
            var y = e.clientY;        
            var cellWidth = x - containerRect.x - parseInt(toolObj.left,10);
            var cellHeight = y - containerRect.y - parseInt(toolObj.top,10);
            /* 改变列宽 */
            if(this.isToolRBool){
                /* 计算合并单元格除最后一个的宽度和 */
                let curColspan = parseInt(this.quill.curTdObj.getAttribute('colspan'),10);
                let colArr = this.table.parentNode.querySelectorAll('col');
                for(let i = 1;i < curColspan;i++){
                    let mergeCellWidth = parseInt((colArr[this.colIndex - 1]).getAttribute('width'),10);
                    cellWidth = cellWidth - mergeCellWidth;
                }
                /* 计算列宽度和 */
                var arr = Array.prototype.slice.call(colArr);
                let colwidth = arr.reduce((total,cur)=>{
                    return parseInt(total,10) + parseInt(cur.width,10);
                },0);
                /* 向右拉动，各列宽度和超出外层宽度且下一列宽度小于了50，设置最大宽度 */
                if(colwidth - wraperRect.width >= 0 && this.mouseDownPosX < e.clientX){
                    if(!colNextBlot || (colNextBlot && parseInt(colNextBlot.domNode.width) <= 50)){
                        return;
                    }
                }
                /* 向左拖动，设置最小宽度 */
                if(cellWidth < 50 && this.mouseDownPosX > e.clientX){
                    return;
                }
                css(this.helperLine, {
                    'left': `${x - containerRect.x + 35}px`/* 这里的 35 是 editor 的左 padding值 */
                });

                if(colBlot){
                    var befWidth = colBlot.domNode.width;
                    colBlot.format('width', cellWidth + 35);
                }
                if(colNextBlot){
                    let abWidth = colBlot.domNode.width - befWidth;
                    let relWidth = parseInt(colNextBlot.domNode.width) - abWidth;
                    colNextBlot.format('width',relWidth < 50 ? 50 : relWidth);
                }
            }
            /* 改变行高 */
            if(this.isToolBBool){
                css(this.helperLine, {
                    'top': `${y - containerRect.y + 35}px`
                })
                
                let curTdObj = this.quill.curTdObj;
                let rowspan = parseInt(curTdObj.getAttribute('rowspan'),10);
                let parent = curTdObj.parentNode;
                let trBlot = Quill.find(parent);
                /* 计算合并单元格除最后一行的高度和 */
                if(rowspan > 1){
                    for(let i = 1;i < rowspan;i++){
                        trBlot = trBlot.next;
                    }
                    curTdObj = curTdObj.getBoundingClientRect() || {};
                    let lastTrObj = trBlot.domNode.getBoundingClientRect() || {};
                    let sumHeightNum = curTdObj.height - lastTrObj.height;
                    cellHeight = sumHeightNum ? cellHeight - sumHeightNum : cellHeight;
                }
                let tableCellArr = trBlot.domNode.children;
                tableCellArr = Array.prototype.slice.call(tableCellArr);
                // console.log('发达');
                tableCellArr.forEach((td)=>{
                    let cell = Quill.find(td);
                    cell.format('height',cellHeight + 35);
                })
            }
        }
    }
    /* 鼠标松开更新表格位置 */
    resizeTableFn(e){
        e.preventDefault();

        this.quill.isMouseMoveBindBool = false;
        css(this.helperLine, {display: `none`});
        this.tdArr.forEach((item,index)=>{
            css(item, {cursor:'text'});
        })
        this.quill.update(Quill.sources.USER);
        document.removeEventListener('mousemove', this.moveHelperLineFn.bind(this));
        document.removeEventListener('mouseup', this.resizeTableFn.bind(this));
    }
    /* 清除工具 */
    destroyFn() {
        const parent = this.quill.root.parentNode;
        let tableToolObj = parent.querySelector('.ql-table-tool');
        let tableHelperline = parent.querySelector('.ql-table-helperline');
        if(tableToolObj){
            tableToolObj.remove();
            tableHelperline.remove();
        }
    }
}
