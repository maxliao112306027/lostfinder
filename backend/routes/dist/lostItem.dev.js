"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _lostItemController = require("../controllers/lostItemController.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var upload = (0, _multer["default"])({
  dest: 'backend/uploads/'
});
router.get('/lostitems', _lostItemController.getAllLostItems);
router.post('/lostitems', upload.single('image'), _lostItemController.registerLostItem);
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=lostItem.dev.js.map
