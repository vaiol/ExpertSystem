const { errorHandler } = require('./ErrorHandler');

class Resolver {
    constructor() {
        this.operators = ['!', '+', '|', '^'];
		this.stack = [];
		this.operands = [];
    }

    static catchError(operands, values) {
        if (values.includes('true') && values.includes('false')) {
            errorHandler.throwError('processing', `Contradictory statements ${operands}`);
        }
    }
    static getOperator(implication, token, counter, operator) {
        let expecctedOperands = 1;
        if (token !== '!') {
            expecctedOperands = 2;
        }
        counter += expecctedOperands;
        if (!operator) {
            operator = token;
            implication = implication.slice(0, -1);
        } else {
            counter -= 1;
        }
        return { operator, implication, counter };
    }
    static getOperands(index, implication) {
        // TODO check slice
        const leftOperand = implication.slice(0, ((index - 1) * -1));
        const rest = implication.slice(((index - 1) * -1));
        return [leftOperand, rest];
    }
    static getQuery(operands, fact) {
        const result = [];
        for (const operand of operands) {
            if (operands.includes(fact)) {
                result.push(operand)
            }
        }
        return result;
    }
    static _not(operands) {
        const status = operands[0];
        if (status === 'true') {
            return 'false';
        }
        if (status === 'false' || status === 'none') {
            return 'true';
        }
        if (status === 'undefined') {
            return 'undefined';
        }
    }
    static _and(operands) {
        if (operands.includes('false')) {
            return 'false';
        }
        if (operands[0] === 'true' && operands[1] === 'true') {
            return 'true';
        }
        if (operands.includes('none')) {
            return 'none';
        }
        if (operands.includes('undefined')) {
            return 'undefined';
        }
    }
    static _or(operands) {
        if (operands.includes('true')) {
            return 'true';
        }
        if (operands.includes('none')) {
            return 'none';
        }
        if (operands.includes('undefined')) {
            return 'undefined';
        }
        return 'false';
    }
    static _xor(operands) {
        if (operands.includes('true') && (operands.includes('false') || operands.includes('none'))) {
            return 'true';
        }
        if (operands.includes('none')) {
            return 'none';
        }
        if (operands.includes('undefined')) {
            return 'undefined';
        }
        return 'false';
    }
    implicationNot(operands, facts, fact, convertedFlag) {
        // TODO check filter
        operands = operands.filter(item => item);
        if (operands.length > 1) {
            errorHandler.throwError('processing', `To many operands ${operands}`);
        }
        return this.evaluateImplication(operands[0], facts, fact, !convertedFlag);
    }
    implicationAnd(operands, facts, fact, convertedFlag) {
        if (convertedFlag) {
            return this.implicationOr([`${operands[0]}!`, `${operands[1]}!`], facts, fact, false);
        }
        operands = this.constructor.getQuery(operands, fact);
        const values = operands.map(operand => this.constructor.evaluateImplication(operand, facts, fact, false));
        this.constructor.catchError(operands, values);
        return Math.min(...values);
    }
    implicationOr(operands, facts, fact, convertedFlag) {
        if (convertedFlag) {
            return this.implicationAnd([`${operands[0]}!`, `${operands[1]}!`], facts, fact, false);
        }
        const queries = this.constructor.getQuery(operands, fact);
        if (!queries.length) {
            errorHandler.throwError('processing', 'Unknown fact');
        }
        if (queries.length === 1) {
            operands = operands.filter(item => item !== queries[0]);
            if (this.evaluateConition(operands[0], facts) !== 'false') {
                // TODO check this =>
                if (this.evaluateConition(operands[0], facts) !== 'false') {
                    return 'undefined';
                }
                return 'none';
            }
            return this.evaluateImplication(queries[0], facts, fact, false);
        }
        if (queries.length === 2) {
            if (this.evaluateCondition(operands[0], facts) === 'false') {
                return this.evaluateImplication(operands[1], facts, fact, false);
            }
			if (this.evaluateCondition(operands[1], facts) === 'false') {
			    return this.evaluateImplication(operands[0], facts, fact, false);
            }
			return 'undefined'
        }
    }
    implicationXor(operands, facts, fact, convertedFlag) {
        if (convertedFlag) {
            const leftCondition = `${operands[0]}!${operands[1]}!+`;
			const rightCondition = `${operands[0]}${operands[1]}+`;
			return this.implicationOr([leftCondition, rightCondition], facts, fact, false)
        }
		const leftCondition = `${operands[0]}!${operands[1]}+`;
		const rightCondition = `${operands[0]}${operands[1]}!+`;
		return self.implicationOr([leftCondition, rightCondition], facts, fact, false)
    }
    makeOperationCondition(token, operands, facts, fact, convertedFlag) {
        if (token === '!') {
            return this.implicationNot(operands, facts, fact, convertedFlag);
        }
		if (token === '+') {
            return this.implicationAnd(operands, facts, fact, convertedFlag);
        }
		if (token === '|') {
            return this.implicationOr(operands, facts, fact, convertedFlag);
        }
		if (token === '^') {
            return this.implicationXor(operands, facts, fact, convertedFlag);
        }
    }
}