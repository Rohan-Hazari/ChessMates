import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChessPostValidator } from "@/lib/validators/chesspost";
import { ZodError } from "zod";

export async function POST(req:Request){
    try {
         
    const session = await getAuthSession();

    if(!session?.user){
        return new Response('Not Logged in',{status:403,statusText:'loginError'})
    }

    const body = await req.json()
    const {communityId,title,description,boardFen,boardSolution}= ChessPostValidator.parse(body)

    const subscriptionExists = db.subscription.findFirst({
        where:{
            communityId,
            userId:session?.user.id
        }
    })

    if(!subscriptionExists){
        return new Response('Not Subscribed',{status:403,statusText:'subscriptionError'})
    }

    const community = await db.community.findUnique({
        where:{
            id:communityId
        }
    })


    if(!community){
        return new Response('No such community exists',{status:404})
    }

    const res = await db.post.create({
        data:{
            title,
            content:description,
            authorId:session.user.id,
            communityId,
            postType:'chess',
            boardFen,
            boardSolution
        }
    })
    

    return new Response('Post successfull',{status:200})
    
        
    } catch (error) {
        if(error instanceof ZodError){
            return new Response('Invalid data',{status:400})
        }
        return new Response('Please try again later',{status:500})
    }
   
}