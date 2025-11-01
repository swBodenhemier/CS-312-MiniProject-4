import { useState, useEffect } from "react";
import { HomePage } from "./HomePage";

function App() {
  const [status, setStatus] = useState(true);

  useEffect(() => {
    try {
      fetch("/status")
        .then(
          (res) => res.json(),
          (err) => {
            throw err;
          }
        )
        .then(
          (data) => {
            setStatus(data.message === "OK");
          },
          (err) => {
            throw err;
          }
        );
    } catch (error) {
      console.error(error);
      setStatus(false);
    }
  }, []);

  return (
    <div className="w-full max-w-screen min-h-screen">
      {status ? <HomePage /> : <div>500 Internal Server Error</div>}
    </div>
  );
}

export default App;
