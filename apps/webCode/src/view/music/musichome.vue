<template>
<div class="body" id="body">
    <div class="nav">
        <div class="navitem">
            <i class="el-icon-more"></i>
        </div>
        <h1 class="text">WWQWBY-MUSIC</h1>
        <div class="navitem">
            <i class="el-icon-search" @click="openserch"></i>
        </div>
    </div>
    <div class="tab">
        <div v-for="(item,index) of tab" :key="index+'g'" class="tabitem">
            <div :class="index==tabnum?'tab_active':''" @click="tabnum=index">{{item.name}}</div>
        </div>
    </div> 
    <div class="centercall" v-if="tabnum == 0" :class="playmucis.picUrl?'gotoup':''">

    <div class="swiper-log" >
        <swiper :options="swiperOptionClub" >
            <swiper-slide v-for="item in imgList" :key="item.img">
                <img :src="item.img" alt="" class="swiperimg" @click="getsongs(item.id,$event)">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
        <div class="centeritem">
            <div class="title" >
                {{centerlist[0].name}}
            </div>
            <div class="recomlist">
            <div v-for="(items,indexs) of centerlist[0].list" :key="indexs+'j'" class="itemimg" >
            <img :src="items.picUrl" alt="" style="width:100%;border-radius: 5px;" @click="gedanobj=items">
            <div class="playcount">
                <img src="../../assets/img/play.png" alt="" style="width:15px;height:15px">
                <div>{{items.playCount|playcountfil}}</div>
            </div>
            <div class="itemlistname">{{items.name}}</div>
            </div>
            </div>
        </div>
        <div class="centeritem">
            <div class="title" >
                {{centerlist[1].name}}
            </div>
            <div class="itemlist">
            <div v-for="(items,indexs) of centerlist[1].list" :key="indexs+'k'" class="itemimg" @click="togetmusic(items,items.id,$event)" v-if="indexs<9" >
            <img :src="items.picUrl||items.coverImgUrl" alt="" style="width:100%;border-radius: 5px;">
            <div class="itemlistname"  v-if="indexs<9">{{items.name}}</div>
            <div class="musicauth" style="font-size:12px;"><span v-for="(item,index) of items.song.artists" :key="index+'k'"><span v-if="index!=0">/</span>{{item.name}}</span></div>
            </div>
            </div>
        </div>
        <div class="centeritem">
            <div class="title" >
                {{centerlist[2].name}}
            </div>
            <div class="itemlist">
            <div v-for="(items,indexs) of centerlist[2].list" :key="indexs+'l'" class="itemimg_mv"  v-if="indexs<5" >
            <img :src="items.picUrl||items.coverImgUrl" alt="" style="width:100%;border-radius: 5px;" @click="playmv(items)">
            <div class="itemlistname"  v-if="indexs<5">{{items.name}}</div>
            </div>
            </div>
        </div>
        <div>
            <p style="font-size:12px">没有更多了哦~</p>
        </div>
    </div>
    <div v-if="tabnum == 1">

    </div>
    <div class="playtab" v-if="playmucis.picUrl&&playcontrolflag" @click="openplaybg">
        <div style="display:flex">
            <div class="guanp">
                <img :src="playmucis.picUrl" alt="" style="width:30px;border-radius: 15px;">
            </div>
            <div class="musicinfo">
                <div  class="musicname" style="font-size: 15px;">{{playmucis.name}}</div>
                <div class="musicauth" style="font-size:12px"> <span v-for="(item,index) of playmucis.song.artists" :key="index+'k'"><span v-if="index!=0">/</span>{{item.name}}</span></div>
            </div>
        </div>
        <div class="playcontrols">
            <div style="display:flex">
                <i :class="playzt[playztnum]" style="font-size:25px;margin-right:12px" @click.stop="controlsplay(playztnum)"></i>
                <div>
                <img src="../../assets/img/gedanback.png" style="width:24px" @click.stop="musiclistshow" >
                </div>
            </div>
        </div>
    </div>
        <div>
            <audio :src="playmucis.url" id='song' autoPlay :loop="audioconfig.loop" @loadstart="playztnum=2" @pause="playztnum=0" @ended="isend" @play="playztnum=1" @canplay="playztnum=1" @timeupdate="updata"></audio>
        </div>
    <!-- 动画小图标 -->
    <div class="touchitem" :style="'top:'+touch.y+'px;left:'+touch.x+'px'" id="touchitem" v-if="changemusic">
        <img :src="playmucis.picUrl" alt="" style="width:30px;border-radius: 5px;">
    </div>

    <!-- 进度条 -->
    <div class="duration" v-if="playmucis.url&&playcontrolflag" @click="jumpto($event)">
            <div class="line" :style="'width:'+jindutiao+'%'"></div>
            <div class="toopot" @click.stop @touchstart="changeduration($event)" @touchend="changedurationend($event)" @touchmove="changedurationmove($event)">
            <div class="opot"></div>
            </div>
    </div>
    <!-- 进度条提示 -->
    <div class="tipsshow" v-if="tipsshows">
        <div class="tipsitem" :class="drag?'':'closeflag'">
            {{(duration*jindutiao)/100 | showtime}}/{{duration| showtime}}
        </div>
    </div>
    <!--歌曲列表 -->
    <div class="musiclistbox" v-if="musiclist.flag" :class="musiclist.isflag?'bghide':''" @click="musiclistshow">
        <div class="musiclist"  :class="musiclist.isflag?'listhide':''">
            <div class="mygedan">
                当前播放
            </div>
            <div class="listbox">
                <div v-for="(item,index) of audioconfig.playlist" :key="index+'gag'" @click.stop="toplaynum(index)" class="mygedanlist">
                    <div class="listinfo" :style="index == audioconfig.num?'color:red':''">
                    <span v-if="index == audioconfig.num"><img src="../../assets/img/bofing.gif" alt="" style="width:12px"></span>
                    {{item.name}} - 
                    <span v-for="items of item.song.artists" :id="index == audioconfig.num?'isplay':''" :style="index == audioconfig.num?'color:red;font-size:12px':'color:#d1d1d1;font-size:12px'" :key="items.name">{{items.name}}</span>
                    </div>
                    <div style="margin-right:15px">
                        <i class="el-icon-close" @click.stop="delplaynum(index)"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 歌单页 -->
    <div class="playbg" v-if="gedanobj.picUrl" :class="gedanobjflags?'closeflag':''">
        <musicdan :gedanobj="gedanobj" @gedanobjflag="gedanoflag" :playmucis="playmucis" @togetmusic="togetmusic" @pushallplay="pushallplay"></musicdan>
    </div>
    <!--    搜索页 -->
    <div class="playbg"  v-if="serchinfo.flag" :class="gedanobjflags?'closeflag':''" style="background:#fff">
        <musicserch @serchflag="serchflag" @getsongs="togetmymusic" :playmucis="playmucis"></musicserch>
    </div>

    <!--    MV页 -->
    <div class="playbg"  v-if="mvinfo.flag" :class="openplayflag?'closeflag':''">
        <mvplay :id="mvinfo.id" @bgflag="openplay"></mvplay>
    </div>
    <!-- 播放页 -->
    <div class="playbg" v-if="openplaybgflag" :class="openplayflag?'closeflag':''">
        <musicplay
         @toplaybefore="toplaybefore" @toplaynext="toplaynext"
         @controlsplay="controlsplay" @bgflag="openplay" @jumpto="jumpto" :playtime="currentTime" 
         :playztnum="playztnum" :playmucis="playmucis" ref="playpage" :jindutiao="jindutiao" :duration="duration"
          @changeduration="changeduration" @changedurationend="changedurationend" @changedurationmove="changedurationmove"
          @musiclistshow="musiclistshow"
        ></musicplay>
    </div>
