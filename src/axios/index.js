import axios from 'axios';
import { Modal } from 'antd';
import {commonUrl} from "./commonSrc";

axios.defaults.withCredentials=true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default class Axios {

    static ajax(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }




        //let baseApi = '/api';
        //let baseApi = 'http://172.26.103.203:8080';
       // let baseApi = 'http://47.101.178.24:8080';
        //let baseApi = 'http://localhost:8080';

       // let baseApi = 'http://106.15.181.173:8080';
       // let baseApi = 'http://127.0.0.1:8080';


        //成功返回resolve,失败reject
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:commonUrl,
                params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    if (res.status == 'success'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.data.errMsg
                        })
                        if (res.data.errMsg=='请登录') {
                            window.location.href = '#login';
                        }
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }

    static PostAjax(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }

        //let baseApi = '/api';
       //   let baseApi = 'http://47.101.178.24:8080';
       //let baseApi = 'http://172.26.103.203:8080';
        //let baseApi = 'http://localhost:8080';

       // let baseApi = 'http://localhost:8080';

        //成功返回resolve,失败reject
        return new Promise((resolve,reject)=>{
            axios.post(
                commonUrl+options.url,

                (options.data && options.data.params) || ''

            ).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    if (res.status == 'success'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.data.errMsg
                        })
                        if (res.data.errMsg=='请登录') {
                            window.location.href = '#login';
                        }
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }

    static noLoadingAjax(options){
        //成功返回resolve,失败reject
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:commonUrl,
                params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if (response.status == '200'){
                    let res = response.data;
                    if (res.status == 'success'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.data.errMsg
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }
}