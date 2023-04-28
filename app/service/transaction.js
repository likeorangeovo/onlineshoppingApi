/*
 * @Descripttion:process transaction logic
 * @Author: likeorange
 * @Date: 2023-04-05 17:43:49
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-28 21:16:00
 */
'use strict';

const { Service } = require('egg');
const SnowflakeID = require('../extend/application');
const moment = require('moment');
const { RecommendGoodsService } = require('../extend/recommend.js');
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
  async removeCart() {
    try {
      const { app, ctx } = this;
      const cartInfo = await app.mysql.query('delete from cart where user_id = ? and id = ?', [ ctx.session.userInfo.id, ctx.query.id ]);
      return { code: 1, data: cartInfo };
    } catch (error) {
      return error;
    }
  }
  async addOrder() {
    try {
      const { app, ctx } = this;
      const snid = new SnowflakeID({ mid: +new Date() }).generate();
      const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const orderInfo = await app.mysql.query('INSERT INTO `order` (`id`, `user_id`, `status`, `total_price`, `create_time`, `pay_time`, `deliver_time`, `receive_time`) VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL);', [
        snid,
        ctx.session.userInfo.id,
        0,
        Number(ctx.request.body.total_price),
        time ]);
      const detailInfo = await app.mysql.query('INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `price`) VALUES (?, ?, ?, ?);',
        [
          snid,
          ctx.request.body.goods_id,
          ctx.request.body.quantity,
          ctx.request.body.price,
        ]);
      return { code: 1, msg: '下单成功' };
    } catch (error) {
      return error;
    }
  }
  async getOrder() {
    try {
      const { app, ctx } = this;
      const data = [];
      const orderInfo = await app.mysql.query('select * from `order` where user_id = ? ', [ ctx.session.userInfo.id ]);
      console.log(orderInfo);
      for (const item of orderInfo) {
        const orderDetailInfo = await app.mysql.query('select * from `order_detail` where order_id = ? ', [ item.id ]);
        for (const info of orderDetailInfo) {
          const temp = JSON.parse(JSON.stringify(info));
          const goodsInfo = await app.mysql.query('select * from `goods` where id = ? ', [ info.product_id ]);
          temp.name = goodsInfo[0].name;
          temp.image = goodsInfo[0].list_pic_url;
          temp.status = item.status;
          temp.total_price = item.total_price;
          temp.time = moment(item.create_time).format('YYYY-MM-DD');
          data.push(temp);
        }
      }
      return { code: 1, data };
    } catch (error) {
      return error;
    }
  }
  async changeStatus() {
    try {
      const { app, ctx } = this;
      const changeInfo = await app.mysql.query('update `order` set status = ? where user_id = ? and id = ?', [ ctx.query.status, ctx.session.userInfo.id, ctx.query.id ]);
      return { code: 1, changeInfo };
    } catch (error) {
      return error;
    }
  }
  async recommendGoods() {
    try {
      const { app, ctx } = this;
      const data = [];
      const orderInfo = await app.mysql.query('select id,user_id from `order`');
      for (const item of orderInfo) {
        const orderDetailInfo = await app.mysql.query('select product_id from `order_detail` where order_id = ? ', [ item.id ]);
        for (const info of orderDetailInfo) {
          const temp = {};
          temp.userId = item.user_id;
          temp.goodsId = info.product_id;
          data.push(temp);
        }
      }
      const recommendGoodsService = new RecommendGoodsService(data, ctx.session.userInfo.id, 10);
      const result = recommendGoodsService.start();
      console.log(result);
      return { result };
    } catch (error) {
      return error;
    }
  }
}
module.exports = transactionService;
