import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor() { }

  judgeByGpa$ = new BehaviorSubject<boolean>(false);
  hideText$ = new BehaviorSubject<boolean>(false);

  toggleHideText() {
    this.hideText$.next(!this.hideText$.value);
  }
  toggleJudgeByGpa() {
    this.judgeByGpa$.next(!this.judgeByGpa$.value);
  }
}
