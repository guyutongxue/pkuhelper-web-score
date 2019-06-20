import {course_gpa_from_normalized_score} from './score_parser';

function prec(score,judge_by_gpa) {
    if(!judge_by_gpa) return (score-60)/40.;
    else {
        let gpa=course_gpa_from_normalized_score(score);
        return (gpa-1)/3.;
    }
}

export function colorize_semester(score,judge_by_gpa) {
    if(isNaN(score)) return 'hsl(0,100%,65%)';
    return `hsl(${120*prec(score,judge_by_gpa)},100%,65%)`
}

export function colorize_course(score,judge_by_gpa) {
    if(isNaN(score) || score<60) return 'hsl(0,0%,70%)';
    return `hsl(${120*prec(score,judge_by_gpa)},60%,50%)`
}

export function colorize_backbar(score,judge_by_gpa) {
    let color,width;
    if(isNaN(score) || score<60) {
        color='hsl(0,0%,70%)';
        width=0;
    } else {
        let p=prec(score,judge_by_gpa);
        color=`hsl(${120*p},100%,65%)`;
        width=p;
    }
    return [color,width];
}
