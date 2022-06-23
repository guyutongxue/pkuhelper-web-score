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

import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, switchMap } from 'rxjs';
import { colorizeNewBlock } from '../colorize';
import { DataService } from '../data.service';
import { calcGpa } from '../score_parser';
import { shownScoreHelper } from '../shown_score_helper';

@UntilDestroy()
@Component({
  selector: 'app-new-block-viewer',
  templateUrl: './new-block-viewer.component.html',
  styleUrls: ['./new-block-viewer.component.scss'],
})
export class NewBlockViewerComponent implements OnInit {
  constructor(private dataService: DataService) {}

  hidden = false;
  courses: number[] = [];

  deltaGpa = 0;
  deltaType: 'up' | 'down' | 'keep' = 'keep';

  ngOnInit(): void {
    this.dataService.scores$
      .pipe(
        switchMap(({ courses }) =>
          this.dataService.newBlock$.pipe(
            map((newBlock) => ({
              courses,
              newBlock,
            })),
          )
        ),
        untilDestroyed(this)
      ).subscribe(({ courses, newBlock }) => {
        this.courses = newBlock;
        const newGpa = calcGpa(courses);
        const oldGpa = calcGpa(courses.filter((_, i) => !newBlock.includes(i)));
        this.deltaGpa = Number(newGpa) - Number(oldGpa);
        this.deltaType =
          this.deltaGpa >= 0.0005
            ? 'up'
            : this.deltaGpa <= -0.0005
            ? 'down'
            : 'keep';
      });
  }

  colorizeNewBlock = colorizeNewBlock;

  done() {
    this.hidden = true;
    setTimeout(() => this.dataService.dismissNewBlock(), 250);
  }

  fix(d: number) {
    if (Math.abs(d) >= 1) return d.toFixed(2); // -1.23
    else return d.toFixed(3).replace('0.', '.'); // -.234
  }
}
