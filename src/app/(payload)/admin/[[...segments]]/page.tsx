import { RootPage } from '@payloadcms/next/views'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  try {
    // Filter out undefined values from searchParams
    const resolvedSearchParams = await searchParams
    const cleanSearchParams: { [key: string]: string | string[] } = {}
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (value !== undefined) {
        cleanSearchParams[key] = value
      }
    }

    // Initialize payload to get importMap
    // getPayload accepts the config Promise and resolves it internally
    const payload = await getPayload({ config: configPromise })
    const importMap = payload.importMap

    // Ensure configPromise is valid
    if (!configPromise) {
      throw new Error('Config promise is undefined')
    }

    return (
      <RootPage
        config={configPromise}
        importMap={importMap}
        params={Promise.resolve({
          segments: (await params).segments || [],
        })}
        searchParams={Promise.resolve(cleanSearchParams)}
      />
    )
  } catch (error) {
    console.error('Admin page error:', error)
    throw error
  }
}
