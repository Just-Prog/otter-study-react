import { Card, List } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/api/api.jsx";

export default function IndexThreeNews() {
  const isLogined = useSelector((state) => state.user.isLogined);
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const resp = await api.get("/tac/home-page/three-news", {
      params: {
        exclusiveTenantId: "",
        // TODO 租户信息挂到参数上
      },
    });
    setData(resp.data);
  };
  useEffect(() => {
    fetchData();
  }, [isLogined]);
  return (
    <Card title={"资讯"}>
      <List
        dataSource={data}
        itemLayout="vertical"
        renderItem={(item, index) => (
          <List.Item
            extra={`${new Date(Number.parseInt(item.createdTime)).getFullYear()}-${new Date(Number.parseInt(item.createdTime)).getMonth() + 1}-${new Date(Number.parseInt(item.createdTime)).getDate()}`}
            key={index}
          >
            <a href={item.content} target={"_blank"}>
              {item.title}
            </a>
          </List.Item>
        )}
      />
    </Card>
  );
}
