<template>
<div class="pyq">
<div v-for="(item,index) in datalist" class="pyqmessage">
    <div style="display:flex" >
    <div class="pyqface">
        <img :src="item.authimg||require('../../assets/img/faceicon/face1.png')" alt="" style="width:40px;height:40px">
    </div>
    <div style="width:100%">
    <div class="authname">{{item.authname||name}}<div style="margin-left:10px;margin-top:2px"><img :src="item.sex=='男'?require('../../assets/img/m.png'):require('../../assets/img/wm.png')" alt="" style="width:15px;margin-top:4px"></div></div>
    <div class="info">{{item.info}}</div>
    <div class="info" style="margin-top:15px;" v-if="item.img"><img :src="item.img" alt="" style="width:200px;height:auto"></div>
    <div class="edit">
        <div style="font-size: 15px;margin-left:15px;color:rgb(90 90 90);margin-top:10px">{{item.creattime|timeFilter}}</div>
        <div style="display:flex;margin-top:10px">
            <div style="display:flex;font-size:12px" v-if="name==item.authname">
                <div style="font-size:12px;color:#007aff;text-decoration: underline;margin-right:5px" >删除</div>
                <img :src="item.islove?require('../../assets/img/isview.png'):require('../../assets/img/noview.png')" alt="" style="width:20px;height:20px">
                <div style="margin-left:5px;height:20px;line-height:20px">{{item.islove?"  对方已读":"  对方未读"}}</div>
            </div>
            <div><img src="../../assets/img/i_pl.png" alt="" style="width:20px;height:20px;margin-right:15px;margin-left:15px"></div>
        </div>
    </div>
    <div class="pinlun" style="margin-bottom:15px;width:100%">
        <div v-for="(items, indexs) in item.comment" :key="indexs">
            <div class="pllist"><span style="color: #5998de">{{items.replyname}}</span><span v-if="items.bereplyname"> 回复 <span style="color: #5998de">{{items.bereplyname}}</span></span> : {{items.info}}</div>
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

                    <span class="sure_btn">确定</span>
                    <span class="cancle_btn">取消</span>
                    <div
                        class="search_fabulous"
                        style="margin-left:30px;margin-top:15px;float:left;"
                    >
                        <img
                            src="../../assets/img/pyq/ft_icon_0014.png"
                            style="width:25px;height:30px;"
                        />
                        <input
                            class="pa"
                            id="fileToUpload"
                            type="file"
                            style="opacity:0;width:50px;height:50px;top:10px;left:20px;"
                        />
                    </div>
                    <div
                        style="padding:20px 30px 0 25px;float:left;margin-top:14px;"
                        v-if="comimglist"
                    >
                        <p
                            class="pr dis_il"
                            style="width:60px;height:60px;margin:5px;margin-right:20px;"
                            v-for="(item,index) in comimglist"
                            :key="item"
                        >
                            <img :src="item" class="img_cover"/>
                            <span
                                class="dis_il pa"
                                style="top:-10px;right:-10px;width:30px;height:30px;border-radius:50%;background:rgb(249, 142, 2);"
                            ></span>
                            <img
                                src="../../assets/img/pyq/up_delete_white.png"
                                class="pa"
                                style="width:10px;height:10px;top:0px;right:0px;"
                               
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
<!-- 确认删除 -->
<div class="tcs" v-if="delflag">
    <div style="margin-top:15px">确定删除吗？</div>
    <div>对方会很难过的哦~</div>
    <div class="bottomd">
        <div class="itemd">取消</div>
        <div class="itemd" style="border-left:1px solid #e5e5e5">确认</div>
    </div>
</div>
</div>
</template>

