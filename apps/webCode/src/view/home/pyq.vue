<template>
<div class="pyq">
<div v-for="(item,index) in datalist" class="pyqmessage" :key="index+'ga'">
    <div style="display:flex" >
    <div class="pyqface">
        <img :src="item.authimg||require('../../assets/img/faceicon/face1.png')" alt="" style="width:40px;">
    </div>
    <div style="width:100%">
    <div class="authname">{{item.authname}}<div style="margin-left:10px;display: flex;align-items: center;"><img :src="item.sex=='男'?require('../../assets/img/m.png'):require('../../assets/img/wm.png')" alt="" style="width:15px;margin-top:4px"></div></div>
    <div class="info">{{item.info}}</div>
    <div class="showimg" style="margin-top:15px;">
        <div :style="'width:'+fullWidth/4+'px;height:'+fullWidth/4+'px;overflow: hidden;margin:5px'" v-for="(items,indexs) of item.img" :key="indexs+'g'" @click="showitem(index,indexs)">
        <img :src="items" alt="" style="width:100%">
        </div>
    </div>
    <div class="edit">
        <div style="font-size: 12px;margin-left:15px;color:rgb(90 90 90);">{{item.creattime|timeFilter}}</div>
        <div style="display:flex;">
            <div style="display:flex;font-size:12px" v-if="nameid==item.id">
                <div style="font-size:12px;color:#007aff;text-decoration: underline;margin-right:15px;display: flex;align-items: center;" @click="deltc(index)">删除</div>
                <img :src="item.islove?require('../../assets/img/isview.png'):require('../../assets/img/noview.png')" alt="" style="width:20px;height:20px" @click="todiz(index)">
                <div style="margin-left:5px;height:20px;line-height:20px">{{item.islove?"  对方已读":"  对方未读"}}</div>
            </div>
            <div><img src="../../assets/img/i_pl.png" alt="" style="width:20px;height:20px;margin-right:15px;margin-left:15px" @click="topl(index)"></div>
        </div>
    </div>
    <div class="pinlun" style="margin-bottom:15px;width:100%">
        <div v-for="(items, indexs) in item.comment" :key="indexs">
            <div class="pllist" @click="pltopl(index,items,indexs)"><span style="color: #5998de">{{items.replyname}}</span><span v-if="items.bereplyname"> 回复 <span style="color: #5998de">{{items.bereplyname}}</span></span> : {{items.info}}
            <div style="display:flex;">
                <img v-for="(itemss,indexss) of items.comimglist" :key="indexss+'gh'" @click.stop="showcomimg(index,indexs,indexss)" :src="itemss" alt="" style="height:50px"></div></div>
            
        </div>
    </div>
    </div>
    </div>
</div>
        <!-- fixed评论输入框 -->
        <div class="comment_input videoinput" v-show="comment_input">
            <div class="com_inputBox">
                <div class="text_broad">
                    <textarea
                        name
                        class="huifu_broad"
                        id="huifu_broad"
                        v-model="replies"
                        placeholder="评论："
                    ></textarea>
                </div>
                <div class="cancle_sure">

                    <span class="sure_btn" @click="addcomment">确定</span>
                    <span class="cancle_btn" @click="cancle_publish">取消</span>
                    <span class="cancle_btn" @click="delcomflag=true;comment_input=false" style="color:red" v-if="isreplay&&myself">删除</span>
                    <div
                        class="search_fabulous"
                        style="margin-left:30px;margin-top:15px;float:left;"
                    >
                        <img
                            src="../../assets/img/pyq/ft_icon_0014.png"
                            style="width:25px;height:30px;"
                        />
                        <input
                            @change="handleInputChangeFunc($event,'img')"
                            class="pa"
                            id="fileToUpload"
                            type="file"
                            style="opacity:0;width:50px;height:50px;top:10px;left:20px;"
                        />
                    </div>
                    <div
                        style="margin-left:25px;float:left;position: relative;"
                        v-if="comimglist"
                    >
                        <div
                            class="pr dis_il"
                            style="width:25px;height:25px;"
                            v-for="(item,index) in comimglist"
                            :key="item"
                        >
                            <img :src="item" style="height:40px"/>
                            <div
                                class="dis_il pa"
                                style="top:-5px;right:-10px;width:15px;height:15px;border-radius:50%;background:rgb(249, 142, 2);"
                            ></div>
                            <img
                                src="../../assets/img/pyq/up_delete_white.png"
                                class="pa"
                                style="width:5px;height:5px;top:0px;right:-5px;"
                                @click="delComImg(index)"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
