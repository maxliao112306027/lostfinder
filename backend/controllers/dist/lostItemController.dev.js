"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllLostItems = exports.registerLostItem = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var registerLostItem = function registerLostItem(req, res) {
  var _req$body, name, description, location, lost_date, user_id, image;

  return regeneratorRuntime.async(function registerLostItem$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, description = _req$body.description, location = _req$body.location, lost_date = _req$body.lost_date, user_id = _req$body.user_id;
          image = req.file ? req.file.filename : null;
          _context.next = 5;
          return regeneratorRuntime.awrap(_db["default"].query("\n      INSERT INTO lost_items (name, description, location, lost_date, image)\n      VALUES (?, ?, ?, ?, ?)\n    ", [name, description, location, lost_date, image, user_id]));

        case 5:
          res.json({
            message: '遺失物登記成功'
          }); // ✅ 一定要有這行

          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error('❌ 登記失敗:', _context.t0);
          res.status(500).json({
            error: '伺服器錯誤'
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.registerLostItem = registerLostItem;

var getAllLostItems = function getAllLostItems(req, res) {
  var _ref, _ref2, rows;

  return regeneratorRuntime.async(function getAllLostItems$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM lost_items ORDER BY created_at DESC'));

        case 3:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 1);
          rows = _ref2[0];
          res.json(rows);
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: '查詢失敗',
            error: _context2.t0
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getAllLostItems = getAllLostItems;
//# sourceMappingURL=lostItemController.dev.js.map
