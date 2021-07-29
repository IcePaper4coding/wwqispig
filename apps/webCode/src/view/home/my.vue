<template>
<div class="body">
<div class="mybox">
    <div class="topbox">
        <div class="authimg">
            <img :src="info.faceimg" alt="" style="width:60px">
        </div>
        <div class="authmessage" @click="goto(0)">
            <div class="authname">
                <div style="margin-right:10px"><img src="../../assets/img/hg.png" alt="" style="width:20px;"></div>
                {{info.authname}}
                <div style="margin-left:10px"><img :src="info.sex=='男'?require('../../assets/img/m.png'):require('../../assets/img/wm.png')" alt="" style="width:15px;margin-top:4px"></div>
            </div>
            <div class="more">查看个人主页和编辑资料</div>
        </div>
        <div>
            <img src="../../assets/img/right.png" alt="" style="width:15px;margin-top:25px;margin-right:5px" >
        </div>
    </div>
    <div class="centerbox">
        <div v-for="(item,index) in centerlist" :key="item.name" class="box" @click="centerfunc(index)">
            <div style="margin-left:15px;display:flex"><div style="margin-right:10px"><img :src="item.icon" alt="" style="width:20px;margin-top:13px"></div>{{item.name}}
            <div class="shownum" v-if="item.num">{{item.num}}</div></div>
            
            <div><img src="../../assets/img/right.png" alt="" style="width:15px;margin-top:15px"></div>
        </div>
    </div>
    <div class="bottombox">
        <div v-for="(item,index) in bottomlist" :key="item.name" class="box" @click="bottomfunc(index)">
            <div style="margin-left:15px;width: 100%;display:flex;justify-content: center;height: 40px;line-height: 40px;">
                <!-- <div style="margin-right:10px"><img :src="item.icon" alt="" :style="index==1?'width:17px;margin-top:10px':'width:20px;margin-top:10px'"></div> -->
                {{item.name}}</div>
        </div>
    </div>
</div>
<!-- 注销弹窗 -->
<div class="tc" v-if="zux">
    <p>您将进行注销</p>
    <p>是否继续？</p>
    <div class="bottom">
        <div class="item" @click="zux=false">取消</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="zuxiao">确认</div>
    </div>
</div>
<!-- 确认绑定 -->
<div class="tc" v-if="bindlove.flag">
    <p>您还未绑定伴侣</p>
    <p>是否进行绑定？</p>
    <div class="bottom">
        <div class="item" @click="bindlove.flag=false">取消</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="tobindlove">确认</div>
    </div>
</div>
<!-- 申请页面 -->
<div class="inputtc" v-if="bindlove.inputflag">
    <div style="margin:20px">
        <input type="text" placeholder="请输入对方的账号" v-model="bindlove.loverid" @input="checklover">
    </div>
    <div>
    <textarea name="text" id="tete" cols="25" rows="3" placeholder="请输入您爱的誓言" v-model="bindlove.lovesay"></textarea>
    </div>
    <div v-if="bindlove.loverid">
        <div style="display:flex; justify-content:center" v-if="bindlove.isfind"><div><img v-if="bindlove.loverid&&bindlove.isfind" src="../../assets/img/isright.png" alt="" style="width:15px;margin-top:3px;margin-right:5px"></div><span style="color:#5dc560;font-size:15px">{{bindlove.message}}</span></div>
        <div style="display:flex; justify-content:center" v-else><div><img v-if="bindlove.message&&bindlove.loverid&&!(bindlove.isfind)" src="../../assets/img/iswrong.png" alt="" style="width:15px;margin-top:3px;margin-right:5px"></div><span style="color:#e83c2f;font-size:15px">{{bindlove.message}}</span></div>
    </div>
    <div class="bottom">
        <div class="item" @click="bindlove.inputflag=false">取消</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="sentlove">发送申请</div>
    </div>
