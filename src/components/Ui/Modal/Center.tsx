import { Dialog } from "primereact/dialog";

export default function CenterModal({
  children,
  title,
  header,
  footer,
  visible,
  setVisible
}: {
  children?: React.ReactNode;
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const headerElement = header ? (
    header
  ) : (
    <div>{title && <p className="text-2xl font-bold">{title}</p>}</div>
  );

  const footerContent = footer && <div>{footer}</div>;

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={visible}
        header={headerElement}
        footer={footerContent}
        className="w-[90%] md:w-1/2 lg:w-1/3 mx-auto"
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="p-4">{children}</div>
      </Dialog>
    </div>
  );
}
