'use client'

import { createClient } from '../lib/supabase/client'
import { useEffect, useState } from 'react'
import { Bookmark } from '../types/index'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let subscription: any

    const fetchBookmarksAndSubscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      setBookmarks(data || [])
      setLoading(false)

      subscription = supabase
        .channel('bookmarks_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
          },
          async () => {
            const { data } = await supabase
              .from('bookmarks')
              .select('*')
              .order('created_at', { ascending: false })

            setBookmarks(data || [])
          }
        )
        .subscribe()
    }

    fetchBookmarksAndSubscribe()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [supabase])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)
      if (error) throw error
      setBookmarks(bookmarks.filter(b => b.id !== id))
    } catch {
      alert('Failed to delete bookmark')
    } finally {
      setDeletingId(null)
    }
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return null
    }
  }

  if (loading) {
    return (
      <div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 bg-[#1e2536] animate-pulse-custom rounded-[8px] mb-2.5" />
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 text-[#5a6478]">
        <svg className="mx-auto mb-4 opacity-30" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <p className="text-[14px]">No bookmarks yet. Add your first one above!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[15px]">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex items-center justify-between p-[10px] bg-[#0f1117] border border-[#2a3347] rounded-[8px] hover:border-[#344058] hover:bg-[#1e2536]/60 transition-all gap-3"
        >
          <div className="flex items-center gap-[10px] flex-1 min-w-0">
            <div className="w-7 h-7 rounded-[6px] bg-[#1e2536] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {getFaviconUrl(bookmark.url) && (
                <img
                  src={getFaviconUrl(bookmark.url)!}
                  alt=""
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[14px] font-medium text-[#4f7eff] hover:text-[#7ba8ff] truncate no-underline uppercase"
              >
                {bookmark.title}
              </a>
              <span className="block text-[12px] text-[#5a6478] truncate">{bookmark.url}</span>
            </div>
          </div>

          <button
            onClick={() => handleDelete(bookmark.id)}
            disabled={deletingId === bookmark.id}
            className="flex-shrink-0 w-8 h-8 rounded-[6px] border-none bg-transparent text-[#ef4444] hover:bg-[#ef4444]/12 hover:text-[#ef4444] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Delete bookmark"
          >
            {deletingId === bookmark.id ? (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
