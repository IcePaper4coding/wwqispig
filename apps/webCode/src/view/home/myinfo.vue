<template>
<div class="myinfo">
    <div class="infobg">
    <img src="../../assets/img/info/myinfobg.jpg" alt="" style="width:100%">
    </div>
    <div class="nav">
        <div><img src="../../assets/img/info/left.png" alt="" style="width:15px;margin-left: 5px;" @click="goback"></div>
        <div class="navname" style="text-align: center;">
            {{info.authname}}
        </div>
    </div>
    <div class="mymessage">
            <div class="myface">
                <img :src="info.faceimg" alt="" >
            </div>
            <div class="myname"  @click="editstc=true">
            <div><img src="../../assets/img/info/edit.png" alt="" style="width:15px;margin-top:7px;margin-right:5px"></div>
            编辑
            </div>
    </div>
    <div class="mybottom">
        <div>
            <img src="../../assets/img/info/tips.png" alt="" style="width:100%;margin-top:20px">
        </div>
        <div>
            暂无更多内容
        </div>
    </div>
    <div class="edittc" v-if="editstc">
            <div class="myface">
                <label for="faceImg" class="falabel">
                 <img :src="img" alt="" >
                </label>
                 <input
                    @change="handleInputChangeFunc($event,'img')"
                    class="pa"
                    id="faceImg"
                    type="file"
                    style="opacity:0;width:60px;height:60px;top:10px;left:20px;"
                />
            </div>
            <div style="font-size:12px">点击更改</div>
            <input type="text" class="inputitems" placeholder="请输入您的昵称" v-model="savename" >
            <div style="margin-top:25px">
            <el-radio v-model="sex" label="男">男</el-radio>
            <el-radio v-model="sex" label="女">女</el-radio>
            </div>
            <div style="display:flex;width:100%;justify-content: center;margin-top:40px">
                <div class="item" @click="editstc=false">取消</div>
                <div class="item" style="margin-left:20px" @click="toedit">保存</div>
            </div>
            <div class="colse" @click="editstc=false">X</div>
    </div>
</div>
</template>

