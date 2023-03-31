/*
 * @Descripttion: parses some requests to render the homepage of the mall
 * @Author: likeorange
 * @Date: 2023-03-30 17:14:00
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-30 17:16:41
 */

'use strict';

const { Controller } = require('egg');

class mallController extends Controller {
  async Carousel() {
    const { ctx } = this;
    try {
      const res = await ctx.service.mall.Carousel();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async HotGoods() {
    const { ctx } = this;
    try {
      const res = await ctx.service.mall.HotGoods();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
}

module.exports = mallController;
