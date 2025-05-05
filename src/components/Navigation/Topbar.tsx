import { FiMenu } from "react-icons/fi";
import ThemeSwitcher from "../Ui/ThemeSwitcher";
import { useSidebar } from "../../context/SidebarContext";
import { truncateString } from "../../utils";
import DropdownMenu from "../Ui/DropdownMenu";
import { FaPlus } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CenterModal from "../Ui/Modal/Center";
import { useState } from "react";

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title }: TopbarProps) {
  const { toggleSidebar } = useSidebar();
  const [visible, setVisible] = useState<boolean>(false);

  const items = [
    {
      label: "Edit board",
      command: () => {
        console.log("Edit board");
      }
    },
    {
      label: "Delete board",
      command: () => {
        console.log("Delete board");
      }
    }
  ];

  return (
    <div className="flex items-center sticky top-0 w-full h-[var(--sidebar-height)] z-30 bg-sidebar-bg border-b border-b-border">
      <div className="p-4 w-full">
        <div className="flex justify-between items-center w-full">
          {/* Left side */}
          <div className="flex items-center gap-2">
            <button
              className="p-0 bg-transparent lg:cursor-pointer"
              onClick={toggleSidebar}
            >
              <FiMenu size={24} />
            </button>
            <p className="font-bold capitalize text-main-text">
              {title ? truncateString(title, 20) : "..."}
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeSwitcher
              outerClass="relative top-0 lg:top-0  left-0 lg:left-0 right-0 lg:right-0 bottom-0 lg:bottom-0 mt-2"
              wrapperClass="px-0"
            />
            {/* Add board and menu */}
            <div
              className="icon-style h-9 w-9 md:w-fit bg-btn-bg md:px-4"
              onClick={() => setVisible(true)}
            >
              <div className="flex gap-1.5 items-center text-white">
                <FaPlus size={15} />
                <p className="text-white font-semibold hidden md:flex">
                  Add New Task
                </p>
              </div>
            </div>
            <DropdownMenu
              items={items}
              icon={<HiOutlineDotsVertical size={20} />}
              outerClass="h-9 w-9"
            ></DropdownMenu>
            {/* Center Modal */}
            <CenterModal
              title="Modal Title"
              visible={visible}
              setVisible={(event) => setVisible(event)}
            >
              Hiii 👋🏼
            </CenterModal>
          </div>
        </div>
      </div>
    </div>
  );
}
