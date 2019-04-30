const { validateLine, validateKnownData } = require('../validation/validate');
const { errorHandler } = require('./ErrorHandler');
const { Rule } = require('./ErrorHandler');
const { Fact } = require('./ErrorHandler');
const fs = require('fs');


class Expert {
    constructor(filePath) {
        this.factsFlag = false;
		this.knownFacts = [];
		this.queries = [];
		this.rules = [];
		this.facts = {};
		this.result = [];
		this.path = filePath;
    }
	static getKnownData(line) {
        return line.split();
    }
	static cleanUpLine(line) {
        if (line.includes('#')) {
            line = line.split('#')[0];
        }
		for (const char of [' ', '\t', '\n', '\f', '\v']) {
            if (line.includes(char)) {
                line = line.replace(char, '');
            }
        }
        return line
    }
	static manageImplication(rule, rulesList) {
        if (rule.includes('<=>')) {
            const split = rule.split('<=>');
			const newRule = split[1] + '=>' + split[0];
			rulesList.push(newRule);
			rule = rule.replace('<=>', '=>');
        }
		rulesList.push(rule);
		return rulesList
    }
	static convertRule(rule) {
        return `!(${rule.implication})=>!(${rule.condition})`;
    }
	validateData() {
        const errors = validateKnownData(this.knownFacts, this.queries, this.factsFlag);
		if (errors || errorHandler.errors) {
		    if (errors) {
                errorHandler.errors['global'] = errors;
            }
			errorHandler.throwErrors();
        }
    }
	logResult() {
        for (const result of this.result) {
            console.log(result);
        }
    }
	validateFile() {
        if (this.ui === true) {
            return true;
        }
        if (!fs.existsSync(this.path)) {
            errorHandler.throwError('global', `File ${this.path} does not appear to exist.`)
        }
    }
	parseFile() {
        let i = 0;
        const data = fs.readFileSync(this.path);
        for (const line of data.split('\n')) {
            i++;
            this.manageLine(line, i)
        }
    }
	manageLine(line, i) {
        line = this.cleanUpLine(line);
		if (!line) { // todo  check
		    return;
        }
		const errors = validateLine(line);
		if (errors) {
            errors.errors[i] = errors;
        }
        const firstChar = line.charAt(0);
        if (firstChar === '=' || firstChar === '?') {
            if (firstChar === '=') {
                this.factsFlag = true;
                this.knownFacts = this.constructor.getKnownData(line.slice(1));
            }
            if (firstChar === '?') {
                this.queries = this.constructor.getKnownData(line.slice(1))
            }
        } else {
            this.rules.push(line)
        }
    }
	manageFacts() {
        for (const fact of this.queries) {
            this.facts[fact] = new Fact(fact, this);
        }
		for (const fact of this.knownFacts) {
		    this.facts[fact] = new Fact(fact, this);
			this.facts[fact].state = 'true';
			this.facts[fact].resolved = true;
        }
    }
	manageRules() {
        let tempRulesList = [];
		for (const rule of this.rules) {
		    tempRulesList = this.constructor.manageImplication(rule, tempRulesList)
		}
		this.rules = [];
		for (const rule of tempRulesList) {
		    this.rules.push(new Rule(rule, this));
		}
		for (const rule of this.rules) {
		    new Rule(this.constructor.convertRule(rule), this); // TODO EXTRA WHAAAAAAT????
        }
    }
	manageQueries() {
        for (const query of this.queries) {
            let result = this.facts[query].resolve();
			if (result === 'none') {
			    result = 'false (default)';
            }
			this.result.push(`${query} is ${result}`);
        }
    }
}

module.exports = {
    Expert
};

