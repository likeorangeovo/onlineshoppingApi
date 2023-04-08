/*
 * @Descripttion: router
 * @Author: likeorange
 * @Date: 2023-03-24 16:33:23
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-05 20:46:38
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/register', controller.user.RegisterUser);
  router.post('/login', controller.user.Login);
  router.get('/logout', controller.user.Logout);
  router.get('/carousel', controller.mall.Carousel);
  router.get('/hotgoods', controller.mall.HotGoods);
  router.get('/category', controller.mall.Category);
  router.get('/categorygoods', controller.mall.CategoryGoods);
  router.get('/gooddetail', controller.mall.GoodDetail);
  router.post('/addcart', controller.transaction.addCart);
  router.get('/getcart', controller.transaction.getCart);
  router.get('/removecart', controller.transaction.removeCart);
  router.post('/addorder', controller.transaction.addOrder);
  router.get('/getorder', controller.transaction.getOrder);
  router.get('/changestatus', controller.transaction.changeStatus);
};
