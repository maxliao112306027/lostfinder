"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _promise = _interopRequireDefault(require("mysql2/promise"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config(); // 必須在最前面呼叫！


console.log('✅ ENV 測試:', {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME
});

_dotenv["default"].config({
  path: '../../.env'
}); // 載入 .env 檔案的變數
// ✅ 錯誤提示


if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error('❌ 請確認 .env 中是否正確設定 DB_USER、DB_PASSWORD、DB_NAME');
}

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

var pool = _promise["default"].createPool({
  host: process.env.DB_HOST,
  // localhost
  user: process.env.DB_USER,
  // root
  password: process.env.DB_PASSWORD,
  // 你設的密碼
  database: process.env.DB_NAME,
  // lostfinder
  waitForConnections: true,
  connectionLimit: 10
});

var _default = pool;
exports["default"] = _default;
//# sourceMappingURL=db.dev.js.map
