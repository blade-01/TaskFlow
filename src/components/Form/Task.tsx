import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { Timestamp } from "firebase/firestore";
import UiInputText from "../Ui/Input/Text";
import UiInputTextArea from "../Ui/Input/TextArea";
import UiInputDropdown from "../Ui/Input/Dropdown";
import UiBtn from "../Ui/Btn";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller
} from "react-hook-form";
import { getErrorMessage } from "../../utils/error";
import { useMainStore } from "../../store/main";
import { useParams } from "react-router";

export default function Task({
  setVisible,
  isEdit = false,
  task
}: {
  setVisible: (visible: boolean) => void;
  isEdit?: boolean;
  task?: {
    id?: string;
    name: string;
    description?: string;
    subtasks: { name: string; isCompleted: boolean }[];
    boardId: string;
    status: string;
    createdAt: Timestamp;
  };
}) {
  // const { user } = useAuth();
  const { createTask, updateTask, board } = useMainStore();
  const { id: boardId } = useParams<{ id: string }>();
  const boards = board?.columns || [];

  type Inputs = {
    name: string;
    description?: string;
    subtasks: { name: string; isCompleted: boolean }[];
    columnId: string;
    boardId: string;
    status: string;
    createdAt: Timestamp;
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: isEdit
      ? task
      : {
          name: "",
          subtasks: [{ name: "", isCompleted: false }]
        }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks"
  });

  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { name, description, subtasks, status } = data;
    const payload = {
      name: name,
      description: description,
      boardId: boardId || "",
      status: status,
      subtasks: subtasks
        .filter((task) => task.name.trim() !== "")
        .map((task) => ({
          name: task.name,
          isCompleted: false
        })),
      createdAt: isEdit ? (task?.createdAt as Timestamp) : Timestamp.now(),
      order: 0
    };
    try {
      setLoading(true);
      if (isEdit && task) {
        await updateTask(task.id!, payload);
      } else {
        await createTask({ ...payload });
      }
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setVisible(false);
      setLoading(false);
      reset();
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <UiInputText
            name="name"
            label="Task Name"
            placeholder="e.g. Review the new design"
            control={control}
            requiredMark
            error={errors.name?.message}
          />
          <UiInputTextArea
            name="description"
            label="Description"
            placeholder="e.g. It's always good to take a break. This  15 minute break will  recharge the batteries  a little."
            control={control}
            requiredMark
            error={errors.description?.message}
            rows={3}
          />
        </div>
        <p className="text-sm font-medium text-main-text mb-1 mt-5">Subtasks</p>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-1.5 mb-2.5">
            <UiInputText
              name={`subtasks.${index}.name`}
              label={`Subtask ${index + 1}`}
              labelClass="hidden"
              control={control}
              error={errors.subtasks?.[index]?.name?.message}
              outerClass="w-full"
            />
            <IoClose
              size={25}
              className="cursor-pointer mt-3 hover:scale-110 transition-all"
              onClick={() => {
                if (fields?.length > 1) {
                  remove(index);
                }
              }}
            />
          </div>
        ))}

        <div className="flex flex-col gap-5 mt-5">
          <UiBtn
            label="Add new subtask"
            size="sm"
            outerClass="w-full  rounded-full bg-white border border-btn-bg text-btn-bg"
            prependIcon={<FaPlus />}
            onClick={() => append({ name: "", isCompleted: false })}
            type="button"
          />
          <Controller
            name="status"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <UiInputDropdown
                {...field}
                label="Current Status"
                placeholder="e.g. Backlog"
                options={boards}
                optionLabel="name"
                optionValue="id"
                filter
                showClear
                requiredMark
                error={errors.status?.message}
              />
            )}
          />
          <UiBtn
            label={isEdit ? "Save changes" : "Create new board"}
            size="sm"
            outerClass="w-full rounded-full"
            isLoading={loading}
          />
        </div>
      </form>
    </div>
  );
}
