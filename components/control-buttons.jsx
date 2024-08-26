import { AiOutlineCopy, AiOutlineDelete } from 'react-icons/ai'
import { IoSwapVerticalOutline } from 'react-icons/io5'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { BsMoonStars, BsSun } from 'react-icons/bs'
import { useTheme } from 'next-themes'

export function ControlButtons({ onReverse, onCopyUrl, onDeleteAll }) {
  const { theme, setTheme } = useTheme()
  return (
    <div className='flex justify-between items-center w-10/12 md:w-1/2 mx-auto mb-6'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={onReverse}
            className='text-blue-600 hover:text-blue-800 dark:text-gray-200 dark:hover:text-gray-300'
          >
            <IoSwapVerticalOutline className='text-2xl' />
          </TooltipTrigger>
          <TooltipContent>
            <p>Reverse Time Zones</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={onCopyUrl}
            className='text-blue-600 hover:text-blue-800 dark:text-gray-200 dark:hover:text-gray-300'
          >
            <AiOutlineCopy className='text-2xl' />
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy URL</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={onDeleteAll}
            className='text-blue-600 hover:text-blue-800 dark:text-gray-200 dark:hover:text-gray-300'
          >
            <AiOutlineDelete className='text-2xl' />
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete All Time Zones</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='text-blue-600 hover:text-blue-800 dark:text-gray-200 dark:hover:text-gray-300'
          >
            {theme === 'dark' ? (
              <BsSun className='h-[1.2rem] w-[1.2rem]' />
            ) : (
              <BsMoonStars className='h-[1.2rem] w-[1.2rem]' />
            )}
            <span className='sr-only'>Toggle theme</span>{' '}
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
