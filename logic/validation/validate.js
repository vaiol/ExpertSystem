import { ErrorHandler } from "../classes/ErrorHandler";

const validateAargs = () => {
    if (process.argv !== 2) {
        ErrorHandler.showUsage();
    }
};