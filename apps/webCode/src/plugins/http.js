/*
 * 工具类方法
 */
import axios from 'axios'
export default {

    getAll(){
       return axios({
                method:'post',
                url:'http://47.94.235.210:8090/queryData/AllData',
                data:{}
            })     
    },
    add(id,obj){
      return  axios({
            method:'post',
            url:'http://47.94.235.210:8090/queryData/addDataById',
            data:{
                id :String(id),
                jsonmap:JSON.stringify(obj) 
            }
        })  
    },
    change(id,info,callback){
        axios({
            method:'post',
            url:'http://47.94.235.210:8090/queryData/updateDataById',
            data:{
                id:String(id),
                jsonmap:JSON.stringify(info) 
            }
        }).then(()=>{
            callback()
            
        })
    },
    delete(iid){
       return axios({
            method:'post',
            url:'http://47.94.235.210:8090/queryData/delDataById',
            data:{id:String(iid)}
        })
    },
    query(iid){
       return axios({
            method:'post',
            url:'http://47.94.235.210:8090/queryData/queryDataById',
            data:{id:String(iid)}
        })
    },
    checklogin(okfunc,nofunc){
        var token = localStorage.getItem('wqbytoken')
        if(token){
            var num = JSON.parse(token).id
            this.query(num).then(res=>{
               if(res.data==''){
                    nofunc()
                    return
               }
                if(JSON.parse(token).istoken == JSON.parse(res.data.jsonmap).token){
                    okfunc()
                }
                else{
                    nofunc()
                }

            })
        }
        else{
            nofunc()
        }
    },
    upload(formObj){
        return axios({
            method:'post',
            url:'http://47.94.235.210:8090/upload',
            data:formObj
        })
    },
    proxy(obj){
        return axios({
             method:'post',
             url:'http://47.94.235.210:8090/http/proxyRequest',
             data:obj
         })
     },
};
