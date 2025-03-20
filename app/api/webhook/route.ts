import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectRedis();
        const body = await req.json();

        if (body.success === false) {
            console.log("Error in the data received", body.error);
            return NextResponse.json({
                success: false,
                message: body.error
            });
        }

        await client.set("webhook_data", JSON.stringify(body));

        // Confirm the data has been stored
        const storedData = await client.get("webhook_data");
        console.log("Stored Webhook Data:", storedData);  // Add this log to verify in the console

        return NextResponse.json({ 
            message: "Data received successfully", 
            data: body 
        }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