<!-- 确认删除 -->
<div class="blackbg" v-if="delflag">
<div class="tcs">
    <div style="margin-top:15px">确定删除吗？</div>
    <div>对方会很难过的哦~</div>
    <div class="bottomd">
        <div class="itemd" @click="delflag=false">取消</div>
        <div class="itemd" style="border-left:1px solid #e5e5e5;color : red" @click="delpub">确认</div>
    </div>
</div>
</div>
<!-- 确认删除 -->
<div class="blackbg" v-if="delcomflag">
<div class="tcs">
    <div style="margin-top:15px;">您将删除评论</div>
    <div>{{this.datalist[this.flagnum].comment[delcomnum].info}}</div>
    <div class="bottomd">
        <div class="itemd" @click="delcomflag=false">取消</div>
        <div class="itemd" style="border-left:1px solid #e5e5e5;color : red" @click="delcom">确认</div>
    </div>
</div>
</div>
    <div class="mask" v-if="toshowimgflag1" @click="toshowimgflag1=false">
       <div class="maskbox" id="dan">
            <swiper :options="swiperOptionClub">
                <swiper-slide v-for="item in datalist[imgshow.index].comment[imgshow.indexss].comimglist" :key="item">
                    <img :src="item"  class="swiperimg"/>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
    </div>
    <div class="mask" v-if="toshowimgflag" @click="toshowimgflag=false">
        <div class="maskbox" id="dan">
            <swiper :options="swiperOptionClub">
                <swiper-slide v-for="item in datalist[imgshow.index].img" :key="item">
                    <img :src="item"  class="swiperimg"/>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
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
  data(){
      return{
          toshowimgflag:false,
          toshowimgflag1:false,
          img:'',
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
          fullWidth: document.documentElement.clientWidth,
          fullHeight: document.documentElement.clientHeight,
          envprod:10000,
          delflag:false,
          delnum:0,
          nameid:'',
          datalist:[
          ],
          comment_input:false,
          replies:'',
          plflag:false,
          comimglist:[
          ],
          
          flagnum:0,
          plobj:{},
          isreplay:false,
          imgshow:{
              index:0,
              indexs:0,
          },
          name:'',
          delcomflag:false,
          delcomnum:0,
          myself:false,      
          }
  },
  mounted(){
      this.nameid = JSON.parse(localStorage.getItem('wqbytoken')).id
      this.name = JSON.parse(localStorage.getItem('wqbytoken')).authname
      this.checklist()
  },
  methods:{
      checklist(){
      var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
      this.$http.query(this.envprod).then(res=>{
          if(res.data.jsonmap){
            var list = JSON.parse(res.data.jsonmap)
            this.$http.change(10002,list,()=>{})
            this.$http.query(mydata.id).then(res=>{
            var obj = JSON.parse(res.data.jsonmap)
            var id = obj.loverid
            this.$http.query(id).then(ress=>{
                var lovename = JSON.parse(ress.data.jsonmap).authname
                var loveface = JSON.parse(ress.data.jsonmap).faceimg
                var lovesex = JSON.parse(ress.data.jsonmap).sex
                this.datalist=[]
            for(var item of list){
                if((item.id==id)||(item.id==mydata.id)){
                    if(item.id==id){
                        item.authname=lovename
                        item.authimg=loveface
                        item.sex = lovesex
                    }
                    else{
                        item.authname=mydata.authname
                        item.authimg=mydata.faceimg
                        item.sex = mydata.sex
                    }
                    this.datalist.push(item)
                }

            }
            })
            })
              
              for(var item of list){
                  if(item.id!=this.nameid){
                      item.islove=true
                  }
              }
               this.$Bus.$emit('showtabnum','动态',0)
              this.$http.change(this.envprod,list,()=>{})
          }
          else{
            this.$http.query(10002).then(res=>{
                this.$http.add(10000,JSON.parse(res.data.jsonmap),()=>{
                    this.checklist()
                })
            })
          }
      })
      },
      topl(e){
          this.flagnum=e
          this.comment_input=true
          this.isreplay=false
          setTimeout(()=>{
                document.getElementById('huifu_broad').focus()
            },500)
      },
      pltopl(e,obj,num){
          this.plobj=obj
          this.flagnum=e
          this.isreplay=true
          this.comment_input=true
          this.delcomnum = num
          var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
          if(obj.replyname==mydata.authname){
            this.myself=true
          }
          else{
              this.myself=false
          }
          setTimeout(()=>{
                document.getElementById('huifu_broad').focus()
            },500)
      },
        addcomment(){
            if(this.isreplay){
                this.comment_input=false
                this.$http.query(this.envprod).then(res=>{
                    if(res.data.jsonmap){
                        var list = JSON.parse(res.data.jsonmap)
                        if(this.datalist[this.flagnum].comment==''){
                            this.datalist[this.flagnum].comment=[]
                        }
                        var obj = {
                            replyname:this.name,
                            info:this.replies,
                            bereplyname:this.plobj.replyname,
                            comimglist:this.comimglist
                        }
                        this.datalist[this.flagnum].comment.push(obj)
                        for(var i = 0 ;i<=list.length-1;i++){
                            for(var item of this.datalist){
                                if((item.info == list[i].info) && (item.creattime==list[i].creattime)){
                                    list.splice(i,1,item)
                                }
                            }
                        }
                        this.$http.change(this.envprod,list,()=>{
                            this.checklist()
                            this.replies=''
                            
                            this.$toast.toast('评论成功')
                            this.comimglist=[]
                        })
                    }
                })
            }
            else{
                this.comment_input=false
                this.$http.query(this.envprod).then(res=>{
                    if(res.data.jsonmap){
                        var list = JSON.parse(res.data.jsonmap)
                        if(this.datalist[this.flagnum].comment==''){
                            this.datalist[this.flagnum].comment=[]
                        }
                        var obj = {
                            replyname:this.name,
                            info:this.replies,
                            comimglist:this.comimglist
                        }
                        this.datalist[this.flagnum].comment.push(obj)
                        for(var i = 0 ;i<=list.length-1;i++){
                        for(var item of this.datalist){
                                if((item.info == list[i].info) && (item.creattime==list[i].creattime)){
                                    list.splice(i,1,item)
                                }
                            }
                        }
                        this.$http.change(this.envprod,list,()=>{
                            this.checklist()
                            this.replies=''
                            this.$toast.toast('评论成功')
                            this.comimglist=[]
                        })
                    }

                })
            }
        },
        delcom(){
            if(this.isreplay){
                this.delcomflag=false
                this.$http.query(this.envprod).then(res=>{
                    if(res.data.jsonmap){
                        var list = JSON.parse(res.data.jsonmap)
                        this.datalist[this.flagnum].comment.splice(this.delcomnum,1)
                        for(var i = 0 ;i<=list.length-1;i++){
                                for(var item of this.datalist){
                                        if((item.info == list[i].info) && (item.creattime==list[i].creattime)){
                                            list.splice(i,1,item)
                                        }
                                }
                        }
                        this.$http.change(this.envprod,list,()=>{
                            this.checklist()
                            this.replies=''
                            this.$toast.toast('删除成功')
                            this.comimglist=[]
                        })
                    }
                })
            }
        },
        replymessage(){

        },
        cancle_publish(){
            this.comment_input=false
        },
        delComImg(e){
            this.comimglist.splice(e,1)
        },
        showcomimg(a,b,c){
            this.imgshow.index = a
            this.imgshow.indexs = c
            this.imgshow.indexss = b
            this.swiperOptionClub.initialSlide=c
            this.toshowimgflag1 = true
            this.img = this.datalist[a].comment[b].comimglist[c]
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
                    that.comimglist.push('http://47.94.235.210:8090/uploadData/getFile/'+res.data.id)
                })
            }
          }
        },
        dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return [u8arr];
        },
        deltc(e){
            this.delnum=e
            this.delflag=true
        },
        showitem(index,indexs){
            this.imgshow.index = index
            this.imgshow.indexs = indexs
            this.swiperOptionClub.initialSlide=indexs
            this.toshowimgflag = true
            this.img = this.datalist[index].img[indexs]
        },
        delpub(){
        this.delflag=false
        this.$http.query(this.envprod).then(res=>{
          if(res.data.jsonmap){
                var list = JSON.parse(res.data.jsonmap)
                var delitem = this.datalist[this.delnum]
                for(var i = 0 ;i<=list.length-1;i++){
                    if(delitem.info == list[i].info && delitem.creattime == list[i].creattime){
                        list.splice(i,1)
                    }
                }
              this.$http.change(this.envprod,list,()=>{
                  this.checklist()
                  this.$toast.toast("删除成功")
                  
              })
            this.$http.query(9999).then(res=>{
            if(res.data.jsonmap){
              var dellist = JSON.parse(res.data.jsonmap)
              dellist.push(delitem)
              this.$http.change(9999,dellist,()=>{})
          }
          else{
              var dellist = []
              dellist.push(delitem)
              this.$http.change(9999,dellist,()=>{})
          }
      })
          }
      })

        }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/info.css";
