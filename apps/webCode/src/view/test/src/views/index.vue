<template>
<div :class="'editorbox '+'editorbox'+this.keys" :id="'editorbox'+keys">
    <div :id="'editor'+keys" class="editoritem" :style="tableConfig.showTool?'margin-top:125px':''">
        
    </div>
    <el-input v-model="titleinput" :disabled="mode=='VIEW'" 
    :placeholder="mode=='VIEW'?'':'请输入标题'" :style="needTitle?'top:'+inputPos.top+'px':'display:none'"
    class="titleboxitem" @keydown.native.enter="istoedit"></el-input>
    <input type="file" @change="upload" class="uploadstyle" id="uploadstyle">
    
    <div class="pageDtl_navbox" :style="mode=='VIEW'?'top:50px;right: 0px;':''" @mouseenter="genCatalog" v-if="needCatalog">
    <div class="linebpx">
    </div>
        <catalog :infolist="infolist" @scrollto="scrollto"></catalog>
    </div>
    <div class="bottomflag">
    </div>
    <div id="toolbar">
        <div style="display:flex">
                <select class="ql-header">
                    <option value="">正文</option>
                    <option value="1">标题1</option>
                    <option value="2">标题2</option>
                    <option value="3">标题3</option>
                    <option value="4">标题4</option>
                    <option value="5">标题5</option>
                    <option value="6">标题6</option>
                </select>
                <div class="yb-editor__btn-box">
                    <button class="ql-bold"></button>
                </div>
                <div class="yb-editor__btn-box">
                    <select class="ql-color"></select>
                </div>
                <div class="yb-editor__btn-box" >
                    <button class="ql-italic"></button>
                    
                </div>
                <div class="yb-editor__btn-box" >
                    <button class="ql-underline"></button>
                    
                </div>
                <div class="yb-editor__btn-box" >
                    <button class="ql-strike"></button>
                    
                </div>
                <div class="yb-editor__btn-box">
                    <button class="ql-code-block"></button>
                </div>
                <div class="yb-editor__btn-box" >
                    <button class="ql-align" value="justify"></button>
                </div>
                <div class="yb-editor__btn-box">
                    <button class="ql-align" value="center"></button>
                </div>
                <div class="yb-editor__btn-box">
                    <button class="ql-align" value="right"></button>
                </div>
                <div class="yb-editor__btn-box">
                    <button class="ql-list" value="bullet"></button>
                </div>
                <div class="yb-editor__btn-box">
                    <button class="ql-list" value="ordered"></button>
                </div>
                <div class="yb-editor__btn-box">
                    <button class="ql-image"></button>
                </div>
                <div class="yb-editor__btn-box">
                    <button class="ql-file"><i class="iconfont icon-fujian"></i></button>
                </div>
                <div class="yb-editor__btn-box">
                    <button class="ql-better-table" style="display:flex;align-items: center;" @click="showTaleSeclet">
                        <i class="iconfont icon-biaogeshezhi"></i>
                        <i class="el-icon-caret-bottom" style="font-size:12px;margin-left:2px"></i>
                    </button>
                    <div class="table-picker" v-if="tableConfig.showFlag" tabindex="0" id="table-picker" @blur="tableConfig.showFlag = false">
                        <div class="table-picker-rowitem" v-for="row of tableConfig.row">
                            <div class="table-picker-colitem"
                            v-for="col of tableConfig.col" @mouseenter="mouseenterFunc(row,col)"
                            @click="creatTable(row,col)"
                            :class="tableConfig.secletRow>=row&&tableConfig.secletCol>=col?'table-picker-seclet':''">
                            </div>
                        </div>
                        <div class="table-picker-tips">
                            <div>
                                {{tableConfig.secletRow+' x '+tableConfig.secletCol}}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div class="table_config_box" v-if="tableConfig.showTool"> 
            <div class="yb-editor__btn-box">
                <button @click="setTableConfig('insertRowUp')"><i class="iconfont icon-above-row"></i></button>
            </div>
            <div class="yb-editor__btn-box">
                <button @click="setTableConfig('insertRowDown')"><i class="iconfont icon-below-row"></i></button>
            </div>
            <div class="yb-editor__btn-box">
                <button @click="setTableConfig('deleteRow')"><i class="iconfont icon-shanchuhang"></i></button>
            </div>
            <div class="yb-editor__btn-box">
                <button @click="setTableConfig('insertColumnLeft')"><i class="iconfont icon-left-col"></i></button>
            </div>
            <div class="yb-editor__btn-box">
                <button @click="setTableConfig('insertColumnRight')"><i class="iconfont icon-right-col"></i></button>
            </div>
            <div class="yb-editor__btn-box">
                <button @click="setTableConfig('deleteColumn')"><i class="iconfont icon-shanchulie"></i></button>
            </div>
            <div class="yb-editor__btn-box">
                <button @click="setTableConfig('mergeCells')"><i class="iconfont icon-hebingdanyuange"></i></button>
            </div>
            <div class="yb-editor__btn-box">
                <button @click="setTableConfig('unmergeCells')"><i class="iconfont icon-fengedanyuange"></i></button>
            </div>
            <div class="yb-editor__btn-box">
                <button @click="setTableConfig('deleteTable')"><i class="iconfont icon-shanchubiaoge"></i></button>
            </div>
        </div>
    </div>
    <attachDlg v-model="fileList" v-if="showFileFlag" @toInserFile="toInserFile" @handleAvatarSuccess="handleAvatarSuccess" @closeDailog="showFileFlag =false" @toSecletFunc="toSecletFunc"></attachDlg>
    <preview  v-model="fileList" :downloadUrl="downloadUrl" :cPreViewNum="preViewNum" @closeDailog="showPreViews =false" v-if="showPreViews"></preview>
