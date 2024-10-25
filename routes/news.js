const { Router } = require("express");
const toSummarizeText = require("../controllers/functions");

const db = require("./../prisma/db");

const dotenv = require("dotenv").config();
const app = Router();

const headers = new Headers();
headers.append("x-api-key", process.env.NEWS_API_KEY);

app.route("/").get(async (req, res) => {
  const { query } = req.params;
  const endpoint = `https://newsapi.org/v2/everything?q=${query}`;

  try {
    const resp = await fetch(endpoint, {
      headers,
      cache: "no-store",
      method: "GET",
    });

    const payload = await resp.json();

    const data = payload.articles.map((article, ...rest) => {
      if (article.content != null) {
        const summarizeText = toSummarizeText(article.content);
        return {
          content: summarizeText,
          ...rest,
        };
      }
    });

    return res.json({ msg: "fetch success", data }).status(200);
  } catch (error) {
    console.log("ERROR: ", error.message);
    return res.json({ msg: error.message }).status(200);
  }
});

app
  .route(
    "/search/headlines/country/:country/category/:category?/query/:q?/pageSize/:pageSize?/page/:page?"
  )
  .get(async (req, res) => {
    const { country, category, page, pageSize, q } = req.params;

    const endpoint = new URL(`https://newsapi.org/v2/top-headlines`);

    endpoint.searchParams.append("q", q);
    endpoint.searchParams.append("country", country);
    endpoint.searchParams.append("category", category);
    endpoint.searchParams.append("page", page);
    endpoint.searchParams.append("pageSize", pageSize);

    const resp = await fetch(endpoint, {
      headers,
      method: "GET",
    });

    const payload = await resp.json();

    return res.json({ msg: "fetch success", payload }).status(200);
  });

app.route("/:userId").get(async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await db.posts.findMany({
      where: { userId },
      include: {
        comments: true,
        like: true,
      },
    });

    return res
      .json({ message: "Posts are fetched", data: { posts } })
      .status(200);
      
  } catch (err) {
    return res
      .json({ message: "Something went wrong", error: err.message })
      .status(500);
  }
});

app.route("/:newsId/like").post(async (req, res) => {
  const data = req.body;
  const articleId = req.params.newsId;

  try {
    await db.like.create({
      data: {
        articleId: articleId,
        userId: data?.userId,
      },
    });

    return res
      .json({
        message: `${data?.userId} likes ${articleId}`,
      })
      .status(201);
  } catch (e) {
    console.log("An error occured : ", e.message);

    return res
      .json({
        message: "Unable to like article",
      })
      .status(500);
  }
});

app.route("/:newsId/comment").post(async (req, res) => {
  const articleId = req.params.newsId;
  const body = req.body;

  try {
    await db.comments.create({
      data: {
        articleId: articleId,
        userId: body?.userId,
        comment: body?.comment,
      },
    });

    return res
      .json({
        message: `${body?.userId} comment on ${articleId}`,
      })
      .status(201);
  } catch (e) {}
});

module.exports = app;