.pyq{
width: 100vw;
height: calc(100vh - 110px);
overflow: scroll;
position: relative;
background: #fff;
margin-top: 55px;
margin-bottom: 20px;
}
.navs{
    width: 100%;
    height: 55px;
    text-align: center;
    line-height: 55px;
    font-weight: 600;
    position: fixed;
    top: 0;
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
}
.pyqface{
    width: 40px;
    height: 40px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    margin-left: 15px;
    overflow: hidden;
    flex: 0 0 auto;
}
.authname{
    display: flex;
    width: 200px;
    text-align: start;
    height: 30px;
    line-height: 30px;
    color: #5998de;
    font-weight: 600;
    font-size: 15px;
    padding-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap
}
.pyqmessage{
    padding-top: 15px;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    
}
.info{
    text-align: start;
    min-height: 20px;
    padding-top: 0px;
    padding-left: 10px;
    // padding-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:wrap;
    min-width: calc(100% - 20px);
    word-wrap: break-word;
    word-break: break-all;
}
.showimg{
    width: 100%;
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
}
.edit{
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 10px;
    white-space: nowrap;
    align-items: center;
}
.pyq::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}

.comment_input {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
}
.comment_input .text_broad {
    overflow: hidden;
}
.comment_input .text_broad .huifu_broad {
    width: 100%;
    min-height: 130px;
    border: none;
    font-size: 15px;
    padding: 10px;
    float: left;
}
.comment_input .cancle_sure {
    background-color: #fff;
    float: left;
    width: 100%;
    margin-top: 0px;
    font-size: 15px;
    position: relative;
}
.cancle_sure .sure_btn {
    float: right;
    width: 80px;
    height: 30px;
    border-radius: 10px;
    background-color: #f8952c;
    line-height: 30px;
    color: #ffffff;
    text-align: center;
    margin: 15px;
}
.cancle_sure .cancle_btn {
    float: right;
    color: #565656;
    line-height: 60px;
    margin-left: 15px;
}
.comment_input .com_inputBox {
    position: absolute;
    top: 45px;
    left: 0;
    z-index: 2;
    width: 100%;
}
.pllist{
    text-align: start;
    margin-left: 15px;
    margin-right: 15px;
    background: #e5e5e5;
    padding: 4px;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 14px;
    overflow: hidden;
    text-overflow:inherit;
    white-space:wrap;
}
.blackbg{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba($color: #000000, $alpha: 0.6);
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
