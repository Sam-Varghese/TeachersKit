var MongoClient = require("mongodb").MongoClient;
var chalk = require("chalk");
var url = "mongodb://localhost:27017/";

//$ Function to fetch all attendance records of a student given their name and class
async function FetchAllAttendanceRecordsOfStudent(studentName, className) {
    return new Promise((resolve, reject) => {
        // Connecting with the database to fetch records
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db("PaulClasses");
            dbo.collection(`${className}Attendance`)
                // Finding the presentees list, and date from database
                .find(
                    {},
                    {
                        projection: {
                            _id: 0,
                            presentees: 1,
                            stringDate: 1,
                        },
                    }
                )
                .toArray((error, result) => {
                    if (error) throw error;
                    // Organizing data into class so as to print out a table
                    function AttendanceOfDay(date, status) {
                        this.Date = date;
                        this.Status = status;
                    }
                    // If there are no records of the student
                    if (result.length == 0) {
                        console.log(
                            chalk.red(
                                `No attendance records available for ${studentName} of class ${className}`
                            )
                        );
                        reject(`No records available`);
                    }
                    // Mapping the array to make a new one with objects of that class, for printing out the table
                    const tableContent = result.map((item) => {
                        return new AttendanceOfDay(
                            item.stringDate,
                            item.presentees.includes(studentName)
                                ? "Present"
                                : "Absent"
                        );
                    });
                    // Printing the table
                    console.log(
                        chalk.blue(
                            `Printing all the attendance records of ${studentName} from ${className}`
                        )
                    );
                    console.table(tableContent);
                    db.close();
                    // Returning result (raw fetched data from the database) into return for future use
                    resolve(result);
                });
        });
    });
}

//$ Function to fetch attendance records of a student for a given month
async function AttendanceOfStudentOfMonth(
    studentName,
    className,
    month,
    monthName,
    year
) {
    return new Promise((resolve, reject) => {
        // Connecting to the mongo db database to fetch records
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db("PaulClasses");
            dbo.collection(`${className}Attendance`)
                // Finding the presentees list, and date for the month
                .find(
                    { month: month, year: year },
                    {
                        projection: {
                            _id: 0,
                            presentees: 1,
                            stringDate: 1,
                        },
                    }
                )
                .toArray((error, result) => {
                    if (error) throw error;
                    // Organizing the data into objects of a class so as to print out the table
                    function AttendanceOfTheMonth(date, status) {
                        this.Date = date;
                        this.Status = status;
                    }
                    // Mapping the array to make new one with objects of that class, for printing out the table
                    const tableContent = result.map((item) => {
                        return new AttendanceOfTheMonth(
                            item.stringDate,
                            item.presentees.includes(studentName)
                                ? "Present"
                                : "Absent"
                        );
                    });
                    // Printing the table
                    console.log(
                        chalk.blue(
                            `Printing the attendance records of ${studentName} for ${monthName}`
                        )
                    );
                    console.table(tableContent);
                    db.close();
                });
        });
    });
}

//$ Function to check attendance of a student on a particular day
async function CheckAttendanceOfStudentOnDay(
    studentName,
    className,
    date,
    month,
    year
) {
    return new Promise((resolve, reject) => {
        // Connecting to the mongo db database
        console.log(chalk.red("Checking attendance of 1 day..."));
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db("PaulClasses");
            dbo.collection(`${className}Attendance`)
                .find(
                    { date: date, month: month, year: year },
                    { projection: { _id: 0, presentees: 1 } }
                )
                .toArray((error, data) => {
                    if (error) throw error;
                    console.log(data);
                    if (data[0] == undefined) {
                        console.log(chalk.red("Data not available"));
                    } else if (data[0].presentees.includes(studentName)) {
                        console.log(chalk.green(`Present`));
                    } else {
                        console.log(`Absent`);
                    }
                    db.close();
                });
        });
    });
}

module.exports = {
    FetchAllAttendanceRecordsOfStudent,
    AttendanceOfStudentOfMonth,
    CheckAttendanceOfStudentOnDay,
};

// CheckAttendanceOfStudentOnDay("a", "trialClass", 7, 2, 2022);
