const { Algorithm } = require('./Alghorithm');
const { Fact } = require('./Fact');

const extractNewFacts = (str) => {
    const removeList = ['!', '+', '|', '^', '(', ')', '\n'];
    for (let char of removeList) {
        if (str.includes(char)) {
            str = str.replace(char, ' ');
        }
    }
    return str.split(' ');
};


class Rule {
    constructor(rule, parent) {
        this.condition = '';
		this.implication = '';

		this.parent = parent;
		this.rule = rule;
		this.algorithm = new Algorithm(this.rule);
		this.processRule();
    }

    processRule() {
        this.condition = this.algorithm.shuntingYard(this.algorithm.condition);
		this.implication = this.algorithm.shuntingYard(this.algorithm.implication);

		let facts = extractNewFacts(this.algorithm.condition);
		this.collectNewFacts(facts, false);
		facts = extractNewFacts(this.algorithm.implication);
		this.collectNewFacts(facts, true);
    }

    collectNewFacts(facts, implication) {
        for (let fact of facts) {
            if (fact.length === 1) {
                if (!this.parent.facts.includes(fact)) {
                    this.parent.facts[fact] = new Fact(fact, this.parent);
                }
                if (implication) {
                    this.parent.facts[fact].dependencies.push(this);
                }
            }
        }
    }
}

module.exports = {
    extractNewFacts,
    Rule
};



