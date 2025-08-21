import { useDiagram } from "../../../hooks";
import RelationshipCard from "./RelationshipCard";
import EditRelationshipModal from "./EditRelationshipModal";
import { useMemo, useState } from "react";
import TableHeader from "../TableHeader";

export default function RelationshipsTab({ tableId, readOnly, tableName }) {
  const { relationships } = useDiagram();
  const [editingRelationship, setEditingRelationship] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredRelationship = useMemo(
    () =>
      relationships.filter(
        (r) => r.startTableId === tableId || r.endTableId === tableId,
      ),
    [tableId, relationships],
  );

  const handleEditRelationship = (relationship) => {
    setEditingRelationship(relationship);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingRelationship(null);
  };

  return (
    <>
      <TableHeader
        tableName={tableName}
        tableId={tableId}
        readOnly={readOnly}
      />

      <div className="space-y-0">
        {filteredRelationship.map((r) => (
          <div key={"relationship_" + r.id}>
            <RelationshipCard
              data={r}
              onEdit={handleEditRelationship}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>

      <EditRelationshipModal
        visible={modalVisible}
        onCancel={handleCloseModal}
        relationshipData={editingRelationship}
      />
    </>
  );
}
