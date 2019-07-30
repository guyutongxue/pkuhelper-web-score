import {course_gpa_from_normalized_score, guess_score_from_gpa, is_fail} from './score_parser';

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
    if(cannot_judge(score)) return 'hsl(240,50%,90%)';
    return `hsl(${120*prec(score,judge_by_gpa)},${judge_by_gpa ? 97: 100}%,70%)`
}

export function colorize_course(score,judge_by_gpa) {
    if(cannot_judge(score) || score<60) return 'hsl(340,60%,65%)';
    return `hsl(${120*prec(score,judge_by_gpa)},${judge_by_gpa ? 57 : 60}%,65%)`
}

export function colorize_coursebar(score,judge_by_gpa,left=false) {
    let color_l,color_r,width;
    if(cannot_judge(score) || score<60) {
        color_l=color_r='hsl(240,50%,90%)';
        width=is_fail(score)?0:1;
    } else {
        let p=prec(score,judge_by_gpa);
        color_l=`hsl(${120*p},${judge_by_gpa ? 97: 100}%,75%)`;
        color_r=`hsl(${120*p},${judge_by_gpa ? 97: 100}%,70%)`;
        width=Math.max(p,.01);
    }
    return [color_l,color_r,width];
}

export function colorize_new_block() {
    return 'hsl(0,0%,90%)';
}