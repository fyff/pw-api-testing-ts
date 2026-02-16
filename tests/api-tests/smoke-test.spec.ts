import { test } from "../../utils/fixtures";
import { expect } from "../../utils/custom-expect";
import { faker } from "@faker-js/faker";
import { getNewRandomArticle } from "../../utils/data-generator";

test("Get Article list", async ({ api }) => {
  const response = await api.path("/articles").params({ limit: 10, offset: 0 }).getRequest(200);

  await expect(response).shouldMatchSchema("articles", "GET_articles");
  expect(response.articles.length).shouldBeLessThanOrEqual(10);
  expect(response.articlesCount).shouldEqual(10);
});

test("Get Tags", async ({ api }) => {
  const response = await api.path("/tags").getRequest(200);

  await expect(response).shouldMatchSchema("tags", "GET_tags");
  expect(response.tags[0]).shouldEqual("Test");
  expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test("Create and Delete Article", async ({ api }) => {
  const articleRequest = getNewRandomArticle();
  const createArticleResponse = await api.path("/articles").body(articleRequest).postRequest(201);

  await expect(createArticleResponse).shouldMatchSchema("articles", "POST_articles");
  expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title);
  const slugId = createArticleResponse.article.slug;

  const articleResponse = await api
    .path(`/articles/${slugId}`)
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(articleResponse.article.title).shouldEqual(articleRequest.article.title);

  await api.path(`/articles/${slugId}`).deleteRequest(204);

  const articleResponseAfterDelete = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(articleResponseAfterDelete.articles[0].title).not.shouldEqual(
    articleRequest.article.title,
  );
});

test("Create, Update and Delete Article", async ({ api }) => {
  const articleTitle = faker.lorem.sentence(5);
  const createArticleResponse = await api
    .path("/articles")
    .body({
      article: {
        title: articleTitle,
        description: "Creation",
        body: "TBD",
        tagList: [],
      },
    })
    .postRequest(201);

  expect(createArticleResponse.article.title).shouldEqual(articleTitle);
  const slugId = createArticleResponse.article.slug;

  const articleTitleUpd = faker.lorem.sentence(5);
  const updateArticleResponse = await api
    .path(`/articles/${slugId}`)
    .body({
      article: {
        title: articleTitleUpd,
        description: "Creation",
        body: "TBD",
        tagList: [],
      },
    })
    .putRequest(200);

  await expect(updateArticleResponse).shouldMatchSchema("articles", "PUT_articles");
  expect(updateArticleResponse.article.title).shouldEqual(articleTitleUpd);
  const newSlugId = updateArticleResponse.article.slug;

  const articleResponse = await api
    .path(`/articles/${newSlugId}`)
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(articleResponse.article.title).shouldEqual(articleTitleUpd);

  await api.path(`/articles/${newSlugId}`).deleteRequest(204);

  const articleResponseAfterDelete = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(articleResponseAfterDelete.articles[0].title).not.shouldEqual(articleTitleUpd);
});
