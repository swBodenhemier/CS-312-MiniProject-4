import { useState, useEffect } from "react";
import axios from "axios";

export function HomePage() {
  // component visibility control
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);

  // client side state
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  return (
    <div className="w-full h-screen flex flex-col items-center bg-slate-200 p-4">
      <div className="max-w-4xl w-full flex flex-col gap-10 items-center px-10 py-5">
        <div className="w-full flex justify-between items-center">
          <div className="w-1/3"></div>
          <div className="w-1/3 text-center">
            <h1>My Blog</h1>
          </div>
          <div className="w-1/3 pt-2 flex gap-2 items-center justify-end">
            {user && <p>Username: {user}</p>}
            {user ? (
              <button className="button" onClick={() => setUser(null)}>
                Sign Out
              </button>
            ) : (
              <button className="button" onClick={() => setShowSignin(true)}>
                Sign In
              </button>
            )}
          </div>
        </div>
        <div className="w-full h-fit flex flex-col items-center bg-slate-300 px-10 pb-10 pt-4 border border-[#a0b0c0] rounded-lg">
          {user && (
            <button className="button" onClick={() => setShowNewPost(true)}>
              Create New Post
            </button>
          )}
          <div className="pt-4">
            {posts.length > 0 ? (
              posts.map((post) => <div className="segment"></div>)
            ) : (
              <div>No posts yet...</div>
            )}
          </div>
        </div>
      </div>
      {showSignup && (
        <Signup
          hide={() => setShowSignup(false)}
          signin={() => {
            setShowSignin(true);
            setShowSignup(false);
          }}
          setUser={(user) => setUser(user)}
        />
      )}
      {showSignin && (
        <Signin
          hide={() => setShowSignin(false)}
          signup={() => {
            setShowSignin(false);
            setShowSignup(true);
          }}
          setUser={(user) => setUser(user)}
        />
      )}
      {showNewPost && <BlogPostForm hide={() => setShowNewPost(false)} />}
    </div>
  );
}

function Signup({ hide, signin, setUser }) {
  const [formOptions, setFormOptions] = useState({
    username: "",
    displayName: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);

  async function addAccount(e) {
    setShowError(false);
    const result = await axios.put("/users/add", formOptions);
    if (result.data.status === "Unavailable") {
      setShowError(true);
    } else {
      setUser(formOptions.username);
      hide();
    }
  }

  return (
    <div className="popup">
      <div className="segment max-w-2xl flex flex-col items-center gap-4">
        <h2>Sign Up</h2>
        {showError && <div>A user with that username already exists.</div>}
        <div>
          Already have an account?{" "}
          <button className="text-blue-500 hover:underline" onClick={signin}>
            Sign In
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex justify-between">
            <label className="pr-2">Username: </label>
            <input
              className="w-50"
              onChange={(e) =>
                setFormOptions((prev) => {
                  prev.username = e.target.value;
                  return prev;
                })
              }
            />
          </span>
          <span className="flex justify-between">
            <label className="pr-2">Display Name: </label>
            <input
              className="w-50"
              onChange={(e) =>
                setFormOptions((prev) => {
                  prev.displayName = e.target.value;
                  return prev;
                })
              }
            />
          </span>
          <span className="flex justify-between">
            <label className="pr-2">Password: </label>
            <input
              className="w-50"
              type="password"
              onChange={(e) =>
                setFormOptions((prev) => {
                  prev.password = e.target.value;
                  return prev;
                })
              }
            />
          </span>
        </div>
        <div className="flex gap-4">
          <button className="button" onClick={hide}>
            Cancel
          </button>
          <button className="button" onClick={addAccount}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

function Signin({ hide, signup, setUser }) {
  const [formOptions, setFormOptions] = useState({
    username: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);

  async function authenticate(e) {
    setShowError(false);
    const result = await axios.post("/users/auth", formOptions);
    if (result.data.status !== "OK") {
      setShowError(true);
    } else {
      setUser(formOptions.username);
      hide();
    }
  }

  return (
    <div className="popup">
      <div className="segment max-w-2xl flex flex-col items-center gap-4">
        <h2>Sign In</h2>
        {showError && <div>The username or password is incorrect.</div>}
        <div>
          Don't have an account?{" "}
          <button className="text-blue-500 hover:underline" onClick={signup}>
            Sign Up
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex justify-between">
            <label className="pr-2">Username: </label>
            <input
              className="w-50"
              onChange={(e) =>
                setFormOptions((prev) => {
                  prev.username = e.target.value;
                  return prev;
                })
              }
            />
          </span>
          <span className="flex justify-between">
            <label className="pr-2">Password: </label>
            <input
              className="w-50"
              type="password"
              onChange={(e) =>
                setFormOptions((prev) => {
                  prev.password = e.target.value;
                  return prev;
                })
              }
            />
          </span>
        </div>
        <div className="flex gap-4">
          <button className="button" onClick={hide}>
            Cancel
          </button>
          <button className="button" onClick={authenticate}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

function BlogPostForm({ hide }) {
  const [formOptions, setFormOptions] = useState({
    title: "",
    body: "",
  });

  async function createPost() {
    console.log(formOptions);
    hide();
  }

  return (
    <div className="popup">
      <div className="segment max-w-2xl flex flex-col items-center gap-4">
        <h2>New Post</h2>
        <div className="flex flex-col gap-2">
          <span className="flex justify-between">
            <label className="pr-2">Title: </label>
            <input
              className="w-50"
              onChange={(e) =>
                setFormOptions((prev) => {
                  prev.title = e.target.value;
                  return prev;
                })
              }
            />
          </span>
          <span className="flex justify-between">
            <label className="pr-2">Body: </label>
            <input
              className="w-50"
              onChange={(e) =>
                setFormOptions((prev) => {
                  prev.body = e.target.value;
                  return prev;
                })
              }
            />
          </span>
        </div>
        <div className="flex gap-4">
          <button className="button" onClick={hide}>
            Cancel
          </button>
          <button className="button" onClick={createPost}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
