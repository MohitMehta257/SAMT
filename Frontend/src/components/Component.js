import React from 'react';
import * as XLSX from 'xlsx';
const Component = () => {

  const users = [
    // Example data structure
    { id: 1, employee: { employeeId: 'E001', employeeName: 'John Doe', department: 'IT' }, allowanceBillable: 'YES', onCallCount: 6, onCallShifts: { "2024-01-01": 'Night', "2024-01-02": 'Day' } },
    { id: 2, employee: { employeeId: 'E002', employeeName: 'Jane Smith', department: 'HR' }, allowanceBillable: 'NO', onCallCount: 3, onCallShifts: { "2024-01-03": 'Day' } },
    // more users...
  ];

  const selectedColumns = ['Sr.No.', 'Emp ID', 'Employee Name', 'Project/Sub Dept 2', 'Billable Project DLV (YES/NO)', 'No of On Call days (1/0.5)', 'On Call Dates'];

  const filteredData = users.map(item => {
    const filteredItem = {};
    selectedColumns.forEach(column => {
      if (column === 'Sr.No.') filteredItem[column] = item.id;
      else if (column === 'Emp ID') filteredItem[column] = item.employee.employeeId;
      else if (column === 'Employee Name') filteredItem[column] = item.employee.employeeName;
      else if (column === 'Project/Sub Dept 2') filteredItem[column] = item.employee.department;
      else if (column === 'Billable Project DLV (YES/NO)') filteredItem[column] = item.allowanceBillable;
      else if (column === 'No of On Call days (1/0.5)') filteredItem[column] = item.onCallCount;
      else if (column === 'On Call Dates') filteredItem[column] = Object.entries(item.onCallShifts).map(([key, value]) => `${key} (${value})`).join(', ');
    });
    return filteredItem;
  });

  const workbook = XLSX.utils.book_new();

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(filteredData);

  // Apply Conditional Formatting (example: highlight "No of On Call days" > 5)
  const applyConditionalFormatting = (ws) => {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cellAddress = { r: row, c: selectedColumns.indexOf('No of On Call days (1/0.5)') };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cell = ws[cellRef];

      if (cell && cell.v ) {  // Condition: If value is greater than 5
        if (!cell.s) cell.s = {};  // Ensure cell style exists
        cell.s.fill = {
          fgColor: { rgb: "FFFF00" },  // Yellow fill
        };
        cell.s.font = {
          bold: true,  
        };
      }
    }
  };

  // Apply the conditional formatting to the worksheet
  applyConditionalFormatting(worksheet);

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Oncall Allowance Days');

  // Write the file
  XLSX.writeFile(workbook, 'Allowance Report.xlsx');

  return (
    <button onClick={Component}>Download Excel</button>
  );
};

export default Component;