<script>
export default {
    props:{
        tabname:{
            default:'首页',
            type:String
        }
    },
  data(){
      return{
          editstc:false,
          savename :'',
          sex:"女",
          img:'',
          info:
              {
                  authname:'wwq',
                  faceimg:require('../../assets/img/bannerimg/banner2.jpg'),
                  sex:'男'
              }
      }
  },
  mounted(){
      var data = JSON.parse(localStorage.getItem('wqbytoken'))
      this.$http.query(data.id).then(res=>{
          var allres = JSON.parse(res.data.jsonmap)
          if(allres.authname){
              this.info = allres
              this.savename=this.info.authname
              this.sex=this.info.sex
              this.img = this.info.faceimg
          }
          else{
              this.$set(allres,'authname',data.username)
              this.$http.change(data.id,allres,()=>{})
          }
          if(allres.faceimg){

                    }
                else{
                        this.$set(allres,'faceimg',require('../../assets/img/faceicon/face1.png'))
                        this.$http.change(data.id,allres,()=>{})
                }
      })
  },
  methods:{
      handleInputChangeFunc(event,targetName){
            const file = event.target.files[0];
            const imgMasSize = 1024 * 1024 * 2;
            var that = this
            var reader = new FileReader(); //实例化文件读取对象
            reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
            reader.onload = function(ev) { //文件读取成功完成时触发
            var formObj = new File(that.dataURLtoBlob(reader.result), file.name, {type:file.type})
                that.$toast.loading('正在上传',true)
                that.$http.upload(formObj,file.name).then(res=>{
                that.$toast.loading('正在上传',false)
                    that.img='http://47.94.235.210:8090/uploadData/getFile/'+res.data.id
                })
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
      goback(){
          this.$router.push('/my?id=4')
      },
      toedit(){
          if(this.savename.length==0){
              this.$toast.toast('昵称不能为空')
              return
          }
          if(this.savename.length>16){
              this.$toast.toast('昵称过长')
              return
          }
        var data = JSON.parse(localStorage.getItem('wqbytoken'))
        data.authname = this.savename
        data.faceimg = this.img
        data.sex= this.sex
        localStorage.setItem('wqbytoken',JSON.stringify(data))
        this.$http.query(data.id).then(res=>{
        var allres = JSON.parse(res.data.jsonmap)
        this.$set(allres,'authname',this.savename)
        this.$set(allres,'sex',this.sex)
        this.$set(allres,'faceimg',this.img)
        this.info = allres
        this.$http.change(data.id,allres,()=>{
            this.$toast.toast('保存成功')
            this.editstc=false
        })
          
        // if(allres.faceimg){
        //             }
        // else{
        //                 this.$set(allres,'faceimg',require('../../assets/img/faceicon/face1.png'))
        //                 this.$http.change(data.id,allres)
        //     }
      })
      },
      changeface(){
          this.$toast.toast('暂未支持上传头像，敬请期待')
      },
  }
}
</script>

<style lang="scss" scoped>
.infobg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 360px;
    overflow: hidden;
}
.mymessage{
    position: absolute;
    top: 120px;
    left: 50%;
    width: 100%;
    transform: translateX(-50%);
.myface{
    width: 60px;
    height: 60px;
    border-radius: 30px;
    border: solid 1px #fff;
    box-shadow: 5px 5px 5px rgba(0,0,0,.2);
    margin: 0 auto;
    overflow: hidden;
    img{
        width: 60px;
        }
}
.myname{
    display: flex;
    justify-content: center;
    width: 80px;
    border-radius: 15px;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    color:#515151;
    margin: 10px auto;
    background: transparent;
    box-shadow: 4px 3px 15px rgba(0,0,0,.2);
    // border: solid 1px #fff;
    }
}
.nav{
    width: 100%;
    height: 45px;
    text-align: center;
    line-height: 45px;
    font-weight: 500;
    position: fixed;
    top: 0;
    box-shadow: 4px 3px 11px rgba(0,0,0,.2);
    background: transparent;
    z-index: 999;
    color: #fff;
    font-size: 15px;
    display: flex;
    // justify-content: space-between;
    .navname{
        width:100%;
        padding-right: 20px;
    }
}
.edittc{
    border-radius: 15px;
    color: #606266;
    font-size: 15px;
    width: 250px;
    height: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    box-shadow: 4px 3px 15px rgba(0,0,0,.2);
    .myface{
    width: 60px;
    height: 60px;
    border-radius: 30px;
    border: solid 1px #fff;
    box-shadow: 5px 5px 5px rgba(0,0,0,.2);
    margin: 0 auto;
    margin-top: 50px;
    overflow: hidden;
    img{
        width: 60px;
        }
    }
    .inputitems{
        width: 130px;
        height: 20px;
        border-radius: 20px;
        background-color:transparent;
        outline: none;
        border: #606266 solid 1px;
        padding: 5px;
        text-align: center;
        margin-top: 15px;
        color: #606266;
        font-size: 15px;
    }
    .inputitems ::placeholder{
    color: #606266;
        }
    .item{
        width: 50px;
        height: 20px;
        border-radius: 20px;
        border: #fff solid 1px;
    }
    .colse{
        width: 20px;
        height: 20px;
        position: absolute;
        top: 10px;
        right: 10px;
    }
}
.inputitems:focus{
        border: 1px solid;
        border-color: #606266;
        box-shadow: 0 0 15px#fff;
}
.inputitems::placeholder{
        color: #606266;
        font-size: 12px;
}
.mybottom{
    width: 100%;
    height: calc(100vh - 265px);
    background: #fff;
    position: absolute;
    top: 265px;
    border-radius: 20px 20px 0 0;
    animation: 1.2s upgo ;
}
@keyframes upgo {
    0%{
        top: 360px;
        height:calc(100vh - 360px) ;
    }
    100%{
        top: 265px;
        height:calc(100vh - 265px) ;
    }
}
.falabel{
    position: absolute;
    border-radius: 30px;
    overflow: hidden;
    width: 60px;
    height: 60px;
}
</style>
