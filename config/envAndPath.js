const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');


//ENV
function getClientEnvironment(publicUrl){
    const raw = Object.keys(process.env)
    .reduce(
        (env,key)=>{
            env[key] = process.env[key];
            return env;
        },
        {
            NODE_ENV: process.env.NODE_ENV || 'development',
            PUBLIC_URL: publicUrl,
        }
    );
    const stringified = {
        'process.env': Object.keys(raw).reduce((env, key) => {
          env[key] = JSON.stringify(raw[key]);
          return env;
        }, {}),
    }

    return {raw,stringified}
}

//PATH
const appDirectory = fs.realpathSync(process.cwd());
//path.resolve()将路径或路径片段序列解析为绝对路径。
const resolveApp = relativePath => path.resolve(appDirectory,relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
    process.env.NODE_ENV === 'development',
    require(resolveApp('package.json')).homepage,
    process.env.PUBLIC_URL
  );

  const buildPath = process.env.BUILD_PATH || 'build';

const paths = {
    appPath: resolveApp('.'),
    appBuild: resolveApp(buildPath),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    publicUrlOrPath
  }

  module.exports.getClientEnvironment = getClientEnvironment;
  module.exports.paths = paths;