
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomFields } from "@/hooks/useCustomFields";
import CustomFieldForm from "@/components/settings/CustomFieldForm";
import CustomFieldList from "@/components/settings/CustomFieldList";

const Settings = () => {
  const { customFields, addCustomField, updateCustomFields } = useCustomFields();

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-design-blue">Form Customization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <CustomFieldForm onAddField={addCustomField} />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Custom Fields</h3>
                
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
