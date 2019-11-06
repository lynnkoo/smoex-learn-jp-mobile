const fs = require('fs')
const  path = require('path')
const yaml = require('js-yaml')
const OSS = require('ali-oss');

function getPath(name) {
  return path.join(__dirname, name)
}

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../config.yml'), 'utf8'));

console.log(config)
// const { aliyun } = config

const { auth, oss } = config

const client = new OSS({
  cname: true,
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: auth.accessKeyId,
  accessKeySecret: auth.accessKeySecret,
  bucket: oss.bucket,
  endpoint: oss.endpoint,
  secure: true,// (secure: true)则使用HTTPS，(secure: false)则使用HTTP
});

async function put(target, file) {
  try {
    //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
    const result = await client.put(target, file);
    console.log('Upload Success: ' +result.name);
  } catch (e) {
    console.log(e);
  }
}
function upload(dir) {
  fs.readdirSync(dir).forEach(function (file) {
      var pathname = path.join(dir, file);
      if (fs.statSync(pathname).isDirectory()) {
        upload(pathname);
      } else {
        let target = pathname.split('/build/')[1]
        if (oss.package) {
          target = `/${oss.package}/${target}`
        }
        if (!pathname.endsWith('map')) {
          put(target, pathname)
        }
      }
  });
}

upload(path.join(__dirname, '../build'))

// async function list () {
//   try {
//     // 不带任何参数，默认最多返回1000个文件。
//     let result = await client.list();
//     console.log(result);
//     // 根据nextMarker继续列出文件。
//     if (result.isTruncated) {
//       let result = await client.list({
//         marker: result.nextMarker
//       });
//     }
//   // 列举前缀为'my-'的文件。
//   console.log(result);
//   // 列举前缀为'my-'且在'my-object'之后的文件。

//   console.log(result);
//   } catch (e) {
//     console.log(e);
//   }
// }
// list();


// async function list () {
//   // 不带任何参数，默认最多返回1000个文件。
//   let result = await client.list();
//   console.log(result);
//   // 根据nextMarker继续列出文件。
//   if (result.isTruncated) {
//     let result = await client.list({
//       marker: result.nextMarker
//     });
//   }
// }
// list();
