<template>
    <div id="yb-editor" :style="'width:' + propObj.widthStr + ';height:' + (propObj.heightStr || fullHeightStr)">
        <div class="yb-editor__toolbar-box" :style="'width:' + (propObj.widthStr || fullWidthStr)">
            <div :id="'yb-toolbar_' + this.propObj.keyStr" class="yb-toolbar" style="overflow:visible">
                <select class="ql-header">
                    <option value="">正文</option>
                    <option value="1">标题1</option>
                    <option value="2">标题2</option>
                    <option value="3">标题3</option>
                    <option value="4">标题4</option>
                    <option value="5">标题5</option>
                    <option value="6">标题6</option>
                </select>
                <div class="yb-editor__btn-box" @click="$set(varObj,'boldBool',!varObj.boldBool)">
                    <button class="ql-bold"></button>
                    <i class="iconfont icon-color icon-bold-cpn" :style="'background:' + (varObj.boldBool ? '#ebedef' : '')"></i>
                </div>
                <!-- <div class="yb-editor__btn-box" @click="$set(varObj,'colorBool',!varObj.colorBool)">
                    <select class="ql-color"></select>
                    <i class="iconfont icon-color icon-bold-cpn" :style="'background:' + (varObj.colorBool ? '#ebedef' : '')"></i>
                </div> -->
                <div class="yb-editor__btn-box" @click="$set(varObj,'italicBool',!varObj.italicBool)">
                    <button class="ql-italic"></button>
                    <i class="iconfont icon-color icon-italic-cpn" :style="'background:' + (varObj.italicBool ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'underlineBool',!varObj.underlineBool)" >
                    <button class="ql-underline"></button>
                    <i class="iconfont icon-color icon-underline-cpn" :style="'background:' + (varObj.underlineBool ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'strikeBool',!varObj.strikeBool)">
                    <button class="ql-strike"></button>
                    <i class="iconfont icon-color icon-strike-cpn" :style="'background:' + (varObj.strikeBool ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'codeBool',!varObj.codeBool)">
                    <button class="ql-code-block"></button>
                    <i class="iconfont icon-color icon-code-cpn" :style="'background:' + (varObj.codeBool ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'alignStr',varObj.alignStr === 'justify' ? '' : 'justify')">
                    <button class="ql-align" value="justify"></button>
                    <i class="iconfont icon-color icon-align-left-cpn" :style="'background:' + (varObj.alignStr === 'justify' ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'alignStr',varObj.alignStr === 'center' ? '' : 'center')">
                    <button class="ql-align" value="center"></button>
                    <i class="iconfont icon-color icon-align-center-cpn" :style="'background:' + (varObj.alignStr === 'center' ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'alignStr',varObj.alignStr === 'right' ? '' : 'right')">
                    <button class="ql-align" value="right"></button>
                    <i class="iconfont icon-color icon-align-right-cpn" :style="'background:' + (varObj.alignStr === 'right' ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'listStr',varObj.alignStr === 'bullet' ? '' : 'bullet')">
                    <button class="ql-list" value="bullet"></button>
                    <i class="iconfont icon-color icon-ul-cpn" :style="'background:' + (varObj.listStr === 'bullet' ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'listStr',varObj.alignStr === 'ordered' ? '' : 'ordered')">
                    <button class="ql-list" value="ordered"></button>
                    <i class="iconfont icon-color icon-ol-cpn" :style="'background:' + (varObj.listStr === 'ordered' ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'imageBool',!varObj.imageBool)">
                    <button class="ql-image"></button>
                    <i class="iconfont icon-color icon-img-cpn" :style="'background:' + (varObj.imageBool ? '#ebedef' : '')"></i>
                </div>
                <div class="yb-editor__btn-box" @click="$set(varObj,'linkBool',!varObj.linkBool)">
                    <button class="ql-link"></button>
                    <i class="iconfont icon-color icon-link-cpn" :style="'font-weight:bold;top:0px;left:7px;background:' + (varObj.linkBool ? '#ebedef' : '')"></i>
                </div>
                <!-- 表格 -->
                <div class="ql-table-box">
                    <div class="ql-add-table ql-table-btn" @click.stop="showPickerFn" style="width:50px;">
                        <i class="iconfont icon-insert-table-cpn" style="margin-left:7px;position: relative;bottom: 4px;color:#333"></i>
                        <i class="iconfont icon-down-arrow" style="font-size:24px;position:relative;top:1px;right: 2px;"></i>
                        <div class="yb-editor__table-picker" v-if="varObj.tablePickerBool" @click.stop="insertTableFn">
                            <div class="yb-tabel-picker__row" v-for="rowItem in varObj.tableMaxRowNum" :key="rowItem">
                                    <div v-for="colItem in varObj.tableMaxColNum" :ref="'yb-tabel-picker__cell' + rowItem + colItem" :key="rowItem + colItem" :class="{ 
                                        'yb-tabel-cell__item':true,
                                        'yb-tabel-cell__item--active':varObj.tableRowNum >= rowItem && varObj.tableColNum >= colItem}"
                                        @mouseenter="setTableSizeFn(rowItem,colItem)"></div>
                            </div>
                            <div class="yb-tabel-picker__tip">{{varObj.tableRowNum}} x {{varObj.tableColNum}}</div>
                        </div>
                    </div>
                </div>
                <!-- 目录 -->
                <div class="ql-catalog" @click="$set(varObj,'catalogBool',!varObj.catalogBool)" :style="varObj.catalogBool ? 'background:#ebedef' : ''">
                    <!-- <i class="iconfont icon-catalog-cpn"></i> -->
                    <img src="../assets/img/mulu.png" class="icon"/>
                </div>
            </div>
            <div class="ql-table__btn" :style="(varObj.tableBtnBool ? 'height:30px;' : 'height:0;') + (!varObj.tableBool ? 'color:#999;' : '')">
                <div class="ql-del-table ql-table-btn" @click.stop="insertAboveRowFn" title="此前插入行">
                    <!-- <i class="iconfont icon-above-row-cpn" :style="!varObj.tableBool ? 'opacity:0.5;' : ''"></i> -->
                    <div class="ql-table-container-box" :style="!varObj.tableBool ? 'opacity:0.5;' : ''">
                        <img src="../assets/img/4566.png"/>
                    </div>
                </div>
                <div class="ql-del-table ql-table-btn" @click.stop="insertBelowRowFn" title="此后插入行">
                    <!-- <i class="iconfont icon-below-row-cpn" :style="!varObj.tableBool ? 'opacity:0.5;' : ''"></i> -->
                    <div class="ql-table-container-box" :style="!varObj.tableBool ? 'opacity:0.5;' : ''">
                        <img src="../assets/img/4511.png" style="position:relative;top:1px"/>
                    </div>
                </div>
                <div class="ql-del-table ql-table-btn" @click.stop="delRowFn" title="删除行">
                    <!-- <i class="iconfont icon-del-row-cpn" :style="!varObj.tableBool ? 'opacity:0.5;' : ''"></i> -->
                    <div class="ql-table-container-box" :style="!varObj.tableBool ? 'opacity:0.5;' : ''">
                        <img src="../assets/img/4788.png"/>
                    </div>
                </div>
                <div class="ql-del-table ql-table-btn" @click.stop="insertLeftColFn" title="此前插入列">
                    <!-- <i class="iconfont icon-left-col-cpn" :style="!varObj.tableBool ? 'opacity:0.5;' : ''"></i> -->
                    <div class="ql-table-container-box" :style="!varObj.tableBool ? 'opacity:0.5;' : ''">
                        <img src="../assets/img/4200.png"/>
                    </div>
                </div>
                <div class="ql-del-table ql-table-btn" @click.stop="insertRightColFn" title="此后插入列">
                    <!-- <i class="iconfont icon-right-col-cpn" :style="!varObj.tableBool ? 'opacity:0.5;' : ''"></i> -->
                    <div class="ql-table-container-box" :style="!varObj.tableBool ? 'opacity:0.5;' : ''">
                        <img src="../assets/img/4245.png"/>
                    </div>
                </div>
                <div class="ql-del-table ql-table-btn" @click.stop="delColFn" title="删除列">
                    <!-- <i class="iconfont icon-del-col-cpn del" :style="!varObj.tableBool ? 'opacity:0.5;' : ''"></i> -->
                    <div class="ql-table-container-box" :style="!varObj.tableBool ? 'opacity:0.5;' : ''">
                        <img src="../assets/img/4211.png" style="position:relative;top:1px"/>
                    </div>
                </div>
                
                <div class="ql-del-table ql-table-btn" @click.stop="mergeCellFn" title="合并单元格">
                    <!-- <i class="iconfont icon-merge-cell-cpn" :style="!varObj.tableBool ? 'opacity:0.5;' : ''"></i> -->
                    <div class="ql-table-container-box" :style="!varObj.tableBool ? 'opacity:0.5;' : ''">
                        <img src="../assets/img/4877.png"/>
                    </div>
                </div>
                <div class="ql-del-table ql-table-btn" @click.stop="splitCellFn" title="拆分单元格">
                    <!-- <i class="iconfont icon-split-cell-cpn" :style="!varObj.tableBool ? 'opacity:0.5;' : ''"></i> -->
                    <div class="ql-table-container-box" :style="!varObj.tableBool ? 'opacity:0.5;' : ''">
                        <img src="../assets/img/452.png"/>
                    </div>
                </div>
                <div class="ql-del-table ql-table-btn" @click.stop="delTableFn" title="删除表格">
                    <!-- <i class="iconfont icon-del-table-cpn" :style="!varObj.tableBool ? 'opacity:0.5;' : ''"></i> -->
                    <div class="ql-table-container-box" :style="!varObj.tableBool ? 'opacity:0.5;' : ''">
                        <img src="../assets/img/888.png"/>
                    </div>
                </div>
            </div>
        </div>
        <input class="yb-editor__title" type="text" v-model="titleStr" :disabled="propObj.disabledBool" placeholder="页面标题" v-show="propObj.titleBool">
        <div :id="propObj.keyStr || 'yb-editor__body'" class="yb-editor__body" :style="'height:calc(100% - ' + (propObj.disabledBool ? 0 : ( varObj.tableBool || varObj.tableBtnBool ? 75 : 45 )) + 'px)'"></div>
        <yb-editor-catalog :instanceObj="quillObj" v-model="varObj.catalogBool" :style="'top:' + ( varObj.tableBool || varObj.tableBtnBool ? 85 : 55 ) + 'px'"></yb-editor-catalog>
    </div>
