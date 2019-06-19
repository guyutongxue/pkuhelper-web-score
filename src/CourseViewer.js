import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';

function CourseViewer(props) {
    return (
        <p>
            {props.course.name} - {props.course.credit}学分 -
            分数 {props.course.score} - GPA {props.course.gpa!==null ? props.course.gpa.toFixed(3) : '(null)'}
        </p>
    );
}

let state_to_props=(state,ownProps)=>({
    course: state.data.courses[ownProps.co_idx],
});

export default connect(state_to_props)(CourseViewer);