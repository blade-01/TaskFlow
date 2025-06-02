import { Timestamp } from "firebase/firestore";
import CenterModal from "../../components/Ui/Modal/Center";
import { truncateString } from "../../utils";
import { useEffect, useState } from "react";
import { useMainStore } from "../../store/main";
import UiInputDropdown from "../Ui/Input/Dropdown";
import { getErrorMessage } from "../../utils/error";
import UiBtn from "../Ui/Btn";
import DropdownMenu from "../Ui/DropdownMenu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import DeleteModal from "../Ui/Modal/Delete";
import TaskForm from "../Form/Task";

interface TaskData {
  id?: string;
  name: string;
  description?: string;
  subtasks: { name: string; isCompleted: boolean }[];
  boardId: string;
  status: string;
  createdAt: Timestamp;
}

export default function Task({
  task,
  columns
}: {
  task: TaskData;
  columns: { name: string; color: string; id: string }[];
}) {
  const [actions, setActions] = useState<{
    editTask: boolean;
    deleteTask: boolean;
    isDeleting?: boolean;
  }>({
    editTask: false,
    deleteTask: false,
    isDeleting: false
  });
  const [loading, setLoading] = useState(false);
  const { updateTask, deleteTask } = useMainStore();
  const [visible, setVisible] = useState(false);
  const [subtasks, setSubtasks] = useState(
    task.subtasks?.map((t) => ({ ...t })) || []
  );
  useEffect(() => {
    setSubtasks(task.subtasks?.map((t) => ({ ...t })) || []);
  }, [task.subtasks]);
  const localCompletedTasks =
    subtasks?.filter((t) => t.isCompleted).length || 0;
  const completedTasks =
    task.subtasks?.filter((t) => t.isCompleted).length || 0;
  const [selectedBoard, setSelectedBoard] = useState<string>(task.status);

  const handleUpdateTask = async () => {
    setLoading(true);
    try {
      if (selectedBoard) {
        await updateTask(task.id as string, {
          ...task,
          subtasks: subtasks,
          status: selectedBoard
        });
      }
      setVisible(false);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  async function handleDeleteTask() {
    if (task.id) {
      setActions({
        ...actions,
        isDeleting: true
      });
      await deleteTask(task.id);
      setTimeout(() => {
        setActions({
          ...actions,
          deleteTask: false,
          isDeleting: false
        });
        setVisible(false);
      }, 1000);
    }
  }

  const items = [
    {
      label: "Edit task",
      command: () => {
        setVisible(false);
        setActions({
          ...actions,
          editTask: true
        });
      }
    },
    {
      label: "Delete task",
      command: () => {
        setActions({
          ...actions,
          deleteTask: true
        });
      }
    }
  ];

  const headerElement = (
    <div className="flex items-center justify-between">
      <p className="text-2xl font-bold">{task.name}</p>
      <DropdownMenu
        items={items}
        icon={<HiOutlineDotsVertical size={20} />}
        outerClass="h-9 w-9"
      ></DropdownMenu>
    </div>
  );
  return (
    <div>
      <div
        key={task.id}
        className="bg-sidebar-bg px-4 py-5 rounded-lg mb-5 group transition-colors cursor-pointer mx-[1px] shadow-[0_4px_6px_rgba(54,78,126,.102)] flex flex-col gap-1"
        onClick={() => {
          setVisible(true);
        }}
      >
        <p className="text-main-text font-bold text-sm sm:text-base group-hover:text-btn-bg duration-200 ease-in">
          {truncateString(task.name, 20)}
        </p>
        <p className="text-sidebar-text font-bold text-xs sm:text-sm">
          {completedTasks} of {subtasks?.length} subtasks
        </p>
      </div>
      {/* View Task */}
      <CenterModal
        title={task.name}
        visible={visible}
        setVisible={(event) => {
          setVisible(event);
          if (!event) {
            setSubtasks(task.subtasks?.map((t) => ({ ...t })) || []);
            setSelectedBoard(task.status);
          }
        }}
        header={headerElement}
        showCloseButton={false}
      >
        <p>
          Subtasks ({localCompletedTasks} of {subtasks?.length})
        </p>
        <div className="mt-3.5">
          {subtasks?.map((subtask, index) => (
            <div className="flex gap-2.5 bg-main-bg px-4 py-2 rounded-lg mb-2.5 transition-colors hover:bg-btn-bg/20">
              <input
                type="checkbox"
                checked={subtasks[index]?.isCompleted}
                onChange={() => {
                  const updated = [...subtasks];
                  updated[index].isCompleted = !updated[index].isCompleted;
                  setSubtasks(updated);
                }}
                id={subtask.name}
              />
              <label
                htmlFor={subtask.name}
                className={`text-main-text font-medium text-sm cursor-pointer ${
                  subtask.isCompleted ? "!line-through" : ""
                }`}
              >
                {subtask.name}
              </label>
            </div>
          ))}
          <UiInputDropdown
            name="status"
            label="Current Status"
            placeholder="e.g. Backlog"
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.value)}
            options={columns}
            optionLabel="name"
            optionValue="id"
            filter
            showClear
          />
        </div>

        <UiBtn
          label="Save changes"
          size="sm"
          outerClass="w-full rounded-full mt-4"
          isLoading={loading}
          onClick={() => {
            handleUpdateTask();
          }}
        />
      </CenterModal>
      {/* Edit Task */}
      <CenterModal
        title="Edit task"
        visible={actions.editTask}
        setVisible={(event) => {
          setActions({
            ...actions,
            editTask: event
          });
          setVisible(true);
        }}
      >
        <TaskForm
          setVisible={(event) => {
            setActions({
              ...actions,
              editTask: event
            });
          }}
          isEdit
          task={task as TaskData}
        />
      </CenterModal>
      {/* Delete Task */}
      <DeleteModal
        title="Delete Board"
        visible={actions.deleteTask}
        isLoading={actions.isDeleting}
        setVisible={(event) =>
          setActions({
            ...actions,
            deleteTask: event
          })
        }
        handleDelete={() => handleDeleteTask()}
      ></DeleteModal>
    </div>
  );
}
