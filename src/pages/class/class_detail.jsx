import {IndexFrame} from "@/pages/index/index.jsx";
import {Outlet, useLocation, useMatch, useParams} from "react-router";
import {Alert, Card, Col, Menu, Row, Space, Spin, Tabs, message, Button, Table, Divider, Statistic, Descriptions, Progress} from "antd";
import {createContext, useContext, useEffect, useState} from "react";
import api from "@/api/api.jsx";
import {useNavigate} from "react-router-dom";

import './class_detail.css';
import {fileExt2Icons, activityDesc} from "@/components/common/otter_common_define.js";
import ClassHomeworkComponent from "@/components/class/homework.jsx";
import ClassSignInComponent from "@/components/class/sign_in.jsx";
import {ContactsOutlined, InfoCircleOutlined, ReadOutlined} from "@ant-design/icons";
import default_cropper from "@/assets/default-cropper.png";
import userStore from "@/stores/user.jsx";

import ASSET_VIDEO from "@/assets/icons/files/icon-video.png";
import ASSET_OTHER from "@/assets/icons/files/icon-other.png";
import ASSET_TEST from "@/assets/icons/activity/icon-test.png";
import ASSET_HOMEWORK from "@/assets/icons/activity/icon-homework.png";
import ASSET_PRACTICE from "@/assets/icons/activity/icon-practive.png";
import ASSET_SIGNIN from "@/assets/icons/activity/icon-sign-in.png";

