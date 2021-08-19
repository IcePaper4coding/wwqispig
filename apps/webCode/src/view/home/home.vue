<template>
<div class="body" id="body">
    <div class="swiper-log" v-if="bannerflag" ref="swipers">
        <swiper :options="swiperOptionClub" >
            <swiper-slide v-for="(item,index) in imgList1" :key="item.img">
                <img :src="item.img" alt="../../assets/img/bannerimg/onload.gif" class="swiperimg" @load="isloading(index)">
                <!-- <img v-if="!bannerlistflag[index]" src="" class="swiperimg"> -->
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
    <div class="swiper-clone" v-else>

    </div>
    <div class="lovetime" style="letter-spacing:2px;color:#fff;">
    <div class="block">
        <el-date-picker
        v-model="settime"
        value-format="timestamp"
        @change="changetime"
        type="date"
        prefix-icon="blockicon">
        </el-date-picker>
    </div>
    </div>
        <div style="color:#fff;">我们恋爱已经</div>
        <div style="margin:20px"><img src="../../assets/img/time.png" alt="" class="love"></div>
        <div class="alltime">
            <div class="itemss">
            <div  style="color:#fff;">{{days}}天{{hours}}小时{{mins<10?('0'+mins):mins}}分</div><div style="color:#fff;" class="secs">{{secs<10?('0'+secs):secs}}</div><div style="color:#fff;">秒</div>
            </div>
    </div>
    <div class="danmu">        
        <div class="danmuitem" id="dan">
            <div v-for="(item,index) of danmuArr" :key="index+'a'" class="items" :style="'margin-top:'+item.top+'px'">{{item.str}}</div>
        </div>
        <div class="danmuitem1" v-if="indexnum" id="dan1">
            <div v-for="(item,index) of danmuArr1" :key="index+'b'" class="items" :style="'margin-top:'+item.top+'px'">{{item.str}}</div>
        </div>
    </div>
    <div class="open" >
    <img src="../../assets/img/tu.png" alt="" style="width:30px;margin-right:20px" @click="opencfjl=true">
    <img src="../../assets/img/dan.png" alt="" style="width:30px;margin-left:20px" @click="adddanmu">
    </div>
    <div class="editcom" v-if="opencfjl" @click="closecgjl(false)" :class="opencfjlflag?'closeeditcom':''">
                    <div class="imgupload" v-if="imglist.length<9" style="width:100%;color:#fff;margin-bottom:20px;border-bottom:#e5e5e5 1px solid;padding-bottom:10px" @click.stop>
                        <label for="videoImg">
                            <div>
                            <i 
                            class="el-icon-upload"
                            style="font-size:50px;color:#000;"
                            v-show="videoImg"
                            ref="videoImg"
                            ></i>
                            <div style="color:#000;">
                            点击上传
                            </div>
                            </div>
                        </label>
                        <input
                            type="file"
                            id="videoImg"
                            style="display:none"
                            name="image"
                            multiple
                            accept="image/*"
                            @change="handleInputChangeFunc($event,'img')"
                        />
                    </div>
        <div style="width:100%;height:calc( 100% - 100px);overflow: scroll;" class="edititem">
                <div class="showimg"  @click.stop>
                    <div style="margin:7px;position: relative;" v-for="(item,index) of imgList1" :key="index+'g'" >
                        <div style="position: absolute;top:0px;right:0px;" @click="opdel(index)">
                            <i class="el-icon-delete"></i>
                        </div>
                        <img   :src="item.img" alt="" :style="'width:80%'" class="imgs" >
                    </div>
                </div>
        </div>
        <div class="colseicon">
            <i class="el-icon-error"></i>
        </div>
    </div>
<!-- 确认删除 -->
<div class="tcs" v-if="delflag">
    <div><img :src="delimg" alt="" style="height:70px"></div>
    <div style="margin-top:10px;margin-bottom:5px">确认删除吗？</div>
    <div class="bottomd">
        <div class="itemd" @click="delflag=false">取消</div>
        <div class="itemd" style="border-left:1px solid #e5e5e5" @click="todelimg">确认</div>
    </div>
</div>
</div>

</template>

