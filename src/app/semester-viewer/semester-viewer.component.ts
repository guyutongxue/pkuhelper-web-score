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

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {
  calcGpa,
  Course,
  courseGpaFromNormalizedScore,
  fix,
  guessScoreFromGpa,
  isFail,
  scoreTampered,
  Semester,
  sumCredit,
} from '../score_parser';
import { colorizeSemester } from "../colorize";

@Component({
  selector: 'app-semester-viewer',
  templateUrl: './semester-viewer.component.html',
  styleUrls: ['./semester-viewer.component.scss'],
})
export class SemesterViewerComponent implements OnChanges {
  constructor(private dataService: DataService) {
    this.dataService.scores$.subscribe((scores) => {
      this.#courses = scores.courses;
    });
  }

  @Input() sem: Semester = null!;

  #courses: Course[] = [];

  credit = 0;
  gpa: number | null = 0;
  score: number | string = '--.-';
  tampered = false;
  courseList: number[] = [];

  // TODO
  judgeByGpa = false;

  ngOnChanges() {
    this.credit = sumCredit(this.#courses, this.sem.courseList);
    this.gpa = calcGpa(this.#courses, this.sem.courseList);
    this.score = guessScoreFromGpa(this.gpa);
    this.tampered = scoreTampered(this.#courses);
    this.courseList = this.sem.courseList.sort((id1, id2) => {
      const s1 = courseGpaFromNormalizedScore(this.#courses[id1].score) ?? 0;
      const s2 = courseGpaFromNormalizedScore(this.#courses[id2].score) ?? 0;
      const f1 = Number(isFail(this.#courses[id1].score));
      const f2 = Number(isFail(this.#courses[id2].score));
      return s2 !== s1 ? s2 - s1 : f1 !== f2 ? f2 - f1 : id2 - id1;
    });
  }

  colorizeSemester = colorizeSemester;
  fix = fix;
}
