/*
 * @Descripttion: 加载校验规则
 * @Author: likeorange
 * @Date: 2023-03-25 15:18:22
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-25 15:18:36
 */

'use strict';

const path = require('path');

module.exports = app => {
  // 加载所有的校验规则
  const directory = path.join(app.config.baseDir, 'app/validate');
  app.loader.loadToApp(directory, 'validate');
};

