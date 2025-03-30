import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

export const SidebarLayout = () => {
  return (
    <div className="flex">
      <SideNav />
      <main className="ml-64 flex-1 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}; 