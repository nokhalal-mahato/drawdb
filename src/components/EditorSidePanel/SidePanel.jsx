import { useState } from "react";
import { Tab } from "../../data/constants";
import { useTranslation } from "react-i18next";
import RelationshipsTab from "./RelationshipsTab/RelationshipsTab";
import TablesTab from "./TablesTab/TablesTab";
import TabBar from "../TabBar";

export default function SidePanel({ tableData, readOnly }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(Tab.TABLES);

  const tabs = [
    {
      label: t("tables"),
      id: Tab.TABLES,
    },
    {
      label: t("relationships"),
      id: Tab.RELATIONSHIPS,
    },
  ];

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-full">
        <div className="h-full flex-1 overflow-y-auto">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="!p-0 !border-0 mb-3"
            wrapperClassName="border border-gray-200 p-1"
            buttonClassName="!w-[122px] !h-[40px] !rounded-lg"
            activeButtonClassName="!bg-blue-100 !text-blue-700"
          />
          {activeTab === Tab.TABLES && (
            <TablesTab data={tableData} readOnly={readOnly} />
          )}
          {activeTab === Tab.RELATIONSHIPS && (
            <RelationshipsTab
              tableId={tableData.id}
              readOnly={readOnly}
              tableName={tableData.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
