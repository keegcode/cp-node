const tests = [
    require('./dir-to-dir'),
    require('./file-to-dir'),
];

const run = ({ name, handler, timeout = 10000 }) => {
    return new Promise(async (resolve, reject) => {
        const timer = setTimeout(reject, timeout, new Error(`Test case: ${name} has broken max timeout: ${timeout}!`));
        const { success = true, error } = await handler() || {};
        clearTimeout(timer);
        resolve({ success, error });
    })
}

const main = async () => {
    const results = [];
    for(const test of tests) {
        const { success, error } = await run(test);
        console.log(`Test: ${test.name}\nSuccess: ${success}${success ? '' : `\nReason: ${JSON.stringify(error)}`}\n`);
        results.push(success);
    }
    const successful = results.filter(Boolean).length;
    const failed = results.length - successful;
    console.log(`Successful: ${successful}\nFailed: ${failed}`);
}

main();



