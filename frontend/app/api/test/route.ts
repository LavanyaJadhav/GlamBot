import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/api/upload-test')
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 500 }
    )
  }
} 