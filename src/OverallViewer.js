import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {calc_avg_gpa, sum_credit, guess_score_from_gpa, fix, score_tampered} from './score_parser';
import {RowLayout, VerticalLayout} from './Layout';
import {colorize_semester} from './colorize';

function OverallViewer(props) {
    let sem_credit=sum_credit(props.courses,Object.keys(props.courses));
    let sem_gpa=calc_avg_gpa(props.courses,Object.keys(props.courses));
    let sem_score=guess_score_from_gpa(sem_gpa);

    let tampered=score_tampered(props.courses);

    return (
        <div className="semester-block">
            <div className={tampered ? 'row-tampered' : ''}>
                <RowLayout
                    left={
                        <VerticalLayout up={fix(sem_credit,1)} down="学分" />
                    }
                    middle={
                        <VerticalLayout up="总绩点" down={`共 ${props.courses.length} 门课程 - 官方 GPA：${props.isop_gpa}`} />
                    }
                    right={
                        <VerticalLayout up={sem_gpa.toFixed(2)} down={fix(sem_score,1)} need_hide_text />
                    }
                    style={{
                        backgroundColor: colorize_semester(sem_score,props.judge_by_gpa),
                    }}
                />
            </div>
        </div>
    );
}

let state_to_props=(state,ownProps)=>({
    courses: state.data.courses,
    judge_by_gpa: state.display_switch.judge_by_gpa,
    isop_gpa: state.data.isop_gpa,
});

export default connect(state_to_props)(OverallViewer);