const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(express.static('public'))
app.use(express.json());


let Users = new Array({
    'name': 'Sabir',
    'password': 'pass',
    LoggedInArray: [{
        "UserBrowser": "Unknown",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU2FiaXIiLCJpYXQiOjE2Mjk4MzQ4NDd9.k1cAeDwmM55zijKoHbBCt3h3r_zAsAE5aLuW6DFm4ks"
    }]
});
let UserMap = new Map();
UserMap.set('Sabir', 0);

function user(name, password) {
    this.name = name;
    this.password = password;
    this.LoggedInArray = [{}];
}


app.get('/api/userprofile', authToken, (req, res) => {
    // parameters needed .....
    const arrIndex = UserMap.get(req.user.name);
    const userData = Users[arrIndex];
    res.status(200).json(userData);
})

app.patch('/api/change-password', authToken, (req, res) => {
    const arrIndex = UserMap.get(req.user.name);
    const userData = Users[arrIndex];
    userData.password = req.body.password;
    userData.LoggedInArray = [null];
    console.log(userData)
    userData.LoggedInArray.push({"UserBrowser":"Unknown","accessToken":req.token})
    res.status(200).json({message:"Password Changed successfully!"})
})
app.post('/api/signup', (req, res) => {
    // Parameters needed  ..... UserName,password,Browser(optional)
    if (UserMap.get(req.body.userName) >= 0) {
        return res.status(403).json({ messsage: "User already exists" })
    }
    const userData = new user(req.body.userName, req.body.password,);
    const UserBrowser = req.body.Browser ? `${req.body.Browser}` : 'Unknown';
    if (!(userData.name && userData.password)) {
        return res.status(400).json({ 'message': 'invalid user ID or Password' })
    }
    const tempUser = { name: userData.name }
    let arrIndex = Users.length;
    UserMap.set(userData.name, arrIndex);
    Users.push({ 'name': userData.name, 'password': userData.password, 'LoggedInArray': [] });
    const accessToken = jwt.sign(tempUser, process.env.ACCESS_SECRET)
    Users[arrIndex].LoggedInArray.push({ UserBrowser, accessToken });
    const message = 'Sign Up successful!'
    res.json({ accessToken, tempUser, message })

})

app.post('/api/login', (req, res) => {
    // Parameters needed  ..... UserName,password,Browser(optional)


    const { userName, password } = req.body;
    if (!(UserMap.get(userName) >= 0)) { return res.status(403).json({ message: "User does not exists!" }) }
    let arrIndex = UserMap.get(userName);
    let user1 = Users[arrIndex];
    if (!(userName === user1.name && password == user1.password)) {
        return res.status(403).json({ 'message': 'invalid user ID or Password' })
    }
    const tempUser = { name: userName }

    const accessToken = jwt.sign(tempUser, process.env.ACCESS_SECRET)

    const UserBrowser = req.body.Browser ? `${req.body.Browser}` : 'Unknown';
    const LoggedInArray = Users[arrIndex].LoggedInArray
    LoggedInArray.push({ UserBrowser, accessToken });

    res.status(200).json({ accessToken, LoggedInArray })

})
app.delete('/api/logout', (req, res) => {

})

function authToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'Not a valid token' })

    jwt.verify(token, process.env.ACCESS_SECRET, (err, tempUser) => {

        if (err) return res.status(403).json({ message: "Not a valid request" })
        req.user = tempUser;
        req.token = token;
        next()
    })
}


app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running on port ${process.env.PORT || 3000}`)
})