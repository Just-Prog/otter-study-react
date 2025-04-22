import {Badge, Drawer} from "antd";
import {MessageOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import api from "@/api/api.jsx";

function MessageNotifyIcon({style}) {
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState(0);
    const fetchUnreadCount = () => {
        api.get('/tac/teaching-msg/v1/unread').then(_=>{
            setUnread(_.data)
        })
    }
    useEffect(() => {
        fetchUnreadCount();
    }, [open]);
    return (
      <div style={style}>
          <Badge count={unread} size="small">
              <MessageOutlined style={{fontSize: "120%"}} onClick={() => setOpen(true)}/>
          </Badge>
          <Drawer open={open} onClose={() => setOpen(false)}>
              {/*TODO 消息列表与详细信息*/}
          </Drawer>
      </div>
    );
}

export default MessageNotifyIcon;