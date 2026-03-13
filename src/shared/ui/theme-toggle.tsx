import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useThemeStore } from "../lib/store/use-theme-store";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-xl hover:bg-secondary/10 transition-colors"
    >
      <div className="relative h-full w-full flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{
            scale: theme === "light" ? 1 : 0,
            rotate: theme === "light" ? 0 : 90,
            opacity: theme === "light" ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Sun className="h-5 w-5 text-amber-500" />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            rotate: theme === "dark" ? 0 : -90,
            opacity: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Moon className="h-5 w-5 text-indigo-400" />
        </motion.div>
      </div>
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}