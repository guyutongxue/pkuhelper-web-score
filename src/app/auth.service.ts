import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { shownScoreHelper } from './shown_score_helper';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  username: string = localStorage['USERNAME'] ?? '';
  password: string = '';

  loading = false;

  constructor(
    private dataService: DataService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const params = new URLSearchParams(this.document.location.search);
    if (params.has("username")) {
      this.username = params.get("username")!;
    }
    if (params.has("password")) {
      this.password = params.get("password")!;
    }
  }

  async load() {
    this.loading = true;
    try {
      this.dataService.clear();
      if (this.username !== localStorage['USERNAME']) {
        shownScoreHelper.clear();
      }
      await this.dataService.loadFromUrl(
        `/api/iaaa?username=${encodeURIComponent(
          this.username
        )}&password=${encodeURIComponent(this.password)}`
      );
      localStorage['USERNAME'] = this.username;
    } finally {
      this.loading = false;
    }
  }
}
