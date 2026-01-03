import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import { Collections } from './collections/Collections'
import { Galleries } from './collections/Galleries'
import { Photos } from './collections/Photos'
import { Users } from './collections/Users'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
  routes: {
    admin: '/admin',
    api: '/api',
  },
  collections: [Users, Collections, Galleries, Photos],
  editor: slateEditor({}),
  admin: {
    user: Users.slug,
  },
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, '../schema.graphql'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})

