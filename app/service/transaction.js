/*
 * @Descripttion:process transaction logic
 * @Author: likeorange
 * @Date: 2023-04-05 17:43:49
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-05 23:12:14
 */
'use strict';

const { Service } = require('egg');
class transactionService extends Service {
  async addCart() {
    try {
      const { app, ctx } = this;
      const cartInfo = ctx.request.body;
      const check = await app.mysql.query('select * from cart where user_id = ? and goods_id = ?', [ ctx.session.userInfo.id, cartInfo.id ]);
      if (check.length === 0) {
        const addCartRes = await app.mysql.query('insert into cart set ?', [{
          user_id: ctx.session.userInfo.id,
          goods_id: cartInfo.id,
          goods_name: cartInfo.name,
          retail_price: cartInfo.retail_price,
          number: cartInfo.goods_number,
          list_pic_url: cartInfo.list_pic_url,
        }]);
        return { code: 1, data: addCartRes, msg: '已加入购物车' };
      }
      const addCartRes = await app.mysql.query('update cart set number = ? where user_id = ? and goods_id = ?', [
        cartInfo.goods_number + check[0].number,
        ctx.session.userInfo.id,
        cartInfo.id,
      ]);
      return { code: 1, data: addCartRes, msg: '已加入购物车' };
    } catch (error) {
      return error;
    }
  }
  async getCart() {
    try {
      const { app, ctx } = this;
      const cartInfo = await app.mysql.query('select * from cart where user_id = ? ', [ ctx.session.userInfo.id ]);
      return { code: 1, data: cartInfo };
    } catch (error) {
      return error;
    }
  }
}
module.exports = transactionService;
