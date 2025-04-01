import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    console.log('API Route: Received form data')

    // Get the file from the incoming formData
    const file = formData.get('image') as File
    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      )
    }

    // Log file details
    console.log('API Route: File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Create a new FormData to send to backend
    const backendFormData = new FormData()
    backendFormData.append('image', file)

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: backendFormData
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Upload failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
} 