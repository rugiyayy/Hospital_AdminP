import React from "react";
import { Outlet } from "react-router-dom";
import HeaderSideBar from "./HeaderSideBar";

export default function Layout() {
  return (
    <>
      <HeaderSideBar />
      <Outlet />
    </>
  );
}
