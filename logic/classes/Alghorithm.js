const { errorHandler } = require('./ErrorHandler');

class Algorithm {
    constructor(rule) {
        this.operators = ['!', '+', '|', '^'];
        this.brackets = ['(', ')'];

        this.stack = [];
        this.result = '';

        this.rule = rule;
        const split = rule.split('=>');
        this.condition = split[0];
        this.implication = split[1];
    }

    checkStack() {
        return this.stack.length > 0 && this.operators.includes(this.stack[-1]);
    }

    checkPriority(operator) {
        return this.operators.indexOf(operator) >= this.operators.indexOf(this.stack[-1]);
    }
    shuntingYard(tokens) {
        this.erase();
        for (const token of tokens) {
            if (this.operators.includes(token)) {
                this.manageOperators(token);
            } else if (this.brackets.includes(token)) {
                this.manageBrackets(token, tokens);
            } else {
                this.result += token;
            }
        }
        while (this.stack.length) {
            this.result += this.stack.pop();
        }
        return this.result;
    }
    manageOperators(operator) {
        if (this.stack.length > 0) {
            while (this.checkStack() && this.checkPriority(operator)) {
                this.result += this.stack.pop();
            }
        }
        this.stack.append(operator);
    }
    manageBrackets(bracket, line) {
        if (bracket === this.brackets[0]) {
            return;
        }
        if (bracket === this.brackets[1]) {
            while (this.stack.length && this.stack[-1] !== this.brackets[0]) {
                this.result += this.stack.pop();
            }
            if (this.stack.length) {
                this.stack.pop()
            } else {
                errorHandler.throwError('processing', `Mismatch parenthesis in ${line}`)
            }
        }
        while (this.stack.length && this.stack[-1] === '!') {
            this.result += this.stack.pop();
        }
    }
    erase() {
        this.stack = [];
        this.result = '';
    }
}

module.exports = Algorithm;