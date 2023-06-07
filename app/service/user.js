/*
 * @Descripttion: process the user's business logic
 * @Author: likeorange
 * @Date: 2023-03-24 16:53:13
 * @LastEditors: likeorange
 * @LastEditTime: 2023-05-25 16:08:05
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

  async getUserInfo() {
    const { app, ctx } = this;
    try {
      let userInfoRes = await app.mysql.query(
        'select * from user where id = ?', [ ctx.session.userInfo.id ]);
      userInfoRes = JSON.parse(JSON.stringify(userInfoRes[0]));
      const addressInfo = await app.mysql.query(
        'select * from address where user_id = ?', [ ctx.session.userInfo.id ]);
      if (addressInfo.length !== 0) {
        userInfoRes.receiver = addressInfo[0].receiver;
        userInfoRes.address = addressInfo[0].address;
      }
      delete userInfoRes.password;
      return { code: 1, data: userInfoRes };
    } catch (error) {
      return error;
    }
  }

  async updateUserInfo() {
    const { app, ctx } = this;
    const userInfo = ctx.request.body;
    try {
      const userInfoRes = await app.mysql.query(
        'update `user` set username = ?,phone=?,email=? where id = ?', [
          userInfo.username,
          userInfo.phone,
          userInfo.email,
          ctx.session.userInfo.id ]);
      const addressCheck = await app.mysql.query(
        'select * from address where id = ?', [ ctx.session.userInfo.id ]);
      if (addressCheck.length !== 0) {
        const addressInfo = await app.mysql.query(
          'update `address` set receiver = ?,address=? where id = ?', [
            userInfo.receiver,
            userInfo.address,
            ctx.session.userInfo.id ]);
      } else {
        const addressInfo = await app.mysql.query(
          'insert into address set receiver = ?,address=?, user_id = ?', [
            userInfo.receiver,
            userInfo.address,
            ctx.session.userInfo.id ]);
      }
      return { code: 1, msg: '修改成功' };
    } catch (error) {
      return error;
    }
  }

  async updatePassword() {
    try {
      const { ctx, app } = this;
      const pwdInfo = ctx.request.body;
      pwdInfo.password = ctx.helper.encrypt(pwdInfo.password);
      const pwdRes = await app.mysql.query(
        'update user set password = ? where id = ?', [ pwdInfo.password, ctx.session.userInfo.id ]
      );
      if (pwdRes != null) {
        return { code: 1, msg: '修改成功' };
      }
      throw { code: 0, msg: '修改失败请稍后重试' };

    } catch (err) {
      return err;
    }
  }
}

module.exports = userService;
