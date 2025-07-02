import { Triangle } from "react-loader-spinner";
import { cn } from "../../../utils";

function Loader(outerClass: { outerClass?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-screen text-xl",
        outerClass
      )}
    >
      <Triangle
        visible={true}
        height="80"
        width="80"
        color="#fd5d03"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default Loader;
