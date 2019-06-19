import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {toggle_switch} from './actions';

import './Controller.css';

function Controller(props) {
    return (
        <p className="controller-bar">
            <a onClick={()=>props.do_switch('hide_text')}>
                {props.display_switch.hide_text ? '截图模式' : '查看模式'}
            </a>
            &nbsp;/&nbsp;
            <a onClick={()=>props.do_switch('judge_by_gpa')}>
                {props.display_switch.judge_by_gpa ? '四分制着色' : '百分制着色'}
            </a>
        </p>
    );
}

let state_to_props=(state)=>({
    display_switch: state.display_switch,
});
let dispatch_to_props=(dispatch)=>({
    do_switch: (name)=>dispatch(toggle_switch(name)),
});

export default connect(state_to_props,dispatch_to_props)(Controller);