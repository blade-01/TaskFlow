import { useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { FiPlus, FiLogOut, FiChevronDown } from "react-icons/fi";
import { Avatar } from "primereact/avatar";
import logo from "../../assets/logo-light.svg";
import useAuth from "../../hooks/useAuth";
import { truncateString } from "../../utils";
import { NavLink } from "react-router";
import { useSidebar } from "../../context/SidebarContext";
import BoardForm from "../Form/Board";

import {
  where,
  query,
  collection,
  getDocs,
  Timestamp,
  orderBy
} from "firebase/firestore";
import { db } from "../../firebase";
import CenterModal from "../Ui/Modal/Center";

interface SidebarProps {
  nav: boolean;
}

interface LinkItem {
  name: string;
  icon?: React.ReactNode;
  sub?: { id: string; name: string }[];
  show?: boolean;
  hasCreate?: boolean;
  isEditable?: boolean;
  hasQuery?: boolean;
}

export default function Sidebar({ nav }: SidebarProps) {
  const { toggleSidebar } = useSidebar();
  const [links, setLinks] = useState<LinkItem[]>();
  const { user, logout } = useAuth();

  // Get boards
  interface Board {
    name: string;
    columns: { name: string; color: string }[];
    createdAt: Timestamp;
    createdBy: string;
  }

  const [boards, setBoards] = useState<Board[]>([]);
  const getBoards = async () => {
    try {
      const q = query(
        collection(db, "boards"),
        where("createdBy", "in", ["admin", user?.uid]),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const boardsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          name: data.name,
          columns: data.columns,
          createdAt: data.createdAt,
          createdBy: data.createdBy
        } as Board;
      });
      setBoards(boardsData);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };
  // Call getBoards when the component mounts
  useEffect(() => {
    getBoards();
  }, []);

  useEffect(() => {
    const mappedBoards = boards.map((board) => {
      return {
        ...board,
        icon: <MdOutlineDashboard />
      };
    });
    const links = [...mappedBoards];
    setLinks(links);
  }, [boards]);

  const toggleDropdown = (clickedLink: LinkItem) => {
    setLinks((prevLinks) =>
      prevLinks?.map((link) =>
        link.name === clickedLink.name ? { ...link, show: !link.show } : link
      )
    );
  };

  const createBoard = () => {
    setVisible(true);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  // Form and Modal
  const [visible, setVisible] = useState(false);

  return (
    <div className={`sidebar ${nav ? "sidebar-opened" : ""}`}>
      <div className="sidebar-side">
        <div className="flex flex-col gap-2 items-center">
          <NavLink to="/" className="sidebar--logo-style">
            <img src={logo} alt="logo" className="w-7 h-8" />
          </NavLink>
          <hr className="border-t border-t-border w-[50%]" />
        </div>

        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={logout}
        >
          <div className="sidebar--logout-icon">
            <FiLogOut size={20} />
          </div>
          <p className="text-xs text-sidebar-text font-medium">Log out</p>
        </div>
      </div>

      <div className="w-full">
        <div className="sidebar-header flex items-center gap-2 p-3">
          <Avatar image={user?.photoURL as string} shape="circle" />
          <p>{truncateString(user?.displayName as string, 20)}</p>
        </div>

        <div className="sidebar-content p-3">
          <div className="flex flex-col gap-y-2">
            {links?.map((link, index) => (
              <div key={index} className="truncate">
                {link.sub?.length ? (
                  <>
                    <div
                      className="sidebar-item sidebar-board-header flex justify-between items-center cursor-pointer"
                      onClick={() => toggleDropdown(link)}
                    >
                      <p className="flex items-center gap-3 ">
                        {link.icon && link.icon}
                        <span className="text-sm uppercase ">{link.name}</span>
                      </p>
                      <FiChevronDown
                        className={`${
                          link.show
                            ? "sidebar--active-chevron"
                            : "sidebar--inactive-chevron"
                        }`}
                        size={20}
                      />
                    </div>

                    <div
                      className={`flex flex-col ${
                        link.show
                          ? "sidebar--active-collapse"
                          : "sidebar--inactive-collapse"
                      }`}
                    >
                      {/* Simulate not pending */}
                      {link.sub.map((channel) => (
                        <div key={channel.id} className="sidebar-item">
                          <p>{channel.name}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={`/board/${link.name}`}
                    key={index}
                    className="sidebar-item flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      closeSidebarOnMobile();
                    }}
                  >
                    {link.icon && link.icon}
                    <p className="text-sm uppercase">{link.name}</p>
                  </NavLink>
                )}
              </div>
            ))}
            {
              <div
                className="cursor-pointer sidebar--create-board"
                onClick={createBoard}
              >
                <div className="icon-style">
                  <FiPlus size={15} />
                </div>
                <span className="text-sm">Create Board</span>
              </div>
            }
          </div>
        </div>
      </div>

      <CenterModal
        title="Add new board"
        visible={visible}
        setVisible={(event) => setVisible(event)}
      >
        <BoardForm setVisible={(event) => setVisible(event)} />
      </CenterModal>
    </div>
  );
}
