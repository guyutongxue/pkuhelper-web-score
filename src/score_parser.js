const STATIC_GPA={
    'P': null,
    'NP': null,
    'EX': null,
    'IP': null, // 跨学期课程
    'I': null, // 缓考
    'W': null,
    // 17级研究生手册
    'A+': 4,
    'A': 4,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1,
    'F': 0,
};

function normalize_score_from_isop(score) {
    if(score==='合格') return 'P';
    else if(score==='不合格') return 'NP';
    else if(!isNaN(score)) return parseFloat(score);
    else return score;
}

function course_gpa_from_normalized_score(score) {
    if(!isNaN(score)) {
        return 4.-3.*Math.pow(100.-score,2)/1600.;
    } else if(STATIC_GPA[score]!==undefined) {
        return STATIC_GPA[score];
    } else
        return null;
}

export function parse_score(json) {
    console.log(json);
    let yjs=json.xslb==='yjs';
    let courses=json.cjxx.map((row)=>{
        let score=normalize_score_from_isop(yjs ? row.cj : row.xqcj);
        let gpa=course_gpa_from_normalized_score(score);//yjs ? null : row.jd;
        return {
            year: row.xnd,
            semester: row.xq,
            sem_name: `${row.xnd}-${row.xq}`,
            name: row.kcmc,
            credit: parseFloat(row.xf),
            score: score,
            true_score: score,
            gpa: gpa,
            true_gpa: gpa,
        }
    });

    let semesters={};
    courses.forEach((course,idx)=>{
        let sem=course.sem_name;
        if(!semesters[sem])
            semesters[sem]={
                name: `${course.year}学年 第${course.semester}学期`,
                year: course.year,
                semester: course.semester,
                course_list: [],
            };
        semesters[sem].course_list.push(idx);
    });

    let semesters_li=Object.values(semesters).sort((c1,c2)=>(
        c1.year!==c2.year ? c1.year>c2.year : c1.semester>c2.semester
    ));

    return {
        courses: courses,
        true_gpa: json.gpa.gpa,
        semesters: semesters_li,
    };
}

export function calc_avg_gpa(courses,li) {
    let tot_credit=0;
    let tot_gpa=0;
    li.forEach((idx)=>{
        let co=courses[idx];
        let gpa=course_gpa_from_normalized_score(co.score);
        if(gpa!==null) {
            console.log(co.credit,gpa,tot_credit,tot_gpa);
            tot_credit+=co.credit;
            tot_gpa+=co.credit*gpa;
        }
    });
    if(tot_credit)
        return tot_gpa/tot_credit;
    else
        return NaN;
}