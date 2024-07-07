"use client";

import React from "react";
import Papa from "papaparse";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCsvGenerator } from "@/hooks/useCsvGenerator";
import { DataItem, CsvGeneratorProps } from "@/types/types";

const CsvGenerator: React.FC<CsvGeneratorProps> = ({ initialData = [] }) => {
  const {
    selectedFields,
    inputData,
    inputText,
    fieldOptions,
    errorMessage,
    handleCheckedChange,
    handleTextInput,
    sanitizeInput,
    clearInput,
    loadSampleData,
    downloadCSV,
  } = useCsvGenerator(initialData);

  console.log(errorMessage);

  return (
    <div className="bg-white shadow-2xl p-10 rounded-md max-w-4xl w-full border fixed">
      <h1 className="text-bold">Create CSV File</h1>
      <div className="flex gap-8 w-full justify-between">
        <div className="flex flex-col gap-2 w-1/2">
          <Textarea
            placeholder="Paste JSON data here"
            value={inputText}
            onChange={handleTextInput}
            style={{ width: "100%", minHeight: "300px" }}
          />
          <Button
            variant={"link"}
            onClick={loadSampleData}
            className="mr-auto text-left text-xs pl-0 h-2 py-0 mb-4"
          >
            Load Sample Data
          </Button>
          <Button variant={"outline"} onClick={sanitizeInput}>
            Sanitize Input
          </Button>
          <Button variant={"outline"} onClick={clearInput}>
            Clear
          </Button>
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          {fieldOptions.length > 0 ? (
            fieldOptions.map((field) => (
              <div key={field} className="flex items-center gap-2">
                <Switch
                  id={field}
                  checked={selectedFields.includes(field)}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(checked, field)
                  }
                  value={field}
                />
                <Label htmlFor={field}>{field}</Label>
              </div>
            ))
          ) : (
            <p>No data detected</p>
          )}
          <div className="mt-auto flex flex-col gap-2">
            <Button
              disabled={selectedFields.length === 0 || inputData.length === 0}
              onClick={() => downloadCSV(Papa)}
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
