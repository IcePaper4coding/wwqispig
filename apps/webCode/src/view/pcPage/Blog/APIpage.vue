<template>
<div class="body" id="body">
   <!--<vue-editor v-model="content" />-->
   <div class="leftMenu">
   <el-menu
      default-active="1-10"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ff8198">
      <el-submenu index="1-0">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>接口开发</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-10">全部</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template slot="title">登录系统</template>
          <el-menu-item index="1-1">登录</el-menu-item>
          <el-menu-item index="1-2">注册</el-menu-item>
          <el-menu-item index="1-3">修改密码</el-menu-item>
          <el-menu-item index="1-4">忘记密码</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template slot="title">文档系统</template>
          <el-menu-item index="1-5">修改文档</el-menu-item>
          <el-menu-item index="1-6">删除文档</el-menu-item>
          <el-menu-item index="1-7">新增文档</el-menu-item>
          <el-menu-item index="1-8">查询所有文档</el-menu-item>
          <el-menu-item index="1-9">查询文档详情</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
   </div>
   <div class="rightList">
        <div class="ListTitle">
            文档列表
        </div>
           <div class="BlogHomeListLimitBox">
            <div class="ListItem" v-for="(item,index) of shareList" :key="'muban'+index" @click="toLink(item.DtlId)">
                    <img src="http://47.94.235.210:8090/uploadData/getFile/611b699289a8ab65bad7f380" alt="" class="listImg">
                <div class="ListInfoBox">
                    <div class="ListInfotips">
                        <div class="infoTitle">{{item.groupId}}</div>
                        <div class="infoDetail">{{item.minTitle}}</div>
                    </div>
                    <div class="ListBottomBox">
                        <div><i class="el-icon-time"></i>{{item.createdTime|timeFilter}}</div>
                        <div><i class="el-icon-view"></i>{{item.viewNum}}</div>
                    </div>
                </div>
            </div>
        </div>
   </div>
</div>
</template>
<script>
// import { VueEditor } from "vue2-editor";
export default {
    // components:{
    //     VueEditor
    // },
  data(){
      return{
        content:'',
        shareList:[

        ],
      }
  },
  filters:{
        timeFilter(timestamp){
            timestamp=new Date( timestamp ).getTime();
            function zeroize( num ) {
                return (String(num).length == 1 ? '0' : '') + num;
            }
            var curTimestamp = new Date().getTime(); //当前时间戳
            var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
            var curDate = new Date( curTimestamp ); // 当前时间日期对象
            var tmDate = new Date( timestamp );  // 参数时间戳转换成的日期对象

            var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
            var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

            if ( timestampDiff < 60000 ) { // 一分钟以内
                return "刚刚";
            } else if( timestampDiff < 360000 ) { // 一小时前之内
                return Math.floor( timestampDiff / 60000 ) + "分钟前";
            } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
                return '今天' + zeroize(H) + ':' + zeroize(i);
            } else {
                var newDate = new Date( (curTimestamp - 8640000) ); // 参数中的时间戳加一天转换成的日期对象
                if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
                    return '昨天' + zeroize(H) + ':' + zeroize(i);
                } else if ( curDate.getFullYear() == Y ) {
                    return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
                } else {
                    return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
                }
            }
        },
  },
  mounted(){
      this.getPageInfo()
  },
  methods:{
      toLink(id){
          this.$router.push('/BlogpageDtl/'+id)
      },
      getPageInfo(){
        this.$http.query('api').then(res=>{
             var allres = JSON.parse(res.data.jsonmap)
            this.shareList = allres
        })
      }
  },
}
</script>

<style lang="scss" scoped>
.body{
    width: 100%;
    height: 100%;
    font-size: 15px;
    font-family: Lato,sans-serif;
    display: flex;
}
.leftMenu{
    height: 100%;
    width: 220px;
    background: #545c64;
    padding: 0 5px;
    flex: 0 0 auto;
    >>>.el-menu{
        border: none;
    }
}
.rightList{
    width: calc(100% - 220px);
    height: calc(100% - 40px) ;
    overflow: scroll;
    padding: 20px;
    .ListTitle{
        font-family: Roboto-Regular,Roboto;
        font-weight: 400;
        color: rgba(64,64,64,.66);
        display: flex;
        justify-content: flex-start;
        padding: 0px 10px 20px 10px;
    }
}
    .BlogHomeListLimitBox{
        display: flex;
        justify-content:flex-start;
        flex-wrap: wrap;
    }
    .ListItem{
        width: 250px;
        height: 350px;
        margin: 0 10px;
        box-shadow: 0px 2px 6px 0px rgba(124, 124, 127, 0.6);
        background: #fff;
        margin-bottom: 40px;
        cursor: pointer;
        border-radius: 5px;
        &:hover{
            transform:scale(1.05) translateY(-5px);
            transition-duration: 0.2s;
        }
    }
    .listImg{
        width: 100%;
    }
    .ListInfoBox{
        width: 100%;
        height: calc(100% - 180px);
        display: flex;
        flex-wrap: wrap;
        position: relative;
        .ListInfotips{
            width: 100%;
            height: calc(100% - 40px);
            border-bottom: #f1f1f1 solid 1px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            .infoTitle{
                width: calc(100% - 20px);
                text-align: start;
                height: 30px;
                line-height: 30px;
                color: #a8a8a8;
            }
            .infoDetail{
                font-weight: 600;
                height: 100%;
                width: 100%;
                padding: 10px;
                text-align: start;
                letter-spacing: 3px;
            }
        }
        .ListBottomBox{
            display: flex;
            width: calc(100% - 20px);
            padding: 0 10px;
            justify-content: space-between;
            font-size: 13px;
            i{
                margin-right: 5px;
                font-size: 12px;
            }
        }
    }
</style>
