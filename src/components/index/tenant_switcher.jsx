import {Dropdown, Menu, Typography} from "antd";
import { useEffect, useState } from "react";

import api from "@/api/api";
import { useDispatch, useSelector } from "react-redux";
import { CaretDownOutlined } from "@ant-design/icons";
import { switchTenant } from "@/stores/user"

export default function TenantSwitcher({ isMenu = false }){
    const isLogined = useSelector(state => state.user.isLogined);
    const [tenants, setTenants] = useState([]);
    const current = useSelector(state => state.user.info?.tenants[0]?.tenantName ?? "未选取租户")
    const dispatch = useDispatch();
    const fetchTenantList = async () => {
        let resp = await api.get('/uc/v1/users/tenants');
        setTenants(resp.data);
    }
    let items = tenants.map(i=>{
        return {
          key: i.tenantId,
          label: <div>{i.tenantName}</div>,
        };
    });
    let menuProps = {
        items: items,
        onClick: (e)=>{
            dispatch(switchTenant(e.key));
        },
    };
    useEffect(() => {
        fetchTenantList();
    }, [isLogined]);
    if(isMenu){
        return <Menu items={items} selectable={false} onClick={menuProps.onClick} />;
    }
    return (
        <div style={{width: "100%",display: "flex", justifyContent: "space-between"}}>
            <Typography.Text ellipsis={true}>{current}</Typography.Text>
            <Dropdown menu={menuProps}>
                <CaretDownOutlined />
            </Dropdown>
        </div>
    );
}