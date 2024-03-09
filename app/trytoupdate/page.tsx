import { db } from "@/lib/db"
export default async function Updating(){
    
    async function find(form:FormData) {
        "use server"
        const findByUsername = form.get('name')?.toString() ?? ""
        const newpassword = form.get('password')?.toString() ?? ""
        const dataUser = await db.user.update({
            where: {
                email: findByUsername,
            },
            data:{
                password: newpassword
            }
        })

    }
    return(
        <div>
            <p>hi</p>
            <form action={find}>
                <input name="name" placeholder="name"></input>
                <input name="password" placeholder="password" />
                <button>pocao</button>
            </form>
        </div>
    )
}