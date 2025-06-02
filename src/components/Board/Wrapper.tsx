import DashboardLayout from "../../layouts/DashboardLayout";

export default function Wrapper({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <DashboardLayout title={title}>{children}</DashboardLayout>
    </div>
  );
}
