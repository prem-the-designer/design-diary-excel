
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomField } from "@/types/customField";
import { useFieldEditing } from "./useFieldEditing";
import DisplayFieldRow from "./DisplayFieldRow";
import EditingFieldRow from "./EditingFieldRow";
import EmptyFieldList from "./EmptyFieldList";

interface CustomFieldListProps {
  customFields: CustomField[];
  onUpdateFields: (fields: CustomField[]) => void;
}

const CustomFieldList: React.FC<CustomFieldListProps> = ({ 
  customFields, 
  onUpdateFields 
}) => {
  const {
    editingField,
    handleDeleteField,
    moveField,
    startEditing,
    cancelEditing,
    updateEditingField,
    saveEditing
  } = useFieldEditing(customFields, onUpdateFields);

  if (customFields.length === 0) {
    return <EmptyFieldList />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customFields.map((field, index) => (
            <TableRow key={field.id}>
              {editingField && editingField.id === field.id ? (
                <EditingFieldRow 
                  editingField={editingField}
                  onFieldChange={updateEditingField}
                  onSave={saveEditing}
                  onCancel={cancelEditing}
                />
              ) : (
                <DisplayFieldRow
                  field={field}
                  index={index}
                  totalFields={customFields.length}
                  onEdit={() => startEditing(field)}
                  onDelete={() => handleDeleteField(field.id)}
                  onMove={(direction) => moveField(index, direction)}
                />
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomFieldList;
