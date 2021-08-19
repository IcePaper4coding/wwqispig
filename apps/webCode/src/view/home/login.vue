<template>
<div class="body" id="body">
    <div style="position: relative;margin-top: 50%;">
        <p class="pcome">Welcome</p>
    </div>
<div class="input">
    <input type="text" class="inputitems" placeholder="账号" v-model="info.username" >
</div>
<div class="input">
    <input type="password" class="inputitems" placeholder="密码" v-model="info.password">
</div>
<div class="button">
    <div class="loginin" id="loginin" @click="login">Login</div>
</div>
<div class="tips">
    <p><span @click.stop="opentoast(0)">忘记密码？</span>| <span @click.stop="opentoast(1)">注册账号？</span></p>
</div>
<div class="closeimg"  @click="toclose" v-if="toastswitch.istoast">

</div>
<div :class="toastswitch.flagtoast?'toast aniopen':'toast aniclose'" v-if="toastswitch.istoast">

    <div style="color:#fff;margin-top:15px">{{toastswitch.inputname[swnum].f}}</div>

    <input @focus="worng=false" v-for="(item , index) in toastswitch.inputname[swnum]" :key="index+'w'" :type="index==1||index==2?'password':'text'" class="inputitems" :style="(index==1||index==2)&&worng?'color:red':''" :placeholder="item" v-model="(toastswitch.inputinfo[swnum])[index]">

    <div class="loginin" id="loginin" @click="tosub">{{toastswitch.name[swnum]}}</div>
</div>
</div>
</template>

