import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/api/api";
import { switchTenant } from "@/stores/user";

export default function TenantSwitcher({ isMenu = false }) {
  const isLogined = useSelector((state) => state.user.isLogined);
  const [tenants, setTenants] = useState([]);
  const current = useSelector(
    (state) => state.user.info?.tenants[0]?.tenantName ?? "未选取租户"
  );
  const dispatch = useDispatch();
  const fetchTenantList = async () => {
    const resp = await api.get("/uc/v1/users/tenants");
    setTenants(resp.data);
  };
  const items = tenants.map((i) => ({
    key: i.tenantId,
    label: <div>{i.tenantName}</div>,
  }));
  const menuProps = {
    items,
    onClick: (e) => {
      dispatch(switchTenant(e.key));
    },
  };
  useEffect(() => {
    fetchTenantList();
  }, [isLogined]);
  if (isMenu) {
    return (
      <Menu items={items} onClick={menuProps.onClick} selectable={false} />
    );
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography.Text ellipsis={true}>{current}</Typography.Text>
      <Dropdown menu={menuProps}>
        <CaretDownOutlined />
      </Dropdown>
    </div>
  );
}
