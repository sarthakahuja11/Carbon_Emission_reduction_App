const xlsx=require('xlsx');
const prompt = require('prompt-sync')();

// Create a weekday array
var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";
const currDate = new Date; // get current date
const firstDayOfWeek = currDate.getDate() - currDate.getDay(); // First day is the day of the month - the day of the week
const firstday = new Date(currDate.setDate(firstDayOfWeek))

const workbook=xlsx.readFile('./files/energy-usage-by-appliances.xlsx');
const worksheet=workbook.Sheets['Sheet1'];
const data=xlsx.utils.sheet_to_json(worksheet);


let newDataset=[];

let i=0;
while(i<2){
    let day = new Date(currDate.setDate(firstDayOfWeek+i))
    console.log("Reading usage for week starting "+day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear());
    const newData=data.map(function(record){
        const hours = prompt('Enter duration of usage for '+record['Item']+' on '+weekday[i]+' '); 
        record.Date=day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();
        record.Weekday=weekday[i]
        record.Hours=hours
        record.GHG_Emmission_Day=(record['GHG Emmissions (Kg CO2)'] / 365) * (hours / 24); // calculate GHG emmission for device per day
        
        //Delete unused values for this new record
        delete record['Power(W)'];
        delete record['Usage per year (h)'];
        delete record['Energy use (KWh/year)'];
        delete record['Annual cost ($)'];

        return record
    });

    newDataset=[...newDataset,...newData]
    i++
}

const newWorkBook =xlsx.utils.book_new();

const newWorkSheet=xlsx.utils.json_to_sheet(newDataset);

xlsx.utils.book_append_sheet(newWorkBook,newWorkSheet,"Week-"+firstday.getDate() + "-" + (firstday.getMonth() + 1) + "-" + firstday.getFullYear())

xlsx.writeFile(newWorkBook,'./files/generated-ghg-emmissions.xlsx')

//console.log(newDataset)