<script>
export default {
  data(){
      return{
          bglist:[
            //   '#f298e7','#a5f9f9',
              '#d481ff','#05f1e1',
            //   '#ab64f6','#61dbf7',
          ],
          info:{
              username:'',
              password:''
          },
          wordlist:['1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
          swnum:0,
          toastswitch:{
              istoast:false,
              flagtoast:false,
              name:['修改密码','注册账号'],
              inputinfo:[['','','','',''],['','','','','']],
              inputname:[['账号','新密码','确认新密码','绑定邮箱','绑定手机号码'],['注册账号','注册密码','确认密码','绑定邮箱','绑定号码']]
          },
          worng:false
      }
  },
  mounted(){
this.changebgcolor()

this.$http.checklogin(()=>{
    this.$toast.toast('您已登录，即将跳转',800)
    setTimeout(()=>{
        this.$toast.loading('正在跳转',true)
    },800)
    setTimeout(()=>{
        this.$toast.loading('正在跳转',false)
        this.$router.push('/home?id=0')
    },2000)
},()=>{
   
})
// this.$http.query(80001).then(res=>{
//     var obj = JSON.parse(res.data.jsonmap)
//     this.$http.change(80003,obj)
// })
// this.$http.query(200816).then((res)=>{})
// this.$http.delete(200816)
// this.$http.delete(80000)
// this.$http.add(80000,{pnum:80000})
// this.$http.add(200816,{})
// this.$http.add(10002,{})
// this.$http.add(10000,{})
// this.$http.add(70000,{})
  },
  methods:{
      toclose(){
        this.toastswitch.flagtoast=false
        setTimeout(()=>{
            this.toastswitch.istoast=false
        },500)

      },
      changebgcolor(){
            var bglist=[
            //   '#f298e7','#a5f9f9',
              '#d481ff','#05f1e1',
            //   '#ab64f6','#61dbf7',
          ]
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
      login(){
          if(this.info.username==""||this.info.password==''){
              this.$toast.toast('请输入账号、密码')
              return 
          }
        //   this.$toast.loading('正在登陆',true)
          this.$http.query(200816).then((res)=>{
            // this.$toast.loading('正在登陆',false)
            var obj = JSON.parse(res.data.jsonmap)
            if(obj[this.info.username]){
                  if(obj[this.info.username].password==this.info.password){
                      this.$toast.toast('登陆成功',800)
                      var asstoken = ''
                      var num = 0
                      for(var i =0 ;i < 20; i++ ){
                          num = Math.floor(Math.random()*(this.wordlist.length - 1))
                          asstoken+=this.wordlist[num]
                      }
                      this.$http.query(obj[this.info.username].pid).then(res=>{
                          var objss = JSON.parse(res.data.jsonmap)

                         objss.token=asstoken
                      var objs = {}
                      this.$set(objs,'istoken',asstoken)
                      this.$set(objs,'username',this.info.username)
                      this.$set(objs,'phone',obj[this.info.username].phone)
                      this.$set(objs,'email',obj[this.info.username].email)
                      this.$set(objs,'id',obj[this.info.username].pid)
                      this.$set(objs,'authname',objss.authname)
                      this.$set(objs,'sex',objss.sex)
                      this.$set(objs,'faceimg',objss.faceimg)
                      localStorage.removeItem('wqbytoken')
                      localStorage.setItem('wqbytoken',JSON.stringify(objs))
                          this.$http.change(obj[this.info.username].pid,objss,()=>{})
                      })
                      this.$http.query(obj[this.info.username].pid)
                        setTimeout(()=>{
                            this.$toast.loading('正在跳转',true)
                        },1000)
                        setTimeout(()=>{
                            this.$toast.loading('正在跳转',false)
                            this.$router.push('/home?id=0')
                        },2000)
                  }
                  else{
                      this.$toast.toast('账号或密码错误')
                  }
              }
            else{
                this.$toast.toast('账号或密码错误')
              }
          }).catch(()=>{
              this.$toast.toast('系统正在维护，请稍后……',800)
          })
            
      },
      opentoast(e){
        this.swnum=e
        this.toastswitch.istoast=true
        this.toastswitch.flagtoast=true
      },
      tosub(){
            if(this.swnum==0){
               this.xiugai()
            }
            if(this.swnum==1){
                this.zuce()
            }
      },
      zuce(){
          var messagearr = []
          messagearr=this.toastswitch.inputinfo[this.swnum]
          var num = messagearr.indexOf('')
          if(num!=-1){
              this.$toast.toast('请输入'+(this.toastswitch.inputname[this.swnum])[num])
              return
          }
          for (var i=0;i<=messagearr.length-1;i++){
              var minlength=0
              if(i==0){
                  minlength=3
              }
              else if (i==1||i==2){
                  minlength = 4
              }
              if(messagearr[i].length<minlength){
                  this.$toast.toast((this.toastswitch.inputname[this.swnum])[i]+'长度不低于'+minlength)
                  return
              }
          }
            if(!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(messagearr[3]))){
                this.$toast.toast('请填写正确邮箱地址')
                return
            }
            if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(messagearr[4]))||messagearr[4].length<11){
                this.$toast.toast('请填写正确手机号码')
                return
            }
          if((this.toastswitch.inputinfo[this.swnum])[1]!=(this.toastswitch.inputinfo[this.swnum])[2]){
              this.$toast.toast('两次密码不同，请重新输入')
              this.worng=true
              return
          }
          var allobj={}
          this.$http.query(200816).then((res)=>{
              if(res.data.jsonmap){
                if(JSON.parse(res.data.jsonmap)[messagearr[0]]){
                    this.$toast.toast('账号已存在，请重新输入')
                    return
                }
                var pnum =1
                this.$http.query(80000).then(res1=>{
                pnum=JSON.parse(res1.data.jsonmap).pnum+1
                this.$http.change(80000,{pnum:pnum},()=>{})
                //8w到9w区间存用户信息

                allobj=JSON.parse(res.data.jsonmap)
                this.$set(allobj,messagearr[0], {
                    password:messagearr[1],
                    email:messagearr[3],
                    phone:messagearr[4],
                    pid : pnum 
                 });
                this.$http.change(200816,allobj,()=>{
                    this.worng= false
                        this.toastswitch.flagtoast=false
                    setTimeout(()=>{
                        this.toastswitch.istoast=false
                    },1000)
                    this.$http.add(pnum,{})
                    this.$toast.toast('注册成功')
                    this.toastswitch.inputinfo=[['','','','',''],['','','','','']]
                })
                })
              }
              else{
                var pnum =1
                this.$http.query(80000).then(res1=>{
                pnum=JSON.parse(res1.data.jsonmap).pnum+1
                this.$http.change(80000,{pnum:pnum},()=>{})
                this.$set(allobj,messagearr[0], {
                    password:messagearr[1],
                    email:messagearr[3],
                    phone:messagearr[4],
                    pid : pnum 
                 });
                  this.$http.add(200816,allobj).then(res=>{
                    this.worng= false
                        this.toastswitch.flagtoast=false
                    setTimeout(()=>{
                        this.toastswitch.istoast=false
                    },900)
                    this.$toast.toast('注册成功')
                    this.toastswitch.inputinfo=[['','','','',''],['','','','','']]
                })
                })
              }
          })

      },
      xiugai(){
          var messagearr = []
          messagearr=this.toastswitch.inputinfo[this.swnum]
          var num = messagearr.indexOf('')
          if(num!=-1){
              this.$toast.toast('请输入'+(this.toastswitch.inputname[this.swnum])[num])
              return
          }
          for (var i=0;i<=messagearr.length-1;i++){
              var minlength=0
              if(i==0){
                  minlength=3
              }
              else if (i==1||i==2){
                  minlength = 4
              }
              if(messagearr[i].length<minlength){
                  this.$toast.toast((this.toastswitch.inputname[this.swnum])[i]+'长度不低于'+minlength)
                  return
              }
          }
            if(!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(messagearr[3]))){
                this.$toast.toast('请填写正确邮箱地址')
                return
            }
            if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(messagearr[4]))||messagearr[4].length<11){
                this.$toast.toast('请填写正确手机号码')
                return
            }
          if((this.toastswitch.inputinfo[this.swnum])[1]!=(this.toastswitch.inputinfo[this.swnum])[2]){
              this.$toast.toast('两次密码不同，请重新输入')
              this.worng=true
              return
          }
          var allobj={}
          this.$http.query(200816).then((res)=>{
              if(res.data.jsonmap){
                if(JSON.parse(res.data.jsonmap)[messagearr[0]]){
                allobj=JSON.parse(res.data.jsonmap)
                if(messagearr[3]!==allobj[messagearr[0]].email){
                    this.$toast.toast('注册邮箱地址错误')
                    return
                }
                if(messagearr[4]!==allobj[messagearr[0]].phone){
                    this.$toast.toast('注册手机号码错误')
                    return
                }
                allobj[messagearr[0]]={
                    password:messagearr[1],
                    email:messagearr[3],
                    phone:messagearr[4],
                    pid : allobj[messagearr[0]].pid
                 }
                this.$http.change(200816,allobj,()=>{
                    this.worng= false
                    this.toastswitch.flagtoast=false
                    setTimeout(()=>{
                        this.toastswitch.istoast=false
                    },900)
                    this.$toast.toast('修改成功')
                    this.toastswitch.inputinfo=[['','','','',''],['','','','','']]
                })

                }
                else{
                    this.$toast.toast('修改失败,用户名不存在')
                }
              }
              else{
                  this.$toast.toast('用户名不存在')
              }
          }) 
      }
  }
}
</script>

