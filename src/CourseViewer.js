import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {fix, describe, course_gpa_from_normalized_score, score_tampered} from './score_parser';
import {RowLayout,VerticalLayout} from './Layout';
import {colorize_course,colorize_backbar} from './colorize';
import {tamper_score, untamper_score} from './actions';

import './CourseViewer.css';

function RowBackbar(props) {
    let [color,width]=colorize_backbar(props.score,props.judge_by_gpa);
    return (
        <div className="row-backbar" style={{backgroundColor: color, width: (100*width)+'%'}} />
    )
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

function TamperedBadge(props) {
    return (
        <span className="tampered-badge" onClick={props.onClick} title="Unranked">
            ⚠
        </span>
    );
}

function CourseViewer(props) {
    let gpa=course_gpa_from_normalized_score(props.course.score);
    let tampered=score_tampered([props.course]);

    return (
        <div className={tampered ? 'row-tampered' : ''}>
            <RowBackbar
                score={props.course.score} judge_by_gpa={props.judge_by_gpa}
            />
            <RowLayout
                left={
                    <VerticalLayout up={fix(props.course.credit,1)} down="学分" />
                }
                middle={
                    <VerticalLayout
                        up={
                            <span>
                                {!!tampered && <TamperedBadge onClick={props.untamper} />}
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
                style={{
                    backgroundColor: colorize_course(props.course.score,props.judge_by_gpa),
                }}
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