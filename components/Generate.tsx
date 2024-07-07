"use client";

import React from "react";
import Papa from "papaparse";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCsvGenerator } from "@/hooks/useCsvGenerator";
import { CsvGeneratorProps } from "@/types/types";
import { Info } from "lucide-react";

const CsvGenerator: React.FC<CsvGeneratorProps> = ({ initialData = [] }) => {
  const {
    selectedFields,
    inputData,
    inputText,
    fieldOptions,
    errorMessage,
    handleCheckedChange,
    handleTextInput,
    clearInput,
    loadSampleData,
    downloadCSV,
  } = useCsvGenerator(initialData);

  return (
    <div className="bg-white shadow-2xl p-10 rounded-md max-w-4xl w-full border fixed">
      <Sheet>
        <SheetTrigger className="absolute right-3 top-2">
          <Info strokeWidth={2} width={20} />
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Instructions</SheetTitle>
            <ol className="text-bold mb-8 text-sm text-left">
              <li>
                1. Paste the array you want to convert into the provided input
                field.
              </li>
              <li>2. Choose the fields to use as headers for the CSV file.</li>
              <li>
                3. Click the <code>Download CSV</code> button to save your file.
              </li>
            </ol>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className="flex gap-8 w-full md:flex-row flex-col justify-between">
        <div className="flex flex-col gap-2 md:w-1/2 w-full">
          <Textarea
            placeholder="Paste data here"
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
          <Button variant={"outline"} onClick={clearInput}>
            Clear
          </Button>
          {errorMessage && inputText && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="md:w-1/2 flex flex-col gap-2 w-full">
          <h2 className="font-medium">Keys to include in CSV:</h2>
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
            <p className="text-xs opacity-50">No keys detected</p>
          )}
          <div className="mt-auto flex flex-col gap-2">
            <Button
              disabled={selectedFields.length === 0 || inputData.length === 0}
              onClick={() => downloadCSV(Papa)}
            >
              {!inputData.length
                ? "No data to transform"
                : selectedFields.length === 0
                ? "Select at least one key"
                : "Download CSV"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvGenerator;
