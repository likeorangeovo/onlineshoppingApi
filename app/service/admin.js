/* eslint-disable eqeqeq */
/*
 * @Descripttion:process admin  business logic
 * @Author: likeorange
 * @Date: 2023-03-30 17:53:48
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-25 23:15:25
 */
'use strict';

const { Service } = require('egg');
const moment = require('moment');
class adminService extends Service {
  async getUserInfo() {
    const { app, ctx } = this;
    try {
      const userInfoRes = await app.mysql.query('select * from user');
      const res = [];
      for (let item of userInfoRes) {
        item = JSON.parse(JSON.stringify(item));
        const addressInfo = await app.mysql.query(
          'select * from address where user_id = ?', [ item.id ]);
        if (addressInfo.length !== 0) {
          item.receiver = addressInfo[0].receiver;
          item.address = addressInfo[0].address;
        }
        delete item.password;
        res.push(item);
      }
      return { code: 1, data: res };
    } catch (error) {
      return error;
    }
  }

  async getGoods() {
    const { app, ctx } = this;
    try {
      const goodsInfoRes = await app.mysql.query('select * from goods');
      const res = [];
      return { code: 1, data: goodsInfoRes };
    } catch (error) {
      return error;
    }
  }

  async updateGood() {
    const { app, ctx } = this;
    const params = ctx.request.body;
    try {
      const goodsInfoRes = await app.mysql.query(
        'update `goods` set category_id = ?,name = ?,goods_brief = ?,retail_price = ?,goods_number = ?, sell_volume = ?, primary_pic_url = ?, list_pic_url = ? where id = ?',
        [ params.category_id, params.name, params.goods_brief, params.retail_price, params.goods_number, params.sell_volume, params.primary_pic_url, params.list_pic_url, params.id ]);
      if (goodsInfoRes.length != 0) {
        return { code: 1, msg: '修改成功' };
      }
      return { code: 0, msg: '修改失败' };
    } catch (error) {
      return error;
    }
  }

  async addGood() {
    const { app, ctx } = this;
    const params = ctx.request.body;
    try {
      const goodsInfoRes = await app.mysql.query(
        'insert into goods set ?',
        [{ category_id: params.category_id,
          name: params.name,
          goods_brief: params.goods_brief,
          retail_price: params.retail_price,
          goods_number: params.goods_number,
          sell_volume: params.sell_volume,
          primary_pic_url: params.primary_pic_url,
          list_pic_url: params.list_pic_url }]);
      if (goodsInfoRes.length != 0) {
        return { code: 1, msg: '修改成功' };
      }
      return { code: 0, msg: '修改失败' };
    } catch (error) {
      return error;
    }
  }

  async getOrder() {
    const { app, ctx } = this;
    try {
      const { app, ctx } = this;
      const data = [];
      const orderInfo = await app.mysql.query('select * from `order`');
      for (const item of orderInfo) {
        const orderDetailInfo = await app.mysql.query('select * from `order_detail` where order_id = ? ', [ item.id ]);
        for (const info of orderDetailInfo) {
          const temp = JSON.parse(JSON.stringify(info));
          const goodsInfo = await app.mysql.query('select * from `goods` where id = ? ', [ info.product_id ]);
          temp.name = goodsInfo[0].name;
          temp.image = goodsInfo[0].list_pic_url;
          temp.status = item.status;
          temp.total_price = item.total_price;
          temp.user_id = item.user_id;
          temp.time = moment(item.create_time).format('YYYY-MM-DD');
          data.push(temp);
        }
      }
      return { code: 1, data };
    } catch (error) {
      return error;
    }
  }

  async changeOrder() {
    try {
      const { app, ctx } = this;
      const changeInfo = await app.mysql.query('update `order` set status = ? where id = ?', [ ctx.query.status, ctx.query.id ]);
      return { code: 1, changeInfo };
    } catch (error) {
      return error;
    }
  }
}
module.exports = adminService;
