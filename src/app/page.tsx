import { createClient } from './lib/supabase/server'
import { redirect } from 'next/navigation'
import AddBookmark from './components/AddBookmark'
import BookmarkList from './components/BookmarkList'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="px-6 py-8 max-w-6xl">
      {/* Two Column Layout */}
      <div className="flex gap-[30px]">
        {/* Left Column - Welcome Banner & Add Bookmark */}
        <div className="w-1/2 p-[20px]">
          {/* Welcome Banner */}
          <div className="relative p-[20px] mb-[20px] overflow-hidden rounded-[18px] p-8 bg-gradient-to-br from-[#1a2545] to-[#1e1535] border border-[#2d3a5e]">
            <div className="absolute -top-12 -right-12 w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(79,126,255,0.18)_0%,transparent_70%)] pointer-events-none"></div>
            <h2 className="text-[24px] font-bold text-white tracking-tight mb-2">
              Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'User'} 👋
            </h2>
            <p className="text-[15px] text-[rgba(200,210,240,0.65)]">
              You have saved bookmarks. Keep organizing your favorite websites.
            </p>
          </div>

          {/* Add Bookmark Section */}
          <div className="bg-[#161b27] border border-[#2a3347] rounded-[18px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[4px] h-6 rounded-full bg-gradient-to-b from-[#4f7eff] to-[#7b5ef8]"></div>
              <h2 className="text-[16px] font-semibold text-[#e8eaf0] tracking-tight">
                Add New Bookmark
              </h2>
            </div>
            <AddBookmark />
          </div>
        </div>

        {/* Right Column - Bookmarks List */}
        <div className="w-3/5 p-[20px]">
          <div className="bg-[#161b27] p-[10px] border border-[#2a3347] rounded-[18px] p-8 sticky top-[76px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[4px] h-6 rounded-full bg-gradient-to-b from-[#4f7eff] to-[#7b5ef8]"></div>
              <h2 className="text-[16px] font-semibold text-[#e8eaf0] tracking-tight">
                Your Bookmarks
              </h2>
            </div>
            <BookmarkList />
          </div>
        </div>
      </div>
    </div>
  )
}
