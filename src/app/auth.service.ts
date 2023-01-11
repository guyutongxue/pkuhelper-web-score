import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { shownScoreHelper } from './shown_score_helper';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginMethod: 'treehole' | 'iaaa' = localStorage['LOGIN_METHOD'] ?? 'iaaa';
  token = localStorage['TOKEN'] ?? '';
  username: string = localStorage['USERNAME'] ?? '';
  password: string = '';

  loading = false;

  constructor(
    private dataService: DataService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const params = new URLSearchParams(this.document.location.search);
    if (params.has('username')) {
      this.username = params.get('username')!;
    }
    if (params.has('password')) {
      this.password = params.get('password')!;
    }
  }

  async load() {
    this.loading = true;
    try {
      this.dataService.clear();
      if (this.loginMethod === 'treehole') {
        if (
          localStorage['LOGIN_METHOD'] !== 'pkuhelper' ||
          this.token !== localStorage['TOKEN']
        ) {
          shownScoreHelper.clear();
        }
        await this.dataService.loadFromUrl(`https://treehole.pku.edu.cn/api/course/score`, {
          headers: {
            "Authorization": `bearer ${this.token}`
          }
        });
        localStorage['TOKEN'] = this.token;
      } else {
        if (this.username !== localStorage['USERNAME']) {
          shownScoreHelper.clear();
        }
        await this.dataService.loadFromUrl(
          `/api/iaaa?username=${encodeURIComponent(
            this.username
          )}&password=${encodeURIComponent(this.password)}`
        );
        localStorage['USERNAME'] = this.username;
      }
      localStorage['LOGIN_METHOD'] = this.loginMethod;
    } finally {
      this.loading = false;
    }
  }
}
