<template>
<div class="body" id="body">
    <div class="textcon">
            <el-input
            type="textarea"
            :rows="6"
            placeholder="这一刻的想法……"
            v-model="textarea"
            class="inpuitem"
            >
            </el-input>
    </div>
    <!-- <div v-for="(item,index) of imglist" :key="index+'g'">
            <img :src="item" alt="">
    </div> -->
    <div class="showimg">
        <div :style="'width:'+fullWidth/3.6+'px;height:'+fullWidth/3.6+'px;overflow: hidden;margin:7px;position: relative;'" v-for="(item,index) of imglist" :key="index+'g'"   v-dragging="{ item: item, list: imglist, group: 'img' }">
            <img   :src="item" alt="" :style="'height:'+fullWidth/3.6+'px;'" class="imgs" @click="toshowimg(index)">
            <i class="el-icon-error" style="position: absolute;top: 0px;right: 0px;" @click="delimg(index)"></i>
        </div>
        <div class="imgupload" v-if="imglist.length<9">
            <label for="videoImg">
                <img
                class="photo-icon"
                :style="'width:'+fullWidth/3.6+'px;height:'+fullWidth/3.6+'px;'"
                v-show="videoImg"
                ref="videoImg"
                :src="uploadimg"
                alt
                />
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
    <div class="buttonlist">
        <div class="bitem" @click="tosave">
            保存草稿
        </div>
        <div class="bitem" @click="topub">
            发布
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
          textarea:'',
        bglist:[
            //   '#f298e7','#a5f9f9',
              '#d481ff','#05f1e1',
            //   '#ab64f6','#61dbf7',
            //   '#3494e6','#ec6ead',
        ],
        obj:{},
        videoImg:true,
        uploadimg:require('../../assets/img/upload.png'),
        img:'',
        imglist:[],
        toshowimgflag:false,
        swiperOptionClub: {
                autoplay: false,
                loop: false,
                delay: 3000,
                direction: "horizontal",
                effect: "slide",
                initialSlide :0,
                preventLinksPropagation: false,
                // stopOnLastSlide: false,
                // disableOnInteraction: true,
                pagination: {
                el: ".swiper-pagination"
                }
        },
      }
  },
  mounted(){
      this.$dragging.$on('dragged', ({ value }) => {})
      this.getauthinfo()
    //   this.$http.delete(10000)
      this.$http.query(10000)
      this.$http.query(10001).then(res=>{
          if(res.data.jsonmap){
              this.textarea=JSON.parse(res.data.jsonmap).text
          }
      })
  },
  methods:{
      getauthinfo(){
          var mydata =JSON.parse(localStorage.getItem('wqbytoken'))
          this.$http.query(mydata.id).then(res=>{
              this.obj = JSON.parse(res.data.jsonmap)
              this.id = res.data.id
          })
      },
      topub(){
          if(this.textarea.length<6){
              this.$toast.toast("发布内容不能少于6个字")
              return
          }
        var time= new Date().getTime()
        var dated = new Date(time)
        this.$toast.loading('正在发布',true)
          this.$http.query(10000).then(res=>{
              var mydata =JSON.parse(localStorage.getItem('wqbytoken'))
              if(res.data.jsonmap.length>2){
                  var data =JSON.parse(res.data.jsonmap)
              }
              else{
                  var data =[]
              }
              var arr = data||[]
              var obj = {authimg:'',
                        id:this.id,
                        authname:this.obj.authname,
                        info:this.textarea,
                        img:this.imglist,
                        creattime:dated,
                        islove:false,
                        comment:'',
                        sex:this.obj.sex
                        }
                data.unshift(obj)
              this.$http.change(10002,data,()=>{})
              this.$http.change(10000,data,()=>{
                  this.$toast.loading('正在发布',false)
                  this.$toast.toast('发布成功',1000)
                  this.$http.delete(10001)
                  setTimeout(()=>{
                      this.$router.push('/pyq?id=3')
                  },1100)
              })
          })
      },
      tosave(){
          var obj ={text:this.textarea}
            this.$http.change(10001,obj,()=>{
                this.$toast.toast('保存成功',1000)
            })
      },
      toshowimg(e){
          this.img = this.imglist[e]
          this.toshowimgflag=true
          this.swiperOptionClub.initialSlide=e
      },
      delimg(e){
           this.imglist.splice(e,1)
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
                 that.imglist.push('http://47.94.235.210:8090/uploadData/getFile/'+res.data.id)
              })
          }
          }

      }
  }
}
</script>

<style lang="scss" scoped>
.body{
width: 100vw;
height: calc(100vh - 100px);
overflow: scroll;
position: relative;
background: #fff;
margin-top: 45px;
}
.buttonlist{
    display: flex;
    justify-content: space-between;
    padding: 50px;
    .bitem{
        border: solid 1px #e5e5e5;
        box-shadow: 0 0 15px #e5e5e5;
        border-radius: 15px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
    }
}
.textcon{
    width: 100%;
    height: 150px;
    display: flex;
    margin-top: 15px;
    justify-content: center;
    textarea{
        width: 100%;
        height: 150px;
        border: none;   
    }
}
    >>>.el-textarea{
        display: flex;
        justify-content: center;
        width: 96%;
        
    }
    >>>.el-textarea__inner{
        border-radius: 5px;
        background: transparent;
        width: 100%;
        border: none;
        padding-top: 15px;
        box-shadow: 0 0 15px #e5e5e5;
        border-bottom: 1px #e5e5e5 solid;
    }
    >>>.el-textarea__inner:focus{
        border: 1px solid;
        border-color: #e9e9e9;
        box-shadow: 0 0 15px #e5e5e5;
        border: none;
        border-bottom: 1px #e5e5e5 solid;
    }
  .photo-icon{
      width: 100px;
      height: 100px;
  }
  .imgupload{
      width: 100px;
      height: 100px;
      margin-top: 7px;
  }
  .showimg{
      margin: 10px;
      display: flex;
      flex-wrap: wrap;
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
