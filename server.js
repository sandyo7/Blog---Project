import express from "express";
import mongoose from "mongoose";
import articleRouter from "./routes/articles.js";
import Article from "./models/article.js"
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost/blog");

app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride("_method"));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    const articles = await Article.find().sort({createdAt: "desc"})
    res.render("articles/index.ejs", { articles: articles });
});

app.use("/articles", articleRouter);

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
});

