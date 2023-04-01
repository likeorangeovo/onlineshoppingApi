/*
 * @Descripttion: parses some requests to render the homepage of the mall
 * @Author: likeorange
 * @Date: 2023-03-30 17:14:00
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-31 22:02:11
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
  async Category() {
    const { ctx } = this;
    try {
      const res = await ctx.service.mall.Category();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async CategoryGoods() {
    const { ctx } = this;
    try {
      const res = await ctx.service.mall.CategoryGoods();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async GoodDetail() {
    const { ctx } = this;
    try {
      const res = await ctx.service.mall.GoodDetail();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
}

module.exports = mallController;
