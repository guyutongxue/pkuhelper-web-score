class ShownScoreHelper {
    constructor() {
        this.shown_score=[];
        this.pending_shown_score=null;
        try {
            this.shown_score=JSON.parse(localStorage['SCORE_SHOWN']||'[]');
        } catch(e) {
            console.error(e);
        }
    }
    get() {
        console.log('shown score helper get');
        return this.shown_score;
    }
    set(s) {
        console.log('shown score helper set');
        this.pending_shown_score=s;
        if(!this.shown_score.length)
            this.apply();
    }
    apply() {
        console.log('shown score helper apply');
        this.shown_score=this.pending_shown_score;
        localStorage['SCORE_SHOWN']=JSON.stringify(this.pending_shown_score);
    }
}

export let shown_score_helper=new ShownScoreHelper();