</div>
<!-- 申请信息页 -->
<div class="applytc" v-if="bindlove.applyflag&&(info.loverarr.length>0)">
    <div class="applybox">
    <div v-for="(item,index) of info.loverarr" :key="index" class="items" >
        <div class="faceimg">
            <img :src="item.faceimg" alt="" style="width:50px;">
        </div>
        <div style="width:50%">
            <div style="margin-left:10px;display:flex;color:#5998de;font-size:17px">{{item.authname}}<div style="margin-left:10px"><img :src="item.sex=='男'?require('../../assets/img/m.png'):require('../../assets/img/wm.png')" alt="" style="width:15px;margin-top:2px"></div></div>
            <div class="lovesay">{{item.lovesay}}</div>
        </div>
        <div style="width:calc(50% - 50px)">
            <div>
                <img src="../../assets/img/isright.png" alt="" style="width:25px;margin-top:10px;" @click="makechoose(true,item)">
                <img src="../../assets/img/iswrong.png" alt="" style="width:25px;margin-top:10px;margin-left:10px" @click="makechoose(false,item)">
            </div>
        </div>
    </div>
    </div>
    <div class="bottom">
        <div class="item" style="border-left:1px solid #e5e5e5" @click="bindlove.applyflag=false;bindlove.inputflag=true;">去绑定</div>
        <div class="item" @click="bindlove.applyflag=false">关闭</div>
    </div>
</div>
<!-- 确认绑定 -->
<div class="tc" v-if="bindlove.handle.flag">
    <div style="margin-top:25px">
    <p v-for="item of bindlove.handle.info" :key="item" style="font-size: 14px;">{{item}}</p>
    </div>
    <div class="bottom">
        <div class="item" @click="bindlove.handle.flag=false">取消</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="handlefunc">确认</div>
    </div>
</div>
<!-- 伴侣展示页面 -->
<div class="loveshow" v-if="bindlove.loveshow">
    <div class="items">
            <div>
                <img :src="bindlove.loverinfo.faceimg" alt="" style="width:50px">
                <div style="display:flex;justify-content: center;">
                    {{bindlove.loverinfo.authname}}
                    <div>
                    <img :src="bindlove.loverinfo.sex=='男'?require('../../assets/img/m.png'):require('../../assets/img/wm.png')" alt="" style="width:15px;margin-top:2px;margin-left:5px">
                    </div>
                </div>
                <div style="font-size:12px;">绑定时间：{{info.lovertime|timeFilter}}</div>
                <div style="font-size:12px;color:#007aff;text-decoration: underline;" @click="dellove(0)">解除绑定</div>
            </div>
    </div>
    <div class="bottom">
        <div class="item" @click="bindlove.loveshow=false">关闭</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="gotolink(0)">给她发消息</div>
    </div>
</div>
<!-- 解除绑定 -->
<div class="tc" v-if="bindlove.delloveflag">
    <div style="margin-top:25px;font-size: 14px;">您将发起解除请求</div>
    <div style="font-size: 14px;">需要对方同意才能继续</div>
    <div style="font-size: 14px;">是否继续？</div>
    <div class="bottom">
        <div class="item" @click="bindlove.delloveflag=false">取消</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="dellove(1)">确认</div>
    </div>
</div>
<!-- 我的惩罚信息页 -->
<div class="cftc" v-if="cflist.flag">
    <div style="padding-top: 15px;padding-bottom: 10px;">
        我的惩罚
    </div>
    <div class="tab">
        <div class="tabitem" @click="choosefinsh(false)" :class="cflist.tabact?'':'tabact'">未完成</div>
        <div class="tabitem" @click="choosefinsh(true)" :class="cflist.tabact?'tabact':''">已完成</div>
    </div>
    <div class="applybox">
    <div v-if="info.cflist==0&&!(cflist.tabact)" style="margin-top:45px">
        暂无可完成的惩罚
    </div>
    <div v-if="info.iscflist==0&&(cflist.tabact)" style="margin-top:45px">
        暂无已完成的惩罚
    </div>
    <div v-if="!cflist.tabact">
    <div v-for="(item,index) of info.cflist" :key="index" class="items" >
        <div style="max-width:70%;min-width:70%;font-size:13px;overflow: hidden;line-height:39px">
            {{item}}
        </div>
        <div style="max-width:30%;min-width:30%">
            <div>
                <img src="../../assets/img/isright.png" alt="" style="width:25px;margin-top:10px;" @click="cfchoose(true,item,index)">
                <img src="../../assets/img/iswrong.png" alt="" style="width:25px;margin-top:10px;margin-left:10px" @click="cfchoose(false,item,index)">
            </div>
        </div>
    </div>
    </div>
    <div v-else>
    <div v-for="(item,index) of info.iscflist" :key="index+'g'" class="items" >
        <div style="max-width:80%;min-width:80%;font-size:13px;overflow: hidden;line-height:39px">
            {{item}}
        </div>
        <div style="max-width:20%;min-width:20%">
            <div>
                <img src="../../assets/img/iswrong.png" alt="" style="width:25px;margin-top:10px;margin-left:10px" @click="cfchoose1(false,item,index)">
            </div>
        </div>
    </div>
    </div>
    </div>
    <div class="bottom">
        <div class="item" style="border-left:1px solid #e5e5e5" @click="gotolink(1)">去惩罚ta</div>
        <div class="item" @click="cflist.flag=false">关闭</div>
    </div>
