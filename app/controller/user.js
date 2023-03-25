/*
 * @Descripttion: parses user input and returns result after processing
 * @Author: likeorange
 * @Date: 2023-03-24 16:40:59
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-25 17:28:41
 */

'user strict';
const { Controller } = require('egg');
class userController extends Controller {
  async RegisterUser() {
    const ctx = this.ctx;
    try {
      // 验证用户信息合法性
      ctx.validate({
        username: 'username',
        password: 'password',
        phone: 'phone',
        email: 'email',
      }, ctx.request.body);
      // 注册用户
      const res = await ctx.service.user.RegisterUser();
      ctx.body = res;
    } catch (error) {
      ctx.body = error;
    }
  }

}

module.exports = userController;
