<template>
    <div class="yb-catalog">
        <div class="yb-catalog__box" v-show="value">
            <div class="yb-catalog__title">
                <span>目录</span>
            </div>
            <div :class="{
                    'yb-catalog__item':true,
                    'yb-catalog__item--active':curObj.activeId === item.activeId
                }" v-for="item in headerArr" 
                :key="item.offsetTop" :style="setHeaderStyleFn(item)"
                @click="selectHeaderFn(item)">
                <span v-if="item.levelNum > 1" style="font-size:30px;vertical-align:middle;">·</span>
                <span style="vertical-align:middle;">{{item.textContent}}</span>
            </div>  
        </div>
    </div>
</template>
<script>
    export default {
        name: "ybQuillTitle",
        data() {
            return {
                varObj:{},
                curObj:{},/* 当前激活目录 */
                headerArr:[],
            };
        },
        props: {
            instanceObj:null,
            indentNum:{
                default:15
            },
            value:{
                default:true
            }
        },
        mounted() {
            /* 1、在文档发生改变时获取文档内容，筛选出 h 标签 */
            setTimeout(()=>{
                if(this.instanceObj){
                    this.setHeaderFn();
                    this.instanceObj.on('editor-change',(type,range)=>{
                        this.setHeaderFn();
                    })
                }
            })
        },
        methods: {
            /* 构造 header 数据 */
            setHeaderFn(){
                this.headerArr = [];
                var nodeArr = this.instanceObj.root.childNodes || [];
                nodeArr.forEach((nodeItem,nodeIndex) => {  
                    var hArr = [1,2,3,4,5,6];
                    for(let item of hArr){
                        if(nodeItem.tagName.indexOf('H' + item) > -1 && nodeItem.textContent){
                            nodeItem.setAttribute('id',this.getRandomStr());
                            nodeItem.levelNum = item;
                            nodeItem.activeId = nodeItem.getAttribute('id');
                            this.headerArr.push(nodeItem);
                        }
                    }
                });
                /* 设置默认值 */
                if(this.headerArr.length){
                    this.$set(this.curObj,'activeId',this.headerArr[0].getAttribute('id'));
                }
                /* 监听编辑器滚动标题变化设置激活目录 */
                let scrollEl = document.getElementsByClassName('ql-editor')[0];
                scrollEl.addEventListener('scroll',(e)=>{
                    let scrollYNum = scrollEl.scrollTop;
                    for(let item of this.headerArr){
                        if(scrollYNum < item.offsetTop){
                            this.$set(this.curObj,'activeId',item.getAttribute('id'));
                            break;
                        }
                    }
                });
                this.$forceUpdate();
            },
            /* 设置层级缩进样式 */
            setHeaderStyleFn(item){
                var StyleStr = 'padding-left:' + (this.indentNum*item.levelNum) + 'px;';
                if(item.levelNum === 1){
                    StyleStr = StyleStr + 'font-weight:bold';
                }
                return StyleStr;
            },
            /* 选中 title */
            selectHeaderFn(item){
                this.curObj.activeId = item.id
                item.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'center'
                });
            },
            /* 获取一个随机字符串 */
            getRandomStr() {
                const randomStr = Math.random().toString(36).slice(0, 16);
                return `str-${randomStr }`
            }
        }
    };
</script>
<style lang="scss" scoped>
.yb-catalog{
    width: 220px;
    position: absolute;
    right:50px;
    top: 70px!important;
    transition: top .3s;
    border-left:1px solid #e8e8e8;
    box-sizing: border-box;
    max-height: calc(100% - 60px);
    overflow-y:auto;
    padding-bottom: 50px;
    .yb-catalog__box{
        transition: all .6s;
        min-height: 150px;
        .yb-catalog__title{
            margin-bottom: 10px;
            font-size: 14px;
            color:#333;
            padding-left: 15px;
            .iconfont{
                float:right;
                font-size:14px;
                position:relative;
                top:1px;
                cursor: pointer;
            }
        }
        .yb-catalog__item{
            font-size: 14px;
            color:#666;
            line-height: 35px;
            margin-bottom:2px;
            padding:0 15px;
            user-select: none;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .yb-catalog__item--active{
            color:#faa5b4;
            background: transparent;
        }
        .yb-catalog__item:hover span{
            color:#faa5b4;
        }
    }
}
/*滚动条*/
.yb-catalog::-webkit-scrollbar {
    width: 1px;
    height: 1px;
    background-color: transparent;
}
</style>
