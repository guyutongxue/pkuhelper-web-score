import {get_isop_token,get_score} from './scores_api';

export function do_init() {
    return (dispatch)=>{
        dispatch({
            type: 'init_begin'
        });
        get_isop_token()
            .then((token)=>{
                dispatch({
                    type: 'init_ok',
                    isop_token: token,
                });
            })
            .catch((err)=>{
                dispatch({
                    type: 'init_error',
                    error: ''+err,
                });
            });
    };
}

export function do_load() {
    return (dispatch,getState)=>{
        let {isop_token}=getState();
        if(isop_token) {
            dispatch({
                type: 'load_begin',
            });
            get_score(isop_token)
                .then((res)=>{
                    dispatch({
                        type: 'load_done',
                        data: res,
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
                error: 'no isop token',
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