</div>

</template>
<script>
import axios from 'axios'
import "swiper/swiper.scss";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import musicplay from "./musicplay";
import musicdan from "./musicdan";
import mvplay from "./mvplay";
import musicserch from "./musicserch";
export default {
  components: {
    swiperSlide,
    swiper,
    musicplay,
    musicdan,
    mvplay,
    musicserch
  },
  data(){
      return{
        tab:[
              {name:'推荐'},
              {name:'每日推荐'},
              {name:'排行'},
          ],
          centerlist:[
              {
                  name:'推荐歌单',
                  list:[],
              },
              {
                  name:'推荐单曲',
                  list:[],
              },
              {
                  name:'推荐MV',
                  list:[],
              },
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
          tabnum:0,
          bgm:'',
          playzt:[
              'el-icon-video-play',
              'el-icon-video-pause',
              'el-icon-loading',
          ],
        imgList:[
                {img:'http://p1.music.126.net/TENt1nqk6ydwZNlw3tfSCQ==/109951165622661132.jpg?imageView&quality=89',id:1811183594},
                {img:'http://p1.music.126.net/Est2bsWuekO1CkYJFoZw4Q==/109951165623333332.jpg?imageView&quality=89',id:1811102198},
                {img:'http://p1.music.126.net/Lc9B_2sxyi4fBPRRqjFQXg==/109951165622666353.jpg?imageView&quality=89',id:1810035596},
                {img:'http://p1.music.126.net/ykACJjE4Q0OpyoK4_xOHng==/109951165622695918.jpg?imageView&quality=89',id:1809135435},
                {img:'http://p1.music.126.net/-DNq-kGFTExgbaHXpppnBw==/109951165622156789.jpg?imageView&quality=89',id:1810268246},
                {img:'http://p1.music.126.net/LfLootdvQZHwnNe1hAE1mA==/109951165623462796.jpg?imageView&quality=89',id:1810021934},
                {img:'http://p1.music.126.net/gVSmheV40wnK3qCQln7ZMw==/109951165622682625.jpg?imageView&quality=89',id:1811199130},
                {img:'http://p1.music.126.net/BeHK3hjo8wY59aM5bQJ4YA==/109951165623341629.jpg?imageView&quality=89',id:1368754688},
            ],
        changemusic:false,
        changeflag:'',
        playztnum:2,
        bgmname:'',
        songslist:[],
        touch:{x:-50,y:-50},
        playmucis:{
            picUrl:'',
            url:'',
            name:'',
            song:{
                artists:[{
                    name:''
                }]
            },
        },
        musiclist:{
            flag:false,
            isflag:false,
        },
        gedanobj:{},
        openplaybgflag:false,
        openplayflag:false,
        gedanobjflags:false,
        currentTime:0,
        duration:0,
        jindutiao:0,
        drag:false,
        tipsshows:false,
        audioconfig:{
            playlist:[],
            loop:false,
            num:0,
        },
        mvinfo:{
            flag:false,
            id:''
        },
        serchinfo:{
            flag:false,
        },
        playcontrolflag:true
      }
  },
  mounted(){
    this.getcommusic()
    // var obj = localStorage.getItem('audioconfig')
    // if(obj){
    //     console.log(JSON.parse(obj));
    //     this.audioconfig = JSON.parse(obj)
    // }
        var state = {
            title: "title",
            url: "#/mymusic"
        };
    window.history.pushState(state, "title", "#/mymusic");
     window.addEventListener("popstate", function (e) {
        
        var state = {
            title: "title",
            url: "#/mymusic"
        };
        window.history.pushState(state, "title", "#/mymusic");
    }, false);
  },
  filters:{
    playcountfil(i){
          if(i>100000000){
              return (i/100000000).toFixed(2) + '亿'
          }
          else if(i>10000){
              return (i/10000).toFixed(2) + '万'
          }
      },
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
  methods:{
      getcommusic(){//拿到歌单和推荐歌曲
          var obj = {
            url:'https://music.163.com/api/personalized/newsong',
            method:'GET',
            contentType:"",
            jsonParam:''
          }

          this.$http.proxy(obj).then(res=>{
               this.centerlist[1].list = res.data.result
          })
          var bannerobj = 
           {
            url:'http://musicapi.leanapp.cn/personalized',
            method:'GET',
            contentType:"",
            jsonParam:''
          }
          this.$http.proxy(bannerobj).then(res=>{
            this.centerlist[0].list = res.data.result
          })
          var mvobj = 
           {
            url:'https://music.163.com/api/personalized/mv',
            method:'GET',
            contentType:"",
            jsonParam:''
          }
          this.$http.proxy(mvobj).then(res=>{
            this.centerlist[2].list = res.data.result
          })
        
        //   http://musicapi.leanapp.cn
        var recommendobj = {
            url:'http://musicapi.leanapp.cn/song/recommend',
            method:'GET',
            contentType:"",
            jsonParam:''
          }
        this.$http.proxy(recommendobj).then(res=>{
            // this.keyslist=res.data.result.hots 
          })
      
      },
      isend(){
        if(this.audioconfig.num==this.audioconfig.playlist.length-1){
            this.audioconfig.num=0
        }
        else{
            this.audioconfig.num+=1
        }
        var list =  JSON.stringify(this.audioconfig)
        list =  JSON.parse(list)
        this.playmucis=list.playlist[list.num]
        this.audioAutoPlay('song')
      },
      delplaynum(e){
          if(this.audioconfig.playlist.length==1){
            this.playmucis = {
                                picUrl:'',
                                url:'',
                                name:'',
                                song:{
                                    artists:[{
                                        name:''
                                    }]
                                },
                            }
            this.audioconfig.playlist.splice(e,1)
            this.musiclistshow()
        return 
          }
          if(this.audioconfig.num == e){
            this.audioconfig.playlist.splice(e,1)
            var list =  JSON.stringify(this.audioconfig)
            list =  JSON.parse(list)
            this.playmucis=list.playlist[e==0?0:e-1]
            this.audioconfig.num-=1
            this.audioAutoPlay('song')
          }
          else{
              this.audioconfig.playlist.splice(e,1)
              this.audioconfig.num-=1
          }
        //   localStorage.setItem('audioconfig',JSON.stringify(this.audioconfig))
      },
      toplaynum(e){
        this.audioconfig.num=e
        var list =  JSON.stringify(this.audioconfig)
        list =  JSON.parse(list)
        this.playmucis=list.playlist[list.num]
        this.audioAutoPlay('song')
      },
      toplaynext(){
        if(this.audioconfig.num==this.audioconfig.playlist.length-1){
            this.audioconfig.num=0
        }
        else{
            this.audioconfig.num+=1
        }
        var list =  JSON.stringify(this.audioconfig)
        list =  JSON.parse(list)
        this.playmucis=list.playlist[list.num]
        this.audioAutoPlay('song')
      },
      toplaybefore(){
        if(this.audioconfig.num==0){
            this.audioconfig.num=this.audioconfig.playlist.length-1
        }
        else{
            this.audioconfig.num-=1
        }
        var list =  JSON.stringify(this.audioconfig)
        list =  JSON.parse(list)
        this.playmucis=list.playlist[list.num]
        this.audioAutoPlay('song')
      },
      togetmusic(item,id,e){//拿到歌曲的url
          if(this.changemusic){
              return
          }
          if(e){
              this.touchfunc(e)
          }
           this.playmucis.picUrl= item.picUrl||item.album.picUrl
           this.playmucis.name= item.name||item.album.name
           this.playmucis.song= item.song||item.album
           axios.get('http://musicapi.leanapp.cn/music/url',{
               params:{
                   id:id,
                //    type:'song'
               },
               emulateJSON:true
           }).then(res=>{
               this.playmucis.url = res.data.data[0].url
               this.playmucis.id = id 
               var audiocf= false//是否重复
               for(var key in  this.audioconfig.playlist){
                   if(this.audioconfig.playlist[key].id == this.playmucis.id){
                       audiocf=true
                       this.audioconfig.num = Number(key)
                   }
               }
               if(audiocf==false){
                   var obj =JSON.stringify( this.playmucis)
                   this.audioconfig.playlist.push(JSON.parse(obj))
                   this.audioconfig.num = this.audioconfig.playlist.length-1
                //    localStorage.setItem('audioconfig',JSON.stringify(this.audioconfig))
               }
               this.audioAutoPlay('song')
           })
      },
      pushallplay(arr){//添加所有歌曲
          var that = this
          function tolog(item,index){
              var obj ={}
           axios.get('http://musicapi.leanapp.cn/music/url',{
               params:{
                   id:item.id,
                //    type:'song'
               },
               emulateJSON:true
           }).then(res=>{
               if(index==0){
                that.playmucis.picUrl= item.picUrl||item.album.picUrl
                that.playmucis.name= item.name||item.album.name
                that.playmucis.song= item.song||item.album
                that.playmucis.url = res.data.data[0].url
                that.playmucis.id = item.id
               }
               obj = {
                   id:item.id,
                   name:item.name||item.album.name,
                   picUrl:item.picUrl||item.album.picUrl,
                   song:item.song||item.album,
                   url:res.data.data[0].url,
               }
               var audiocf= false//是否重复
               for(var key in  that.audioconfig.playlist){
                   if(that.audioconfig.playlist[key].id == obj.id){
                       audiocf=true
                   }
               }
               if(audiocf==false){
                   that.audioconfig.playlist.push(obj)
                //    localStorage.setItem('audioconfig',JSON.stringify(that.audioconfig))
               }
                for(var key in that.audioconfig.playlist){
                    if(that.audioconfig.playlist[key].id == that.playmucis.id){
                         that.audioconfig.num = Number(key)
                         that.audioAutoPlay('song')
                    }
                }
                
           })
          }
          for(var key in arr){
            tolog(arr[key],key)
          }
      },
      getsongs(id,e){//通过歌单拿到对应歌曲
        //   /song/detail?ids=347230
        axios.get('https://api.imjad.cn/cloudmusic/',{
               params:{
                   id:id,
                   type:'song'
               },
               emulateJSON:true
           }).then(res=>{
                var obj = {
                    url:'http://musicapi.leanapp.cn/song/detail?ids='+id,
                    method:'get',
                    contentType:"",
                    jsonParam:''
                }
                this.$http.proxy(obj).then(res=>{
                this.changemusic=true
                this.playmucis.picUrl= res.data.songs[0].al.picUrl
                this.playmucis.name= res.data.songs[0].al.name
                this.playmucis.song.artists= res.data.songs[0].ar
                })
               this.playmucis.url = res.data.data[0].url
               this.audioAutoPlay('song')
           })
      },
      togetmymusic(id,e){
        this.playmucis.id = id 
        axios.get('http://musicapi.leanapp.cn/music/url',{
               params:{
                   id:id,
                //    type:'song'
               },
               emulateJSON:true
           }).then(res=>{
                var obj = {
                    url:'http://musicapi.leanapp.cn/song/detail?ids='+id,
                    method:'get',
                    contentType:"",
                    jsonParam:''
                }
                this.$http.proxy(obj).then(res=>{
                this.changemusic=true
                this.playmucis.picUrl= res.data.songs[0].al.picUrl
                this.playmucis.name= res.data.songs[0].al.name
                this.playmucis.song.artists= res.data.songs[0].ar
               var audiocf= false//是否重复
               for(var key in  this.audioconfig.playlist){
                   if(this.audioconfig.playlist[key].id == this.playmucis.id){
                       audiocf=true
                       this.audioconfig.num = Number(key)
                   }
               }
               if(audiocf==false){
                   var obj =JSON.stringify( this.playmucis)
                   this.audioconfig.playlist.push(JSON.parse(obj))
                   this.audioconfig.num = this.audioconfig.playlist.length-1
                   console.log(this.audioconfig);
                //    localStorage.setItem('audioconfig',JSON.stringify(this.audioconfig))
               }
                })
               this.playmucis.url = res.data.data[0].url
               
               this.touchfunc(e)
               this.audioAutoPlay('song')
           })
      },
    audioAutoPlay(id){//播放歌曲
            var audio = document.getElementById(id);
            audio.play();
            document.addEventListener("WeixinJSBridgeReady", function () {
                audio.play();

                }, false);
        },
    controlsplay(e){//控制暂停播放
        var audio = document.getElementById("song");
        switch (e){
            case 0 :
                audio.play();
                if(this.$refs.playpage){
                    this.$refs.playpage.startgo()
                }
                break
            case 1 :
                audio.pause()
                if(this.$refs.playpage){
                    this.$refs.playpage.stopgo()
                }
                break
            case 2 :
                break
        }
    },
    touchfunc(e){//点击歌单动画，
        
            this.changemusic=true
            setTimeout(() => {            
                var oTurntable = document.querySelector('#touchitem');
                var body = document.documentElement.clientHeight;
                //获取鼠标位置
                this.touch.x=e.clientX
                this.touch.y=e.clientY
                
                this.changeflag = setInterval(() => {
                    oTurntable.style.top = this.touch.y
                    this.touch.y+=1
                }, 1);
            setTimeout(()=>{
                        clearInterval(this.changeflag)
                        oTurntable.style.top=0
                        this.touch.y=-50
                        this.changemusic=false
            },1000)
            }, 0);
        
    },
    openplaybg(){//打开音乐播放页面
    this.openplayflag=false
    this.openplaybgflag=true
    this.playcontrolflag=false
    if(this.musiclist.flag){
        this.musiclist.isflag=true
        setTimeout(()=>{
            this.musiclist.flag=false
        },500)
    }
    },
    musiclistshow(){
        if(this.musiclist.flag){
            this.musiclist.isflag=true
            setTimeout(()=>{
                this.musiclist.flag=false
            },500)
        }
        else{
            this.musiclist.isflag=false
            this.musiclist.flag=true
            setTimeout(()=>{
                document.getElementById("isplay").scrollIntoView({
                        behavior:'smooth',
                         block:"center"
                });
            },200)
        }
    },
    openplay(){
        this.openplayflag=true
        this.playcontrolflag=true
        setTimeout(()=>{
            this.openplaybgflag=false
            this.mvinfo.flag=false
            this.controlsplay(0)
        },1000)
    },
    gedanoflag(){
        this.gedanobjflags=true
        setTimeout(()=>{
            this.gedanobj={}
            this.gedanobjflags=false
        },1000)
    },
    openserch(){
        this.gedanobjflags=false
        this.serchinfo.flag=true
    },
    serchflag(){
        this.gedanobjflags=true
        setTimeout(()=>{
            this.gedanobjflags=false
            this.serchinfo.flag=false
        },1000)
    },
    updata(){
        if(this.drag){
            return
        }
        var audio = document.getElementById("song");
        this.currentTime=audio.currentTime;
        this.duration= audio.duration
        this.jindutiao=(this.currentTime)*100/this.duration
    },
    changeduration(e){
        this.drag=true
        this.tipsshows=true
    },
    changedurationend(e){
        var audio = document.getElementById("song");
        audio.play();
        if(this.$refs.playpage){
            this.$refs.playpage.startgo()
        }
        audio.currentTime=(this.duration*this.jindutiao)/100
        this.drag=false
        setTimeout(()=>{
            this.tipsshows=false
        },1000)
    },
    changedurationmove(e){
        var x = e.changedTouches[0].clientX
        var width= document.documentElement.clientWidth
        if(x<0){
            x = 0
        }
        if(width<x){
            x = width
        }
        this.jindutiao = (x/width)*100
    },
    jumpto(e){
        this.tipsshows=true
        var x = e.offsetX
        var width= e.toElement.offsetWidth
        this.jindutiao = (x/width)*100
        var audio = document.getElementById("song");
        audio.play();
        if(this.$refs.playpage){
            this.$refs.playpage.startgo()
        }
        setTimeout(()=>{
            this.tipsshows=false
        },1000)
        audio.currentTime=(this.duration*this.jindutiao)/100
    },
    playmv(item){
        this.mvinfo.id = item.id
        this.openplayflag=false
        this.mvinfo.flag =true
        this.controlsplay(1)
        this.playcontrolflag=false
    }
  }
}
</script>

<style lang="scss" scoped>
.nav{
    position: fixed;
    top: 0;
    width: 100%;
    height: 44px;
    background: #d44439;
    display: flex;
    justify-content: space-between;
    z-index: 10;
    .text{
    font-size: 15px;
    font-weight: bold;
    color: #f1f1f1;
    letter-spacing: 1.5px;
    }
    .navitem{
        display: flex;
        justify-content: center;
        align-items: center;
        color: #f1f1f1;
        width: 50px;
        font-size: 20px;
    }
}
.tab{
    position: fixed;
    top: 44px;
    width: 100%;
    height: 44px;
    background: #d44439;
    display: flex;
    z-index: 10;
    .tabitem{
        width: 33.3%;
        color: #f1f1f1;
        font-weight: bold;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        .tab_active{
            border-bottom:2px solid #f1f1f1;
            padding-bottom: 2px;
        }
    }
}
.gotoup{
    height: calc( 100% - 138px);
    animation: godown 1s;
}
@keyframes godown {
    0%{
        height: calc( 100% - 88px);
    }
    100%{
        height: calc( 100% - 138px);
    }
}
.centercall{
    position: absolute;
    top: 88px;
    width: 100%;
    overflow: scroll;
    background: #efefef;
    .centeritem{
        // margin-top: 0px;
        display: flex;
        flex-wrap: wrap;
    }
    .itemlist{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        font-size: 12px;
    }
    .recomlist{
        width: 100%;
        overflow: scroll;
        display: flex;
        flex-wrap: nowrap;
        font-size: 12px;
    }
    .title{
        text-align: start;
        font-weight: bold;
        font-size: 14px;
        padding: 5px;
        height: 20px;
        width: 100%;
    }
    .itemimg{
        margin: 6px;
        width: 30%;
        position: relative;
        .playcount{
            position: absolute;
            top: 3px;
            right: 3px;
            height: 15px;
            color: #ffffff;
            line-height:15px;
            display: flex;
        }
        .itemlistname{
        width: 100%;
        text-align: start;
        text-overflow: ellipsis;
        white-space:nowrap;
        overflow: hidden;
        }
        .musicauth{
            text-align: start;
            color:#757575;
            text-overflow: ellipsis;
            white-space:nowrap;
            overflow: hidden;
        }
    }
    .itemimg_mv{
        margin: 6px;
        width: 45%;
        position: relative;
        .playcount{
            position: absolute;
            top: 3px;
            right: 3px;
            height: 15px;
            color: #ffffff;
            line-height:15px;
            display: flex;
        }
        .itemlistname{
        width: 100%;
        text-align: start;
        text-overflow: ellipsis;
        white-space:nowrap;
        overflow: hidden;
        }
    }
}
.recomlist::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}
.centercall::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}
.playtab{
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 50px;
    border-top: 1px solid #e5e5e5;
    box-shadow: 4px 3px 5px 5px rgba(0,0,0,.1);
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: goup 1s;
    z-index: 999;
    .guanp{
        margin-left: 10px;
        background: url(../../assets/img/playdef.png) no-repeat 0 0/100% auto ;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
            animation: rota 4s infinite linear ;
        }
    }
    .musicinfo{
        max-width: 240px;
        padding-left: 5px;
        text-align: start;
        .musicname{
            text-overflow: ellipsis;
            white-space:nowrap;
            overflow: hidden;
        }
        .musicauth{
            text-overflow: ellipsis;
            white-space:nowrap;
            overflow: hidden;
        }
    }
}
@keyframes goup {
    0%{
        opacity: 0;
        bottom: -50px;
    }
    100%{
        opacity: 1;
        bottom: 0px;
    }
}
@keyframes rota {
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }
}
.playcontrols{
    padding: 10px;
}
.touchitem{
    position: absolute;
    width: 20px;
    height: 20px;
    pointer-events: none;
    opacity: 0;
    animation: displaynone 1s ;
    z-index: 13;
}
@keyframes displaynone {
    0%{
        opacity: 1;
    }
    100%{
        opacity: 0;
    }
}
.swiperimg{
    width: 100%;
}
.playbg{
    background: #000;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    animation: toshowbg 1s;
}
@keyframes toshowbg {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}
.closeflag{
    animation: tohide 1s ;
}
@keyframes tohide {
    0%{
        opacity: 1;
    }
    100%{
        opacity: 0;
    }
}
.duration{
    position: fixed;
    bottom: 50px;
    height: 10px;
    width: 100%;
    font-size: 10px;
    color: #fff;
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    animation: toshowbg 1.5s;
    .line{
        height: 3px;
        background: gold;
        width: 0%;
    }
    .toopot{
        width: 25px;
        height: 25px;
        margin: -11px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .opot{
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 5px;
    }
}
.tipsshow{
    position: fixed;
    bottom: 200px;
    width: 100%;
    height: 30px;
    color: #fff;
    display: flex;
    justify-content: center;
    animation: toshowbg 0.1s;
    z-index: 11;
    .tipsitem{
        width: 100px;
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        background: rgba(0,0,0,.6);
        padding: 5px;
    }
}
.musiclistbox{
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 12;
    top: 0;
    display: flex;
    justify-content: center;
    background: rgba(0,0,0,.6);
    animation: bgshow 1s;
}
.musiclist::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}
.musiclist{
    position: fixed;
    z-index: 11;
    bottom: 60px;
    width: 95%;
    height: 430px;
    background: #fff;
    border-radius: 15px;
    box-shadow: 4px 3px 5px 5px rgba(0,0,0,.1);
    animation: 0.5s musiclistgoup;
    .mygedan{
        padding: 10px;
        text-align: center;
        font-size: 12px;
    }
    .listbox{
        overflow: scroll;
        width: 100%;
        height: calc(100% - 35px);
    }
    .mygedanlist{
        text-align: start;
        margin: 15px;
        width: calc(100% -15px);
        display: flex;
        justify-content: space-between;
            }
    .listinfo{
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
}
.listhide{
    animation: musiclisthide 0.5s;
}
.bghide{
    animation: bghide 0.5s;
}

@keyframes bghide {
    0%{
        background: rgba(0,0,0,.6);
    }
    100%{
        background: rgba(0,0,0,0);
    }
}
@keyframes bgshow {
    0%{
        background: rgba(0,0,0,0);
    }
    100%{
        background: rgba(0,0,0,0.6);
    }
}
@keyframes musiclistgoup {
    0%{
        bottom: -430px;
    }
    100%{
        bottom: 60px;
    }
}
@keyframes musiclisthide {
    0%{
        bottom: 60px;
    }
    100%{
        bottom: -430px;
    }
}
</style>
