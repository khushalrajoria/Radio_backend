require('dotenv').config()
const express = require('express');
const cors = require('cors');
const multer = require('multer')
const bodyParser = require('body-parser')
const indexRoute = require("./routers/indexRoute")
const socketIO = require('socket.io');
const http = require('http');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json');

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer().any())


app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));

require('./db/connection');




app.get('/', async (req, res) => {
  console.log("Radiology API - Please use specific API URIs");
  return res.status(200).send({ "message": "Radiology API - Please use valid API URIs." });
})

app.use("/api", indexRoute);
//app.use(`${Base_URL}`, Route);
//pp.use('/', WooCommerceRoute);


function storeOfflineMessage(data) {
  const arr = []
  arr.push(data)
  return arr
}

const io = socketIO(server);
// const io = new Server(server, {
//   cors: {
//     origin: "https://my-frontend.com",
//     // or with an array of origins
//     // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
//     credentials: true
//   }
// });

// Socket.IO connection logic
io.on('connection', async (socket) => {
  // When a user connects, store the socket ID in a variable or database for future reference
  const queryData = socket.handshake.query;

  // Access specific query parameters
  const { userId, role } = queryData;
 await addUserSocketId(userId, role, socket.id)
  console.log({ userId, role, "data": socket.id })

  //const userId = getUserId(); // Get the user's ID
  //storeSocketId(userId, socket.id); // Store the socket ID for the user


  // Listen for  messages
  socket.on('patientJoinNotification', async (data) => {
    const doctorSocket = await getSocketId(data.doctorId); // Retrieve the recipient's socket ID
    if (doctorSocket) {
      // If the recipient is online, emit the message directly to their socket
      io.to(doctorSocket.socketId).emit('admitRequest', data);
    } else {
      // If the recipient is offline, you can store the message in the database for later retrieval
     await joinDoctor(data);
    }
  });

  socket.on('doctorJoinNotification', async (data) => {
    const doctorSocket = await getSocketId(data.patientId); // Retrieve the recipient's socket ID
    if (doctorSocket) {
      // If the recipient is online, emit the message directly to their socket
      io.to(doctorSocket.socketId).emit('isDoctorJoin', data);
    } else {
      // If the recipient is offline, you can store the message in the database for later retrieval
     await joinDoctor(data);
    }
  });

  socket.on('joinPatient', async (data) => {
      console.log(data)
    const patientSocket = await joinPatient(data); // Retrieve the recipient's socket ID
    if (patientSocket) {
      // If the recipient is online, emit the message directly to their socket
      console.log("recipientSocketId" + patientSocket[1])
     
      socket.to(patientSocket[0].socketId).emit('admitPatient', patientSocket[1]);
    } else {
      // If the recipient is offline, you can store the message in the database for later retrieval
      storeOfflineMessage(data);
    }
  });

  // Handle disconnect
  socket.on('disconnect', async() => {
    console.log("disconnect  " + socket.id)
    // Remove the socket ID from the stored references
    await removeUserBySocketId(socket.id)
    // removeSocketId(userId, socket.id);
  });
});




const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`server is running at port no ${PORT}`);
});