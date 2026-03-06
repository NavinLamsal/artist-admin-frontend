import { useUserContext } from "@/context/UserContext"


export default function Dashboard(){
    const {user} = useUserContext();
    return(
        <>
            <h1>Welcome! {user?.first_name + ' ' + user?.last_name}</h1>
        </>
    )
}