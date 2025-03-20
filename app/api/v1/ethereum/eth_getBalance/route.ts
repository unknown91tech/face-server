import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
    }
}

export async function GET(){
    return NextResponse.json("Hello from eth")
}

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

        // Push the request data to Redis queue
        const answer = await client.lPush("ethereum", JSON.stringify({body}));
        if(!answer){
            return NextResponse.json({
                success: false,
                message:"Error while getting your answer"
            })
        }
        return NextResponse.json({
            success: true,
            message: "Request has been queued successfully."
        });

    } catch (err) {
        console.error("Something went wrong", err);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }


}