<template>
  <div class="table_box">
      <div class="table_config">
        <input type="number" v-model="tableConfig.colNum" placeholder="列数"> 列
        <input type="number" v-model="tableConfig.rowNum" placeholder="宽数"> 行
        <button @click="mergeCells">合并</button>
        <button @click="splitCellFn">拆分</button>
        <div>-----------------------------------------</div>
        <div class="table_item" id="table" tabindex="0"  @blur="loseBlur" :style="toselct?'user-select:none':''">
            <table border="1" cellspacing="0">
                <colgroup>
                    <col v-for="item of tableConfig.cols" :key="item.id" :style="'width:'+item.width+'px'">
                </colgroup>
                <tbody>
                    <tr v-for="(item,rowId) of tableConfig.rows" :key="rowId">
                        <td v-for="(zitem,colId) of tableConfig.cols"
                        contenteditable
                        class="table_tdCell"
                        v-if="calTd(rowId,colId)!='hidden'"
                        :id="rowId+'_'+colId"
                        :name="calTd(rowId,colId).mergeItem?'mergeItem':''"
                        :style="showSelect(rowId,colId)"
                        :rowspan="calTd(rowId,colId).rowspan?calTd(rowId,colId).rowspan:1"
                        :colspan="calTd(rowId,colId).colspan?calTd(rowId,colId).colspan:1" :key="colId" >
                            show
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
  </div>
</template>
<script>

