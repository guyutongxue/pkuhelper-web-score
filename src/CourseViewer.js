import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {fix, describe, course_gpa_from_normalized_score, score_tampered} from './score_parser';
import {RowLayout,VerticalLayout} from './Layout';
import {colorize_course,colorize_coursebar} from './colorize';
import {tamper_score, untamper_score} from './actions';

import './CourseViewer.css';

function make_score_gradient(score,judge_by_gpa) {
    let [fgcolorl,fgcolorr,width]=colorize_coursebar(score,judge_by_gpa);
    let bgcolor=colorize_course(score,judge_by_gpa);
    let width_perc=(width*100)+'%';
    return {
        background: `linear-gradient(to right, ${fgcolorl}, ${fgcolorr} ${width_perc}, ${bgcolor} ${width_perc})`,
    };
}

class ScoreTamperer extends Component {
    constructor(props) {
        super(props);
        this.editor_ref=React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if(this.editor_ref.current)
            this.editor_ref.current.value=nextProps.score;
    }

    on_blur() {
        this.props.onChange(this.editor_ref.current.value);
        this.editor_ref.current.value=this.props.score; // will be changed from componentWillReceiveProps if score is valid
    }

    on_key(e) {
        if(e.key==='Enter') {
            this.editor_ref.current.blur();
        }
    }

    render() {
        return (
            <input ref={this.editor_ref} defaultValue={this.props.score} className="score-tamperer"
                   onBlur={this.on_blur.bind(this)} onKeyPress={this.on_key.bind(this)} />
        );
    }
}

function CourseViewer(props) {
    let tampered=score_tampered([props.course]);
    let gpa=course_gpa_from_normalized_score(props.course.score);

    if(!tampered && gpa!==null && !isNaN(props.course.isop_gpa)) gpa=parseFloat(props.course.isop_gpa);

    function do_course_survey() {
        if(window._course_survey_asked || window.confirm(
            `为《${props.course.name}》填写课程测评，让更多的人了解这门课程！\n\n`+
            '* 课程测评并非由PKUHelper运营。你同意将这门课的成绩分享给该网站。你的身份信息和其他课的成绩仍将保密。'
        )) {
            window._course_survey_asked=true;
            window.open(
                'https://courses.pinzhixiaoyuan.com/reviews/post_external'+
                `?course=${encodeURIComponent(props.course.course_id)}&course_name=${encodeURIComponent(props.course.name)}`+
                `&term=${encodeURIComponent(props.course.sem_orig)}&teacher=${encodeURIComponent(props.course.first_teacher)}`+
                `&score=${encodeURIComponent(props.course.score)}&platform=pkuhelper_web_score`
            )
        }
    }

    return (
        <div className={'course-row'+(tampered ? ' row-tampered' : '')}>
            <RowLayout
                left={
                    <VerticalLayout up={fix(props.course.credit,1)} down="学分" />
                }
                middle={
                    <VerticalLayout
                        up={
                            <span>
                                {
                                    tampered ?
                                    <span className="course-badge course-badge-danger" onClick={props.untamper} data-tooltip="Unranked">
                                        <span className="icon icon-warning" />
                                    </span> :
                                    <span className="course-badge course-badge-primary" onClick={do_course_survey} data-tooltip="测评该课程">
                                        <span className="icon icon-share" />
                                    </span>
                                }
                                {props.course.name}
                            </span>
                        }
                        down={props.course.details}
                        need_hide_text
                    />
                }
                right={
                    <VerticalLayout
                        up={
                            <ScoreTamperer score={fix(props.course.score,1)} onChange={props.tamper_score} />
                        }
                        down={gpa!==null ? gpa.toFixed(2) : describe(props.course.score)}
                        need_hide_text={gpa!==null || props.course.score<60}
                    />
                }
                style={make_score_gradient(props.course.score,props.judge_by_gpa)}
            />
        </div>
    );
}

let state_to_props=(state,ownProps)=>({
    course: state.data.courses[ownProps.co_idx],
    judge_by_gpa: state.display_switch.judge_by_gpa,
});
let dispatch_to_props=(dispatch,ownProps)=>({
    tamper_score: (score)=>dispatch(tamper_score(ownProps.co_idx,score)),
    untamper: ()=>dispatch(untamper_score(ownProps.co_idx)),
});

export default connect(state_to_props,dispatch_to_props)(CourseViewer);