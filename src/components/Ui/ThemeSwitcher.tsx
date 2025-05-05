import { Classic } from "@theme-toggles/react";
import { useThemeStore } from "../../store/theme";
import { cn } from "../../utils/index";
import { PrimeReactContext } from "primereact/api";
import { useEffect, useContext } from "react";

export default function ThemeSwitcher({
  outerClass,
  wrapperClass
}: {
  outerClass?: string;
  wrapperClass?: string;
}) {
  const { toggleTheme, theme } = useThemeStore();
  const { changeTheme } = useContext(PrimeReactContext);

  // Dynamically switch PrimeReact theme
  useEffect(() => {
    const currentTheme =
      theme === "dark" ? "md-light-indigo" : "md-dark-indigo";
    const newTheme = theme === "dark" ? "md-dark-indigo" : "md-light-indigo";

    if (changeTheme) {
      changeTheme(currentTheme, newTheme, "prime-theme", () => {});
    }
  }, [theme]);
  return (
    <div>
      <div
        className={cn(
          "flex flex-col justify-center gap-2.5 text-center px-4",
          wrapperClass
        )}
      >
        <div
          className={cn(
            "fixed top-5 right-5 lg:top-10 lg:right-10 z-50",
            outerClass
          )}
        >
          <Classic
            toggled={theme === "dark"}
            onToggle={() => toggleTheme()}
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            className="cursor-pointer text-3xl"
          />
        </div>
      </div>
    </div>
  );
}