</div>
<!-- 选择惩罚 -->
<div class="tc" v-if="cflist.cflag">
    <div style="margin-top: 25px;">
    <p v-for="item of cflist.list" :key="item" style="font-size: 14px;">{{item}}</p>
    </div>
    <div class="bottom">
        <div class="item" @click="cflist.cflag=false">取消</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="handlecf(false)">确认</div>
    </div>
</div>
<!-- 选择惩罚 -->
<div class="tc" v-if="iscflist.cflag">
    <div style="margin-top: 25px;">
    <p v-for="item of iscflist.list" :key="item" style="font-size: 14px;">{{item}}</p>
    </div>
    <div class="bottom">
        <div class="item" @click="iscflist.cflag=false">取消</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="handleiscf(false)">确认</div>
    </div>
</div>
<!-- ta的惩罚信息页 -->
<div class="cftc" v-if="lovecflist.flag">
    <div style="padding-top: 15px;padding-bottom: 10px;">
        ta的惩罚
    </div>
    <div class="tab">
        <div class="tabitem" @click="choosefinsh(false,true)" :class="lovecflist.tabact?'':'tabact'">未完成</div>
        <div class="tabitem" @click="choosefinsh(true,true)" :class="lovecflist.tabact?'tabact':''">已完成</div>
    </div>
    <div class="applybox">
    <div v-if="loveinfos.cflist.length==0&&!(lovecflist.tabact)" style="margin-top:45px">
        暂无可完成的惩罚
    </div>
    <div v-if="loveinfos.iscflist.length==0&&(lovecflist.tabact)" style="margin-top:45px">
        暂无已完成的惩罚
    </div>
    <div v-if="!lovecflist.tabact">
    <div v-for="(item,index) of loveinfos.cflist" :key="index" class="items" >
        <div style="max-width:70%;min-width:70%;font-size:13px;overflow: hidden;line-height:39px">
            {{item}}
        </div>
        <div style="max-width:30%;min-width:30%">
            <div>
                <img src="../../assets/img/isright.png" alt="" style="width:25px;margin-top:10px;" @click="cfchoose(true,item,index,true)">
                <img src="../../assets/img/iswrong.png" alt="" style="width:25px;margin-top:10px;margin-left:10px" @click="cfchoose(false,item,index,true)">
            </div>
        </div>
    </div>
    </div>
    <div v-else>
    <div v-for="(item,index) of loveinfos.iscflist" :key="index+'g'" class="items" >
        <div style="max-width:80%;min-width:80%;font-size:13px;overflow: hidden;line-height:39px">
            {{item}}
        </div>
        <div style="max-width:20%;min-width:20%">
            <div>
                <img src="../../assets/img/iswrong.png" alt="" style="width:25px;margin-top:10px;margin-left:10px" @click="cfchoose1(false,item,index,true)">
            </div>
        </div>
    </div>
    </div>
    </div>
    <div class="bottom">
        <div class="item" style="border-left:1px solid #e5e5e5" @click="gotolink(1)">去惩罚ta</div>
        <div class="item" @click="lovecflist.flag=false">关闭</div>
    </div>
</div>
<!-- 选择惩罚 -->
<div class="tc" v-if="lovecflist.cflag">
    <div style="margin-top: 25px;">
    <p v-for="item of lovecflist.list" :key="item" style="font-size: 14px;">{{item}}</p>
    </div>
    <div class="bottom">
        <div class="item" @click="lovecflist.cflag=false">取消</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="handlecf(true)">确认</div>
    </div>
</div>
<!-- 选择惩罚 -->
<div class="tc" v-if="loveiscflist.cflag">
    <div style="margin-top: 25px;">
    <p v-for="item of loveiscflist.list" :key="item" style="font-size: 14px;">{{item}}</p>
    </div>
    <div class="bottom">
        <div class="item" @click="loveiscflist.cflag=false">取消</div>
        <div class="item" style="border-left:1px solid #e5e5e5" @click="handleiscf(true)">确认</div>
    </div>
