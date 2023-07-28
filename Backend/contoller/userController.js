
const { signAccessToken } = require("../middleware/auth");
const User = require("../model/userModel");

const login = async (req, res, next) => {
    // try {
    //   const { email, password } = req.body;
  
    //   const user = await User.findOne({ email });
    //   if (!user) {
    //     return res.status(401).json({
    //       message: "No user found",
    //     });
    //   }
  
    //   const isMatch = await bcrypt.compare(password, user.password);
  
    //   const accessToken = await signAccessToken(user.id);
    //   if (isMatch) {
    //   //   if (!user.verified) {
    //   //     return res.status(401).json({
    //   //       message: "Please verify your email",
    //   //     });
    //   //   }
    //     if (user.banned) {
    //       return res.status(401).json({
    //         message: "You are suspended from the platform",
    //       });
    //     }
    //     const { password, ...userWithoutPassword } = user.toObject();
    //     const session = new userSession({
    //       userId: user._id,
    //       startTime: new Date(),
    //     });
    //     await session.save();
    //     res.status(200).json({
    //       message: "Login successful",
    //       accessToken,
    //       session,
    //       user: userWithoutPassword,
    //     });
    //   } else {
    //     return res.status(401).json({
    //       message: "Incorrect password",
    //     });
    //   }
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).json({
    //     message: "Error logging in",
    //     error: error.message || "Internal server error",
    //   });
    // }
  };
  exports.login = login;