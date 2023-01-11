import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, shareReplay, tap } from 'rxjs';
import type { ApiResult, IsopScores } from './api';
import { checkScore, ParseResult, parseScore } from './score_parser';
import { shownScoreHelper } from './shown_score_helper';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  /** 数据源（API） */
  #dataSource$ = new BehaviorSubject<IsopScores | null>(null);

  /** 分析结果 */
  #scores$ = new BehaviorSubject<ParseResult | null>(null);
  scores$ = this.#scores$.pipe(filter((s): s is ParseResult => s !== null));

  /** 是否有数据 */
  loaded$ = this.#dataSource$.pipe(map((src) => src !== null));

  /** 具体到某个课程的信息 */
  course$ = (idx: number) =>
    this.scores$.pipe(
      map((scores) => scores.courses[idx]),
      filter((c) => typeof c !== 'undefined')
    );
  /** 新增成绩 */
  newBlock$ = new BehaviorSubject<number[]>([]);

  /** 上次更新 */
  lastUpdatedTime$ = new BehaviorSubject<Date>(new Date());

  constructor() {
    // 数据源有新数据后，解析到结果
    this.#dataSource$
      .pipe(
        map((src) => src === null ? null : parseScore(src))
      )
      .subscribe((scores) => {
        this.lastUpdatedTime$.next(new Date());
        console.log(scores);
        this.#scores$.next(scores);
        if (scores !== null) {
          this.#updateNewBlock(scores);
        }
      });
  }

  async loadFromUrl(url: string, init?: RequestInit) {
    try {
      let originalSrc = await fetch(url, init).then(r => r.json());
      const src: ApiResult = "data" in originalSrc ? originalSrc.data.score : originalSrc;
      if (src.success) {
        this.#dataSource$.next(src);
      } else {
        alert(src.errMsg);
        console.error(src);
      }
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert(e);
      }
      console.error(e);
    }
  }
  clear() {
    this.#dataSource$.next(null);
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

  tamper(idx: number, val: string) {
    const scores = this.#scores$.value;
    if (scores === null) return;
    if (typeof val !== "string") return;
    val = val.toUpperCase();
    if (val === "IF YOU CAN") {
      shownScoreHelper.set(shownScoreHelper.get().filter(c => scores.courses[idx].id !== c));
      shownScoreHelper.apply();
      this.#updateNewBlock(scores);
    }
    if (!checkScore(val)) return;
    // console.log(idx, val);
    scores.courses[idx].score = val;
    this.#scores$.next(scores);
  }
  untamper(idx: number) {
    const scores = this.#scores$.value;
    if (scores === null) return;
    scores.courses[idx].score = scores.courses[idx].trueScore;
    this.#scores$.next(scores);
  }
}
