import { isAxiosError } from "axios";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {isAxiosError(error) && (
          <i>{error.message}</i>
        )}
      </p>
    </div>
  );
}

export default Error