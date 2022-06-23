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

import { Component } from '@angular/core';
import { map } from 'rxjs';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private dataService: DataService) {

  }

  loginMethod: "pkuhelper" | "iaaa" = "pkuhelper";
  token = localStorage['TOKEN'] ?? "";

  loading = false;
  hasData = this.dataService.loaded$;

  async load() {
    try {
      this.loading = true;
      if (this.loginMethod === "pkuhelper") {
        await this.dataService.loadFromToken(this.token);
        localStorage['TOKEN'] = this.token;
      } else {
        // TODO
      }
    } finally {
      this.loading = false;
    }
  }

}
