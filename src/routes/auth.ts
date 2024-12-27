import { Router, json } from "express"
import { OAuthApp } from "@octokit/oauth-app"
const auth = Router();
auth.use(json());
import User from "../models/User.js";

const client_id = process.env.GITHUB_CLIENT_ID!;
const client_secret = process.env.GITHUB_CLIENT_SECRET!;

const app = new OAuthApp({
    clientType: 'oauth-app',
    clientId: client_id,
    clientSecret: client_secret,
})

auth.get("/hello", (req, res) => {
    res.send("Hello - auth")
})

// GitHub Access Token
auth.post('/github', async (req, res) => {
    const { codeParams } = req.body;
    console.log(codeParams);

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: codeParams,
        }),
    });

    const tokenData = await tokenResponse.json();
    console.log('tokenData: ', tokenData);
    const accessToken = tokenData.access_token;

    if (accessToken) {
        const getUserResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        const userData = await getUserResponse.json();
        // console.log('userData: ', userData);
        if (userData.message === 'Bad credentials') {
            res.json({ success: false });
        } else {
            const findUser = await User.findOne({ username: userData.login });
            let dbData: any = {};
            if (findUser) {
                console.log('User already exists');
                const upd = await User.updateOne(
                    {
                        username: userData.login
                    },
                    {
                        avatar: userData.avatar_url,
                        lastLogin: Date.now()
                    }
                );
                dbData = await findUser;
            }
            else {
                console.log('User does not exist');
                const user = await User.create({
                    username: userData.login,
                    avatar: userData.avatar_url,
                    lastLogin: Date.now()
                })
                dbData = await user;
            }
            // console.log('dbData: ', dbData);
            res.json({ success: true, message: tokenData.access_token, userData: userData, dbData: dbData });
        }
        // name, email, avatar_url,
    } else {
        res.json({ success: false });
    }
});

// verify access token
auth.post('/verify', async (req, res) => {
    const accessToken = req.headers['token'] as string;
    if (accessToken) {
        const getUserResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        const userData = await getUserResponse.json();
        if (userData.message === 'Bad credentials') {
            res.json({ success: false });
        } else {
            const findUser = await User.findOne({ username: userData.login });
            if (findUser) {
                console.log('User already exists');
                const upd = await User.updateOne(
                    {
                        username: userData.login
                    },
                    {
                        avatar: userData.avatar_url,
                        lastLogin: Date.now()
                    }
                );
            }

            res.json({ success: true, message: accessToken, userData: userData, dbData: findUser });
        }
        // console.log('userData: ', userData);

        // name, avatar_url
    } else {
        res.json({ success: false });
    }
})



export default auth