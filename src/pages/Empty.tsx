import { FiPlus } from "react-icons/fi";
import UiBtn from "../components/Ui/Btn";
import BoardForm from "../components/Form/Board";
import CenterModal from "../components/Ui/Modal/Center";
import { useState } from "react";

function Empty() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="h-screen w-[90%] sm:w-[400px] mx-auto grid place-items-center">
      <div className="text-center flex flex-col justify-center items-center">
        <p className="text-main-text font-semibold text-lg sm:text-xl">
          Oops!, there are no boards available, create a new board to get
          started.
        </p>
        <UiBtn
          prependIcon={<FiPlus size={20} />}
          label="Create Board"
          size="sm"
          outerClass="rounded-full mt-5"
          onClick={() => setVisible(true)}
        />
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

export default Empty;
