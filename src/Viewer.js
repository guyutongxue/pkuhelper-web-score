import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import SemesterViewer from './SemesterViewer';
import OverallViewer from './OverallViewer';
import NewBlockViewer from './NewBlockViewer';

import './Viewer.css';

function Viewer(props) {
    return (
        <div className="viewer">
            {props.new_block_list.length>0 &&
                <NewBlockViewer />
            }
            {props.data.semesters.map((sem)=>(
                <SemesterViewer sem={sem} key={sem.name} />
            ))}
            <OverallViewer />
        </div>
    );
}

let state_to_props=(state)=>({
    data: state.data,
    new_block_list: state.data.new_block,
});

export default connect(state_to_props)(Viewer);