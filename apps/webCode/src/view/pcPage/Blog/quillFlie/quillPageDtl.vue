<template>
<div class="body" id="body">
        <div>
            <wqEditor :title.sync="title" v-model="editerInfo" :propObj="propObj"></wqEditor> 
        </div>
        <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            title="此操作将删除这篇文章，确定继续吗？"
            @confirm="todel"
            >
           <div class="pubBtn" slot="reference">
            删除
        </div>
            </el-popconfirm>

         <div class="editBtn" @click="toEditFunc">
            编辑
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
                    disabledBool:true,/*是否禁用编辑*/
                    uploadUrl:'xxx',/* 上传图片接口 */
                    catalogBool:true,/* 是否默认显示目录 */
                    titleBool:true
                }
      }
  },
  mounted(){
      this.queryDtl()
  },
  methods:{
      queryDtl(){
        this.$http.query('api').then(res=>{

            var allres = JSON.parse(res.data.jsonmap)
            var id = this.$route.params.id
            for(var item of allres){
                if(item.DtlId == id){
                    this.editerInfo = JSON.parse(item.content)
                    this.title = item.minTitle
                    item.viewNum+=1
                }
            }
            this.$http.change('api',allres,()=>{})
        })
      },
      getinfo(){

      },
      todel(){
        this.$http.query('api').then(res=>{
            var allres = JSON.parse(res.data.jsonmap)
            for(var index in allres){
                if(allres[index].DtlId == this.$route.params.id){
                    allres.splice(index,1)
                }
            }
            this.$http.change('api',allres,()=>{
                this.$message({
                    showClose: true,
                    message: '删除成功',
                    type: 'success'
                });
                this.$router.push('/APIpage')
            })
        })
      },
      toEditFunc(){
          this.$router.push('/quillPageEdit/'+this.$route.params.id)
      },
  },
}
</script>

<style lang="scss" scoped>
.body{
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
}
>>>.yb-editor__title{
    width: 100%!important;
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
    .editBtn{
        position: fixed;
        bottom: 50px;
        right: 250px;
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
</style>
