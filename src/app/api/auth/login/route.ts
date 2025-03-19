import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql"
import bcrypt from "bcrypt"

export async function POST(request:Request) {
    try {
        const { username, password } = await request.json()

        const result: any = await pool.query("SELECT * FROM users WHERE username = ?", [username])

        const isPasswordValid = bcrypt.compareSync(password, result[0].password)

        if (isPasswordValid) {
            return NextResponse.json(result)
        }
    } catch (error: any) {
        return NextResponse.json(
        { message: error.message }, 
        { status: 500 }
    )
    }
}