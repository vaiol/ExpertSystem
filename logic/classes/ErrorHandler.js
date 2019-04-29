class ErrorHandler {
    constructor() {
        this.errors = {};
    }

    static displayErrors(errorList, key) {
        if (!['global', 'processing'].includes(key)) {
            key = `line ${key}`;
        }
        console.log(`\t${key}:`);
        errorList.forEach(error => console.log(`\t\t${error}`));
    }

    throwErrors() {
        console.log('Errors:');
        for (const key in this.errors) {
            if (this.errors.hasOwnProperty(key)) {
                ErrorHandler.displayErrors(this.errors[key], key)
            }
        }
        process.exit(1);
    }
    throwError(key, message) {
        this.errors[key] = [message];
        this.throwErrors();
    }
}

module.exports = {
  errorHandler: new ErrorHandler(),
};