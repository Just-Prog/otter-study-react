import { MessageOutlined } from "@ant-design/icons";
import { Badge, Card, Col, Drawer, List, Row, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/api/api.jsx";
import EXAM_NOTICE from "@/assets/icons/message/icon-exam-notice.png";
import GOK_JOB from "@/assets/icons/message/icon-gok-job.png";
import INNER_PUSH from "@/assets/icons/message/icon-inner-push.png";
import PROJECT_HELPER from "@/assets/icons/message/icon-project-helper.png";
import PROJECT_PUSH from "@/assets/icons/message/icon-project-push.png";
import RECRUIT_INVITE from "@/assets/icons/message/icon-recruit-push.png";
import SYSTEM_NOTICE from "@/assets/icons/message/icon-system-notice.png";
import {
  activityDesc,
  fileExt2Icons,
} from "@/components/common/otter_common_define.js";

const msgType = {
  EXAM_NOTICE: {
    desc: "考试通知",
    icon: EXAM_NOTICE,
  },
  SYSTEM_NOTICE: {
    desc: "系统通知",
    icon: SYSTEM_NOTICE,
  },
  GOK_JOB: {
    desc: "国科就业",
    icon: GOK_JOB,
  },
  INNER_PUSH: {
    desc: "内推邀请",
    icon: INNER_PUSH,
  },
  PROJECT_HELPER: {
    desc: "项目助手",
    icon: PROJECT_HELPER,
  },
  PROJECT_PUSH: {
    desc: "项目推荐",
    icon: PROJECT_PUSH,
  },
  RECRUIT_INVITE: {
    desc: "校招邀请",
    icon: RECRUIT_INVITE,
  },
};

const iconBgColor = ["#3bdd97", "#9090ff", "#ff75af", "#ffb489"];

function MessageNotifyIcon({ style }) {
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [msgList, setMsgList] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [detailInfo, setDetailInfo] = useState({});
  const pageNum = useRef(0);
  const [unread, setUnread] = useState(0);
  const fetchUnreadCount = () => {
    api.get("/tac/teaching-msg/v1/unread").then((_) => {
      setUnread(_.data);
    });
  };
  const fetchMsgList = async () => {
    const resp = await api.get("/tac/teaching-msg/v1/tab");
    setMsgList(resp.data);
  };
  const nav = useNavigate();
  const fetchMsgDetail = async (item) => {
    try {
      pageNum.current++;
      const params = {
        pageSize: 15,
        pageNo: pageNum.current,
      };
      if (item.msgCategory !== "SYSTEM_NOTICE") {
        params.classId = item.classId;
      }
      const resp = await api.get(
        `/tac/teaching-msg/v1/category/${item.msgCategory}`,
        { params }
      );
      const resMapData = Object.entries(resp.data.resMap);
      const resMap = [];
      for (const [key, value] of resMapData) {
        resMap.push({
          date: key,
          data: value,
        });
      }
      setDetailList(resMap);
      setDetailInfo(item);
    } catch (e) {
      pageNum.current = 0;
    }
  };
  const handleMainOpen = async () => {
    await fetchMsgList();
    setOpen(true);
  };
  const handleMainClose = () => {
    setOpen(false);
    setTimeout(() => {
      setDetailList([]);
    }, 0);
  };
  const handleDetailOpen = async (item) => {
    await fetchMsgDetail(item);
    await fetchMsgList();
    setDetailOpen(true);
  };
  const handleDetailClose = () => {
    setDetailOpen(false);
    setTimeout(() => {
      setDetailList([]);
      setDetailInfo({});
      pageNum.current = 0;
    }, 0);
  };
  useEffect(() => {
    fetchUnreadCount();
  }, [open]);
  return (
    <div style={style}>
      <Badge count={unread} size="small">
        <MessageOutlined
          onClick={() => handleMainOpen()}
          style={{ fontSize: "120%" }}
        />
      </Badge>
      <Drawer
        onClose={() => handleMainClose()}
        open={open}
        title={"消息"}
        width={375}
      >
        <List
          dataSource={msgList}
          renderItem={(item, index) => (
            <List.Item>
              <Row
                align={"middle"}
                onClick={() => handleDetailOpen(item)}
                style={{ cursor: "pointer", width: "100%" }}
                wrap={false}
              >
                <Col
                  flex={"none"}
                  style={{
                    width: "42px",
                    height: "42px",
                    textAlign: "center",
                    lineHeight: "42px",
                    marginRight: "10px",
                    fontSize: "18px",
                    color: "#fff",
                  }}
                >
                  {item.msgCategory === "CLASS_NOTICE" ? (
                    <div
                      style={{
                        borderRadius: "50%",
                        backgroundColor: iconBgColor[index % 4],
                      }}
                    >
                      {item.className.charAt(0)}
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        background: `url(${msgType[item.msgCategory ?? "SYSTEM_NOTICE"].icon})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                      }}
                    />
                  )}
                </Col>
                <Col flex="auto">
                  <div
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                      fontSize: "15px",
                    }}
                  >
                    {item.msgCategory === "CLASS_NOTICE"
                      ? item.className
                      : item.title}
                  </div>
                  <div
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                    }}
                  >
                    {item.remark}
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                    }}
                  >
                    <div style={{ whiteSpace: "nowrap", fontSize: "12px" }}>
                      {item.timeTxt}
                    </div>
                    <Badge count={item.unreadNum} />
                  </div>
                </Col>
              </Row>
            </List.Item>
          )}
        />
        <Drawer
          onClose={() => handleDetailClose()}
          open={detailOpen}
          title={
            detailInfo.msgCategory === "CLASS_NOTICE" ? (
              <>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    fontSize: "18px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span>{detailInfo.className}</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    fontSize: "13px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    color: "#fc996e",
                  }}
                >
                  @{detailInfo.tenantName}
                </div>
              </>
            ) : (
              <div>
                {" "}
                {msgType[detailInfo.msgCategory ?? "SYSTEM_NOTICE"].desc ??
                  ""}{" "}
              </div>
            )
          }
          width={375}
        >
          <List
            dataSource={detailList}
            renderItem={(item, index) => (
              <List.Item>
                <Space
                  direction={"vertical"}
                  size={"large"}
                  style={{ width: "100%", margin: "15px 0" }}
                >
                  <div style={{ textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "14px",
                        textAlign: "center",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        background: "#ddd",
                        color: "#fff",
                      }}
                    >
                      {item.date}
                    </span>
                  </div>
                  {item.data.map((item, index) => (
                    <Card
                      onClick={() => {
                        if (item.type !== -1) {
                          if (item.type === 5 || item.type === 12) {
                            nav(
                              `/class-detail/${item.classId}/${item.courseId}/courseware/${item.contentId}`
                            );
                          } else {
                            nav(
                              `/class-detail/${item.classId}/${item.courseId}/activity/${item.contentId}`
                            );
                          }
                          handleDetailClose();
                          handleMainClose();
                        }
                      }}
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <img
                            height={24}
                            src={
                              item.type !== -1
                                ? item.type !== 5
                                  ? activityDesc[item.type].icon
                                  : fileExt2Icons(item.typeStr)
                                : (msgType[
                                    detailInfo.msgCategory ?? "SYSTEM_NOTICE"
                                  ].icon ?? "")
                            }
                            style={{ marginRight: "10px" }}
                          />
                          <span>
                            {item.type !== -1
                              ? activityDesc[item.type].name
                              : item.title}
                          </span>
                        </div>
                      }
                    >
                      <span style={{ fontSize: "13px" }}>
                        {item.remark !== "" ? item.remark : item.contentName}
                      </span>
                    </Card>
                  ))}
                </Space>
              </List.Item>
            )}
          />
        </Drawer>
      </Drawer>
    </div>
  );
}

export default MessageNotifyIcon;
