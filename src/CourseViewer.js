import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {fix, describe} from './score_parser';
import {RowLayout,VerticalLayout} from './Layout';
import {colorize_course,colorize_backbar} from './colorize';

import './CourseViewer.css';

function RowBackbar(props) {
    let [color,width]=colorize_backbar(props.score);
    return (
        <div className="row-backbar" style={{backgroundColor: color, width: (100*width)+'%'}} />
    )
}

function CourseViewer(props) {
    return (
        <div>
            <RowBackbar
                score={props.course.score}
            />
            <RowLayout
                left={
                    <VerticalLayout up={fix(props.course.credit,1)} down="学分" />
                }
                middle={
                    <VerticalLayout up={props.course.name} down="……" />
                }
                right={
                    <VerticalLayout up={fix(props.course.score,1)} down={props.course.gpa!==null ? props.course.gpa.toFixed(2) : describe(props.course.score)} />
                }
                style={{
                    backgroundColor: colorize_course(props.course.score),
                }}
            />
        </div>
    );
}

let state_to_props=(state,ownProps)=>({
    course: state.data.courses[ownProps.co_idx],
});

export default connect(state_to_props)(CourseViewer);