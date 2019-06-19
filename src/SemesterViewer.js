import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {calc_avg_gpa} from './score_parser';
import CourseViewer from './CourseViewer';

function SemesterViewer(props) {
    let sem_gpa=calc_avg_gpa(props.courses,props.sem.course_list);
    return (
        <div>
            <hr />
            <p><b>{props.sem.name}</b> GPA: {sem_gpa.toFixed(3)}</p>
            {props.sem.course_list.map((idx)=>(
                <CourseViewer co_idx={idx} />
            ))}
        </div>
    );
}

let state_to_props=(state,ownProps)=>({
    courses: state.data.courses,
});

export default connect(state_to_props)(SemesterViewer);