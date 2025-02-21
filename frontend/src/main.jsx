import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ErrorBoundary } from "react-error-boundary";
import { Routes, Route, BrowserRouter } from "react-router";

import Patient from "./pages/Patient.jsx";
import Doctor from "./pages/Doctor.jsx";

function Fallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary FallbackComponent={Fallback}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App></App>}>
          <Route index path="/patient" element={<Patient></Patient>}></Route>
          <Route index path="/doctor" element={<Doctor></Doctor>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);
