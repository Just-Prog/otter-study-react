function MiddleCard(props) {
  return (
    <div
      className="middle_card_frame"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.child}
    </div>
  );
}

export default MiddleCard;
