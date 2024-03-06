import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { userName, role } = useSelector((x) => x.account);
  if ((role === "Admin" || role === "Scheduler") && !userName)
    return <Navigate to={"/signIn"} />;
  return children;
}

function ProtectedRouteAdmin({ children }) {
  const { userName, role } = useSelector((x) => x.account);
  if (role !== "Admin") return <Navigate to={"/"} />;
  return children;
}

export { ProtectedRoute, ProtectedRouteAdmin };
