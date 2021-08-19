<template>
<div class="body" id="body">
    <div class="BlogHeader">
        <div class="headerBox">
            <div class="logo" >
               <!-- <img class="myLogo" src="http://47.94.235.210:8090/uploadData/getFile/6108f0a889a8ab3256302983" alt="">-->
                <img  @click="toLink('/Bloghome')" class="myLogo_tip" src="http://47.94.235.210:8090/uploadData/getFile/6108f85589a8ab3256302985" alt="">
            </div>
            <div class="navBox">
                <div class="navItem" :style="linkIndex=='/Bloghome'?'color: #fd5d7b;':''" @click="toLink('/Bloghome')"><i class="el-icon-s-home"></i> 首页</div>
                <div class="navItem" @click="toLink()"><i class="el-icon-s-help"></i> 博客</div>
                <div class="navItem" @click="toLink()"><i class="el-icon-s-comment"></i> 问答</div>
                <div class="navItem" @click="toLink()"><i class="el-icon-s-flag"></i> bug总结</div>
                <div class="navItem" :style="linkIndex=='/APIpage'?'color: #fd5d7b;':''" @click="toLink('/APIpage')"><i class="el-icon-s-order"></i> API文档</div>
            </div>
            <div class="authConfig">
                <div>  
                    <el-input
                        placeholder="请输入关键词搜索"
                        prefix-icon="el-icon-search"
                        v-model="keyword">
                    </el-input>
                </div>
                <div class="loginBox">登录</div>
            </div>
        </div>
    </div>
    <div class="BlogBody">
        <router-view></router-view>
    </div>

</div>
</template>
<script></script>
<script>
export default {
  data(){
      return{
          keyword:'',
          linkIndex:'/Bloghome'
      }
  },
  mounted(){
  },
  methods:{
      toLink(link){
          if(link){
              if(this.linkIndex != link){
                  this.linkIndex = link
                  this.$router.push(link)
              }
            }
      }
  },
}
</script>

<style lang="scss" scoped>
.body{
    height: 100vh;
    width: 100vw;
    background-color: #F2F3F5;
    
}
.BlogHeader{
    position: fixed;
    top: 0;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    background: #fff;
    z-index: 9999;
}
.headerBox{
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-size: 15px;
    
    .logo{
        width: 15%;
        height: 60px;
        padding: 10px 0;
        display: flex;
        overflow: hidden;
    }
    .myLogo{
        height: 180PX;
        transform: translateY(-25px);
    }
    .myLogo_tip{
        height: 140px;
        transform: translateY(-40px);
        flex: 0 0 auto;
        cursor: pointer;
    }
    .navBox{
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: 50%;
        flex: 0 0 auto;
        .navItem{
            color: #fca0b1;
            width: 20%;
            cursor: pointer;
            font-weight: 600;
            &:hover{
                color: #fd5d7b;
            }
        }
    }
    .authConfig{
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .loginBox{
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
    }
}
>>>.el-input__inner:focus{
    border: 1px solid #ff8198;
}
.BlogBody{
    position: fixed;
    top: 80px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    background: #fff;
    .BlogBodyItem{
        width: 100%;
    }
    &::-webkit-scrollbar{
        width: 5px!important;
    }
}
</style>