import { API } from "aws-amplify";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    const response = await API.get("rdslambda2", "/complaints");
    console.log(response);
  };

  return (
    <div>
      <h1>Testing, testing... 1, 2, 3</h1>
    </div>
  );
}

export default App;
