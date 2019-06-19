export function colorize_semester(score) {
    if(isNaN(score)) return 'hsl(0,100%,65%)';
    let prec=(score-60)/40.;
    return `hsl(${120*prec},100%,65%)`
}

export function colorize_course(score) {
    if(isNaN(score)) return 'hsl(0,0%,70%)';
    let prec=(score-60)/40.;
    return `hsl(${120*prec},60%,50%)`
}

export function colorize_backbar(score) {
    let color,width;
    if(isNaN(score) || score<60) {
        color='hsl(0,0%,70%)';
        width=0;
    } else {
        let prec=(score-60)/40.;
        color=`hsl(${120*prec},100%,65%)`;
        width=prec;
    }
    return [color,width];
}