<template>
<div class="body" id="body">
<div>
<div class="title">{{title}}</div>
<div class="titleb" >{{chengfa}}</div>
<div class="charts" >
  <div class="bg" :class="flag?'torote':''" id="main" ref="mains">
  </div>
</div>
<div class="titles" ><img src="../../assets/img/zhizhen.png" alt="" style="width:40px;height:40px;transform: rotate(90deg);"></div>
<div @click="start" class="open">开始</div>
<div @click="isedit" class="edit">编辑</div>
</div>

<div class="editcom" v-if="eleoption.edit" :class="eleoption.editflag?'closeeditcom':''">
    <div v-for="(item,index) in datalist" :key="index" style="margin-top:10px">
        <el-input v-model="datalist[index].name" placeholder="请输入内容" style="width: 80%;"></el-input>
    </div>
     <div style="margin-top:15px;width: 100%;display:flex;justify-content: space-between;">
            <div style="width: 80px;height: 30px;border:1px #fff solid;border-radius: 15px;line-height:30px;color:#fff;margin-left:50px;text-align: center;" class="ok" @click="saveedit(true)">保存</div>
            <div style="width: 80px;height: 30px;border:1px #fff solid;border-radius: 15px;line-height:30px;color:#fff;margin-right:50px;text-align: center;" class='cancle' @click="saveedit(false)">取消</div>
     </div>
</div>
<div class="editcom" v-if="opencfjl" @click="closecgjl(false)" :class="opencfjlflag?'closeeditcom':''">
    <div v-for="(item,index) of buypeople" :key="index">
        <p style="color:#fff" v-if="index!=buypeople.length-1">{{item}}</p>
    </div>
