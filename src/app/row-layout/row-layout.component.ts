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

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-row-layout',
  templateUrl: './row-layout.component.html',
  styleUrls: ['./row-layout.component.scss']
})
export class RowLayoutComponent implements OnInit {

  constructor() { }

  @Input() background: string = "unset";

  ngOnInit(): void {
  }

}