</div>  
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import catalog from './common/catalog/catalog.vue'
import File from './common/attachment/blot.js'
import mFile from './common/attachment/module.js'
import attachDlg from './common/attachment/attachDlg.vue'
import preview from './common/attachment/preview.vue'

import QuillBetterTable from './common/table'
import './common/table/assets/custom_table.scss'

Quill.register({
    'modules/better-table': QuillBetterTable
}, true);

Quill.register({
    'formats/file':File
})
Quill.register({
    'modules/mFile': mFile
}, true);
export default {
    name: "qsEditor",
    data() {
        return {
            thiseditor:'',
            titleinput:this.title,
            infolist:[],
            navindex:0,
            heilist:[0],
            istoscroll:true,
            catalog:{flag:false},
            styleNode:'',
            showFileFlag:false,
            fileList:[],
            fileImage:{
                pdf:require('../../static/img/PDF(2).png'),
                xlsx:require('../../static/img/EXCEL(3).png'),
                zip:require('../../static/img/zipBig.png'),
                rar:require('../../static/img/zipBig.png'),
                docx:require('../../static/img/WORD(1).png'),
                doc:require('../../static/img/WORD(1).png'),
                gif:'imgUrl',
                png:'imgUrl',
                jpg:'imgUrl',
                jpeg:'imgUrl',
                another:require('../../static/img/icon.png')
            },
            fileRange:{},
            preViewFileFlag:false,
                    imgUrl:'',
            showPreViews:false,
            preViewNum:0,
            customColors: [
            {color: '#f56c6c', percentage: 20},
            {color: '#e6a23c', percentage: 40},
            {color: '#5cb87a', percentage: 60},
            {color: '#1989fa', percentage: 80},
            {color: '#6f7ad3', percentage: 100}
            ],
            tableMoudle:null,
            tableConfig:{
                showFlag:false,
                row:4,
                col:5,
                secletRow:0,
                secletCol:0,
                showTool:false
            },
            inputPos:{
                top:15
            }
        };
    },
    watch:{
            title:{
                handler(newVal, oldVal) {
                    this.titleinput = newVal
                    this.thiseditor.setContents(JSON.parse(this.content))
                },
                immediate: false,
                deep: true
            },
            content:{
                handler(newVal, oldVal) {
                    this.genCatalog()
                },
                immediate: true,
                deep: true
            },
            mode:{
                handler(newVal, oldVal) {
                    if( this.thiseditor){
                        this.ifVIEW()
                    }
                    
                },
                immediate: true,
                deep: true
            },
            sentAttachList:{
                handler(newVal, oldVal) {
                    if(newVal){
                        this.fileList =JSON.parse(newVal) 
                    }
                },
                immediate: true,
                deep: true
            },
    },
    props: {
        mode:{
            type: String,
                default: function() {
                    return 'EDIT';
                }
        },
        needTitle:{
            type: Boolean,
                default: function() {
                    return true;
            }
        },
        needCatalog:{
            type: Boolean,
                default: function() {
                    return true;
            }
        },
        title:{
            type: String,
                default: function() {
                    return '';
            }
        },
        keys:{
            type: String,
                default: function() {
                    return '';
            }
        },
        sentAttachList:{
            type: String,
                default: function() {
                    return '';
            }
        },
        content:'',
        uploadUrl:'',
        downloadUrl:''
    },
    components:{
        catalog,
        attachDlg,
        preview
    },
    mounted() {
        this.init()
    },
    methods: {
        init(){
                var toolbar = document.getElementById('toolbar')
                this.thiseditor = new Quill('#editor'+this.keys, {
                modules: {
                    toolbar: toolbar,
                    mFile:true,
                    table: false,  // disable table module
                    'better-table': {
                    operationMenu: {
                        items: {
                            insertColumnRight: {
                                text: '向右插入一行'
                            },
                            insertColumnLeft: {
                                text: '向左插入一行'
                            },
                            insertRowUp: {
                                text: '向上插入一行'
                            },
                            insertRowDown: {
                                text: '向下插入一行'
                            },
                            mergeCells: {
                                text: '合并单元格'
                            },
                            unmergeCells: {
                                text: '拆分单元格'
                            },
                            deleteColumn: {
                                text: '删除列'
                            },
                            deleteRow: {
                                text: '删除行'
                            },
                            deleteTable: {
                                text: '删除表格'
                            },
                        },
                    }
                    },
                    keyboard: {
                    bindings: QuillBetterTable.keyboardBindings
                    }
                },
                theme: 'snow'
                });

                var toolbar = this.thiseditor.getModule('toolbar');
                toolbar.addHandler('image',this.showImageUI);
                toolbar.addHandler('file',this.openUpLoadDailog);
                this.genCatalog()
                this.thiseditor.getModule('mFile').preView(this.addClickEvent)
                this.tableMoudle = this.thiseditor.getModule('better-table');
                this.tableMoudle['getToolsShow'](this) //设置动态
                this.ifVIEW()
                if(typeof this.content == 'string'){
                    this.thiseditor.setContents(JSON.parse(this.content))
                }
        },
        openUpLoadDailog(){
            this.fileRange =  this.thiseditor.getSelection();
            this.showFileFlag = true
        },
        creatTable(row,col){
            this.tableMoudle.insertTable(row,col);
        },
        tolog(){
            var item = this.thiseditor.getContents()
            this.$emit('getContents',item)
        },
        showImageUI(){
            var temp = document.getElementById('uploadstyle')
            temp.click()
        },
        upload(e){
            var range =  this.thiseditor.getSelection();
            var formObj = new FormData();
            formObj.append("uploadFile",e.target.files[0]);
            formObj.append("isPublic",true);
            this.$http.post(this.uploadUrl,formObj).then(res=>{
                this.$http.post(this.downloadUrl,{
                        　　file_id:res.payload
                    }).then(ress => {
                        this.thiseditor.insertEmbed(range.index, 'image',ress.payload)
                }).catch(()=>{
                })
                
                
            })
        },
        ifVIEW(){
            if(this.mode == 'VIEW'){
                this.thiseditor.enable(false);
                this.tableMoudle.enable(true);
                var styleNode = document.createElement("style");
                styleNode.setAttribute("id","macnie"+this.keys);//赋值给这个元素一个ID。
                styleNode.setAttribute("lang","scss");
                styleNode.setAttribute("scoped",true);
                styleNode.innerHTML=`
                   .editorbox`+this.keys+` .ql-toolbar {
                       display:none
                   }
                   .linebox{
                       display:none
                   }
                  .editoritem{
                       margin-top: 0px!important;
                   }
                   .titleboxitem{
                       top: 15px!important;
                   }
                `;
                document.getElementById('editorbox'+this.keys).appendChild(styleNode)
               
            }
            else{
                this.tableMoudle.enable(false);
                var i  = document.getElementById('macnie'+this.keys)
                if (i) {
                    i.remove()
                }
            }
            if(this.needCatalog){
                this.catalog.flag = true
            }
        },
        istoedit(){
            this.thiseditor.focus();
        },
        tolink(type){
                if(type == 'edit'){
                    this.$router.push('/pageEdit/'+this.$route.params.id)
                }
            },
        scrollto(item,index){
            document.getElementById(item.domId).scrollIntoView({
                    behavior:'smooth',
                    block:"center"
            })
        },
        toaddFile(){

        },
        genCatalog(){
            var item = document.getElementsByClassName('ql-editor')
            if(!item[0]){
                return
            }
            if(this.mode == 'VIEW'){
                item[0].style="height: auto!important;min-height: 500px;"
            }
            else{
                var that = this
                item[0].addEventListener('scroll',(e)=>{
                    that.inputPos.top=(15-e.target.scrollTop)
                })
            
            }
            var itemlist = item[0].children
            for(var items in item[0].children){
                if(typeof item[0].children[items] !='number'){
                    item[0].children[items].id = item[0].children[items].offsetTop
                }
            }
            var arr = ['H1','H2','H3','H4','H5','H6',]
            var domarr = []
            for(var index in itemlist){
                if(typeof item[0].children[items] !='number'){
                    if(arr.indexOf(itemlist[index].nodeName)!=-1){
                    var obj = {header:itemlist[index].nodeName,title:itemlist[index].innerText,domId:itemlist[index].offsetTop}
                    domarr.push(obj)
                    }
                }
            }
            this.infolist = domarr
        },
        handleAvatarSuccess(e){
            var range =  this.thiseditor.getSelection();
            var formObj = new FormData();
            formObj.append("uploadFile",e.file);
            formObj.append("isPublic",true);
            var obj ={
                fileId:'',
                fileName:e.file.name,
                fileUrl:'',
                type:e.file.type,
                isSeclet:false,
                percentage:0
            }
            this.fileList.push(obj)
            var time = setInterval(()=>{
                if(obj.percentage<80){
                    obj.percentage +=1
                }
                else{
                    clearInterval(time)
                }
            },20)
            this.$http.post(this.uploadUrl,formObj).then(res=>{
                this.$http.post(this.downloadUrl,{
                　　file_id:res.payload
                }).then(ress => {
                    var ctime = setInterval(()=>{
                        if(obj.percentage>=80&&obj.percentage<=100){
                            obj.percentage +=1
                        }
                        else if(obj.percentage == 101){
                            clearInterval(ctime)
                            var listJson = JSON.stringify(this.fileList)
                            this.$emit('sentUploadList',listJson)

                            this.$set(obj,'percentage',0)
                            this.$set(obj,'isSeclet',true)
                        }
                    },80)
                    this.$set(obj,'fileId',res.payload)
                    this.$set(obj,'fileUrl',ress.payload)
                    
                }).catch(()=>{
                    this.fileList.pop()
                })

            })
      },
      addClickEvent(event){
          for(let index in this.fileList){
              var item = this.fileList[index]
            if(item.fileUrl == event.target.title){
                this.preViewNum = index
            }
        }
        this.showPreViews = true
        
        
      },
      toSecletFunc(){

      },
      toInserFile(){
        for(var item of this.fileList){
            if(item.isSeclet){
                var srcLink = this.fileImage[item.fileName.split('.')[1]]
                if(srcLink){
                    if(srcLink!='imgUrl'){
                        this.thiseditor.insertEmbed(this.fileRange?this.fileRange.index+1:1,'file',{src:srcLink,title:item.fileUrl,alt:item.fileName})
                    }
                    else{
                        this.thiseditor.insertEmbed(this.fileRange?this.fileRange.index+1:1,'file',{src:item.fileUrl,title:item.fileUrl,alt:item.fileName})
                    }
                }
                else{
                    this.thiseditor.insertEmbed(this.fileRange?this.fileRange.index+1:1,'file',{src:this.fileImag.another,title:item.fileUrl,alt:item.fileName})
                }
                item.isSeclet = false
            }
        }
        this.showFileFlag = false
        this.thiseditor.insertText(this.fileRange.index+2, ' ', true);
      },
      mouseenterFunc(i,j){
          this.tableConfig.secletRow = i
          this.tableConfig.secletCol = j
          if(i>=3&&i<10){
            this.tableConfig.row = i+1
          }
          if(j>=4&&j<10){
            this.tableConfig.col = j+1
          }
      },
      showTaleSeclet(){
          this.tableConfig.row = 4
          this.tableConfig.col = 5
          this.tableConfig.secletRow = 0
          this.tableConfig.secletCol = 0
          this.tableConfig.showFlag = true
          this.$nextTick(()=>{
              document.getElementById('table-picker').focus()
              
          });
      },
      setTableConfig(funcName){
        this.tableMoudle[funcName]()
      }
    }
    };
