import { useParams } from "react-router";
import Wrapper from "../components/Board/Wrapper";
import { useMainStore } from "../store/main";
import { useEffect } from "react";
import Task from "../components/Board/Task";
import BoardForm from "../components/Form/Board";
import CenterModal from "../components/Ui/Modal/Center";
import { FaPlus } from "react-icons/fa";
import { useState, useRef } from "react";
import MiniMap from "../components/Board/Minimap";
import { ReactSortable } from "react-sortablejs";
import { TaskData } from "../../types/task";
import { BoardData } from "../../types/board";
import Loader from "../components/Ui/Loader/Skeleton";
import Btn from "../components/Ui/Btn";

export default function Board() {
  const { id } = useParams<{ id: string }>();
  const {
    getBoardById,
    getTasks,
    tasks: globalTasks,
    board,
    updateTask
  } = useMainStore();
  const [columnTasksMap, setColumnTasksMap] = useState<
    Record<string, TaskData[]>
  >({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noBoard, setNoBoard] = useState(false);
  const kanbanRef = useRef<HTMLDivElement>(null);
  const lastSortedListRef = useRef<Record<string, TaskData[]>>({});

  useEffect(() => {
    if (id) {
      const getBoardData = async () => {
        setLoading(true);
        const response = await getBoardById(id);
        setLoading(false);
        if (response === null) {
          setNoBoard(true);
          return;
        } else {
          setNoBoard(false);
        }
        getTasks(id);
      };

      getBoardData();
    }
  }, [id, getBoardById]);

  useEffect(() => {
    if (!board?.columns) return;

    const mappedTasks: Record<string, TaskData[]> = {};
    board.columns.forEach((col) => {
      mappedTasks[col.id] = globalTasks.filter(
        (task) => task.status === col.id
      ) as TaskData[];
    });

    setColumnTasksMap(mappedTasks);
  }, [globalTasks, board]);

  const handleListUpdate = (columnId: string, newList: TaskData[]) => {
    setColumnTasksMap((prev) => ({
      ...prev,
      [columnId]: newList
    }));

    lastSortedListRef.current[columnId] = newList;
  };

  return (
    <div>
      <Wrapper title={id as string}>
        {loading ? (
          <Loader />
        ) : noBoard ? (
          <div className="h-screen w-[90%] sm:w-[400px] mx-auto grid place-items-center">
            <div className="text-center flex flex-col justify-center items-center">
              <p className="text-main-text font-semibold text-lg sm:text-xl">
                Oops!, this board doesn't exist, click below to create a new
                board.
              </p>
              <Btn
                size="sm"
                outerClass="rounded-full mt-5"
                onClick={() => setVisible(true)}
              >
                Create Board
              </Btn>
            </div>
            <CenterModal
              title="Add new board"
              visible={visible}
              setVisible={(event) => setVisible(event)}
            >
              <BoardForm setVisible={(event) => setVisible(event)} />
            </CenterModal>
          </div>
        ) : (
          <div>
            <div ref={kanbanRef} className="kanban-wrapper">
              {board?.columns?.map((column) => (
                <div key={column.id} data-column-id={column.id}>
                  <div className="flex gap-2 items-center mb-2.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    ></div>
                    <p className="text-sidebar-text font-bold capitalize">
                      {column.name} ({columnTasksMap[column.id]?.length || 0})
                    </p>
                  </div>
                  <ReactSortable
                    list={columnTasksMap[column.id] || []}
                    setList={(newList) => handleListUpdate(column.id, newList)}
                    onEnd={(evt) => {
                      const taskId = evt.item?.dataset?.id;
                      const fromColumn = (
                        evt.from.closest(
                          "[data-column-id]"
                        ) as HTMLElement | null
                      )?.dataset.columnId;
                      const toColumn = (
                        evt.to.closest("[data-column-id]") as HTMLElement | null
                      )?.dataset.columnId;

                      if (!taskId || !fromColumn || !toColumn) return;

                      const taskToMove = columnTasksMap[fromColumn]?.find(
                        (t) => t.id === taskId
                      );
                      if (!taskToMove) return;

                      //  Reorder between different columns
                      if (fromColumn !== toColumn) {
                        updateTask(taskId, { ...taskToMove, status: toColumn });

                        const newFromList =
                          columnTasksMap[fromColumn]?.filter(
                            (t) => t.id !== taskId
                          ) || [];
                        const newToList = [
                          ...(columnTasksMap[toColumn] || []),
                          { ...taskToMove, status: toColumn }
                        ];

                        handleListUpdate(fromColumn, newFromList);
                        handleListUpdate(toColumn, newToList);
                      }

                      //  Reorder within current column
                      const reorderedList = lastSortedListRef.current[toColumn];
                      reorderedList?.forEach((task, index) => {
                        if (task.order !== index) {
                          updateTask(task.id!, { ...task, order: index });
                        }
                      });
                    }}
                    group="tasks"
                    animation={200}
                    className="board-wrapper"
                  >
                    {(columnTasksMap[column.id] || []).map((task) => (
                      <div key={task.id} data-id={task.id}>
                        <Task task={task} columns={board.columns} />
                      </div>
                    ))}
                  </ReactSortable>
                </div>
              ))}

              <div>
                <p className="mb-2.5">&nbsp;</p>
                <div
                  className="board-wrapper bg-sidebar-bg/40 rounded-md grid place-items-center shadow-sm cursor-pointer group transition-colors"
                  onClick={() => setVisible(true)}
                >
                  <div className="flex items-center gap-1.5 text-sidebar-text font-bold text-xl sm:text-2xl group-hover:text-btn-bg duration-200 ease-in">
                    <FaPlus />
                    <p>New Column</p>
                  </div>
                </div>
              </div>
            </div>
            <MiniMap
              key={board?.columns?.length}
              totalColumns={board?.columns?.length as number}
              containerRef={kanbanRef}
            />

            {/* Edit Board */}
            <CenterModal
              title="Edit Board"
              visible={visible}
              setVisible={(event) => setVisible(event)}
            >
              <BoardForm
                setVisible={(event) => {
                  setVisible(event);
                }}
                isEdit
                isSortable={false}
                board={board as BoardData}
              />
            </CenterModal>
          </div>
        )}
      </Wrapper>
    </div>
  );
}
