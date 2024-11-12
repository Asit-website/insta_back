import User from "../models/User/User.js"
import Allowance from "../models/Allowance/Allowance.js";
import Commission from "../models/Commission/Commission.js";
import Loan from "../models/Loan/Loan.js";


export const setUserNetSalary = async (id) => {
    try {
        // Find the user's commissions, allowances, and loans
        const userComm = await Commission.find({ user: id });
        const userAllow = await Allowance.find({ user: id });
        const userLoan = await Loan.find({ user: id });


        
        // Find the user's salary
        const userSalary = await User.findOne({ _id: id });
        
        // Calculate total commission
        let totalComm = 0;
        if (userComm.length > 0) {
            totalComm = userComm.reduce((acc, curr) => acc + curr.amount, 0);
            console.log(totalComm);
        }

        // Calculate total allowance
        let totalAllow = 0;
        if (userAllow.length > 0) {
            totalAllow = userAllow.reduce((acc, curr) => acc + curr.amount, 0);
        }

        // Calculate total loan
        let totalLoan = 0;
        if (userLoan.length > 0) {
            totalLoan = userLoan.reduce((acc, curr) => acc + curr.loanAmount, 0);
        }

        // Calculate net salary
        const netSalary = parseInt(userSalary.salary) + parseInt(totalComm) + parseInt(totalAllow) - parseInt(totalLoan);

         userSalary.netSalary = netSalary;
       await userSalary.save();
       
       return ;

    } catch (error) {
        console.error("Error in calculating net salary:", error);
        throw error;
    }
};


