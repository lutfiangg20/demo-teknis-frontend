import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import AppSidebar from "./AppSidebar";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4 w-full flex flex-col">
        <SidebarTrigger />
        <div className="p-4 border w-full flex-1 rounded">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
