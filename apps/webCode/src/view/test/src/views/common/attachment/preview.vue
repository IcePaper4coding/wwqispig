<template>
    <div class="preview_dailog">
            <div class="previewPortal_box" id="previewPortal_box">
                    <div class="previewPortal_head">
                        <div class="previewPortal_title">{{fileList[preViewNum].fileName}}</div>
                        <div class="previewPortal_config">
                            <div class="previewPortal_config_downLoaditem" title="下载" @click="installfile(fileList[preViewNum],preViewNum)"><i class="iconfont icon-baocun" style="font-size: 18px;"></i></div>
                            <div class="previewPortal_config_item" title="关闭" @click="closeDailog"><i class="iconfont icon-close1" style="font-size: 22px;"></i></div>
                        </div>
                    </div>
                    <div class="previewPortal_body">
                        <div class="previewPortal_pre">
                            <div class="previewPortal_viewitem" @click="preViewNum==0?'':preViewNum-=1"><i class="iconfont icon-left1"></i></div>
                        </div>
                        <div class="previewPortal_body_item" :key="fileList[preViewNum].fileUrl" v-if="fileList[preViewNum].type.split('/')[0]=='image'">
                            <div class="previewImg_box">
                                    <img class="Imgitem" :src="fileList[preViewNum].fileUrl" alt="">
                            </div>
                        </div>
                        <div class="previewPortal_body_item" :key="fileList[preViewNum].fileUrl" v-else-if="fileList[preViewNum].type.split('/')[1]=='x-zip-compressed'||fileList[preViewNum].type.split('/')[0]=='rar'">
                            <div class="previewImg_box">
                                <div class="tips_box">
                                    <div>我们暂不支持预览该文件的</div>
                                    <div>您需要下载后查看</div>
                                </div>
                            </div>
                        </div>
                        <div class="previewPortal_body_item" v-else :key="fileList[preViewNum].fileUrl">
                            <div class="previewImg_box">
                                <iframe v-if="fileList[preViewNum].type=='pdf'" id="ifm" style="width:100%;height:calc(100% + 57px);padding-bottom:55px;"
                                src="http://queshu.oss-cn-beijing.aliyuncs.com/private/1367689524087357440/20211028/ab3f5cfd-d330-4fed-ab23-9a469b07db3a-31151775-fefb-4676-aea6-7e52f5a8f331-%E6%B5%8B%E8%AF%95%E6%96%87%E6%A1%A3.pdf?Expires=1636969563&OSSAccessKeyId=LTAI5tEF51D15RajvPfaVwZz&Signature=lCLQEfliZCvt%2BDDWPdHTOS6cNvw%3D" frameborder="0"></iframe>
                                <iframe v-else id="ifm" style="width:100%;height:calc(100% + 80px);padding-bottom:100px;"
                                    :src="'https://view.officeapps.live.com/op/view.aspx?src='+encodeURIComponent(fileList[preViewNum].fileUrl)" frameborder="0">
                                </iframe>
                            </div>
                        </div>
                        <div class="previewPortal_next">
                            <div class="previewPortal_viewitem" @click="preViewNum==fileList.length-1?'':preViewNum+=1"><i class="iconfont icon-down1"></i></div>
                        </div>
                    </div>
            </div>
    </div>
</template>
<script>

export default {
    name: "preview",
    data() {
        return {
            fileList:[],
            preViewNum:0
        };
    },
    props:{
        value:{
            type:Array,
            default:function(){
                return []
            }
        },
        cPreViewNum:0,
        downloadUrl:''
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
        },
        cPreViewNum:{
            handler(val,oldval){
                this.preViewNum = val||0
            },
            immediate: true,
            deep: true
        },
    },
    mounted() {
        
    },
    methods: {
      installfile(item,index){
            this.$http.post(this.downloadUrl,{
                    　　file_id:item.fileId
                }).then(res => {
                    var Temp = document.createElement("a");
                    Temp.href = res.payload;
                    Temp.download =this.value[index].filename
                    Temp.click();
            })
      },
        closeDailog(){
            this.$emit('closeDailog')
        },
    }
};
</script>
<style lang="scss">

</style>

