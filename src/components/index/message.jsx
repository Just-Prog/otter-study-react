import {Badge, Button, Col, Drawer, List, Row} from "antd";
import {MessageOutlined} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import api from "@/api/api.jsx";

import EXAM_NOTICE from "@/assets/icons/message/icon-exam-notice.png";
import SYSTEM_NOTICE from "@/assets/icons/message/icon-system-notice.png";
import GOK_JOB from "@/assets/icons/message/icon-gok-job.png";
import INNER_PUSH from "@/assets/icons/message/icon-inner-push.png";
import PROJECT_HELPER from "@/assets/icons/message/icon-project-helper.png";
import PROJECT_PUSH from "@/assets/icons/message/icon-project-push.png";
import RECRUIT_INVITE from "@/assets/icons/message/icon-recruit-push.png";

const msgTypeIcon = {
    EXAM_NOTICE: EXAM_NOTICE,
    SYSTEM_NOTICE: SYSTEM_NOTICE,
    GOK_JOB: GOK_JOB,
    INNER_PUSH: INNER_PUSH,
    PROJECT_HELPER: PROJECT_HELPER,
    PROJECT_PUSH: PROJECT_PUSH,
    RECRUIT_INVITE: RECRUIT_INVITE
};

const iconBgColor = [
    "#3bdd97",
    "#9090ff",
    "#ff75af",
    "#ffb489"
]

function MessageNotifyIcon({style}) {
    const [open, setOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [msgList, setMsgList] = useState([]);
    const [detailList, setDetailList] = useState([]);
    const pageNum = useRef(0);
    const [unread, setUnread] = useState(0);
    const fetchUnreadCount = () => {
        api.get('/tac/teaching-msg/v1/unread').then(_=>{
            setUnread(_.data)
        })
    }
    const fetchMsgList = async () => {
        let resp = await api.get('/tac/teaching-msg/v1/tab');
        setMsgList(resp.data);
    }
    const fetchMsgDetail = async (item) => {
        pageNum.current ++;
        let params = {
            pageSize: 15,
            pageNo: pageNum.current,
        };
        if(item.msgCategory !== "SYSTEM_NOTICE"){
            params.classId = item.classId;
        }
        let resp = await api.get(`/tac/teaching-msg/v1/category/${item.msgCategory}`, {params: params});
        console.log(resp.data);
    }
    const handleMainOpen = async () => {
        await fetchMsgList();
        setOpen(true);
    }
    const handleMainClose = () => {
        setOpen(false);
        setDetailList([]);
        pageNum.current = 0;
    }
    const handleDetailOpen = async (item) => {
        await fetchMsgDetail(item);
        setDetailOpen(true);
    }
    const handleDetailClose = () => {
        setDetailOpen(false);
    }
    useEffect(() => {
        fetchUnreadCount();
    }, [open]);
    return (
      <div style={style}>
          <Badge count={unread} size="small">
              <MessageOutlined style={{fontSize: "120%"}} onClick={() => handleMainOpen()}/>
          </Badge>
          <Drawer open={open} onClose={() => handleMainClose()} title={"消息"} width={375}>
              <List dataSource={msgList} renderItem={(item, index) => (<List.Item>
                  <Row wrap={false} align={"middle"} style={{cursor: "pointer", width: "100%"}} onClick={() => handleDetailOpen(item)}>
                      <Col flex={"none"} style={{width: "42px", height: "42px", textAlign: "center", lineHeight: "42px", marginRight: "10px", fontSize: "18px", color: "#fff"}}>
                          { item.msgCategory === "CLASS_NOTICE"
                              ? <div style={{borderRadius: "50%", backgroundColor: iconBgColor[ index % 4 ]}}>
                                  {item.className.charAt(0)}
                                </div>
                              : <div style={{height:'100%',width:'100%',background: `url(${msgTypeIcon[item.msgCategory]})`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "contain"}}/>
                          }
                      </Col>
                      <Col flex="auto">
                          <div style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontWeight: 600, fontSize: "15px", }}>
                              {item.msgCategory === "CLASS_NOTICE" ? item.className : item.title}
                          </div>
                          <div style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontSize: "13px"}}>
                              {item.remark}
                          </div>
                      </Col>
                  </Row>
              </List.Item>)}/>
              <Drawer open={detailOpen} onClose={() => handleDetailClose()} title={"<UNK>"} width={375}>
                  111222
              </Drawer>
          </Drawer>
      </div>
    );
}

export default MessageNotifyIcon;