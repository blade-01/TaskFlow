import CenterModal from "./Center";
import Btn from "../Btn";

export default function Delete({
  title,
  visible,
  isLoading,
  setVisible,
  handleDelete
}: {
  title?: string;
  isLoading?: boolean;
  visible: boolean;
  setVisible: (event: boolean) => void;
  handleDelete: () => void;
}) {
  return (
    <div>
      <CenterModal
        title={title}
        visible={visible}
        setVisible={(event) => setVisible(event)}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-semibold">
            Are you sure you want to delete this board?
          </h1>
          <p className="text-sm text-main-text">
            This action cannot be undone. All tasks and data will be permanently
            deleted.
          </p>
          <div className="flex justify-end gap-2">
            <Btn
              onClick={() => setVisible(false)}
              outerClass="btn btn-sm btn-default"
            >
              Cancel
            </Btn>
            <Btn
              onClick={() => handleDelete()}
              isLoading={isLoading}
              outerClass="btn btn-sm btn-danger"
            >
              Delete
            </Btn>
          </div>
        </div>
      </CenterModal>
    </div>
  );
}
