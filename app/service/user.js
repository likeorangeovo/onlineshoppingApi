/*
 * @Descripttion: process the user's business logic
 * @Author: likeorange
 * @Date: 2023-03-24 16:53:13
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-26 14:32:53
 */

'user strict';

const SnowflakeID = require('../extend/application');
const Service = require('egg').Service;

class userService extends Service {
  async RegisterUser() {
    try {
      const { ctx, app } = this;
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
            avatar: 'default.jpg',
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

  async Login() {
    const { ctx, app } = this;
    try {
      const userInfo = ctx.request.body;
      const logRes = await app.mysql.query(
        'select * from user where username = ?', [ userInfo.username ]);
      if (logRes.length === 0) {
        throw { code: 0, msg: '用户不存在或密码错误' };
      }
      const comRes = ctx.helper.compare(userInfo.password, logRes[0].password);
      if (comRes) {
        ctx.session.userInfo = logRes[0];
        ctx.session.isLogin = true;
        return { code: 1, msg: '登录成功' };
      }
      throw { code: 0, msg: '密码不正确' };
    } catch (error) {
      return error;
    }
  }

  async Logout() {
    const { ctx } = this;
    try {
      ctx.session.userInfo = null;
      ctx.session.isLogin = false;
      return { code: 1, msg: '登出成功!' };
    } catch (error) {
      return error;
    }
  }
}

module.exports = userService;
