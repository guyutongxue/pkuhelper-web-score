import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import SemesterViewer from './SemesterViewer';
import OverallViewer from './OverallViewer';
import NewBlockViewer from './NewBlockViewer';
import {Time} from './infrastructure/widgets';

import './Viewer.css';
import {do_load} from './actions';

function Viewer(props) {
    return (
        <div>
            <p className="refresh-time-line print-hide">
                <a onClick={props.do_refresh}>刷新</a> &nbsp;
                <Time stamp={props.last_load_timestamp/1000} /> 更新
            </p>
            <div className="viewer">
                {props.new_block_list.length>0 &&
                    <NewBlockViewer />
                }
                {props.data.semesters.map((sem)=>(
                    <SemesterViewer sem={sem} key={sem.name} />
                ))}
                <OverallViewer />
            </div>
        </div>
    );
}

let state_to_props=(state)=>({
    data: state.data,
    new_block_list: state.data.new_block,
    last_load_timestamp: state.last_load_timestamp,
});
let dispatch_to_props=(dispatch)=>({
    do_refresh: ()=>dispatch(do_load()),
});

export default connect(state_to_props,dispatch_to_props)(Viewer);