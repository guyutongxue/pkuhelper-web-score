import {course_gpa_from_normalized_score,guess_score_from_gpa} from './score_parser';

function prec(score,judge_by_gpa) {
    if(judge_by_gpa) {
        let gpa=course_gpa_from_normalized_score(score);
        return (gpa-1)/3.;
    } else {
        score=guess_score_from_gpa(course_gpa_from_normalized_score(score)); // like A+
        return (score-60)/40.;
    }
}

function cannot_judge(score) {
    return course_gpa_from_normalized_score(score)===null;
}

export function colorize_semester(score,judge_by_gpa) {
    if(cannot_judge(score)) return 'hsl(0,100%,65%)';
    return `hsl(${120*prec(score,judge_by_gpa)},100%,65%)`
}

export function colorize_course(score,judge_by_gpa) {
    if(cannot_judge(score) || score<60) return 'hsl(0,0%,70%)';
    return `hsl(${120*prec(score,judge_by_gpa)},60%,55%)`
}

export function colorize_backbar(score,judge_by_gpa) {
    let color,width;
    if(cannot_judge(score) || score<60) {
        color='hsl(0,0%,70%)';
        width=0;
    } else {
        let p=prec(score,judge_by_gpa);
        color=`hsl(${120*p},100%,65%)`;
        width=Math.max(p,.01);
    }
    return [color,width];
}

export function colorize_new_block() {
    return 'hsl(0,0%,90%)';
}