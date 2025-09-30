const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from frontend
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
      });
    }

    req.user = user; // now has _id for linking transactions
    /*req.user = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
    };*/
    console.log("Google user:", req.user);

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Google token" });
  }
};

module.exports = googleAuthMiddleware;
