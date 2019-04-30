const { errorHandler } = require("../classes/ErrorHandler");


const validateAargs = () => {
    // TODO check length
    if (process.argv.length !== 2) {
        errorHandler.showUsage();
    }
    return true;
};

const validateData = (line, place) => {
    const errors = [];
    for (let i = 0; i < line.length; i++) {
        const char = line.charAt(i);
        if (char !== char.toUpperCase()) {
            errors.push(`Wrong character ${char} in ${place}`)
        }
    }
    return errors;
};

const validateChars = (split, line) => {
    const errors = [];
    for (let item of split) {
         // TODO check regexp
        let wrongChars = item.split(/[A-Z+()^!|?]+/).join('');
        for (let i = 0; i < wrongChars.length; i++) {
            const char = wrongChars.charAt(i);
            errors.push(`Wrong character ${char} in ${line}`)
        }
    }
    return errors;
};

const validateLine = (line) => {
    const errors = [];
    if (line[0] === '=' || line[0] === '?') {
        if (line[0] === '=') {
            errors.push(...validateData(line.slice(1), 'facts'))
        }
        if (line[0] === '?') {
            errors.push(...validateData(line.slice(1), 'queries'))
        }
    } else {
        if (line.includes('<=>')) {
            const split = line.split('<=>');
            if (split.length !== 2) {
                errors.push(`Rule ${line} is not valid`);
            } else {
                errors.push(...validateChars(split, line));
            }
        } else if (line.includes('=>')) {
            const split = line.split('=>');
            if (split.length !== 2) {
                errors.push(`Rule ${line} is not valid`);
            } else {
                errors.push(...validateChars(split, line));
            }
        } else {
            errors.push(`Rule ${line} is not valid`);
        }
    }
    if (errors.length) {
        return errors;
    } else {
        return false;
    }
};

const validateKnownData = (facts, queries, factFlag) => {
    const errors = [];
    if (!facts.length && !factFlag) {
        errors.push('No facts');
    }
    if (!queries.length) {
        errors.push('No queries');
    }
    if (errors.length) {
        return errors;
    }
    return false;
};