const xlsx = require("xlsx");
const prompt = require("prompt-sync")();

/** This script generate daily usage for a user assuming the user is using an app. 
 * The result is exported to xlsx and used to make visualizations in Tableau.
 * Normally, the mobile app should send this information via a network connection to a database server as a file or structured data. 
 * This information can be pulled into Tableau and the visualization displayed to user. 
 * An alternative would be to store the xlsx file in the user device and use the programming language to generate statistics and graphs.*/

// Create a weekday array
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

/** Set today's date and use it to get current week date*/
const currDate = new Date(); // get current date
const firstDayOfWeek = currDate.getDate() - currDate.getDay(); // First day is the day of the month - the day of the week
const firstday = new Date(currDate.setDate(firstDayOfWeek));

// Set the files to process in an array
const files=['energy-usage-by-house-hold-appliances.xlsx','energy-usage-by-mobile-applications.xlsx','energy-usage-by-smart-appliances.xlsx']

for (let filename of files){
    console.log(filename)
    const workbook = xlsx.readFile('./files/'+filename);
    const worksheet = workbook.Sheets['Sheet1'];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // This variable will hold the generated data to be written back to a new xlsx file
    let newDataset = [];

    let i = 0;
    while (i < 7) {
    let day = new Date(currDate.setDate(firstDayOfWeek + i));
    console.log(
        "Reading usage for week starting " +
        firstday.getDate() +
        "/" +
        (firstday.getMonth() + 1) +
        "/" +
        firstday.getFullYear()
    );
    const newData = data.map(function (record) {
        const hours = prompt(
        "Enter duration of usage for " +
            record["Item"] +
            " on " +
            weekday[i] +
            " "
        );
        record.Date =
        day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();
        record.Weekday = weekday[i];
        record.Hours = hours;
        record['GHG Emmissions (g CO2)/day'] =
        (record["GHG Emmissions (Kg CO2)"] / 365)*1000 * (hours / 24); // calculate GHG emmission for device per day

        return record;
    });

    newDataset = [...newDataset, ...newData];
    i++;
    }

    const newWorkBook = xlsx.utils.book_new();
    const newWorkSheet = xlsx.utils.json_to_sheet(newDataset);

    xlsx.utils.book_append_sheet(
    newWorkBook,
    newWorkSheet,
    "Week-" +
        firstday.getDate() +
        "-" +
        (firstday.getMonth() + 1) +
        "-" +
        firstday.getFullYear()
    );

    xlsx.writeFile(newWorkBook, './files/generated-'+filename);

}
