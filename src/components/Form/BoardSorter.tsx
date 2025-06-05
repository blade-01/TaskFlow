import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import UiInputText from "../Ui/Input/Text";
import UiBtn from "../Ui/Btn";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { getErrorMessage } from "../../utils/error";
import { useMainStore } from "../../store/main";
import { v4 as uuidv4 } from "uuid";
import { IoReorderThree } from "react-icons/io5";
import { ReactSortable } from "react-sortablejs";

export default function BoardReorder({
  setVisible,
  isEdit = false,
  board
}: {
  setVisible: (visible: boolean) => void;
  isEdit?: boolean;
  board?: {
    id?: string;
    name: string;
    columns: { name: string; color: string; id: string }[];
    createdAt: Timestamp;
    createdBy: string;
  };
}) {
  const { updateBoard } = useMainStore();

  type Inputs = {
    name: string;
    columns: { name: string; color: string; id?: string }[];
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: isEdit
      ? board
      : {
          name: "",
          columns: [{ name: "", color: "", id: uuidv4() }]
        }
  });

  const { fields } = useFieldArray({
    control,
    name: "columns"
  });

  const [state, setState] = useState<typeof fields>(fields);
  useEffect(() => {
    setState(fields);
  }, [fields]);
  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { name } = data;
    const payload = {
      name: name,
      columns: state.map((column) => {
        const foundId =
          board?.columns?.find((item) => item.name === column.name)?.id ||
          column.id ||
          uuidv4();
        return {
          id: foundId,
          name: column.name,
          color: column.color || "#000000"
        };
      }),
      createdAt: board?.createdAt as Timestamp,
      createdBy: board?.createdBy || ""
    };
    try {
      setLoading(true);
      if (board) {
        await updateBoard(board.id!, payload);
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
        <ReactSortable list={state} setList={setState}>
          {state.map((field, index) => (
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
              <IoReorderThree className="drag-handle cursor-grab" size={30} />
            </div>
          ))}
        </ReactSortable>

        <div className="mt-5">
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
