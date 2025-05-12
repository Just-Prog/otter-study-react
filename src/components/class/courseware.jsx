import {useParams} from "react-router";
import {useEffect, useState} from "react";
import api from "@/api/api.jsx";
import {Card} from "antd";

const ClassCoursewareResPage = ()=>{
    const params = useParams();
    const targetId = params.docId;
    const chapterId = params.chapterId ?? "";
    const [data, setData] = useState({});
    const fetchData = async () => {
        setData(
            (await api.get("/tac/apps/activities/data-info",{params: {
                    chapterId: chapterId,
                    dataId: targetId
                }}
            )).data
        )
    }
    useEffect(() => {
        fetchData();
    },[chapterId, targetId])
    return (
        <>
            <Card>

            </Card>

            <Card style={{marginTop: 16}}>
                {JSON.stringify(data)}
            </Card>
        </>
    );
}

export default ClassCoursewareResPage;