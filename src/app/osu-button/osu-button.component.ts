// Copyright (C) 2022 Guyutongxue
//
// This file is part of pkuhelper-web-score-score.
//
// pkuhelper-web-score-score is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// pkuhelper-web-score-score is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with pkuhelper-web-score-score.  If not, see <http://www.gnu.org/licenses/>.

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-osu-button',
  templateUrl: './osu-button.component.html',
  styleUrls: ['./osu-button.component.scss']
})
export class OsuButtonComponent implements OnInit {

  constructor() { }

  @Input() disabled = false;
  @Input() text = '';
  @Input() buttonText = '';

  @Output() click = new EventEmitter();

  ngOnInit(): void {
  }

}
