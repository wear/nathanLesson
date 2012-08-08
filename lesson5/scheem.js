var evalScheem = function (expr, env) {
    // guard setting
    if(!env) throw new Error("missing environment");

    if (!env.hasOwnProperty('bindings'))
        env.bindings = {};

    env.bindings['+'] = function(x,y){
      return x+y;
    }
    env.bindings['-'] = function(x,y){
      return x-y;
    }
    env.bindings['*'] = function(x,y){
      return x*y;
    }
    env.bindings['/'] = function(x,y){
      return x/y;
    }
    env.bindings['='] = function(x,y){
      return (x == y ? '#t' : '#f');
    }
    env.bindings['<'] = function(x,y){
      return (x < y ? '#t' : '#f');
    }
    env.bindings['cons'] = function(x,y){
      y.unshift(x);
      return y;
    }
    env.bindings['car'] = function(x){
      return x.shift();
    }
    env.bindings['cdr'] = function(x){
      x.shift();
      return x;
    }
    env.bindings['alert'] = function(msg){
      alert(msg);
    }
    
    var lookup = function (env, v) {
      if (env.bindings.hasOwnProperty(v))
          return env.bindings[v];
      if(!env.outer) throw new Error("variable haven't defined!");
      return lookup(env.outer, v);
    };

    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }

    if(typeof expr === 'string'){
      return lookup(env,expr);
    }

    var update = function (env, v, val) {
      if (env.bindings.hasOwnProperty(v)){
        env.bindings[v] = evalScheem(val,env);
        return 0;
      } else if(!env.outer){
        throw new Error("variable haven't defined!");
      } else {
        return update(env.outer,v,val);  
      }      
    }

    var add_binding = function (env, v, val) {
        // Your code here
        env.bindings[v] = val;
        return env;
    };

    // Look at head of list for operation
    switch (expr[0]) {
        case 'quote':
            return expr[1];
        case 'define':
            add_binding(env,expr[1],evalScheem(expr[2],env));
            return 0;
        case 'set!':
            return update(env,expr[1],evalScheem(expr[2],env));
        case 'begin':
            for(var i=1;i < expr.length;i++){
              var result = evalScheem(expr[i],env);
              if(i == (expr.length - 1)) return result;
            }
        case 'if':
            if(evalScheem(expr[1],env) === '#t'){
                return evalScheem(expr[2],env);
            } else {
                return evalScheem(expr[3],env);
            }
        case 'let':
            var new_env = {bindings:{},outer:env};
            for(var i=0;i<expr[1].length;i++){
              new_env.bindings[expr[1][i][0]] = evalScheem(expr[1][i][1],env);
            }
            return evalScheem(expr[2],new_env);
        case 'lambda':
            return function() {
                var new_env = {bindings:{},outer:env};
                if(expr[1] && expr[1].length != 0){
                    for(var i = 0;i < expr[1].length; i++){
                      new_env.bindings[expr[1][i]] = evalScheem(arguments[i],env);
                    }
                }
                return evalScheem(expr[2], new_env);
            };
        default:
            if(expr[0] == '+' || expr[0] == '-' || expr[0] == '/' || expr[0] == '*' || expr[0] == '=' || expr[0] == '<' || expr[0] == 'cons')
              return lookup(env,expr[0])(evalScheem(expr[1],env),evalScheem(expr[2],env));
            if(expr[0] == 'car' || expr[0] == 'cdr' || expr[0] == 'alert')
              return lookup(env,expr[0])(evalScheem(expr[1],env));
            // Simple application
            var func = evalScheem(expr[0], env);
            var args = [];
            if(typeof(expr[1]) == 'number' || typeof(expr[1]) == 'string'){
              args.push(evalScheem(expr[1],env));
            } else {
               for(var i=0;i<expr[1].length;i++){
                args.push(evalScheem(expr[1][i],env));
              }
            }
            return func.apply(null,args);
    }
};