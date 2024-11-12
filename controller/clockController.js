import Clock from "../models/Clock/clock.js"


export const createClock = async (req, res) => {
  try {

    const { clockInDetail, clockOutDetail, date, breakTime , todayTask } = req.body;

    const { userId } = req.params;

    let overTime = "00";

    const clockDetails = await Clock.create({ Date: date, clockIn: clockInDetail, clockOut: clockOutDetail, user: userId, breakTime: breakTime, overTime: overTime , todayTask });


    return res.status(200).json({
      status: true,
      message: "Succesful created",
      data: clockDetails
    })

  } catch (error) {
    console.log('errors ', error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error "
    })
  }
}


export const getClockByUserDate = async (req, res) => {
  try {
    const { date } = req.body;
    const { userId } = req.params;

    const clockEntries = await Clock.findOne({
      user: userId,
      Date: date,
    }).select('clockIn clockOut breakTime Note todayTask').populate("user");

      

    return res.status(200).json({
      status: true,
      message: "Clock details fetched successfully",
      data: clockEntries
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error"
    });
  }
};
export const SaveClockNote = async (req, res) => {
  try {
    const { date , Note } = req.body;
    const { userId } = req.params;

    const clockEntries = await Clock.findOne({
      user: userId,
      Date: date,
    });

    clockEntries.Note = Note;
    await clockEntries.save();

      

    return res.status(200).json({
      status: true,
      message: "Clock details fetched successfully",
      data: Note
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};


// for compare dates 
function compareDates(date1, date2) {
  // Split the date strings into arrays of [year, month, day]
  const date1Parts = date1?.split('/');
  const date2Parts = date2?.split('/');

  if (!date1Parts || date1Parts.length < 3 || !date2Parts || date2Parts.length < 3) {
    console.error("Invalid date format");
    return;
  }

  // Convert each part to integers for comparison
  const year1 = parseInt(date1Parts[2], 10);
  const day1 = parseInt(date1Parts[0], 10);
  const month1 = parseInt(date1Parts[1], 10);

  const year2 = parseInt(date2Parts[2], 10);
  const day2 = parseInt(date2Parts[0], 10);
  const month2 = parseInt(date2Parts[1], 10);

  // Compare years, months, and days in order
  if (year1 < year2) {
    return true;
  } else if (year1 > year2) {
    return false;
  } else {
    if (month1 < month2) {
      return true;
    } else if (month1 > month2) {
      return false;
    } else {
      if (day1 < day2) {
        return true;
      } else if (day1 > day2) {
        return false;
      } else {
        return true;
      }
    }
  }
}

function compareDates1(date3, date4) {
  const date3Parts = date3?.split('/');
  const date4Parts = date4?.split('/');


  if (!date3Parts || date3Parts.length < 3 || !date4Parts || !date4Parts.length) {
    console.log("Invalid Dates");
    return
  }

  else if(!date3Parts || date3Parts.length < 5 || date4Parts || date4Parts.length){
    return 
  }

  else{
    const date4 = (date3Parts * date4Parts) / date3;
    const data5 =  date4.split('/',``).splice(0,4).toTimeString();
    return data5;
  }
}


export const getAttendanceDetails = async (req, res) => {

  const { type, date, month, userId, department } = req.body;

  if (type === "monthly") {

    if (userId) {
      const startDate = new Date(`2024-${month}-01`);
      const formattedStartDate = startDate.toLocaleDateString("en-GB", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric' // Use 'numeric' for full year format
      });
      const lastDay = new Date(2024, month, 0).getDate();

      const endDate = new Date(2024, month - 1, lastDay);

      const formattedEndDate = endDate.toLocaleDateString("en-GB", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric' // Use 'numeric' for full year format
      });
      const userAttendance = await Clock.find({
        user: userId
      }).populate('user');

      const ans = userAttendance.filter((item) => {

        const result1 = compareDates(formattedStartDate, item?.Date);
        const result2 = compareDates(item?.Date, formattedEndDate);

        if (result1 && result2) {
          return item;
        }

      })

      return res.status(200).json({
        status: true,
        message: "Succesfuly",
        data: ans
      })


    }


  }
  else if (type === "daily") {

    if (department === "All") {

      const clockData = await Clock.find({ Date: date }).populate("user");


      return res.status(200).json({
        status: true,
        message: "Successful ",
        data: clockData
      })

    }
    else {

      const clockData = await Clock.find({ Date: date }).populate("user");


      const ans = clockData.filter((item) => {
        return item?.user?.department === department
      })

      return res.status(200).json({
        status: true,
        message: "Succesful ",
        data: ans
      })

    }
  }

};


export const getAllAttendence = async (req, res) => {
  try {

    const allAtt = await Clock.find({}).populate("user");

    return res.status(200).json({
      status: 200,
      data: allAtt
    })

  } catch (error) {
    console.log(error);
  }
}


export const updateAttendance = async (req, res) => {
  try {

    const { id } = req.params;
    const { Date, clockIn, clockOut , breakTime } = req.body;

    const details = await Clock.findByIdAndUpdate(id, {
      Date,
      clockIn,
      clockOut , 
      breakTime
    }, { new: true });

    return res.status(200).json({
      status: true,
      details
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    })
  }
}


export const deleteAttendence = async (req, res) => {
  try {

    const { id } = req.params;
    await Clock.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: "Deleted successfully"
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error "
    })
  }
}