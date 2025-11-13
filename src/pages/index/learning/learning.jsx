import {
  BookOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  ToTopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Input,
  Modal,
  message,
  Popconfirm,
  Popover,
  Row,
  Space,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import api from "@/api/api.jsx";
import { IndexFrame } from "@/pages/index/index.jsx";

import "./learning.css";

import { useNavigate } from "react-router-dom";
import default_cropper from "@/assets/default-cropper.png";

const ClassBigCard = ({ children }) => (
  <>
    <Card className="class_tiles">{children || <Spin />}</Card>
  </>
);

const ClassTilesPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [archiveVisible, setArchiveVisible] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [joinClassCode, setJoinClassCode] = useState("");
  const nav = useNavigate();
  const fetchClassList = async () => {
    const resp = await api.post("/tac/class/v1/stu/class", {
      name: searchQuery,
    });
    setClasses(resp.data);
  };

  const changeTopStatus = async (item) => {
    const resp = await api.put(`/tac/class/top/${item.id}`);
    await fetchClassList();
    messageApi.success(resp.data.message);
  };
  const changeArchiveStatus = async (item) => {
    const resp = await api.post("/tac/class/archives", {
      classId: item.id,
    });
    await fetchClassList();
    messageApi.success(resp.data.message);
  };
  const quitClass = async (item) => {
    const resp = await api.post("/tac/class/exitClass", {
      classId: item.id,
      courseId: item.id,
    });
    await fetchClassList();
    messageApi.success(resp.data.message);
  };

  const joinClass = async () => {
    api
      .get("/tac/class/getClassInfo/code", {
        params: {
          classCode: joinClassCode,
        },
      })
      .then(async (_) => {
        await api.post("/tac/class/join", {
          classCode: joinClassCode,
        });
        await fetchClassList();
        messageApi.success("添加成功");
      });
    setJoinClassCode("");
  };

  const openArchiveDrawer = () => {
    setArchiveVisible(true);
  };
  const closeArchiveDrawer = () => {
    fetchClassList();
    setArchiveVisible(false);
  };
  const openAddDialog = async () => {
    setAddDialogVisible(true);
  };
  useEffect(() => {
    fetchClassList();
  }, [searchQuery]);
  return (
    <>
      {contextHolder}
      <Space direction={"vertical"} size={"large"} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Space>
            {/* TODO 分页 */}
            <Input.Search
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={(v) => setSearchQuery(v)}
              placeholder="搜索班课名/任课教师"
            />
            <Button onClick={() => openArchiveDrawer()}>
              <span>归档管理</span>
            </Button>
            <Button onClick={() => openAddDialog()} type="primary">
              <span>加入班课</span>
            </Button>
          </Space>
        </div>
        <ClassBigCard>
          {classes.map((item, index) => (
            <Card title={item.category}>
              <Row gutter={[15, 15]}>
                {item.classResList.map((i, index) => (
                  <Col lg={8} xs={12}>
                    <Card
                      actions={[
                        <Popover content={"置顶"}>
                          <ToTopOutlined onClick={() => changeTopStatus(i)} />
                        </Popover>,
                        <Popover content={"归档"}>
                          <BookOutlined
                            onClick={() => changeArchiveStatus(i)}
                          />
                        </Popover>,
                        <Popconfirm
                          cancelText="手滑了"
                          description="确定要退出课程吗？"
                          okText="确认退课"
                          onCancel={() => {}}
                          onConfirm={() => {
                            quitClass(i);
                          }}
                          title="操作提醒"
                        >
                          <CloseCircleOutlined />
                        </Popconfirm>,
                      ]}
                      className="class_tiles_item"
                      cover={
                        <img
                          alt={i.className}
                          height={"140px"}
                          onClick={() => {
                            nav(`/class-detail/${i.id}/${i.courseId}`);
                          }}
                          referrerPolicy={"no-referrer"}
                          src={
                            i.imageUrl.includes("default-cropper")
                              ? default_cropper
                              : i.imageUrl
                          }
                          style={{ objectFit: "cover" }}
                        />
                      }
                      hoverable
                    >
                      <Card.Meta
                        description={
                          <div
                            onClick={() => {
                              nav(`/class-detail/${i.id}/${i.courseId}`);
                            }}
                            style={{ fontSize: "13px" }}
                          >
                            <div>任课教师: {i.creator}</div>
                            <div>课程码: {i.classCode}</div>
                          </div>
                        }
                        title={i.className}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          ))}
        </ClassBigCard>
      </Space>
      <Drawer
        classNames="classes_archives"
        onClose={() => closeArchiveDrawer()}
        open={archiveVisible}
        title="归档管理"
      >
        {archiveVisible ? <ArchiveManagePage /> : null}
      </Drawer>
      <Modal
        onCancel={() => setAddDialogVisible(false)}
        onOk={() => {
          joinClass().then(() => {
            setAddDialogVisible(false);
          });
        }}
        open={addDialogVisible}
        title="添加班课"
      >
        <Input
          maxLength={6}
          onChange={(v) => setJoinClassCode(v.target.value)}
          placeholder="请输入目标课程码"
          value={joinClassCode}
        />
      </Modal>
    </>
  );
};

const ArchiveManagePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchQuery, setSearchQuery] = useState("");
  const [archiveList, setArchiveList] = useState([]);
  const nav = useNavigate();
  const changeArchiveStatus = async (item) => {
    const resp = await api.post("/tac/class/archives", {
      classId: item.id,
    });
    messageApi.success("取消归档成功"); // 后端归档和取消归档都返回"归档成功"，难绷
    await fetchArchiveList();
  };
  const fetchArchiveList = async () => {
    const resp = await api.post("/tac/class/getArchivesClass", {
      classType: "", // 0普通班课 1公开课
      pageNum: 1, //todo 翻页
      pageSize: 100,
      query: "", //todo 搜索
    });
    setArchiveList(resp.data.list);
  };
  useEffect(() => {
    fetchArchiveList();
  }, [searchQuery]);
  return (
    <>
      {contextHolder}
      <div className="archive_manage_list">
        <div className="archive_manage_header">
          <Input.Search
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={(v) => setSearchQuery(v)}
            placeholder="搜索班课名/任课教师"
          />
        </div>
        {archiveList.length !== 0 ? (
          <Row gutter={[15, 15]}>
            {archiveList.map((item, index) => (
              <Col span={24}>
                <Card
                  actions={[
                    <Popover content={"归档"}>
                      <BookOutlined onClick={() => changeArchiveStatus(item)} />
                    </Popover>,
                    <Popover content={"查看"}>
                      <EyeOutlined
                        onClick={() => {
                          nav(`/class-detail/${item.id}/${item.courseId}`);
                        }}
                      />
                    </Popover>,
                  ]}
                  hoverable
                >
                  <Card.Meta
                    description={
                      <div>
                        任课教师: {item.creator}
                        <br />
                        类别: {item.type === 0 ? "普通班课" : "公开课"}
                      </div>
                    }
                    title={item.className}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};

const LearningIndexPage = () => (
  <>
    <IndexFrame showSider={true}>
      <ClassTilesPage />
    </IndexFrame>
  </>
);

export default LearningIndexPage;
