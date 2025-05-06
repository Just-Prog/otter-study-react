import {IndexFrame} from "@/pages/index/index.jsx";
import {Outlet, useParams} from "react-router";
import {Card, Space, Typography} from "antd";
import {useEffect, useState} from "react";
import api from "@/api/api.jsx";

const ClassCourseWarePage = ()=>{}
const ClassInfoPage = ()=>{}
const ClassActivityPage = ()=>{}
const ClassStatisticPage = ()=>{}

const ClassMainPage = () => {
    const params = useParams();
    const classId = params.classId;
    const courseId = params.courseId;
    const [courseData, setCourseData] = useState({});
    const fetchClassInfo = async()=>{
        let resp = await api.post("/tac/class/classInfo",{classId: classId});
        setCourseData(resp.data);
    }
    useEffect(() => {
        fetchClassInfo();
    }, []);
    return (
        <IndexFrame>
            <div style={{rowGap: "16px", width: "100%", display: "flex", flexDirection: "column"}}>
                <Card style={{textOverflow: "ellipsis", overflowX: "auto"}}>
                    <div>
                        <div style={{fontWeight: "bold", fontSize: "18px"}}>
                            {courseData.className ?? "Default"} ({courseData.classCode ?? "00AA00"})
                        </div>
                        <div style={{fontSize: "15px"}}>
                            任课教师: {courseData.teacher ?? "..."}
                        </div>
                    </div>
                </Card>
                <Card style={{textOverflow: "ellipsis", overflowX: "auto"}}>
                    <Outlet/>
                </Card>
            </div>
        </IndexFrame>
    )
}

export default ClassMainPage;

export { ClassCourseWarePage, ClassInfoPage, ClassActivityPage, ClassStatisticPage };