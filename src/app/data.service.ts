import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import type { ApiResult, IsopScores } from './api';
import { ParseResult, parseScore } from './score_parser';
import { shownScoreHelper } from './shown_score_helper';

import TEMP from './temp.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  /** 数据源（API） */
  #dataSource = new BehaviorSubject<IsopScores | null>(null);
  /** 是否加载到数据 */
  loaded$ = this.#dataSource.pipe(map((src) => src !== null));
  /** 分析结果 */
  scores$ = this.#dataSource.pipe(
    filter((src): src is IsopScores => src !== null),
    map((src) => parseScore(src)),
    shareReplay(1),
    tap((scores) => this.#updateNewBlock(scores))
  );
  /** 具体到某个课程的信息 */
  course$ = (idx: number) =>
    this.scores$.pipe(
      map((scores) => scores.courses[idx]),
      filter((c) => typeof c !== 'undefined')
    );
  /** 新增成绩 */
  newBlock$ = new BehaviorSubject<number[]>([]);

  constructor() {}

  load() {
    this.#dataSource.next(TEMP as IsopScores);
  }

  #updateNewBlock(scores: ParseResult) {
    const shown = shownScoreHelper.get();

    let newBlockList: number[] = [];
    scores.courses.forEach((c, i) => {
      if (!shown.includes(c.id)) {
        newBlockList.push(i);
      }
    });
    if (shown.length === 0) {
      this.newBlock$.next([]);
    } else {
      this.newBlock$.next(newBlockList);
    }
    shownScoreHelper.set(scores.courses.map((c) => c.id));
  }
  /** 新增成绩已阅。更新 Observable 和 本地存储 */
  dismissNewBlock() {
    shownScoreHelper.apply();
    this.newBlock$.next([]);
  }
}
