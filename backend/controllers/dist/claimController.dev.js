"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMyClaims = exports.submitClaimRequest = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var submitClaimRequest = function submitClaimRequest(req, res) {
  var _req$body, item_id, user_id, reason, _ref, _ref2, result;

  return regeneratorRuntime.async(function submitClaimRequest$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, item_id = _req$body.item_id, user_id = _req$body.user_id, reason = _req$body.reason;

          if (!(!item_id || !user_id)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: '缺少 item_id 或 user_id'
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(db.query("INSERT INTO claim_request (item_id, user_id, status, request_date)\n         VALUES (?, ?, 'pending', NOW())", [item_id, user_id]));

        case 6:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          result = _ref2[0];
          res.json({
            message: '認領申請已送出',
            request_id: result.insertId
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](3);
          console.error('❌ 認領申請失敗:', _context.t0);
          res.status(500).json({
            error: '伺服器錯誤'
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 12]]);
};

exports.submitClaimRequest = submitClaimRequest;

var getMyClaims = function getMyClaims(req, res) {
  var user_id, _ref3, _ref4, rows;

  return regeneratorRuntime.async(function getMyClaims$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user_id = req.query.user_id;

          if (user_id) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: '缺少 user_id'
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(db.query("SELECT c.*, i.item_name\n         FROM claim_request c\n         JOIN items i ON c.item_id = i.item_id\n         WHERE c.user_id = ?\n         ORDER BY c.request_date DESC", [user_id]));

        case 6:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          rows = _ref4[0];
          res.json(rows);
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](3);
          console.error('❌ 查詢認領失敗:', _context2.t0);
          res.status(500).json({
            error: '伺服器錯誤'
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 12]]);
};

exports.getMyClaims = getMyClaims;
//# sourceMappingURL=claimController.dev.js.map
