import {PKUHELPER_ROOT} from './infrastructure/const';
import {get_json} from './infrastructure/functions';

export const LoginRequiredError='login required';

export function get_score(user_token,is_auto) {
    return new Promise((resolve,reject)=>{
        fetch(PKUHELPER_ROOT+'api_xmcp/isop/scores?user_token='+encodeURIComponent(user_token)+'&auto='+(is_auto?'yes':'no'))
            .then(get_json)
            .then((json)=>{
                if(!json.success) {
                    if(json.errCode && ['E01','E02','E03'].indexOf(json.errCode)!==-1)
                        throw LoginRequiredError;
                    else
                        throw new Error(JSON.stringify(json));
                }
                resolve(json);
            })
            .catch(reject);
    })
}