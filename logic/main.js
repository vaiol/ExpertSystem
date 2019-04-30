const { Expert } = require("./classes/expert");
const { validateArgs } = require("./validation/validate");

const main = () => {
    validateArgs();
    const expert = new Expert(process.argv[1], false);
    expert.validateFile();
    expert.parseFile();
    expert.validateData();
    expert.manageFacts();
	expert.manageRules();
	expert.manageQueries();
	expert.logResult();
};

main();