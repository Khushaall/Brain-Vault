import express, { response } from "express"
import { ContentModel, LinkModel, UserModel } from "./db";
const app = express();
import { z } from 'zod'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import { auth } from "./middleware";
import { random } from "./utils";
const JWT_SECRET = "Secret!23"
import cors from "cors"
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://getbrainvault.netlify.app/",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Hi WOrking");
})


app.get("/api/v1/verify", auth, async (req, res) => {

    res.status(200).json({
        message: "Allowed"
    })

})


app.post("/api/v1/signup", async (req, res) => {

    const { username, password } = req.body;

    console.log(req.body);

    const format = z.object({

        username: z.string().min(3, { message: "Username too short" }).max(10, { message: "Username should be max 10 characters." }),

        password: z.string().regex(/[A-Z]/, { message: "Min One Uppercase Alphabet" }).regex(/[^a-zA-Z0-9]/, { message: "Must Include One special Character" }),

    }


    )

    const result = format.safeParse(req.body);

    if (!result.success) {
    const errorMsg = result.error.errors[0]?.message || "Invalid input";
    res.status(411).json({
        message: errorMsg
    });
    return;
}

    const chck = await UserModel.findOne({ username });

    if (chck) {
        res.status(403).json({
            message: "Already a User"
        });
        return;
    }

    const hashedPass = await bcrypt.hash(password, 5);

    try {
        await UserModel.create({
            username,
            password: hashedPass
        });

        res.status(200).json({
            message: "Signup Success"

        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error Creating"
        })
    }

})

app.post("/api/v1/signin", async (req, res) => {

    const { username, password } = req.body;


    const chck = await UserModel.findOne({ username });

    if (!chck) {
        res.status(403).json({
            message: "Not A User!! Sign up "
        });
        return;
    }

    const isValid = await bcrypt.compare(password, chck.password);

    if (!isValid) {
        res.status(403).json({
            message: "Invalid Credentials"
        });
        return;
    }
    try {
        const token = jwt.sign({
            id: chck._id
        }, JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "lax",
            path: "/"
        });

        res.status(200).json({
            message: "Login Success"
        });
        return;
    }
    catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
        return;
    }

})


app.post("/api/v1/content", auth, async (req, res) => {

    const { title, link, tag, } = req.body;

    if (!title || !link || !tag) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    try {
        await ContentModel.create({
            title,
            link,
            tag,
            //@ts-ignore
            userId: req.userId
        })

        res.status(200).json({
            message: "content Created"
        })


    }
    catch (err) {
        res.status(503).json({ message: "Server Error" })

    }

})

app.get("/api/v1/content", auth, async (req, res) => {

    try {
        const content = await ContentModel.find({
            //@ts-ignore
            userId: req.userId
        }).populate("userId", "username")


        res.status(200).json({
            content

        })
    }
    catch (err) {
        console.log(err);
        res.status(503).json({
            message: "Server Error"
        })
    }



})


app.delete("/api/v1/content/:id", auth, async (req, res) => {

    const { id } = req.params;
    try {
        await ContentModel.deleteOne({
            _id: id,

            //@ts-ignore
            userId: req.userId,


        })
        console.log(id)
        res.status(200).json({
            message: "Deleted"

        })



    }
    catch (err) {
        res.status(500).json({
            message: "Server Error"
        })
    }




})


app.post("/api/v1/brain/share", auth, async (req, res) => {

    const { share } = req.body;

    if (share) {
        try {
            const chck = await LinkModel.findOne({
                //@ts-ignore
                userId: req.userId
            })


            if (chck) {
                res.json({
                    hash: chck.hash
                })
                return;
            }

            const hash = random(10)

            await LinkModel.create({

                //@ts-ignore
                userId: req.userId,
                hash

            });

            res.status(200).json(
                hash
            )
        }
        catch (err) {
            res.status(500).json({
                message: "Server Error"
            })
        }
    }
    else {
        try {
            await LinkModel.deleteOne({
                //@ts-ignore
                userId: req.userId
            });
            res.status(200).json({
                message: "Deleted"
            })
        }
        catch (err) {
            res.status(500).json({
                message: "Server Error"
            })
        }
    }

})

app.get("/api/v1/brain/:link", async (req, res) => {

    const hash = req.params.link;
    try {
        const link = await LinkModel.findOne({
            hash
        });

        if (!link) {
            res.status(411).json({
                message: "Wrong credentials"
            })
            return;
        }

        const content = await ContentModel.find({
            userId: link?.userId
        })

        const user = await UserModel.findOne({
            _id: link.userId
        })

        res.json({
            username: user?.username,
            content: content
        })

    }
    catch (err) {
        res.status(500).json({
            message: "Server Error"
        })
    }

})

app.post("/api/v1/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });

    res.status(200).json({
        message: "Logged Out Successfully"
    });
});

app.listen(3000, () => {
    console.log("Server Running at 3000")
})
