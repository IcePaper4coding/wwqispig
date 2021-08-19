<template>
<div class="body" id="body">
    <div class="BlogHomeSerch">
        <img class="serchBg" src="http://47.94.235.210:8090/uploadData/getFile/6109017989a8ab3256302986" alt="">
        <div class="serchBox">
                <div class="serchTips">
                <div v-for="(item,index) of tltiitle" :key="'index'+index" :id="'animation'+index">{{item}}</div>
                </div>
                <div class="serchItem">
                    <el-input
                        placeholder="请输入关键词搜索"
                        v-model="keyword">
                    </el-input>
                    <div class="serchBtn">
                        搜索
                    </div>
                </div>
        </div>
    </div>
    <div class="BlogHomemuBanBox">
        <div class="BlogHomemuBanLimitBox">
            <div class="nuBanItem" v-for="(item,index) of muBanList" :key="'muban'+index" @click="toPreView(item)">
                    <img :src="item.imgUrl" alt="" class="muBanImg">
            </div>
        </div>
    </div>
    <div class="BlogHomeListBox">
    <div class="BlogHomeListBox_title">
        <div class="titleBox">壁纸分享</div>
    </div>
        <div class="BlogHomeListLimitBox">
            <div class="ListItem" v-for="(item,index) of shareList" :key="'muban'+index" @click="toPreView(item)">
                    <img :src="item.imgUrl" alt="" class="listImg">
                <div class="ListInfoBox">
                    <div class="ListInfotips">
                        <div class="infoTitle">王者壁纸分享</div>
                        <div class="infoDetail">颜值即正义，可盐可甜</div>
                    </div>
                    <div class="ListBottomBox">
                        <div><i class="el-icon-time"></i>2021-08-03 18:00</div>
                        <div><i class="el-icon-view"></i> 380</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="imgPreviewBox" v-if="preViewConfig.flag" @click="preViewConfig.flag = false">
        <img :src="preViewConfig.url" alt="">
    </div>
</div>
</template>
<script>
export default {
  data(){
      return{
        bglist:[
            //   '#f298e7','#a5f9f9',
            //   '#d481ff','#05f1e1',
              '#ab64f6','#61dbf7',
        ],
        tltiitle:'每一次搜索都是一次探险',
        keyword:'',
        muBanList:[
            {
                link:'',
                imgUrl:'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/855bef64a7374f169d7b704528a9dcf0~tplv-k3u1fbpfcp-watermark.image'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/61090bf189a8ab3256302989'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/61090beb89a8ab3256302988'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/61090be689a8ab3256302987'
            },
        ],
        shareList:[
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/610912dc89a8ab3256302993'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/6109139689a8ab3256302999'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/6109139289a8ab3256302998'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/6109138e89a8ab3256302997'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/610911f589a8ab325630298c'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/610911fa89a8ab325630298d'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/6109124189a8ab325630298e'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/6109126889a8ab325630298f'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/6109128c89a8ab3256302990'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/610911ea89a8ab325630298b'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/610912dc89a8ab3256302993'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/6109131489a8ab3256302994'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/6109132789a8ab3256302995'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/6109134589a8ab3256302996'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/61090bf189a8ab3256302989'
            },
            {
                link:'',
                imgUrl:'http://47.94.235.210:8090/uploadData/getFile/610912dc89a8ab3256302993'
            },
        ],
        preViewConfig:{
            url:'',
            flag:false,
        },
        content:''
      }
  },
  mounted(){
      document.getElementById('animation'+index).setAttribute('class','animation')
       setTimeout(()=>{
            
           for(let index in this.tltiitle){
            document.getElementById('animation'+index).setAttribute('style','animation-delay: '+(index/6)+'s;')
            setTimeout(()=>{
                document.getElementById('animation'+index).setAttribute('style','animation-delay: '+(index/6)+'s;opacity: 1;')
            },1500+(index/6)*1000)
      }
          },1000)
  },
  methods:{
      toPreView(item){
          this.preViewConfig.url = item.imgUrl
          this.preViewConfig.flag = true
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
    overflow: scroll;
}
.BlogHomeSerch{
    width: 100%;
    height: 340px;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    .serchBg{
        position: absolute;
        left: 0;
        width: 100%;
        transform:scale(1.2) translateY(-60%) translateX(-159px);;
        transform-origin: center center;
        filter: blur(10px);
    }
    .serchBox{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        .serchTips{
            width: 100%;
            color: #fff;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 25px;
            letter-spacing: 4px;
            display: flex;
            justify-content: center;
        }
        .serchItem{
            width: 40%;
            height: 30px;
            padding: 15px;
            border-radius: 5px;
            background: rgba($color:#fff, $alpha: 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .serchBtn{
            width: 150px;
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
.BlogHomemuBanBox{
    width: 100%;
    height: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    .BlogHomemuBanLimitBox{
        width: 80%;
        display: flex;
        justify-content: space-evenly;
    }
    .nuBanItem{
        width: 300px;
        display: flex;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0px 2px 6px 0px rgba(124, 124, 127, 0.6);
        border-radius: 5px;
        margin: 0 20px;
        &:hover{
            transform:scale(1.05) translateY(-5px);
            transition-duration: 0.4s;
        }
    }
    .muBanImg{
        width: 300px;
        height: 300px;
    }
}
.BlogHomeListBox{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F2F3F5;
    padding-bottom: 150px;
    flex-wrap: wrap;
    .BlogHomeListBox_title{
        width: 80%;
        height: 120px;
        align-items: center;
        display: flex;
        justify-content: center;
        
        .titleBox{
            width: 200px;
            height: 40px;
            background-image:linear-gradient(top,#faa5b4,#ffdde4) ;
            border-radius: 5px;
            line-height: 40px;
            color: #fff;
        }
    }
    .BlogHomeListLimitBox{
        width: 80%;
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }
    .ListItem{
        width: 300px;
        height: 350px;
        box-shadow: 0px 2px 6px 0px rgba(124, 124, 127, 0.6);
        background: #fff;
        margin: 20px;
        cursor: pointer;
        border-radius: 5px;
        &:hover{
            transform:scale(1.05) translateY(-5px);
            transition-duration: 0.2s;
        }
    }
    .listImg{
        width: 200px;
        height: 200px;
    }
    .ListInfoBox{
        width: 100%;
        height: calc(100% - 200px);
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
                width: calc(100% - 50px);
                text-align: start;
                height: 30px;
                line-height: 30px;
                color: #a8a8a8;
            }
            .infoDetail{
                font-weight: 600;
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
}
.imgPreviewBox{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba($color: #000000, $alpha: 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
}
.animation{
    animation: goupdown 1.5s;
    opacity: 0;
}
@keyframes goupdown {
    0%{
        transform: translateY(0%);
        opacity: 0;
    }
    50%{
        transform: translateY(-100%);
    }
    100%{
        transform: translateY(0%);
        opacity: 1;
    }

}
</style>
