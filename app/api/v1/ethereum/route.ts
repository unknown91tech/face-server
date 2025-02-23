import axios from "axios";
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
        const { chain , jsonrpc , id, method } = body;

        if (!chain) {
            console.log("Invalid inputs, check the inputs");
            return NextResponse.json(
                { message: "Invalid inputs" },
                { status: 411 }
            );
        }

        // Push the request data to Redis queue
        await client.lPush("ethereum", JSON.stringify({body}));

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