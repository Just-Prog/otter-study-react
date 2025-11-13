import { Button } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const routerError = useRouteError();
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <h1>页面发生错误</h1>
        </div>
        <div>
          <p>
            {routerError.error
              ? routerError.error.toString()
              : routerError.toString()}
          </p>
        </div>
        <div>
          <Button
            onClick={() => {
              navigate(-1) && navigate("/");
            }}
            type="primary"
          >
            返回
          </Button>
        </div>
      </div>
    </>
  );
}
