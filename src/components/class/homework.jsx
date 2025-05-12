import {useParams} from "react-router";
import {Card} from "antd";

const ClassHomeworkComponent = ()=>{
    const params = useParams();
    const dataId = params.actId;
    return (
        <>
            <Card>
                {dataId}
            </Card>

            <Card style={{marginTop: 16}}>
                {JSON.stringify({})}
            </Card>
        </>
    )
}

export default ClassHomeworkComponent;