const ClassCourseWareDataContext = createContext();
const ClassCourseWareActivityPage = ()=>{
    const isActivityMatched = useMatch({path: "/class-detail/:classId/:courseId/activity", end: false})
    const [current, setCurrent] = useState({});
    const tabBarItems = [
        {
            key: 'chapters',
            label: '章节',
            children: <ClassChapterList/>,
            forceRender: true
        },
        {
            key: 'activity',
            label: '活动',
            children: <ClassActivityList/>,
            forceRender: true
        },
    ]
    return (
        <>
            <Row gutter={[12,12]}>
                <Col lg={8} xs={24}>
                    <Card className="class-content-left-card" style={{position: "sticky", top: 80, height: "65vh", maxHeight: "65vh"}}>
                        <ClassCourseWareDataContext.Provider value={{current,setCurrent}}>
                            <Tabs defaultActiveKey={(isActivityMatched) ? "activity" : "chapters"} items={tabBarItems} className="class-content-left-tabs"/>
                        </ClassCourseWareDataContext.Provider>
                    </Card>
                </Col>
                <Col lg={16} xs={24}>
                    <ClassCourseWareDataContext.Provider value={{current,setCurrent}}>
                        <Outlet/>
                    </ClassCourseWareDataContext.Provider>
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
    const dataContext = useContext(ClassCourseWareDataContext);
    const data = dataContext.current;
    const type = dataContext.current?.type ?? -1;
    const publishTime = new Date(Number.parseInt(data?.publishTime ?? 0));
    const deadline = new Date(Number.parseInt(data?.deadline ?? 0));
    const current = new Date();
    const status  = data?.status ?? 0;
    const statusText = ["已发布","进行中","已结束"]
    const formatter = new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return (
        Object.keys(data).length !== 0 ? <>
            <Card>
                <Space align={"center"}>
                    <div style={{marginRight: 8}}>
                        <img width={"40"} src={activityDesc[data.type ?? -1].icon} />
                    </div>
                    <div style={{display: "flex", alignItems: "start", flexDirection: "column"}}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <span style={{
                                fontSize: "13px",
                                border: status === 1 ? "#fc996e 1px solid" : "#000 1px solid",
                                borderRadius: "3px",
                                padding: "1px 4px",
                                color: status === 1 ? "#fc996e" : "#000",
                                marginRight: "5px"
                            }}>
                                {statusText[status]}
                            </span>
                            <span style={{fontSize: "18px", fontWeight: "bold"}}>{data?.name}</span>
                        </div>
                        <div>
                            <span style={{marginRight: "8px"}}>发布时间: {`${formatter.format(publishTime)}`}</span>
                            {type !== 4
                                ? <>
                                    <span style={{marginRight: "8px", color: current > deadline && deadline.valueOf() !== 0 ? "red" : "#000"}}>{deadline.valueOf() !== 0 ? `结束时间: ${formatter.format(deadline)}` : "手动结束"}</span>
                                    <span style={{marginRight: "8px"}}>{data?.partNum}/{data?.studentNum}人参与</span>
                                    {type === 0
                                        ? <span style={{marginRight: "8px"}}>
                                            共{data?.homeworkScore}分
                                        </span>
                                        : <></>
                                    }
                                  </>
                                : <></>
                            }
                        </div>
                    </div>
                </Space>
            </Card>
            <div style={{marginTop: 16}}>
                {ClassActivityType[type] ?? <></>}
            </div>
        </> : <Spin/>
    );
}

const ClassChapterList = ()=>{
    const dataContext = useContext(ClassCourseWareDataContext);
    const params = useParams();
    const navigate = useNavigate();
    const {classId, courseId} = params;
    const [details, setDetails] = useState([]);
    const fetchChapterInfo = async()=>{
        let resp = await api.post('/tac/teachActivity/v1/chapterDetails',{
            classId: classId, courseId: courseId
        });
        
        if(params.docId || params.actId){
            let data = resp.data
            data = data.map(i=>i.chapterDetailEntityList).flat(1).map(i=>i.teachContentResList).flat(1).find(i=>i.dataId === params.docId || i.dataId === params.actId)
            if(typeof(data) !== "undefined"){
                dataContext.setCurrent(data)
            }
        }
        setDetails(resp.data);
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
                            icon: <img src={res.type === 5 ? fileExt2Icons(res.typeStr) : activityDesc[res.type].icon} height={18} alt=""/>,
                        }
                    }),
                }
            })
        }
    });
    const onMenuSelect = (item)=>{
        let type = item.key.split("-")[0]
        if(type === "5" || type === "12"){
            navigate(`/class-detail/${classId}/${courseId}/courseware/${item.key.split("-")[1]}`);
        }else{
            navigate(`/class-detail/${classId}/${courseId}/activity/${item.key.split('-')[1]}`)
        }
        setTimeout(()=> {
            dataContext.setCurrent((details.find(i=>i.chapterId === item.keyPath[1])).chapterDetailEntityList.map(i=>i.teachContentResList).flat(Infinity).find(i=>i.dataId === item.key.split('-')[1]));
        },100)
    }
    useEffect(()=>{
        fetchChapterInfo();
    },[])
    return (
        <Menu
            className="class-content-left-menu"
            selectedKeys={[`${dataContext.current?.type}-${dataContext.current?.dataId}`]}
            openKeys={details.map((item) => item.chapterId)}
            items={items}
            onSelect={onMenuSelect}
            mode="inline"
        />
    );
}

const ClassActivityList = ()=>{
    const dataContext = useContext(ClassCourseWareDataContext);
    const params = useParams();
    const nav = useNavigate();
    const {classId, courseId} = params;
    const [details, setDetails] = useState([]);
    const fetchActivityInfo = async()=>{
        let resp = await api.get(`/tac/class/v1/stu/activities/${classId}`,{params: {
            classId: classId
        }});
        
        if(params.docId || params.actId){
            let data = resp.data
            data = data.map(i=>i.list).flat(1).find(i=>i.dataId === params.actId || i.dataId === params.docId)
            if(typeof(data) !== "undefined"){
                dataContext.setCurrent(data)
            }
        }
        setDetails(resp.data);
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
              key: `${i.type}-${i.dataId}`,
              label: i.name,
              icon: <img src={activityDesc[i.type].icon} height={18} alt="" />,
            };
        })
      };
    });
    const onMenuSelect = (item)=>{
        let type = item.key.split("-")[0]
        if(type === "5" || type === "12"){
            nav(`/class-detail/${classId}/${courseId}/courseware/${item.key.split("-")[1]}`);
        }else{
            nav(`/class-detail/${classId}/${courseId}/activity/${item.key.split('-')[1]}`)
        }
        setTimeout(()=>{
            dataContext.setCurrent(details.map(i=>i.list).flat(1).find(i=>i.dataId === item.key.split("-")[1]))
        },100)
    }
    return <Menu className="class-content-left-menu" selectedKeys={[`${dataContext.current?.type ?? 0}-${dataContext.current?.dataId ?? 0}`]} items={items} onSelect={onMenuSelect} mode="inline"/>
}

