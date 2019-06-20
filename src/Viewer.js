import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {calc_avg_gpa} from './score_parser';
import SemesterViewer from './SemesterViewer';
import OverallViewer from './OverallViewer';

import './Viewer.css';

function Viewer(props) {
    return (
        <div className="viewer">
            <OverallViewer />
            {props.data.semesters.map((sem)=>(
                <SemesterViewer sem={sem} key={sem.name} />
            ))}
        </div>
    );
}

let state_to_props=(state)=>({
    data: state.data,
});

export default connect(state_to_props)(Viewer);