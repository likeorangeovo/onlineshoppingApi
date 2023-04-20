/* eslint-disable eqeqeq */
/*
 * @Descripttion:process admin  business logic
 * @Author: likeorange
 * @Date: 2023-03-30 17:53:48
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-13 16:36:43
 */
'use strict';

const { Service } = require('egg');
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
}
module.exports = adminService;
