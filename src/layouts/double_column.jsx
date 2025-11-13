import { Col, Row } from "antd";

import "./double_column.css";

function RightCardMain(props) {
  return (
    <>
      <div className="right_card">{props.child}</div>
    </>
  );
}

function DoubleColumn(props) {
  return (
    <div className="double_column_frame">
      <Row className="double_column_content">
        <Col lg={10} md={0} />
        <Col style={{ flex: 1 }}>
          <RightCardMain child={props.child} />
        </Col>
      </Row>
    </div>
  );
}

export default DoubleColumn;
