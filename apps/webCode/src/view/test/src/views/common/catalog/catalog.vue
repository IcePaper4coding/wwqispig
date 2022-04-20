<template>
<div class="catalog_box">
      <div class="navtitle">
            <div class="navlistbox" v-if="infolist.length>0">
                    <div class="muluTitle">目 录</div>
                    <div v-for="(item,index) of infolist" :key="index+'on'">
                        <div v-if="item.header == 'H1'" class="navlist h1" @click="scrollto(item,index)">{{item.title}}</div>
                        <div v-if="item.header == 'H2'" class="navlist h2" @click="scrollto(item,index)">{{item.title}}</div>
                        <div v-if="item.header == 'H3'" class="navlist h3" @click="scrollto(item,index)">{{item.title}}</div>
                        <div v-if="item.header == 'H4'" class="navlist h4" @click="scrollto(item,index)">{{item.title}}</div>
                        <div v-if="item.header == 'H5'" class="navlist h5" @click="scrollto(item,index)">{{item.title}}</div>
                        <div v-if="item.header == 'H6'" class="navlist h6" @click="scrollto(item,index)">{{item.title}}</div>
                    </div>
            </div>
            <div class="navlistbox" v-else>
                <div class="nolist_box" >
                <img src="./img/nothingTips.png" alt="">
                </div>
            </div>
      </div>
</div>
</template>

<script>

export default {
    name: "catalog",
    data() {
        return {
            titleinput:'',
            navindex:0,
        };
    },

    props: {
        infolist:{
                type: Array,
                default: function() {
                    return [];
                }
            },
    },
    components:{
        
    },
    mounted() {
        
    },
    methods: {
        scrollto(item,index){
            this.$emit('scrollto',item,index)
        }
    }
    };
</script>
<style lang="scss" scoped>
.catalog_box{
    margin-top: 10px;
    width: 100%;
    height: 100%;
}
.navtitle{
    cursor: pointer;
    position: relative;
    font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 18px;
	letter-spacing: 0px;
	color: #575757;
    &:hover{
        .navlistbox{
            display: block;
        }
    }
}
.navlist{
    color: #575757;
    line-height: 30px;
    cursor: pointer;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover{
        color: #ff6a00;
    }
}
.navlistbox{
        margin-left: 10px;
        width: 240px;
        min-height: 304px;
        max-height: 600px;
        overflow: scroll;
        padding: 20px;
        background-color: #fff;
        border-radius: 3px;
    }
.actnav{
    border-left: #ff6a00 solid 2px;
    color: #ff6a00;
}
.muluTitle{
    padding: 10px 0;
    border-bottom: solid #E9E9E9 1px;
    margin-bottom: 5px;

}
.h1{

}
.h2{
    text-indent:20px
}
.h3{
    text-indent:40px
}
.h4{
    text-indent:60px
}
.h5{
    text-indent:80px
}
.h6{
    text-indent:100px
}
.nolist_box{
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
