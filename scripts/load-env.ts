// Load environment variables before anything else
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables - .env first, then .env.local (so .env.local overrides)
dotenv.config({ path: resolve(process.cwd(), '.env') })
dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true })

