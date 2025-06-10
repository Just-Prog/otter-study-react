import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {Card, Col, List, Row, Space, Input, Modal, Button, Alert, Spin, Pagination} from "antd";
const { TextArea } = Input;
import api from "@/api/api";
import FileItem from "@/components/common/file_item.jsx";

const ClassHomeworkComponent = ()=>{
    const params = useParams();
    const classId = params.classId;
    const dataId = params.actId;
    const [data,setData] = useState({});
    const [submitContent, setSubmitContent] = useState("");
    const [stuHomeworkFile, setStuHomeworkFile] = useState([]);
    const [historyItems, setHistoryItems] = useState([]);
    const [historyProps, setHistoryProps] = useState({
        no: 1,
        size: 10,
    });
    const [historyVisible, setHistoryVisible] = useState(false);
    const handleHistoryOpen = () => {
        setHistoryVisible(true);
        fetchHomeworkHistory();
    }
    const handleHistoryClose = () => {
        setHistoryProps({
            no: 1,
            size: 10,
        });
        setHistoryVisible(false);
        setHistoryItems([]);
    }
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
        setSubmitContent(resp.data.submitContent);
        setStuHomeworkFile(resp.data.stuHomeworkDocListResList);
    }
    const fetchHomeworkHistory = async()=>{
        let resp = await api.post("/tac/homeworkStudent/getHistoryVesion",{
            homeworkId: dataId,
            classId: classId,
            groupId: null,
            pageNo: historyProps.no,
            pageSize: historyProps.size,
        });
        setHistoryItems(resp.data.list);
    }
    useEffect(()=>{
        fetchHomeWorkDet();
    },[dataId])
    useEffect(() => {
        if(historyVisible){
            fetchHomeworkHistory();
        }
    }, [historyProps]);
    return (
        <>
            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    <Card
                        title={"作业内容"}
                    >
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
                    <Card title={
                        <>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <Space direction={"horizontal"} align={"center"}>
                                        <span>
                                            {data.overFlag && data.activeFlag === 1 ? "补交" : "交作业"}
                                        </span>
                                        {data.correctStatu !== 0
                                            ? <span style={{fontSize: "13px"}}>
                                        {formatter.format(new Date(Number.parseInt(data.submitTime ?? "0")))}
                                    </span>
                                            : null}
                                    </Space>
                                </div>
                                {data.correctStatu !== 0
                                    ? <Button type={"primary"} onClick={()=>{
                                        handleHistoryOpen();
                                    }}>历史版本</Button>
                                    : <>
                                        {data.overFlag && data.activeFlag === 1 ? <span style={{fontSize: "13px"}}>活动已结束，可补交一次</span> : null}
                                    </>}
                            </div>
                        </>
                    }>
                        <Space direction={"vertical"} style={{display: "flex"}}>
                            {data.correctStatu !== 0
                                ? <>
                                    {data.correctStatu === 1
                                        ? <Alert type={"info"} message={"已提交未批改"}/>
                                        : <Alert type={"success"} message={`成绩: ${data?.homeworkScore}`}/>}
                                </>
                                : null}
                            <TextArea
                                value={submitContent}
                                onChange={(e) => setSubmitContent(e.target.value)}
                                disabled={data.correctStatu !== 0}
                                placeholder="请输入你的观点……"
                                autoSize={{ minRows: 3, maxRows: 6 }}
                            />
                            {stuHomeworkFile && stuHomeworkFile.length > 0
                                ? <Card>
                                    <List
                                        dataSource={stuHomeworkFile}
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
            <Modal
                title={"历史版本"}
                destroyOnHidden={true}
                open={historyVisible}
                onCancel={handleHistoryClose}
                footer={null}
            >
                {
                    historyItems.length > 0
                        ? <List
                            dataSource={historyItems}
                            renderItem={(item) => (<List.Item>
                                <Card style={{width: "100%"}} title={`${item.name} ${formatter.format(new Date(Number.parseInt(item.submitTime)))}`}>
                                    <span>{item.submitContent}</span>
                                    <List
                                        dataSource={item.homeworkDocListResList}
                                        renderItem={(item) => (
                                            <FileItem filename={item.docName} ext={item.type} url={item.imgUrl} />
                                        )}
                                    />
                                </Card>
                            </List.Item>)}
                        />
                        : <Spin/>
                }
                <Pagination align={"end"} current={historyProps.no} pageSize={historyProps.size} onChange={(no,size)=>{
                    setHistoryProps({
                        no: no,
                        size: size,
                    });
                }}/>
            </Modal>
        </>
    )
}

export default ClassHomeworkComponent;