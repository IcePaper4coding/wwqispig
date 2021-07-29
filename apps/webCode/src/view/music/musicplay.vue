<template>
<div class="body" id="body">
    <div class="top">
        <div class="goback">
            <i class="el-icon-arrow-left" style="font-size:20px;color:#fff" @click="goback"></i>
        </div>
        <div class="musicbg" 
        :style="'background: url('+playmucis.picUrl+') no-repeat 0 20%/100% auto ;'">
        </div>

        <div class="opacitybg"></div>
        <div class="playdef">
                <img src="../../assets/img/playdef.png" alt="" style="width:250px">
                <div class="imgline">
                    <img src="../../assets/img/playdef_linw.png" alt="" style="width:250px">
                </div>
                <div class="musicpict">
                    <div class="picture xuanz">
                    <img :src="playmucis.picUrl" alt="" style="width:160px">
                    </div>
                </div>
        </div>
        <div class="playdeftop">
            <img src="../../assets/img/playdeftop.png" alt="" style="width:90px">
        </div>
    </div>
    <div class="musicinfo">
            <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                <div class="currentLyric" v-if="currentLyric">
                  <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}"
                    v-for="(line, index) in currentLyric.lines" :key="line.key">
                    {{line.txt}}
                  </p>
                </div>
              </div>
            </scroll>
    </div>
    <div class="playcontrol">
        <div class="controlline">
            <div class="time">
            {{(duration*jindutiao)/100 | showtime}}
            </div>
            <div class="line" @click.stop="jumpto($event)">
                <div class="lineitem" :style="'width:'+jindutiao+'%'"></div>
                <div class="pot" @click.stop @touchstart="changeduration($event)" @touchend="changedurationend($event)" @touchmove="changedurationmove($event)"></div>
                <div class="linebg" :style="'width:'+(100-jindutiao)+'%'"></div>
            </div>
            <div class="time">
            {{duration| showtime}}
            </div>
        </div>
            <div class="controlitem">
                <div class="item">
                    <img src="../../assets/img/before.png" alt="" style="width:30px" @click="toplaybefore">
                </div>
                <img src="../../assets/img/playstart.png" alt="" style="width:50px" class="center" v-if="playztnum==0" @click.stop="controlsplay(playztnum)">
                <img src="../../assets/img/playstop.png" alt="" style="width:50px" class="center" v-else @click.stop="controlsplay(playztnum)">
                <div class="item">
                <img src="../../assets/img/nextb.png" alt="" style="width:30px" @click="toplaynext">
                </div>
                <div class="gedan">
                    <img src="../../assets/img/gedan.png" alt="" style="width:25px" @click.stop="musiclistshow">
                </div>
            </div>
    </div>
</div>