<script>
import "swiper/swiper.scss";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    swiperSlide,
    swiper
  },
  data(){
      return{
    fullHeight: document.documentElement.clientHeight,
    fullWidth: document.documentElement.clientWidth,
    delflag:false,
    delimg:'',
    delindex:0,
    videoImg:true,
    bannerflag:false,
    bannerlistflag:[],
    uploadimg:require('../../assets/img/upload.png'),
    imglist:[
        {img:require('../../assets/img/upload.png')},
        {img:require('../../assets/img/upload.png')},
        {img:require('../../assets/img/upload.png')},
        {img:require('../../assets/img/upload.png')},
    ],
    opencfjl:false,
    opencfjlflag:false,
    settime:new Date(),
    days:'',
    hours:'',
    mins:'',
    secs:'',
    imgList1: [
        require('../../assets/img/bannerimg/banner1.png')
      ],
    swiperOptionClub: {
         autoplay: {
          disableOnInteraction: false,
            delay: 3000,
         },
        loop: true,
        observeParents: true,
        observer: true,
        delay: 3000,
        direction: "horizontal",
        effect: "slide",
        preventLinksPropagation: false,
        // stopOnLastSlide: false,
        // disableOnInteraction: true,
        pagination: {
          el: ".swiper-pagination"
        }
    },
          bglist:[
            //   '#f298e7','#a5f9f9',
              '#d481ff','#05f1e1',
            //   '#ab64f6','#61dbf7',
          ],
      danmuArr: [
          {str:'世界再大，我眼里只有你。',top:0},
          {str:'青色烟雨，孤影等你归来。',top:0},
          {str:'南风知我意，吹梦到西州。',top:0},
          {str:'几分痴情，几分在意。',top:0},
          {str:'一想到能和你共度余生，我就对余生充满了期待。',top:0},
          {str:'春有百花，秋有月，夏有凉风，冬有雪，而我只想早晚都有你。',top:0},
      ],
      danmuArr1: [
          {str:'世界再大，我眼里只有你。',top:0},
          {str:'青色烟雨，孤影等你归来。',top:0},
          {str:'南风知我意，吹梦到西州。',top:0},
          {str:'几分痴情，几分在意。',top:0},
          {str:'一想到能和你共度余生，我就对余生充满了期待。',top:0},
          {str:'春有百花，秋有月，夏有凉风，冬有雪，而我只想早晚都有你。',top:0},
      ],
      indexnum:false,
      gonum1:0,
      gonum2:0,
      scrolls:'',
      }
  },
  mounted(){
 var obj = JSON.parse(localStorage.getItem('wqbytoken'))
    this.$http.query(obj.id).then(res=>{
        if(JSON.parse(res.data.jsonmap).histimeday){
            this.settime = JSON.parse(res.data.jsonmap).histimeday
        }
        if(res.data.jsonmap){
            var mydata = JSON.parse(res.data.jsonmap)
            if(mydata.banner.length>0){
                this.imgList1 = mydata.banner
                this.bannerflag = true
                for(var index in this.imgList1){
                    this.bannerlistflag.push(false)
                }
            }
            else{
                this.imgList1 = [{
                    img: require("../../assets/img/bannerimg/banner1.png"),
                    isSeleted: false,
                    type: 4
                }]
                this.bannerlistflag= false
                this.bannerflag = true
            }
        }
    }) 
    for(var item of this.danmuArr){
        item.top = Math.random()*100
    }    
    for(var item of this.danmuArr1){
        item.top = Math.random()*100
    }
    this.toscroll()

this.gettime()
setInterval(()=>{
    this.gettime()
},1000)

  },
  destroyed(){
      clearInterval(this.scrolls)
  },
  methods:{
      isloading(i){
          this.bannerlistflag.splice(i,1,true)
      },
      toscroll(){
          this.scrolls = setInterval(()=>{
          var oTurntable = document.querySelector('#dan');
          oTurntable.style.webkitTransform = 'translateX(' + this.gonum1 + 'px) ';
          this.gonum1-=1
          if(this.gonum1+oTurntable.clientWidth<=document.body.offsetWidth){
                this.indexnum=true
          }
          var oTurntable1 = document.querySelector('#dan1');
          if(this.indexnum&&oTurntable1){
            oTurntable1.style.webkitTransform = 'translateX(' + this.gonum2 + 'px) ';
            this.gonum2-=1
          }
          if(oTurntable1){
              if(this.gonum1+oTurntable.clientWidth+oTurntable1.clientWidth<=document.body.offsetWidth){
                  this.gonum1=document.body.offsetWidth
                    for(var item of this.danmuArr){
                        item.top = Math.random()*100
                    }          
              }
              if(this.gonum2+oTurntable.clientWidth+oTurntable1.clientWidth<=document.body.offsetWidth){
                  this.gonum2=document.body.offsetWidth
                    for(var item of this.danmuArr1){
                        item.top = Math.random()*100
                    }
              }
          }
          },10)
      },
      closecgjl(){
            this.opencfjlflag=true
            setTimeout(()=>{
                    this.opencfjl=false
                    this.opencfjlflag=false
            },450)
        },
      changetime(){
          console.log(this.settime);
          var obj = JSON.parse(localStorage.getItem('wqbytoken'))
          this.$http.query(obj.id).then(res=>{
              var resobj = JSON.parse(res.data.jsonmap)
              this.$set(resobj,'histimeday',this.settime)
              this.$http.change(obj.id,resobj,()=>{})
          }) 
      },
      gettime(){
        var time= new Date().getTime()
        var date = new Date(time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      //计算天数
      var elogtime = date - this.settime;
      this.days = Math.floor(elogtime/1000/60/60/24);
      //计算小时数
      var remain = elogtime%(1000*60*60*24);
      this.hours = Math.floor(remain/1000/60/60);
      //计算分钟数
      remain = remain%(1000*60*60);
      this.mins = Math.floor(remain/1000/60);
      //计算秒数
      remain = remain%(1000*60);
      this.secs  = Math.floor(remain/1000);
      
      },
      opdel(e){
          this.delflag=true
          this.delindex=e
          this.delimg=this.imgList1[e].img
      },
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
        dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return [u8arr];
        },
        handleInputChangeFunc(event,targetName){
          for(var item of event.target.files){
              const file = item;
              const imgMasSize = 1024 * 1024 * 2;
            var that = this
            var reader = new FileReader(); //实例化文件读取对象
            reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
            reader.onload = function(ev) { //文件读取成功完成时触发
            var formObj = new File(that.dataURLtoBlob(reader.result), file.name, {type:file.type})
                that.$toast.loading('正在上传',true)
                that.$http.upload(formObj,file.name).then(res=>{
                that.$toast.loading('正在上传',false)
                 var obj = {
                    isSeleted: false,
                    type: that.imglist.length,
                    img: 'http://47.94.235.210:8090/uploadData/getFile/'+res.data.id,
                 }
                 var imglist = that.imgList1
                 imglist.unshift(obj)
                 that.imgList1=[]
                 that.$nextTick(()=>{
                     that.imgList1 = imglist
                    var mydata = JSON.parse(localStorage.getItem('wqbytoken'))
                    that.$http.query(mydata.id).then(res=>{
                        if(res.data.jsonmap){
                            var ress = JSON.parse(res.data.jsonmap)
                            if(ress.banner){
                                ress.banner=that.imgList1
                            }
                            else{
                                that.$set(ress,'banner',that.imgList1)
                            }
                        }
                        that.$http.change(mydata.id,ress,()=>{
                            
                        })
                        that.$http.query(ress.loverid).then(res1=>{
                            
                            var loveres = JSON.parse(res1.data.jsonmap)
                            that.$set(loveres,'banner',that.imgList1)
                            that.$http.change(ress.loverid,loveres,()=>{
                                
                            })
                        })
                    })
                 })
              })
          }
          }

      },
      todelimg(){
        this.delflag=false
        this.$toast.toast('删除成功')
        var imglist = this.imgList1
        imglist.splice(this.delindex,1)
        this.imgList1=[]
        this.$nextTick(()=>{
            this.imgList1 = imglist 
        })
        var mydata = JSON.parse(localStorage.getItem('wqbytoken'))
        this.$http.query(mydata.id).then(res=>{
        var ress = JSON.parse(res.data.jsonmap)
        ress.banner=this.imgList1
        this.$http.change(mydata.id,ress,()=>{})
        this.$http.query(ress.loverid).then(res1=>{
            var loveres = JSON.parse(res1.data.jsonmap)
            this.$set(loveres,'banner',this.imgList1)
            this.$http.change(ress.loverid,loveres,()=>{})
        })
        })
      },
      adddanmu(){
          this.$toast.toast('功能即将开放，敬请期待')
      }
  }
}
</script>

