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

// render home page
// app.get("/", (req, res) => {
//   render(res, "none", null);
// });

// // open create new post popup
// app.post("/newPost", (req, res) => {
//   render(res, "create", null);
// });

// // add new post and its content, redirect to home
// app.post("/addPost", (req, res) => {
//   if (req.body.submit !== "Cancel") {
//     newPost(req.body.user, req.body.title, req.body.body, req.body.tag);
//   }
//   res.redirect("/");
// });

// // open edit post popup
// app.post("/edit", (req, res) => {
//   const postID = Object.keys(req.body)[0];
//   render(res, "edit", postID);
// });

// // change the filter and redirect to home
// app.post("/filter", (req, res) => {
//   filter = req.body.tag;
//   res.redirect("/");
// });

// // apply changes from editing then redirect to home
// app.post("/changePost", (req, res) => {
//   const postID = Object.keys(req.body).filter((key) => !isNaN(Number(key)))[0];
//   const post = posts.filter((post) => post.id === Number(postID))[0];
//   if (post) {
//     post.date = `edited: ${newDateString(Date.now())}`;
//     post.username = req.body.user;
//     post.title = req.body.title;
//     post.body = req.body.body;
//     post.tag = req.body.tag;
//   }
//   res.redirect("/");
// });

// // delete post and redirect to home
// app.post("/delete", (req, res) => {
//   const postID = Object.keys(req.body)[0];
//   posts = posts.filter((post) => post.id !== Number(postID));
//   res.redirect("/");
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

// create a new post object and add it to the posts array
function newPost(user, title, body, tag) {
  const postID = Date.now();
  const postObj = {
    id: Number(postID),
    username: user && user.length > 0 ? user : "no-user",
    date: newDateString(postID),
    title: title && title.length > 0 ? title : "no title",
    body: body && body.length > 0 ? body : "no content",
    tag: tag,
  };
  posts.push(postObj);
}

// render the index file with the expected variables
function render(res, status, postID) {
  res.render("index.ejs", {
    posts: posts
      .filter((post) => (filter === "-1" ? true : post.tag === filter))
      .reverse(),
    status: status,
    postID: postID,
    tags: tags,
    filter: filter,
  });
}