</script>
<style lang="scss" scoped>
>>>.el-input__inner{
    border: none!important;
    font-size: 28px;
    font-weight: 500;
    width: 90%;
    background:#fff!important;
    cursor:text!important;
    color: #172b4d!important;
}
</style>
<style lang="scss">
.editor {
  line-height: normal !important;
  height: 800px;
}
.editorbox{
    width: 100%;
    position: relative;
    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '正文';

    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
    }
    .ql-formats{
        border-right: 1px solid #dedfe3;
        padding-right: 5px;
    }
    .ql-container.ql-snow{
        border: none;
    }
    .ql-toolbar.ql-snow{
        border: none;
        border-bottom: 1px solid #dedfe3;
        position: fixed;
        top: 0px;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        min-height: 50px;
        height: auto!important;
        z-index: 9;
        background: #fff;
    }
    .ql-editor{
        overflow-y:unset;
        height: calc(100vh - 110px);
        overflow-y: scroll;
        padding:60px 15px 30px 15px;
       p{
           margin-top: 10px;
           line-height: 26px;
           font-size: 15px!important;
       }
       h1{
           margin-top: 20px;
           font-size: 26px!important;
       }
       h2{
           margin-top: 20px;
           font-size: 22px!important;
       }
       h3{
           font-weight: bold;
           margin-top: 20px;
           font-size: 18px!important;
       }
       h4{
           margin-top: 20px;
           font-size: 16px!important;
           font-weight: bold;
       }
       h5{
           margin-top: 20px;
           font-weight: bold;
           color: #5E6C84;
           font-size: 14px!important;
       }
       h6{
           margin-top: 20px;
           color: #5E6C84;
           font-size: 12px!important;
       }
    }
    .editoritem{
        margin-top: 60px;
    }
}
.uploadstyle{
    pointer-events: none;
    opacity: 0;
}
.titleboxitem{
    position: absolute!important;
    top: 15px;
    width: 100%;
}
.pageDtl_navbox{
    display: flex;
    position: fixed;
    top: 60px;
    right: 15px;
    background: #fff;
}
.linebpx{
    width: 1px;
    height: calc(100vh - 50px);
    background: #dedfe3;
}

