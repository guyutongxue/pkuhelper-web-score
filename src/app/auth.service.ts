import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { shownScoreHelper } from './shown_score_helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginMethod: "pkuhelper" | "iaaa" = "pkuhelper";
  token = localStorage['TOKEN'] ?? "";
  username = localStorage['USERNAME'] ?? "";
  password = "";

  loading = false;

  constructor(private dataService: DataService) { }

  get invalid() {
    return (this.loginMethod === 'pkuhelper' && !this.token) || !this.username;
  }

  async load() {
    this.loading = true;
    try {
      this.dataService.clear();
      if (this.loginMethod === "pkuhelper") {
        if (this.token !== localStorage['TOKEN']) {
          shownScoreHelper.clear();
        }
        await this.dataService.loadFromUrl(`https://pkuhelper.pku.edu.cn/api_xmcp/isop/scores?user_token=${encodeURIComponent(this.token)}`);
        localStorage['TOKEN'] = this.token;
      } else {
        if (this.username !== localStorage['USERNAME']) {
          shownScoreHelper.clear();
        }
        await this.dataService.loadFromUrl(`/api/iaaa?username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`);
      }
    } finally {
      this.loading = false;
    }
  }
}
