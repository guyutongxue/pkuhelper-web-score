// Copyright (C) 2022 Guyutongxue
//
// This file is part of pkuhelper-web-score.
//
// pkuhelper-web-score is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// pkuhelper-web-score is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with pkuhelper-web-score.  If not, see <http://www.gnu.org/licenses/>.

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  showCalculator() {
    const x = Number(prompt('输入分数 (60 ~ 100）或绩点（1 ~ 4）来换算'));
    if (x >= 60 && x <= 100) {
      const y = 4 - (3 * Math.pow(100 - x, 2)) / 1600;
      alert(`GPA(${x.toFixed(2)}) ≈ ${y.toFixed(2)}`);
    } else if (x >= 1 && x <= 4) {
      const y = 100 - Math.sqrt((1600 / 3) * (4 - x));
      alert(`GPA(${y.toFixed(2)}) ≈ ${x.toFixed(2)}`);
    } else {
      alert('输入不合法。');
    }
  }

  @Output() showEula = new EventEmitter();
}
