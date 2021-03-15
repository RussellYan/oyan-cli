const ora = require('ora'); // 可以实现命令行loading等效果

async function sleep(n) {
  return new Promise((resolve, reject) => setTimeout(resolve, n));
}
async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();
  try {
    const result = await fn(...args);
    spinner.succeed('succeed');
    return result;
  } catch(error) {
    spinner.fail('request failed, will fetch again 2 seconds later...');
    // 失败后一秒重新加载
    await sleep(2000);
    return wrapLoading(fn, message, ...args);
  }
}

module.exports = {
  sleep,
  wrapLoading
}