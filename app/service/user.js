/*
 * @Descripttion: process the user's business logic
 * @Author: likeorange
 * @Date: 2023-03-24 16:53:13
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-25 13:50:52
 */

'user strict';

const SnowflakeID = require('../extend/application');
const Service = require('egg').Service;

class userService extends Service {
  async RegisterUser() {
    try {
      const app = this.app;
      const ctx = this.ctx;
      // eslint-disable-next-line prefer-const
      let userInfo = ctx.request.body;
      const nameRes = await app.mysql.get(
        'user', { username: userInfo.username }
      );
      if (nameRes != null) {
        const errRes = { code: 0, msg: '用户名被占用，请更换其他用户名！' };
        throw errRes;
      } else {
        userInfo.password = ctx.helper.encrypt(userInfo.password);
        const snid = new SnowflakeID({ mid: +new Date() });
        const regRes = await app.mysql.query(
          'insert into user set ?', [{
            id: snid.generate(),
            username: userInfo.username,
            password: userInfo.password,
            phone: userInfo.phone,
            email: userInfo.email,
            avatar: userInfo.avatar,
          }]
        );
        if (regRes != null) {
          return { code: 1, msg: '注册成功，请登录' };
        }
        throw { code: 0, msg: '注册失败请稍后重试' };
      }
    } catch (err) {
      return err;
    }
  }
}

module.exports = userService;
