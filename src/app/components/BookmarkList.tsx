'use client'

import { createClient } from '../lib/supabase/client'
import { useEffect, useState } from 'react'
import { Bookmark } from '../types'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let channel: any

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // 1️⃣ Initial fetch
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setBookmarks(data || [])
      setLoading(false)

      // 2️⃣ Realtime subscription (only this user's rows)
      channel = supabase
        .channel('bookmarks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: RealtimePostgresChangesPayload<Bookmark>) => {
            console.log('Realtime:', payload.eventType, payload)

            if (payload.eventType === 'INSERT') {
              const newBookmark = payload.new as Bookmark
              setBookmarks(prev =>
                prev.some(b => b.id === newBookmark.id)
                  ? prev
                  : [newBookmark, ...prev]
              )
            }

            if (payload.eventType === 'UPDATE') {
              const updated = payload.new as Bookmark
              setBookmarks(prev =>
                prev.map(b => (b.id === updated.id ? updated : b))
              )
            }

            if (payload.eventType === 'DELETE') {
              const deleted = payload.old as Bookmark
              setBookmarks(prev =>
                prev.filter(b => b.id !== deleted.id)
              )
            }
          }
        )
        .subscribe()
    }

    setup()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (error) throw error
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
        <p>No bookmarks yet. Add your first one above!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[15px]">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex items-center justify-between p-[10px] bg-[#0f1117] border border-[#2a3347] rounded-[8px]"
        >
          <div className="flex items-center gap-[10px]">
            <img
              src={getFaviconUrl(bookmark.url) || ''}
              className="w-4 h-4"
              alt=""
            />
            <div>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-[#4f7eff] text-sm uppercase"
              >
                {bookmark.title}
              </a>
              <div className="text-xs text-[#5a6478]">{bookmark.url}</div>
            </div>
          </div>

          <button
            onClick={() => handleDelete(bookmark.id)}
            disabled={deletingId === bookmark.id}
            className="text-red-500"
          >
            {deletingId === bookmark.id ? '...' : 'X'}
          </button>
        </div>
      ))}
    </div>
  )
}
