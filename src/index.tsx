import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  /**
   * 在 React 18 及以上版本，开发环境下的 Strict Mode（严格模式）会让所有副作用（比如 useEffect、你自定义的 useMount）在挂载时执行两次，以帮助你发现副作用中的问题。
这只会在开发环境下出现，生产环境只会执行一次。
   */
  /**
   * 这是 React 的设计，不需要修改你的代码。
如果你想验证只执行一次，可以在生产环境或去掉 <React.StrictMode> 后测试。
   */
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
