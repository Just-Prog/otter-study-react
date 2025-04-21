import { Dropdown } from "antd";
import {useEffect, useState} from "react";

import api from "@/api/api";
import {useSelector} from "react-redux";

export default function TenantSwitcher(){
    const isLogined = useSelector(state => state.user.isLogined);
    const [tenants, setTenants] = useState([]);
    const [current, setCurrent] = useState("");
    const fetchTenantList = async () => {
        let resp = api.get('/uc/v1/users/tenants');
        setTenants(resp.data);
    }
    useEffect(() => {
        setCurrent(localStorage.getItem("tenant_target") || "");
        fetchTenantList();
    }, [isLogined]);
    return (
        <>
            <Dropdown menu={{ tenants }}>
                <div>{current}</div>
            </Dropdown>
        </>
    );
}