</template>
<script>
import axios from 'axios'
import Lyric from 'lyric-parser'
import Scroll from '../scroll/scroll'
export default {
    components:{
        Scroll
    },
  data(){
      return{
          currentLyric:null,
          currentLineNum:0,
          isstop:true,
      }
  },
  watch: {
        playtime(newVal, oldVal) {
            if(this.currentLyric){
                this.currentLyric.seek(newVal*1000)
            }
        },
        playmucis(newVal) {
            if(newVal){
                this.currentLyric.stop()
                this.currentLyric = null
                this.currentLineNum=0
                this.getlyric()
            }
        }
    },
  filters:{
    showtime(t){
        if(t){
            var time = Math.floor(t)
            var min = Math.floor(time/60)
            var sec = time%60
            if(sec<10){
                sec="0"+sec
            }
            return '0'+min +':'+sec
        }
        else{
            return '00:00'
        }
      }
  },
props:{
	    playtime:{
	    		type:Number
	    	},
	    playmucis:{
	    		type:Object
	    	},
        jindutiao:{
            type:Number
        },
        duration:{
            type:Number
        },
        playztnum:{
            type:Number
        },
	},
  mounted(){
    if(this.playztnum==1){
        this.isstop=false
    }
    
   this.getlyric()
      var that = this
          function pushHistory() { 
        that.$emit('bgflag')
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
          this.$emit('bgflag')
      },
      stopgo(){
          this.isstop=true
      },
      startgo(){
          this.isstop=false
      },
      changeduration(e){//进度条拖拉开始
          this.$emit('changeduration',e)
      },
      changedurationend(e){//拖拉结束
          this.$emit('changedurationend',e)
      },
      changedurationmove(e){//拖拉中
          this.$emit('changedurationmove',e)
      },
      jumpto(e){//点击进度条
      console.log(e);
          this.$emit('jumpto',e)
      },
      controlsplay(e){//暂停或播放
          this.$emit('controlsplay',e)
      },
      toplaynext(e){//下一首
          this.$emit('toplaynext',e)
      },
      toplaybefore(e){//上一首
          this.$emit('toplaybefore',e)
      },
      musiclistshow(){//gedan
          this.$emit('musiclistshow')
      },
      getlyric(){
        axios.get('https://api.imjad.cn/cloudmusic/',{
               params:{
                   id:this.playmucis.id,
                   type:'lyric'
               },
               emulateJSON:true
           }).then(res=>{
                this.currentLyric = new Lyric(res.data.lrc.lyric, this.handleLyric)
           })
      },
    handleLyric ({lineNum, txt}) {
    if(this.isstop){
        return
    }
      this.currentLineNum = lineNum
      if (lineNum > 2) {
        let lineEl = this.$refs.lyricLine[lineNum - 2]
        if(this.$refs.lyricList){
            this.$refs.lyricList.scrollToElement(lineEl, 1000)
        }
      } else {
          if(this.$refs.lyricList){
              this.$refs.lyricList.scrollTo(0, 0, 1000)
          }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.musicbg{
    width: 100vw;
    height: 100vh;
    opacity: 1;
    transform: scale(1.5);
    transform-origin: center center;
    filter: blur(30px);
}
.goback{
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 99;
}
.playdef{
    position: absolute;
    top: 65px;
    left: 50%;
    transform: translateX(-50%);
    width: 250px;
    height: 250px;
    border-radius: 150px;
    overflow: hidden;
    box-shadow: 0px 0px 0px 10px rgba(255, 255, 255, 0.1);
}
.opacitybg{
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: #ffffff;
    opacity: .2;
}
.musicpict{
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .picture{
    border-radius: 100px;
    overflow: hidden;
    }
    .xuanz{
         animation: xuanzhuan 16s linear infinite;
    }
}
@keyframes xuanzhuan {
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }
}
.imgline{
    position: absolute;
    top: 0px;
}
.playdeftop{
    position: absolute;
    top: 0;
    left: 50%;
}

.musicinfo{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 320px;
    display: flex;
    justify-content: center;
    .middle-r {
    display: inline-block;
    position: absolute;
    top: 0px;
    vertical-align: top;
    width: 100%;
    height: calc(100% - 430px);
    overflow: hidden;
    &.middleR-enter-active, &.middleR-leave-active {
        transition: all 0.2s;
    }
    &.middleR-enter, &.middleR-leave-to {
        opacity: 0;
    }
    .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        .text {
        line-height: 40px;
        color:#c1c1c1;
        font-size: 15px;
        &.current {
            color: #fff;
        }
        }
        .no-lyric {
        line-height: 40px;
        margin-top: 60%;
        color: #fff;
        font-size: 15px;
        }
    }
    }
      }
.playcontrol{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 120px;
    .controlitem{
        display: flex;
        justify-content: center;
        margin-top: 20px;
        .item{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .center{
            margin: 0 25px 0 25px;
        }
    }
    .controlline{
        width: 100%;
        height: 15px;
        margin-top: 10px;
        color: #fff;
        display: flex;
        justify-content: center;
        font-size: 12px;
        .time{
            line-height: 15px;
        }
        .line{
            width: calc(100% - 100px);
            height: 15px;
            display: flex;
            align-items: center;
            margin: 0 5px 0 5px;
            
        }
        .lineitem{
            height: 3px;
            width: 100px;
            background: chocolate;
            pointer-events: none;
        }
        .linebg{
            height: 3px;
            width: calc(100% - 100px);
            background: #c1c1c1;
            pointer-events: none;
        }
        .pot{
            width: 10px;
            height: 10px;
            background: #fff;
            border-radius: 5px;
            
        }
    }
}
.gedan{
    position: fixed;
    bottom: 32px;
    right: 35px;
}
</style>
