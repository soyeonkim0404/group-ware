import Exceljs from 'exceljs';

export const createExcel = (header, rows, sheetName) => {
  const workbook = new Exceljs.Workbook();

  workbook.company = 'emotion';
  workbook.creator = 'groupware';
  workbook.lastModifiedBy = 'groupware';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  const worksheet = workbook.addWorksheet(sheetName || Date.now().toString());

  worksheet.columns = header;
  rows && worksheet.addRows(rows);

  return workbook;
};

export const addSheet = (workbook, header, rows, sheetName) => {
  const worksheet = workbook.addWorksheet(sheetName || Date.now().toString());

  worksheet.columns = header;
  rows && worksheet.addRows(rows);

  return workbook;
};

export const addRow = (workbook, position, rows, sheetName) => {
  const worksheet = workbook.getWorksheet(sheetName);

  worksheet.insertRows(position, rows);

  return workbook;
};

export const downloadExcel = async (workbook, fileName) => {
  if (typeof window === 'undefined') throw Error('Cannot find Window Object');

  const data = await workbook.xlsx.writeBuffer();

  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${fileName || 'excel'}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};
