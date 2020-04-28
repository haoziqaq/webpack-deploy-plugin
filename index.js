/**
 * @description webpack部署插件
 * @author 齐皓
 * @Date 2020/4/27
 */
const client = require('scp2');
const ora = require('ora');
const chalk = require('chalk');
const spinner = ora();

function WebpackDeployPlugin(options) {
  this.host = options.host || '';
  this.username = options.username || '';
  this.password = options.password || '';
  this.assetsPath = options.assetsPath || '';
  this.targetPath = options.targetPath || '';
  this.port = options.port || ''
}

WebpackDeployPlugin.prototype.apply = function (compiler) {
  const _this = this;
  compiler.hooks.afterEmit.tap('WebpackDeployPlugin', function (compilation, callback) {
    spinner.start(`正在部署应用到${_this.host}${_this.targetPath}`)
    client.scp(_this.assetsPath, {
      port: _this.port,
      host: _this.host,
      username: _this.username,
      password: _this.password,
      path: _this.targetPath
    }, function (err) {
      if (err) {
        spinner.fail(chalk.red(`部署失败, 目标:${_this.host}${_this.targetPath}`));
        console.log(err);
      } else {
        spinner.succeed(chalk.green(`成功部署应用到${_this.host}${_this.targetPath}`));
      }
    })
  })
};

module.exports = WebpackDeployPlugin;
