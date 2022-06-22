import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, of } from 'rxjs';
import type { ApiResult, IsopScores } from './api';
import { parseScore } from "./score_parser";

import TEMP from "./temp.json";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  #dataSource = new BehaviorSubject<IsopScores | null>(null);
  loaded$ = this.#dataSource.pipe(
    map((src) => src !== null)
  );
  scores$ = this.#dataSource.pipe(
    filter((src): src is IsopScores => src !== null),
    map((src) => parseScore(src))
  )

  constructor() { }

  load() {
    this.#dataSource.next(TEMP as IsopScores);
  }
}
