import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {
    calc_avg_gpa,
    sum_credit,
    guess_score_from_gpa,
    fix,
    course_gpa_from_normalized_score,
    score_tampered
} from './score_parser';
import CourseViewer from './CourseViewer';
import {RowLayout, VerticalLayout} from './Layout';
import {colorize_semester, colorize_new_block} from './colorize';
import {read_all} from './actions';

import './SemesterViewer.css';

function ReadAllButton(props) {
    return (
        <button onClick={props.onClick} className="read-all-button">已阅</button>
    );
}

function SemesterViewer(props) {
    let is_new_block=props.sem._new_block===true;

    let sem_credit=sum_credit(props.courses,props.sem.course_list);
    let sem_gpa=calc_avg_gpa(props.courses,props.sem.course_list);
    let sem_score=guess_score_from_gpa(sem_gpa);
    let tampered=score_tampered(props.sem.course_list.map((idx)=>props.courses[idx]));

    let sorted_course_list=props.sem.course_list.sort((id1,id2)=>{
        let s1=course_gpa_from_normalized_score(props.courses[id1].score);
        let s2=course_gpa_from_normalized_score(props.courses[id2].score);
        return s2!==s1 ? s2-s1 : id2-id1;
    });

    return (
        <div className="semester-block">
            <div className={tampered ? 'row-tampered' : ''}>
                <RowLayout
                    left={
                        <VerticalLayout up={fix(sem_credit,1)} down="学分" />
                    }
                    middle={
                        <VerticalLayout up={props.sem.name} down={`共 ${props.sem.course_list.length} 门课程`} />
                    }
                    right={
                        is_new_block ?
                            <ReadAllButton onClick={props.read_all} /> :
                            <VerticalLayout up={sem_gpa.toFixed(2)} down={fix(sem_score,1)} need_hide_text />
                    }
                    style={{
                        backgroundColor: is_new_block ? colorize_new_block() : colorize_semester(sem_score,props.judge_by_gpa),
                    }}
                />
            </div>
            {sorted_course_list.map((idx)=>(
                <CourseViewer co_idx={idx} key={idx} />
            ))}
        </div>
    );
}

let state_to_props=(state,ownProps)=>({
    courses: state.data.courses,
    judge_by_gpa: state.display_switch.judge_by_gpa,
});
let dispatch_to_props=(dispatch)=>({
    read_all: ()=>dispatch(read_all()),
});

export default connect(state_to_props,dispatch_to_props)(SemesterViewer);