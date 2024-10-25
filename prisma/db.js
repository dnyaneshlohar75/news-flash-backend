const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient({
  log: ["info", "error"],
});

db.$connect().then(() => {
  console.log("DATABASE CONNECTED");
}).catch(() => {
  console.log("[ERROR] DATABASE CONNECTION FAILED");
});

db.$disconnect().then(() => {
  console.log("DATABASE DISCONNECTED");
})

module.exports = db;