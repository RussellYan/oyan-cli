const path = require('path');
const fs = require('fs-extra');
const Inquirer = require('inquirer');
const Creator = require('./creator');

module.exports = async function(name, option) {
  console.log(name, option);
  // 获取当前命令执行时的工作目录
  const cwd = process.cwd();
  const targetDir = path.join(cwd, name);
  console.log(targetDir);
  if (fs.existsSync(targetDir)) {
    if (option.force) {
      await fs.remove(targetDir);
    } else {
      // 提示是否要覆盖
      const { action } = await Inquirer.prompt([
        {
          name: 'action',
          type: 'list', // 类型非常丰富
          message: 'Target directory already exists. Pick an action:',
          choices: [
            {name: 'Overwrite', value: 'overwrite'},
            {name: 'Cancel', value: false}
          ]
        }
      ]);
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        console.log(`\r\nRemoving...`);
        await fs.remove(targetDir);
      }
    }
  }
  // 创建项目
  const creator = new Creator(name, targetDir);
  creator.create();
}