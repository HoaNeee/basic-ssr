const express = require("express");
const methodOverride = require("method-override");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const sessison = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser("abcxyzabc"));
app.use(sessison({ cookie: { maxAge: 60000 } }));
app.use(flash());

//config database
const database = require("./config/database");
database.connect();

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