</div>
<div class="cover"></div>
    <div class="news">
    <div class="line-box" @click="opencfjl=true;opencfjlflag=false">
    <div class="line-scroll">
        <div class="line" v-for="(item,index) in buypeople" :key="index">{{item}}</div>
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
        //   title:'',
        //   chengfa:'',
        opencfjl:false,
        opencfjlflag:false,
        bglist:[
            //   '#f298e7','#a5f9f9',
            //   '#d481ff','#05f1e1',
              '#ab64f6','#61dbf7',
        ],
        title:'如何让我可爱的宝贝不生气',
        chengfa:'挨宝贝一顿打',
        colorList:['#f8e4bb','#ceddf8','#d2f4d4','#d7cef5','#eed9f8','#d7f1ee','#ece0de','#e7f3c3','#f8dfd2','#f8d4dc'],
        option : {
            color: ['#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
            '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0',
            '#1e90ff','#ff6347','#7b68ee','#00fa9a','#ffd700',
            '#6699FF','#ff6666','#3cb371','#b8860b','#30e0e0'],
            title: {
                // text: '怎么惩罚小可爱—WWQ',
                //  x: 'center',
                //  y:'top'
            },
            tooltip: {},
            legend: {
                show:false,
            },
            xAxis: {
                show:false
            },
            yAxis: {
                show:false
            },
            series: [{
                name: '怎么原谅男朋友',
                type: 'pie',
                // avoidLabelOverlap: true,
                data: [                
                {
                    value : 10,
                    name : '挨宝贝一顿打',
                    label: {
                        rotate:0
                    }

                },
                {
                    value : 10,
                    name : '写道歉小作文',
                    label: {
                        rotate:0
                    }
                },
                {
                    value : 10,
                    name : '送宝贝想要的东西',
                    label: {
                        rotate:0
                    }
                },
                {
                    value : 10,
                    name : '喂宝贝吃想吃的',
                    label: {
                        rotate:0
                    }
                },
                {
                    value : 10,
                    name : '夸宝贝20个词不重复',
                    label: {
                        rotate:0
                    }
                },
                {
                    value : 10,
                    name : '给宝贝买口红',
                    label: {
                        rotate:0
                    }
                },
                {
                    value : 10,
                    name : '让宝贝亲五分钟',
                    label: {
                        rotate:0
                    }
                },
                {
                    value : 10,
                    name : '写520个我爱你',
                    label: {
                        rotate:0
                    }
                },
                {
                    value : 10,
                    name : '帮宝贝按摩',
                    label: {
                        rotate:0
                    }
                },
                {
                    value : 10,
                    name : '帮宝贝洗澡',
                    label: {
                        rotate:0
                    }
                },
                ],
                  label: {
                    normal: {
                       position: 'inside',
                       show : true,
                       rotate:true
                    }
                  },
            }],
            pie:{
                center : ['50%', '50%'],
            },
                axisTick: {            // 坐标轴小标记
                    show: false,       // 属性show控制显示与否，默认不显示
                    interval: 'auto',
                    // onGap: null,
                    inside : false,    // 控制小标记是否在grid里 
                    length :5,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: '#333',
                        width: 1
                    }
                },
        },
        eleoption:{
            edit:false,
            editflag:false,
        },
        flag:false,
        rotate:0,
        datalist:[],
      buypeople: [
        "WWQ 转到了让你跪榴莲",
        "WWQ 转到了让你跪榴莲2",
        "WWQ 转到了让你跪榴莲",
      ],
      }
  },
  mounted(){
      this.changebgcolor()

      this.$http.query(2).then(res=>{
          this.buypeople = JSON.parse(res.data.jsonmap)
          this.buypeople.push(this.buypeople[0])
          this.beginRollWordFunc()
      })   
      this.$http.query(1).then(res=>{
          if(res.data.jsonmap){
              this.option.series[0].data=JSON.parse(res.data.jsonmap)
          }
              this.getpie()
      })
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
      getpie(){
      var myChart = echarts.init(document.getElementById('main'));
      var length = this.option.series[0].data.length
      var dig =Math.floor(360/length)
      var num = Math.floor(90/dig)
      for(var item of this.option.series[0].data){
          item.value=dig
          item.label.rotate=(num*dig)
          num -=1          
      }
      myChart.setOption(this.option)
      },
      start(){``
        var oTurntable = document.querySelector('#main');
        var flag =true
        var deg = 1800
        var speed =2
        var time= new Date().getTime()
        var date = new Date(time)
        var start = date.getSeconds()
        var now
        var k=36
        for(var i =1000;i<=5000;i=i+50){
            setTimeout(()=>{
                if(k<=0.5){
                    k-=0.05
                    if(k<=0){
                        k=0.02
                    }
                }
                else{
                    k-=0.5
                }
            },i)
        }
        var timeull =setInterval(() => {
            now = new Date(new Date().getTime()).getSeconds()
            if(start<54&&start+6==now){
                    clearInterval(timeull)
                    flag=false
                    this.$toast.comfirm('您选到了'+this.chengfa,'快去惩罚他吧~',()=>{this.sureFunc()},()=>{this.start()},'选择惩罚','重来一次')
                    return
            }
            else if(start>=54&&now+start==60){
                    clearInterval(timeull)
                    flag=false
                    this.$toast.comfirm('您选到了'+this.chengfa,'快去惩罚他吧~',()=>{this.sureFunc()},()=>{this.start()},'选择惩罚','重来一次')
                    return
            }
            if(flag){
                this.rotate+=k
                oTurntable.style.webkitTransform = 'rotate(' + this.rotate + 'deg) ';
                this.show()
            }
          }, speed);
      },
    show(){
        var shows=Math.ceil(this.rotate%360);
        var length = this.option.series[0].data.length-1
        var dig =360/length
        var num = Math.floor(shows/dig)
        this.chengfa=this.option.series[0].data[shows>=342||shows<=18?0:length-num].name
    },
closeDialogFunc(){

},
sureFunc(){
    this.$toast.toast('选择成功')
    var arr = []
    var mydata = JSON.parse(localStorage.getItem('wqbytoken'))
    this.$http.query(2).then(res=>{
        if(res.data.jsonmap){
            arr = JSON.parse(res.data.jsonmap)
        }
        else{
            arr= []
        }
        arr.unshift(mydata.authname+'选择了'+this.chengfa)
            this.$http.change(2,arr,()=>{
            this.$http.query(2).then(res=>{
                this.buypeople = JSON.parse(res.data.jsonmap)
                this.buypeople.push(this.buypeople[0])
                 })   
            })  

    this.$http.query(mydata.id).then(res=>{
        var obj = JSON.parse(res.data.jsonmap)
        var id = obj.loverid
        this.$http.query(id).then(res=>{
            var objs = JSON.parse(res.data.jsonmap)
            if(objs.cflist){
                objs.cflist.push(mydata.authname+'选择惩罚你：'+this.chengfa)
            }
            else{
                this.$set(objs,'cflist',[])
            }
            this.$http.change(id,objs,()=>{})
        })
    })
    })
},
choosecolor(){
    
},
closecgjl(){
    this.opencfjlflag=true
    setTimeout(()=>{
            this.opencfjl=false
            this.opencfjlflag=false
    },450)
},
isedit(){
    this.datalist=this.decopy(this.option.series[0].data)
    
    this.eleoption.edit=true;
    this.eleoption.editflag=false
},
saveedit(bool){
    this.eleoption.editflag=true
    if(!bool){
        setTimeout(()=>{
            this.eleoption.edit=false
            this.opencfjl=false
        },450)
        return
    }
    var myChart = echarts.init(document.getElementById('main'));
    this.option.series[0].data=this.datalist
     myChart.setOption(this.option)
    setTimeout(()=>{
            this.$http.delete(1).then(res=>{          
                this.$http.add(1,this.datalist).then(res=>{
                this.$toast.toast('保存成功')
                })
            })
            this.eleoption.edit=false 
    },450)
},
    decopy(obj){
    let _tmp = JSON.stringify(obj);//将对象转换为json字符串形式
    let result = JSON.parse(_tmp);//将转换而来的字符串转换为原生js对象
    return result;
    },
      beginRollWordFunc() { //滚动文本动画
      let length = this.buypeople.length;
      let index = 1, lineScroll = document.querySelector('.line-scroll');
      lineScroll.style.top = -39 * index + 'px';
      var b=setInterval(() => {
        if (index + 1 >= length) {
          index = 0;
          lineScroll.style.transition = 'none';
        } else {
          index += 1;
          lineScroll.style.transition = 'top 1.5s linear';
        }
        lineScroll.style.top = -39 * index + 'px';
      }, 2500)
    },
  }
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
.title{
position: absolute;
top: 50px;
width: 100%;
color: #fff;
text-align: center;
}
.titleb{
position: absolute;
top: 150px;
width: 100%;
text-align: center;
color: #fff;
}
.titles{
position: absolute;
top: 50%;
left: 50%;
width: 40px;
text-align: center;
z-index: 99;
transform: translate(-50%,-50%);
padding-bottom: 20px;
}
.charts{
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%) rotate(-18deg);
    z-index: 9;
    }
