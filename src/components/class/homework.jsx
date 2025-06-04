import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {Card, Col, List, Row, Space, Input} from "antd";
const { TextArea } = Input;
import api from "@/api/api";
import FileItem from "@/components/common/file_item.jsx";

const ClassHomeworkComponent = ()=>{
    const params = useParams();
    const classId = params.classId;
    const dataId = params.actId;
    const [data,setData] = useState({});
    const formatter = new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
    const fetchHomeWorkDet = async()=>{
        let resp = await api.post("/tac/homeworkStudent/getHomeWorkDet",{
            homeworkId: dataId,
            classId: classId,
        });
        setData(resp.data);
    }
    useEffect(()=>{
        fetchHomeWorkDet();
    },[dataId])
    return (
        <>
            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    <Card title={"作业内容"}>
                        <Space direction={"vertical"} style={{display: "flex"}}>
                            <Card style={{backgroundColor:"#eeeeee"}}>
                                {data.introduction ?? ""}
                            </Card>
                            {data.homeworkDocListResList && data.homeworkDocListResList.length > 0
                                ? <Card>
                                    <List
                                        dataSource={data.homeworkDocListResList}
                                        renderItem={(item) => (
                                            <FileItem filename={item.docName} ext={item.type} url={item.imgUrl} />
                                        )}
                                    />
                                </Card>
                                : <></>
                            }
                        </Space>
                    </Card>
                </Col>
                <Col lg={12} xs={24}>
                    <Card title={"交作业"}>
                        <Space direction={"vertical"} style={{display: "flex"}}>
                            <TextArea
                                placeholder="请输入你的观点……"
                                autoSize={{ minRows: 3, maxRows: 6 }}
                            />
                            {data.homeworkDocListResList && data.stuHomeworkDocListResList.length > 0
                                ? <Card>
                                    <List
                                        dataSource={data.stuHomeworkDocListResList}
                                        renderItem={(item) => (
                                            <FileItem filename={item.docName} ext={item.type} url={item.imgUrl} />
                                        )}
                                    />
                                </Card>
                                : <></>
                            }
                        </Space>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ClassHomeworkComponent;