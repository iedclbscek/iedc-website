import express from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() })

// GET /api/donations - Fetch verified donors
app.get('/api/donations', async (req, res) => {
  try {
    if (!supabase) {
      console.log('Supabase not configured, returning empty array')
      return res.json({ success: true, data: [] })
    }

    const { data, error } = await supabase
      .from('donations')
      .select('name, batch, amount, created_at, testimonial')
      .in('status', ['verified', 'pending'])
      .eq('show_on_wall', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Supabase query error:', error)
      return res.json({ success: true, data: [] })
    }

    res.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Fetch donations error:', error)
    res.json({ success: true, data: [] })
  }
})

// POST /api/donations - Submit new donation
app.post('/api/donations', upload.single('payment_proof'), async (req, res) => {
  try {
    if (!supabase) {
      console.error('Supabase client is null')
      return res.status(500).json({ 
        success: false, 
        error: 'Database not configured' 
      })
    }

    const donationData = {
      name: req.body.name,
      batch: req.body.batch || null,
      email: req.body.email,
      phone: req.body.phone,
      amount: parseFloat(req.body.amount),
      donor_type: req.body.donor_type,
      pan: req.body.pan || null,
      show_on_wall: req.body.show_on_wall === 'true',
      testimonial: req.body.testimonial || null,
      payment_proof_url: null,
      status: 'pending'
    }

    console.log('Inserting donation:', donationData)

    const { data, error } = await supabase
      .from('donations')
      .insert([donationData])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }

    console.log('Donation inserted:', data)

    // Handle file upload
    const file = req.file
    if (file && data) {
      console.log('Uploading file:', file.originalname)
      const fileExt = file.originalname.split('.').pop()
      const fileName = `${data.id}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        })

      if (uploadError) {
        console.error('File upload error:', uploadError)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName)

        await supabase
          .from('donations')
          .update({ payment_proof_url: publicUrl })
          .eq('id', data.id)
        
        console.log('File uploaded successfully')
      }
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Donation submission error:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit donation' 
    })
  }
})

// GET /api/testimonials - Fetch testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    if (!supabase) {
      console.log('Supabase not configured, returning empty array')
      return res.json({ success: true, data: [] })
    }

    const { data, error } = await supabase
      .from('donations')
      .select('name, testimonial, created_at')
      .not('testimonial', 'is', null)
      .neq('testimonial', '')
      .in('status', ['verified', 'pending'])
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Supabase query error:', error)
      return res.json({ success: true, data: [] })
    }

    res.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Fetch testimonials error:', error)
    res.json({ success: true, data: [] })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
