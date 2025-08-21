import { Input, Modal } from "@douyinfe/semi-ui";
import { useTranslation } from "react-i18next";
import CodeEditor from "../../CodeEditor";

export default function ExportModal({
  visible,
  setModal,
  title,
  exportData,
  setExportData,
}) {
  const { t, i18n } = useTranslation();

  const getModalOnOk = async () => {
    const blob = new Blob([exportData.data], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportData.filename}.${exportData.extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getModalBody = () => {
    return (
      <>
        <CodeEditor
          height={360}
          value={exportData.data}
          language="json"
          options={{ readOnly: true }}
        />
        <div className="text-sm font-semibold mt-2">{t("filename")}:</div>
        <Input
          value={exportData.filename}
          placeholder={t("filename")}
          suffix={<div className="p-2">{`.${exportData.extension}`}</div>}
          onChange={(value) =>
            setExportData((prev) => ({ ...prev, filename: value }))
          }
          field="filename"
        />
      </>
    );
  };

  return (
    <Modal
      title={i18n.t("export")}
      visible={visible}
      onOk={getModalOnOk}
      afterClose={() => {
        setExportData(() => ({
          data: "",
          extension: "",
          filename: `${title}_${new Date().toISOString()}`,
        }));
      }}
      onCancel={() => {
        setModal(false);
      }}
      centered
      closeOnEsc={true}
      okText={i18n.t("export")}
      okButtonProps={{
        disabled: !exportData.data,
      }}
      hasCancel={true}
      cancelText={t("cancel")}
      width={740}
      bodyStyle={{
        maxHeight: window.innerHeight - 280,
        overflow: "hidden",
        direction: "ltr",
      }}
    >
      {getModalBody()}
    </Modal>
  );
}
