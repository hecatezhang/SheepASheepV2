import { useState } from "react";

const Settings = () => {
  const [newServerURL, setNewServerURL] = useState(window.SERVER_URL);

  return (
    <div className="flex flex-col w-full items-center space-y-4 flex-grow bg-neutral rounded-lg">
      <div className="text-2xl text-center w-full py-8">设置</div>
      <div className="flex w-full">
        <div className="flex flex-col lg:flex-row w-full justify-center space-y-8 lg:space-y-0 lg:space-x-4">
          <div className="flex w-full justify-center items-center lg:w-auto">
            <label className="text-lg">后端地址：</label>
            <input
              className="w-60 rounded input input-bordered bg-white border-[#434c5e] focus:border-1 focus:outline-none focus:shadow-md focus:shadow-[#2e3440]"
              name="server_url_input"
              value={newServerURL}
              onChange={(e) => {
                setNewServerURL(e.target.value);
              }}
            />
          </div>
          <div className="flex w-full md:w-auto justify-center">
            <button
              className="btn bg-[#5e81ac]"
              type="button"
              onClick={() => {
                localStorage.setItem("server_url", newServerURL);
                alert("设置已保存，请刷新页面");
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