const ClassStatisticPage = ()=>{
    const stuId = userStore.getState().user.info.tenants[0].memberId;
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [signItemRes, setSignItemRes] = useState({});
    const [videoPlayStatus, setVideoPlayStatus] = useState({
        play: {}, time: {}
    });
    const [coursewareStatus, setCoursewareStatus] = useState({});
    const [testTaskStatus, setTestTaskStatus] = useState({});
    const [homeworkStatus, setHomeworkStatus] = useState({});
    const [activityStatus, setActivityStatus] = useState({});
    const [practiceStatus, setPracticeStatus] = useState({});
    const fetchStatisticBasicData = async ()=>{
        let resp = await api.get(`/reports/v1/statistics/student-rank/${stuId}`,{params:{
            classId: params.classId,
            }});
        setSignItemRes(resp.data.signItemRes);
        setVideoPlayStatus({play: resp.data.videoPlay, time: resp.data.watchTime});
        setCoursewareStatus(resp.data.courseWare);
        setTestTaskStatus(resp.data.testTask);
        setHomeworkStatus(resp.data.homework);
        setActivityStatus(resp.data.activity);
        setPracticeStatus(resp.data.practice);
        setLoading(false);
    }
    useEffect(()=>{
        fetchStatisticBasicData();
    },[])
    return (
        <>
            {
                loading
                ? <Spin/>
                : <Space style={{display: "flex"}} direction={"vertical"} size={"middle"}>
                    <Divider orientation="left">不积跬步无以至千里</Divider>
                    <Card style={{width: "100%"}} title={"签到数据"}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <Statistic title={<b>签到</b>} value={signItemRes.signCount ?? -1} style={{flex: "1"}}/>
                            <Statistic title={<b>迟到</b>} value={signItemRes.ltCount ?? -1} style={{flex: "1"}}/>
                            <Statistic title={<b>早退</b>} value={signItemRes.elCount ?? -1} style={{flex: "1"}}/>
                            <Statistic title={<b>事假</b>} value={signItemRes.plCount ?? -1} style={{flex: "1"}}/>
                            <Statistic title={<b>病假</b>} value={signItemRes.ilCount ?? -1} style={{flex: "1"}}/>
                            <Statistic
                                title={(<span style={{color: "red"}}><b>缺勤</b></span>)}
                                value={signItemRes.unsignCount ?? -1}
                                style={{flex: "1"}}
                                valueStyle={{color: signItemRes.unsignCount && signItemRes.unsignCount !== 0 ? "red" : "black"}}
                            />
                        </div>
                    </Card>
                    <Divider orientation="left">不积小流无以成江海</Divider>
                    <Row gutter={[16,16]}>
                        <Col xs={24} lg={12}>
                            <Card title={<span style={{display: "flex", alignItems: "center"}}>
                                <img src={ASSET_VIDEO} height={18} alt="" style={{marginRight: "5px"}}/>
                                视频学习
                            </span>}>
                                <Row gutter={[16,16]}>
                                    <Col xs={24} lg={18}>
                                        <b>播放个数 ({videoPlayStatus.play.count}/{videoPlayStatus.play.total})</b>
                                        <Progress percent={videoPlayStatus.play.percent} style={{flex:1}} />
                                    </Col>
                                    <Col xs={24} lg={6}>
                                        <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                                            <span>
                                                班级排名: <b>{videoPlayStatus.play.rankString}</b>
                                            </span>
                                        </div>
                                    </Col>
                                    <Col xs={24} lg={18}>
                                        <b>观看时长 ({(videoPlayStatus.time.count / 60).toFixed(1)}/{(videoPlayStatus.time.total / 60).toFixed(1)}分钟)</b>
                                        <Progress percent={videoPlayStatus.time.percent} style={{flex:1}} />
                                    </Col>
                                    <Col xs={24} lg={6}>
                                        <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                                            <span>
                                                班级排名: <b>{videoPlayStatus.time.rankString}</b>
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title={<span style={{display: "flex", alignItems: "center"}}>
                                <img src={ASSET_OTHER} height={18} alt="" style={{marginRight: "5px"}}/>
                                非视频学习
                            </span>}>
                                <Row gutter={[16,16]}>
                                    <Col xs={24} lg={18}>
                                        <b>课件学习 ({coursewareStatus.count}/{coursewareStatus.total})</b>
                                        <Progress percent={coursewareStatus.percent} style={{flex:1}} />
                                    </Col>
                                    <Col xs={24} lg={6}>
                                        <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                                            <span>
                                                班级排名: <b>{coursewareStatus.rankString}</b>
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title={<span style={{display: "flex", alignItems: "center"}}>
                                <img src={ASSET_TEST} height={18} alt="" style={{marginRight: "5px"}}/>
                                测试
                            </span>}>
                                <Row gutter={[16,16]}>
                                    <Col xs={24} lg={18}>
                                        <b>提交次数 ({testTaskStatus.count}/{testTaskStatus.total})</b>
                                        <Progress percent={testTaskStatus.percent} style={{flex:1}} />
                                    </Col>
                                    <Col xs={24} lg={6}>
                                        <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                                            <span>
                                                班级排名: <b>{testTaskStatus.rankString}</b>
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title={<span style={{display: "flex", alignItems: "center"}}>
                                <img src={ASSET_HOMEWORK} height={18} alt="" style={{marginRight: "5px"}}/>
                                作业
                            </span>}>
                                <Row gutter={[16,16]}>
                                    <Col xs={24} lg={18}>
                                        <b>提交次数 ({homeworkStatus.count}/{homeworkStatus.total})</b>
                                        <Progress percent={homeworkStatus.percent} style={{flex:1}} />
                                    </Col>
                                    <Col xs={24} lg={6}>
                                        <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                                            <span>
                                                班级排名: <b>{homeworkStatus.rankString}</b>
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title={<span style={{display: "flex", alignItems: "center"}}>
                                <img src={ASSET_PRACTICE} height={18} alt="" style={{marginRight: "5px"}}/>
                                练习
                            </span>}>
                                <Row gutter={[16,16]}>
                                    <Col xs={24} lg={18}>
                                        <b>参与次数 ({practiceStatus.count}/{practiceStatus.total})</b>
                                        <Progress percent={practiceStatus.percent} style={{flex:1}} />
                                    </Col>
                                    <Col xs={24} lg={6}>
                                        <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                                            <span>
                                                班级排名: <b>{practiceStatus.rankString}</b>
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title={<span style={{display: "flex", alignItems: "center"}}>
                                <img src={ASSET_SIGNIN} height={18} alt="" style={{marginRight: "5px"}}/>
                                课堂活动
                            </span>}>
                                <Row gutter={[16,16]}>
                                    <Col xs={24} lg={18}>
                                        <b>参与次数 ({activityStatus.count}/{activityStatus.total})</b>
                                        <Progress percent={activityStatus.percent} style={{flex:1}} />
                                    </Col>
                                    <Col xs={24} lg={6}>
                                        <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                                            <span>
                                                班级排名: <b>{activityStatus.rankString}</b>
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Space>
            }
        </>
    );
}

