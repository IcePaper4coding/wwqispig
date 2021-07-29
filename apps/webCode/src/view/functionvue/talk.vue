<template>
<div class="box">
        <div class="nav">
            <div class="duiname">
                <i class="el-icon-arrow-left" style="position: absolute;top: 50%;left: 20px;transform: translateY(-50%);" @click="goback"></i>
                {{loveinfo.authname}}
                <i class="el-icon-setting" style="position: absolute;top: 50%;right: 20px;transform: translateY(-50%);" ></i>
            </div>
        </div>
        <div class="center" :style="text.length>54?'height: calc(100% - 135px)!important;':''">
            <div class="centerbox" @click="bqbfalg=false" :style="bqbfalg?'height: calc(100% - 250px)!important;':''">
                <div v-for="(item,index) of messagelist" :key="index+'g'" class="boxitem">
                    <div class="sentboxright" v-if="item.userid==myinfo.id">
                        <div class="timebox" v-if="index==0?true:item.senttime-messagelist[index-1].senttime>=120000">
                            <div style="background: rgba(0,0,0,.4);padding:4px;border-radius: 5px;">{{item.senttime|timeFilter}}</div>
                        </div>
                        <div class="infobox" @touchstart="toshowstart" @touchend="toshowend(index)" :style="index==0?(item.img?'background: rgba(0,0,0,.2);':''):item.senttime-messagelist[index-1].senttime>=120000?(item.img?'background: rgba(0,0,0,.2);':''):(item.img?'background: rgba(0,0,0,.2);margin-top: 0px;':'margin-top: 0px;')">
                            <div v-if="item.img">
                                <img :src="item.img" alt="" @load="isfocus" style="max-width:190px;max-height:300px" @click="toshowimg(item)">
                            </div>
                            <div v-else>
                                {{item.info}}
                            </div>
                        </div>
                        <div class="facebox" :style="index==0?true:item.senttime-messagelist[index-1].senttime>=120000?'':'margin-top: 0px;'">
                        <img :src="item.faceimg" alt="" style="width:35px">
                        </div>
                    </div>
                    <div class="sentboxleft" v-else>
                        <div class="facebox" :style="index==0?true:item.senttime-messagelist[index-1].senttime>=120000?'':'margin-top: 0px;'">
                        <img :src="item.faceimg" alt="" style="width:35px">
                        </div>
                        <div class="infobox" @touchstart="toshowstart" @touchend="toshowend(index)" :style="index==0?(item.img?'background: rgba(0,0,0,.2);':''):item.senttime-messagelist[index-1].senttime>=120000?(item.img?'background: rgba(0,0,0,.2);':''):(item.img?'background: rgba(0,0,0,.2);margin-top: 0px;':'margin-top: 0px;')">
                            <div v-if="item.img">
                                <img :src="item.img" alt="" @load="isfocus" style="max-width:190px;max-height:300px" @click="toshowimg(item)">
                            </div>
                            <div v-else>
                                {{item.info}}
                            </div>
                        </div>
                        <div class="timebox" v-if="index==0?true:item.senttime-messagelist[index-1].senttime>=120000">
                            <div  style="background: rgba(0,0,0,.4);padding:4px;border-radius: 5px;">{{item.senttime|timeFilter}}</div>
                        </div>
                    </div>

                </div>
                <div class="bottomitem" id="bottomitem"></div>
            </div>
        </div>
        <div class="inputtll" :style="bqbfalg?'bottom:250px':''">
            <div class="inputbox">
            <div class="items" @click="toshowbqb" >
               <img src="../../assets/img/bqb.png" alt="" style="width:25px">
            </div>
            <div class="items">
               <textarea @focus="isfocus" @keyup.enter="sendmessage" name="message" id="" cols="32" :rows="Math.ceil(text.length/16)>4?4:Math.ceil(text.length/16)==0?1:Math.ceil(text.length/16)" v-model="text" class="textarea"></textarea>
            </div> 
            <div class="items" @click="sendmessage" v-if='text.length>0'>
                <div style="font-size:12px;color:#000;background: #9eea6a;padding:5px 15px 5px 15px;height:20px;line-height: 20px;border-radius: 5px;font-weight: 500;">发送</div>
            </div>

            <div class="items" v-else>
                <label for="videoImg">
                <i class="el-icon-picture" @click="sendpicture"></i>
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
            </div>
        </div>
        <div class="bqbbox" v-if="bqbfalg">
            <div v-for="(item,index) of bqb" :key="index+'h'" class="bqbboxitem" @click="addbqb(item)">
                {{item}}
            </div>
        </div>
    <div class="editbox" v-if="editboxflag">
        <div class="editboxitem">
        <div class="items" @click.stop="editfunc(0)">撤回</div>
        <div class="items" @click.stop="editfunc(1)">删除</div>
        <div class="items" @click.stop="editfunc(2)">复制</div>
        <div class="items" @click.stop="editfunc(3)">取消</div>
        </div>
    </div>
    <div class="mask" v-if="toshowimgflag" @click="toshowimgflag=false">
        <div class="maskbox">
            <swiper :options="swiperOptionClub">
                <swiper-slide v-for="item in imglist" :key="item">
                    <img :src="item"  class="swiperimg"/>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
    </div>
