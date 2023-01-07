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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { OptionsService } from '../options.service';

@Component({
  selector: 'app-vertical-layout',
  templateUrl: './vertical-layout.component.html',
  styleUrls: ['./vertical-layout.component.scss']
})
export class VerticalLayoutComponent implements OnChanges {

  constructor(private options: OptionsService) { }

  @Input() up = "";
  @Input() down = "";
  @Input() extra?: Element;

  @Input() needHideText = false;
  @Input() editable = false;
  @Output() change = new EventEmitter<string>();

  showExtra = false;

  hideText$ = this.options.hideText$;

  ngOnChanges() {
    if (this.editable) {
      this.inputValue = this.up;
    }
  }

  toggleExtra() {
    this.showExtra = !this.showExtra;
  }

  inputValue = "";
  emitValue() {
    this.change.emit(this.inputValue);
    this.inputValue = this.up;
  }
}