</div>
</div>
</template>

<script>

export default {
  data(){
      return{
          zux:false,
          bindlove:{
              inputflag:false,
              flag:false,
              loverid:'',
              isfind:false,
              message:'',
              lovesay:'i love you',
              applyflag:false,
              handle:{
                  flag:false,
                  info:['',''],
                  item:{},
                  handleflag:false
              },
              loveshow:false,
              loverinfo:{},
              delloveflag:false,
          },
         info:{
             name:'测试人员',
             sex:'男',
             cflist:[],
             iscflist:[]
         },
         loveinfos:{
             cflist:[],
             iscflist:[]
         },
         centerlist:[
             {
                 name:'我的伴侣',
                 icon:require('../../assets/img/setting/mylove.png'),
                 num:0
             },
             {
                 name:'给ta发信息',
                 icon:require('../../assets/img/setting/mynews.png'),
                 num:0
             },
             {
                 name:'我的惩罚',
                 icon:require('../../assets/img/setting/myhit.png'),
                 num:0
             },
             {
                 name:'ta的惩罚',
                 icon:require('../../assets/img/setting/mydt.png'),
                 num:0
             },
             {
                 name:'我的礼物',
                 icon:require('../../assets/img/setting/myliwu.png'),
                 num:0
             },
             {
                 name:'我的音乐',
                 icon:require('../../assets/img/setting/bgmimg.png'),
                 num:0
             },
             {
                 name:'我的游戏',
                 icon:require('../../assets/img/setting/bgmimg.png'),
                 num:0
             },

         ],
         bottomlist:[
             {
                 name:'设置',
                 icon:require('../../assets/img/setting/mysetting.png'),
             },
             {
                 name:'注销登录',
                 icon:require('../../assets/img/setting/myzxdl.png'),
             },
         ],
         settimeouts:'',
         tryid:'',
         cflist:{
             list:[],
             cflag:false,
             flag:false,
             tabact:false,
             handleflag:true,
             index:''
         },
         iscflist:{
             cflag:false,
             flag:false,
             tabact:false,
             handleflag:true,
             index:''
         },
        lovecflist:{
             list:[],
             cflag:false,
             flag:false,
             tabact:false,
             handleflag:true,
             index:''
         },
         loveiscflist:{
             cflag:false,
             flag:false,
             tabact:false,
             handleflag:true,
             index:''
         }   
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
        this.getauthinfo()
        this.checkmylove()
  },
  methods:{
        checklover(){
            if(this.settimeouts){
                clearTimeout(this.settimeouts)
            }
            var mydata = JSON.parse(localStorage.getItem('wqbytoken'))
            if(mydata.username==this.bindlove.loverid){
                    this.bindlove.isfind=false
                    this.bindlove.message='无法与自己成为伴侣'
                    return
            }
            this.settimeouts =setTimeout(()=>{
                this.$http.query(200816).then((res)=>{
                    var obj = JSON.parse(res.data.jsonmap)
                    if(obj[this.bindlove.loverid]){
                        if(obj[this.bindlove.loverid].loverid){
                                this.bindlove.isfind=false
                                this.bindlove.message='对方已有伴侣'
                        }
                        else{
                            this.bindlove.isfind=true
                            this.tryid=obj[this.bindlove.loverid].pid
                            this.bindlove.message='对方暂无伴侣，可以发送申请'
                        }
                    }
                    else{
                        this.bindlove.isfind=false
                        this.bindlove.message='用户不存在'
                    }
                })
            },1500)
        },
        sentlove(){
            if(this.bindlove.isfind==false){
                this.$toast.toast('发送失败，'+this.bindlove.message)
                return
            }
            if(this.bindlove.lovesay.length>16){
                this.$toast.toast('宣言不能多于16个字')
                return
            }
            var mydata = JSON.parse(localStorage.getItem('wqbytoken'))
            this.$http.query(this.tryid).then(res=>{
                var obj = JSON.parse(res.data.jsonmap)
                if(obj.loverarr){
                    obj.loverarr.push({
                        authname:this.info.authname,
                        faceimg:this.info.faceimg,
                        sex:this.info.sex,
                        lovesay:this.bindlove.lovesay,
                        id:mydata.id
                    })
                    this.$http.change(this.tryid,obj,()=>{})
                }
                else{
                    this.$set(obj,'loverarr',[{
                        authname:this.info.authname,
                        faceimg:this.info.faceimg,
                        sex:this.info.sex,
                        lovesay:this.bindlove.lovesay,
                        id:mydata.id
                    }])
                    this.$http.change(this.tryid,obj,()=>{})

                }
                this.bindlove.inputflag=false
                this.$toast.toast('发送成功，静候佳音')
            })
        },
        getauthinfo(){
                    var mydata =JSON.parse(localStorage.getItem('wqbytoken'))
                    //   this.info = mydata
                    this.$http.query(mydata.id).then(res=>{
                        this.info = JSON.parse(res.data.jsonmap)
                        if(this.info.loverarr){
                            this.centerlist[0].num = this.info.loverarr.length
                            this.$Bus.$emit('showtabnum','我的',this.centerlist[0].num)
                        }
                        if(this.info.cflist){
                            this.centerlist[2].num = this.info.cflist.length
                            this.$Bus.$emit('showtabnum','我的',this.centerlist[2].num)
                        }
                        if(this.info.loverid){
                            this.$http.query(this.info.loverid).then(res=>{
                                this.bindlove.loverinfo = JSON.parse(res.data.jsonmap)
                            })
                        }
                    })
                },
        goto(e){
                switch(e){
                    case 0 :
                        this.$router.push('/myinfo')
                }
            },
        centerfunc(e){
            switch(e){
                case 0:
                    if(this.info.loverid){
                        this.bindlove.loveshow=true
                        break
                    }
                    if(this.info.loverarr){
                        if(this.info.loverarr.length>0){
                            this.bindlove.applyflag=true
                        }
                        else{
                            this.bindlove.flag=true
                        }
                    }
                    else{
                        this.bindlove.flag=true
                    }
                    break
                case 1:
                    this.$router.push('/messagetalk')
                    break
                case 2:
                    this.cflist.flag=true
                    break
                case 3:
                    
                    this.lovecflist.flag=true
                    break
                case 5:
                    this.$router.push('/mymusic')
                    break
                case 6:
                    this.$router.push('/mygame')
                    break
            }
        },
        checkmylove(){
            var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
            this.$http.query(mydata.id).then(res=>{
                var obj = JSON.parse(res.data.jsonmap)
                if(obj.loverid){
                    this.$http.query(obj.loverid).then(ress=>{
                        var objs = JSON.parse(ress.data.jsonmap)
                        this.loveinfos =  objs
                    })
                }
            })
        },
        bottomfunc(e){
            switch(e){
                case 0:
                    break
                case 1:
                    this.zux=true
            }
        },
        zuxiao(){
                localStorage.removeItem("wqbytoken")
                this.$router.push('/')
        },
        tobindlove(){
            this.bindlove.flag=false
            this.bindlove.inputflag=true
        },
        makechoose(bool,item){
            this.bindlove.handle.flag=true
            this.bindlove.handle.handleflag=bool
            this.bindlove.handle.item=item
            if(bool){
                 this.bindlove.handle.info=['您仅能与一位用户绑定','确认是否接受'+item.authname+'的申请']
            }
            else{
                 this.bindlove.handle.info=['您将拒绝'+item.authname+'的申请','是否继续？']
            }
        },
        cfchoose(bool,item,index,who){
            if(who){
                this.lovecflist.cflag=true
                this.lovecflist.handleflag=bool
                this.lovecflist.index=index
                if(bool){
                     this.lovecflist.list=['是否将ta的该惩罚改为完成状态：',item]
                }
                else{
                     this.lovecflist.list=['是否删除ta的惩罚',item]
                }
            }
            else{
                this.cflist.cflag=true
                this.cflist.handleflag=bool
                this.cflist.index=index
                if(bool){
                     this.cflist.list=['是否将该惩罚改为完成状态：',item]
                }
                else{
                     this.cflist.list=['是否删除惩罚',item]
                }
            }
        },
        cfchoose1(bool,item,index,who){
            if(who){
                this.loveiscflist.cflag=true
                this.loveiscflist.handleflag=bool
                this.loveiscflist.index=index
                this.loveiscflist.list=['是否将该惩罚改为未完成状态：',item]
            }
            else{
                this.iscflist.cflag=true
                this.iscflist.handleflag=bool
                this.iscflist.index=index
                this.iscflist.list=['是否将该惩罚改为未完成状态：',item]
            }

        },
        handleiscf(who){
            if(who){
                var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
                this.$http.query(mydata.id).then(res=>{
                        var obj = JSON.parse(res.data.jsonmap)
                        this.$http.query(obj.loverid).then(ress=>{
                            var objs = JSON.parse(ress.data.jsonmap)
                            objs.cflist.push(this.loveinfos.iscflist[this.loveiscflist.index])
                            objs.iscflist.splice(this.loveiscflist.index,1)
                            this.loveinfos = objs
                            this.loveiscflist.cflag=false
                            this.$http.change(obj.loverid,objs,()=>{})
                            this.$toast.toast('选择成功')
                        })
                })
            }
            else{
                var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
                this.$http.query(mydata.id).then(res=>{
                        var objs = JSON.parse(res.data.jsonmap)
                        objs.cflist.push(this.info.iscflist[this.iscflist.index])
                        objs.iscflist.splice(this.iscflist.index,1)
                        this.info = objs
                        this.iscflist.cflag=false
                        this.$http.change(mydata.id,objs,()=>{})
                        this.$toast.toast('选择成功')
                        this.centerlist[2].num=objs.cflist.length
                        this.$Bus.$emit('showtabnum','我的',this.centerlist[2].num)
                })
            }
            
        },
        handlefunc(){
            var mydata = JSON.parse(localStorage.getItem('wqbytoken'))
            this.bindlove.handle.flag=false
            
            if(this.bindlove.handle.handleflag){
                this.$http.query(mydata.id).then(res=>{
                    var obj = JSON.parse(res.data.jsonmap)
                    obj.loverarr=[]
                    this.$set(obj,'loverid',this.bindlove.handle.item.id)
                    this.$set(obj,'lovertime',new Date().getTime())
                    this.$http.change(mydata.id,obj,()=>{
                        this.getauthinfo()
                        this.$toast.toast('绑定成功')
                    })
                    this.$http.query(200816).then((res)=>{
                        var dataobj = JSON.parse(res.data.jsonmap)
                        var itemobj = dataobj[mydata.username]
                        var itemobj1 = dataobj[ this.bindlove.handle.item.username]
                        this.$set(itemobj,'loverid',this.bindlove.handle.item.id)
                        this.$set(itemobj1,'loverid',mydata.id)
                        dataobj[mydata.username]=itemobj
                        dataobj[this.bindlove.handle.item.username]=itemobj1
                        this.$http.change(200816,dataobj,()=>{})
                })
                })
                this.$http.query(this.bindlove.handle.item.id).then(res=>{
                    var objs = JSON.parse(res.data.jsonmap)
                    objs.loverarr=[]
                    this.$set(objs,'loverid',mydata.id)
                    this.$set(objs,'lovertime',new Date().getTime())
                    this.$http.change(this.bindlove.handle.item.id,objs)
                })
            }
            else{
                this.$http.query(mydata.id).then(res=>{
                    var obj = JSON.parse(res.data.jsonmap)
                    for(var i=0;i<=obj.loverarr.length-1;i++){
                        if(obj.loverarr[i].authname==this.bindlove.handle.item.authname){
                            obj.loverarr.splice(i,1)
                        }
                    }
                    this.$http.change(mydata.id,obj,()=>{
                        this.getauthinfo()
                        this.$toast.toast('已拒绝')
                    })
                })

            }
            
        },
        handlecf(who){
            if(who){
                    var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
                    if(this.lovecflist.handleflag){
                        this.$http.query(mydata.id).then(res=>{
                            var obj = JSON.parse(res.data.jsonmap)
                            this.$http.query(obj.loverid).then(ress=>{
                                var objs = JSON.parse(ress.data.jsonmap)
                                if(objs.iscflist){
                                    objs.iscflist.push(this.loveinfos.cflist[this.lovecflist.index])
                                    objs.cflist.splice(this.lovecflist.index,1)
                                }
                                else{
                                    this.$set(objs,'iscflist',[this.loveinfos.cflist[this.lovecflist.index]])
                                    objs.cflist.splice(this.lovecflist.index,1)
                                }
                                this.loveinfos = objs
                                this.lovecflist.cflag=false
                                this.$http.change(obj.loverid,objs,()=>{})
                                this.$toast.toast('选择成功')
                            })
                    })
                    }
                    else{
                        this.$http.query(mydata.id).then(res=>{
                            var obj = JSON.parse(res.data.jsonmap)
                            this.$http.query(obj.loverid).then(ress=>{
                                var objs = JSON.parse(ress.data.jsonmap)
                                objs.cflist.splice(this.lovecflist.index,1)
                                this.loveinfos = objs
                                this.lovecflist.cflag=false
                                this.$http.change(obj.loverid,objs,()=>{})
                                this.$toast.toast('删除成功')
                            })
                    })
                    }            
            }
            else{
            var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
            if(this.cflist.handleflag){
                this.$http.query(mydata.id).then(res=>{
                    var objs = JSON.parse(res.data.jsonmap)
                    if(objs.iscflist){
                        objs.iscflist.push(this.info.cflist[this.cflist.index])
                        objs.cflist.splice(this.cflist.index,1)
                    }
                    else{
                        this.$set(objs,'iscflist',[this.info.cflist[this.cflist.index]])
                        objs.cflist.splice(this.cflist.index,1)
                    }
                    this.info = objs
                    this.cflist.cflag=false
                    this.$http.change(mydata.id,objs,()=>{})
                    this.$toast.toast('选择成功')
                    this.centerlist[2].num=objs.cflist.length
                    this.$Bus.$emit('showtabnum','我的',this.centerlist[2].num)
            })
            }
            else{
                 this.$http.query(mydata.id).then(res=>{
                    var objs = JSON.parse(res.data.jsonmap)
                    objs.cflist.splice(this.cflist.index,1)
                    this.info = objs
                    this.cflist.cflag=false
                    this.$http.change(mydata.id,objs,()=>{})
                    this.$toast.toast('删除成功')
            })
            }
            }
        },
        gotolink(e){
            switch(e){
                case 0:
                    this.$router.push('/publish')
                 break
                case 1:
                    this.$router.push('/lunpan')
                 break
            }
            
        },
        dellove(e){
            var mydata = JSON.parse(localStorage.getItem('wqbytoken'))
            switch(e){
                case 0:
                    this.bindlove.delloveflag=true
                    break
                case 1:
                    // this.$toast.toast('等待对方同意')
                    // this.bindlove.delloveflag=false
                    // this.$http.query(20000).then(res=>{
                    //     if(res.data.jsonmap){
                    //         var obj = JSON.parse(res.data.jsonmap)
                            
                    //     }
                    //     else{
                    //         var obj = {}
                    //         var arr =[{
                    //             sentid:mydata.id,//发送人
                    //             sentauthname:mydata.authname,
                    //             sex:mydata.sex,
                    //             faceimg:mydata.faceimg,
                    //             info:'',
                    //             type:'dellove'
                    //         }]
                    //         this.$http.query(mydata.id).then(res=>{
                    //             this.$set(obj,'',[])
                    //         })
                    //     }

                    // })
                    
                 this.$http.query(mydata.id).then(res=>{
                    var obj = JSON.parse(res.data.jsonmap)
                    var loveid = obj.loverid
                    this.$http.query(loveid).then(res=>{
                         var sobj = JSON.parse(res.data.jsonmap)
                        sobj.loverarr=[]
                        this.$set(sobj,'loverid','')
                        this.$set(sobj,'lovertime','')
                        this.$http.change(obj.loverid,sobj,()=>{})
                        obj.loverarr=[]
                        this.$set(obj,'loverid','')
                        this.$set(obj,'lovertime','')
                        this.$http.change(mydata.id,obj,()=>{
                        this.getauthinfo()
                        this.$toast.toast('解除绑定成功')
                    })
                    })
                    this.$http.query(200816).then((res)=>{
                        var dataobj = JSON.parse(res.data.jsonmap)
                        var itemobj = dataobj[mydata.username] 
                        this.$set(itemobj,'loverid','')
                        dataobj[mydata.username]=itemobj
                        this.$http.change(200816,dataobj,()=>{})
                })
                })

                    break
            }
        },
        choosefinsh(bool,who){
            if(who){
                this.lovecflist.tabact=bool
            }
            else{
                this.cflist.tabact=bool
            }
        },
        tofinsh(){
            
        },
  }

}
</script>

<style lang="scss" scoped>
.body{
background: #f8f3f7;
}
.mybox{
width: 100vw;
height: calc(100vh - 110px);
overflow: scroll;
position: relative;
// background: #fff;
margin-top: 55px;
}
.topbox{
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    padding-left: 20px;
    height: 80px;
    background: #fff;
    border-bottom: 1px solid #f7f7f7;
    letter-spacing: 1px;
    .authimg{
        height: 60px;
        width:60px;
        border: solid 1px #e5e5e5;
        border-radius: 30px;
        overflow: hidden;
    }
    .authmessage{
        width: 240px;
        height: 50px;
        text-align: start;
        padding-left: 20px;
        padding-top: 5px;
        font-size: 16px;
        .authname{
        height: 24px;
        line-height: 24px;
         display: flex;
        font-weight: 600;
        color: #feb208;
        }
        .more{
            font-size: 13px;
            margin-top: 10px;
        }
    }
}
.centerbox{
    margin-top: 10px;
    background: #fff;
    font-size: 13px;
    position: relative;
    .shownum{
        width: 17px;
        height: 17px;
        line-height: 19px;
        font-size: 12px;
        background: red;
        color: #fff;
        text-align: center;
        margin: 15px;
        border-radius: 10px;
    }
    .box{
        display: flex;
        justify-content: space-between;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px #efefef solid;
        padding: 5px;
        color: #707070;
    }
}
.bottombox{
    margin-top: 10px;
    font-size: 13px;
    .box{
        background: #fff;
        text-align: center;
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px #efefef solid;
        padding: 5px;
    }
}
.tc{
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
    .bottom{
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;
        .item{
            width: 50%;
            border-top: solid 1px #e5e5e5;
        }
    }
}
.inputtc{
    width: 300px;
    height: 250px;
    position: fixed;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
    background: #fff;
    border: solid 1px #e5e5e5;
    border-radius: 15px;
    input{
        padding: 5px;
        width: 200px;
        border-radius: 5px;
        border: solid 1px #e5e5e5;
    }
    input::placeholder{
        color:#515151;
    }
    textarea::placeholder{
        color:#515151;
    }
    textarea{
        padding: 5px;
        width: 200px;
        border-radius: 5px;
        border: solid 1px #e5e5e5;
    };
    .bottom{
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;
        .item{
            color: #515151;
            width: 50%;
            border-top: solid 1px #e5e5e5;
        }
    } 
}
.applytc{
    width: 350px;
    height: 300px;
    padding-top: 25px;
    position: fixed;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
    background: #fff;
    border: solid 1px #e5e5e5;
    border-radius: 15px;
    .applybox{
        width: 350px;
        height: 260px;
        overflow: scroll;
    .lovesay{
        text-align: start;
        color:  #565656;
        font-size: 12px;
        padding-left: 10px;
        height: 20px;
        line-height: 20px;
    }
    .items{
        display: flex;
        width: 80%;
        margin: 10px auto;
        padding: 15px;
        border-radius: 5px;
        border: 1px solid #e5e5e5;
        .faceimg{
            border: 1px solid #e5e5e5;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            overflow: hidden;
        }
    }
    }
    .bottom{
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;
        .item{
            color: #515151;
            width: 100%;
            border-top: solid 1px #e5e5e5;
        }
    }    
}
.cftc{
    width: 350px;
    height: 500px;
    // padding-top: 25px;
    position: fixed;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
    background: #fff;
    border: solid 1px #e5e5e5;
    border-radius: 15px;
    .tab{
        display: flex;
        justify-content: space-between;
        .tabitem{
            width: 50%;
            text-align: center;
            height: 30px;
        }
        .tabact{
            border-bottom: 2px #feb208 solid;
        }
    }
    .applybox{
        width: 350px;
        height: 380px;
        overflow: scroll;
    .lovesay{
        text-align: start;
        color:  #565656;
        font-size: 12px;
        padding-left: 10px;
        height: 20px;
        line-height: 20px;
    }
    .items{
        display: flex;
        width: 80%;
        margin: 10px auto;
        padding: 15px;
        border-radius: 5px;
        border: 1px solid #e5e5e5;
        .faceimg{
            border: 1px solid #e5e5e5;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            overflow: hidden;
        }
    }
    }
    .bottom{
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;
        .item{
            color: #515151;
            width: 100%;
            border-top: solid 1px #e5e5e5;
        }
    }    
}
.loveshow{
    width: 300px;
    height: 250px;
    position: fixed;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
    background: #fff;
    border: solid 1px #e5e5e5;
    border-radius: 15px;
    .items{
        width: 100%;
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        display: flex;
        justify-content: center;
    }
    .bottom{
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;
        .item{
            color: #515151;
            width: 50%;
            border-top: solid 1px #e5e5e5;
        }
    } 
}
</style>
