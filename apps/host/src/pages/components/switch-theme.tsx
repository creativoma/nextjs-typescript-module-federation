import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import { TbMoonStars, TbSun } from "react-icons/tb";

interface SwitchThemeProps {
  clases?: string;
}

const SwitchTheme: React.FC<SwitchThemeProps> = ({ ...props }) => {
  const { setTheme, theme } = useTheme();

  const { clases } = props;

  useEffect(() => {
    const moonStars = document.getElementById("moonStars");
    const sun = document.getElementById("sun");

    if (theme === "light") {
      moonStars?.classList.add("hidden");
      sun?.classList.remove("hidden");
    } else {
      moonStars?.classList.remove("hidden");
      sun?.classList.add("hidden");
    }
  }, [theme]);

  return (
    <div className={`${clases} z-50`}>
      <TbMoonStars
        id="moonStars"
        onClick={() => setTheme("light")}
        className="w-6 h-6 cursor-pointer"
      />
      <TbSun
        id="sun"
        onClick={() => setTheme("dark")}
        className="w-6 h-6 hidden cursor-pointer"
      />
    </div>
  );
};

export default SwitchTheme;
