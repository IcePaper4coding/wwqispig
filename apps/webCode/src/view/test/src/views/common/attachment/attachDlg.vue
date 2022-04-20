<template>
    <div class="upLoad_dailog">
        <div class="upLoad_box">
                <div class="upLoad_title">
                    <div>添加附件</div>
                    <div><i @click="closeDailog" class="iconfont icon-close1"></i></div>
                </div>
                <div class="upLoad_content">
                    <div class="upload_btn_box" v-if="fileList.length>0">
                        <el-upload
                        action
                        :show-file-list="false"
                        :http-request="handleAvatarSuccess"
                        >
                            <div class="upload_btn"><i class="iconfont icon-shangchuantupian"></i> 上传附件</div>
                        </el-upload>
                    </div>
                    <div  v-if="fileList.length>0">
                        <div class="upload_item_box">
                            <div v-for="item of fileList" >
                                <div class="upload_item" @click="item.isSeclet = !item.isSeclet">
                                    <img :src="item.fileUrl" alt="" style="max-width: 119px;max-height: 50px;" v-if="item.fileName.split('.')[1]=='png'||item.fileName.split('.')[1]=='jpg'||item.fileName.split('.')[1]=='gif'">
                                    <img v-else-if="item.fileName.split('.')[1]=='pdf'" src="../../../../static/img/PDF(2).png" alt="" style="max-width: 119px;max-height: 50px;">
                                    <img v-else-if="item.fileName.split('.')[1]=='xlsx'" src="../../../../static/img/EXCEL(3).png" alt="" style="max-width: 119px;max-height: 50px;">
                                    <img v-else-if="item.fileName.split('.')[1]=='zip'||item.fileName.split('.')[1]=='rar'" src="../../../../static/img/zipBig.png" alt="" style="max-width: 119px;max-height: 50px;">
                                    <img v-else-if="item.fileName.split('.')[1]=='doc'||item.fileName.split('.')[1]=='docx'" src="../../../../static/img/WORD(1).png" alt="" style="max-width: 119px;max-height: 50px;">
                                    <img v-else src="../../../../static/img/icon.png" alt="" style="max-width: 119px;max-height: 50px;" >
                                    <div class="cover_seclet" :style="item.isSeclet?'background:transparent ;display:block':''">
                                        <div class="edit_box">
                                            <div class="eidt_item_box" @click.stop>
                                                <el-checkbox v-model="item.isSeclet" @change="toSecletFunc"></el-checkbox>
                                            </div>          
                                        </div>
                                    </div>
                                    <div class="cover_uploading" v-if="item.percentage<=100&&item.percentage>0">
                                        <div style="width: 90%;display: flex;justify-content: center;">
                                            <el-progress type="circle"  :width="45" :percentage="item.percentage" :color="customColors"></el-progress>
                                        </div>
                                    </div>
                                </div>
                                <div class="upload_item_name">
                                    {{item.fileName}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-upload
                        v-if="fileList.length == 0"
                        class="upload_center"
                        action
                        :show-file-list="false"
                        :http-request="handleAvatarSuccess"
                        >
                        <div class="upload_logo_box">
                            <div class="upload_logo">
                                <i class="iconfont icon-shangchuantupian"></i>
                            </div>
                            <div>将本地文件拖拽至此处，或 <span>点击上传</span></div>
                        </div>
                    </el-upload>
                </div>
                <div class="upload_bottom_btn">
                    <div class="upload_bottom_btn_box">
                        <div class="inser_btn" @click="toInserFile">插入</div>
                        <div class="cancel_btn" @click="closeDailog">取消</div>
                    </div>
                </div>
        </div>
    </div>
</template>
<script>

export default {
    name: "attachDlg",
    data() {
        return {
            fileList:[],
            customColors: [
            {color: '#f56c6c', percentage: 20},
            {color: '#e6a23c', percentage: 40},
            {color: '#F56C6C', percentage: 60},
            {color: '#E6A23C', percentage: 80},
            {color: '#67C23A', percentage: 100}
            ]
        };
    },
    props:{
        value:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    components: {
        
    },
    watch:{
        value:{
            handler(val,oldval){
                this.fileList = val||[]
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
        
    },
    methods: {
        toInserFile(){
            this.$emit('toInserFile')
        },
        handleAvatarSuccess(e){
            this.$emit('handleAvatarSuccess',e)
        },
        closeDailog(){
            this.$emit('closeDailog')
        },
        toSecletFunc(){
            this.$emit('toSecletFunc')
        },
    }
};
</script>
<style lang="scss">
.upLoad_dailog{
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.6);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 90;
    display: flex;
    align-items: center;
    justify-content: center;
    .upLoad_box{
        width: 655px;
        height: 545px;
        background: #fff;
        border-radius: 5px;
        position: relative;
    }
    .upLoad_title{
        padding: 15px 10px;
        color: #575757;
        font-size: 14px;
        font-weight: 600;
        border-bottom: 2px solid #ebecf0;
        display: flex;
        justify-content: space-between;
        i{
            cursor: pointer;
        }
    }
    .upload_bottom_btn{
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        border-top: 2px solid #ebecf0;
    }
    .upload_bottom_btn_box{
        display: flex;
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        padding: 10px;
        
    }
    .inser_btn{
        margin-right: 15px;
        padding: 5px 15px;
        background: #ff6a00;
        color: #fff;
        display: flex;
        align-items: center;
        border-radius: 3px;
        cursor: pointer;
        &:hover{
            background: #ff8934;
        }
    }
    .cancel_btn{
        margin-right: 15px;
        cursor: pointer;
        &:hover{
            color: #ff8934;
        }
    }
    .upLoad_content{
        height: calc(100% - 112px);
    }
    .upload_btn_box{
        height: 50px;
        display: flex;
        align-items: center;
        padding:0 15px;
        border-bottom: 1px solid #f2f3f5;
    }
    .upload_btn{
        width: 90px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #f5f6fa;
        color: #a5a5a5;
        border-radius: 3px;
        font-size: 13px;
        cursor: pointer;
    }
    .upload_center{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

    }
    .upload_item_box{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding:5px 10px;
        justify-content: flex-start;
    }
    .upload_item{
        width: 119px;
        height: 50px;
        background-color: #f2f3f5;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-content: center;
        padding: 20px 10px;
        margin: 10px;
        cursor: pointer;
        position: relative;
        &:hover{
            .cover_seclet{
                display: block;
            }
        }
    }
    .cover_seclet{
        display: none;
        position: absolute;
        top: 0px;
        width: 100%;
        height: 90px;
        background: rgba($color: #dee0e3, $alpha: 0.75);
        .edit_box{
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 5px;
        }
        .eidt_item_box{
            width: 22px;
            height: 22px;
            border-radius: 3px;
            color: #a3a8af;
            display: flex;
            text-align: center;
            justify-content: center;
            line-height: 22px;
            margin-right: 5px;
        }
    }
    .cover_uploading{
        position: absolute;
        top: 0px;
        width: 100%;
        height: 90px;
        background: rgba($color: #dee0e3, $alpha: 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .upload_item_name{
        width: 120px;
        padding: 0 20px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .upload_logo_box{
        color: #b4b6bf;
        .upload_logo{
            display: flex;
            justify-content: center;
        }
        span{
            color: #ff6a00;
        }
        i{
            font-size: 50px;
        }
    }
}
</style>