<style lang="scss" scoped>
.body{
width: 100vw;
height: calc(100vh - 55px);
overflow: scroll;
position: relative;
background:url(../../assets/img/homebg.png) no-repeat 0 100%/100%;
}
.swiperimg{
    width: 100%;
    border-radius: 0 0 10px 10px;
    transform:translateY(-15%)
}
.swiper-log{
    padding-top: 5px;
    margin-top: 40px;
    height: 40%;
    position: relative;
}
.swiper-clone{
    width: 100%;
    height: 300px; 
}
.love{
    width: 33px;
    height: 30px;
}
.lovetime{
    width: 100%;
    color: #fff;
    display: flex;
    justify-content: center;
    margin-top: 40px;
.block{
.blockicon{
    display: none;
}
}
}
>>>.el-input__inner{
    background: transparent;
    border: none;
    color: #fff;
    font-size: 20px;
    text-align: center;
    padding: 0;
}
>>>.el-date-editor{
    width: 105px;
}
.open{
    position:absolute;
    bottom:50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
}
.edit{
    position:absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
}
.danmu{
    position:absolute;
    bottom: 100px;
    margin-top: 10px;
    height: 150px;
    width: 100%;
    overflow: hidden;
    text-align: start;
    .danmuitem{
        position: absolute;
        display: flex;
        .items{
            margin-left: 60px;
            background: rgba($color: #000000, $alpha: 0.2);
            height: 30px;
            line-height: 30px;
            color: #fff;
            padding-left: 15px;
            padding-right: 15px;
            border-radius: 15px;
            white-space:nowrap
        }
    }
    .danmuitem1{
        position: absolute;
        display: flex;
        left: 375px;
        justify-content: space-between;
        .items{
            margin-left: 60px;
            width: auto;
            background: rgba($color: #000000, $alpha: 0.2);
            height: 30px;
            line-height: 30px;
            color: #fff;
             padding-left: 15px;
             padding-right: 15px;
            border-radius: 15px;
            white-space:nowrap
        }
    }
}
.editcom::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}
.edititem::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}
.editcom{
    width: 80vw;
    height: 70vh;
    border: 1px solid;
    border-color: #fff;
    box-shadow: 0 0 15px #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background:#fff;
    z-index: 99;
    padding:20px;
    border-radius: 15px;
    animation: upgro 0.5s ;
    .colseicon{
        position: absolute;
        top: 20px;
        right: 20px;
    }
}
.closeeditcom{
    animation: downgro 0.5s ;
}
@keyframes upgro {
    0% {
        left: -50%;
    }
    100% {
        left: 50%;
    }
}
@keyframes downgro {
    0% {
        left: 50%;
    }
    100% {
        left: 150%;
    }
}
  .showimg{
      margin: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      overflow: scroll;
  }
  .tcs{
    width: 250px;
    height: 150px;
    position: fixed;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
    background: #fff;
    border: solid 1px #e5e5e5;
    border-radius: 15px;
    padding-top: 15px;
    z-index: 100;
    .bottomd{
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;
        .itemd{
            width: 50%;
            border-top: solid 1px #e5e5e5;
        }
    }
}
.imgss{
    width: 100%;
    max-width: 100%;
    min-height: 100%;
}
.alltime{
    height: 21px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    letter-spacing: 2px;
    .itemss{
        display: flex;
    }
}
.secs{
    width:23px;
    animation: gundong 1s infinite;
}
@keyframes gundong {
    0%{
        line-height: 60px;
    }
    100%{
        line-height: 21px;
    }
}
>>>.swiper-container{
    height: 100%;
}
</style>
