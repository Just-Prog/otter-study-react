import {useEffect, useState} from 'react'
import { Carousel } from 'antd'

import api from '@/api/api.jsx'

export default function TenantCarousel(){
    const [data, setData] = useState([]);
    const fetchCarouselData = async() => {
        let resp = await api.get("/tac/home-page/mngCarousels",{params: {
                exclusiveTenantId: ""
            }});
        setData(resp.data);
    }
    useEffect(() => {
        fetchCarouselData();
    },[])
    return (
        <Carousel autoplay={true}>
            {data.map((item, i) => <img alt={item.title} src={item.coverUrl} referrerPolicy="no-referrer" />)}
        </Carousel>
    );
}