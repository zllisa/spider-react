'use strict';
//webpack --config config/webpack.prod.js
const webpack = require('webpack');
const fsExtra = require('fs-extra');
const fs = require('fs');
const path = require('path');
const configFactory = require('../config/webpack.prod');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

//1.get prod webpack config 
//2.webpack(config)
//3.need use complier run hook if want to add message and warning and error etc.

// copyPublicFolder();
const complier = webpack(configFactory);
return new Promise((resolve, reject) => {
  complier.run((err,starts)=>{
    if(err){
      console.error(err);
    }else{
      copyPublicFolder();
      return resolve(starts);
    }
  })
})


function copyPublicFolder() {
    fsExtra.copySync(resolveApp('public'), resolveApp('dist'), {
      dereference: true,
    //   filter: file => file !== resolveApp(),
    });
  }