<template>
  <div>
  <div  v-for="item of arr" :key="item.index">
  {{
      item.index +":"+item.name
  }}
  </div>
  <div>
  <input type="text" v-model="name" placeholder="名称">
  <input type="Number" v-model="num" placeholder="序号">
  <button @click="indexfunc">确认</button>
  </div>
  </div>
</template>
<script>

export default {
    name: 'App',
    data(){
        return{
            arr :[
                {name:'1',index:1},
                {name:'2',index:2},
                {name:'3',index:3},
                {name:'4',index:4},
                {name:'5',index:5},
            ],
            num:'',
            name:''
        }
    },
    methods:{
        indexfunc(){
            if(this.name){
                this.arr.splice(Number(this.num)-1,0,{name:this.name,index:this.num})
                for(var index in this.arr){
                    this.arr[index].index = Number(index)+1
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#app {
  /* font-family: 'Comic Sans MS', cursive, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  margin: 0;
}
</style>
