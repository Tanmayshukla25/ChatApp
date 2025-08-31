import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProtectedRoute from "./Pages/ProtectedRoute";
import First from "./Pages/First";
import RightSideBar from "./components/RightSideBar";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);


const App = () => {
  return (
    <div className="bg-[url('./src/assets/BgImage.png')] bg-contain">
      <First>
        <RouterProvider router={router} />
      </First>
    </div>
  );
};

export default App;
