import Express from 'express'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid';

const router = new Express.Router();
const saltRounds = 10;

//LOGIN
router.post("/login",async (req,res)=>{
    const models = req.app.models;
    const User = models.User;

    const username = req.body.username;
    const password = req.body.password;

    //Ensure the account exists
    const currentUser = await User.findOne({username:username});
    if (!currentUser) {
        res.statusCode = 401;
        res.send({"error":"The Username or Password do not match"});
        return;
    }

    //Check the hash
    if (!(await bcrypt.compare(password,currentUser.passwordHash))) {
        res.statusCode = 401;
        res.send({"error":"The Username or Password do not match"});
        return;
    }

    //Add Access Token
    const accessToken = uuid();
    currentUser.accessTokens.push(accessToken);
    await currentUser.save();

    //Get an object that's safe to send to the user
    let safeUser = await models.Utils.getUser(currentUser._id);
    safeUser.accessToken = accessToken;
    res.send(safeUser);
})

//REGISTER
router.post("/register",async (req,res)=>{
    const models = req.app.models;
    const User = models.User;

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    //Ensure the account doesn't exist
    const currentUser = await User.findOne({"$or":[{email: email}, {username:username}]})
    if (currentUser) {
        res.statusCode = 400;
        res.send({"error":"The Email or Username already exists"});
        return;
    }

    const passwordHash = await bcrypt.hash(password,saltRounds);
    const user = new User({
        username: username,
        email: email,
        passwordHash: passwordHash,
    });

    const accessToken = uuid();
    user.accessTokens.push(accessToken);
    await user.save();

    let safeUser = await models.Utils.getUser(user._id);
    safeUser.accessToken = accessToken;
    res.send(safeUser);
})

//LOGOUT
router.post("/logout",async (req,res)=>{
    //We should probably just revoke the access token
    //¯\_(ツ)_/¯
})

export default router;