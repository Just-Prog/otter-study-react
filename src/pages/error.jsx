
import {useNavigate, useRouteError} from "react-router-dom"
import {Button} from "antd";
 
export default function ErrorPage(){
    const routerError = useRouteError()
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
                <p>{routerError.statusText}</p>
            </div>
            <div>
                <Button type="primary" onClick={()=>{
                    navigate(-1) && navigate('/')
                }}>返回</Button>
            </div>
        </div>
      </>
    );
}
