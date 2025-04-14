
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomFields } from "@/hooks/useCustomFields";
import CustomFieldForm from "@/components/settings/CustomFieldForm";
import CustomFieldList from "@/components/settings/CustomFieldList";
import { taskTypes } from "@/types/task";
import { CustomField } from "@/types/customField";

const Settings = () => {
  const { customFields, addCustomField, updateCustomFields, initializeDefaultFields } = useCustomFields();

  // Initialize default fields if none exist
  useEffect(() => {
    if (customFields.length === 0) {
      const defaultFields: CustomField[] = [
        {
          id: "default-date",
          name: "Date",
          type: "date",
          required: true,
          order: 0,
        },
        {
          id: "default-project",
          name: "Project Name",
          type: "text",
          required: true,
          order: 1,
        },
        {
          id: "default-taskName",
          name: "Task Name",
          type: "text",
          required: true,
          order: 2,
        },
        {
          id: "default-taskType",
          name: "Task Type",
          type: "dropdown",
          required: true,
          options: taskTypes,
          order: 3,
        },
        {
          id: "default-timeSpent",
          name: "Time Spent",
          type: "number",
          required: true,
          order: 4,
        },
        {
          id: "default-notes",
          name: "Notes",
          type: "textarea",
          required: false,
          order: 5,
        },
      ];
      
      initializeDefaultFields(defaultFields);
    }
  }, [customFields.length, initializeDefaultFields]);

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-design-blue">Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <CustomFieldForm onAddField={addCustomField} />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Fields</h3>
                
                <CustomFieldList 
                  customFields={customFields}
                  onUpdateFields={updateCustomFields}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