<script>
export default {
  filters:{
              timeFilter(timestamp){
            function zeroize( num ) {
                return (String(num).length == 1 ? '0' : '') + num;
            }

            var curTimestamp = parseInt(new Date().getTime()); //当前时间戳
            var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

            var curDate = new Date( curTimestamp ); // 当前时间日期对象
            var tmDate = new Date( timestamp );  // 参数时间戳转换成的日期对象

            var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
            var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

            if ( timestampDiff < 60 ) { // 一分钟以内
                return "刚刚";
            } else if( timestampDiff < 3600 ) { // 一小时前之内
                return Math.floor( timestampDiff / 60 ) + "分钟前";
            } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
                return '今天' + zeroize(H) + ':' + zeroize(i);
            } else {
                var newDate = new Date( (curTimestamp - 86400) ); // 参数中的时间戳加一天转换成的日期对象
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
          delflag:false,
          delnum:0,
          name:'',
          datalist:[
        //     { authimg:require('../../assets/img/faceicon/face1.png'),
        //       authname:'测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
        //       info:'亲吻一下岁月真好，暮春时节，我徜徉在一片桃的树下。曲径通幽，路的尽头是一派苍茫的',
        //       img:require('../../assets/img/bannerimg/banner5.jpg'),
        //       creattime:'2020-12-4',
        //       islove:false,
        //       comment:[
        //       {
        //         replyname:'wangweiqiang',
        //         info:'暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"',
        //       },
        //       {
        //         replyname:'wangweiqiang',
        //         info:'暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"',
        //         bereplyname:'wbiyi',
        //       },
        //       {
        //         replyname:'wangweiqiang',
        //         info:'暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"',
        //         bereplyname:'wbiyi',
        //       },
        //   ],
        //       sex:"女"
        //       },
        //     {authimg:require('../../assets/img/faceicon/face2.png'),
        //       authname:'测试2',
        //       info:'一直以来，总有一个奢侈的念头；若有那么一天，于红尘深处一个僻静的山区，搭一个草庐，悄悄隐于闹市之中，而我，在那儿为“百年修得同船渡，千年修得共枕眠”弥补今生的不足，希望像一个僧尼，修一身的清寂，在那儿只为等你，等你从红尘归来，为你拂去漂泊的尘土。',
        //       img:require('../../assets/img/bannerimg/banner5.jpg'),
        //       creattime:'2020-12-4',
        //       islove:false,
        //       comment:[
        //       {
        //         replyname:'wangweiqiang',
        //         info:'暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"',
        //       },
        //       {
        //         replyname:'wangweiqiang',
        //         info:'暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"',
        //         bereplyname:'wbiyi',
        //       },
        //       {
        //         replyname:'wangweiqiang',
        //         info:'暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"',
        //         bereplyname:'wbiyi',
        //       },
        //   ],},
        //     {authimg:require('../../assets/img/faceicon/face3.png'),
        //       authname:'测试2',
        //       info:'在这红尘里，我渴望陪你变老，不求一路轰轰烈烈，只愿一世倾心，像山野花儿把最后的生命情葬在秋天，因为你为梦想去漂泊，去了遥远的他乡，我后悔没有与你同行，致使离我而去，你知道我喜欢家乡的宁静，喜欢云的淡然恬静，喜欢山色的空蒙幽深，我喜欢握那一只短笛，诉说心中忧郁，想想走过的人生路，曾经说过相伴一生的你，如今去了南方，那些曾经许下的诺言，早已风吹云散。曾经的温暖，美好的记忆，也许只是一个转身的距离，让我在红尘中等你，今生是如何的结局。',
        //       img:require('../../assets/img/bannerimg/banner2.jpg'),
        //       creattime:'2020-12-4',
        //       islove:false,
        //       comment:[
        //       {
        //         replyname:'wangweiqiang',
        //         info:'暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"',
        //       },
        //       {
        //         replyname:'wangweiqiang',
        //         info:'暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"',
        //         bereplyname:'wbiyi',
        //       },
        //       {
        //         replyname:'wangweiqiang',
        //         info:'暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"暂未支持评论图片，敬请期待"',
        //         bereplyname:'wbiyi',
        //       },
        //   ],
        //       sex:"男"},
        //     {authimg:require('../../assets/img/faceicon/face8.png'),
        //       authname:'测试2',
        //       info:'　为何光阴，总是一去不返，曾经再美，也只能回味，花开花谢，云卷云舒，为何人生，从来都是一半忧伤，一半明媚，无论圆满还是缺憾，我依然在红尘中等你，与你相伴晨起晚息，只愿与你一世尘缘！',
        //       img:require('../../assets/img/bannerimg/banner1.jpg'),
        //       creattime:'2020-12-4',
        //       islove:false,
        //       comment:'',},
        //     {authimg:require('../../assets/img/faceicon/face5.png'),
        //       authname:'测试2',
        //       info:'如若能在红尘中等你重逢相见，我愿把生命的全部为您奉献，今生情缘，今世所盼，在喧嚣红尘间，我会化作健康、祝福、真情和爱围绕在您身边，愿你从些不再孤单，想想原来，看看现在，也许你变了，再也不会像以前那样爱我，再也不能像以前那样肆无忌惮的撒娇。',
        //       img:require('../../assets/img/bannerimg/banner3.jpg'),
        //       creattime:'2020-12-4',
        //       islove:false,
        //       comment:'',},
        //     {authimg:require('../../assets/img/faceicon/face6.png'),
        //       authname:'测试2',
        //       info:'以前，我常常问我自己，活着是为了什么？为什么而活着？后来，我遇到了你，你的出现是我的世界里最开心的日子，给我关怀和快乐，给我真情及温柔，如今留下我一个人默默回忆。我不知道为什么现在最大愿望是等你回来，因为，在过去的时光里，我们一起笑过，一起闹过，一起分担过，一起悲伤过，而现在呢？现在的我们，有了距离，相隔千里。',
        //       img:require('../../assets/img/bannerimg/banner4.jpg'),
        //       creattime:'2020-12-4',
        //       islove:false,
        //       comment:'',},
        //     {authimg:require('../../assets/img/faceicon/face7.png'),
        //       authname:'测试2',
        //       info:'我常常去那我们常去树下，双手环抱膝盖而坐，然后看看星空，望望灯火。你的身影像千万根莫名思绪，牢牢捆住我，让我不管在哪里，都抛不开，挥不去的渴盼，茶饭不思，夜不成眠，笑里泪里，杯中碗里，都有你的影子，你的一颦一笑，一言一行，一个眼神都在记忆里反复跳动，剪不断，理还乱……随即又化作瞬间灿烂的烟火消失，曾有一段时间，我居然讨厌我自己，还活着干什么',
        //       img:require('../../assets/img/bannerimg/banner5.jpg'),
        //       creattime:'2020-12-4',
        //       islove:false,
        //       comment:'',},
          ],
          comment_input:false,
          replies:'',
          plflag:false,
          comimglist:[
            //   require('../../assets/img/faceicon/face1.png')
          ],
          
          flagnum:0,
          plobj:{},
          isreplay:false,
      }
  },
  mounted(){
      this.name = JSON.parse(localStorage.getItem('wqbytoken')).authname
      this.checklist()
  },
  methods:{
      checklist(){
      this.$http.query(9999).then(res=>{
          if(res.data.jsonmap){
              var list = JSON.parse(res.data.jsonmap)
              this.datalist= list.concat(this.datalist)
          }
      })
      },
     
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
    display: flex;
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
    padding-left: 15px;
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
    padding-top: 10px;
    padding-left: 15px;
    padding-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:wrap;
    min-width: calc(100% - 20px);
}
.edit{
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 10px;
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
}
.comment_input .com_inputBox {
    position: absolute;
    top: 0px;
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
</style>
