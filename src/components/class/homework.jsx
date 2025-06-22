import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {Card, Col, List, Row, Space, Input, Modal, Button, Alert, Spin, Pagination, Upload, message} from "antd";
const { TextArea } = Input;
import api from "@/api/api";
import FileItem from "@/components/common/file_item.jsx";
import OBSUploader, {saveDoc} from "@/utils/obs_uploader.js";
import {ArrowLeftOutlined} from "@ant-design/icons";

const ClassHomeworkComponent = ()=>{
    const [messageApi, contextHolder] = message.useMessage();
    const params = useParams();
    const classId = params.classId;
    const dataId = params.actId;
    const [data,setData] = useState({});
    const [submitContent, setSubmitContent] = useState("");
    const [stuHomeworkFile, setStuHomeworkFile] = useState([]);
    const [stuUploadFile, setStuUploadFile] = useState([]);
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
    const submitStuHomework = async()=>{
        let resp = await api.post("/tac/homeworkStudent/submitHomeWork", {
            homeworkId: dataId,
            groupId: null,
            homeworkDocListReqList: stuHomeworkFile,
            submitContent: submitContent,
        });
        messageApi.success(resp.data.message);
        await fetchHomeWorkDet();
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
            {contextHolder}
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
                                        {data.resubmit && data.correctStatu === 0
                                            ? <Button onClick={()=>{
                                                let tmp = data;
                                                let origin = tmp.resubmit;
                                                delete(tmp.resubmit);
                                                setData({
                                                    ...tmp,
                                                    correctStatu: origin,
                                                });
                                                setSubmitContent(data.submitContent);
                                                setStuHomeworkFile(data.stuHomeworkDocListResList);
                                            }}>
                                                <ArrowLeftOutlined/>
                                            </Button>
                                            : null
                                        }
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
                                        ? <Alert type={"info"} message={"已提交未批改"} action={
                                            <Button size={"small"} type={"primary"} onClick={()=>{
                                                setData({
                                                    ...data,
                                                    correctStatu: 0,
                                                    resubmit: 1
                                                })
                                            }}>重新提交</Button>
                                        }/>
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
                            {data.correctStatu === 0
                                ? <>
                                    <Upload
                                        maxCount={1}
                                        fileList={stuUploadFile}
                                        onChange={(e)=>{
                                            if(e.file.status === 'done'){
                                                setStuUploadFile([]);
                                            }else{
                                                setStuUploadFile(e.fileList);
                                            }
                                        }}
                                        customRequest={(e)=>{
                                            let obs = new OBSUploader;
                                            obs.upload({
                                                file: e.file,
                                                onProgress: e.onProgress,
                                                onSuccess: async(res)=>{
                                                    let resp = await saveDoc({
                                                        docName: e.file.name,
                                                        pathKey: res.InterfaceResult.Key,
                                                        size: e.file.size
                                                    });
                                                    resp.data.docId = resp.data.id;
                                                    delete(resp.data.id)
                                                    setStuHomeworkFile([
                                                        ...stuHomeworkFile,
                                                        resp.data
                                                    ])
                                                    e.onSuccess();
                                                },
                                                onError: e.onError,
                                            });
                                        }}
                                    >
                                        <Button size={"small"}>上传附件</Button>
                                    </Upload>
                                </>
                                : null}
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
                            {
                                data.correctStatu === 0
                                    ? <div style={{display: "flex", justifyContent: "flex-end"}}>
                                        <Button size={"small"} type={"primary"} onClick={async()=>{
                                            if(submitContent !== "" || stuHomeworkFile.length !== 0){
                                                await submitStuHomework();
                                            }
                                        }}>提交</Button>
                                    </div>
                                    : null
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
                                    {item.homeworkDocListResList.length > 0
                                        ? <List
                                            dataSource={item.homeworkDocListResList}
                                            renderItem={(item) => (
                                                <FileItem filename={item.docName} ext={item.type} url={item.imgUrl} />
                                            )}
                                        />
                                        : null}
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