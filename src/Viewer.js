import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {calc_avg_gpa} from './score_parser';
import SemesterViewer from './SemesterViewer';

function Viewer(props) {
    let gpa=calc_avg_gpa(props.data.courses,Object.keys(props.data.courses));
    return (
        <div>
            <p>GPA: {gpa.toFixed(3)} / from ISOP: {props.data.true_gpa}</p>
            {props.data.semesters.map((sem)=>(
                <SemesterViewer sem={sem} />
            ))}
        </div>
    );
}

let state_to_props=(state)=>({
    data: state.data,
});

export default connect(state_to_props)(Viewer);