import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AppWrapper } from "./common/PageMeta.jsx";
import { store } from "./redux/store/store.js";
import { Provider } from "react-redux";
import "./i18n";


createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AppWrapper>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </AppWrapper>
  </ThemeProvider>
);
