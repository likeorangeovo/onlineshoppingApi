/*
 * @Descripttion: egg's config file
 * @Author: likeorange
 * @Date: 2023-03-24 16:33:23
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-26 13:39:39
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
    credentials: true,
  };
  config.validate = {
    // 配置参数校验器，基于parameter
    convert: true, // 对参数可以使用 convertType 规则进行类型转换
    // validateRoot: false,   // 限制被验证值必须是一个对象。
    widelyUndefined: true,
  };
  config.session = {
    key: 'EGG_SESS',
    maxAge: 604800000,
    httpOnly: true,
    encrypt: true,
  };

  return {
    ...config,
    ...userConfig,
  };
};
