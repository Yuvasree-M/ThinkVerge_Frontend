// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { startKeepAlive } from './api/keepAlive'
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,        // data stays fresh for 1 minute
      gcTime: 5 * 60_000,       // keep in cache 5 minutes after unmount
      retry: 1,                 // only retry once on failure (default is 3)
      refetchOnWindowFocus: false,  // don't refetch just because user switched tabs
    },
  },
})
startKeepAlive() 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);