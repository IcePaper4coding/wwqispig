<template>
<div class="body" id="body">
    <div class="nav">
        <div class="goback">
            <i class="el-icon-arrow-left" style="font-size:20px;color:#fff" @click="goback"></i>
        </div>
        <div>
            <input type="text" placeholder="搜索歌名、歌手" class="inputstyle" v-model="keyword" @keyup.enter="serchmusic(keyword);historylist.push(keyword);delchongfu()" @blur="historylist.push(keyword)">
        </div>
        <div class="delkeys">
             <i class="el-icon-close" @click="keyword=''"></i>
        </div>
    </div>
    <div class="serchkey" v-if="!keyword">
        <div class="rembox">
            <div class="remen">
                热门搜索
            </div>
            <div class="keyslist">
                <div v-for="(item,index) of keyslist" :key="index+'lk'" class="listitem" @click="keyword=item.first;historylist.push(item.first);delchongfu()">
                    {{item.first}}
                </div>
            </div>
        </div>
        <div class="historybox">
            <div class="history">
                搜索历史
            </div>
            <div class="hislist">
                <div v-for="(item,index) of historylist" :key="index+'lkl'" class="hislistitem" @click="keyword=item;">
                    {{item}}
                    <div>
                        <i class="el-icon-close" @click.stop="historylist.splice(index,1);savehistory()"></i>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div class="serchres" v-else :style="heightflag?'height: calc(100% - 100px);':''" >
        <div class="songs" v-for="(item,index) of songslist" :key="index+'lkk'" @click="toplay(item.id,$event)">
            <div class="name">
                {{item.name}}
            </div>
            <div class="auth">
                {{item.artists[0].name}} - {{item.album.name}}
            </div>
        </div>
    </div>
</div>

</template>
<script>

export default {

  data(){
      return{
          keyword:'',
          keyslist:[
          ],
          historylist:[
          ],
          songslist:[],
          settime:'',
          heightflag:false,
      }
  },
  filters:{

  },
    watch: {
        keyword(newVal) {
            if(newVal){
             this.serchmusic(newVal)  
            }
        },
    },
props:{
    playmucis:{
        type:Object
    }

	},
  mounted(){
      this.hotserch()
        if(this.playmucis.url){
          this.heightflag=true
    }
    var data = localStorage.getItem('historylist')
    if(data){
        this.historylist = JSON.parse(data)
    }
    var that = this
        function pushHistory() { 
        that.goback()
        }
     window.addEventListener("popstate", function (e) {
        
              var state = {
            title: "title",
            url: "#/mymusic"
        };
        window.history.pushState(state, "title", "#/mymusic");
        pushHistory()
    }, false);
  },
  methods:{
    goback(){
        if(this.keyword!=""){
            this.keyword=''
        }
        else{
            this.$emit('serchflag')
        }
      },
    serchmusic(name){//通过名字查询歌曲
    if(name==""){
        return
    }
        var obj = {
            url:'http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s={'+name+'}&type=1&offset=0&total=true&limit=30',
            method:'post',
            contentType:"application/json",
            jsonParam:''
          }
        this.$http.proxy(obj).then(res=>{
            this.songslist = res.data.result.songs
            localStorage.setItem('historylist',JSON.stringify(this.historylist))
          })
      },
      hotserch(){
        //   http://musicapi.leanapp.cn
        var obj = {
            url:'http://musicapi.leanapp.cn/search/hot',
            method:'GET',
            contentType:"",
            jsonParam:''
          }
        this.$http.proxy(obj).then(res=>{
            this.keyslist=res.data.result.hots
          })
      },
      toplay(id,e){
          this.$emit('getsongs',id,e)
          setTimeout(()=>{
            this.heightflag=true
          },1000)
      },
      delchongfu(){
        //   this.historylist = Array.from(new Set(this.historylist))
        for (var index in this.historylist){
            var i = 0 
            for(var item of this.historylist){
                if(item == this.historylist[index]){
                    i+=1
                }
            }
            if(i>1 || this.historylist[index]==''){
                this.historylist.splice(index,1)
            }

        }
      },
      savehistory(){
          localStorage.setItem('historylist',JSON.stringify(this.historylist))
      }
  }
}
</script>

<style lang="scss" scoped>
.nav{
width: 100%;
height: 44px;
background: #d44439;
position: fixed;
top: 0;
.goback{
    position: absolute;
    top: 13px;
    left: 15px;
}
}
.inputstyle{
  background-color:transparent;
  outline: none;
  border: none;
  height: 44px;
  width: 250px;
  color: #fff;
  font-size: 15px;
}
input::placeholder{
    color: #efefef;
}
.delkeys{
    position: absolute;
    top: 13px;
    right: 15px;
    color: #fff;
}
.serchkey{
    width: 100%;
    position: absolute;
    top: 44px;
}
.remen{
    position: absolute;
    top: 20px;
    left: 20px;
    color: #6d6d6d;
    font-size: 12px;
}
.keyslist{
    display: flex;
    position: absolute;
    top: 50px;
    left: 15px;
    width: calc(100% - 25px);
    flex-wrap: wrap;
}
.listitem{
    max-width: 100px;
    height: 20px;
    line-height: 20px;
    font-size: 13px;
    padding: 5px;
    text-align: center;
    border: #fff solid 1px;
    box-shadow: 2px 2px 2px 1px #e5e5e5;
    border-radius: 16px;
    margin: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.rembox{
    position: relative;
    height: 200px;
}
.historybox{
        position: relative;
    .history{
        position: absolute;
        top: 20px;
        left: 20px;
        color: #6d6d6d;
        font-size: 12px;
    }
    .hislist{
        position: absolute;
        top: 50px;
        left: 15px;
        width: 100%;
        text-align: start;
        flex-wrap: wrap;
        font-size: 14px;
        .hislistitem{
            display: flex;
            justify-content: space-between;
            margin: 8px;
            max-width: calc(100% - 50px);
        }
    }
}
.serchres{
    width: 100%;
    height: calc(100% - 44px);
    overflow: scroll;
    position: absolute;
    top: 44px;
    .songs{
        margin: 15px 0 10px 20px;
        text-align: start;
        max-width: calc(100% - 75px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 10px;
        border: #fff solid 1px;
        box-shadow: 2px 2px 2px 1px #e5e5e5;
        border-radius: 5px;
    }
    .name{
        max-width: calc(100% - 75px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #025dff;
        font-size: 16px;
    }
    .auth{
        max-width: calc(100% - 75px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 10px;
    }
}
</style>
