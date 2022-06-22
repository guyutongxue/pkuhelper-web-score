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

import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { colorizeCourse, colorizeCourseBar } from '../colorize';
import { DataService } from '../data.service';
import {
  Course,
  courseGpaFromNormalizedScore,
  describe,
  fix,
  scoreTampered,
} from '../score_parser';

@Component({
  selector: 'app-course-viewer',
  templateUrl: './course-viewer.component.html',
  styleUrls: ['./course-viewer.component.scss'],
})
export class CourseViewerComponent implements OnChanges {
  constructor(private dataService: DataService,
    @Inject(DOCUMENT) private document: Document) {
    dataService.scores$.subscribe((data) => {
      this.#courses = data.courses;
    });
  }

  @Input() index: number = null!;

  #courses: Course[] = [];
  course = this.#courses[0];
  tampered = false;
  gpa: number | null = null;
  extras: Element = undefined!;

  ngOnChanges() {
    this.course = this.#courses[this.index];
    this.tampered = scoreTampered([this.course]);
    this.gpa = courseGpaFromNormalizedScore(this.course.score);
    const extraEle = this.document.createElement("p");
    for (const [k, n] of this.course.extras) {
      const keyEle = this.document.createElement("strong");
      keyEle.innerText = k + '：';
      extraEle.appendChild(keyEle);
      extraEle.appendChild(n);
      extraEle.appendChild(this.document.createElement("br"));
    }
    this.extras = extraEle;
  }

  fix = fix;
  describe = describe;

  makeScoreGradient(score: number | string, judgeByGpa: boolean) {
    const [fgcolorl, fgcolorr, width] = colorizeCourseBar(score, judgeByGpa);
    let bgcolor = colorizeCourse(score, judgeByGpa);
    let widthPerc = width * 100 + '%';
    return `linear-gradient(to right, ${fgcolorl}, ${fgcolorr} ${widthPerc}, ${bgcolor} ${widthPerc})`;
  }
}
