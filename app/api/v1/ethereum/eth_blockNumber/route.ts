import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json("Hello")
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { method_type } = body;

        if (!method_type) {
            console.log("Invalid inputs, check the inputs");
            return NextResponse.json(
                { message: "Invalid inputs" },
                { status: 411 }
            );
        }
        // Corrected URL formatting
        const response = await axios.get(`http://localhost:3000/api/ethereum/eth_blockNumber?method_type=eth_blockNumber`);
        console.log(response)
        return NextResponse.json({
            success: true,
            data: response.data // Extract the actual response data
        });
    } catch (err) {
        console.error("Something went wrong", err);
        return NextResponse.json(
            { error: "An error occurred while fetching your data" },
            { status: 500 }
        );
    }
}
