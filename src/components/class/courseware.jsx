import {useContext, useEffect, useState} from "react";
import api from "@/api/api.jsx";
import {Button, Card, Space} from "antd";
import {ClassCourseWareDataContext} from "@/pages/class/class_detail.jsx";
import {getReadableFileSizeString} from "@/utils/file_size.js";
import {fileExt2Icons} from "@/components/common/otter_common_define.js";

const ClassCoursewareResPage = ()=>{
    const context = useContext(ClassCourseWareDataContext);
    const data = context.current;
    const publishTime = new Date(Number.parseInt(data.publishTime ?? 0));
    const formatter = new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const [preview, setPreview] = useState("");
    const fetchPreview = async() => {
        if(typeof(data?.type) === "undefined" || data?.type === 12){
            return;
        }
        let resp = await api.get(`/tc/doc/preview/${data.docId}`)
        setPreview(resp.data.pathKey);
    }
    const downloadCourseware = async() => {
        var a = document.createElement("a");
        a.href = data?.imageUrl;
        a.download = data?.name;
        a.target = "_blank";
        a.referrerPolicy = "no-referrer";
        a.click();
    }
    useEffect(()=>{
        fetchPreview();
    },[data?.dataId])
    return (
        <>
            <Card styles={{body:{display: "flex", flexDirection: "row", alignItems: "center"}}}>
                <div style={{marginRight: 8}}>
                    <img src={fileExt2Icons(data.typeStr)} width={"40"}/>
                </div>
                <Space styles={{item: {width: "100%"}}} style={{width:'100%'}}>
                    <div style={{display: "flex", justifyContent: "space-between",flexDirection: "row",alignItems: "center",width:"100%"}}>
                        <Space direction={"vertical"} align={"start"}>
                            <span style={{fontSize: "18px", fontWeight: "bold"}}>{data.name}</span>
                            <div>
                                <span style={{marginRight: "8px"}}>发布时间: {`${formatter.format(publishTime)}`}</span>
                                <span>文件大小: {getReadableFileSizeString(data.size)}</span>
                            </div>
                        </Space>
                        <Button type="primary" onClick={()=>downloadCourseware()}>
                            <span>下载</span>
                        </Button>
                    </div>
                </Space>
            </Card>
            <Card style={{marginTop: 16, height: "65vh"}} styles={{body: {height: "100%"}}}>
                {data.size < 104857600 && data.type !== 12
                    ? <iframe src={preview} width={"100%"} height={"100%"} style={{border: "none"}}
                              allowFullScreen allow="clipboard-read; clipboard-write"/>
                    : <div>预览不可用</div>
                }
            </Card>
        </>
    );
}

export default ClassCoursewareResPage;