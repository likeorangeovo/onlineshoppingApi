/*
 * @Descripttion: parses some requests to render the homepage of the admin
 * @Author: likeorange
 * @Date: 2023-03-30 17:14:00
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-13 16:34:20
 */

'use strict';

const { Controller } = require('egg');

class adminController extends Controller {
  async getUserInfo() {
    const { ctx } = this;
    try {
      const res = await ctx.service.admin.getUserInfo();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }

  async getGoods() {
    const { ctx } = this;
    try {
      const res = await ctx.service.admin.getGoods();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
}

module.exports = adminController;
