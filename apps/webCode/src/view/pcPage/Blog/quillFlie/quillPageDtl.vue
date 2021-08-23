<template>
<div class="body" id="body">
        <div>
            <ybQuillEditor :title.sync="title" v-model="editerInfo" :propObj="propObj"></ybQuillEditor>
        </div>
</div>
</template>
<script>

import ybQuillEditor from './qsEditor/index.vue'
export default {
  components:{
      ybQuillEditor,
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
            console.log(allres);
            for(var item of allres){
                if(item.DtlId == id){
                    this.editerInfo = JSON.parse(item.content)
                    this.title = item.minTitle
                }
            }
            console.log(this.editerInfo,this.minTitle);
        })
      },
      getinfo(){

      }
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
</style>
