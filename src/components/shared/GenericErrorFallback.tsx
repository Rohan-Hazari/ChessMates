import { FC } from "react";

interface GenericErrorFallbackProps {
  title?: string;
}

const GenericErrorFallback: FC<GenericErrorFallbackProps> = ({ title }) => {
  return (
    <div>
      Something went wrong {title && "with" + title} :(, please try again later
      after some time
    </div>
  );
};

export default GenericErrorFallback;
