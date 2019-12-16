var fs = require('fs');
var path = require('path');

//解析需要遍历的文件夹，我这以E盘根目录为例
var packagePath = path.resolve(__dirname, '../package.json');

start();

async function start() {
  getBbkVersions(packagePath);
}

function getBbkVersions(packagePath) {
  let packageJson = fs.readFileSync(packagePath, 'utf-8');
  packageJson = JSON.parse(packageJson);
  const dependencies = packageJson.dependencies
  const bbkDependencies = []
  let resString = `
  printf "start install"
  npm i `
  for (key in dependencies) {
    if (key.startsWith('@ctrip/bbk-')) {
      bbkDependencies.push(key)
      resString += `${key}@latest `
    }
  }

  resString += '--save'
  writePackageDependencies(resString);
}

function writePackageDependencies(content) {
  const filePath = path.resolve(__dirname, 'bbkInstall.sh');
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('writeBbkVersions done');
}