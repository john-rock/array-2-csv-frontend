'use client'

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


interface DataItem {
  [key: string]: any;
}

interface CsvGeneratorProps {
  initialData?: DataItem[];  // Optional initial data
}

const CsvGenerator: React.FC<CsvGeneratorProps> = ({ initialData = [] }) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filename, setFilename] = useState<string>('');
  const [inputData, setInputData] = useState<DataItem[]>(initialData);
  const [inputText, setInputText] = useState<string>('');
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);

  useEffect(() => {
    // Update the selected fields any time the field options change
    setSelectedFields(currentFields => currentFields.filter(field => fieldOptions.includes(field)));
  }, [fieldOptions]);

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedFields(currentFields =>
      event.target.checked
        ? [...currentFields, value]
        : currentFields.filter(field => field !== value)
    );
  };

  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const sanitizeInput = () => {
    // Remove unnecessary trailing commas and trim whitespace
    const sanitizedText = inputText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']').trim();
    setInputText(sanitizedText);
    processInputData(sanitizedText);
  };

  const clearInput = () => {
    setInputText('');
    setInputData([]);
    setFieldOptions([]);
    setSelectedFields([]);
  };

  const loadSampleData = () => {
    const sampleData = JSON.stringify([
      { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", isActive: true },
      { id: 2, name: "Bob Smith", email: "bob.smith@example.com", isActive: false },
      { id: 3, name: "Carol White", email: "carol.white@example.com", isActive: true },
      { id: 4, name: "Dave Brown", email: "dave.brown@example.com", isActive: false }
    ], null, 2);
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
        console.error('Input data is not an array of objects');
        setInputData([]);
        setFieldOptions([]);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setInputData([]);
      setFieldOptions([]);
    }
  };

  const extractFieldsFromData = (data: DataItem[]) => {
    const allFields = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => allFields.add(key));
    });
    setFieldOptions(Array.from(allFields));
  };

  const downloadCSV = () => {
    const csv = Papa.unparse({
      fields: selectedFields,
      data: inputData.map(item =>
        selectedFields.reduce((obj: { [key: string]: any }, field) => {
          obj[field] = item[field];
          return obj;
        }, {})
      ),
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Create CSV File</h1>
      <div className='flex gap-4 w-full'>
      <div className='flex flex-col gap-2'>
        <Textarea
          placeholder="Paste JSON data here"
          value={inputText}
          onChange={handleTextInput}
          style={{ width: '100%', minHeight: '100px' }}
        />
        <Button onClick={sanitizeInput}>Sanitize Input</Button>
        <Button onClick={clearInput}>Clear</Button>
        <Button onClick={loadSampleData}>Load Sample Data</Button>
        
      </div>
      <div>
      {fieldOptions.length > 0 && (
        <div>
          <h2>Select fields to include in the CSV:</h2>
          {fieldOptions.map(field => (
            <label key={field}>
              <input
                type="checkbox"
                value={field}
                onChange={handleFieldChange}
                checked={selectedFields.includes(field)}
              />
              {field}
            </label>
          ))}
        </div>
      )}
      <Input
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Filename including path"
        style={{ width: '100%' }}
      />
      <Button onClick={downloadCSV}>Download CSV</Button>
      </div>
      </div>
    </div>
  );
};

export default CsvGenerator;
