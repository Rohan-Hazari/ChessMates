import Spinner from "@/components/Loaders/Spinner";
import { FC } from "react";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div>
      <Spinner size={10} color="amber-500" className="m-auto " />
    </div>
  );
};

export default loading;
