const { Resolver } = require("./Resolver");
const { errorHandler } = require('./ErrorHandler');


class Fact {
    constructor(letter, parent) {
        this.dependencies = [];
        this.parent = parent;
        this.letter = letter;
        this.state = 'none';
        this.resolving = false;
        this.resolved = false;
        this.resolver = new Resolver(); // TODO check params
    }

    static getState(rules) {
        rules = rules.items(); // TODO check items
		let result = null;
		for (const [key, val] in rules.entries()) { // TODO check rules
            if (result === null) {
                result = [ key, val ];
            } else {
                if (result[1] === 'true' || result[1] === 'false') {
                    if (val === 'true' || val === 'false' && val !== result[1]) {
                        errorHandler.throwError('processing', 'Conflicting Rules')
                    }
                    if (val === 'true' || val === 'false' || val === 'undefined') {
                        result = [ key, val ];
                    }
                }
            }
        }
		return result[1];
    }

    resolve() {
        if (this.resolved) {
            return this.state;
        }
        if (this.resolving) {
            return 'undefined';
        }
        const trueRules = {};
        this.resolving = true;
        if (this.dependencies.length) {
            for (let rule of this.dependencies) {
                if (this.resolver.evaluateCondition(rule.condition, this.parent.facts) === 'true') {
                    trueRules[rule] = this.resolver.evaluateImplication(rule.implication, this.parent.facts, this.letter, false)
                }
            }
            this.resolving = false;
            if (trueRules) {
                this.state = this.constructor.getState(trueRules);
            }
            return this.state;
        } else {
            this.resolving = false;
			this.resolved = true;
			return this.state;
        }
    }
}

module.exports = {
    Fact
};