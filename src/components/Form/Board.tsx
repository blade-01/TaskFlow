import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import { Timestamp } from "firebase/firestore";
import UiInputText from "../Ui/Input/Text";
import UiBtn from "../Ui/Btn";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { getErrorMessage } from "../../utils/error";
import { useMainStore } from "../../store/main";
import { v4 as uuidv4 } from "uuid";
import { TbMenuOrder } from "react-icons/tb";

export default function Board({
  setVisible,
  setShowColumn,
  isEdit = false,
  board
}: {
  setVisible: (visible: boolean) => void;
  setShowColumn?: (visible: boolean) => void;
  isEdit?: boolean;
  board?: {
    id?: string;
    name: string;
    columns: { name: string; color: string; id: string }[];
    createdAt: Timestamp;
    createdBy: string;
  };
}) {
  const { user } = useAuth();
  const { createBoard, updateBoard } = useMainStore();

  type Inputs = {
    name: string;
    columns: { name: string; color: string; id?: string }[];
  };

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: isEdit
      ? board
      : {
          name: "",
          columns: [{ name: "", color: "", id: uuidv4() }]
        }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns"
  });

  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { name, columns } = data;
    const payload = {
      name: name,
      columns: columns.map((column) => ({
        id: column.id || uuidv4(),
        name: column.name,
        color: column.color || "#000000"
      })),
      createdAt: isEdit ? (board?.createdAt as Timestamp) : Timestamp.now(),
      createdBy: user?.uid || ""
    };
    try {
      setLoading(true);
      if (isEdit && board) {
        await updateBoard(board.id!, payload);
      } else {
        await createBoard(payload);
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
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <UiInputText
            name="name"
            label="Board Name"
            placeholder="e.g. Business roadmap"
            control={control}
            requiredMark
            error={errors.name?.message}
          />
          <div className="flex justify-between items-end mb-2.5">
            <p className="text-sm font-medium text-main-text  mt-5">
              Board Columns
            </p>

            <div
              className="flex items-end gap-2 cursor-pointer"
              onClick={() => {
                setShowColumn?.(true);
              }}
            >
              <TbMenuOrder className=" mb-0.5" size={18} />
              <p className="text-sm font-medium text-main-text">Rearrange</p>
            </div>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-1.5 mb-2.5">
              <UiInputText
                name={`columns.${index}.name`}
                label={`Column ${index + 1}`}
                labelClass="hidden"
                control={control}
                requiredMark
                error={errors.columns?.[index]?.name?.message}
                outerClass="w-full"
              />
              <input
                {...register(`columns.${index}.color`)}
                key={index}
                type="color"
                className="h-8 w-10 rounded-sm"
              />
              <IoClose
                size={25}
                className="cursor-pointer mt-[1px] hover:scale-110 transition-all"
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
              label="Add new column"
              size="sm"
              outerClass="w-full  rounded-full bg-white border border-btn-bg text-btn-bg"
              prependIcon={<FaPlus />}
              onClick={() =>
                append({ name: "", color: "#000000", id: uuidv4() })
              }
              type="button"
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
    </div>
  );
}
