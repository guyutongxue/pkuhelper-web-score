class ShownScoreHelper {
  #shownScore: string[] = [];
  #pending: string[] | null = null;

  constructor() {
    try {
      this.#shownScore = JSON.parse(localStorage['SCORE_SHOWN'] ?? '[]');
    } catch (e) {
      console.error(e);
    }
  }
  get() {
    console.log('shown score helper get');
    return this.#shownScore;
  }
  set(s: string[]) {
    console.log('shown score helper set');
    this.#pending = s;
    if (!this.#shownScore.length) this.apply();
  }
  apply() {
    if (this.#pending !== null) {
      console.log('shown score helper apply');
      this.#shownScore = this.#pending;
      localStorage['SCORE_SHOWN'] = JSON.stringify(this.#pending);
    }
  }
}

export const shownScoreHelper = new ShownScoreHelper();
