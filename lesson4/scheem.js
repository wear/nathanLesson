var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    if(typeof expr === 'string'){
      return env[expr];
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case 'quote':
            return expr[1];
        case 'define':
            env[expr[1]] = expr[2];
            return 0;
        case 'set!':
            if(env[expr[1]]){
              env[expr[1]] = evalScheem(expr[2],env);
              return 0;
            } else {
              throw new Error("variable haven't defined!");
            }
        case 'begin':
            var br;
            for(var i=1;i < expr.length;i++){
              br = evalScheem(expr[i],env); 
            }
            return br;
        case "=":
            return evalScheem(expr[1],env) == evalScheem(expr[2],env) ? '#t' : '#f';
        case '<':
            return evalScheem(expr[1],env) < evalScheem(expr[2],env) ? '#t' : '#f';
        case 'cons':
            var cr = evalScheem(expr[2],env);
            cr.unshift(evalScheem(expr[1],env));
            return cr;
        case 'car':
            return evalScheem(expr[1],env).shift();
        case 'cdr':
            var cdr = evalScheem(expr[1],env);
            cdr.shift();
            return cdr;
        case 'if':
            if(evalScheem(expr[1],env) === '#t'){
                return evalScheem(expr[2]);
            } else {
                return evalScheem(expr[3]);
            }
    }
};