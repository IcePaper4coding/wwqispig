<template>
<div class="nav">
<div>{{tabname}}</div>
</div>
</template>

<script>
export default {
    props:{
        tabname:{
            default:'首页',
            type:String
        }
    },
  data(){
      return{

      }
  },
  mounted(){

  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
.nav{
    width: 100%;
    height: 45px;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
    position: fixed;
    top: 0;
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
    background: #fff;
    z-index: 99;

}

</style>
