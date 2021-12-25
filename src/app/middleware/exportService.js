const xlsx = require('xlsx');
const path = require('path');

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumnNames, ...data];
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(filePath));
};

const exportEventToExcel = (
  events,
  workSheetColumnNames,
  workSheetName,
  filePath
) => {
  const data = events.map((event) => {
    return [
      event._id,
      event.name,
      event.location,
      event.description,
      event.start,
      event.end,
      event.private,
      event['created_useId'],
      event.userId,
      event.status,
      event.createdAt,
      event.updatedAt,
    ];
  });
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};

module.exports = exportEventToExcel;
