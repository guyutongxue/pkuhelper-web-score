import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {calc_avg_gpa, sum_credit, guess_score_from_gpa, fix, score_tampered} from './score_parser';
import {RowLayout, VerticalLayout} from './Layout';
import {colorizeSemester} from '../app/colorize';
import {make_score_gradient} from './CourseViewer';

function OverallViewer(props) {
    let sem_credit=sum_credit(props.courses,Object.keys(props.courses));
    let sem_gpa=calc_avg_gpa(props.courses,Object.keys(props.courses));
    let sem_score=guess_score_from_gpa(sem_gpa);

    let tampered=score_tampered(props.courses);

    let cats={}; // cat -> [ids]
    Object.keys(props.courses).forEach((id)=>{
        let t=props.courses[id].type;
        if(!cats[t]) cats[t]=[];
        cats[t].push(id);
    });

    function category(name,course_list) {
        let sem_credit=sum_credit(props.courses,course_list);
        let sem_gpa=calc_avg_gpa(props.courses,course_list);
        let sem_score=guess_score_from_gpa(sem_gpa);

        let tampered=score_tampered(course_list.map((id)=>props.courses[id]));

        return [sem_score,
            <div className={'course-row'+(tampered ? ' row-tampered' : '')}>
                <RowLayout
                    left={
                        <VerticalLayout up={fix(sem_credit,1)} down="学分" />
                    }
                    middle={
                        <VerticalLayout
                            up={name}
                            down={`共 ${course_list.length} 门课程`}
                            extra={
                                <div>
                                    {course_list.map((id)=>(
                                        <p>
                                            {props.courses[id].credit}学分 -&nbsp;
                                            {props.courses[id].name} -&nbsp;
                                            {fix(props.courses[id].score,1)}
                                        </p>
                                    ))}
                                </div>
                            }
                        />
                    }
                    right={
                        <VerticalLayout up={sem_gpa!==null ? sem_gpa.toFixed(2) : '-.--'} down={fix(sem_score,1)} need_hide_text />
                    }
                    style={make_score_gradient(sem_score,props.judge_by_gpa)}
                />
            </div>
        ];
    }

    let cats_disp=[]; // list of [score,ui]
    Object.keys(cats).forEach((cat)=>{
        cats_disp.push(category(cat,cats[cat]));
    });
    cats_disp=cats_disp.sort((c1,c2)=>c2[0]-c1[0]);

    return (
        <div className="semester-block">
            <div className={tampered ? 'row-tampered' : ''}>
                <RowLayout
                    left={
                        <VerticalLayout up={fix(sem_credit,1)} down="学分" />
                    }
                    middle={
                        <VerticalLayout
                            up="总绩点"
                            down={`共 ${props.courses.length} 门课程，官方 GPA：${props.isop_gpa || '-.--'}`}
                            need_hide_text
                        />
                    }
                    right={
                        <VerticalLayout up={sem_gpa!==null ? sem_gpa.toFixed(2) : '-.--'} down={fix(sem_score,1)} need_hide_text />
                    }
                    style={{
                        backgroundColor: colorizeSemester(sem_score,props.judge_by_gpa),
                    }}
                />
            </div>
            {cats_disp.map(([_s,ui])=>ui)}
        </div>
    );
}

let state_to_props=(state,ownProps)=>({
    courses: state.data.courses,
    judge_by_gpa: state.display_switch.judge_by_gpa,
    isop_gpa: state.data.isop_gpa,
});

export default connect(state_to_props)(OverallViewer);
