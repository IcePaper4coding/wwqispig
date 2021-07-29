<template>
<div class="body">
    <router-view/>
    <navs :tabname="tabname"></navs>
    <tab ref="tab"></tab>
</div>
</template>

<script>
import tab from './tab'
import navs from './navs'
export default {
 components:{
     tab,
     navs
 },
watch:{
    $route: {
        handler: function(val, oldVal){
            this.tabname=this.$refs.tab.tablist[Number(this.$route.query.id)].name
        },
        deep: true
    },
},
  data(){
      return{
          tabname:''
      }
  },
  mounted(){
    //   
      this.tabname=this.$refs.tab.tablist[Number(this.$route.query.id)].name
      this.$http.checklogin(()=>{},()=>{
          this.$router.push('/')
      })
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>

</style>
