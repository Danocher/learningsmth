import { db } from "@/lib/db"
import { cookies } from "next/headers"
import { use } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function Auth(){
   
    async function enterAuth(form:FormData) {
        "use server"
        const email = form.get("name")?.toString() ?? ""
        const password = form.get("password")?.toString() ?? ""
        const findUser = await db.user.findUnique({
            where: {
                email: email
            }
        })
        if (findUser?.password == password){
            cookies().set("id", findUser?.id.toString() ?? "")
            cookies().set("email", email)
            cookies().set("role", findUser.role)
            console.log("You succesfully authorized")
            redirect("/")
        }
    }

    return(
        <div>
            <form action={enterAuth}>
                <input placeholder="email" name="name"/>
                <input placeholder="password" name="password"/>
                <button>Войти</button>
            </form>
            <Link href={"/"}>
            <button>У вас нет аккаунта?</button>
            </Link>
        </div>
    )
}