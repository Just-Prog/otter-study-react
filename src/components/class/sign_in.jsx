import { useParams } from "react-router";
import {Card, Pagination, Space, Table} from "antd";
import {useContext, useEffect, useState} from "react";
import api from "@/api/api.jsx";
import {ClassCourseWareDataContext} from "@/pages/class/class_detail.jsx";

import SIGN_SUCCESS from "@/assets/sign/sign-success.png";
import SIGN_FAILED from "@/assets/sign/sign-fail.png";

const absenceDesc = {
  EL: "早退",
  LT: "迟到",
  IL: "病假",
  PL: "事假",
  AB: "缺勤"
}

const ClassSignInComponent = () => {
  const params = useParams();
  const dataContext = useContext(ClassCourseWareDataContext);
  const dataContextData = dataContext.current;
  const [pageNo, setPageNo] = useState(1);
  const pageLimit = 10;
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const fetchData = async () => {
    let resp = await api.get(`/tac/signs/${params.classId}`, {
      params: {
        pageNo: pageNo,
        pageSize: pageLimit,
      },
    });
    setData(resp.data.list);
    setTotal(resp.data.total);
  };
  const onChange = (page, pageSize) => {
    setPageNo(page);
  };
  const dataSource = data.map((item) => {
    return {
      key: item.signId,
      date: item.yearStr,
      week: item.weekStr,
      sign_type: item.signTypeStr,
      sign_time: item.signTimeStr,
      sign_status: item.signStatus,
      sign_status_str: item.signTypeOrSignPlace,
      absence_type: item.absenceType,
    };
  });
  const columns = [
    {
      title: "签到时间",
      dataIndex: "date",
    },
    {
      title: "签到星期",
      dataIndex: "week",
    },
    {
      title: "签到类别",
      dataIndex: "sign_type",
    },
    {
      title: "签到区间",
      dataIndex: "sign_time",
    },
    {
      title: "签到状态",
      dataIndex: "sign_status",
      render: (value, record, index) => {
        return (
          <>
            {record.sign_status !== 2 ? (
              <span> {record.sign_status_str} </span>
            ) : (
              <span style={{ color: "red" }}>
                {" "}
                {record.absence_type !== "" ? record.absence_type : "缺勤"}{" "}
              </span>
            )}
          </>
        );
      },
    },
  ];
  useEffect(() => {
    fetchData();
  }, [pageNo]);
  return (
    <>
      <Card
        style={{ minHeight: "65vh", overflowY: "auto" }}
        styles={{
          body: { display: "flex", flexDirection: "column", maxHeight: "100%" },
        }}
      >
        <div style={{marginBottom: "15px",width: "100%",textAlign: "center"}}>
          <Space direction={"vertical"} style={{display: "flex"}}>
            <img src={dataContextData.isParted === "1" ? SIGN_SUCCESS : SIGN_FAILED} height={"225px"}/>
            {dataContextData.isParted === "1"
                ? <span>您已签到</span>
                : <span style={{color: "red"}}>
                  未签到，原因：{absenceDesc[dataContextData.absenceType !== "" ? dataContextData.absenceType : "AB"]}
                </span>
            }
          </Space>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          style={{ width: "100%", flex: 1 }}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <div style={{ color: "#ccc", fontSize: "12px" }}>
            Web端仅支持记录查询，实际签到操作请前往OtterStudy App
          </div>
          <Pagination current={pageNo} onChange={onChange} total={total} />
        </div>
      </Card>
    </>
  );
};

export default ClassSignInComponent;
