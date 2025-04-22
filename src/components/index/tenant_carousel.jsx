import {useEffect, useState} from 'react'
import { Carousel } from 'antd'

import api from '@/api/api.jsx'
import {useSelector} from "react-redux";

export default function TenantCarousel(){
    const isLogined = useSelector(state => state.user.isLogined);
    const [data, setData] = useState([]);
    const fetchCarouselData = async() => {
        let resp = await api.get("/tac/home-page/mngCarousels",{params: {
                exclusiveTenantId: ""
                // TODO 租户信息挂到参数上
            }});
        setData(resp.data);
    }
    const onclick = (i) => {
        if(data[i].resourceType === 3){
            window.open(data[i].resourceValue, "_blank")
        }
    }
    useEffect(() => {
        fetchCarouselData();
    },[isLogined])
    return (
        <Carousel autoplay={true} arrows infinite={true}>
            {data.map((item, i) => <img alt={item.title} src={item.coverUrl} onClick={()=>onclick(i)} referrerPolicy="no-referrer" />)}
        </Carousel>
    );
}