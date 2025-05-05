import { FaGoogle } from "react-icons/fa";
import { Toast } from "primereact/toast";
import UiBtn from "../components/Ui/Btn";
import logo from "../assets/logo.svg";
import ThemeSwitcher from "../components//Ui/ThemeSwitcher";
import useAuth from "../hooks/useAuth";

export default function Auth() {
  const { loading, login, toast } = useAuth();

  return (
    <div>
      <Toast ref={toast} />
      <ThemeSwitcher />
      <div className="flex flex-col items-center justify-center text-center absolute inset-y-0 inset-x-0 w-[90%] md:w-[320px] mx-auto">
        <div>
          <img src={logo} alt="logo" />
        </div>
        <h1 className="text-2xl lg:text-[26px] font-bold my-2.5">
          Welcome to Taskflow 👋🏼
        </h1>
        <p className="text-sm">Your Workflow, Your Rules 🚀</p>
        <div className="flex flex-col gap-5 w-full mt-8">
          <UiBtn
            prependIcon={<FaGoogle size={20} />}
            size="sm"
            outerClass="w-full"
            onClick={() => login()}
            isLoading={loading}
          >
            Sign In With Google
          </UiBtn>
        </div>
      </div>
    </div>
  );
}