.bg{
    width: 100%;
    height: 400px;
    
}
.torote{
    animation:changDeg 4s;
    
}
@keyframes changDeg{
            0%{
                    transform: rotate(0deg);
        }

        100%{
                    transform: rotate(1800deg);
        }
}
.open{
    position:absolute;
    top:75%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
    width: 250px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    border-radius: 15px;
    border: #fff 1px solid;
}
.edit{
    position:absolute;
    top:83%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
    width: 250px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    border-radius: 15px;
    border: #fff 1px solid;
}
   .diaolog-box { 
        position: absolute;
        border-radius: 5px;
        box-shadow: 0px 3px 5px 0px rgba(180,180,189,0.25);
        top: 30px;
        left: 80px;
        width: 220px;
        height: auto;
        z-index: 999;
        background: #fff;
    }
        .diaolog-ul-box {
            display: flex;
            flex-wrap: wrap;
            position: relative;
            padding: 20px;
            padding-bottom: 30px;
            
        }
            .close-icon {
                cursor: pointer;
                position: absolute;
                top: 8px;
                right: 10px;
            }
            li {
                width: 25px;
                height: 25px;
                text-align: center;
                cursor: pointer;
                margin-right: 15px;
                margin-top: 10px;
                list-style: none;

            }
            .li-active {
                box-shadow: 0px 3px 5px 0px rgba(180,180,189,0.25);
            }
            .sure-btn {
                position: absolute;
                padding: 5px 10px;
                background-color: #ff8833;
                color: #fff;
                cursor: pointer;
                height: 16px;
                line-height: 16px;
                border-radius: 3px;
                bottom: 10px;
                right: 15px;
             
            }
.editcom::-webkit-scrollbar {  //chrome 和Safari，电脑端微信浏览器
    width: 0 !important;
    height: 0 !important; //这样在电脑端微信浏览器横向滚动会无效。不加!important则可
}
.editcom{
    width: 80vw;
    height: 70vh;
    overflow: scroll;
    border: 1px solid;
    border-color: #fff;
    box-shadow: 0 0 15px #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-image:linear-gradient(bottom,#ab64f6,#61dbf7);
    z-index: 99;
    padding-top:20px;
    border-radius: 15px;
    animation: upgro 0.5s ;
    .editcom_close{
        width: 100%;
        height: 10px;
    }
    >>>.el-input__inner{
        border-radius: 15px;
        background: transparent;
        color: #fff;
    }
    >>>.el-input__inner:focus{
        border: 1px solid;
        border-color: #fff;
        box-shadow: 0 0 15px #fff;
        // background: red;
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
.cover{
    width: 100%;
    height: 300px;
    position:absolute;
    top: 250px;
    z-index: 99;
}.news {
  background: rgba(0, 0, 0, 0.4);
  width: 320px;
  height: 1.5em;
  line-height: 1.5em;
  color: white;
  text-align: center;
  border-radius: 20px;
  position: absolute;
  top: 220px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  overflow: hidden;
}
.line-box {
  width: 320px;
  height: 1.5em;
  line-height: 1.5em;
  color: white;
  text-align: center;
  position: absolute;
  font-size: 15px;
  .line-scroll {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    transition: all 1.5s linear;
  }
  .line {
    height: 39px;
  }
}
</style>
