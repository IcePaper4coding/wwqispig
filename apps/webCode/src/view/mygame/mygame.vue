<template>
<div class="bodys">
    <div class="title">
        My Game
    </div>
    <div class="gamelist">
        <div v-for="(item,index) of gamelist" :key="index+'game'" class="gameitem" @click="getolink(item.link)">
            <div class="gamename">
                {{item.name}}
            </div>
            <div class="gamename">
                分数：{{item.value}}
            </div>
            <div class="gamename" style="font-size:13px">
                立即进入>>
            </div>
        </div>
    </div>
</div>

</template>
<script>

export default {

  data(){
      return{
          gamelist:[
              {
                  name:'我的砰砰梆',
                  value:90,
                  link:'/pengpengball'
              },
              {
                  name:'泡泡龙',
                  value:100,
                  link:''
              },
              {
                  name:'坦克大战',
                  value:70,
              },
          ]
      }
  },
  filters:{

  },
props:{


	},
  mounted(){

  },
  methods:{
      getolink(link){
        this.$router.push(link)
      }
  }
}
</script>

<style lang="scss" scoped>
.bodys{
    width: 100vw;
    height: 100vh;
    background-image:linear-gradient(bottom,#ab64f6,#61dbf7);
    color: #fff;
}
.title{
    font-size: 25px;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50px;
}
.gamelist{
    width: 100%;
    position: absolute;
    top: 200px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .gameitem{
        width: 45%;
        height: 100px;
        border: 1px solid #fff;
        border-radius: 15px;
        margin: 2%;
    }
    .gamename{
        margin-top: 10px;
    }
}
</style>
