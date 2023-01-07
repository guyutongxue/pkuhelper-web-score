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

import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { DataService } from './data.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public auth: AuthService, private dataService: DataService) {}

  loading = false;
  hasData = this.dataService.loaded$;

  eulaAcceptance = localStorage['EULA'] === 'accepted';
  acceptEula() {
    this.eulaAcceptance = true;
    localStorage['EULA'] = 'accepted';
    Notification.requestPermission();
  }
  declineEula() {
    localStorage.removeItem('EULA');
    location.href = 'about:blank';
  }
}
