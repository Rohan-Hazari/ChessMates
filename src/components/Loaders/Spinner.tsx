import { Loader2 } from "lucide-react";
import { FC } from "react";
import clsx from "clsx";

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const Spinner: FC<SpinnerProps> = ({
  size = 5,
  color = "zinc-500",
  className = "",
}) => {
  return (
    <>
      <Loader2
        className={clsx(
          `h-${size} w-${size} text-${color} animate-spin`,
          className
        )}
      />
    </>
  );
};

export default Spinner;
