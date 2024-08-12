import Select from 'react-select'
import timeZones from '../app/utils/time-zones.json'
import { useState } from 'react'

export function TimeZoneSelect({ isMounted, onTimeZoneChange }) {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className='flex flex-col items-center mb-6 w-full'>
      <label
        htmlFor='timeZoneSelect'
        className='text-lg font-medium mb-2 text-gray-700 dark:text-gray-200'
      >
        Select Time Zone:
      </label>
      {isMounted && (
        <Select
          id='timeZoneSelect'
          options={timeZones}
          value={null} // Always show the placeholder
          onChange={onTimeZoneChange}
          inputValue={inputValue}
          onInputChange={setInputValue}
          placeholder='Choose a time zone...'
          className='w-full'
          classNamePrefix='react-select'
          isClearable={false}
        />
      )}
    </div>
  )
}
