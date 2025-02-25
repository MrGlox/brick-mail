import { GeneralError } from "~/containers/errors/general-error";

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean;
}

export default function GeneralErrorPge({
  className,
  minimal = false,
}: GeneralErrorProps) {
  return <GeneralError {...{ className, minimal }} />;
}
