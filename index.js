const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require("moment");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const sessison = require("express-session");

const methodOverride = require("method-override");
const flash = require("express-flash");

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

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

app.use(express.static(`${__dirname}/public`));

//views
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//route
routeAdmin(app);
route(app);

app.use((req, res, next) => {
  res.render("client/pages/error/404.pug", {
    titlePage: "404 Not Found",
  });
});

//variable locals
const system = require("./config/system");
app.locals.prefixAdmin = system.prefixAdmin;
app.locals.moment = moment;
app.listen(process.env.PORT, () =>
  console.log(`server is running on port ${process.env.PORT}`)
);
