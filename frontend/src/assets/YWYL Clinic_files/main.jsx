import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=3ad4aba7"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=3ad4aba7"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react;
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=3ad4aba7"; const ReactDOM = __vite__cjsImport2_reactDom_client.__esModule ? __vite__cjsImport2_reactDom_client.default : __vite__cjsImport2_reactDom_client;
import { createBrowserRouter, RouterProvider } from "/node_modules/.vite/deps/react-router-dom.js?v=3ad4aba7";
import "/node_modules/@fontsource/roboto/300.css";
import "/node_modules/@fontsource/roboto/400.css";
import "/node_modules/@fontsource/roboto/500.css";
import "/node_modules/@fontsource/roboto/700.css";
import Auth from "/src/auth/AuthProvider.jsx?t=1743102653036";
import LandingPage from "/src/pages/LandingPage/LandingPage.jsx";
import SignInPage from "/src/pages/SignInPage.jsx";
import SignupPage from "/src/pages/SignupPage.jsx";
import PatientDashboard from "/src/pages/Patient/PatientDashboard.jsx";
import DoctorDashboard from "/src/pages/Doctor/DoctorDashboard.jsx";
import CompletePatientProfile from "/src/pages/Patient/CompletePatientProfile.jsx";
import CompleteDoctorProfile from "/src/pages/Doctor/CompleteDoctorProfile.jsx";
import { QueryClient, QueryClientProvider } from "/node_modules/.vite/deps/@tanstack_react-query.js?v=3ad4aba7";
import { Toaster } from "/node_modules/.vite/deps/sonner.js?v=3ad4aba7";
import Recipes from "/src/pages/Recipes/Recipes.jsx?t=1743111992144";
const queryClient = new QueryClient();
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: /* @__PURE__ */ jsxDEV(Auth, { notRequired: true, children: /* @__PURE__ */ jsxDEV(LandingPage, {}, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 26,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 25,
        columnNumber: 3
      }, this)
    },
    {
      path: "/signin",
      element: /* @__PURE__ */ jsxDEV(Auth, { children: /* @__PURE__ */ jsxDEV(SignInPage, {}, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 33,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 32,
        columnNumber: 3
      }, this)
    },
    {
      path: "/signup",
      element: /* @__PURE__ */ jsxDEV(Auth, { notRequired: true, children: /* @__PURE__ */ jsxDEV(SignupPage, {}, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 40,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 39,
        columnNumber: 3
      }, this)
    },
    {
      path: "/patient/dashboard",
      element: /* @__PURE__ */ jsxDEV(Auth, { allowedRoles: ["PATIENT"], children: /* @__PURE__ */ jsxDEV(PatientDashboard, {}, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 47,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 46,
        columnNumber: 3
      }, this)
    },
    {
      path: "/doctor/dashboard",
      element: /* @__PURE__ */ jsxDEV(Auth, { allowedRoles: ["DOCTOR"], children: /* @__PURE__ */ jsxDEV(DoctorDashboard, {}, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 54,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 53,
        columnNumber: 3
      }, this)
    },
    {
      path: "/patient/complete-profile",
      element: /* @__PURE__ */ jsxDEV(Auth, { allowedRoles: ["PATIENT"], children: /* @__PURE__ */ jsxDEV(CompletePatientProfile, {}, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 61,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 60,
        columnNumber: 3
      }, this)
    },
    {
      path: "/doctor/complete-profile",
      element: /* @__PURE__ */ jsxDEV(Auth, { allowedRoles: ["DOCTOR"], children: /* @__PURE__ */ jsxDEV(CompleteDoctorProfile, {}, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 68,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 67,
        columnNumber: 3
      }, this)
    },
    {
      path: "/recipes",
      element: /* @__PURE__ */ jsxDEV(Auth, { notRequired: true, children: /* @__PURE__ */ jsxDEV(Recipes, {}, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 75,
        columnNumber: 12
      }, this) }, void 0, false, {
        fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
        lineNumber: 74,
        columnNumber: 3
      }, this)
    }
  ]
);
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxDEV(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxDEV(Toaster, { expand: true, position: "bottom-center", theme: "light" }, void 0, false, {
      fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
      lineNumber: 84,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(RouterProvider, { router }, void 0, false, {
      fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
      lineNumber: 86,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/toash/workspace/school/490/Clinic/frontend/src/main.jsx",
    lineNumber: 81,
    columnNumber: 3
  }, this)
);

//# sourceMappingURL=data:application/json;base64,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QUxuQztBQUFBO0FBQUE7QUFBQTtBQUFBLFNBTUE7QUFDSiIsIm5hbWVzIjpbIlJlYWN0IiwiUmVhY3RET00iLCJjcmVhdGVCcm93c2VyUm91dGVyIiwiUm91dGVyUHJvdmlkZXIiLCJBdXRoIiwiTGFuZGluZ1BhZ2UiLCJTaWduSW5QYWdlIiwiU2lnbnVwUGFnZSIsIlBhdGllbnREYXNoYm9hcmQiLCJEb2N0b3JEYXNoYm9hcmQiLCJDb21wbGV0ZVBhdGllbnRQcm9maWxlIiwiQ29tcGxldGVEb2N0b3JQcm9maWxlIiwiUXVlcnlDbGllbnQiLCJRdWVyeUNsaWVudFByb3ZpZGVyIiwiVG9hc3RlciIsIlJlY2lwZXMiLCJxdWVyeUNsaWVudCIsInJvdXRlciIsInBhdGgiLCJlbGVtZW50IiwiY3JlYXRlUm9vdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsibWFpbi5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnXG5pbXBvcnQge2NyZWF0ZUJyb3dzZXJSb3V0ZXIsIFJvdXRlclByb3ZpZGVyfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJ1xuaW1wb3J0IFwiQGZvbnRzb3VyY2Uvcm9ib3RvLzMwMC5jc3NcIjtcbmltcG9ydCBcIkBmb250c291cmNlL3JvYm90by80MDAuY3NzXCI7XG5pbXBvcnQgXCJAZm9udHNvdXJjZS9yb2JvdG8vNTAwLmNzc1wiO1xuaW1wb3J0IFwiQGZvbnRzb3VyY2Uvcm9ib3RvLzcwMC5jc3NcIjtcbmltcG9ydCBBdXRoIGZyb20gJy4vYXV0aC9BdXRoUHJvdmlkZXInO1xuaW1wb3J0IExhbmRpbmdQYWdlIGZyb20gJy4vcGFnZXMvTGFuZGluZ1BhZ2UvTGFuZGluZ1BhZ2UuanN4JztcbmltcG9ydCBTaWduSW5QYWdlIGZyb20gJy4vcGFnZXMvU2lnbkluUGFnZS5qc3gnO1xuaW1wb3J0IFNpZ251cFBhZ2UgZnJvbSAnLi9wYWdlcy9TaWdudXBQYWdlLmpzeCc7XG5pbXBvcnQgUGF0aWVudERhc2hib2FyZCBmcm9tICcuL3BhZ2VzL1BhdGllbnQvUGF0aWVudERhc2hib2FyZC5qc3gnO1xuaW1wb3J0IERvY3RvckRhc2hib2FyZCBmcm9tIFwiLi9wYWdlcy9Eb2N0b3IvRG9jdG9yRGFzaGJvYXJkLmpzeFwiO1xuaW1wb3J0IENvbXBsZXRlUGF0aWVudFByb2ZpbGUgZnJvbSAnLi9wYWdlcy9QYXRpZW50L0NvbXBsZXRlUGF0aWVudFByb2ZpbGUuanN4JztcbmltcG9ydCBDb21wbGV0ZURvY3RvclByb2ZpbGUgZnJvbSAnLi9wYWdlcy9Eb2N0b3IvQ29tcGxldGVEb2N0b3JQcm9maWxlLmpzeCc7XG5pbXBvcnQge1F1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyfSBmcm9tIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCI7XG5pbXBvcnQge1RvYXN0ZXJ9IGZyb20gJ3Nvbm5lcic7XG5pbXBvcnQgUmVjaXBlcyBmcm9tIFwiLi9wYWdlcy9SZWNpcGVzL1JlY2lwZXMuanN4XCI7XG5cbmNvbnN0IHF1ZXJ5Q2xpZW50ID0gbmV3IFF1ZXJ5Q2xpZW50KClcbmNvbnN0IHJvdXRlciA9IGNyZWF0ZUJyb3dzZXJSb3V0ZXIoW1xuICAgIHtcbiAgICAgICAgcGF0aDogJy8nLFxuICAgICAgICBlbGVtZW50OlxuICAgICAgICAgICAgPEF1dGggbm90UmVxdWlyZWQ+XG4gICAgICAgICAgICAgICAgPExhbmRpbmdQYWdlLz5cbiAgICAgICAgICAgIDwvQXV0aD5cbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGF0aDogJy9zaWduaW4nLFxuICAgICAgICBlbGVtZW50OlxuICAgICAgICAgICAgPEF1dGg+XG4gICAgICAgICAgICAgICAgPFNpZ25JblBhZ2UvPlxuICAgICAgICAgICAgPC9BdXRoPlxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXRoOiAnL3NpZ251cCcsXG4gICAgICAgIGVsZW1lbnQ6XG4gICAgICAgICAgICA8QXV0aCBub3RSZXF1aXJlZD5cbiAgICAgICAgICAgICAgICA8U2lnbnVwUGFnZS8+XG4gICAgICAgICAgICA8L0F1dGg+XG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6ICcvcGF0aWVudC9kYXNoYm9hcmQnLFxuICAgICAgICBlbGVtZW50OlxuICAgICAgICAgICAgPEF1dGggYWxsb3dlZFJvbGVzPXtbXCJQQVRJRU5UXCJdfT5cbiAgICAgICAgICAgICAgICA8UGF0aWVudERhc2hib2FyZC8+XG4gICAgICAgICAgICA8L0F1dGg+XG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6ICcvZG9jdG9yL2Rhc2hib2FyZCcsXG4gICAgICAgIGVsZW1lbnQ6XG4gICAgICAgICAgICA8QXV0aCBhbGxvd2VkUm9sZXM9e1tcIkRPQ1RPUlwiXX0+XG4gICAgICAgICAgICAgICAgPERvY3RvckRhc2hib2FyZC8+XG4gICAgICAgICAgICA8L0F1dGg+XG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6ICcvcGF0aWVudC9jb21wbGV0ZS1wcm9maWxlJyxcbiAgICAgICAgZWxlbWVudDpcbiAgICAgICAgICAgIDxBdXRoIGFsbG93ZWRSb2xlcz17W1wiUEFUSUVOVFwiXX0+XG4gICAgICAgICAgICAgICAgPENvbXBsZXRlUGF0aWVudFByb2ZpbGUvPlxuICAgICAgICAgICAgPC9BdXRoPlxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXRoOiAnL2RvY3Rvci9jb21wbGV0ZS1wcm9maWxlJyxcbiAgICAgICAgZWxlbWVudDpcbiAgICAgICAgICAgIDxBdXRoIGFsbG93ZWRSb2xlcz17W1wiRE9DVE9SXCJdfT5cbiAgICAgICAgICAgICAgICA8Q29tcGxldGVEb2N0b3JQcm9maWxlLz5cbiAgICAgICAgICAgIDwvQXV0aD4gXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6IFwiL3JlY2lwZXNcIixcbiAgICAgICAgZWxlbWVudDpcbiAgICAgICAgPEF1dGggbm90UmVxdWlyZWQ+XG4gICAgICAgICAgIDxSZWNpcGVzLz5cbiAgICAgICAgPC9BdXRoPlxuICAgIH1cbl0pXG5cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuXG4gICAgICAgIHsvKiBodHRwczovL3Nvbm5lci5lbWlsa293YWwuc2tpL2dldHRpbmctc3RhcnRlZCAqL31cbiAgICAgICAgPFRvYXN0ZXIgZXhwYW5kPXt0cnVlfXBvc2l0aW9uPVwiYm90dG9tLWNlbnRlclwiIHRoZW1lPVwibGlnaHRcIi8+XG5cbiAgICAgICAgPFJvdXRlclByb3ZpZGVyIHJvdXRlcj17cm91dGVyfS8+XG4gICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPlxuKVxuIl0sImZpbGUiOiIvVXNlcnMvdG9hc2gvd29ya3NwYWNlL3NjaG9vbC80OTAvQ2xpbmljL2Zyb250ZW5kL3NyYy9tYWluLmpzeCJ9