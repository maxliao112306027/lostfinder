"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = exports.signup = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 注意要加 .js 副檔名，ESM 規定
var signup = function signup(req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password,
      email = _req$body.email,
      phone = _req$body.phone;
  var role = 'user'; // 固定只能註冊 user

  var violation_count = 0;
  var sql = "\n    INSERT INTO user (username, password, email, phone, role, violation_count)\n    VALUES (?, ?, ?, ?, ?, ?)";

  _db["default"].query(sql, [username, password, email, phone, role, violation_count], function (err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          message: '帳號或信箱已存在'
        });
      }

      return res.status(500).json({
        message: '伺服器錯誤'
      });
    }

    res.status(201).json({
      message: '註冊成功'
    });
  });
};

exports.signup = signup;

var login = function login(req, res) {
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;
  var sql = "SELECT * FROM user WHERE username = ? AND password = ?";

  _db["default"].query(sql, [username, password], function (err, results) {
    if (err) return res.status(500).json({
      message: '伺服器錯誤'
    });
    if (results.length === 0) return res.status(401).json({
      message: '帳號或密碼錯誤'
    });
    res.status(200).json({
      message: '登入成功',
      user: results[0]
    });
  });
};

exports.login = login;
//# sourceMappingURL=authController.dev.js.map
