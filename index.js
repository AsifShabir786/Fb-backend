const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport"); // <- note: passport itself, not your controller
require("./controllers/googleController"); // <- sets up Google Strategy

const authRoute = require("./routes/authRoute");
const StoryRoute = require("./routes/Story");
const postRoute = require("./routes/postRoute");
const groupRoute = require("./routes/groupRoute");
const PagesRoute = require("./routes/PagesRoute");
const MediaRoute = require("./routes/MediaRoute");
const MarketPlaceRoute = require("./routes/MarketPlaceRoute");
const ServicesRoute = require("./routes/ServicesRoute");
const ReviewRoute = require("./routes/ReviewRoute");
const userRoute = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoutes");
const adsRoute = require("./routes/adsRoute");
const Adsadshort = require("./routes/adsRouteadshort");
const stripeRoute = require("./routes/stripe");



const socketIO = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: ["http://localhost:3000", "https://svryn.vercel.app"],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

const io = socketIO(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // <-- REQUIRED for form data

// Sessions (required for OAuth to persist user-login state)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect DB
connectDb();

// 🔑 Google OAuth Routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// Start Google Auth
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/user-login`,
    session: true,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000", // or your frontend route
    failureRedirect: "http://localhost:3000/user-login",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/user-login`,
    session: true,
  }),
  (req, res) => {
    // Redirect to frontend with session (or token if using JWT)
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

//api route
app.use("/api/chat", chatRoutes);

app.use("/auth", authRoute);
app.use("/Story", StoryRoute);
app.use("/adsRoute", adsRoute);
app.use("/Adsadshort", Adsadshort);
app.use("/stripe", stripeRoute);



app.use("/users", userRoute);
app.use("/groupRoute", groupRoute);
app.use("/PagesRoute", PagesRoute);
app.use("/MarketPlace", MarketPlaceRoute);
app.use("/Services", ServicesRoute);
app.use("/ReviewRoute", ReviewRoute);
app.use("/MediaRoute", MediaRoute);

app.use("/postRoute", postRoute);

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  // Handle sendMessage
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    const newMessage = new Message({ senderId, receiverId, text });
    await newMessage.save();

    // Emit message to receiver
    io.emit("receiveMessage", newMessage); // You can use rooms for private chat
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

const PORT = process.env.PORT || 9003;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
