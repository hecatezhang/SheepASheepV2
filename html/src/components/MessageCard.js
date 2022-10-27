const MessageCard = ({ type, msg }) => {
  return (
    <>
      {type === "error" ? (
        <div className="text-error">{msg}</div>
      ) : (
        <div className="text-[#5E81AC]">{msg}</div>
      )}
    </>
  );
};

export default MessageCard;
