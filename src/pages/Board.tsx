import { useParams } from "react-router";

export default function Board() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <div>{id}</div>
    </div>
  );
}
