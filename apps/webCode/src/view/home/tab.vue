<template>
<div class="tab">
    <div class="item" v-for="(item,index) in tablist" :key="item.name" :style="(index==0?'margin-left:25px':'')+(index==tablist.length-1?'margin-right:25px':'')" @click="changetab(index)">
    <div>
    <img :src="item.icon" alt="" style="width:25px">
    <div style="font-size:10px">{{item.name}}</div>
    </div>
    <div class="tipnum" v-if="item.num!=0">
        {{item.num}}
    </div>
    </div>
</div>
</template>

<script>
export default {
  data(){
      return{
          tablist:[
          {name:'首页',icon:require('../../assets/img/icon/homeicon.png'),link:'/home?id=0',id:0,num:0},
          {name:'轮盘',icon:require('../../assets/img/icon/hdicon.png'),link:'/lunpan?id=1',id:1,num:0},
          {name:'发布',icon:require('../../assets/img/icon/addicon.png'),link:'/publish?id=2',id:2,num:0},
          {name:'动态',icon:require('../../assets/img/icon/dticon.png'),link:'/pyq?id=3',id:3,num:0},
          {name:'我的',icon:require('../../assets/img/icon/myicon.png'),link:'/my?id=4',id:4,num:0},
          ],
          tabname:''
      }
  },
  mounted(){
this.$Bus.$on('showtabnum', (name,e) => {
    console.log('gaga');
  for(var item of this.tablist){
      if(item.name == name){
          item.num = e
      }
  }
})
var mydata = JSON.parse(localStorage.getItem("wqbytoken"))
    this.$http.query(10000).then(res=>{
        if(res.data.jsonmap){
            var list = JSON.parse(res.data.jsonmap)
            var num = 0
            this.$http.query(mydata.id).then(res=>{
                var obj = JSON.parse(res.data.jsonmap)
                var id = obj.loverid
                for(var item of list){
                    if((item.id == id)&&(item.islove==false)){
                        num+=1
                    }
                }
                this.tablist[3].num = num 
                this.tablist[4].num = 0
                if(obj.loverarr){
                    this.tablist[4].num= obj.loverarr.length
                    if(obj.cflist){
                        this.tablist[4].num += obj.cflist.length
                    }
                    
                }
            })
        }
        
    })
// setInterval(() => {
//     this.$http.query(10000).then(res=>{
//         var list = JSON.parse(res.data.jsonmap)
//         var num = 0
//         this.$http.query(mydata.id).then(res=>{
//             var obj = JSON.parse(res.data.jsonmap)
//             var id = obj.loverid
//             for(var item of list){
//                 if((item.id == id)&&(item.islove==false)){
//                     num+=1
//                 }
//             }
//             this.tablist[3].num = num 
//             this.tablist[4].num = 0
//             if(obj.loverarr){
//                 this.tablist[4].num= obj.loverarr.length
//                 if(obj.cflist){
//                     this.tablist[4].num += obj.cflist.length
//                 }
                
//             }
//         })
        
//     })
// }, 20000);
  },
  methods:{
      changetab(e){
          if(this.$route.query.id==this.tablist[e].id){
              return
          }
          this.$router.push(this.tablist[e].link)
          this.tabname=this.tablist[e].name
      }
  }
}
</script>

<style lang="scss" scoped>
.tab{
    position: fixed;
    bottom:0px;
    width: 100%;
    height: 40px;
    background:#fff;
    display: flex;
    justify-content: space-between;
    border-top: #e5e5e5 solid 1px;
    box-shadow: 4px 3px 11px 11px rgba(0,0,0,.2);
    padding-top: 5px;
    padding-bottom: 10px;
    .item{
        position: relative;
    }
}
.tipnum{
    background: red;
    width: 15px;
    height: 15px;
    border-radius: 8px;
    color: #fff;
    position: absolute;
    top: 0px;
    right: -15px;
    font-size: 8px!important;
    line-height: 17px;
}
</style>
