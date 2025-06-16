import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Compass, PlusCircle, Bell, User } from "lucide-react"

export default function Navbar() {
  const location = useLocation()

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={20} />, path: "/home" },
    { id: "discover", label: "Discover", icon: <Compass size={20} />, path: "/discover" },
    { id: "post", label: "Post", icon: <PlusCircle size={20} />, path: "/post" },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} />, path: "/notifications", badge: 12 },
    { id: "profile", label: "Profile", icon: <User size={20} />, path: "/profile" },
  ]

  return (
    <>
      {/* Remove the min-h-screen and pb-20 wrapper */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg backdrop-blur-sm bg-white/95 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                to={item.path}
                key={item.id}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl min-w-[60px] transition-all duration-300 transform group ${
                  isActive
                    ? "text-orange-500 bg-orange-50 scale-110 shadow-md"
                    : "text-gray-500 hover:text-orange-400 hover:bg-orange-25 hover:scale-105"
                }`}
              >
                {/* Ripple */}
                <span className="absolute inset-0 rounded-xl group-active:scale-110 transition-transform duration-200 bg-orange-100 opacity-0 group-active:opacity-100" />

                {/* Badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse z-10">
                    {item.badge}
                  </span>
                )}

                {/* Icon */}
                <div
                  className={`z-10 transition-all duration-300 ${
                    isActive ? "scale-110 animate-bounce" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  className={`z-10 text-xs mt-1 font-medium transition-all duration-300 ${
                    isActive
                      ? "opacity-100 translate-y-0 text-orange-600"
                      : "opacity-70 group-hover:opacity-100"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 w-6 h-1 bg-orange-500 rounded-full animate-slideInBottom z-10"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  )
}
