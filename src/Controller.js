import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {toggle_switch,do_load} from './actions';

import './Controller.css';

const REFRESH_TIME=300;

class AutoRefreshController extends Component {
    constructor(props) {
        super(props);
        this.state={
            time_left: null,
        };
        this.interval=null;
        this.toggle_bound=this.toggle.bind(this);
    }

    toggle() {
        this.setState((prevState)=>{
            if(prevState.time_left===null) {
                this.interval=setInterval(this.tick.bind(this),1000);
                return {
                    time_left: REFRESH_TIME,
                };
            } else {
                if(this.interval) {
                    clearInterval(this.interval);
                    this.interval=null;
                }
                return {
                    time_left: null,
                };
            }
        });
    }

    tick() {
        this.setState((prevState)=>{
            let t=prevState.time_left;
            if(t!==null) {
                if(t===0) {
                    t=REFRESH_TIME;
                    this.props.fire();
                }
                return {
                    time_left: t-1,
                };
            } else
                return prevState;
        });
    }

    render() {
        if(this.state.time_left===null)
            return (<a onClick={this.toggle_bound}>自动刷新</a>);
        else
            return (<a onClick={this.toggle_bound}>{this.state.time_left}s后刷新</a>);
    }
}

function Controller(props) {
    return (
        <p className="controller-bar">
            <AutoRefreshController fire={props.do_refresh} />
            &nbsp;/&nbsp;
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
    do_refresh: ()=>dispatch(do_load()),
});

export default connect(state_to_props,dispatch_to_props)(Controller);