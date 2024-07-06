"use client";

import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DataItem {
  [key: string]: any;
}

interface CsvGeneratorProps {
  initialData?: DataItem[]; // Optional initial data
}

const CsvGenerator: React.FC<CsvGeneratorProps> = ({ initialData = [] }) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filename, setFilename] = useState<string>("");
  const [inputData, setInputData] = useState<DataItem[]>(initialData);
  const [inputText, setInputText] = useState<string>("");
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);

  useEffect(() => {
    // Update the selected fields any time the field options change
    setSelectedFields((currentFields) =>
      currentFields.filter((field) => fieldOptions.includes(field))
    );
  }, [fieldOptions]);

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedFields((currentFields) =>
      event.target.checked
        ? [...currentFields, value]
        : currentFields.filter((field) => field !== value)
    );
  };

  const handleCheckedChange = (checked: boolean, field: string) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      setSelectedFields(selectedFields.filter(f => f !== field));
    }
  };

  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const sanitizeInput = () => {
    // Remove unnecessary trailing commas and trim whitespace
    const sanitizedText = inputText
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .trim();
    setInputText(sanitizedText);
    processInputData(sanitizedText);
  };

  const clearInput = () => {
    setInputText("");
    setInputData([]);
    setFieldOptions([]);
    setSelectedFields([]);
  };

  const loadSampleData = () => {
    const sampleData = JSON.stringify(
      [
        {
          id: 1,
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          isActive: true,
        },
        {
          id: 2,
          name: "Bob Smith",
          email: "bob.smith@example.com",
          isActive: false,
        },
        {
          id: 3,
          name: "Carol White",
          email: "carol.white@example.com",
          isActive: true,
        },
        {
          id: 4,
          name: "Dave Brown",
          email: "dave.brown@example.com",
          isActive: false,
        },
      ],
      null,
      2
    );
    setInputText(sampleData);
    processInputData(sampleData);
  };

  const processInputData = (input: string | null) => {
    if (!input) return;
    try {
      const jsonData = JSON.parse(input);
      if (Array.isArray(jsonData)) {
        setInputData(jsonData);
        extractFieldsFromData(jsonData);
      } else {
        console.error("Input data is not an array of objects");
        setInputData([]);
        setFieldOptions([]);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setInputData([]);
      setFieldOptions([]);
    }
  };

  const extractFieldsFromData = (data: DataItem[]) => {
    const allFields = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => allFields.add(key));
    });
    setFieldOptions(Array.from(allFields));
  };

  const downloadCSV = () => {
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

  return (
    <div className="bg-white shadow-2xl p-10 rounded-md max-w-4xl w-full">
      <h1>Create CSV File</h1>
      <div className="flex gap-8 w-full justify-between">
        <div className="flex flex-col gap-2 w-1/2">
          <Textarea
            placeholder="Paste array data here"
            value={inputText}
            onChange={handleTextInput}
            style={{ width: "100%", minHeight: "300px" }}
          />
          <Button variant={"outline"} onClick={sanitizeInput}>
            Sanitize Input
          </Button>
          <Button variant={"outline"} onClick={clearInput}>
            Clear
          </Button>
          <Button variant={"link"} onClick={loadSampleData}>
            Load Sample Data
          </Button>
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          {fieldOptions.length > 0 ? (
            <React.Fragment>
              {fieldOptions.map((field) => (
                <div key={field} className="flex items-center gap-2">
                  <Switch
                    id={field}
                    checked={selectedFields.includes(field)}
                    onCheckedChange={(checked) => handleCheckedChange(checked, field)}
                    value={field}
                  />
                  <Label htmlFor={field}>{field}</Label>
                </div>
              ))}
            </React.Fragment>
          ) : (
            <p>No data detected</p>
          )}
          <div className="mt-auto flex flex-col gap-2">
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Filename including path"
              style={{ width: "100%" }}
            />

            <Button
              disabled={selectedFields.length === 0}
              onClick={downloadCSV}
            >
              {!inputData.length
                ? "No data to transform"
                : selectedFields.length === 0
                ? "Select at least one field"
                : "Download CSV"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvGenerator;
