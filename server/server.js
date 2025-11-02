import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(express.static("public"));

let posts = [];
let users = [];

// check backend status
app.get("/status", (req, res) => {
  return res.status(200).json({ message: "OK" });
});

// PUT /users/add
app.put("/users/add", (req, res) => {
  const newUser = req.body;
  if (users.map((user) => user.username).includes(newUser.username)) {
    return res.json({ status: "Unavailable" });
  }
  users.push(newUser);
  return res.json({ status: "OK" });
});

// POST /users/auth
app.post("/users/auth", (req, res) => {
  const userInfo = req.body;
  const serverUser = users.find((user) => user.username === userInfo.username);
  if (serverUser === undefined) {
    return res.json({ status: "Not Found" });
  } else if (serverUser.password !== userInfo.password) {
    return res.json({ status: "Unauthorized" });
  } else {
    return res.json({ status: "OK" });
  }
});

// GET /posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// PUT /posts/new
app.put("/posts/new", (req, res) => {
  const postCreator = users.find((user) => user.username === req.body.user);
  const creatorName = postCreator ? postCreator.displayName : req.body.user;
  const newPost = {
    ...req.body,
    id: Date.now(),
    creatorName: creatorName,
  };
  posts.unshift(newPost);
  res.json(posts);
});

// DELETE /posts/delete/:id
app.delete("/posts/delete/:id", (req, res) => {
  const postID = req.params.id;
  posts = posts.filter((post) => `${postID}` !== `${post.id}`);
  res.json(posts);
});

// PATCH /posts/edit/:id
app.patch("/posts/edit/:id", (req, res) => {
  const postID = req.params.id;
  const thisPost = posts.find((post) => `${postID}` === `${post.id}`);
  if (thisPost && req.body) {
    thisPost.title = req.body.title;
    thisPost.body = req.body.body;
  } else {
    ``;
    return res.sendStatus(404);
  }
  return res.json(posts);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
