import { isAxiosError } from "axios";
import { PlugZapIcon } from "lucide-react";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="h-screen flex items-center justify-center flex-col gap-4 text-center p-8 text-slate-900">
      <PlugZapIcon size={80} strokeWidth={1} />
      <h1 className="text-4xl md:text-5xl">What the *%$# did you say?!</h1>
      <p className="text-xl" >There was an error while processing your request.</p>
      <p className="py-4 px-8 bg-slate-100">
        Error:  <i>{isAxiosError(error) ? error.message : 'unknown error (sorry u.u)'}</i>
      </p>
    </div>
  );
}

export default Error