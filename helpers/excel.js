const { Workbook } = require("exceljs");  
const path = require("path");
const fs = require("fs");

module.exports = {
  crear: async(parametros) => {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('', {views: [{showGridLines: false}]});

    worksheet.addRow([]);

    let countryTitleRow = worksheet.addRow(['ESTADO PLURINACIONAL DE BOLIVIA']);
    countryTitleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    countryTitleRow.font = { bold: true,  size: 11 };
    worksheet.mergeCells(2, 1, 2, parametros.longitud);

    let companyTitleRow = worksheet.addRow(['EMPRESA ESTATAL DE TRANSPORTE POR CABLE "MI TELEFÉRICO"']);
    companyTitleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    companyTitleRow.font = { bold: true,  size: 11};
    worksheet.mergeCells(3, 1, 3, parametros.longitud);

    let warehouseTitleRow = worksheet.addRow([process.env.NOMBRE_ALMACEN.toUpperCase()]);
    warehouseTitleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    warehouseTitleRow.font = { bold: true,  size: 14, color: { argb: "888888"}};
    worksheet.mergeCells(4, 1, 4, parametros.longitud);

    let reportNameRow = worksheet.addRow([parametros.titulo]);
    reportNameRow.alignment = { vertical: 'middle', horizontal: 'center' };
    reportNameRow.font = { bold: true,  size: 16, color: { argb: "5484d5"}};
    worksheet.mergeCells(5, 1, 5, parametros.longitud);

    if (parametros.subtitulo) {
      let dateTitleRow = worksheet.addRow([parametros.subtitulo]);
      dateTitleRow.alignment = { vertical: 'middle', horizontal: 'center' };
      dateTitleRow.font = { bold: true,  size: 13, color: { argb: "f49b18"}};
      worksheet.mergeCells(6, 1, 6, parametros.longitud);
    }
    if (parametros.subtitulo1) {
      let subTitleRow = worksheet.addRow([parametros.subtitulo1]);
      subTitleRow.alignment = { vertical: 'middle', horizontal: 'center' };
      subTitleRow.font = { bold: true,  size: 13, color: { argb: "f49b18"}};
      worksheet.mergeCells(7, 1, 7, parametros.longitud);
    }

    const urlChacana = path.join(__dirname, "../../assets/escudo.png");
    const chacanaBase64 = fs.readFileSync(urlChacana, { encoding: 'base64' });
    
    const urlLogo = path.join(__dirname, "../../assets/logo.png");
    const logoBase64 = fs.readFileSync(urlLogo, { encoding: 'base64' });

    worksheet.addImage(
      workbook.addImage({ base64: chacanaBase64, extension: 'png' }),
      {
        tl: { col: 0, row: 1 },
        ext: { width: 100, height: 100},
        editAs: 'absolute'
      }
    );

    worksheet.addImage(
      workbook.addImage({ base64: logoBase64, extension: 'png' }),
      {
        tl: { col: (parametros.longitud - 1)+.80, row: 1 },
        ext: { width: 80, height: 100},
        editAs: 'absolute'
      }
    );

    worksheet.addRow([]);

    return { workbook, worksheet };
  },

  exportar: async(workbook, res) => {
    res.attachment("test.xlsx");
    workbook.xlsx.write(res).then(function() {
      res.end();
    });
  },
  
  formatoCantidad: () => {
    return '#,##0;[Red]\-#,##0';
  },
  
  formatoCosto: () => {
    return '#,##0.00000;[Red]\-#,##0.00000';
  }
};