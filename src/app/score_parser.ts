// Copyright (C) 2022 Guyutongxue
//
// This file is part of pkuhelper-web.
//
// pkuhelper-web is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// pkuhelper-web is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with pkuhelper-web.  If not, see <http://www.gnu.org/licenses/>.

import type { IsopScores, ScoreBase } from './api';

const STATIC_GPA: Record<string, number | null> = {
  P: null,
  NP: null,
  EX: null,
  IP: null, // 跨学期课程
  I: null, // 缓考
  W: null,
  // 17级研究生手册
  'A+': 4,
  A: 4,
  'A-': 3.7,
  'B+': 3.3,
  B: 3,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1,
  F: null, // 0
};
const DESCRIPTION: Record<string, string> = {
  P: '通过',
  NP: '未通过',
  EX: '免修',
  IP: '跨学期',
  I: '缓考',
  W: '退课',
};

function normalizeScoreFromIsop(score: string): string | number {
  if (score === '合格') return 'P';
  if (score === '不合格') return 'NP';
  if (score === '缓考') return 'I';
  if (score === '免修') return 'EX';
  const number = Number(score);
  if (isNaN(number)) return score;
  else return number;
}

export function checkScore(score: string) {
  const number = Number(score);
  if (!isNaN(number)) {
    return number <= 100.001 && number >= -0.001;
  } else {
    return STATIC_GPA[score] !== undefined;
  }
}

export function courseGpaFromNormalizedScore(
  score: string | number
): number | null {
  const number = Number(score);
  if (!isNaN(number)) {
    if (number >= 60) return 4 - (3 * Math.pow(100 - number, 2)) / 1600;
    else return null;
  } else {
    return STATIC_GPA[score] ?? null;
  }
}

export function isSpecialCredit(score: string | number): boolean {
  // should calc into total credit
  return score === 'P' || score === 'EX';
}
export function isFail(score: string | number): boolean {
  // should be colored as failed
  return score === 'NP' || score === 'F' || (!isNaN(Number(score)) && score < 60);
}

export function isFull(score: string | number): boolean {
  return score === "A+" || Number(score) > 99.995;
}

function shouldCalcCredit(score: string | number): boolean {
  return (
    isSpecialCredit(score) || courseGpaFromNormalizedScore(score) !== null
  );
}

function parseTeacher(line: string | undefined): string {
  //"0006183063-熊校良$信息学院$助理研究员,0006172171-宋今$信息学院$馆员,0006181061-卢亮$新闻学院$副教授,0006182105-李子奇$信息学院$助理研究员,1006184103-王一涵$团委$讲师"
  if (!line) return '（无教师信息）';
  let parts = line.split(',');

  let teacher = parts[0];
  let res = /^[^-]+-([^$]+)\$([^$]*)\$([^$]*)$/.exec(teacher);

  if (res)
    return `${res[1]}（${res[2]}）${
      parts.length > 1 ? '等' + parts.length + '人' : ''
    }`;
  else
    return `${teacher}${parts.length > 1 ? ' 等' + parts.length + '人' : ''}`;
}
function firstTeacherName(line: string | undefined): string {
  if (!line) return '';
  let parts = line.split(',');

  let teacher = parts[0];
  let res = /^[^-]+-([^$]+)\$[^$]*\$[^$]*$/.exec(teacher);

  if (res) return res[1];
  else return '';
}

function extraInfos(row: ScoreBase) {
  const interestingKeys = new Map<
    string,
    [string] | [string, (orig: string) => HTMLElement]
  >(); // so it is ordered
  // both yjs and bks
  interestingKeys.set('kch', ['课程号']);
  // yjs
  interestingKeys.set('cjjlfs', ['成绩记录方式']);
  interestingKeys.set('hgbz', ['合格标志']);
  // bks
  interestingKeys.set('zxjhbh', [
    '执行计划编号',
    (v) => {
      const ele = document.createElement('a');
      ele.setAttribute(
        'href',
        'https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/courseDetail/getCourseDetail.do?kclx=BK&course_seq_no=' +
          encodeURIComponent(v)
      );
      ele.setAttribute('target', '_blank');
      ele.setAttribute('rel', 'noopener noreferrer');
      ele.classList.add('prevent-click-handler');
      ele.innerHTML = v;
      return ele;
    },
  ]);
  interestingKeys.set('ywmc', ['课程英文名']);
  interestingKeys.set('kctx', ['课程体系']);
  interestingKeys.set('jxbh', ['教学班号']);
  interestingKeys.set('skjsxm', ['教师信息']);
  interestingKeys.set('bkcjbh', ['成绩编号']);
  interestingKeys.set('xslb', ['学生类别']);
  let ret: Array<[string, Node]> = [];
  interestingKeys.forEach((v, k) => {
    const orig = (row as Record<string, string | undefined>)[k];
    if (typeof orig !== 'undefined') {
      if (v.length === 2) {
        ret.push([v[0], v[1](orig)]);
      } else {
        ret.push([v[0], document.createTextNode(orig)]);
      }
    }
  });
  return ret;
}

