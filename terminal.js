class Lambda {
  constructor(variable, expr) {
    this.variable = variable;
    this.expression = expr;
  }

  toString() {
    return `\u03BB${this.variable.toString()}.${this.expression.toString()}`;
  }

  betaReduceNormal() {
    const e1 = this.expression.betaReduceNormal();
    if (e1 === null) {
      return null;
    } else {
      return new Lambda(this.variable, e1);
    }
  }

  substitute(map) {
    if (map[this.variable] === undefined) {
      return new Lambda(this.variable, this.expression.substitute(map));
    } else {
      const copy = {...map};
      delete copy[this.variable]
      if (Object.keys(copy).length === 0) {
        return this;
      } else {
        return new Lambda(this.variable, this.expression.substitute(copy));
      }
    }
  }
}

class Apply {
  constructor(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString() {
    var result;
    if (this.lhs instanceof Lambda) {
        result = "(" + this.lhs.toString() + ")";
    } else {
        result = this.lhs.toString();
    }
    result += " ";
    if (this.rhs instanceof Apply || this.rhs instanceof Lambda) {
        result += "(" + this.rhs.toString() + ")";
    } else {
        result += this.rhs.toString();
    }
    return result;
  }

  betaReduceNormal() {
    if (this.lhs instanceof Lambda) {
      const map = {}
      map[this.lhs.variable] = this.rhs;
      return this.lhs.expression.substitute(map);
    } else {
      const l1 = this.lhs.betaReduceNormal();
      if (l1 !== null) {
        return new Apply(l1, this.rhs);
      }
      const r1 = this.rhs.betaReduceNormal();
      if (r1 !== null) {
        return new Apply(this.lhs, r1);
      }
      return null;
    }
  }

  substitute(map) {
    return new Apply(this.lhs.substitute(map), this.rhs.substitute(map));
  }
}

String.prototype.betaReduceNormal = function() {
  return null;
}

String.prototype.substitute = function(map) {
  if (map[this] === undefined) {
    return this;
  } else {
    return map[this];
  }
}

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  const cmdLine = document.querySelector(cmdLineContainer);
  const output = document.querySelector(outputContainer);

  var history = [];
  var histpos = 0;
  var histtemp = 0;

  window.addEventListener('click', function() {
    cmdLine.focus();
  }, false);
  cmdLine.addEventListener('click', inputTextClick, false);
  cmdLine.addEventListener('keydown', historyHandler, false);
  cmdLine.addEventListener('keydown', processNext, false);

  // Helper functions
  function inputTextClick(e) {
    this.value = this.value;
  }

  function historyHandler(e) {
    if (history.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history[histpos]) {
          history[histpos] = this.value;
        } else {
          histtemp = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos--;
        if (histpos < 0) {
          histpos = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos++;
        if (histpos > history.length) {
          histpos = history.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history[histpos] ? history[histpos] : histtemp;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  function setOption(option, value) {
    return '<span style="color: #ff0000">Options aren\'t currently supported :(</span>';
  }

  this.variables = {};

  const parseLambda = expression => {
    const ws = /\s/;
    const word = /[A-Za-z0-9]/;

    const vars = this.variables;
  
    var idx = 0;
    var answer;
    skipWs();
    answer = parseL();
    skipWs();
    if (idx < expression.length) {
      throw new Error(`Unexpected data after parsing at index ${idx}`);
    }
    return answer;
  
    function skipWs() {
      while (idx < expression.length && ws.test(expression[idx])) {
        idx++;
      }
    }
  
    function parseL() {
      if (idx === expression.length) {
        throw new Error(`EOF found at L state at index ${idx}`);
      }
      if (expression[idx] === '\\' || expression[idx] === '\u03BB') {
        idx++;
        skipWs();
        const name = parseV();
        skipWs();
        if (expression[idx] !== '.') {
          throw new Error(`no dot after variable in lambda at index ${idx}`);
        }
        idx++;
        skipWs();
        return new Lambda(name, parseL());
      } else {
        const exprs = []
        while (idx < expression.length && (expression[idx] === '(' || word.test(expression[idx]))) {
          exprs.push(parseT());
          skipWs();
        }
        if (idx < expression.length && expression[idx] === '\\' || expression[idx] === '\u03BB') {
          exprs.push(parseL());
        }
        if (exprs.length === 0) {
          throw new Error(`nothing matching found at L state at index ${idx}`)
        }
        var result = exprs.shift();
        while (exprs.length > 0) {
          result = new Apply(result, exprs.shift());
        }
        return result;
      }
    }
    function parseT() {
      if (expression[idx] === '(') {
        idx++;
        skipWs();
        const result = parseL();
        skipWs();
        if (expression[idx] !== ')') {
          throw new Error(`expected ')', but ${expression[idx]} found at index ${idx}`)
        }
        idx++;
        return result;
      } else {
        const start = idx;
        while (idx < expression.length && word.test(expression[idx])) {
          idx++;
        }
        const result = expression.substring(start, idx);
        if (result.length === 0) {
          throw new Error(`expected '(' or variable, found ${expression[idx]} at index ${idx}`)
        }
        if (vars[result] === undefined) {
          return result;
        } else {
          return vars[result];
        }
      }
    }
    function parseV() {
      const start = idx;
      while (idx < expression.length && word.test(expression[idx])) {
        idx++
      }
      if (idx === start) {
        throw new Error("empty variable name after lambda");
      }
      const v = expression.substring(start, idx);
      if (/A-Z/.test(v[0])) {
        throw new Error(`variable in lambda cannot start with uppercase letter (at index ${idx})`)
      }
      return v
    }
  }

  const processInput = cmd => {
    if (cmd === "") {
      return undefined;
    }

    const optionRegex = /^:set\s+(\w+)\s+(\S+)$/;
    const optionMatch = cmd.match(optionRegex);
    if (optionMatch) {
      return setOption(optionMatch[1], optionMatch[2]);
    }

    const assignment = cmd.split(":=");
    if (assignment.length === 2) {
      const varname = assignment[0].trim();
      if (!/[A-Z]/.test(varname[0])) {
        return `<span style="color: #ff0000">Macro should start with upper letter</span>`;
      }
      try {
        this.variables[varname] = parseLambda(assignment[1].trim())
        console.log(this.variables);
        return undefined;
      } catch (e) {
        return `<span style="color: #ff0000">Parsing error: ${e.message}</span>`;
      }
    } else if (assignment.length >= 3) {
      return '<span style="color: #ff0000">More than one := in one expression found.</span>'
    } else {
      var lambda;
      try {
        lambda = parseLambda(cmd);
      } catch (e) {
        return `<span style="color: #ff0000">Parsing error: ${e.message}</span>`
      }
      while (true) {
        console.log(lambda);
        const l1 = lambda.betaReduceNormal();
        if (l1 == null) {
          return lambda.toString();
        }
        lambda = l1;
      }
    }
  }

  function processNext(e) {
    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value !== "") {
        history.push(this.value);
      }
      histpos = history.length;

      // Duplicate current input and append to output section.
      const line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      const input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output.appendChild(line);

      output_(processInput(this.value.trim()));

      window.scrollTo(0, getDocHeight());
      this.value = '';
    }
  }

  function output_(html) {
    if (html !== undefined) {
      output.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
    }
  }

  // Cross-browser impl to get document's height.
  function getDocHeight() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
      );
    }

  // add custom functions here
  this.init = () => {
    output_('<h2 style="letter-spacing: 4px">Lambda calculus interpreter</h2>');
    $('.prompt').html("\u03BB> ");
  }
};
