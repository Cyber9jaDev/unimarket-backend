import readXlsxFile from 'read-excel-file/node';

export default readXlsxFile('./institution.xlsx')
  .then((data) => {
    console.log(data);
  })