<style lang="scss" scoped>

.body{
    width: 100vw;
    height: 100vh;
    background-image:linear-gradient(bottom,#45e9f8,#40495a);
    overflow: hidden;
    position: relative;
    }
.pcome{
    font-size:45px;
    color: #fff;
    font-family: 'STxinwei';
}
.input{
    margin-top: 10px;
    display: flex;
    justify-content: center;
}
.button{
    margin-top: 40px;
    width: 100%;
    justify-content: center;
    display: flex;
    height: 40px;
    .loginin{
        width: 60%;
        height: 40px;
        border-radius: 20px;
        color: #fff;
        text-align: center;
        line-height: 40px;
        border: #fff 1px solid;
    }
}
.tips{
    margin-top: 5px;
    width: 100%;
    justify-content: center;
    display: flex;
    height: 40px;
    p{
        color:#fff;
        font-size: 15px;
    }
}
.inputitems{
    width: 230px;
    height: 30px;
    border-radius: 20px;
    background-color:transparent;
    outline: none;
    border: #cffbff solid 1px;
    padding: 5px;
    padding-left: 40px;
    color: #fff;
    font-size: 15px;
}
.inputitems:focus{
        border: 1px solid;
        border-color: #fff;
        box-shadow: 0 0 15px #fff;
}
.loginin:hover{
        border: 1px solid;
        border-color: #fff;
        box-shadow: 0 0 15px #fff;
}
.input ::placeholder{
    color: #fff;
}
.toast ::placeholder{
    color: #fff;
}
.closeimg{
    width: 100%;
    height: 100%;
}
.toast{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 345px;
    height: 500px;
    background: floralwhite;
    background-image:linear-gradient(bottom,#ab64f6,#61dbf7);
    border-radius: 15px;
    border: #fff 1px solid;
    
    .loginin{
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 40px;
        border-radius: 20px;
        color: #fff;
        text-align: center;
        line-height: 40px;
        border: #fff 1px solid;
    }
    .inputitems{
        width: 230px;
        height: 30px;
        border-radius: 20px;
        background-color:transparent;
        outline: none;
        border: #cffbff solid 1px;
        padding: 5px;
        padding-left: 40px;
        margin-top: 25px;
        color: #fff;
        font-size: 15px;
    }

}
.aniclose{
animation: 1s closes;
}
.aniopen{
animation: 1s opens;
}


@keyframes opens {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}

@keyframes closes {
    0%{
        opacity: 1;
    }
    100%{
        opacity: 0;
    }
}

</style>
