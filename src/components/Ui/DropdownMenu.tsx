import { Menu } from "primereact/menu";
import { useRef } from "react";
import { cn } from "../../utils";

export default function DropdownMenu({
  children,
  items,
  icon,
  outerClass
}: {
  items: {
    label: string;
    icon?: React.ReactNode;
    command?: () => void;
  }[];
  children?: React.ReactNode;
  icon?: React.ReactNode;
  outerClass?: string;
}) {
  const menu = useRef<Menu | null>(null);
  return (
    <>
      <div
        aria-controls="menu_popup"
        onClick={(event) => {
          menu.current?.toggle(event);
        }}
        className={cn("icon-style", outerClass)}
      >
        {icon && icon}
        {children}
      </div>
      <Menu model={items} ref={menu} popup id="menu_popup" />
    </>
  );
}
