import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import { db } from "../../firebase";
import { Timestamp, setDoc, doc } from "firebase/firestore";
import UiInputText from "../Ui/Input/Text";
import UiBtn from "../Ui/Btn";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { getErrorMessage } from "../../utils/error";

export default function Board({
  setVisible
}: {
  setVisible: (visible: boolean) => void;
}) {
  const { user } = useAuth();

  type Inputs = {
    boardName: string;
    columns: { name: string }[];
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      boardName: "",
      columns: [{ name: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns"
  });

  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { boardName, columns } = data;
    setLoading(true);
    const payload = {
      name: boardName,
      columns: columns.map((column) => ({
        name: column.name,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16)
      })),
      createdAt: Timestamp.now(),
      createdBy: user?.uid
    };
    try {
      await setDoc(doc(db, "boards", boardName), payload);
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
        <UiInputText
          name="boardName"
          label="Board Name"
          placeholder="e.g. Business roadmap"
          register={register}
          requiredMark
          error={errors.boardName?.message}
        />
        <p className="text-sm font-medium text-main-text mb-1 mt-5">
          Board Columns
        </p>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-1.5 mb-2.5">
            <UiInputText
              name={`columns.${index}.name`}
              label={`Column ${index + 1}`}
              labelClass="hidden"
              register={register}
              error={errors.columns?.[index]?.name?.message}
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
            label="Add new column"
            size="sm"
            outerClass="w-full  rounded-full bg-white border border-btn-bg text-btn-bg"
            prependIcon={<FaPlus />}
            onClick={() => append({ name: "" })}
            type="button"
          />

          <UiBtn
            label="Create new board"
            size="sm"
            outerClass="w-full rounded-full"
            isLoading={loading}
          />
        </div>
      </form>
    </div>
  );
}
