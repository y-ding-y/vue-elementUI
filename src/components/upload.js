import XLSX from 'xlsx'

function readExcel (file) {
  const types = file.name.split('.')[1];
  const fileType = [
    'xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'
  ].some(item => item == types);
  if (!fileType) {
    alert('格式错误！请重新选择');
    return
  }

  const reader = new FileReader();
  var result=[] ;
  reader.onload = function(e) {
    const data = e.target.result;
    const wb = XLSX.read(data, {
      type: 'binary',
      cellDates: true
    });
    wb.SheetNames.forEach((sheetName) => { 
      result.push({
        sheetName: sheetName,
        sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
      })
    });
    console.log(result);
  };
  reader.readAsBinaryString(file.raw)

  return result;
}

export { readExcel }