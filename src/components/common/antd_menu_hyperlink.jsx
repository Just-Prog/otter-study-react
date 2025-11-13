const AntdMenuHyperLink = ({ children, onClick }) => (
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

export default AntdMenuHyperLink;
