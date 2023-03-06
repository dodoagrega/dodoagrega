const { Client } = require("@notionhq/client");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

app.get("/", async (req, res) => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  const posts = response.results.map((page) => ({
    id: page.id,
    title: page.properties.Título.title[0].text.content,
    date: new Date(page.properties.Data.date.start).toLocaleDateString(
      "pt-BR"
    ),
    content: page.properties.Conteúdo.rich_text[0].text.content,
  }));

  res.send(`
    <html>
      <head>
        <title>Mini Blog</title>
      </head>
      <body>
        <h1>Mini Blog</h1>
        ${posts
          .map(
            (post) => `
              <h2>${post.title}</h2>
              <h3>${post.date}</h3>
              <p>${post.content}</p>
            `
          )
          .join("")}
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running on <http://localhost>:${port}`);
});
