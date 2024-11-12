import Clients from "../models/Tasks/Clients.js";
import Projects from "../models/Tasks/Projects.js";
import ProjectTasks from "../models/Tasks/task.js";
import User from "../models/User/User.js";
import { mailSender } from "../utils/SendMail2.js";
import Notification from "../models/Notification/Notification.js"
import Task from "../models/Task/Task.js";
import projectwork from "../models/ProjectWork.js";


export const CreateClient = async (req, res) => {
  try {

    const { Name, Email, City, State, ZipCode, PhoneNumber, Country, Address } = req.body;

    const clientDetail = await Clients.create({ Name, Email, City, State, ZipCode, PhoneNumber, Country, Address });

    return res.status(200).json({
      status: true,
      message: "done success",
      data: clientDetail
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error "
    })
  }
}

export const EditClient = async (req, res) => {
  try {
    const { Name, Email, City, State, ZipCode, PhoneNumber, Country, Address } = req.body;

    const { clientId } = req.params;

    const clientDetail = await Clients.findByIdAndUpdate(clientId, { Name, Email, City, State, ZipCode, PhoneNumber, Country, Address });

    return res.status(200).json({
      status: true,
      message: "done success",
      data: clientDetail
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "interla server error "
    })
  }
}

export const getAllClient = async (req, res) => {

  const allClient = await Clients.find({});

  return res.status(200).json({
    status: true,
    message: "Done", data: allClient
  })

}

export const DisableClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Find the client by ID
    const client = await Clients.findById(clientId);

    if (!client) {
      return res.status(404).json({
        status: false,
        message: 'Client not found'
      });
    }

    // Toggle the isDisable field
    const updatedClient = await Clients.findByIdAndUpdate(
      clientId,
      { isDisable: !client.isDisable },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      data: updatedClient
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// FOR CLIENTS 
export const CreateProject = async (req, res) => {
  try {

    const { Name, Description, Employee, Status, DueDate, Members } = req.body;

    const projectDetail = await Projects.create({ Name, Description, Employee, Status, DueDate, Members });
    return res.status(200).json({
      status: true,
      message: "Successfuly done",
      projectDetail
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error "
    })
  }
}

export const EditProject = async (req, res) => {
  try {
    const { Name, Description, Employee, Status, DueDate, Members } = req.body;

    const { projectId } = req.params;

    console.log('rid ', projectId);

    const ProjectDetail = await Projects.findByIdAndUpdate(projectId, { Name, Description, Employee, Status, DueDate, Members });

    return res.status(200).json({
      status: true,
      message: "done success",
      data: ProjectDetail
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "interla server error "
    })
  }
}

export const getAllProject = async (req, res) => {

  const allClient = await Projects.find({}).populate("Members");

  return res.status(200).json({
    status: true,
    message: "Done", data: allClient
  })

}

export const DeleteProjects = async (req, res) => {
  const { projectId } = req.params;

  const ans = await Projects.findByIdAndDelete(projectId);

  return res.status(200).json({
    status: true,
    message: "Successfuly data ",
    data: ans

  })
}

export const delteTaskId = async(req ,res)=>{
  const {id} = req.params;
  const taskdetail = await ProjectTasks.findByIdAndDelete(id);

  return res.status(200).json({
    status:true , 
    message:'Done' , 
    data: taskdetail
  })
}

export const getProjectByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Projects.find({ Members: userId }).populate('Members');

    res.status(200).json({
      status: true,
      projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      messag: "intenal server error "
    })

  }
}


