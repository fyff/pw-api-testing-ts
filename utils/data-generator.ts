import articleRequestPayoad from "../request-objects/POST-article.json" assert { type: "json" };
import { faker } from "@faker-js/faker";

export function getNewRandomArticle() {
  const articleRequest = structuredClone(articleRequestPayoad);
  articleRequest.article.title = faker.lorem.sentence(3);
  articleRequest.article.description = faker.lorem.sentence(4);
  articleRequest.article.body = faker.lorem.paragraph(8);
  return articleRequest;
}
