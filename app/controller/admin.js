/*
 * @Descripttion: parses some requests to render the homepage of the admin
 * @Author: likeorange
 * @Date: 2023-03-30 17:14:00
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-21 23:45:52
 */

'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mkdirp = require('mkdirp');
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

  async updateGood() {
    const { ctx } = this;
    try {
      const res = await ctx.service.admin.updateGood();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }

  async addGood() {
    const { ctx } = this;
    try {
      const res = await ctx.service.admin.addGood();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }

  async getOrder() {
    const { ctx } = this;
    try {
      const res = await ctx.service.admin.getOrder();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }

  async changeOrder() {
    const { ctx } = this;
    try {
      const res = await ctx.service.admin.changeOrder();
      ctx.body = res;
    } catch (error) {
      return error;
    }
  }

  async uploadAvatar() {
    const { ctx, config } = this;
    try {
      // 0、获取文件
      const file = ctx.request.files[0];
      // ctx.request.files[0] 表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
      const fileData = fs.readFileSync(file.filepath);
      // 1、获取当前日期
      const day = moment(new Date()).format('YYYYMMDD');
      // 2、创建图片保存的路径
      const dir = path.join(config.uploadAvatarDir);
      // 3、创建目录
      mkdirp(dir);
      // 4、生成路径返回
      const date = Date.now(); // 毫秒数
      const tempDir = path.join(dir, date + path.extname(file.filename)); // 返回图片保存的路径
      // 5、写入文件夹
      try {
        const a = fs.writeFileSync(tempDir, fileData);
      } catch (error) {
        return error;
      }
      ctx.body = {
        status: 200,
        desc: '上传成功',
        data: date + path.extname(file.filename),
      };
    } catch (error) {
      ctx.body = {
        status: 500,
        desc: '上传失败',
        data: null,
        err: error,
      };
    } finally {
      // 6、清除临时文件
      ctx.cleanupRequestFiles();
    }
  }

  async download() {
    const { ctx, config } = this;
    const hash = ctx.params.filename;
    const fullPath = path.join(config.uploadAvatarDir, hash);

    // 检查文件是否存在
    const exist = await fs.existsSync(fullPath);
    if (!exist) {
      ctx.status = 404;
      return;
    }
    const fileContent = fs.readFileSync(fullPath);
    ctx.set('Content-Type', 'image/jpeg');
    ctx.body = fileContent;
  }
}

module.exports = adminController;
