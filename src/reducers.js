import {parse_score} from './score_parser';

const INIT_STATE={
    loading_status: 'not_init',
    isop_token: null,
    data: null,
};

export function reduce(state=INIT_STATE,action) {
    switch(action.type) {
        case 'init_begin':
            return {
                ...state,
                loading_status: 'initing',
                error: null,
            };
        case 'init_ok':
            return {
                ...state,
                loading_status: 'ready',
                error: null,
                isop_token: action.isop_token,
            };
        case 'init_error':
            return {
                ...state,
                loading_status: 'init_error',
                error: action.error,
            };

        case 'load_begin':
            return {
                ...state,
                loading_status: 'loading',
                error: null,
            };
        case 'load_error':
            return {
                ...state,
                loading_status: 'load_error',
                error: action.error,
            };
        case 'load_done':
            return {
                ...state,
                data: parse_score(action.data),
                loading_status: 'done',
                error: null,
            };

        default:
            return state;
    }
}