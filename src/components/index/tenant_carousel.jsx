import { Carousel } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/api/api.jsx";

export default function TenantCarousel() {
  const isLogined = useSelector((state) => state.user.isLogined);
  const [data, setData] = useState([]);
  const fetchCarouselData = async () => {
    const resp = await api.get("/tac/home-page/mngCarousels", {
      params: {
        exclusiveTenantId: "",
        // TODO 租户信息挂到参数上
      },
    });
    setData(resp.data);
  };
  const onclick = (i) => {
    if (data[i].resourceType === 3) {
      window.open(data[i].resourceValue, "_blank");
    }
  };
  useEffect(() => {
    fetchCarouselData();
  }, [isLogined]);
  return (
    <Carousel arrows autoplay={true} infinite={true}>
      {data.map((item, i) => (
        <img
          alt={item.title}
          onClick={() => onclick(i)}
          referrerPolicy="no-referrer"
          src={item.coverUrl}
        />
      ))}
    </Carousel>
  );
}
