const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryID(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid Repository ID" })
  }

  return next()
}

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const likes = 0;

  if (!title) {
    response.status(400).json({ error: "Digite o título" })
  } else if (!url) {
    response.status(400).json({ error: "Digite a URL" })
  } else if (!techs) {
    response.status(400).json({ error: "Digite as tecnologias" })
  }

  const repository = { id: uuid(), title, url, techs, likes }

  repositories.push(repository)

  return response.json(repository)
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(rep => rep.id === id)

  if (repositoryIndex < 0) {
    response.status(400).json({ "error": "Repository not found" })
  }

  let likes = repositories[repositoryIndex].likes

  likes += 1

  repositories[repositoryIndex].likes = likes

  return response.json({ "likes": repositories[repositoryIndex].likes })
});

app.put("/repositories/:id", validateRepositoryID, (request, response) => {
  const { id } = request.params
  const { url, title, techs, likes } = request.body

  if (likes) {
    return response.status(400).json({ "likes": 0 })
  }

  const repositoryIndex = repositories.findIndex(rep => rep.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ "error": "Repository not found" })
  }

  const repository = {id, url, title, techs}

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(rep => rep.id === id)

  if (repositoryIndex < 0) {
    res.status(400).json({ "error": "Repository not found" })
  }

  repositories.splice(repositoryIndex, 1)

  return res.status(204).send()
});


module.exports = app;
