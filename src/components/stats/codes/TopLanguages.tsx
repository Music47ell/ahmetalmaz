import type React from 'react'
import { displayNumbers } from '../../../utils/formatters'

export type Language = {
  name: string
  color: string
  percent: number
  xps: number
  level: number
}

type TopLanguagesProps = {
  topLanguages: Language[]
}

const TopLanguages: React.FC<TopLanguagesProps> = ({ topLanguages }) => {
  if (!topLanguages.length) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col border border-dracula-dracula shadow-lg">
      {topLanguages.map((language) => (
        <div
          key={language.name}
          className="flex flex-col p-4 border-b border-dracula-dracula"
        >
          <div className="flex flex-col w-full">
            <p className="text-lg font-semibold text-dracula-cullen">{language.name}</p>
            <p className="text-xs text-neutral-400">Level {language.level}</p>
            <p className="text-xs text-neutral-400">
              XP {displayNumbers.format(language.xps)}
            </p>
          </div>
<div className="text-right text-neutral-100">
              {language.percent.toFixed(0)}%
            </div>
          <div className="relative flex gap-3 mt-2">
            <div className="flex-1 h-3 bg-gray-500">
              <span
                className="absolute left-0 top-0 h-3"
                style={{
                  width: `${language.percent}%`,
                  backgroundColor: language.color,
                  transition: 'width 0.8s',
                }}
              >
                &ensp;
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TopLanguages