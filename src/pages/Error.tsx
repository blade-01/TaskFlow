import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Btn from "../components/Ui/Btn";
import { useNavigate } from "react-router";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="grid place-items-center h-screen overflow-hidden">
      <div className="flex flex-col items-center justify-start">
        <DotLottieReact
          src="https://lottie.host/19666089-9e70-4ab0-bd87-7883934b4500/ONIQUrdaRW.lottie"
          loop
          autoplay
        />
        <Btn
          size="sm"
          label="Go Back"
          onClick={() => {
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
}

export default Error;
