/*
 * @Descripttion: some extensions to ctx objects
 * @Author: likeorange
 * @Date: 2023-03-24 21:53:33
 * @LastEditors: likeorange
 * @LastEditTime: 2023-03-24 23:36:54
 */
const bcrypt = require('bcryptjs');
module.exports = {
  encrypt(password) {
    const salt = bcrypt.genSaltSync(5); // 加盐
    const hash = bcrypt.hashSync(password, salt);// 哈希（同步调用）
    return hash;
  },
  compare(password, hash) {
    return bcrypt.compareSync(password, hash);// 比对
  },
};
