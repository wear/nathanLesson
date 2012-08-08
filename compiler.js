var endTime = function (time, expr) {
    if (expr.tag == 'note' || expr.tag == 'rest') return time + expr.dur;
    if (expr.tag === 'seq')
        return endTime(endTime(time, expr.left), expr.right);
    return Math.max(endTime(time, expr.left), endTime(time, expr.right));
};
 
var convertPitch = function(pitch){
	var octave = parseInt(pitch.charAt(1));
	return 12+12*octave;
}

var compileT = function (musexpr, time) {
    var left, ldur, right;

    if(musexpr.tag == 'rest' || musexpr.tag == 'note'){
    	musexpr.start = time;
    	return [musexpr];
    }
    if (musexpr.tag === 'seq') {
        left = compileT(musexpr.left, time);
        ldur = endTime(time, musexpr.left);
        right = compileT(musexpr.right, ldur);
        return left.concat(right);
    }
    if (musexpr.tag === 'par') {
        left = compileT(musexpr.left, time);
        right = compileT(musexpr.right, time);
        return left.concat(right);
    }
};
 
var compile = function (musexpr) {
    return compileT(musexpr, 0);
}

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'b4', dur: 250 },
         right: { tag: 'rest', dur: 500 } } };

console.log(compile(melody_mus));

// ToDo
// add repeat 