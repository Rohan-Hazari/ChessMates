import { NextAuthOptions, getServerSession } from "next-auth";
import { db } from "./db";
import {PrismaAdapter} from "@next-auth/prisma-adapter" // https://authjs.dev/reference/adapter/prisma
import GoogleProvider from "next-auth/providers/google"
import {nanoid} from 'nanoid'

export const authOptions : NextAuthOptions = {
    adapter:PrismaAdapter(db),
    session:{
        // https://next-auth.js.org/configuration/options#session
        // basically how to save this session jwt(default stored in session cooki) or in database
        strategy:"jwt"
    },
    pages:{
        signIn:'/sign-in'
    },
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET!,

        }),
    ],

    callbacks:{
        // https://next-auth.js.org/configuration/callbacks#session-callback
        //when a session is created what should happen =>
        async session({token,session}){
            if(token){
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
                session.user.username = token.username
            }

            return session
        },
        async jwt({token,user}){
            //find dbUser where email = token.email
            const dbUser = await db.user.findFirst({
                //filter
                where:{
                    email:token.email,
                },
            })


            // if there is no user in our db yet
            if(!dbUser){
                token.id = user!.id
                return token
            }

            if(!dbUser.username){
                await db.user.update({
                    where:{
                        id:dbUser.id,
                    },
                    data:{
                        username : nanoid(10),
                    },
                })
            }

            return{
                id:dbUser.id,
                name:dbUser.name,
                email:dbUser.email,
                picture:dbUser.image,
                username:dbUser.username,
            }
        },
        redirect(){
            return '/'
        }
    },

}

export const getAuthSession = () => getServerSession(authOptions)