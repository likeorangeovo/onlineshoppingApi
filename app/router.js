/*
 * @Descripttion: router
 * @Author: likeorange
 * @Date: 2023-03-24 16:33:23
 * @LastEditors: likeorange
 * @LastEditTime: 2023-04-13 16:28:35
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
  router.get('/getuserinfo', controller.user.getUserInfo);
  router.post('/updateuserinfo', controller.user.updateUserInfo);
  router.post('/updatepassword', controller.user.updatePassword);
  router.get('/searchgoods', controller.mall.SearchGoods);
  router.get('/adminusers', controller.admin.getUserInfo);
  router.get('/admingoods', controller.admin.getGoods);
};
