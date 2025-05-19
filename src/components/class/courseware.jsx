import {useContext, useEffect, useState} from "react";
import api from "@/api/api.jsx";
import {Button, Card, Space, Spin} from "antd";
import {ClassCourseWareDataContext} from "@/pages/class/class_detail.jsx";
import {getReadableFileSizeString} from "@/utils/file_size.js";
import {fileExt2Icons} from "@/components/common/otter_common_define.js";
import DPlayer from 'dplayer';
import Hls from "hls.js";

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
    const [vidInfo, setvidInfo] = useState({
        videoKey: "",
        address: "",
        coverAddress: ""
    });
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const fetchPreview = async() => {
        if(typeof(data?.type) === "undefined" || data?.type === 12){
            return;
        }
        let resp = await api.get(`/tc/doc/preview/${data.docId}`)
        setPreview(resp.data.pathKey);
    }
    const downloadCourseware = async() => {
        let a = document.createElement("a");
        a.href = data?.imageUrl;
        a.download = data?.name ?? `download.${data.typeStr}`;
        a.referrerPolicy = "no-referrer";
        a.click();
    }
    const fetchVideoInfo = async() => {
        let resp = await api.get(`/tc/vod/videoAddress/${data.videoKey}`);
        setvidInfo(resp.data);
        setIsVideoLoading(false);
        return resp.data;
    }
    let Player = null;
    useEffect(()=>{
        if(data.type === 5){
            fetchPreview();
        }else if(data.type === 12){
            fetchVideoInfo().then(r => {
                setTimeout(()=>{
                    Player = new DPlayer({
                        container: document.querySelector("#otterstudy_dp"),
                        video: {
                            url: r.address,
                            type: 'customHls',
                            customType: {
                                customHls: function (video, player) {
                                    const hls = new Hls({});
                                    let src = video.src.includes("vod.goktech.cn") && import.meta.env.DEV
                                        ? video.src.replace("vod.goktech.cn/", "/vod/").replace("https://","")
                                        : video.src
                                    console.log(src)
                                    hls.loadSource(src);
                                    hls.attachMedia(video);
                                },
                            },
                        },
                    });
                },600);
            });
        }
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
                {data.size < 104857600 && data.type === 5
                    ? <iframe src={data.typeStr !== "pdf" ? preview : data.imageUrl} width={"100%"} height={"100%"} style={{border: "none"}} referrerPolicy={"no-referrer"}
                              allowFullScreen allow="clipboard-read; clipboard-write"/>
                    : (data.type === 12
                        ? (isVideoLoading
                            ? <Spin/>
                            : <div id="otterstudy_dp" style={{height:'100%',width: '100%'}}/>
                        )
                        : <div>Unsupported</div>
                    )
                }
            </Card>
        </>
    );
}

export default ClassCoursewareResPage;