interface MonkeyTypeStats {
  bestRecord: {
    wpm: number
    accuracy: number
    rawWpm: number
    consistency: number
    timestamp: number
  }
  totalTests: number
  totalTimeTyping: number // in seconds
  totalWords: number
  accountAge: number // in milliseconds
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const MonkeyTypeStatsDisplay = ({ stats }: Props) => {
  return (
    <div className="flex flex-col gap-y-4 border border-dracula-dracula px-4 py-3">
      {/* Best Record Header */}
      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
        Best Record
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* WPM */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            WPM
          </span>
          <span className="text-2xl font-semibold text-white">
            {stats.bestRecord.wpm}
          </span>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Accuracy
          </span>
          <span className="text-2xl font-semibold text-white">
            {stats.bestRecord.accuracy}%
          </span>
        </div>

        {/* Raw WPM */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Raw WPM
          </span>
          <span className="text-2xl font-semibold text-white">
            {stats.bestRecord.rawWpm}
          </span>
        </div>

        {/* Consistency */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Consistency
          </span>
          <span className="text-2xl font-semibold text-white">
            {stats.bestRecord.consistency}%
          </span>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="border-t border-dracula-dracula pt-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Total Tests */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Total Tests
            </span>
            <span className="text-lg font-semibold text-white">
              {stats.totalTests}
            </span>
          </div>

          {/* Total Words */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Total Words
            </span>
            <span className="text-lg font-semibold text-white">
              {stats.totalWords.toLocaleString()}
            </span>
          </div>

          {/* Time Typing */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Time Typing
            </span>
            <span className="text-lg font-semibold text-white">
              {formatTime(stats.totalTimeTyping)}
            </span>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Date
            </span>
            <span className="text-lg font-semibold text-white">
              {formatDate(stats.bestRecord.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonkeyTypeStatsDisplay