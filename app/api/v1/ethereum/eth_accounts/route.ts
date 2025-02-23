import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        const { method_type } = body;

        if(!method_type){
            // console.log("Invalid inputs check the inputs")
            return NextResponse.json({
                message:"Invalid inputs"
            }, {
                status:411
            })
        }

        const response = await axios.post(`/api/${method_type}`, {
            method_type
        })

        if(!response){
            // console.log("Error while getting your result from the backend!!!")
            return NextResponse.json(
                { error: "Error while getting your result from the backend!!!" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            response
        });
    }
    catch(error){
        // console.log("Something went wrong", err);
        return NextResponse.json({
            error: "An error occured while fetching your data",
        },{
            status:500
        });
    }

}