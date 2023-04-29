/*
 * @Descripttion: parses some requests about transaction
 * @Author: likeorange
 * @Date: 2023-04-05 17:41:44
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-29 16:14:28
 */

'use strict';

const { Controller } = require('egg');

class transactionController extends Controller {
  async addCart() {
    const { ctx } = this;
    try {
      const res = await ctx.service.transaction.addCart();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async getCart() {
    const { ctx } = this;
    try {
      const res = await ctx.service.transaction.getCart();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async removeCart() {
    const { ctx } = this;
    try {
      const res = await ctx.service.transaction.removeCart();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async addOrder() {
    const { ctx } = this;
    try {
      const res = await ctx.service.transaction.addOrder();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async getOrder() {
    const { ctx } = this;
    try {
      const res = await ctx.service.transaction.getOrder();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async changeStatus() {
    const { ctx } = this;
    try {
      const res = await ctx.service.transaction.changeStatus();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async recommendGoods() {
    const { ctx } = this;
    try {
      const res = await ctx.service.transaction.recommendGoods();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
  async getRecommendGoods() {
    const { ctx } = this;
    try {
      const res = await ctx.service.transaction.getRecommendGoods();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }
}

module.exports = transactionController;
