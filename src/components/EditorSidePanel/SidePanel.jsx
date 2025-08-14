import { useMemo } from "react";
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { Tab } from "../../data/constants";
import { useSelect, useDiagram, useEnums, useTypes } from "../../hooks";
import { useTranslation } from "react-i18next";
import RelationshipsTab from "./RelationshipsTab/RelationshipsTab";
import TypesTab from "./TypesTab/TypesTab";
import TablesTab from "./TablesTab/TablesTab";
import { databases } from "../../data/databases";
import EnumsTab from "./EnumsTab/EnumsTab";
import { isRtl } from "../../i18n/utils/rtl";
import i18n from "../../i18n/i18n";
import DBMLEditor from "./DBMLEditor";

export default function SidePanel({ width, resize, setResize }) {
  const { selectedElement, setSelectedElement } = useSelect();
  const { database, tablesCount, relationshipsCount } = useDiagram();
  const { typesCount } = useTypes();
  const { enumsCount } = useEnums();
  const { t } = useTranslation();

  const tabList = useMemo(() => {
    const tabs = [
      {
        tab: `${t("tables")} (${tablesCount})`,
        itemKey: Tab.TABLES,
        component: <TablesTab />,
      },
      {
        tab: `${t("relationships")} (${relationshipsCount})`,
        itemKey: Tab.RELATIONSHIPS,
        component: <RelationshipsTab />,
      },
      {
        tab: `${t("dbml")}`,
        itemKey: Tab.DBML,
        component: <DBMLEditor />,
      },
    ];

    if (databases[database].hasTypes) {
      tabs.push({
        tab: `${t("types")} (${typesCount})`,
        itemKey: Tab.TYPES,
        component: <TypesTab />,
      });
    }

    if (databases[database].hasEnums) {
      tabs.push({
        tab: `${t("enums")} (${enumsCount})`,
        itemKey: Tab.ENUMS,
        component: <EnumsTab />,
      });
    }

    return isRtl(i18n.language) ? tabs.reverse() : tabs;
  }, [t, database, tablesCount, relationshipsCount, typesCount, enumsCount]);

  return (
    <div className="flex h-full">
      <div
        className="flex flex-col h-full relative border-r border-color"
        style={{ width: `${width}px` }}
      >
        <div className="h-full flex-1 overflow-y-auto">
          {
            <Tabs
              type="card"
              activeKey={selectedElement.currentTab}
              lazyRender
              keepDOM={false}
              onChange={(key) =>
                setSelectedElement((prev) => ({ ...prev, currentTab: key }))
              }
              collapsible
              tabBarStyle={{ direction: "ltr" }}
            >
              {tabList.length &&
                tabList.map((tab) => (
                  <TabPane
                    tab={tab.tab}
                    itemKey={tab.itemKey}
                    key={tab.itemKey}
                  >
                    <div className="p-2">{tab.component}</div>
                  </TabPane>
                ))}
            </Tabs>
          }
        </div>
      </div>
      <div
        className={`flex justify-center items-center p-1 h-auto hover-2 cursor-col-resize ${
          resize && "bg-semi-grey-2"
        }`}
        onPointerDown={(e) => e.isPrimary && setResize(true)}
      >
        <div className="w-1 border-x border-color h-1/6" />
      </div>
    </div>
  );
}
