const excelJs = require("exceljs");
const GetStudentNames = require("./studentNames");

async function GetClassInformationExcel(className) {
    return new Promise(async (resolve, reject) => {
        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet(`Class ${className}`);
        const path = "documents";
        worksheet.columns = [
            { header: "SNo.", key: "sNo", width: 10 },
            { header: "Student names", key: "studentName", width: 10 },
        ];
        const studentNamesList = await GetStudentNames(className);
        studentNamesList.forEach((element, index) => {
            worksheet.addRow({
                sNo: index,
                studentName: element,
            });
        });
        // Making first line in excel bold
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        try {
            const data = await workbook.xlsx
                .writeFile(`${path}/${className}Information.xlsx`)
                .then(() => {
                    resolve({
                        status: "success",
                        message: "file successfully downloaded",
                        path: `${path}/users.xlsx`,
                    });
                });
        } catch (err) {
            console.log(err);
            resolve({
                status: "error",
                message: "Something went wrong",
            });
        }
    });
}

// GetClassInformationExcel("Class9").then((data) => console.log(data));
module.exports = GetClassInformationExcel;