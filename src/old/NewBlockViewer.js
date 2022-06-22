import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {course_gpa_from_normalized_score, score_tampered, is_fail} from './score_parser';
import CourseViewer from './CourseViewer';
import {RowLayout, VerticalLayout} from './Layout';
import {Egg84} from './egg_84';
import {colorizeNewBlock} from '../app/colorize';
import {read_all} from './actions';

import './NewBlockViewer.css';

class NewBlockViewer extends Component {
    constructor(props) {
        super(props);
        this.state={
            hidden: false,
        };
    }

    componentDidMount() {
        if(this.props.is_auto)
            setTimeout(()=>{
                if(window.Notification && Notification.permission==='granted')
                    new Notification(
                        `新增 ${this.props.course_list.length} 门成绩`,
                        {
                            body: `${this.props.course_list.map((co)=>this.props.courses[co].name).join('、')}`,
                            tag: 'score',
                        }
                    );
            },300);
    }

    read_all() {
        this.setState({
            hidden: true,
        },()=>{
            setTimeout(()=>{
                this.props.read_all();
            },250);
        })
    }

    render() {
        let props=this.props;

        let sorted_course_list=props.course_list.sort((id1,id2)=>{
            let s1=course_gpa_from_normalized_score(props.courses[id1].score);
            let s2=course_gpa_from_normalized_score(props.courses[id2].score);
            let f1=is_fail(props.courses[id1].score);
            let f2=is_fail(props.courses[id2].score);
            return s2!==s1 ? s2-s1 : f1!==f2 ? f2-f1 : id2-id1;
        });

        let is_all_normal_distr=props.course_list.every((id)=> {
            let sc=props.courses[id].score;
            return !isNaN(sc) && sc>83.9995 && sc<84.9995;
        });

        return (
            <div className={'semester-block new-block'+(this.state.hidden ? ' new-block-hidden' : '')}>
                <div>
                    {is_all_normal_distr && <Egg84 />}
                    <RowLayout
                        left={null}
                        middle={
                            <VerticalLayout up={`新增${is_all_normal_distr ? '正态' : '成绩'}`} down={`共 ${props.course_list.length} 门课程`} />
                        }
                        right={
                            <button onClick={this.read_all.bind(this)} disabled={this.state.hidden} className="read-all-button">已阅</button>
                        }
                        style={{
                            backgroundColor: colorizeNewBlock(),
                        }}
                    />
                </div>
                {sorted_course_list.map((idx)=>(
                    <CourseViewer co_idx={idx} key={idx} />
                ))}
            </div>
        );
    }
}

let state_to_props=(state)=>({
    courses: state.data.courses,
    course_list: state.data.new_block,
    is_auto: state.data.is_auto,
});
let dispatch_to_props=(dispatch)=>({
    read_all: ()=>dispatch(read_all()),
});

export default connect(state_to_props,dispatch_to_props)(NewBlockViewer);