</div>
</template>

<script>
import bqbjs from '../../plugins/bqb.js'
import "swiper/swiper.scss";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    swiperSlide,
    swiper
  },
  data(){
      return{
        imglist:[],
        text:'',
        myinfo:{},
        loveinfo:{},
        loveid:1000,
        messagelist:[
            // {userid:80002,info:'你好呀MM，我是GG',faceimg:require('../../assets/img/faceicon/face1.png'),senttime:'',},
        ],
        start:'',
        end:'',
        keeptime:'',
        editboxflag:false,
        bqbfalg:false,
        bqb:bqbjs.bqb,
        toshowimgflag:false,
        swiperOptionClub: {
                autoplay: false,
                loop: false,
                delay: 3000,
                initialSlide :0,
                direction: "horizontal",
                effect: 'coverflow', //切换效果-歌曲封面效果 
                coverflowEffect: {  //歌曲封面效果设置
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows : true,
                },
                preventLinksPropagation: false,
                pagination: {
                el: ".swiper-pagination"
                }
            },
        allinfo:'',
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
                return  zeroize(H) + ':' + zeroize(i);
            } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
                return  zeroize(H) + ':' + zeroize(i);
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
    destroyed(){
      clearInterval(this.allinfo)
  },
  mounted(){
    //   this.$http.delete(70000)
      this.getloveinfo()
      this.getinfo() 
    //   this.allinfo = setInterval(() => {
    //      this.getinfo() 
    //   }, 5000);
  },
  methods:{
      sendpicture(){

      },
      goback(){
          this.$router.push('/my?id=4')
      },
      getloveinfo(){
        var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
          this.$http.query(mydata.id).then(res=>{
              var my = JSON.parse(res.data.jsonmap)
              this.loveid = my.loverid
              this.$http.query(my.loverid).then(ress=>{
                  this.loveinfo = JSON.parse(ress.data.jsonmap)
              })

          })
      },
      isfocus(){
          this.bqbfalg=false
          setTimeout(()=>{
              document.getElementById("bottomitem").scrollIntoView(false);
          },200)
        
      },
      toshowbqb(){
        this.bqbfalg=!this.bqbfalg
        setTimeout(()=>{
              document.getElementById("bottomitem").scrollIntoView(false);
          },100)
      },
      toshowstart(){
          this.start = new Date().getTime()
          this.keeptime = setTimeout(()=>{
              this.editboxflag=true
          },200)
      },
      toshowend(e){
          this.end = new Date().getTime()
          if(this.end-this.start<=200){
              clearTimeout(this.keeptime)
          }
      },
      addbqb(item){
          this.text+=item
      },
      getinfo(){
          var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
          this.myinfo = mydata
          this.$http.query(70000).then(res=>{
              if(res.data.jsonmap){
                  var alllist = JSON.parse(res.data.jsonmap)
                  if(alllist[this.myinfo.id]){
                      this.messagelist = alllist[this.myinfo.id]
                      this.imglist=[]
                      for(var items of this.messagelist){
                          if(items.img){
                              this.imglist.push(items.img)
                          }
                      }
                      this.$nextTick(()=>{
                          document.getElementById("bottomitem").scrollIntoView(false);
                      })
                  }
                  else{
                      this.messagelist = []
                  }
              }
              else{
                  var obj = {}
                  this.$set(obj,this.myinfo.id,[])
                //   this.$set(obj,this.loveid,[])
                  this.$http.add(70000,obj)
                  this.messagelist = []
              }
          })
      },
      sendmessage(){
          if(this.text==''){
              return
          }
          var time = new Date().getTime()
          var obj = {userid:this.myinfo.id,info:this.text,faceimg:this.myinfo.faceimg,senttime:time}
          this.text=''
          this.messagelist.push(obj)
          this.$http.query(70000).then(res=>{
              var alllist = JSON.parse(res.data.jsonmap)
              alllist[this.myinfo.id] = this.messagelist
              this.$set(alllist,this.loveid,this.messagelist)
              this.$http.change(70000,alllist,()=>{
                  this.$http.query(70000).then(ress=>{
                      var alllist = JSON.parse(ress.data.jsonmap)
                      this.messagelist = alllist[this.myinfo.id]
                       document.getElementById("bottomitem").scrollIntoView({
                                behavior:'smooth',
                                block:"end"
                        });
                  })
              })
          })
      },
    handleInputChangeFunc(event,targetName){
          for(var item of event.target.files){
              const file = item;
              const imgMasSize = 1024 * 1024 * 2;
              let formObj = new FormData();
              formObj.append('file', file);
              formObj.append('type', 'img');
              this.$toast.loading('正在上传',true)
              this.$http.upload(formObj).then(res=>{
                 var arr = res.data.split(':')
                 this.$toast.loading('正在上传',false)
              var time = new Date().getTime()
              var obj = {userid:this.myinfo.id,info:'',faceimg:this.myinfo.faceimg,senttime:time,img:arr[1] +":"+arr[2]}
              this.messagelist.push(obj)
              this.imglist=[]
              for(var items of this.messagelist){
                          if(items.img){
                              this.imglist.push(items.img)
                          }
                }
                this.$http.query(70000).then(res=>{
                    var alllist = JSON.parse(res.data.jsonmap)
                    alllist[this.myinfo.id] = this.messagelist
                    this.$set(alllist,this.loveid,this.messagelist)
                    this.$http.change(70000,alllist,()=>{
                        this.$http.query(70000).then(ress=>{
                            var alllist = JSON.parse(ress.data.jsonmap)
                            this.messagelist = alllist[this.myinfo.id]
                            document.getElementById("bottomitem").scrollIntoView({
                                        behavior:'smooth',
                                        block:"end"
                                });
                        })
                    })
                })

              })
          }
      },
      editfunc(e){
          console.log(e);
          this.$toast.toast('功能即将开放')
          switch (e){
              case 0 :
              console.log(e);
              break
              case 3 :
                  this.editboxflag=false
              break
          }
          this.editboxflag=false
      },
      toshowimg(item){
          this.toshowimgflag=true
          for(var i = 0 ;i<=this.imglist.length-1;i++){
              if(item.img == this.imglist[i]){
                this.swiperOptionClub.initialSlide = i 
              }
          }
      },
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
    font-size: 20px;
    top: 0;
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
    background: #fff;
    display: flex;
    .duiname{
        width: 100%;
        text-align: center;
        font-size: 18px;
    }
}
.inputtll{
    width: 100%;
    min-height: 65px;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
    position: fixed;
    font-size: 20px;
    bottom: 0;
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
    background: #ececec;
    display: flex;
    
    .inputbox{
        width: 100%;
        padding: 5px;
        display: flex;
        justify-content: space-between;
        .items{
            position: relative;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        textarea{
            padding: 10px 5px 10px 15px;
            line-height: 15px;
            font-size: 13px;
            border-radius: 8px;
            border: none;
            letter-spacing: 1px;
        }

    }
}
textarea:focus{
        outline: none;
}
textarea::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}
.center::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}
.centerbox::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}
.center{
    position: absolute;
    top: 45px;
    width: 100%;
    height: calc(100% - 110px);
    .centerbox{
        overflow: scroll;
        width: 100%;
        height: 100%;
        .boxitemleft{

        }
    }
    .sentboxleft{
        position: relative;
        display: flex;
        justify-content: start;
        margin-bottom: 15px;
        margin-top: 15px;
        .facebox{
            border: 1px #e5e5e5 solid;
            border-radius: 15px;
            align-items: center;
            display: flex;
            height: 35px;
            overflow: hidden;
            margin-top: 30px;
            margin-left: 10px;
        }
        .infobox{
            max-width: 50%;
            border: 1px #e5e5e5 solid;
            box-shadow: 4px 3px 11px rgba(0,0,0,.2);
            margin-left: 5px ;
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
            text-align: start;
            margin-top: 30px;
            word-wrap: break-word;
            word-break: break-all;
        }
        .timebox{
            font-size: 10px;
            position: absolute;
            width: 100%;
            display: flex;
            justify-content: center;
            color: #fff;
        }
    }
    .sentboxright{
        position: relative;
        display: -webkit-box;
        justify-content: end;
        margin-bottom: 15px;
        margin-top: 15px;
        .facebox{
            margin-right: 10px;
            border: 1px #e5e5e5 solid;
            border-radius: 15px;
            align-items: center;
            display: flex;
            height: 35px;
            overflow: hidden;
            margin-top: 30px;
        }
        .infobox{
            max-width: 50%;
            border: 1px #e5e5e5 solid;
            box-shadow: 4px 3px 11px rgba(0,0,0,.2);
            margin-right: 5px ;
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
            background:#9eea6a;
            text-align: start;
            word-wrap: break-word;
            word-break: break-all;
            margin-top: 30px;
        }
        .timebox{
            font-size: 10px;
            position: absolute;
            width: 100%;
            display: flex;
            justify-content: center;
            color: #fff;
        }
    }
}
.editbox{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.7);
    .editboxitem{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background: #fff;
        width: 50%;
        .items{
            padding: 5px;
            border-bottom: 1px solid #e5e5e5;
            
        }
    }
}
.bqbbox{
    position: absolute;
    bottom: 0px;
    background: #ececec;
    overflow: scroll;
    width: 100%;
    height: 250px;
    display: flex;
    flex-wrap: wrap;
    .bqbboxitem{
        width: 30px;
        margin: 4px;
        font-size: 25px;
    }
}
  .mask{
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      background: rgba($color: #000000, $alpha: 0.8);
      display: flex;
      justify-content: center;
      overflow: scroll;
      z-index: 9;
      .swiperimg{
        width: 80%;
        max-height: 95%;
        margin: 0 auto;
      }
      .maskbox{
          width:100%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          justify-content: center;
      }
  }
>>>.swiper-container{
    width: 100%;
    height: auto;
}
</style>
