import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {do_init, do_load} from './actions';
import Viewer from './Viewer';

class App extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if(this.props.loading_status==='not_init')
            this.props.do_init();
    }
    render() {
        if(this.props.loading_status==='not_init')
            return 'not init';
        else if(this.props.loading_status==='initing')
            return 'initing';
        else if(this.props.loading_status==='init_error')
            return this.props.error;
        else if(this.props.loading_status==='ready')
            return (
                <div>
                    ready
                    <button onClick={this.props.do_load()}>load</button>
                </div>
            );
        else if(this.props.loading_status==='loading')
            return 'loading';
        else if(this.props.loading_status==='load_error')
            return this.props.error;
        else if(this.props.loading_status==='done')
            return <Viewer />;
        else
            return null;
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