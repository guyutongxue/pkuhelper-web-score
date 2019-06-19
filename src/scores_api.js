import {ISOP_APPCODE,ISOP_APPKEY,ISOP_SVCID,PKUHELPER_ROOT} from './infrastructure/const';
import {get_json} from './infrastructure/functions';
import md5 from 'md5';

export function get_isop_token() {
    return new Promise((resolve,reject)=>{
        let user_token=encodeURIComponent(localStorage['TOKEN']);
        if(!user_token) reject('no user token');

        fetch(PKUHELPER_ROOT+'api_xmcp/score/get_isop_token?user_token='+user_token)
            .then(get_json)
            .then((json)=>{
                if(json.error!==null)
                    throw new Error(json.error);
                resolve(json.token);
            })
            .catch(reject);
    });
}

export function get_score(isop_token) {
    return new Promise((resolve,reject)=>{
        let token=isop_token.substr(5); // remove isop_
        let arg=`user=${token}&appKey=${ISOP_APPKEY}&timestamp=${+new Date()}`;
        fetch(PKUHELPER_ROOT+`isop_proxy/scores?${arg}&msg=${md5(arg+ISOP_APPCODE)}`)
            .then(get_json)
            .then((json)=>{
                if(!json.success)
                    throw new Error(JSON.stringify(json));
                resolve(json);
            })
            .catch(reject);
    })
}