import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="p-8 text-fg">
      <h1 className="text-2xl font-semibold mb-2">OPS UI Kit</h1>
      <p className="text-fg-muted">Run <code className="font-mono text-accent">npm run storybook</code> to browse components.</p>
    </div>
  </React.StrictMode>,
);
