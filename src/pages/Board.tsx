import { useParams } from "react-router";
import Wrapper from "../components/Board/Wrapper";
import { useMainStore } from "../store/main";
import { useEffect } from "react";
import Task from "../components/Board/Task";
import BoardForm from "../components/Form/Board";
import CenterModal from "../components/Ui/Modal/Center";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";

export default function Board() {
  interface BoardData {
    name: string;
    columns: { name: string; color: string; id: string }[];
    createdAt: Timestamp;
    createdBy: string;
  }
  const { id } = useParams<{ id: string }>();
  const { getBoardById, board, getTasks, tasks } = useMainStore();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (id) {
      getBoardById(id);
      getTasks(id);
    }
  }, [id, getBoardById]);
  return (
    <div>
      <Wrapper title={id as string}>
        {board?.columns?.map((item) => (
          <div>
            <div className="flex gap-2 items-center mb-2.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <p className="text-sidebar-text font-bold ">
                {item.name} (
                {tasks.filter((task) => task.status === item.id)?.length || 0})
              </p>
            </div>
            <div key={item.name} className="board-wrapper">
              {tasks
                .filter((task) => task.status === item.id)
                .map((task) => (
                  <Task key={task.id} task={task} columns={board.columns} />
                ))}
            </div>
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
            board={board as BoardData}
          />
        </CenterModal>
      </Wrapper>
    </div>
  );
}
