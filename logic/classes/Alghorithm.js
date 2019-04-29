const { errorHandler } = require('./ErrorHandler');

class Alghorithm {
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
            }
        }
    }
}