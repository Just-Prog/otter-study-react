import {Card, List} from "antd";
import {useEffect, useState} from "react";
import api from "@/api/api.jsx";
import {useSelector} from "react-redux";

export default function IndexNewsList(){
    const isLogined = useSelector(state => state.user.isLogined);
    const [data, setData] = useState([]);
    const fetchData = async() => {
        let resp = await api.get("/tac/home-page/news",{params: {
                exclusiveTenantId: "",
                pageNo: 1,
                pageSize: 15
            }});
        setData(resp.data.list);
    }
    useEffect(() => {
        fetchData();
        // TODO 分页/无限加载
    }, [isLogined]);
    return (
        <Card title={"资讯"}>
            <List
            itemLayout="vertical"
            dataSource={data}
            renderItem={(item, index) => (
                <List.Item key={index} title={item.name} extra={<img src={item.coverUrl} referrerPolicy={"no-referrer"} height={64} width={128}  alt={""}/>}>
                    <List.Item.Meta
                        title={<a href={item.content} target="_blank">{item.title}</a>}
                        description={`${new Date(Number.parseInt(item.createdTime)).getFullYear()}-${new Date(Number.parseInt(item.createdTime)).getMonth()+1}-${new Date(Number.parseInt(item.createdTime)).getDate()}`}
                        style={{
                            flexDirection: "row",
                        }}
                    />
                </List.Item>
            )}
            />
        </Card>
    );
}