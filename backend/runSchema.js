const fs = require("fs");
const pool = require("./config/db");

const schema = fs.readFileSync("./database/schema.sql", "utf-8");

pool.query(schema)
  .then(() => {
    console.log("Schema executed successfully 🚀");
    process.exit();
  })
  .catch(err => {
    console.error("Error running schema:", err);
    process.exit(1);
  });