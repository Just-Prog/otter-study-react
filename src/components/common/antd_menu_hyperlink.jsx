const AntdMenuHyperLink = ({children, onClick}) => {
  return (
    <>
      <a
        onClick={(e) => {
          e.preventDefault;
          onClick();
        }}
      >
        <div>{children}</div>
      </a>
    </>
  );
};

export default AntdMenuHyperLink