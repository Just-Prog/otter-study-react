import { Avatar } from "antd";
import { useSelector } from "react-redux";

const PersonalInfoEditor = () => {
  const info = useSelector((state) => state.user.info);
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          size={128}
          src={
            <img
              referrerPolicy={"no-referrer"}
              src={info.av ?? default_avatar}
            />
          }
        />
      </div>
    </div>
  );
};

export default PersonalInfoEditor;
