const MessageCard = ({ type, msg }) => {
  return (
    <>
      {type === "error" ? (
        <div className="text-error">{msg}</div>
      ) : (
        <div className="text-[#8fbcbb]">{msg}</div>
      )}
    </>
  );
};

export default MessageCard;
