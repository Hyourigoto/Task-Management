import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

// inggest function to save user to a database
const synceUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created' },
    async ({event})=>{
        const {data} = event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0]?.email_addresses,
                name:data.first_name + " " + data?.last_name,
                Image: data?.image_url,
            }
        })
    }
)

// inggest function to delete user from database
const synceUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted' },
    async ({event})=>{
        const {data} = event
        await prisma.user.delete({
            where: {
                id: data.id
            }
        })
    }
)

// inggest function to update user data in database
const synceUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated' },
    async ({event})=>{
        const {data} = event
        await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                email: data.email_addresses[0]?.email_addresses,
                name:data.first_name + " " + data?.last_name,
                Image: data?.image_url,
            }
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [synceUserCreation, synceUserDeletion, synceUserUpdation];