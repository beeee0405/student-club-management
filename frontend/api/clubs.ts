import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export default async function handler(req: any, res: any) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase env vars not set' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    const { data, error } = await supabase.from('Club').select('*')
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json({ data })
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
}
