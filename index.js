const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const sessison = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

//config database
const database = require("./config/database");
database.connect();

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser("abcxyzabc"));
app.use(sessison({ cookie: { maxAge: 60000 } }));
app.use(flash());

//tinymce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

app.use(express.static(`${__dirname}/public`));

//views
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//route
route(app);
routeAdmin(app);

const system = require("./config/system");
app.locals.prefixAdmin = system.prefixAdmin;

app.listen(process.env.PORT, () =>
  console.log(`server is running on port ${process.env.PORT}`)
);
