import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
    }
}

// Utility function to wait for webhook data with retries
async function getWebhookDataWithRetry(retries = 5, delay = 2000) {
    await connectRedis();

        const webhookResponse = await client.get("webhook_data");

        if (webhookResponse) {
            return JSON.parse(webhookResponse);
        }
    return null;
}

export async function POST(req: NextRequest) {
    try {
        await connectRedis();

        const body = await req.json();
        const { chain, jsonrpc, id, method, params } = body;

        if (!chain || !jsonrpc || !id || !method) {
            console.log("Invalid inputs, check the inputs");
            return NextResponse.json(
                { message: "Invalid inputs" },
                { status: 411 }
            );
        }

        await client.lPush("ethereum", JSON.stringify({ body }));

        // Poll for webhook data with retries
        const webhookResponse = await getWebhookDataWithRetry();

        if (!webhookResponse) {
            return NextResponse.json({
                success: false,
                message: "Webhook response not available yet. Please retry."
            });
        }

        return NextResponse.json({
            success: true,
            message: "Request processed successfully.",
            response: webhookResponse
        });

    } catch (err) {
        console.error("Something went wrong", err);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}
