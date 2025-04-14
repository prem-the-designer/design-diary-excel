
import { useState, useEffect, useCallback } from "react";
import { CustomField } from "@/types/customField";

export function useCustomFields() {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Load custom fields from localStorage
  useEffect(() => {
    const savedFields = localStorage.getItem("designTaskCustomFields");
    if (savedFields) {
      try {
        setCustomFields(JSON.parse(savedFields));
      } catch (error) {
        console.error("Error loading custom fields:", error);
      }
    }
  }, []);

  // Save fields to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("designTaskCustomFields", JSON.stringify(customFields));
  }, [customFields]);

  const addCustomField = (field: CustomField) => {
    // Set the order to be the last in the list
    const fieldToAdd = {
      ...field,
      order: customFields.length,
    };
    setCustomFields([...customFields, fieldToAdd]);
  };

  const updateCustomFields = (fields: CustomField[]) => {
    setCustomFields(fields);
  };

  const initializeDefaultFields = useCallback((defaultFields: CustomField[]) => {
    setCustomFields(defaultFields);
  }, []);

  return {
    customFields,
    addCustomField,
    updateCustomFields,
    initializeDefaultFields,
  };
}
