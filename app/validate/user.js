/*
 * @Descripttion: validate rules
 * @Author: likeorange
 * @Date: 2023-03-25 15:15:56
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-25 23:02:26
 */
'use strict';

module.exports = app => {
  const { validator } = app;
  // 自定义校验规则
  validator.addRule('username', (rule, value) => {
    if (value.length < 8 || value.length > 20) {
      throw { code: 0, msg: '用户名的长度应该在2-20之间' };
    }
  });
  validator.addRule('password', (rule, value) => {
    if (value.length < 8 || value.length > 20) {
      throw { code: 0, msg: '密码的长度应该在8-20之间' };
    }
  });
  validator.addRule('email', (rule, value) => {
    const re = RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/);
    if (!re.test(value)) {
      throw { code: 0, msg: '邮箱格式不正确' };
    }
  });
  validator.addRule('phone', (rule, value) => {
    const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
    if (!reg.test(value)) {
      throw { code: 0, msg: '手机号格式不正确' };
    }
  });
};

