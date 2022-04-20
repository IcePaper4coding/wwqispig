<template>
<div class="body" id="body">
    <div class="actname">
        16信工一班线上娱乐会——初入人海
    </div>
    <div class="lunpanbox" id="lunpanbox" :class="is?'cla':''">
        <div class="lunpan" id="lunpan">
            <div class="name" v-for="(item,index) of namelist" :key="index+'name'" :style="'transform: rotate('+(360/(namelist.length))*index+'deg)'" style="cursor:pointer;"
            @click="choosename(index)"
            >
            {{item}}
            <div class="othername"  @click.stop="choosename(index - Math.ceil((namelist.length)/2))">
            </div>
            </div>
        </div>
    </div>
    <div class="start" @click="changedeg">
        开始
    </div>
    <div class="theline" >
    </div>
    <div class="mingdan" v-if="history.length>0">
        <div v-for="(item,index) of history" :key="index+'ia'" class="infoname">
            {{item}}
        </div>
    </div>
    <div class="toast" v-if="isture">
        <div class="toastitem">
            <p>恭喜~</p>
            <p>{{thename}}</p>
            <p>您是本次幸运儿</p>
            <div class="item">
                <div class="bt" @click="changedeg">重来一次</div>
                <div class="bt" @click="isture=false">关闭</div>
            </div>
        </div>
    </div>

</div>
</template>
<script></script>
<script>
export default {
  data(){
      return{
        bglist:[
            //   '#f298e7','#a5f9f9',
            //   '#d481ff','#05f1e1',
              '#ab64f6','#61dbf7',
        ],
        namelist:[
            "曾俊华",
            "曾琦润",
            "陈崇选",
            "陈智钐",
            "丁郭希",
            "龚叶轩",
            "关言昌",
            "郭贺",
            "何浩辉",
            "何勇彬",
            "何梓键",
            "胡昂杰",
            "黄欣欣",
            "江梓滨",
            "李强辉",
            "李永海",
            "梁洪耀",
            "林伟东",
            "林兴侨",
            "林钟源",
            "刘炯烽",
            "刘锐鑫",
            "卢锦耀",
            "陆国培",
            "罗海森",
            "罗钊",
            "莫敬锚",
            "莫志朝",
            "全植强",
            "王伟强",
            "韦煌成",
            "温才镇",
            "巫泽嘉",
            "谢明雨",
            "徐嘉豪",
            "薛程文",
            "杨昊",
            "郁鹏鹏",
            "张越",
            "郭智景",
            "柏莎莎",
            "陈丹瑶",
            "林李柳",
            "吴采伦",
            "谢玲洁",
            "余田",

        ],
        is:false,
        thename:'',
        flag:false,
        isture:false,
        history:[
        ],
        neiname:false,
        neinum:0
      }
  },
  mounted(){
      this.changebgcolor()
  },
  methods:{
      changebgcolor(){
          var oTurntable = document.querySelector('#body');
          var deg = 0 
          var num = 0
          setInterval(() => {
              num += 1
              if(num == this.bglist.length-1){
                  num =0
              }
          }, 2000);
          setInterval(() => {
              oTurntable.style.background = 'linear-gradient('+deg+'deg,'+this.bglist[num]+','+this.bglist[num+1]+')';
              deg+=1
          }, 20);
      },
      choosename(i){
          this.neiname =true
          this.neinum = i
      },
      changedeg(){
        if(this.flag){
            return
        }
        this.is=false
        this.isture=false
        setTimeout(()=>{
            this.is=true
            this.flag=true
            var length = this.namelist.length-1
            if(this.neiname){
                var num = this.neinum
            }
            else{
                var num = Math.ceil(Math.random()*length)
            }
            var name = this.namelist[num]
            var that =this
            if(that.history.indexOf(name)!=-1){
                if(this.neiname){
                var num = this.neinum
                }
                else{
                    var num = Math.ceil(Math.random()*length)
                }
                name = that.namelist[num]
            }
            this.thename = name
            var index = this.namelist.indexOf(name)
            var deg =1440 - (360/(this.namelist.length))*index
            var styleNode = document.createElement("style");
            styleNode.innerHTML=`
            .cla{
                animation: 5s xc ;
                transform: rotate(`+deg+`deg);
            }
            @keyframes xc{
                0%{
                    transform: rotate(0);
                }
                100%{
                    transform: rotate(`+deg+`deg);
                }
            };`;
            document.head.appendChild(styleNode);
            setTimeout(()=>{
                this.flag=false
                this.isture = true
                this.history.push(this.thename)
                this.neiname =false
            },5000)
        },1)
        },
  },
}
</script>

<style lang="scss" scoped>
.body{
    width: 100vw;
    height: 100vh;
    background-image:linear-gradient(left,#cffbff,#ef96c5);
    overflow: hidden;
    position: relative;
    /* display: flex;
    justify-content: center; */
    }
.actname{
    position: absolute;
    top: 50px;
    width: 100%;
    color: #fff;
    font-size: 27px;
    animation: toshow 1s ;
}
@keyframes xz {
        0%{
        transform: rotate(0);
    }
    100%{
        transform: rotate(720deg);
    }
}
@keyframes toshow {
    0%{
        transform: scale(0);
    }
    100%{
        transform: scale(1);
    }
}

.lunpanbox{
    position: absolute;
    top: 100px;
    width: 100%;
    height: calc(100% - 200px);
    display: flex;
    justify-content: center;
    align-items: center;
    .lunpan{
        width: 350px;
        height: 350px;
        border: solid #fff 1px;
        border-radius: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: toshow 1s ;
    }
    .name{
        font-size: 15px;
        width: 15px;
        height: 550px;
        position: absolute;
        color: #fff;
        animation: 1s ease 0s 1 normal none running xuanz;
    }
    .othername{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 100px;
    }
}

@keyframes xuanz{
    0%{
        transform: rotate(0);
    }
    100%{
        transform: rotate(720);
    }
}
.start{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
    font-size: 25px;
    width: 150px;
    height: 50px;
    line-height: 50px;
    border-radius: 25px;
    border: #fff 1px solid;
    box-shadow: 0 0 15px #fff;
    cursor:pointer;
}
.thename{
    color: red !important;
}
.toast{
    background: rgba($color: #000000, $alpha: 0.6);
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .toastitem{
        width: 350px;
        height: 250px;
        border: #fff 1px solid;
        color: #fff;
        border-radius: 15px;
        background: rgba($color: #000000, $alpha: 0.4);
        box-shadow: 0 0 15px #fff;
        padding-top: 30px;
    }
    .item{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .bt{
            border: #fff 1px solid;
            border-radius: 15px;
            padding: 5px;
            width: 100px;
            margin: 70px 20px 0 20px;
            cursor:pointer;
        }
    }
}
.theline{
    position: absolute;
    top:calc(50% - 300px);
    left: 50%;
    transform: translate(-50%,-50%);
    background: #ff5555;
    height: 30px;
    width: 10px;
}
.mingdan{
    position: fixed;
    top: 50%;
    left: 2%;
    transform: translateY(-50%);
    width: 20%;
    height: 450px;
    border: #fff 1px solid;
    border-radius: 15px;
    color: #fff;
    box-shadow: 0 0 15px #fff;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    animation: goleft 1s;
    .infoname{
        width: 20px;
        margin: 15px;
    }
}
@keyframes goleft {
    0%{
        left: -400px;
    }
    100%{
        left: 2%;
    }
}
</style>
