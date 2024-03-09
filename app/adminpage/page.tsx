import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default function Admin(){
    const role = cookies().get("role")?.value ?? ""
    console.log(role.toString(), role)
    if( role == "USER"){
        console.log("hi")
        redirect("/")}
    return(
        <div>its an admin page for admins only</div>
    )
}