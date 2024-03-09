import { db } from "@/lib/db"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {toast} from "react-toastify"
import bcrypt from "bcryptjs"

export default function checkMail(){
    async function createUser(form:FormData) {
        "use server"
        const vercod = cookies().get("vcode")
        console.log(vercod?.value.toString() + "flewmfpw")
        const userInputData = form.get("code")?.toString()
        const email = cookies().get("email")?.value ?? ""
        const name = cookies().get("name")?.value ?? ""
        const password = cookies().get("password")?.value ?? ""
        const vercode  = await bcrypt.compare(userInputData ?? '', vercod?.value ?? "")
        console.log(vercode)
        if(vercode == true){
            try{
                await db.user.create({//создание юзера
                            data:{
                                email: email  ,
                                name: name ,
                                password: password,
                            }
                        })
                        console.log("Вы успешно зарегистрировались")
                        cookies().delete("name")
                        cookies().delete("email")
                        cookies().delete("password")
                        cookies().delete("vcode")
            }
            
            catch (error){
                console.error(error)
                
            };
            revalidatePath("/")
            redirect("/")
          
        }
        else{
            console.log("error incorrect code")//все в принципе на это ушло 3 дня... 
            
        }
    }
    return(
        <div>
            <form action={createUser} className="flex flex-col items-center justify-center">
                <input placeholder="verify code" name="code" className="my-2 border"></input>
                <button className="border rounded-xl px-20">accept</button>
            </form>
        </div>
    )
}