.previewPortal_box{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(15,15,15,.9);
    z-index: 22059;
}
.previewPortal_head{
    width: 100%;
    height: 54px;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .previewPortal_title{
        color: hsla(0,0%,100%,.8);
        font-size: 14px;
        margin-left: 10px;
        font-weight: 600;
        &:hover{
            cursor: text;
            color:#fff;
        }
    }
    .previewPortal_config{
        display: flex;
        width: 50%;
        justify-content: flex-end;
        i{
            color: hsla(0,0%,100%,.8);
            
        }
        .item{
            color: #fff;
        }
        .previewPortal_config_downLoaditem{
            width: 70px;
            height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &:hover{
                i{
                    color:#fff;
                }
            }
        }
        .previewPortal_config_item{
            width: 70px;
            height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &:hover{
                background-color: rgba(221,44,0,.4);
                i{
                    color:#fff;
                }
            }
        }
    }
}
.previewPortal_body{
    width: 100%;
    height: calc(100% - 54px);
    display: flex;
    justify-content: center;
    align-items: center;
    .previewPortal_body_item{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;
    }
    .previewPortal_viewitem{
        background-color: hsla(0,0%,45.9%,.2);
        width: 60px;
        height: 60px;
        border-radius: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover{
            background-color: hsla(0,0%,45.9%,.4);
        }
    }
    .previewPortal_pre{
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 30px;
        i{
            color: #fff;
            font-size: 25px;
        }
    }
    .previewPortal_next{
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 30px;
        i{
            color: #fff;
            font-size: 25px;
        }
    }
}
.preview_dailog{
    .previewImg_box{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .Imgitem{
        max-width: 80%;
        max-height: 80%;
    }
    .tips_box{
        width: 300px;
        height: 100px;
        color: #fff;
        font-size: 18px;
        text-align: center;
        
    }
}
.fileClass{
    height: 210px;
    display: flex;
}
.quill_File{
    width: 210px;
    height: 210px;
    padding: 15px;
    background: #f5f5f5;
    display: flex;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
    cursor: pointer;
}
.titleDom{
    font-size:12px;
    width:100%;
    margin-top:5px;
    display: flex;
    justify-content: center;
    p{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 80%;
        text-align: center;
    }
}
.yb-editor__btn-box{
    position: relative;
    margin: 0 5px;
}
.table-picker{
    position: absolute;
    padding:10px 10px 0 10px;
    border:1px solid #ebedef;
    border-radius: 4px;
    z-index: 9999;
    background: #fff;
    box-shadow: 0 1px 5px #ddd;
    top: 25px;
    left: 5px;
    outline: none;
}
.table-picker-rowitem{
    display: flex;
}
.table-picker-colitem{
    width: 20px;
    height: 20px;
    display: inline-block;
    background: #f5f5f5;
    border-left:1px solid #fff;
    border-top:1px solid #fff;
    cursor: pointer;
}
.table-picker-seclet{
    background: #ccc;

}
.table-picker-tips{
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 2px 0 ;
}
.table_config_box{
    width: 100%;
    padding-left: 97px;
    height: 25px;
    display: flex;
    align-items: center;
    margin-top: 8px;
    animation: showflag ease-in-out 0.2s;
    i{
        font-size: 14px;
        color: #444;
    }
}
@keyframes showflag {
    0%{
        height: 0;
        opacity: 0.5;
    }
    100%{
        height: 25px;
        opacity: 1;
    }
}
</style>
