import express from "express";
import Article from "./../models/article.js";

const router = express.Router();



router.get("/new", (req, res) => {
    res.render("articles/new", { article: new Article() })
});

router.get("/edit/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", { article: article })
});

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect("/");
    res.render("articles/show", { article: article });
})

router.post("/", async (req, res, next) => {
    req.article = new Article()
    next();
}, saveArticleAndRedirect("new"));

router.put("/:id", async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next();
}, saveArticleAndRedirect("edit"))

router.delete("/:id", async (req, res) => {
    try {
        // Trim any extra spaces from the id parameter
        const articleId = req.params.id.trim();
        await Article.findByIdAndDelete(articleId);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting article:", error);
        res.status(500).send("Error deleting article");
    }
});

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article

        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown

        try {
            await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            console.log(e)
            res.render(`articles/${path}`, { article: article });
        }
    }
}

export default router