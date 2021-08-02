<template>
<div class="body" id="body">
    <div class="gedanbg">

        <div class="bgpic">
            <img :src="gedanobj.picUrl" alt="">
            <div class="filter">
            </div>
        </div>
        <div class="top" @click="goback">
            <i class="el-icon-arrow-left" style="font-weight: 600;"></i>
        首页
        </div> 
        <div class="center">
            <div class="genan">
                <div class="gedanname">
                    {{gedanobj.name}}
                </div>
                <div class="gedanname" style="font-size:12px">
                    <i class="el-icon-service"></i> {{gedanobj.playCount |playcountfil}}
                </div>
            </div>
            <div class="listbg" :style="heightflag?'height: calc(100% - 100px);':''">
                <div class="listall" @click="playall">
                    <i class="el-icon-video-play"></i>
                    播放全部 <span style="font-size:10px;color:rgb(160 160 160);">(共{{gedanlist.length}}首)</span>
                </div>
                <div style="margin-top: 45px;" >
                <div class="listinfo" v-for="(item,index) of gedanlist" :key="index+'gedan'" @click="toplay(item,item.id,$event)">
                   <div class="infonum">
                       {{index+1}}
                   </div>
                   <div class="infoname">
                       <div class="musicname">
                           {{item.name}}
                       </div>
                       <div class="infoauth">
                           <span v-for="(items,index) of item.artists" :key="items.name">
                               <span v-if="index>1">/</span>
                               <span>{{items.name}}</span>
                           </span>
                       </div>
                   </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>
<script>

export default {

  data(){
      return{
          heightflag:false,
          gedanlist:[],

      }
  },
  filters:{
    playcountfil(i){
          if(i>100000000){
              return (i/100000000).toFixed(0) + '亿'
          }
          else if(i>10000){
              return (i/10000).toFixed(0) + '万'
          }
      },
  },
  watch: {
        playmucis(newVal) {
            if(newVal){
                if(this.playmucis.url==''){
                    this.heightflag=false
                }
            }
        }
    },
props:{
    gedanobj:{
        type:Object,
    },
    playmucis:{
        type:Object,
    },

	},
  mounted(){
      if(this.playmucis.url){
          this.heightflag=true
      }
      this.getgedan()
      var that = this
          function pushHistory() { 
        that.$emit('gedanobjflag')
        }
     window.addEventListener("popstate", function (e) {
        
              var state = {
            title: "title",
            url: "#/mymusic"
        };
        window.history.pushState(state, "title", "#/mymusic");
        pushHistory()
    }, false);

  },
  methods:{
      goback(){
         this.$emit('gedanobjflag')
      },
      getgedan(){
        var gedan = 
           {
            url:'https://music.163.com/api/playlist/detail?id='+this.gedanobj.id+"&limit=20",
            method:'GET',
            contentType:"",
            jsonParam:''
          }
          this.$http.proxy(gedan).then(res=>{
            this.gedanlist = res.data.result.tracks
          })
      },
      toplay(item,id,e){
          this.$emit('togetmusic',item,id,e)
          setTimeout(()=>{
            this.heightflag=true
          },1000)
      },
      playall(){
         this.$emit('pushallplay',this.gedanlist)
      },
  }
}
</script>

<style lang="scss" scoped>
.gedanbg{
    width: 100vw;
    height: 100vh;
}
.top{
    color: #fff;
    font-weight: 600;
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 9;
    font-size: 17px;
}
.bgpic{
    img{
        width:100%;
        margin-top: -10%;
    }

}
.center{
    position: fixed;
    top: 200px;
    width: 100%;
    height: calc(100% - 200px);
    animation: goup 0.5s ;
    .listbg{
            background: #fff;
            width: 100%;
            height: calc(100% - 50px);
            border-radius: 15px 15px 0 0;
            position: relative;
            overflow: scroll;
            .listall{
                border-radius: 15px 15px 0 0;
                position: fixed;
                width: 100%;
                background: #fff;
                height: 25px;
                border-bottom: 1px #e5e5e5 solid;
                text-align: start;
                font-size: 16px;
                padding: 10px;
            }
    }
    .genan{
        margin-bottom: 15px;
    }
    .gedanname{
        color: #fff;
        width: 90%;
        text-align: start;
        font-size: 17px;
        font-weight: 500;
        padding-left: 15px;
    }
    .listinfo{
        display: flex;
        height:60px;
        width: 100%;
        border-bottom: 1px #e5e5e5 solid;
        line-height: 60px;
        .infonum{
            width: 60px;
            color: rgb(160, 160, 160);
        }
        .infoname{
            text-align: start;
            .musicname{
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space:nowrap;
                font-size: 16px;
                height: 35px;
                line-height: 35px;
            }
            .infoauth{
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space:nowrap;
                font-size: 12px;
                height: 25px;
                line-height: 25px;
            }
        }
    }
}
@keyframes goup {
    0%{
        top: 260px;
    }
    100%{
        top: 200px;
    }
}
.filter{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.2);
}
</style>
