<template>
<div class="body" id="body">
        <div class="addQuillBox">
         <wqEditor :title.sync="title" v-model="editerInfo" :propObj="propObj"></wqEditor> 
        </div>
         <div class="pubBtn" @click="tosave">
            发布
        </div>
</div>
</template>
<script>

import wqEditor from './qsEditor/wqEditor/index.vue'
export default {
  components:{
      wqEditor,
  },
  data(){
      return{
        editerInfo:{},// 编辑器要绑定的 delta 数据，
        title:'',// 编辑器标题
        propObj:{
                    widthStr:'1200px',/* 组件宽度 */
                    heightStr:document.documentElement.clientHeight - 180 + 'px',/*文档高度,默认满屏*/
                    disabledBool:false,/*是否禁用编辑*/
                    uploadUrl:'xxx',/* 上传图片接口 */
                    catalogBool:true,/* 是否默认显示目录 */
                    titleBool:true
                }
      }
  },
  mounted(){
    //   this.$http.add('api',{})
    // this.$http.change('api',[],()=>{})
  },
  methods:{
      tosave(item){

        this.$http.query('api').then(res=>{
            var allres = JSON.parse(res.data.jsonmap)
            var id = new Date().getTime()
            var quillObj = {
              minTitle:this.title,
              content:this.editerInfo,
              DtlId:id+allres.length,
              createdTime:id,
              viewNum:200,
              groupId:'全部'
            }
            allres.push(quillObj)
            this.$http.change('api',allres,()=>{
                this.$message({
                    showClose: true,
                    message: '发布成功',
                    type: 'success'
                });
                this.$router.push('/BlogpageDtl/'+quillObj.DtlId)
            })
        })
      },
        tolog(){
            this.$refs.quilleditor.tolog()
        },
        getinfo(){

        }
  },
}
</script>

<style lang="scss" scoped>
        .addQuillBox{
            width: 100%;
            display: flex;
            height:100%;
            overflow: scroll;
            justify-content: center;
        }
        .saveBtn{
        position: fixed;
        bottom: 50px;
        right: 200px;
            width: 100px;
            height: 40px;
            line-height: 40px;
            border-radius: 4px;
            text-align: center;
            cursor: pointer;
            background: #ff8198;
            color: #fff;
            margin-left: 15px;
            &:hover{
                background: #faa5b4;
            }
        }
        .pubBtn{
        position: fixed;
        bottom: 50px;
        right: 50px;
            width: 100px;
            height: 40px;
            line-height: 40px;
            border-radius: 4px;
            text-align: center;
            cursor: pointer;
            background: #ff8198;
            color: #fff;
            margin-left: 15px;
            &:hover{
                background: #faa5b4;
            }
        }
>>>.yb-editor__title{
    width: 100%!important;
}
.quilleditor{
    width: 80%;
}
</style>