</template>
<script>
    import Quill from 'quill'
    import "../assets/css/quill.snow.css";
    /* 引入表格模块 */
    import QuillCustomTable from '../custom_table'
    import '../custom_table/assets/custom_table.css'
    import '../custom_table/assets/icon/iconfont.css'
    Quill.register({
        'modules/custom-table': QuillCustomTable
    }, true);
    
    /* 引入目录模块 */
    import ybEditorCatalog from '../components/catalog.vue'

    export default {
        name: "ybQuillEditor",
        data() {
            return {
                varObj:{
                    catalogBool:false,
                    tableBool:false,
                    tableMaxRowNum:4,/* 表格最大有多少行 */
                    tableMaxColNum:5,/* 最大有多少列 */
                },
                titleStr:'fasdfas',/* 标题 */
                fullHeightStr:document.documentElement.clientHeight + 'px',
                fullWidthStr:document.documentElement.clientWidth + 'px',
                quillObj: null,
                tableMoudle:null,
                tableContainerObj:null,/* 当前表格对象的 dom 节点 */
                actBool: false,
            };
        },
        props:{
            /* 文档内容 */
            value:{
                default:{}
            },
            /* 标题 */
            title:{
                default(){
                    return ''
                }
            },
            propObj:{
                type : Object,    
                default() {
			        return {
                        uploadUrl: 'http://47.111.190.231:9301/upload/uploadPublicImg',
                        widthStr:'900px',/* 组件宽度 */
                        keyStr:'',/* 编辑器唯一标识 */
                        heightStr:document.documentElement.clientHeight + 'px',/*文档高度,默认满屏*/
                        disabledBool:false,/*是否禁用编辑*/
                        catalogBool:false,/* 是否显示目录 */
                        titleBool: false,/* 是否需要标题 */
                    }
			    }
            }
        },
        components:{
            ybEditorCatalog
        },
        mounted() {
            this.$nextTick(() => {
                this.initQuillFunc(); /* 初始化编辑器 */
                /* 获取到最新数据 */
                this.$watch('value', {
                    immediate: true,
                    deep:true,
                    handler: (newVal,oldVal)=>{
                        /* source 参数可以传 "user" , "api" , "silent"。如果 source 是 "user"，当编辑器处于 disabled时该方法会失效 */
                        if(typeof newVal === 'object'){
                            let len = this.quillObj.getLength();
                            this.quillObj.deleteText(0,len);/* 设置前先清空内容 */
                            this.quillObj.updateContents(JSON.parse(JSON.stringify(newVal)), 'silent');
                        }
                    }
                });
                this.quillObj.on('editor-change',(type,...args)=>{
                    this.$emit('input',JSON.stringify(this.quillObj.getContents()));
                    localStorage.setItem('deltaObj',JSON.stringify(this.quillObj.getContents()));
                    if(type === 'selection-change'){
                        this.setActiveFormatFn();
                    }
                })
            });
            window.addEventListener('click',()=>{
                this.$set(this.varObj,'tablePickerBool',false);
            });
            window.addEventListener('mousemove',(event)=>{
                this.setTablePickerFn();
            });
            /* 计算宽度 */
            this.$watch('propObj', {
                immediate: true,
                deep:true,
                handler: (newVal,oldVal)=>{
                    let widthStr = newVal.widthStr;
                    if(String(parseInt(newVal.widthStr)) !== 'NaN'){
                        widthStr = (parseInt(newVal.widthStr) - 250) + 'px';
                    }
                    if('100%' === newVal.widthStr.trim()){
                        widthStr = 'calc(100% - 250px)';
                    }
                    this.$set(this.varObj,'widthStr',widthStr);
                    this.$set(this.varObj,'catalogBool',newVal.catalogBool || false);
                }
            });
            this.$watch('title', {
                immediate: true,
                handler: (newVal,oldVal)=>{
                    this.titleStr = newVal;
                }
            });
            this.$watch('titleStr', {
                immediate: true,
                handler: (newVal,oldVal)=>{
                    this.$emit('update:title', newVal);
                }
            });
        },
        methods: {
            /* 初始化 Quill */
            initQuillFunc() {
                var vm = this;           
                if(this.propObj.disabledBool){
                    require("../assets/css/quill.bubble.css");
                } 
                var that = this
                this.quillObj = new Quill('#' + (this.propObj.keyStr || 'yb-editor__body'), {
                    /* 模块 */
                    modules: {
                        syntax: false,/* 语法高亮 */
                        toolbar: {
                            
                            container: '#yb-toolbar_' + this.propObj.keyStr,
                            handlers: {
                                image: function (value) {
                                    var fileInput = this.container.querySelector('input.ql-image[type=file]');
                                    if (fileInput == null) {
                                        fileInput = document.createElement('input');
                                        fileInput.setAttribute('type', 'file');
                                        fileInput.setAttribute('accept', 'image/*');
                                        fileInput.classList.add('ql-image');
                                        fileInput.addEventListener('change', ()=> {
                                            function   dataURLtoBlob(dataurl) {
                                            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                                                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                                            while(n--){
                                                u8arr[n] = bstr.charCodeAt(n);
                                            }
                                            return [u8arr];
                                            }
                                            if (fileInput.files != null && fileInput.files[0] != null) {
                                                
                                                var reader = new FileReader(); //实例化文件读取对象]
                                                var file = fileInput.files[0]
                                                reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
                                                reader.onload = function(ev) { //文件读取成功完成时触发
                                                var formObj = new File(dataURLtoBlob(reader.result), file.name, {type:file.type})
                                                    that.$http.upload(formObj,file.name).then(res=>{
                                                    var imgUrl = 'http://47.94.235.210:8090/uploadData/getFile/'+res.data.id;
                                                    var range = vm.quillObj.getSelection();
                                                    vm.quillObj.insertEmbed(range.index, 'image', imgUrl)
                                                })
                                            }
                                            }
                                        });
                                        this.container.appendChild(fileInput);
                                    }
                                    fileInput.click();
                                }
                            }
                        },
                        table:false,
                        'custom-table':true,
                        keyboard: {
                            bindings: QuillCustomTable.keyboardBindings
                        }
                    },
                    theme: this.propObj.disabledBool ? "bubble" : 'snow' /* 主体色 snow bubble*/,
                    placeholder: "" /* 提示文字 */,
                    readOnly: this.propObj.disabledBool ? true : false /* 是否只读 */,
                });
                this.tableMoudle = this.quillObj.getModule('custom-table');
            },

            /* 显示设置表格行列的选择器 */
            showPickerFn(){
                this.$set(this.varObj,'tablePickerBool',true);
                this.$set(this.varObj,'tableMaxRowNum',4);
                this.$set(this.varObj,'tableMaxColNum',5);
                this.$set(this.varObj,'tableRowNum',0);
                this.$set(this.varObj,'tableColNum',0);
            },
            /* 设置表格编辑器行数和列数 */
            setTablePickerFn(){
                if(this.varObj.tablePickerBool){
                    var posX = event.pageX;
                    var posY = event.pageY;
                    /* 获取第一个 cell 的位置 */
                    var firstCellObj = this.$refs['yb-tabel-picker__cell11'][0].getBoundingClientRect();
                    var relWidthNum = posX - firstCellObj.left;
                    var relHeightNum = posY - firstCellObj.top;
                    /* 如果鼠标的横坐标位置大于 列号*21px,则列号 +1 */
                    if(relWidthNum > this.varObj.tableMaxColNum*21 && this.varObj.tableMaxColNum < 10){
                        this.$set(this.varObj,'tableMaxColNum',this.varObj.tableMaxColNum + 1);
                    }
                    var lastColPosX = this.varObj.tableMaxColNum*21 + firstCellObj.left;
                    var relColNum = (lastColPosX - posX)/21;
                    if ( this.varObj.tableColNum > 4 && relColNum > 1){
                        this.$set(this.varObj,'tableMaxColNum',this.varObj.tableColNum);
                    }

                    /* 如果鼠标的纵坐标位置大于 行号*21px,则行号 +1 */
                    if(relHeightNum > this.varObj.tableMaxRowNum*21 && this.varObj.tableMaxRowNum < 10){
                        this.$set(this.varObj,'tableMaxRowNum',this.varObj.tableMaxRowNum + 1);
                    }
                    var lastRowPosY = this.varObj.tableMaxRowNum*21 + firstCellObj.top;
                    var relRowNum = (lastRowPosY - posY)/21;
                    if ( this.varObj.tableRowNum > 3 && relRowNum > 1){
                        this.$set(this.varObj,'tableMaxRowNum',this.varObj.tableRowNum);
                    }
                }
            },
            /* 设置要插入表格的行列数量 */
            setTableSizeFn(rowItem,colItem){
                this.$set(this.varObj,'tableRowNum',rowItem);
                this.$set(this.varObj,'tableColNum',colItem);
            },
            /* 插入表格 */
            insertTableFn(){
                this.tableMoudle.insertTable(this.varObj.tableRowNum,this.varObj.tableColNum);
                this.quillObj.focus();
                this.$set(this.varObj,'tableBool',true);
                this.$set(this.varObj,'tableBtnBool',true);
                this.$set(this.varObj,'tablePickerBool',false);
                this.tableContainerObj = document.querySelector(".quill-custom-table");
            },
            /* 左边插入列 */
            insertLeftColFn(){
                if(this.varObj.tableBool){
                    this.tableMoudle.insertColLeftFn();
                    this.$set(this.varObj,'tableBool',false);
                }
            },
            /* 右边插入列 */
            insertRightColFn(){
                if(this.varObj.tableBool){
                    this.tableMoudle.insertColRightFn();
                    this.$set(this.varObj,'tableBool',false);
                }
            },
            /* 上边插入行 */
            insertAboveRowFn(){
                if(this.varObj.tableBool){
                    this.tableMoudle.insertRowAboveFn();
                    this.$set(this.varObj,'tableBool',false);
                }
            },
            /* 下边插入行 */
            insertBelowRowFn(){
                if(this.varObj.tableBool){
                    this.tableMoudle.insertRowBelowFn();
                    this.$set(this.varObj,'tableBool',false);
                }
            },
            /* 删除当前行 */
            delRowFn(){
                if(this.varObj.tableBool){
                    this.tableMoudle.deleteRowFn();
                    this.$set(this.varObj,'tableBool',false);
                }
            },
            /* 删除当前列 */
            delColFn(){
                if(this.varObj.tableBool){
                    this.tableMoudle.deleteColFn();
                    this.$set(this.varObj,'tableBool',false);
                }
            },
            /* 合并单元格 */
            mergeCellFn(){
                if(this.varObj.tableBool){
                    this.tableMoudle.mergeCellFn();
                    this.$set(this.varObj,'tableBool',false);
                }
            },
            /* 拆分单元格 */
            splitCellFn(){
                if(this.varObj.tableBool){
                    this.tableMoudle.splitCellFn();
                    this.$set(this.varObj,'tableBool',false);
                }
            },
            /* 删除表格 */
            delTableFn(){
                if(this.varObj.tableBool){
                    this.tableMoudle.deleteTableFn();
                    this.$set(this.varObj,'tableBool',false);
                }
            },
            /* 设置默认的格式 */
            setActiveFormatFn(){
                let rangeObj = this.quillObj.getSelection() || {};
                var formatObj = this.quillObj.getFormat(rangeObj,rangeObj.length);
                this.$set(this.varObj,'boldBool',false);
                this.$set(this.varObj,'italicBool',false);
                this.$set(this.varObj,'underlineBool',false);
                this.$set(this.varObj,'strikeBool',false);
                this.$set(this.varObj,'codeBool',false);
                this.$set(this.varObj,'imageBool',false);
                this.$set(this.varObj,'linkBool',false);
                this.$set(this.varObj,'colorBool',false);
                let isTableBool = false;
                for(let prop in formatObj){
                    if(prop === 'table-cell-line'){
                        this.$set(this.varObj,'tableBool',true);
                        this.$set(this.varObj,'tableBtnBool',true);
                        isTableBool = true;
                    }
                    if(prop === 'bold'){
                        this.$set(this.varObj,'boldBool',true);
                    }
                    if(prop === 'italic'){
                        this.$set(this.varObj,'italicBool',true);
                    }
                    if(prop === 'underline'){
                        this.$set(this.varObj,'underlineBool',true);
                    }
                    if(prop === 'strike'){
                        this.$set(this.varObj,'strikeBool',true);
                    }
                    if(prop === 'code-block'){
                        this.$set(this.varObj,'codeBool',true);
                    }
                    if(prop === 'image'){
                        this.$set(this.varObj,'imageBool',true);
                    }
                    if(prop === 'link'){
                        this.$set(this.varObj,'linkBool',true);
                    }
                    if(prop === 'color'){
                        this.$set(this.varObj,'colorBool',true);
                    }
                    if(prop === 'align'){
                        this.$set(this.varObj,'alignStr',formatObj.align);
                    }
                    if(prop === 'list'){
                        this.$set(this.varObj,'listStr',formatObj.list);
                    }
                }
                let selectTdArr = (this.tableMoudle.tableSelection || {}).selectTdArr || [];
                if(!isTableBool && !selectTdArr.length){
                    setTimeout(()=>{
                        this.$set(this.varObj,'tableBool',false);
                    },50);
                }
            },
        }
    };
