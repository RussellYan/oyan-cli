const Inquirer = require('inquirer');
const downloadGitRepo = require('download-git-repo');
const util = require('util');
const path = require('path');
const { fetchRepoList, fetchTagList } = require('./request');
const {  wrapLoading } = require('./util');

class Creator {
  constructor(name, dir) {
    this.name = name;
    this.target = dir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }
  async create() {
    console.log(`\r\nCreating...`);
    // 开始创建
    // 1 先拉去当前组织下的模板
    const repo = await this.fetchRepo();
    // 2 在通过没不安找到版本号
    const tag = await this.fetchTag(repo);
    // 3 下载
    const dlUrl = await this.download(repo, tag);
    // 4 编译模板
  }

  async fetchRepo() {
    const repoList = await wrapLoading(fetchRepoList, 'waiting for fetching template...');
    if (!repoList || !repoList.length) return;
    const repoNames = repoList.map(item => item.name);
    const { repo } = await Inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repoNames,
      message: 'Please choose a template to create a project.'
    });
    return repo
  }

  async fetchTag(repo) {
    const tags = await wrapLoading(fetchTagList, 'waiting for fetching tagList...', repo);
    if (!tags || !tags.length) return;
    const tagNames = tags.map(item => item.name);
    const { tag } = await Inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagNames,
      message: 'Please choose a tag to create a project.'
    });
    return tag;
  }

  async download(repo, tag) {
    // 1. 拼接下载路径
    // zhu-cli/vue-template#1.0
    const requireUrl = `zhu-cli/${repo}${tag?'#' + tag : ''}`;
    const dir = path.resolve(process.cwd(), `${repo}@${tag}`);

    // 2. 把资源下载到某个路径（后续可以增加缓存功能, 应该下载到系统目录中，
    // 稍后可以再使用ejs handlerbar 去渲染模板, 最后胜出结果再写入

    // 3. 放到系统文件中 -> 模板 和其他用户的选择 => 生成结果 放到目录中
    
    // const data = await this.downloadGitRepo(requireUrl, dir);
    const data = wrapLoading(this.downloadGitRepo, 'downloading template...', requireUrl, dir)
    return data;
  }

}

module.exports = Creator;