import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {do_init, do_load} from './actions';
import Viewer from './Viewer';
import OsuButton from './OsuButton';
import Controller from './Controller';

class App extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if(this.props.loading_status==='not_init')
            this.props.do_init();
    }
    render_viewer() {
        if(this.props.loading_status==='not_init')
            return (<OsuButton text="" button_text="…" disabled />);
        else if(this.props.loading_status==='initing')
            return (<OsuButton text="正在初始化……" button_text="…" disabled />);
        else if(this.props.loading_status==='init_error')
            return (<OsuButton text={this.props.error} button_text="!" disabled />);
        else if(this.props.loading_status==='ready')
            return (
                <OsuButton text="点击按钮查询成绩" button_text="查询" onClick={this.props.do_load} />
            );
        else if(this.props.loading_status==='loading')
            return (<OsuButton text="正在查询……" button_text="…" disabled />);
        else if(this.props.loading_status==='load_error')
            return (<OsuButton text={this.props.error} button_text="!" disabled />);
        else if(this.props.loading_status==='done')
            return (<Viewer />);
        else
            return null;
    }
    render() {
        return (
            <div>
                <Controller />
                {this.render_viewer()}
            </div>
        );
    }
}

let state_to_props=(state)=>({
    loading_status: state.loading_status,
    isop_token: state.isop_token,
    error: state.error,
});

let dispatch_to_props=(dispatch)=>({
    do_init: ()=>dispatch(do_init()),
    do_load: ()=>dispatch(do_load()),
});

export default connect(state_to_props,dispatch_to_props)(App);