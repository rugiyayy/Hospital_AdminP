import React from 'react'
import HeaderSidebar from './Header'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
   <>
   <HeaderSidebar/>
   <Outlet/></>
  )
}
