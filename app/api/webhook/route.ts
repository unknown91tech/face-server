import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // Parse JSON body
        // console.log(body)
        if(body.success===false){
            console.log("Error in the data recieved, check your inputs once", body.error);
            return NextResponse.json({
                success:false,
                message: body.error
            })
        }
        console.log("Received data:", body);

        // Process the data as needed (e.g., save to a database, trigger another service, etc.)

        return NextResponse.json({ message: "Data received successfully", data: body }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
