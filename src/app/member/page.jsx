import { getServerSession } from "next-auth"
import { options } from "../api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"

const Member = async () => {
  const session = await getServerSession(options) 

  if(!session){
    return redirect("/")
  }


  return (
    <div>
      <h1>Server Side Member Page</h1>
      {
        session ? (<>
          <div>Name: {session.user.name}</div>
          <div>Email: {session.user.email}</div>
          <div>Role: {session.user.role}</div>
        </>) :
        <></>
      }
    </div>
  )
}

export default Member
