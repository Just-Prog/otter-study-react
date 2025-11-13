import { Button, Card, Col, List, Radio, Row, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import api from "@/api/api.jsx";
import {
  activityDesc,
  classTypeDesc,
  fileExt2Icons,
} from "@/components/common/otter_common_define.js";

import "./css/stu_activities.css";
import { useNavigate } from "react-router-dom";

function RecentContent() {
  const nav = useNavigate();
  const [content, setContent] = useState({ recentFlag: false });
  const [recentListRes, setRecentListRes] = useState([]);
  const fetchData = async () => {
    const res = await api.get("/tac/home-page/recent-content");
    setContent(res.data);
    setRecentListRes(res.data.dynamicRecentListResList);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Card title={"最近访问"}>
      <Space
        direction="vertical"
        style={{ display: "flex", width: "100%", maxWidth: "100%" }}
      >
        {content.recentFlag ? (
          <div
            style={{
              backgroundColor: "#f6f9ff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              padding: "12px",
            }}
          >
            <img
              height={20}
              src={fileExt2Icons(content.typeStr)}
              style={{ marginRight: "10px" }}
            />
            <span style={{ flex: 1 }}>{content.dataName ?? "未知文件名"}</span>
            <Button
              onClick={() => {
                nav(
                  `/class-detail/${content.classId}/${content.courseId}/courseware/${content.dataId}`
                );
              }}
              type="primary"
            >
              继续学习
            </Button>
          </div>
        ) : null}
        <Row gutter={[8, 4]}>
          {recentListRes.map((item, index) => (
            <Col
              className="stu_content_item"
              onClick={() => {
                nav(
                  `/class-detail/${item.recordId}/${item.courseId}/courseware`
                );
              }}
              span={"12"}
              style={{ height: "36px", display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  margin: "7px 7px",
                  padding: "3px",
                  borderRadius: "7px",
                  border: "#fc996e solid 1px",
                  fontSize: "12px",
                  color: "#fc996e",
                }}
              >
                {classTypeDesc[item.recordType]}
              </span>
              <span
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {item.recordName}
              </span>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );
}

// TODO 无限翻页处理
function CourseActivity() {
  const nav = useNavigate();
  const [content, setContent] = useState([]);
  const [isActivityClosed, setIsActivityClosed] = useState(false);
  const fetchData = async () => {
    const res = await api.get(
      `/tac/home-page/activity/${isActivityClosed ? "over" : "started"}`
    );
    setContent(res.data.list);
  };
  useEffect(() => {
    fetchData();
  }, [isActivityClosed]);
  return (
    <Card
      extra={
        <Radio.Group
          buttonStyle={"solid"}
          defaultValue={"ing"}
          onChange={() => {
            setIsActivityClosed(!isActivityClosed);
          }}
        >
          <Radio.Button value={"ing"}>进行中</Radio.Button>
          <Radio.Button value={"end"}>已结束</Radio.Button>
        </Radio.Group>
      }
      title={"课内活动"}
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <List
          dataSource={content}
          renderItem={(item, index) => {
            return (
              <List.Item
                className="stu_content_item"
                key={index}
                onClick={() => {
                  nav(
                    `/class-detail/${item.classId}/${item.courseId}/activity/${item.sourceId}`
                  );
                }}
              >
                <Row gutter={5} style={{ width: "100%", lineHeight: "20px" }}>
                  <Col span={14}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      <img
                        height={20}
                        src={activityDesc[item.type].icon}
                        style={{
                          marginRight: 10,
                          marginTop: "auto",
                          marginBottom: "auto",
                        }}
                      />
                      <Typography.Text ellipsis={true}>
                        {item.sourceName}
                      </Typography.Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Typography.Text ellipsis={true}>
                      {item.courseName}
                    </Typography.Text>
                  </Col>
                  {/* TODO isparted类型适配 */}
                  {/*<Col span={2}>*/}
                  {/*    <Typography.Text ellipsis={true}>*/}
                  {/*        {item.isParted}*/}
                  {/*    </Typography.Text>*/}
                  {/*</Col>*/}
                </Row>
              </List.Item>
            );
          }}
        />
      </div>
    </Card>
  );
}

function CoursewareList() {
  const nav = useNavigate();
  const [content, setContent] = useState([]);
  const [isRecentUpload, setIsRecentUpload] = useState(true);
  const fetchRecentUploadData = async () => {
    const res = await api.get("/tac/home-page/course-medium", {
      params: {
        pageNo: 1,
        pageSize: 15,
      },
    });
    setContent(res.data.list);
  };
  const fetchRecentBrowseData = async () => {
    const res = await api.get("/tac/home-page/recent-browsing", {
      params: {
        pageNo: 1, //TODO
        pageSize: 15,
      },
    });
    setContent(res.data);
  };
  const fetchData = async () => {
    isRecentUpload
      ? await fetchRecentUploadData()
      : await fetchRecentBrowseData();
  };
  useEffect(() => {
    fetchData();
  }, [isRecentUpload]);
  return (
    <Card
      extra={
        <Radio.Group
          buttonStyle={"solid"}
          defaultValue={"recentpub"}
          onChange={() => {
            setIsRecentUpload(!isRecentUpload);
          }}
        >
          <Radio.Button value={"recentpub"}>最近发布</Radio.Button>
          <Radio.Button value={"recentbrowse"}>最近浏览</Radio.Button>
        </Radio.Group>
      }
      title={"课件"}
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <List
          dataSource={content}
          renderItem={(item, index) => (
            <List.Item
              className="stu_content_item"
              key={index}
              onClick={() => {
                nav(
                  `/class-detail/${item.classId}/${item.courseId}/courseware/${item.sourceId}`
                );
              }}
            >
              <Row gutter={15} style={{ width: "100%", lineHeight: "20px" }}>
                <Col span={10}>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <img
                      height={20}
                      src={
                        item.type === 5
                          ? fileExt2Icons(item.typeStr)
                          : activityDesc[item.type].icon
                      }
                      style={{
                        marginRight: 10,
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    />
                    <Typography.Text ellipsis={true}>
                      {item.sourceName}
                    </Typography.Text>
                  </div>
                </Col>
                <Col span={8}>
                  <Typography.Text ellipsis={true}>
                    {item.courseName}
                  </Typography.Text>
                </Col>
                <Col span={6}>
                  <Typography.Text ellipsis={true}>
                    {`${new Date(Number.parseInt(item.publishTime)).getFullYear()}年${new Date(Number.parseInt(item.publishTime)).getMonth() + 1}月${new Date(Number.parseInt(item.publishTime)).getDate()}日`}
                  </Typography.Text>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
}

export { RecentContent, CourseActivity, CoursewareList };
