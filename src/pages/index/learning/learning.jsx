import { IndexFrame } from "@/pages/index/index.jsx";
import {Button, Card, Col, Empty, Popover, Row, Space, Tabs} from "antd";
import {useEffect, useState} from "react";

import api from "@/api/api.jsx";

import "./learning.css"

import default_cropper from "@/assets/default-cropper.png"
import {BookOutlined, CloseCircleOutlined, ToTopOutlined} from "@ant-design/icons";

const ClassBigCard = ({children}) => {
    return (
        <>
            <Card className="class_tiles">
                {children || <Empty style={{minHeight: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}/>}
            </Card>
        </>
    )
}

const ClassTilesPage = () => {
    const [classes, setClasses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const fetchClassList = async () => {
        let resp = await api.post("/tac/class/v1/stu/class",{
            name: searchQuery
        });
        setClasses(resp.data);
    }
    useEffect(() => {
        fetchClassList();
    },[searchQuery])
    return (
        <>
            <ClassBigCard>
                {classes.map((item, index) => <Card title={item.category}>
                    <Row gutter={[15, 15]}>
                        {item.classResList.map(
                            (i, index) => <Col xs={12} lg={8}>
                                <Card
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
                                            <ToTopOutlined />
                                        </Popover>,
                                        //TODO 取消置顶
                                        <Popover content={"归档"}>
                                            <BookOutlined />
                                        </Popover>,
                                        <Popover content={"退课"}>
                                            <CloseCircleOutlined />
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
        </>
    );
}

const ClassOperations = () => {
    return (
        <>
            <Space>
                <Button>
                    <span>
                        归档管理
                    </span>
                </Button>
                <Button type="primary">
                    <span>
                        加入班课
                    </span>
                </Button>
            </Space>
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
                    defaultActiveKey="1"
                    items={items}
                    tabBarExtraContent={ClassOperations()}
                />
            </IndexFrame>
        </>
    );
}

export default LearningIndexPage;