</script>
<style lang="scss">
body{
    margin:0;
}
#yb-editor {
    position: relative;
    height:100%;
    color:#575757;
    overflow: hidden;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    .yb-editor__toolbar-box{
        text-align:left;
        border-bottom:1px solid #dfe1e5;
        box-sizing: border-box;
        .yb-toolbar{
            width: 100%;
            overflow: visible !important;
        }
        .yb-editor__btn-box{
            position: relative;
            display: inline-block;
            float: left;
            line-height: 24px;
            text-align: center;
            margin-left: 10px;
            .iconfont{
                cursor: pointer;
                pointer-events: none;
                position: absolute;
                top: 1px;
                left: 5px;
                font-size: 12px;
                color:#575757;
                width: 25px;
                text-align: center;
                border-radius: 4px;
                background: transparent;
            }
            .icon-color{
                color: #222;
            }
        }
        .yb-editor__btn-box:hover .iconfont{
            background:#ebedef;
        }
    }
    .yb-editor__title{
        width: calc(100% - 250px);
        padding:15px 30px;
        outline: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: none;
        border: none;
        box-shadow: none;
        display: inline-block;
        font-size: 28px;
        height: 40px;
        font-size: #172B4D;
    }
    .ql-toolbar.ql-snow,
    .yb-editor__body{
        transition: height 0.3s;
        overflow: auto;
        padding:10px 30px;
        scroll-behavior: smooth;
        box-sizing:border-box;
	    border-radius: 2px;
        font-size: 14px;
        border:none;
        .ql-editor{
            padding:0;
            width:calc(100% - 250px);
            overflow: visible;
        }
        .ql-editor::-webkit-scrollbar {
            width: 10px;
            height: 10px;
            position: relative;
            left: 100px;
            background-color: transparent;
        }
    }
    .ql-header{
        margin-right:15px;
        text-align: left;
        .ql-stroke{
            stroke-width:0 !important;
        }
        .ql-active{
            background: #ebedef;
        }
        .ql-picker-options{
            padding:4px 0;
            width: 120px;
            background: #fff;
            z-index: 1;
            border:1px solid #ebedef;
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
            .ql-picker-item{
                padding:4px 15px;
            }
            .ql-picker-item:hover{
                padding:4px 15px;
                color:#333;
                background: #f0f3f4;
            }
        }
    }
    .ql-header:before{
        content: "";
        border-top: 4.5px solid transparent;
        border-bottom: 4.2px solid transparent;
        border-left: 4.5px solid #575757;
        position: absolute;
        top: 7px;
        right: 8px;
        z-index: 1000;
        transform: rotate(90deg);
    }
    // .ql-header:after{
    //     content: '';
    //     position: absolute;
    //     width: 1px;
    //     background: #ccc;
    //     height: 24px;
    //     top: 0;
    //     bottom: 0;
    //     right: -12px;
    // }
    .ql-header:hover .ql-picker-label{
        color:#333 !important;
        background: #ebedef;
    }
    .ql-header.ql-expanded .ql-picker-label{
        background: #f0f3f4;
        color:#333;
    }
    .ql-snow .ql-editor pre.ql-syntax{
        background: #fafafa;
        color:#333;
    }

    .ql-catalog{
        background: none;
        border: none;
        cursor: pointer;
        display: inline-block;
        float: left;
        height: 24px;
        padding: 0 5px;
        width: 25px;
        border-radius: 4px;
        text-align: center;
        background:transparent;
        margin-left: 8px;
        .iconfont{
            font-size: 12px;
        }
        .icon{
            width: 13px;
            height: 13px;
            position: relative;
            top: 4px;
        }
    }
    .ql-catalog:hover{
        background:#ebedef;
    }
    /* 表格 */
    table{
        width: 0;
        border-spacing: 0;
        text-align: left;
        td,
        th{
            border: 1px solid #d6d6d6;
            color: #575757; 
            height: 30px; 
            min-width:50px;
            padding: 5px 10px;
        }
        thead th{
            background-color: #CCE8EB;
            width: 100px;
        }
    }
    .yb-editor__table-picker{
        position: absolute;
        padding:7px 7px 0;
        border:1px solid #ebedef;
        border-radius: 4px;
        z-index: 9999;
        background: #fff;
        box-shadow: 0 1px 5px #ddd;
        .yb-tabel-picker__row{
            min-width:100px;
            background: #f5f5f5;
            text-align:left;
            white-space:nowrap;
            overflow: hidden;
            height: 20px;
        }
        .yb-tabel-cell__item{
            width: 20px;
            height: 20px;
            display: inline-block;
            border-left:1px solid #fff;
            border-top:1px solid #fff;
        }
        .yb-tabel-cell__item--active{
            background: #ccc;
        }
        .yb-tabel-picker__tip{
            text-align: center;
            font-size: 12px;
            color:#575757;
            line-height: 20px;
        }
    }
    .ql-table-btn:hover .iconfont{
        background: #ebedef;
    }
    .ql-table-box{
        position: relative;
        // margin:0 20px;
        display: inline-block;
        float: left;
        margin-left: 15px;
        .ql-table-btn{
            vertical-align: middle;
            outline: none;
            border:none;
            float: left;
            display: inline-block;
            height: 24px;
            line-height: 20px;
            width: 28px;
            position: relative;
            top: 1px;
            margin-left:5px;
            cursor: pointer;
            .iconfont{
                font-size: 12px;
                color:#575757;
            }
        }
    }
    // .ql-table-box:before,
    // .ql-table-box:after{
    //     content: '';
    //     position: absolute;
    //     width: 1px;
    //     background: #ccc;
    //     height: 24px;
    //     top: 0;
    //     bottom: 0;
    //     right: -5px;
    // }
    .ql-table-box:after{
        right: auto;
        left:-5px;
    }
    .ql-table-box:hover{
        background:#ebedef;
        border-radius: 4px;
    }
    .ql-table__btn{
        overflow: hidden;
        transition: all 0.3s;
        height: 0;
        position: relative;
        bottom:5px;
        padding-left:146px;
        margin-top: 5px;
        .ql-table-btn{
            vertical-align: middle;
            outline: none;
            border:none;
            float: left;
            display: inline-block;
            height: 24px;
            line-height: 24px;
            width: 28px;
            text-align: center;
            position: relative;
            top: 1px;
            margin-left: 10px;
            cursor: pointer;
            .iconfont{
                font-size: 12px;
                color:#575757;
            }
            .del{
                position: relative;
                left: 8px;
                top: 1px;
            }
            .ql-table-container-box{
                box-sizing: border-box;
                width: 24px;
                position: relative;
                left: 3px;
                img{
                    vertical-align: sub;
                }
            }
            .ql-table-container-box:hover{
                background-color: rgba(0,0,0,0.08);
                border-radius: 3px;
            }
        }
    }
    .ql-picker-label{
        outline: none;
        border:none;
        padding-top: 1px;
    }
    .ql-active{
        color:#575757 !important;
    }
    .ql-code-block-container{
        background:#f0f0f0;
        color:#333;
    }

    .qlbt-col-tool{
        pointer-events: none;
        top: 29px !important;
        .qlbt-col-tool-cell{
            position: relative;
            border:none;
            height: 100% !important;
            background: transparent;
            .qlbt-col-tool-cell-holder{
                pointer-events: all;
            }
        }
    }
    .ql-snow .ql-tooltip{
        position: absolute;
        top: 0;
        left: 35px !important;
    }
    
    .ql-snow .ql-tooltip::before {
        content: "跳转链接:";
    }
    .ql-snow .ql-tooltip a.ql-action::after{
        content: '编辑';
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        content: '保存';
    }
    .ql-snow .ql-tooltip a.ql-remove::before {
        content: '移除链接';
    }
    strong{
        font-weight: bold;
    }
    em{
        font-style: italic;
    }
}    
</style>
