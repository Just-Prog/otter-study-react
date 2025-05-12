import { useParams } from "react-router";
import { Card, Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import api from "@/api/api.jsx";

const ClassSignInComponent = () => {
  const params = useParams();
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
