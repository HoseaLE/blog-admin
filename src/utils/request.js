import fetch from 'dva/fetch';
import { message } from 'antd';
import querystring from 'querystring';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      const error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }
  
function parseJSON(response) {
    return response.json()
}
  
function request(url,option){
    return fetch(url,option)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => ({data}))
        .catch(err=>({err}))
}

function checkData(res){
    if(res.hasOwnProperty('err')){
        const des = res.err.response.status + " " + res.err.response.statusText
        message.error(des)
        return false;
    }else if(res.data.status!=1){
        if(res.data.error){
            message.error(res.data.error)
        }
        return false;
    }else{
        return true;
    }
}

async function query(url,body){
    let path = url;
    if(body){
        path = url+ "?" + querystring.stringify(body);
    }
    const res = await request(path,{method:"GET",credentials: 'include'})
    if(checkData(res)){
        return res.data
    }else{
        return Promise.reject("出错了")
    }
}

async function post(url,body){
    const res = await request(url,{
        method:"POST", 
        credentials: 'include',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    })
    if(checkData(res)){
        return res.data
    }else{
        return Promise.reject("出错了")
    }
}

async function upload(url,body){
  const res = await request(url,{method:"POST", credentials: 'include',body: body })
  if(checkData(res)){
      return res.data
  }else{
      return Promise.reject("出错了")
  }
}

export { query, post, upload }
