import {parse_score} from './score_parser';

const INIT_STATE={
    loading_status: 'not_init',
    isop_token: null,
    data: null,
    display_switch: {
        hide_text: false,
        judge_by_gpa: false,
    },
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

        case 'toggle_switch':
            return {
                ...state,
                display_switch: Object.assign({},state.display_switch,{
                    [action.name]: !state.display_switch[action.name]
                })
            };

        case 'tamper_score':
            return {
                ...state,
                data: {
                    ...state.data,
                    courses: state.data.courses.map((co,idx)=>
                        idx===action.idx ? {
                            ...co,
                            score: action.score,
                        } : co
                    ),
                },
            };
        case 'untamper_score':
            return {
                ...state,
                data: {
                    ...state.data,
                    courses: state.data.courses.map((co,idx)=>
                        (action.idx===null || idx===action.idx) ? {
                            ...co,
                            score: co.true_score,
                        } : co
                    ),
                },
            };

        default:
            return state;
    }
}