// for task of project 
export const CreateProjectTask = async (req, res) => {
  try {

    const { Title, Description, Github, Members, StartDate, DueDate, Priority } = req.body;
    const { projectId } = req.params;

    const taskDetail = await ProjectTasks.create({ Title, Github, Description, Members, StartDate, DueDate, Priority, Project: projectId });

    const projectDetail = await Projects.findById(projectId);

    const memberdetail = await User.findById(Members);

    await mailSender(memberdetail.email, `Regarding New Task`, `<div>
      <div>Project: ${projectDetail?.Name}</div>
      <div>Subject: ${Title}</div>
      <div>Priority: ${Priority}</div>
     
      </div>`);


    let Nottitle = `${projectDetail?.Name} Task`;
    let notDes = `${Title} `

    const newNotification = await Notification.create({ title: Nottitle, description: notDes, user: Members })


    return res.status(200).json({
      status: true,
      data: taskDetail,
      newNotification
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}

// export const editProjectTask = async (req, res) => {
//   try {

//     const { Title, Description, Github, Members, StartDate, DueDate, Priority } = req.body;
//     const { projectId } = req.params;

//     const taskDetail = await ProjectTasks.findById(projectId);
//     taskDetail.Title = Title;
//     taskDetail.Description = Description;
//     taskDetail.Github = Github;
//     taskDetail.StartDate = StartDate;
//     taskDetail.DueDate = DueDate;

//     await taskDetail.save();

//     const projectDetail = await Projects.findById(projectId);

//     const memberdetail = await User.findById(Members);

//     await mailSender(memberdetail.email, `Regarding Update Task`, `<div>
//       <div>Project: ${projectDetail?.Name}</div>
//       <div>Subject: ${Title}</div>
//       <div>Priority: ${Priority}</div>
     
//       </div>`);


//     let Nottitle = `${projectDetail?.Name} Task`;
//     let notDes = `${Title} `

//     const newNotification = await Notification.create({ title: Nottitle, description: notDes, user: Members })


//     return res.status(200).json({
//       status: true,
//       data: taskDetail,
//       newNotification
//     })

//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     })
//   }
// }

export const EditProjectTask = async (req, res) => {
  const { Title, Description, Github, Members, StartDate, DueDate, Priority } = req.body;
  const { projectId } = req.params;
  
  const { taskId } = req.params;
  console.log("projectid" , taskId);

  const taskDetail = await ProjectTasks.findByIdAndUpdate(taskId, { Title, Description, Github, Members, StartDate, DueDate, Priority, Project: projectId });

  const projectDetail = await Projects.findById(projectId);

  const memberdetail = await User.findById(Members);

  await mailSender(memberdetail.email, `Regarding New Task`, `<div>
      <div>Project: ${projectDetail?.Name}</div>
      <div>Subject: ${Title}</div>
      <div>Priority: ${Priority}</div>
     
      </div>`);


  let Nottitle = `${projectDetail?.Name} Task`;
  let notDes = `${Title} `

  const newNotification = await Notification.create({ title: Nottitle, description: notDes, user: Members })


  return res.status(200).json({
    status: true,
    data: taskDetail,
    newNotification
  })
}

export const GetAllTask = async (req, res) => {
  try {

    const allTasks = await ProjectTasks.find({}).populate("Members").populate("Project");

    return res.status(200).json({
      status: true,
      data: allTasks
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}

export const GetTaskByUser = async (req, res) => {
  try {

    const { userId } = req.params;

    const allTasks = await ProjectTasks.find({ Members: userId }).populate("Members").populate("Project");

    return res.status(200).json({
      status: true,
      data: allTasks
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}

export const getTaskByUserProject = async (req, res) => {
  try {

    const { userId, projectId } = req.params;

    const allTasks = await ProjectTasks.find({ Members: userId, Project: projectId }).populate("Members").populate("Project");

    return res.status(200).json({
      status: true,
      data: allTasks
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}

export const getProjectTask = async (req, res) => {
  try {

    const { projectId } = req.params;

    const allTasks = await ProjectTasks.find({ Project: projectId }).populate("Members").populate("Project");
    const taskDetail = await projectwork.find({projectId});

    return res.status(200).json({
      status: true,
      data: allTasks , 
      data2: taskDetail
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}

export const getMyProjectTask = async (req, res) => {
  try {

    const { projectId , memberId } = req.params;

    const allTasks = await ProjectTasks.find({Project: projectId,Members: memberId}).populate("Members").populate("Project");

    return res.status(200).json({
      status: true,
      data: allTasks
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}

export const changeTaskStatus = async (req, res) => {
  try {

    const { taskStatus } = req.body;
    const { taskId } = req.params;

    const allTasks = await ProjectTasks.findByIdAndUpdate(taskId, { Status: taskStatus }, { new: true });

    return res.status(200).json({
      status: true,
      data: allTasks
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}


// user birthdate 

export const getTodayBirthday = async (req, res) => {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1; // Months are zero-based, so add 1
    const todayDate = today.getDate();

    // Get employees whose birthday is today
    const employeesWithBirthdayToday = await User.find().exec();

    // Filter employees whose month and day of dob match today's month and day
    const filteredEmployees = employeesWithBirthdayToday.filter(employee => {
      const dob = new Date(employee.dob);
      return (dob.getMonth() + 1 === todayMonth) && (dob.getDate() === todayDate);
    });



    res.status(200).json(filteredEmployees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};