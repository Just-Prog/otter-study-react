import { IndexFrame } from "@/pages/index/index.jsx";
import {Button, Card, Col, Drawer, Empty, message, Modal, Popover, Row, Space, Spin, Tabs, Input} from "antd";
import {BookOutlined, CloseCircleOutlined, EyeOutlined, SearchOutlined, ToTopOutlined} from "@ant-design/icons";

import {useEffect, useState} from "react";

import api from "@/api/api.jsx";

import "./learning.css"

import default_cropper from "@/assets/default-cropper.png"

const ClassBigCard = ({children}) => {
    return (
        <>
            <Card className="class_tiles">
                {children || <Spin/>}
            </Card>
        </>
    )
}

const ClassTilesPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [classes, setClasses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [archiveVisible, setArchiveVisible] = useState(false);
    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const [joinClassCode, setJoinClassCode] = useState("");
    const fetchClassList = async () => {
        let resp = await api.post("/tac/class/v1/stu/class",{
            name: searchQuery
        });
        setClasses(resp.data);
    }

    const changeTopStatus = async (item) => {
        let resp = await api.put(`/tac/class/top/${item.id}`);
        await fetchClassList();
        messageApi.success(resp.data.message);
    }
    const changeArchiveStatus = async (item) => {
        let resp = await api.post("/tac/class/archives",{
            classId: item.id,
        });
        await fetchClassList();
        messageApi.success(resp.data.message);
    }
    const quitClass = async (item) => {
        let resp = await api.post("/tac/class/exitClass",{
            classId: item.id,
            courseId: item.id
        });
        await fetchClassList();
        messageApi.success(resp.data.message);
    }

    const joinClass = async () => {
        api.get('/tac/class/getClassInfo/code',{params: {
            classCode: joinClassCode
        }}).then(async(_)=>{
            await api.post("/tac/class/join",{
                classCode: joinClassCode
            });
            await fetchClassList();
            messageApi.success("添加成功");
        });
        setJoinClassCode("");
    }

    const openArchiveDrawer = ()=>{
        setArchiveVisible(true);
    }
    const closeArchiveDrawer = () => {
        fetchClassList();
        setArchiveVisible(false);
    }
    const openAddDialog = async()=>{
        setAddDialogVisible(true);
    }
    useEffect(() => {
        fetchClassList();
    },[searchQuery])
    return (
        <>
            {contextHolder}
            <ClassBigCard>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <Space>
                        { /* TODO 分页 */}
                        <Input.Search
                            placeholder="搜索班课名/任课教师"
                            allowClear
                            enterButton={<SearchOutlined/>}
                            onSearch={(v)=>setSearchQuery(v)}
                        />
                        <Button onClick={() => openArchiveDrawer()}>
                            <span>
                                归档管理
                            </span>
                        </Button>
                        <Button type="primary" onClick={() => openAddDialog()}>
                            <span>
                                加入班课
                            </span>
                        </Button>
                    </Space>
                </div>
                {classes.map((item, index) => <Card title={item.category}>
                    <Row gutter={[15, 15]}>
                        {item.classResList.map(
                            (i, index) => <Col xs={12} lg={8}>
                                <Card
                                    hoverable
                                    className="class_tiles_item"
                                    cover={
                                        <img
                                            src={i.imageUrl.includes("default-cropper") ? default_cropper : i.imageUrl}
                                            referrerPolicy={"no-referrer"}
                                            height={"140px"}
                                            style={{objectFit: 'cover'}}
                                            alt={i.className}
                                        />
                                    }
                                    actions={[
                                        <Popover content={"置顶"}>
                                            <ToTopOutlined onClick={() => changeTopStatus(i)}/>
                                        </Popover>,
                                        <Popover content={"归档"}>
                                            <BookOutlined onClick={() => changeArchiveStatus(i)}/>
                                        </Popover>,
                                        <Popover content={"退课"}>
                                            <CloseCircleOutlined onClick={() => quitClass(i)}/>
                                        </Popover>,
                                    ]}
                                >
                                    <Card.Meta
                                        title={i.className}
                                        description={<div style={{fontSize: "13px"}}>
                                            <div>任课教师: {i.creator}</div>
                                            <div>课程码: {i.classCode}</div>
                                        </div>}
                                    />
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Card>)}
            </ClassBigCard>
            <Drawer title="归档管理" open={archiveVisible} onClose={() => closeArchiveDrawer()}
                    classNames="classes_archives">
                {archiveVisible ? <ArchiveManagePage/> : null}
            </Drawer>
            <Modal title="添加班课" open={addDialogVisible} onCancel={() => setAddDialogVisible(false)} onOk={() => {
                joinClass().then(()=>{
                    setAddDialogVisible(false);
                })
            }}>
                <Input placeholder="请输入目标课程码" maxLength={6} value={joinClassCode} onChange={(v)=>setJoinClassCode(v.target.value)}/>
            </Modal>
        </>
    );
}

const ArchiveManagePage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [searchQuery, setSearchQuery] = useState("");
    const [archiveList, setArchiveList] = useState([]);
    const changeArchiveStatus = async (item) => {
        let resp = await api.post("/tac/class/archives",{
            classId: item.id,
        });
        messageApi.success("取消归档成功"); // 后端归档和取消归档都返回"归档成功"，难绷
        await fetchArchiveList();
    }
    const fetchArchiveList = async () => {
        let resp = await api.post("/tac/class/getArchivesClass",{
            classType: "", // 0普通班课 1公开课
            pageNum: 1, //todo 翻页
            pageSize: 100,
            query: "" //todo 搜索
        });
        setArchiveList(resp.data.list);
    }
    useEffect(() => {
        fetchArchiveList()
    }, [searchQuery]);
    return (
        <>
            {contextHolder}
            <div className="archive_manage_list">
                <div className="archive_manage_header">
                    <Input.Search
                        placeholder="搜索班课名/任课教师"
                        allowClear
                        enterButton={<SearchOutlined/>}
                        onSearch={(v)=>setSearchQuery(v)}
                    />
                </div>
                {archiveList.length !== 0 ? <Row gutter={[15, 15]}>
                    {archiveList.map((item, index) => {
                        return (
                            <Col span={24}>
                                <Card
                                    hoverable
                                    actions={[
                                        <Popover content={"归档"}>
                                            <BookOutlined onClick={() => changeArchiveStatus(item)}/>
                                        </Popover>,
                                        <Popover content={"查看"}>
                                            <EyeOutlined onClick={() => {}}/>
                                        </Popover>
                                    ]}
                                >
                                    <Card.Meta
                                        title={item.className}
                                        description={<div>
                                            任课教师: {item.creator}<br/>
                                            类别: {item.type === 0 ? "普通班课" : "公开课"}
                                        </div>}
                                    />
                                </Card>
                            </Col>
                        )
                    })}
                </Row> : <Empty/>}
            </div>
        </>
    );
}

const LearningIndexPage = () => {
    const items = [
        {
            label: '课程',
            key: 'classes',
            children: <ClassTilesPage/>
        },
        {
            label: '成长',
            key: 'growing',
            children: <ClassBigCard>
                TODO
            </ClassBigCard>,
        },
    ];
    return (
        <>
            <IndexFrame>
                <Tabs
                    defaultActiveKey="classes"
                    items={items}
                />
            </IndexFrame>
        </>
    );
}

export default LearningIndexPage;