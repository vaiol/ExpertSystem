import { ErrorHandler } from "../classes/ErrorHandler";

const validateAargs = () => {
    // TODO check length
    if (process.argv.length !== 2) {
        ErrorHandler.displayErrors();
    }
    return true;
};

const validateData = (line, place) => {
    let errors = [];
    for (let i = 0; i < line.length; i++) {
        const char = line.charAt(i);
        if (char !== char.toUpperCase()) {
            errors.push(`Wrong character ${char} in ${place}`)
        }
    }
    return errors;
};

const validateChars = (split, line) => {
    let errors = [];
    for (let item of split) {
        let wrongChars = ''.join(item.split(/[A-Z+()^!|?]+/)); // TODO check
        for (let char of wrongChars) {
            errors.push(`Wrong character ${char} in ${line}`)
        }
    }
    return errors;
};

const validateLine = (line) => {
    let errors = [];
    if (line[0] === '=' || line[0] === '?') {
        if (line[0] === '=') {
            errors += validateData(line.substring(1), 'facts')
        }
        if (line[0] === '?') {
            errors += validateData(line.substring(1), 'queries')
        }
    } else {
        if (line.search('<=>') > 0) {
            const split = line.split('<=>');
            if (split.length !== 2) {
                errors.push(`Rule ${line} is not valid`);
            } else {
                errors += validateChars(split, line);
            }
        } else if (line.search('=>') > 0) {
            const split = line.split('=>');
            if (split.length !== 2) {
                errors.push(`Rule ${line} is not valid`);
            } else {
                errors += validateChars(split, line);
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
    let errors = [];
    if (facts.length === 0 && !factFlag) {
        errors.push('No facts');
    }
    if (queries.length === 0) {
        errors.push('No queries');
    }
    if (errors.length === 0) {
        return errors;
    } else {
        return false;
    }
};