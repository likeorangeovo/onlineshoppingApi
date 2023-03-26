/*
 * @Descripttion: router
 * @Author: likeorange
 * @Date: 2023-03-24 16:33:23
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-24 23:48:50
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
};
