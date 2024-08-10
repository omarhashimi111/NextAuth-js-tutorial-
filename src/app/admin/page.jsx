import { getServerSession } from "next-auth"
import { options } from "../api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"
import Image from 'next/image';

const Admin = async () => {
  const session = await getServerSession(options)
  
  if(session.user.role === "admin"){
    return (<>
      <div className="w-full">
        <h1 className="text-center font-bold text-green-800 mt-4">Welcome Mr {session.user.name}</h1>
        <div className="flex flex-col gap-6">
          <div className="text-center font-ms">Email: {session.user.email}</div>
          <Image src={session.user.image} alt="image" width={70} height={70}
            className="self-center rounded-full shadow-xl"
          />
          <h3 className='text-center'>Role: {session.user.role}</h3>
        </div>
      </div>
    </>)
  }
  else{
    redirect("/")
  }
}

export default Admin
