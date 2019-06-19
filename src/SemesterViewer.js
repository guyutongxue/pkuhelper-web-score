import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {calc_avg_gpa, sum_credit, guess_score_from_gpa, fix} from './score_parser';
import CourseViewer from './CourseViewer';
import {RowLayout, VerticalLayout} from './Layout';
import {colorize_semester} from './colorize';

import './SemesterViewer.css';


function SemesterViewer(props) {
    let sem_credit=sum_credit(props.courses,props.sem.course_list);
    let sem_gpa=calc_avg_gpa(props.courses,props.sem.course_list);
    let sem_score=guess_score_from_gpa(sem_gpa);
    return (
        <div className="semester-block">
            <RowLayout
                left={
                    <VerticalLayout up={fix(sem_credit,1)} down="学分" />
                }
                middle={
                    <VerticalLayout up={props.sem.name} down="……" />
                }
                right={
                    <VerticalLayout up={sem_gpa.toFixed(2)} down={fix(sem_score,1)} need_hide_text />
                }
                style={{
                    backgroundColor: colorize_semester(sem_score,props.judge_by_gpa),
                }}
            />
            {props.sem.course_list.map((idx)=>(
                <CourseViewer co_idx={idx} key={idx} />
            ))}
        </div>
    );
}

let state_to_props=(state,ownProps)=>({
    courses: state.data.courses,
    judge_by_gpa: state.display_switch.judge_by_gpa,
});

export default connect(state_to_props)(SemesterViewer);