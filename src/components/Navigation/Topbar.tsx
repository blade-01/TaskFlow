import { FiMenu } from "react-icons/fi";
import ThemeSwitcher from "../Ui/ThemeSwitcher";
import { useSidebar } from "../../context/SidebarContext";
import { truncateString } from "../../utils";
import DropdownMenu from "../Ui/DropdownMenu";
import { FaPlus } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CenterModal from "../Ui/Modal/Center";
import DeleteModal from "../Ui/Modal/Delete";
import { useEffect, useState } from "react";
import { useMainStore } from "../../store/main";
import { useNavigate } from "react-router";
import BoardForm from "../Form/Board";
import BoardSorter from "../Form/BoardSorter";
import TaskForm from "../Form/Task";
import { BoardData } from "../../../types/board";

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title }: TopbarProps) {
  const navigateTo = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [actions, setActions] = useState<{
    addTask: boolean;
    editTask: boolean;
    editBoard: boolean;
    deleteBoard: boolean;
    sortColumns: boolean;
    isDeleting?: boolean;
  }>({
    addTask: false,
    editTask: false,
    editBoard: false,
    deleteBoard: false,
    sortColumns: false,
    isDeleting: false
  });

  const { deleteBoard, getBoardById, board, boards } = useMainStore();

  const items = [
    {
      label: "Edit board",
      command: () => {
        setActions({
          ...actions,
          editBoard: true
        });
      }
    },
    {
      label: "Delete board",
      command: () => {
        setActions({
          ...actions,
          deleteBoard: true
        });
      }
    }
  ];

  function getNextBoardIdAfterDelete(boards: BoardData[], deletedId: string) {
    const index = boards?.findIndex((b) => b.id === deletedId);
    if (index === -1 || boards.length === 0) return null;

    // Copy the array without the deleted one
    const remaining = boards.filter((b) => b.id !== deletedId);

    // Priority: next → previous → fallback
    const next = remaining[index]; // same index (moved up)
    const previous = remaining[index - 1]; // one above

    return next?.id || previous?.id || null;
  }

  async function handleDeleteBoard() {
    if (title) {
      setActions({
        ...actions,
        isDeleting: true
      });

      await deleteBoard(title);

      const nextBoardId = getNextBoardIdAfterDelete(
        boards as BoardData[],
        title
      );

      setTimeout(() => {
        setActions({
          ...actions,
          deleteBoard: false,
          isDeleting: false
        });

        if (nextBoardId) {
          navigateTo(`/board/${nextBoardId}`);
        } else {
          navigateTo(`/no-board`);
        }
      }, 1000);
    }
  }

  useEffect(() => {
    if (title) {
      getBoardById(title);
    }
  }, [title]);

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
              {title ? truncateString(board?.name || "", 20) : "..."}
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
              onClick={() =>
                setActions({
                  ...actions,
                  addTask: true
                })
              }
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

            {/* Add Task */}
            <CenterModal
              title="Add new task"
              visible={actions.addTask}
              setVisible={(event) =>
                setActions({
                  ...actions,
                  addTask: event
                })
              }
            >
              <TaskForm
                setVisible={(event) => {
                  setActions({
                    ...actions,
                    addTask: event
                  });
                }}
              />
            </CenterModal>
            {/* Edit Board */}
            <CenterModal
              title="Edit Board"
              visible={actions.editBoard}
              setVisible={(event) =>
                setActions({
                  ...actions,
                  editBoard: event
                })
              }
              persistent={false}
            >
              <BoardForm
                setVisible={(event) => {
                  setActions({
                    ...actions,
                    editBoard: event
                  });
                }}
                setShowColumn={(event) => {
                  setActions({
                    ...actions,
                    sortColumns: event,
                    editBoard: false
                  });
                }}
                isEdit
                board={board as BoardData}
              />
            </CenterModal>
            {/* Delete Board */}
            <DeleteModal
              title="Delete Board"
              visible={actions.deleteBoard}
              isLoading={actions.isDeleting}
              setVisible={(event) =>
                setActions({
                  ...actions,
                  deleteBoard: event
                })
              }
              handleDelete={() => handleDeleteBoard()}
            ></DeleteModal>
            {/* Sort Columns */}
            <CenterModal
              title="Rearrange Columns"
              visible={actions.sortColumns}
              setVisible={(event) =>
                setActions({
                  ...actions,
                  sortColumns: event
                })
              }
            >
              <BoardSorter
                setVisible={(event) => {
                  setActions({
                    ...actions,
                    sortColumns: event
                  });
                  setTimeout(() => {
                    setActions({
                      ...actions,
                      editBoard: true,
                      sortColumns: false
                    });
                  }, 500);
                }}
                isEdit
                board={board as BoardData}
              />
            </CenterModal>
          </div>
        </div>
      </div>
    </div>
  );
}
