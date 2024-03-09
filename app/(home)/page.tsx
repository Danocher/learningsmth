import { db } from "@/lib/db"
import {User} from "@prisma/client"
import { revalidatePath } from "next/cache"
import { Input } from "postcss"
import { stringify } from "querystring"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cookies } from "next/headers"
import nodemailer from 'nodemailer'
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"


async function sendMess(email:string, name:string, num:number) { // функция отправки на почту 
  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
            pass: process.env.NEXT_PUBLIC_NODEMAILER_PW,
        }
    })  
    const mailOptions ={
        from: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
        to: email,
        subject: "Email Verification Code",
        text: `Dear ${name}, We have sent you your verification code, please write it in a form or if it is not you ignore this message. \n \n ${num.toString()} \n \n Best wishes, Danil first next.js db learning task!`,
    }
    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            reject(err)
            console.log(err)
          } else {
            resolve(response)
          }
        })
      })
    
}

export default async function Home() {

    async function findInfo() {// запрос в бд на всех юзеров
        const uuuser = await db.user.findMany() 
        return uuuser
    }
    const usesr = await findInfo()


  
    

    async function UserCreate(form: FormData) {
        "use server"
        const emailFind = form.get('email')?.toString() ?? "";
        const nameFind= form.get('name')?.toString() ?? "";
        const passwordFind = form.get('pass')?.toString() ?? "";

        cookies().set("email", emailFind)
        cookies().set("name", nameFind)
        cookies().set("password", passwordFind)

        const { otpGen } = require('otp-gen-agent');

        const numer = await otpGen();
        const num =    (await bcrypt.hash(numer, 10)).toString()
         cookies().set("vcode", num,{secure:true})
         console.log(num)// ну тут сложно объяснять че делаю

        sendMess(emailFind, nameFind,numer)
        revalidatePath("/emailCheck")
        redirect("/emailCheck")
    }
    return(
        <div className="ml-10 ">{usesr.map(e => (
            <div key={e.id}>
                {e.name} {e.email}
            </div>))}
            <form action={UserCreate} className="flex flex-col items-center justify-center">
                <input placeholder="email" name="email" className="my-2 w-15 border" required></input>
                <input placeholder="name" name="name" className="my-2 border " required></input>
                <input placeholder="password" name="pass" className="my-2 border " required></input>
                {/* <Link href={"/emailCheck"}> */}
                <button className="border rounded-xl p-2">вписать</button>
                {/* </Link> */}
            </form>
            <Link href={"/auth"}>
            <button>Войти</button>
            </Link>
            <Link href="/trytoupdate">
                <div className="flex items-center justify-center ">
            <button className="border mt-2 rounded-xl p-2" >страница update</button>
            </div>
            </Link>
            
        </div>
    )
}