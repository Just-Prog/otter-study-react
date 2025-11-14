import { Card, List } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/api/api.jsx";

export default function IndexNewsList() {
  const isLogined = useSelector((state) => state.user.isLogined);
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const resp = await api.get("/tac/home-page/news", {
      params: {
        exclusiveTenantId: "",
        pageNo: 1,
        pageSize: 15,
      },
    });
    setData(resp.data.list);
  };
  useEffect(() => {
    fetchData();
    // TODO 分页/无限加载
  }, [isLogined]);
  return (
    <Card title={"资讯"}>
      <List
        dataSource={data}
        itemLayout="vertical"
        renderItem={(item, index) => (
          <List.Item
            extra={
              item.coverUrl !== "" && (
                <img
                  alt={""}
                  height={64}
                  referrerPolicy={"no-referrer"}
                  src={item.coverUrl}
                  width={128}
                />
              )
            }
            key={index}
            title={item.name}
          >
            <List.Item.Meta
              description={`${new Date(Number.parseInt(item.createdTime)).getFullYear()}-${new Date(Number.parseInt(item.createdTime)).getMonth() + 1}-${new Date(Number.parseInt(item.createdTime)).getDate()}`}
              style={{
                flexDirection: "row",
              }}
              title={
                <a href={item.content} target="_blank">
                  {item.title}
                </a>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
