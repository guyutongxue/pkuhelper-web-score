import {get_score} from './scores_api';
import {check_score} from './score_parser';
import {shown_score_helper} from './shown_score_helper';

//import fake_score from './fake_score';

export function do_init() {
    return (dispatch)=>{
        if(localStorage['TOKEN'])
            dispatch({
                type: 'init_ok',
                user_token: localStorage['TOKEN'],
            });
        else
            dispatch({
                type: 'init_error',
                error: '请前往树洞登录账号',
            });
    };
}

export function do_load(is_auto=false) {
    return (dispatch,getState)=>{
        let {user_token}=getState();
        if(user_token) {
            dispatch({
                type: 'load_begin',
            });
            get_score(user_token,is_auto)
                .then((res)=>{
                    dispatch({
                        type: 'load_done',
                        data: res,
                        is_auto: is_auto,
                        timestamp: +new Date(),
                    })
                })
                .catch((err)=>{
                    dispatch({
                        type: 'load_error',
                        error: ''+err,
                    });
                });
        } else {
            dispatch({
                type: 'load_error',
                error: 'no user_token',
            })
        }
    };
}

export function toggle_switch(name) {
    return {
        type: 'toggle_switch',
        name: name,
    }
}

export function tamper_score(idx,score) {
    score=score.trim();
    if(score.length>4) return {type: null};
    score=score.toUpperCase();
    if(!check_score(score)) return {type: null};
    return {
        type: 'tamper_score',
        idx: idx,
        score: score,
    }
}

export function untamper_score(idx) {
    return {
        type: 'untamper_score',
        idx: idx===undefined ? null : idx,
    }
}

export function read_all() {
    return (dispatch)=>{
        shown_score_helper.apply();
        return dispatch({
            type: 'read_all',
        });
    };
}