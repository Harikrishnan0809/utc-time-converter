'use client'

import * as React from 'react'
import { BsMoonStars, BsSun } from 'react-icons/bs'
import { useTheme } from 'next-themes'

export function ToggleTheme() {
  const { theme, setTheme } = useTheme()

  return (
    <div className='flex justify-center items-center'>
      <button
        className='border-none'
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? (
          <BsSun className='h-[1.2rem] w-[1.2rem]' />
        ) : (
          <BsMoonStars className='h-[1.2rem] w-[1.2rem]' />
        )}
        <span className='sr-only'>Toggle theme</span>
      </button>
    </div>
  )
}
