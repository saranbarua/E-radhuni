import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Routers from "./routers/Routers";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { Toaster } from "react-hot-toast";

if (import.meta.env.PROD === true) {
  disableReactDevTools();
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster />
        <Routers />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