export default {
    name: 'App',
    data(){
        return{
            tableConfig:{
                colNum:8,
                rowNum:8,
                cols:{},
                rows:{},
                mergeCells:[]
            },
            selectCellList:{
                startCell:{
                },   //起始单元格
                endCell:{
                } //结束单元格 
            },
            toselct:false,
            startPoisition:{
                x:null,
                y:null,
                startCell:{
                },
            },
            mergeCellList:{},
            selcetTableCells:{}
        }
    },
    computed: {

    },
    mounted() {
        this.init()
    },
    methods:{
        init(){
            for(var ncols = 0; ncols <Number(this.tableConfig.colNum);ncols++){
                var colItem = {
                    colWidth:150,
                    index:ncols,
                }
                this.$set(this.tableConfig.cols,this.createRandomId(ncols,'ncols'),colItem)
            }
            for(var crow = 0;crow< Number(this.tableConfig.rowNum);crow++){ 
                var crowItem = {
                    rowHeight:40,
                    index:crow
                }
                this.$set(this.tableConfig.rows,this.createRandomId(crow,'crow'),crowItem)
            }
            this.$nextTick(
                ()=>{
                    document.addEventListener('mousedown',(e)=>{
                        if(e.target.className != 'table_tdCell'){
                            return
                        }
                        this.selectCellList={
                            startCell:{
                            },   //起始单元格
                            endCell:{
                            } //结束单元格 
                        }
                        this.selcetTableCells ={}
                        this.toselct = true
                        var zobj = {
                            rowId:e.target.id.split('_')[0],
                            colId:e.target.id.split('_')[1]
                        }
                        this.$set(this.selectCellList,'startCell',zobj)
                    })
                    document.addEventListener('mousemove',(e)=>{
                        if(e.target.className != 'table_tdCell'){
                            return
                        }
                        if(this.toselct){
                                var rowId = e.target.id.split('_')[0]
                                var colId = e.target.id.split('_')[1]
                                if(this.mergeCellList[e.target.id]){
                                    this.$set(this.selcetTableCells,e.target.id,{
                                        rowIndex:this.tableConfig.rows[rowId].index,
                                        colIndex:this.tableConfig.cols[colId].index
                                    })
                                    this.$set(this.selcetTableCells,this.mergeCellList[e.target.id],{
                                        rowIndex:this.tableConfig.rows[this.mergeCellList[e.target.id].split('_')[0]].index,
                                        colIndex:this.tableConfig.cols[this.mergeCellList[e.target.id].split('_')[1]].index
                                    })
                                }
                                else{
                                    this.$set(this.selcetTableCells,e.target.id,{
                                        rowIndex:this.tableConfig.rows[rowId].index,
                                        colIndex:this.tableConfig.cols[colId].index
                                    })
                                }
                                var firstId = Object.keys(this.selcetTableCells)[0]
                                var ltrowIndex = this.selcetTableCells[firstId].rowIndex
                                var ltcolIndex = this.selcetTableCells[firstId].colIndex
                                var rbrowIndex = this.selcetTableCells[firstId].rowIndex
                                var rbcolIndex = this.selcetTableCells[firstId].colIndex
                                var cellConfig ={
                                    left:firstId.split('_')[1],
                                    top:firstId.split('_')[0],
                                    right:firstId.split('_')[1],
                                    bottom:firstId.split('_')[0],
                                }
                                for(let id in this.selcetTableCells){
                                    if(ltrowIndex>this.selcetTableCells[id].rowIndex){
                                        ltrowIndex=this.selcetTableCells[id].rowIndex
                                        cellConfig.top = id.split('_')[0]
                                    }
                                    if(ltcolIndex>this.selcetTableCells[id].colIndex){
                                        ltcolIndex=this.selcetTableCells[id].colIndex
                                        cellConfig.left = id.split('_')[1]
                                    }
                                    if(rbrowIndex<this.selcetTableCells[id].rowIndex){
                                        rbrowIndex=this.selcetTableCells[id].rowIndex
                                        cellConfig.bottom = id.split('_')[0]
                                    }
                                    if(rbcolIndex<this.selcetTableCells[id].colIndex){
                                        rbcolIndex=this.selcetTableCells[id].colIndex
                                        cellConfig.right = id.split('_')[1]
                                    }
                                }
                                var selectCellList={
                                    startCell:{
                                        rowId:cellConfig.top,
                                        colId:cellConfig.left
                                    },   //起始单元格
                                    endCell:{
                                        rowId:cellConfig.bottom,
                                        colId:cellConfig.right
                                    } //结束单元格 
                                }
                                this.$set(this.selectCellList,'startCell',selectCellList.startCell)
                                this.$set(this.selectCellList,'endCell',selectCellList.endCell)
                        }
                    })
                    document.addEventListener('mouseup',(e)=>{
                        if(e.target.className != 'table_tdCell'){
                            document.getElementById('table').focus()
                        }
                        this.toselct = false
                        console.log(this.selcetTableCells,77);
                    })
                }
            );
        },
        setTable(){
            this.init()
        },
        calTd(rowId,colsId){
            var res = 'show'
            this.tableConfig.mergeCells.forEach((item)=>{
                    var ltrowIndex = this.tableConfig.rows[item.startCell.rowId].index
                    var ltcolIndex = this.tableConfig.cols[item.startCell.colId].index
                    var rbrowIndex = this.tableConfig.rows[item.endCell.rowId].index
                    var rbcolIndex = this.tableConfig.cols[item.endCell.colId].index
                    if(
                        this.tableConfig.cols[colsId].index>=ltcolIndex&&
                        this.tableConfig.cols[colsId].index<=rbcolIndex&&
                        this.tableConfig.rows[rowId].index>=ltrowIndex&&
                        this.tableConfig.rows[rowId].index<=rbrowIndex
                    ){
                        if(ltcolIndex == this.tableConfig.cols[colsId].index&&this.tableConfig.rows[rowId].index == ltrowIndex){
                            res = {
                                mergeItem:true,
                                colspan:Math.abs(rbcolIndex - ltcolIndex)+1,
                                rowspan:Math.abs(rbrowIndex - ltrowIndex)+1,
                            }
                            this.$set(this.mergeCellList,rowId+'_'+colsId,item.endCell.rowId+'_'+item.endCell.colId)
                            return 
                        }
                        res = 'hidden'
                    }
                // }

            })
            
            return res
        },
        showSelect(rowId,colsId){
            var res = ''
            if(this.selectCellList.startCell.rowId&&this.selectCellList.endCell.rowId){
                var ltrowIndex = this.tableConfig.rows[this.selectCellList.startCell.rowId].index
                var ltcolIndex = this.tableConfig.cols[this.selectCellList.startCell.colId].index
                var rbrowIndex = this.tableConfig.rows[this.selectCellList.endCell.rowId].index
                var rbcolIndex = this.tableConfig.cols[this.selectCellList.endCell.colId].index
                if(
                    this.tableConfig.cols[colsId].index>=ltcolIndex&&
                    this.tableConfig.cols[colsId].index<=rbcolIndex&&
                    this.tableConfig.rows[rowId].index>=ltrowIndex&&
                    this.tableConfig.rows[rowId].index<=rbrowIndex
                ){  
                    res = 'background:#e5e5e5'
                    
                }
            }
        // }

            
            return res
        },
        createRandomId(index,type){
            if(type){
                return type+'-'+index
            }
            var random = (Math.random()*10000000000).toFixed(0)
            var Id = random +'_index'
            return Id
        },
        mergeCells(){
            if(this.selectCellList.startCell.rowId&&this.selectCellList.endCell.rowId){
                var cell = JSON.parse(JSON.stringify(this.selectCellList))
                this.tableConfig.mergeCells.push(cell)
            }

        },
        splitCellFn(){
            var that = this
            var mergeCells = JSON.parse(JSON.stringify(this.tableConfig.mergeCells))
            var list = []
            mergeCells.forEach((item)=>{
                if(
                    (that.selectCellList.startCell.rowId ==item.startCell.rowId&&that.selectCellList.startCell.colId == item.startCell.colId)
                    ||
                    (that.selectCellList.endCell.rowId ==item.endCell.rowId&&that.selectCellList.endCell.colId == item.endCell.colId.index)
                ){

                }
                else{
                   list.push(item)
                }
            })
            this.tableConfig.mergeCells = list
        },
        loseBlur(){
            if(!this.toselct){
                setTimeout(()=>{
                    this.selectCellList={
                        startCell:{
                            rowId:'',
                            colId:''
                        },   //起始单元格
                        endCell:{
                            rowId:'',
                            colId:''
                        } //结束单元格 
                    }
                },200)
            }
        },
        returnBigger(aId,a,bId,b){
            if(a>b){
                return aId
            }
            else{
                return bId
            }
        },
        returnSmaller(aId,a,bId,b){
            if(a<b){
                return aId
            }
            else{
                return bId
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.table_box{
    width: 100vw;
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.table_config{
    padding: 15px;
}
.table_tdCell{
    outline: none;
    text-align: start;
    padding: 8px;
}
.table_item{
    outline: none;
}
</style>