export type Course = {
  readonly id: string;
  readonly name: string;
  readonly type: string;

  readonly year: number;
  readonly semester: number;
  readonly semName: string;
  readonly semNameOriginal: string | undefined;

  readonly credit: number;
  score: string | number;
  readonly trueScore: string | number;
  readonly isopGpa: string | null;

  readonly details: string;
  readonly extras: [string, Node][];

  readonly firstTeacher: string;
};

export type Semester = {
  name: string;
  year: number;
  semester: number;
  courseList: number[];
};

export type ParseResult = {
  semesters: Semester[];
  courses: Course[];
  isopGpa: string | null;
};

export function parseScore(json: IsopScores): ParseResult {
  console.log(json);

  interface UnifiedScore {
    raw: ScoreBase;
    score: string;
    type: string;
  }
  // 将本科生和研究生的信息统一到同一格式
  let rows: UnifiedScore[];
  if (json.xslb === 'yjs') {
    rows = json.scoreLists.map((r) => ({
      raw: r,
      score: r.cj,
      type: r.kclb,
    }));
  } else {
    rows = json.cjxx.map((r) => ({
      raw: r,
      score: r.xqcj,
      type: r.kclbmc,
    }));
  }
  const courses = rows.map(({ raw, score, type }) => {
    const normalizedScore = normalizeScoreFromIsop(score);
    let teacher_str = parseTeacher(raw.skjsxm);
    const details = type + (teacher_str ? ` - ${teacher_str}` : '');
    return {
      id: raw.kch,
      name: raw.kcmc,
      type: type,

      year: parseInt(raw.xnd),
      semester: parseInt(raw.xq),
      semName: `${raw.xnd}-${raw.xq}`,
      semNameOriginal: raw.xndxqpx,

      credit: parseFloat(raw.xf),
      score: normalizedScore,
      trueScore: normalizedScore,
      isopGpa: raw.jd ?? courseGpaFromNormalizedScore(normalizedScore)?.toString() ?? null,

      details: details, // shown in the second line
      extras: extraInfos(raw), // shown in the extra line

      firstTeacher: firstTeacherName(raw.skjsxm), // used in courses survey
    };
  });

  let semesters: Record<string, Semester> = {};
  courses.forEach((course, idx) => {
    let sem = course.semName;
    if (!semesters[sem]) {
      semesters[sem] = {
        name: `${isNaN(course.year) ? '--' : course.year}学年 第${
          isNaN(course.semester) ? '--' : course.semester
        }学期`,
        year: course.year,
        semester: course.semester,
        courseList: [],
      };
    }
    semesters[sem].courseList.push(idx);
  });

  const semestersArr = Object.values(semesters).sort((c1, c2) =>
    c1.year !== c2.year ? c2.year - c1.year : c2.semester - c1.semester
  );

  return {
    courses: courses,
    isopGpa: json.xslb === 'yjs' ? null : json.gpa.gpa,
    semesters: semestersArr,
  };
}

export function calcGpa(courses: Course[], idxs?: number[]): number | null {
  let totCredit = 0;
  let totGpa = 0;
  idxs ??= Array.from(courses.keys());
  idxs.forEach((idx) => {
    let co = courses[idx];
    let gpa = courseGpaFromNormalizedScore(co.score);
    if (gpa !== null) {
      totCredit += co.credit;
      totGpa += co.credit * gpa;
    }
  });
  if (totCredit) return totGpa / totCredit;
  else return null;
}

export function sumCredit(courses: Course[], idxs?: number[]): number {
  let totCredit = 0;
  idxs ??= Array.from(courses.keys());
  idxs.forEach((idx) => {
    if (shouldCalcCredit(courses[idx].score))
      totCredit += courses[idx].credit;
  });
  return totCredit;
}

const SQRT3 = Math.sqrt(3);
export function guessScoreFromGpa(gpa: number | null): number | string {
  if (gpa === null) return '--.-';
  if (gpa >= 4) return 100;
  if (gpa >= 1) return (-40 * SQRT3 * Math.sqrt(4 - gpa) + 300) / 3;
  return '--.-';
}

export function fix(num: string | number, dig: number) {
  // without trailing 0 and trailing point
  if (typeof num !== 'number') return num;
  const s = num.toFixed(dig);
  return s.replace(/^(.*?)0+$/, '$1').replace(/\.$/, '');
}

export function describe(score: string | number) {
  return DESCRIPTION[score] || '-.--';
}

export function scoreTampered(courses: Course[]) {
  return courses.some((co) => '' + co.score !== '' + co.trueScore);
}