const ClassInfoPage = ()=>{
    const params = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [infoData, setInfoData] = useState({});
    const [teacherData, setTeacherData] = useState([]);
    const [queryTeacher, setQueryTeacher] = useState("");   //TODO
    const [stuData, setStuData] = useState([]);
    const [queryStu, setQueryStu] = useState("");           //TODO
    const [pageStu, setPageStu] = useState(1);
    const [totalStu, setTotalStu] = useState(0);
    const fetchClassInfo = async()=>{
        setInfoData((await api.post('/tac/class/classInfo',{
            classId: params.classId,
        })).data);
        setLoading(false);
    }
    const fetchTeacherInfo = async()=>{
        let resp = await api.post('/tac/class/queryMember',{
            classId: params.classId,
            queryParam: queryTeacher,
            stuOrTeacher: 1
        });
        setTeacherData(resp.data);
    }
    const fetchStuInfo = async()=>{
        let resp = await api.post('/tac/class/queryMember/search',{
            classId: params.classId,
            pageNo: pageStu,
            pageSize: 10,
            queryParam: queryTeacher,
            stuOrTeacher: 0
        });
        setTotalStu(resp.data.total);
        setStuData(resp.data.list);
    }
    const dataInfo = [
        {
            label: "班课名称",
            data: infoData.className ?? ""
        },
        {
            label: "班课码",
            data: infoData.classCode ?? ""
        },
        {
            label: "任课教师",
            data: infoData.teacher ?? ""
        },
        {
            label: "班主任",
            data: infoData.assistant ?? []
        },
        {
            label: "助教",
            data: infoData.stuAssistant ?? []
        },
        {
            label: "学员人数",
            data: infoData.studentNum ?? 0
        },
        {
            label: "课程介绍",
            data: infoData.brief
        },
        {
            label: "教学目标",
            data: infoData.teachingAim
        },
        {
            label: "参考资料",
            data: infoData.referenceMaterial
        },
    ]
    useEffect(()=>{
        fetchClassInfo();
    },[]);
    useEffect(()=>{
        fetchTeacherInfo();
    },[queryTeacher]);
    useEffect(()=>{
        fetchStuInfo();
    },[queryStu,pageStu]);
    return (
        <>
            {contextHolder}
            <Row gutter={[12,12]}>
                {loading
                    ? <Spin/>
                    : <>
                        <Col lg={8} xs={24}>
                            <Card
                                title={
                                    <Space>
                                        <InfoCircleOutlined />
                                        班课信息
                                    </Space>
                                }
                                className="class-content-left-card"
                                style={{position: "sticky", top: 80}}
                            >
                                <Space direction="vertical" style={{ display: 'flex' }}>
                                    <img src={infoData.courseImage.includes("default-cropper") ? default_cropper : infoData.courseImage} width={180} alt={params.classId} style={{borderRadius: "8px"}} referrerPolicy={"no-referrer"} />
                                    {dataInfo.map((i)=>{
                                        if(i.data !== "" && i.data.length !== 0){
                                            return <Row gutter={15} align={"middle"}>
                                                <Col span={6} style={{textAlign: "right"}}>
                                                    <b>{i.label}:</b>
                                                </Col>
                                                <Col span={18}>
                                                    {Array.isArray(i.data) ? i.data.join("、") : i.data}
                                                    {i.label === "班课码"
                                                        ? <Button type={"primary"} size={"small"} style={{marginLeft: 5}} onClick={async()=>{
                                                            await navigator.clipboard.writeText(i.data)
                                                            messageApi.success("已复制")
                                                        }}>
                                                            <span color={"default"}>复制</span>
                                                        </Button>
                                                        : null}
                                                </Col>
                                            </Row>
                                        }
                                    })}
                                </Space>
                            </Card>
                        </Col>
                        <Col lg={16} xs={24}>
                            <Space direction="vertical" size={"large"} style={{ display: 'flex' }}>
                                <Card title={
                                    <Space>
                                        <ContactsOutlined />
                                        教学团队
                                    </Space>
                                }>
                                    <Table
                                        dataSource={
                                            teacherData.map((v)=>{
                                               return {
                                                   key: v.id,
                                                   nickname: v.nickname,
                                                   type: v.joinType === 1 ? "任课教师" : "班主任",
                                                   phone: v.phone,
                                               };
                                            })
                                        }
                                        columns={[
                                            {
                                                title: "姓名",
                                                dataIndex: "nickname",
                                                key: "nickname",
                                            },
                                            {
                                                title: "职位",
                                                dataIndex: "type",
                                                key: "type",
                                            },
                                            {
                                                title: "电话号码",
                                                dataIndex: "phone",
                                                key: "phone",
                                            }
                                        ]}
                                    />
                                </Card>
                                <Card title={
                                    <Space>
                                        <ReadOutlined />
                                        学生
                                    </Space>
                                }>
                                    <Table
                                        dataSource={stuData.map((v)=>{
                                            return {
                                                key: v.id,
                                                nickname: v.nickname,
                                                type: v.assistantFlag === 1
                                                        ? "助教"
                                                        : (v.expFlag === 1
                                                            ? "体验学员"
                                                            : (v.attendFlag === 1
                                                                ? "旁听"
                                                                : ""
                                                            )
                                                        ),
                                                phone: v.phone,
                                            };
                                        })}
                                        columns={[
                                            {
                                                title: "姓名",
                                                dataIndex: "nickname",
                                                key: "nickname",
                                            },
                                            {
                                                title: "类别",
                                                dataIndex: "type",
                                                key: "type",
                                            },
                                            {
                                                title: "电话号码",
                                                dataIndex: "phone",
                                                key: "phone",
                                            }
                                        ]}
                                        pagination={{
                                            total: totalStu,
                                            current: pageStu,
                                            defaultPageSize: 10,
                                            showSizeChanger: false,
                                            onChange: (page) => {
                                                setPageStu(page);
                                            }
                                        }}
                                    />
                                </Card>
                            </Space>
                        </Col>
                    </>
                }
            </Row>
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
    const isCoursewareRoute = useMatch({ path: '/class-detail/:classId/:courseId/courseware/', end: false });
    const isActivityRoute = useMatch({ path: '/class-detail/:classId/:courseId/activity/', end: false });
    const tab_items = [
        {
            key: "course",
            label: "课堂",
        },
        {
            key: "info",
            label: "简介",
        },
        {
            key: "statistic",
            label: "统计",
        },
    ]
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
    useEffect(() => {
        document.title = `${courseData.className ?? "加载中..."}-OtterStudy水獭习路`;
    }, [courseData]);
    return (
        <IndexFrame>
            {loading
                ? <Spin size="large">
                    <Alert message="加载中" type="info" />
                </Spin>
                : <div style={{rowGap: "16px", width: "100%", display: "flex", flexDirection: "column"}}>
                    <Card style={{textOverflow: "ellipsis", overflowX: "auto"}}>
                        <div style={{width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "row", height: "100%", alignItems: "center", flexWrap: "wrap"}}>
                            <div style={{height: "100%"}}>
                                <div style={{fontWeight: "bold", fontSize: "18px"}}>
                                    {courseData.className ?? "Default"} ({courseData.classCode ?? "00AA00"})
                                </div>
                                <div style={{fontSize: "15px"}}>
                                    任课教师: {courseData.teacher ?? "..."}
                                </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"right",height:"100%",paddingRight: "10px",paddingLeft: "10px"}}>
                                <Tabs
                                    className={"course_switch_tabs"}
                                    items={tab_items}
                                    tabBarGutter={40}
                                    activeKey={isCoursewareRoute || isActivityRoute ? "course" : location.pathname.split('/')[location.pathname.split('/').length - 1]}
                                    onTabClick={(key)=>{
                                        if(key === "course"){
                                            nav(`/class-detail/${params.classId}/${params.courseId}/courseware`);
                                        }else{
                                            nav(`/class-detail/${params.classId}/${params.courseId}/${key}`);
                                        }
                                    }}
                                />
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

export { ClassCourseWareActivityPage, ClassActivityPage, ClassInfoPage, ClassStatisticPage, ClassCourseWareDataContext };