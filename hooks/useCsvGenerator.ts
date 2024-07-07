// src/hooks/useCsvGenerator.ts
import { useState, useEffect } from "react";
import { DataItem } from "@/types/types";
import { sanitizeJsonInput, parseJson } from '@/utils/sanitizeJson';

export const useCsvGenerator = (initialData: DataItem[] = []) => {
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [filename, setFilename] = useState<string>("");
    const [inputData, setInputData] = useState<DataItem[]>(initialData);
    const [inputText, setInputText] = useState<string>("");
    const [fieldOptions, setFieldOptions] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
  
    useEffect(() => {
      setSelectedFields((currentFields) =>
        currentFields.filter((field) => fieldOptions.includes(field))
      );
    }, [fieldOptions]);
  
    const handleCheckedChange = (checked: boolean, field: string) => {
      setSelectedFields((fields) =>
        checked ? [...fields, field] : fields.filter((f) => f !== field)
      );
    };
  
    const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputText(event.target.value);
      setErrorMessage("");
    };
  
    const sanitizeInput = () => {
      setErrorMessage("");
      try {
        const sanitizedJson = sanitizeJsonInput(inputText);
        setInputText(sanitizedJson);
  
        const jsonData = parseJson(sanitizedJson);
        setInputData(jsonData);
        extractFieldsFromData(jsonData);
      } catch (error) {
        setErrorMessage((error as Error).message);
      }
    };
  
    const clearInput = () => {
      setInputText("");
      setInputData([]);
      setFieldOptions([]);
      setSelectedFields([]);
      setErrorMessage("");
    };
  
    const loadSampleData = () => {
      const sampleData = JSON.stringify(
        [
          { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", isActive: true },
          { id: 2, name: "Bob Smith", email: "bob.smith@example.com", isActive: false },
          { id: 3, name: "Carol White", email: "carol.white@example.com", isActive: true },
          { id: 4, name: "Dave Brown", email: "dave.brown@example.com", isActive: false },
        ],
        null,
        2
      );
      setInputText(sampleData);
    };
  
    const extractFieldsFromData = (data: DataItem[]) => {
      const allFields = new Set<string>();
      data.forEach((item) => {
        Object.keys(item).forEach((key) => allFields.add(key));
      });
      setFieldOptions(Array.from(allFields));
      setSelectedFields(Array.from(allFields));
    };
  
    const downloadCSV = (Papa: any) => {
      const csv = Papa.unparse({
        fields: selectedFields,
        data: inputData.map((item) =>
          selectedFields.reduce((obj: { [key: string]: any }, field) => {
            obj[field] = item[field];
            return obj;
          }, {})
        ),
      });
  
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    return {
      selectedFields,
      filename,
      inputData,
      inputText,
      fieldOptions,
      errorMessage,
      setFilename,
      handleCheckedChange,
      handleTextInput,
      sanitizeInput,
      clearInput,
      loadSampleData,
      downloadCSV,
    };
  };
  