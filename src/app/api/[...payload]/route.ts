import { REST_GET, REST_POST, REST_PUT, REST_PATCH, REST_DELETE, REST_OPTIONS } from '@payloadcms/next/routes'
import configPromise from '@/payload.config'

export async function GET(request: Request, { params }: { params: Promise<{ payload: string[] }> }) {
  const { payload: slug } = await params
  return REST_GET(configPromise)(request, { params: Promise.resolve({ slug }) })
}

export async function POST(request: Request, { params }: { params: Promise<{ payload: string[] }> }) {
  const { payload: slug } = await params
  return REST_POST(configPromise)(request, { params: Promise.resolve({ slug }) })
}

export async function PUT(request: Request, { params }: { params: Promise<{ payload: string[] }> }) {
  const { payload: slug } = await params
  return REST_PUT(configPromise)(request, { params: Promise.resolve({ slug }) })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ payload: string[] }> }) {
  const { payload: slug } = await params
  return REST_PATCH(configPromise)(request, { params: Promise.resolve({ slug }) })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ payload: string[] }> }) {
  const { payload: slug } = await params
  return REST_DELETE(configPromise)(request, { params: Promise.resolve({ slug }) })
}

export async function OPTIONS(request: Request) {
  return REST_OPTIONS(configPromise)(request)
}
