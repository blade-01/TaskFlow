import Sidebar from "../components/Navigation/Sidebar";
import Topbar from "../components/Navigation/Topbar";
import { useSidebar } from "../context/SidebarContext";
import { cn } from "../utils";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { nav } = useSidebar();
  return (
    <div className="relative overflow-x-clip overflow-y-hidden">
      <Sidebar nav={nav} />
      <main
        className={cn("mainbar-wrapper", {
          "mainbar-opened": nav
        })}
      >
        <Topbar title="Welcome to TaskFlow" />
        <div className="mainbar-content">{children}</div>
      </main>
    </div>
  );
}
