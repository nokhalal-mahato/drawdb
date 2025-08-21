import { useState } from "react";
import { Modal, Input } from "@douyinfe/semi-ui";
import { CloseIcon } from "../../../icons";
import CommonButton from "../../CommonButton";

export default function AddTableModal({ visible, onCancel, onConfirm }) {
  const [tableName, setTableName] = useState("");

  const handleSubmit = () => {
    if (tableName.trim()) {
      onConfirm(tableName.trim());
      setTableName("");
    }
  };

  const handleCancel = () => {
    setTableName("");
    onCancel();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      closable={false}
      footer={null}
      width={551}
      bodyStyle={{
        padding: 0,
        borderRadius: "16px",
        margin: "auto 0px",
      }}
      style={{
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
      centered
      closeOnEsc={true}
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-slate-700 leading-10">
            Add New Table
          </h2>
          <CommonButton
            leftIcon={<CloseIcon />}
            variant="default"
            size="medium"
            className="min-w-6 min-h-6 !p-0"
            onClick={handleCancel}
          />
        </div>

        <div className="flex flex-col space-y-2 mb-6">
          <label className="text-sm leading-6 font-medium text-slate-700 opacity-80">
            Table Name
          </label>
          <Input
            value={tableName}
            onChange={(value) => setTableName(value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter table name"
            style={{
              height: "48px",
              borderRadius: "12px",
              borderColor: "#2563EB",
              padding: "12px 4px",
              lineHeight: "24px",
            }}
            inputStyle={{
              height: "24px",
            }}
            autoFocus
          />
        </div>
        <div className="flex justify-end items-center gap-2">
          <CommonButton
            onClick={handleCancel}
            variant="secondary"
            className="border-slate-300 border-solid"
            text={"Cancel"}
          />
          <CommonButton
            onClick={handleSubmit}
            variant="primary"
            disabled={!tableName.trim()}
            text={"Save Changes"}
          />
        </div>
      </div>
    </Modal>
  );
}
