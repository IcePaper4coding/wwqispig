/*
 * 工具类方法
 */
import axios from 'axios'
export default {

    getAll(){
       return axios({
                method:'post',
                url:'http://47.115.7.143:8080/getAll',
                data:{}
            })     
    },
    add(id,obj){
      return  axios({
            method:'post',
            url:'http://47.115.7.143:8080/add',
            data:{
                id :id,
                jsonmap:JSON.stringify(obj) 
            }
        })  
    },
    change(id,info,callback){
        axios({
            method:'post',
            url:'http://47.115.7.143:8080/update',
            data:{
                id:id,
                jsonmap:JSON.stringify(info) 
            }
        }).then(()=>{
            callback()
            
        })
    },
    delete(iid){
       return axios({
            method:'post',
            url:'http://47.115.7.143:8080/delete',
            data:{id:iid}
        })
    },
    query(iid){
       return axios({
            method:'post',
            url:'http://47.115.7.143:8080/query',
            data:{id:iid}
        })
    },
    checklogin(okfunc,nofunc){
        var token = localStorage.getItem('wqbytoken')
        if(token){
            var num = JSON.parse(token).id
            console.log(JSON.parse(token).istoken);
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
            url:'http://47.115.7.143:8080/upload',
            data:formObj
        })
    },
    proxy(obj){
        return axios({
             method:'post',
             url:'http://47.115.7.143:8080/http/proxyRequest',
             data:obj
         })
     },
};