export const getAllUserPayroll = async (req, res) => {
    try {

        const { id } = req.params;

        const userDetails = await User.findOne(
            { _id: id }, // Your query condition
            { paySlipType: 1, salary: 1,  _id: 0 }
        );

        const allowance = await Allowance.find({ user: id });

        const commission = await Commission.find({ user: id });

        const loan = await Loan.find({ user: id });

        return res.status(200).json({
            status: true,
            message: 'Successfuly ',
            data: {
                allowance, commission, loan, userDetails
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error "
        })
    }
}

export const editUserSalary = async (req, res) => {
    try {

        const { id } = req.params;

        const { paySlipType, salary } = req.body;

        if (!paySlipType && !salary) {
            return res.status(404).json({
                status: false,
                message: "please send the data "
            })
        }

        const userdetail = await User.findOne({ _id: id });
         
      

        userdetail.paySlipType = paySlipType;
        userdetail.salary = salary;

        await userdetail.save();

        setUserNetSalary(id);

        return res.status(200).json({
            status: true,
            message: "Successfully "
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error "
        })
    }

}

// allowance 
export const createAllowance = async (req, res) => {
    try {

        const { id } = req.params;

        const { allowanceOption, title, type, amount } = req.body;

        if (!allowanceOption || !title || !type || !amount) {
            return res.status(403).json({
                status: false,
                message: "send the complete data"
            })
        }

        const allowDetail = await Allowance.create({ user: id, amount, allowanceOption, title, type });

         setUserNetSalary(id);

        return res.status(200).json({
            status: true,
            message: "Successfuly",
            allowDetail
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error "
        })
    }
}

export const editAllowance = async (req, res) => {
    try {
        const { allowanceId, allowanceOption, title, type, amount } = req.body;

        const {id} = req.params;

        // Find the allowance details by ID
        const allowDetails = await Allowance.findOne({ _id: allowanceId });

        if (!allowDetails) {
            return res.status(404).json({
                status: false,
                message: "No allowance is available"
            });
        }

        // Update the allowance details
        await Allowance.findByIdAndUpdate(
            allowanceId,
            {
                allowanceOption: allowanceOption,
                title: title,
                type: type,
                amount: amount
            },
            { new: true } // Return the updated document
        );

        setUserNetSalary(id);


        // If you need to send back the updated allowance details in the response, you can do so
        return res.status(200).json({
            status: true,
            message: "Allowance updated successfully",
            updatedAllowance: { allowanceOption, title, type, amount }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};

export const deleteAllowance = async (req, res) => {

    try {

        //  this is alloance id 
        const { allowanceId , id } = req.params;


          await Allowance.findByIdAndDelete({ _id: allowanceId }, { new: true });

        setUserNetSalary(id);

        return res.status(200).json({
            status: true,
            mesage: "successfuly "
        })

    } catch (error) {

        console.log("error ", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });

    }

}

// this is for commision
export const createCommission = async (req, res) => {
    try {

        const { id } = req.params;

        const { title, type, amount } = req.body;

        if (!title || !type || !amount) {
            return res.status(403).json({
                status: false,
                message: "send the complete data"
            })
        }

        const allowDetail = await Commission.create({ user: id, amount, title, type });

        setUserNetSalary(id);

        return res.status(200).json({
            status: true,
            message: "Successfuly",
            allowDetail
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error "
        })
    }
}

export const editCommission = async (req, res) => {
    try {
        const { allowanceId, title, type, amount } = req.body;

        const {id} = req.params;

        // Find the allowance details by ID
        const allowDetails = await Commission.findOne({ _id: allowanceId });

        if (!allowDetails) {
            return res.status(404).json({
                status: false,
                message: "No allowance is available"
            });
        }

        // Update the allowance details
        await Commission.findByIdAndUpdate(
            allowanceId,
            {
                title: title,
                type: type,
                amount: amount
            },
            { new: true } // Return the updated document
        );


        setUserNetSalary(id);

        // If you need to send back the updated allowance details in the response, you can do so
        return res.status(200).json({
            status: true,
            message: "Allowance updated successfully",
            updatedAllowance: { title, type, amount }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};

export const deleteCommission = async (req, res) => {

    try {

        //  this is alloance id 
        const { allowanceId , id } = req.params;

          await Commission.findByIdAndDelete({ _id: allowanceId }, { new: true });

          setUserNetSalary(id);


        return res.status(200).json({
            status: true,
            mesage: "successfuly "
        })

    } catch (error) {

        console.log("error ", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });

    }

}


// Loan 

export const createLoan = async (req, res) => {
    try {

        const { id } = req.params;

        const { LoanOption, title, type, loanAmount, reason } = req.body;

        if (!LoanOption || !title || !type || !loanAmount || !reason) {
            return res.status(403).json({
                status: false,
                message: "send the complete data"
            })
        }

        const allowDetail = await Loan.create({ user: id, loanAmount, LoanOption, title, type, reason });
        setUserNetSalary(id);


        return res.status(200).json({
            status: true,
            message: "Successfuly",
            allowDetail
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error "
        })
    }
}

export const editLoan = async (req, res) => {
    try {
        const { allowanceId, LoanOption, title, type, loanAmount, reason } = req.body;
        const {id} = req.params;

        // Find the allowance details by ID
        const allowDetails = await Loan.findOne({ _id: allowanceId });

        if (!allowDetails) {
            return res.status(404).json({
                status: false,
                message: "No allowance is available"
            });
        }

        // Update the allowance details
        await Loan.findByIdAndUpdate(
            allowanceId,
            {
                LoanOption: LoanOption,
                title: title,
                type: type,
                loanAmount: loanAmount,
                reason: reason
            },
            { new: true } // Return the updated document
        );

        setUserNetSalary(id);


        // If you need to send back the updated allowance details in the response, you can do so
        return res.status(200).json({
            status: true,
            message: "Allowance updated successfully",
            updatedAllowance: { LoanOption, title, type, loanAmount }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};

export const deleteLoan = async (req, res) => {

    try {

        //  this is alloance id 
        const { allowanceId , id } = req.params;

        const allowanceDetail = await Loan.findByIdAndDelete({ _id: allowanceId }, { new: true });

        setUserNetSalary(id);


        return res.status(200).json({
            status: true,
            mesage: "successfuly "
        })


    } catch (error) {

        console.log("error ", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });

    }

}

export const getUserDetailsByLoan = async (req,res) =>{
    try {
       const {userId} = req.body;

       const loanDetails = await Loan.findById({id: userId}).populate("user");

       console.log(loanDetails);

       const userLoan = await User.findByIdAndUpdate({
          $push:{loanDetails},
          status: true,
          message:"user loan successfully fetching"
       })

       return(
        {
           status:true,
           message:"user loan successfully fetched",
           data: userLoan
        }
       )
    } 
    
    catch (error) {
        console.log(error);
    }
}

