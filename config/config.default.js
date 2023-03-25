/*
 * @Descripttion: egg's config file
 * @Author: likeorange
 * @Date: 2023-03-24 16:33:23
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-24 23:42:38
 */
/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1679558502742_5126';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 数据库配置
  const connect = require('./dbconfig.js');
  config.mysql = {
    app: true, // 是否挂载到app下面
    agent: false, // 是否挂载到代理下面
    client: {
      host: connect.host,
      prot: connect.prot,
      user: connect.user,
      password: connect.password,
      database: connect.database,
    },
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  return {
    ...config,
    ...userConfig,
  };
};