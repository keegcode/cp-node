const parseArguments = (rules = {}) => (arguments = []) => {
    const parsed = {};
    for(const argument of arguments) {
        const arg = argument.replace(/^-/, '');
        const rule = rules[arg];
        if(!rule) {
            throw new Error(`Provided argument ${argument} is not valid!`);
        }
        const { alias } = rule;
        parsed[alias || arg] = true;
    }
    return parsed;
}

module.exports = { parseArguments };