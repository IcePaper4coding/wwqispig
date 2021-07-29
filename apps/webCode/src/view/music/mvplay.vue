<template>
<div class="body" id="body">
    <div>
        <div class="goback">
            <i class="el-icon-arrow-left" style="font-size:20px;color:#fff" @click="goback"></i>
        </div>
        <div class="name">
            <div class="nameitem">
                <div class="item">{{info.name}}</div>
            </div>
        </div>
    </div>
    <div class="videobox" v-if="mvurl">
    <video :src="mvurl" style="width:100%" controls id="videoPlay"></video>
    </div>
</div>

</template>
<script>

export default {

  data(){
      return{
          mvurl:'',
          info:[]
      }
  },
  filters:{

  },
props:{
    id:{
        type:Number
    }

	},
  mounted(){
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
    this.getmvurl(this.id)
  },
  methods:{
      getmvurl(id){
            var obj = {
                url:'http://music.163.com/api/mv/detail?id='+id+'&type=mp4',
                method:'get',
                contentType:"",
                jsonParam:''
            }
            this.$http.proxy(obj).then(res=>{
                this.mvurl= res.data.data.brs[1080]
                this.info = res.data.data
                setTimeout(()=>{
                var video = document.getElementById("videoPlay");
                video.play()
                },1000)
            })
      },
      goback(){
          this.$emit('bgflag')
      }
  }
}
</script>

<style lang="scss" scoped>
.goback{
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 99;
}
.name{
        color: #fff;
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        position: absolute;
        top: 18px;
        .nameitem{
            width: 70%;
            overflow: hidden;
            text-overflow: nowarp;
            display: flex;
            justify-content: center;
        }
        .item{
            display: flex;
            white-space:nowrap;
            animation: gobackandgo 20s infinite linear;
        }
    }
@keyframes gobackandgo {
    0%{
        transform: translateX(20%);
    }
    25%{
        transform: translateX(-20%);
    }
    50%{
        transform: translateX(20%);
    }
    75%{
        transform: translateX(-20%);
    }
    100%{
        transform: translateX(20%);
    }
}
.videobox{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: center;
}
.mvinfo{
    position: absolute;
    top: 250px;
    color: #fff;
    font-size: 12px;
}
</style>
