import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";
import { randomUUID } from "crypto";


const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
    }
}
// export async function GET(req:NextRequest){
//     await connectRedis();

//     const { searchParams } = new URL(req.url);

//     return NextResponse.json()

// }

export async function POST(req:NextRequest) {
    
    try {
        await connectRedis();
        
        const body = await req.json();
        const { chain , jsonrpc , id, method, params } = body;

        if (!chain || !jsonrpc || !id || !method ) {
            console.log("Invalid inputs, check the inputs");
            return NextResponse.json(
                { message: "Invalid inputs" },
                { status: 411 }
            );
        }

       // Create a unique response queue for the requester
       const responseQueue = `response:${randomUUID()}`;
        console.log(responseQueue)


        // Push the request data to Redis queue
        const response = await client.lPush("ethereum", JSON.stringify({body }));
        console.log(response)
        return NextResponse.json({
            success: true,
            message: "Request has been queued successfully.",
            responseQueue 
        });

    } catch (err) {
        console.error("Something went wrong", err);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }


}