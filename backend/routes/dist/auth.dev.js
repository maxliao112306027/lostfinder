"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authController = require("../controllers/authController.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // 註冊 API


router.post('/signup', _authController.signup); // 登入 API

router.post('/login', _authController.login);
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=auth.dev.js.map
