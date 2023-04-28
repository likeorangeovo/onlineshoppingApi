const _ = require('lodash');
// 基于物品推荐
const RecommendGoodsService = class RecommendGoodsService {
  /**
  * 构造方法
  * @param {*倒查表所有数据组成的数组} data
  * @param {*商品ID} goodsId
  * @param {*用户ID} userId
  * @param {*相似度最高的前k个} k
  */
  constructor(data, userId, k, goodsId) {
    this.data = data;
    this.goodsId = goodsId;
    this.userId = userId;
    // 筛选前k个商品······用于模块一······
    this.k = k;
    // 保存待计算商品列表······用于模块一······
    this.goodsList = [];
    // 保存当前商品的购买人列表······用于模块一······
    this.users = [];
    // 保存当前商品相似度列表······用于模块一······
    this.simpleList = [];
    // 开启第二子系统-模块二
    // 保存当前人喜爱商品列表
    this.userPerferList = [];
    // 保存当前人没买过的商品列表
    this.goodsMayPerferList = [];
    // 保存推荐结果并排序
    this.resultRank = [];
    // 最终结果
    this.result = [];
  }

  /**
  * 入口
  */
  start() {
    // 获取待计算数据
    this.getInitialData();
    // 开始计算用户对未买过的商品感兴趣程度
    for (const goodsId of this.goodsMayPerferList.values()) {
      const res = this.getUserInterest(goodsId);
      this.resultRank.push(res);
    }
    // 逆序排序
    this.resultRank.sort((a, b) => {
      return b.grade - a.grade;
    });
    // 获取最终结果
    this.result = this.resultRank.reduce((array, obj) => {
      array.push(obj.goodsId);
      return array;
    }, []);
    return this.result;
  }
  /**
  * 计算用户对该商品的感兴趣程度
  * @param {*商品ID} goodsId
  */
  getUserInterest(goodsId) {
    // 获取goodsId相似的商品列表
    const simple = this.getGoodsGrade(false, goodsId);
    let grade = 0;
    for (const [ index, obj ] of simple.entries()) {
      if (this.userPerferList.includes(obj.goodsId) && index < this.k) {
        grade += obj.grade;
      }
    }
    return { goodsId, grade };
  }
  /**
  * 获取待计算数据
  */
  getInitialData() {
    // 获取当前人的喜爱记录
    this.userPerferList = this.data.reduce((array, obj) => {
      if (obj.userId === this.userId && !array.includes(obj.goodsId)) {
        array.push(obj.goodsId);
      }
      return array;
    }, []);
    // 获取当前用户没买过的商品列表
    this.goodsMayPerferList = this.data.reduce((array, obj) => {
      if (!array.includes(obj.goodsId) && !this.userPerferList.includes(obj.goodsId)) {
        array.push(obj.goodsId);
      }
      return array;
    }, []);
  }
  /**
  * 计算与商品goodsId相似的前k个商品列表,······模块一······
  * @param {*是否去掉自身相关的商品} isDelSelf
  * @param {*商品ID} goodsId
  */
  getGoodsGrade(isDelSelf, goodsId) {
    this.simpleList = [];
    this.goodsId = goodsId;
    // 获取待计算商品列表
    this.getGoodsList();
    // 获取当前商品的购买人列表
    this.users = this.getGoodsUserNum(this.goodsId);
    // 计算相似度
    for (const goodsId of this.goodsList.values()) {
      this.getGoodsSimple(goodsId);
    }
    // 根据相似度排序
    this.simpleList.sort((a, b) => {
      // 倒序
      return b.grade - a.grade;
    });
    // 是否排除掉自身
    if (isDelSelf) {
      this.getNotSelfGoods();
    }
    // 相似度归一化
    this.gradeNormalization();
    return this.simpleList;
  }
  /**
  * 获取目标商品数组
  */
  getGoodsList() {
    // 筛选除了本商品之外的商品数据
    const goodsArray = this.data.reduce((array, obj) => {
      if (obj.goodsId !== this.goodsId) {
        array.push(obj.goodsId);
      }
      return array;
    }, []);
    // 数组去重并解构
    const goods = [ ...new Set(goodsArray) ];
    // 得到目标商品列表
    this.goodsList = goods;
  }
  /**
  * 去掉已买过的商品，得到目标商品数组
  */
  getNotSelfGoods() {
    // 筛选当前用户买过的商品
    const userGoods = this.data.reduce((array, obj) => {
      if (obj.userId === this.userId) {
        array.push(obj.goodsId);
      }
      return array;
    }, []);
    // 删除本用户买过的商品
    for (const [ index, obj ] of this.simpleList.entries()) {
      if (userGoods.includes(obj.goodsId)) {
        this.simpleList.splice(index, 1);
      }
    }
  }
  /**
  * 获取商品相似度列表
  * @param {商品ID} goodsId
  */
  getGoodsSimple(goodsId) {
    const users = this.getGoodsUserNum(goodsId);
    // 计算相似度的分母
    const bottom = Math.sqrt(this.users.length * users.length);
    let count = 0;
    // 计算两个商品的共同用户数，得到相识度的分子
    for (const val of users.values()) {
      if (this.users.includes(val)) {
        // 惩罚活跃用户
        count += this.getSimpleElememt(val);
      }
    }
    // 保存结果对象，包括商品ID和相似度
    const res = {
      goodsId,
      grade: count / bottom,
    };
    this.simpleList.push(res);
  }
  /**
  * 提升算法，惩罚活跃用户，计算相似度分子
  * @param {*用户ID} userId
  */
  getSimpleElememt(userId) {
    // 找到用户买过的商品数量
    const goodsNum = this.data.reduce((array, obj) => {
      if (obj.userId === userId) {
        array.push(obj.goodsId);
      }
      return array;
    }, []);
    const count = [ ...new Set(goodsNum) ].length;
    const element = 1 / Math.log(1 + count);
    return element;
  }
  /**
  * 获取商品的购买人
  * @param {*商品ID} goodsId
  */
  getGoodsUserNum(goodsId) {
    // 得到商品的购买人
    const users = this.data.reduce((array, obj) => {
      if (obj.goodsId === goodsId) {
        array.push(obj.userId);
      }
      return array;
    }, []);
    return [ ...new Set(users) ];
  }
  /**
  * 相似度归一化
  */
  gradeNormalization() {
    // 取最大值
    const max = this.simpleList[0].grade;
    for (const index of this.simpleList.keys()) {
      this.simpleList[index].grade = this.simpleList[index].grade / max;
    }
  }
};

module.exports = { RecommendGoodsService };
