/*
 * @Descripttion: parses user input and returns result after processing
 * @Author: likeorange
 * @Date: 2023-03-24 16:40:59
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-25 01:31:37
 */

'user strict';
const { Controller } = require('egg');
class userController extends Controller {
  async RegisterUser() {
    const ctx = this.ctx;
    const res = await ctx.service.user.RegisterUser();
    ctx.body = res;
  }

}

module.exports = userController;
