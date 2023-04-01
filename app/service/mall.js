/*
 * @Descripttion:process mall bus's business logic
 * @Author: likeorange
 * @Date: 2023-03-30 17:53:48
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-02 00:00:21
 */
'use strict';

const { Service } = require('egg');
class mallService extends Service {
  async Carousel() {
    try {
      const { app } = this;
      const carouselRes = await app.mysql.query('select * from goods where is_delete = 0 order by sort_order limit 0,3');
      return { code: 1, data: carouselRes };
    } catch (error) {
      return error;
    }
  }
  async HotGoods() {
    try {
      const { app, ctx } = this;
      const start = ctx.query.page;
      // eslint-disable-next-line prefer-const
      let hotgoodsRes = await app.mysql.query('select * from goods where is_delete = 0 order by is_hot desc limit ?,?', [ (start - 1) * 12, 12 ]);
      const totalRes = await app.mysql.query('select count(*) total from goods where is_delete = 0');
      return { code: 1, data: hotgoodsRes, total: totalRes[0].total };
    } catch (error) {
      return error;
    }
  }
  async Category() {
    try {
      const { app } = this;
      const CategoryRes = await app.mysql.query('select id,parent_id,name,level from category where is_show = 1');
      return { code: 1, data: CategoryRes };
    } catch (error) {
      return error;
    }
  }
  async CategoryGoods() {
    try {
      const { ctx, app } = this;
      const start = ctx.query.page;
      const categoryGoodsRes = await app.mysql.query(`select * from goods where category_id = ${ctx.query.id} limit ?,?`, [ (start - 1) * 12, 12 ]);
      const totalRes = await app.mysql.query(`select count(*) total from goods where category_id = ${ctx.query.id}`);
      return { code: 1, data: categoryGoodsRes, total: totalRes[0].total };
    } catch (error) {
      return error;
    }
  }
  async GoodDetail() {
    try {
      const { ctx, app } = this;
      const goodDetailRes = await app.mysql.query(`select * from goods where id = ${ctx.query.id}`);
      return { code: 1, data: goodDetailRes[0] };
    } catch (error) {
      return error;
    }
  }
}
module.exports = mallService;
