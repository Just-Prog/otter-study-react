import {IndexFrame} from "@/pages/index/index.jsx";
import {Outlet, useLocation, useMatch, useParams} from "react-router";
import {Alert, Card, Col, Layout, Menu, Row, Spin, Tabs} from "antd";
import {createContext, useContext, useEffect, useState} from "react";
import api from "@/api/api.jsx";
import {useNavigate} from "react-router-dom";

import './class_detail.css';
import {fileExt2Icons, activityDesc} from "@/components/common/otter_common_define.js";
import ClassHomeworkComponent from "@/components/class/homework.jsx";
import ClassSignInComponent from "@/components/class/sign_in.jsx";

const ClassDetailContext = createContext({
    classId: -1,
    courseId: -1
});

const ClassCourseWareActivityPage = ()=>{
    const isActivityMatched = useMatch({path: "/class-detail/:classId/:courseId/activity", end: false})
    const params = useParams();
    const type = params.type;
    const tabBarItems = [
        {
            key: 'chapters',
            label: '章节',
            children: <ClassChapterList/>
        },
        {
            key: 'activity',
            label: '活动',
            children: <ClassActivityList/>
        },
    ]
    return (
        <>
            <Row gutter={[12,12]}>
                <Col lg={8} xs={24}>
                    <Card className="class-content-left-card" style={{position: "sticky", top: 80, height: "65vh", maxHeight: "65vh"}}>
                        <Tabs defaultActiveKey={(isActivityMatched && type == 4) ? "activity" : "chapters"} items={tabBarItems} className="class-content-left-tabs"/>
                    </Card>
                </Col>
                <Col lg={16} xs={24}>
                    <Outlet />
                </Col>
            </Row>
        </>
    );
}

const ClassActivityType = {
    0: <ClassHomeworkComponent/>,    // 作业
    4: <ClassSignInComponent/>
}

const ClassActivityPage = () => {
    const params = useParams();
    const type = params.type ?? -1;
    return (
        <>
            {ClassActivityType[type] ?? "Unavailable"}
        </>
    );
}

const ClassChapterList = ()=>{
    const params = useParams();
    const docId = params.docId ?? params.actId ?? 0;
    const type = params.type ?? 5;
    const navigate = useNavigate();
    const {classId, courseId} = params;
    const [details, setDetails] = useState([]);
    const fetchChapterInfo = async()=>{
        setDetails((await api.post('/tac/teachActivity/v1/chapterDetails',{
            classId: classId, courseId: courseId
        })).data)
    }
    const items = details.map((item)=>{
        return {
            key: item.chapterId,
            label: `第${item.sort}章 ${item.name}`,
            icon: null,
            children: item.chapterDetailEntityList.map((course)=>{
                return {
                    key: course.id,
                    label: `${item.sort}.${course.sort} ${course.name}`,
                    type: 'group',
                    children: course.teachContentResList.map((res)=>{
                        return {
                            key: `${res.type}-${res.dataId}`,
                            label: res.name,
                            icon: <img src={res.type === 5 ? fileExt2Icons(res.typeStr) : activityDesc[res.type].icon} height={18} alt=""/>
                        }
                    }),
                }
            })
        }
    });
    const onMenuSelect = (item)=>{
        let type = item.key.split("-")[0]
        if(type === "5" || type === "12"){
            navigate(`/class-detail/${classId}/${courseId}/courseware/${item.keyPath[1]}/${type}/${item.key.split("-")[1]}`);
        }else{
            navigate(`/class-detail/${classId}/${courseId}/activity/${item.key.split('-')[0]}/${item.key.split('-')[1]}`)
        }
        console.log(`${item.key}`);
    }
    useEffect(()=>{
        fetchChapterInfo();
    },[])
    return (
      <Menu
        className="class-content-left-menu"
        selectedKeys={[`${type}-${docId}`]}
        openKeys={details.map((item) => item.chapterId)}
        items={items}
        onSelect={onMenuSelect}
        mode="inline"
      />
    );
}

const ClassActivityList = ()=>{
    const params = useParams();
    const activityId = `${params.type}-${params.actId}`;
    const nav = useNavigate();
    const {classId, courseId} = params;
    const [details, setDetails] = useState([]);
    const fetchActivityInfo = async()=>{
        setDetails((await api.get(`/tac/class/v1/stu/activities/${classId}`,{params: {
                classId: classId
            }})).data)
    }
    useEffect(()=>{
        fetchActivityInfo();
    },[])
    const items = details.map((item) => {
      return {
        key: item.time,
        label: new Date(Number.parseInt(item.time)).toLocaleDateString(),
        type: "group",
        children: item.list.map((i)=>{
            return {
              key: `${i.type}-${i.id}`,
              label: i.name,
              icon: <img src={activityDesc[i.type].icon} height={18} alt="" />,
            };
        })
      };
    });
    const onMenuSelect = (item)=>{
        let type = item.key.split("-")[0]
        if(type === "5" || type === "12"){
            nav(`/class-detail/${classId}/${courseId}/courseware/${item.keyPath[1]}/${item.key.split("-")[1]}`);
        }else{
            nav(`/class-detail/${classId}/${courseId}/activity/${item.key.split('-')[0]}/${item.key.split('-')[1]}`)
        }
    }
    return <Menu className="class-content-left-menu" selectedKeys={[activityId]} items={items} onSelect={onMenuSelect} mode="inline"/>
}

const ClassStatisticPage = ()=>{
    return (
        <>
            <div>statisticpage</div>
        </>
    );
}

const ClassInfoPage = ()=>{
    return (
        <>
            <div>infopage</div>
        </>
    );
}

const ClassMainPage = () => {
    const params = useParams();
    const [courseData, setCourseData] = useState({});
    const fetchClassInfo = async()=>{
        let resp = await api.post("/tac/class/classInfo",{classId: params.classId});
        setCourseData(resp.data);
    }
    const [loading,setLoading] = useState(true);
    const nav = useNavigate();
    const location = useLocation();
    const isRootRoute = useMatch({ path: '/class-detail/:classId/:courseId', end: true });
    const isChildRoute = useMatch({ path: '/class-detail/:classId/:courseId/', end: false }) && !isRootRoute;
    useEffect(() => {
        setLoading(true)
        if(isChildRoute){
            fetchClassInfo().then(()=>{
                setLoading(false);
            });
        }else{
            fetchClassInfo().then(()=>{
                setLoading(false);
                nav(`/class-detail/${params.classId}/${params.courseId}/courseware`);
            });
        }
    }, [isRootRoute,params.classId,params.courseId]);
    return (
        <IndexFrame>
            {loading
                ? <Spin size="large">
                    <Alert message="加载中" type="info" />
                </Spin>
                : <div style={{rowGap: "16px", width: "100%", display: "flex", flexDirection: "column"}}>
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
                    <Outlet/>
                </div>
            }
        </IndexFrame>
    )
}

export default ClassMainPage;

export { ClassCourseWareActivityPage, ClassActivityPage, ClassInfoPage, ClassStatisticPage };