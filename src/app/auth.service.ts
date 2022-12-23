import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { shownScoreHelper } from './shown_score_helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginMethod: "pkuhelper" | "iaaa" = localStorage['LOGIN_METHOD'] ?? "pkuhelper";
  token = localStorage['TOKEN'] ?? "";
  username = localStorage['USERNAME'] ?? "";
  password = "";

  loading = false;

  constructor(private dataService: DataService) { }

  async load() {
    this.loading = true;
    try {
      this.dataService.clear();
      if (this.loginMethod === "pkuhelper") {
        if (localStorage['LOGIN_METHOD'] !== "pkuhelper" || this.token !== localStorage['TOKEN']) {
          shownScoreHelper.clear();
        }
        await this.dataService.loadFromUrl(`https://pkuhelper.pku.edu.cn/api_xmcp/isop/scores?user_token=${encodeURIComponent(this.token)}`);
        localStorage['TOKEN'] = this.token;
      } else {
        if (localStorage['LOGIN_METHOD'] !== "iaaa" || this.username !== localStorage['USERNAME']) {
          shownScoreHelper.clear();
        }
        await this.dataService.loadFromUrl(`/api/iaaa?username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`);
        localStorage['USERNAME'] = this.username;
      }
      localStorage['LOGIN_METHOD'] = this.loginMethod;
    } finally {
      this.loading = false;
    }
  }
}
