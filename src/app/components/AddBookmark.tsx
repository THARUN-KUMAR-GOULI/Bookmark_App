'use client'

import { createClient } from '../lib/supabase/client'
import { useState } from 'react'

export default function AddBookmark() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in')

      let validUrl = url
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        validUrl = 'https://' + url
      }

      const { error } = await supabase
        .from('bookmarks')
        .insert([{ user_id: user.id, url: validUrl, title: title || validUrl }])
        .select()

      if (error) throw error
      setUrl('')
      setTitle('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='p-[20px]'>
      <div className="flex flex-col gap-[10px] mb-[20px]">
        <label htmlFor="url" className="text-[14px] font-semibold text-[#fff] tracking-wider uppercase">URL *</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com"
          className="w-3/4 p-[10px] bg-[#0f1117] border border-[#2a3347] rounded-[15px] text-[#e8eaf0] text-[15px] placeholder:text-[#5a6478] focus:border-[#4f7eff] focus:shadow-[0_0_0_3px_rgba(79,126,255,0.15)] outline-none transition-all"
        />
      </div>

      <div className="flex flex-col gap-[10px] mb-[20px]">
        <label htmlFor="title" className="text-[14px] font-semibold text-[#fff] tracking-wider uppercase">Title (optional)</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My favorite site"
          className="w-3/4 p-[10px] bg-[#0f1117] border border-[#2a3347] rounded-[15px] text-[#e8eaf0] text-[14px] placeholder:text-[#5a6478] focus:border-[#4f7eff] focus:shadow-[0_0_0_3px_rgba(79,126,255,0.15)] outline-none transition-all"
        />
      </div>

      {error && (
        <div className="p-2.5 rounded-[8px] bg-[#ef4444]/10 border border-[#ef4444]/25 text-[#f87171] text-[13px] mb-4">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading} 
        className="w-1/2 p-[10px] cursor-pointer rounded-[15px] text-[white] border-none bg-gradient-to-r from-[#4f7eff] to-[#7b5ef8]  text-[14px] font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-1.5 tracking-wide"
      >
        {loading ? 'Adding...' : '+ Add Bookmark'}
      </button>
    </form>
  )
}