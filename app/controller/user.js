/*
 * @Descripttion: parses user input and returns result after processing
 * @Author: likeorange
 * @Date: 2023-03-24 16:40:59
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-25 22:57:02
 */

'user strict';
const { Controller } = require('egg');
class userController extends Controller {
  // 注册
  async RegisterUser() {
    const ctx = this.ctx;
    try {
      // 验证用户信息合法性
      ctx.validate({
        username: 'username',
        password: 'password',
      }, ctx.body);
      // 注册用户
      const res = await ctx.service.user.RegisterUser();
      ctx.body = res;
    } catch (error) {
      ctx.body = error;
    }
  }

  async Login() {
    const { ctx } = this;
    try {
      // 验证用户信息合法性
      ctx.validate({
        username: 'username',
        password: 'password',
      }, ctx.request.body);
      // 用户登录
      const res = await ctx.service.user.Login();
      ctx.body = res;
    } catch (error) {
      ctx.body = error;
    }
  }

  async Logout() {
    const { ctx } = this;
    try {
      // 用户登出
      const res = await ctx.service.user.Logout();
      ctx.body = res;
    } catch (error) {
      ctx.body = error;
    }
  }

}

module.exports = userController;
