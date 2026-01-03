import { handleEndpoints } from 'payload'
import configPromise from '@/payload.config'

export async function GET(request: Request) {
  return handleEndpoints({
    config: configPromise,
    request,
  })
}

export async function POST(request: Request) {
  return handleEndpoints({
    config: configPromise,
    request,
  })
}

export async function PUT(request: Request) {
  return handleEndpoints({
    config: configPromise,
    request,
  })
}

export async function PATCH(request: Request) {
  return handleEndpoints({
    config: configPromise,
    request,
  })
}

export async function DELETE(request: Request) {
  return handleEndpoints({
    config: configPromise,
    request,
  })
}
