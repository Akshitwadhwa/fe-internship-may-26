import type { Item } from '../types'

const CATEGORY_COLORS: Record<string, string> = {
  Framework: 'bg-purple-500/20 text-purple-300',
  Library:   'bg-blue-500/20 text-blue-300',
  Tool:      'bg-green-500/20 text-green-300',
  Language:  'bg-orange-500/20 text-orange-300',
}

interface ItemCardProps {
  item: Item
  query: string
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) return <>{text}</>

  const matchIndex = text.toLowerCase().indexOf(normalizedQuery.toLowerCase())

  if (matchIndex === -1) return <>{text}</>

  const beforeMatch = text.slice(0, matchIndex)
  const match = text.slice(matchIndex, matchIndex + normalizedQuery.length)
  const afterMatch = text.slice(matchIndex + normalizedQuery.length)

  return (
    <>
      {beforeMatch}
      <mark className="rounded bg-yellow-300/20 px-0.5 text-yellow-200">{match}</mark>
      {afterMatch}
    </>
  )
}

export function ItemCard({ item, query }: ItemCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm">
              <HighlightMatch text={item.name} query={query} />
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[item.category] ?? 'bg-gray-600/20 text-gray-300'}`}>
              <HighlightMatch text={item.category} query={query} />
            </span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
            <HighlightMatch text={item.description} query={query} />
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
          <svg className="h-3.5 w-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{item.stars}k</span>
        </div>
      </div>
    </div>
  )
}
