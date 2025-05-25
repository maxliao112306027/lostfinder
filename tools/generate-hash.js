// tools/generate-hash.js
import bcrypt from 'bcrypt';

const run = async () => {
  const password = 'a12345678'; // ← 請改成你想加密的密碼
  const hash = await bcrypt.hash(password, 10);
  console.log(`✅ bcrypt hash for "${password}":\n${hash}`);
};

run();
