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
import { Component, Inject, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { colorizeSemester, makeScoreGradient } from '../colorize';
import { DataService } from '../data.service';
import {
  calcGpa,
  fix,
  guessScoreFromGpa,
  scoreTampered,
  sumCredit,
} from '../score_parser';

interface Category {
  name: string;
  length: number;
  credit: number;
  gpa: number | null;
  score: number | string;
  tampered: boolean;
  extras: Element;
}

@UntilDestroy()
@Component({
  selector: 'app-overall-viewer',
  templateUrl: './overall-viewer.component.html',
  styleUrls: ['./overall-viewer.component.scss'],
})
export class OverallViewerComponent implements OnInit {
  constructor(
    private dataService: DataService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  credit = 0;
  length = 0;
  gpa: number | null = null;
  isopGpa: string | null = null;
  score: number | string = 0;
  tampered = false;
  categories: Category[] = [];

  #subscription = this.dataService.scores$
    .pipe(untilDestroyed(this))
    .subscribe(({ courses, isopGpa }) => {
      this.isopGpa = isopGpa;
      this.credit = sumCredit(courses);
      this.length = courses.length;
      this.gpa = calcGpa(courses);
      this.score = guessScoreFromGpa(this.gpa);
      this.tampered = scoreTampered(courses);
      const cats: Record<string, number[]> = {};
      for (const [i, course] of Object.entries(courses)) {
        const t = course.type;
        if (!(t in cats)) {
          cats[t] = [];
        }
        cats[t].push(Number(i));
      }
      this.categories = Object.entries(cats)
        .map(([name, cl]) => {
          const credit = sumCredit(courses, cl);
          const gpa = calcGpa(courses, cl);
          const score = guessScoreFromGpa(gpa);
          const tampered = scoreTampered(cl.map((i) => courses[i]));
          const extras = this.document.createElement('p');
          for (const c of cl) {
            const { credit, name, score } = courses[c];
            extras.appendChild(
              this.document.createTextNode(
                `${credit}学分 - ${name} - ${fix(score, 1)}`
              )
            );
            extras.appendChild(this.document.createElement('br'));
          }
          return {
            name,
            length: cl.length,
            credit,
            gpa,
            score,
            tampered,
            extras,
          };
        })
        .sort((a, b) => Number(b.score) - Number(a.score));
    });

  ngOnInit(): void {}

  // TODO
  judgeByGpa = false;

  fix = fix;
  colorizeSemester = colorizeSemester;
  makeScoreGradient = makeScoreGradient;
}
