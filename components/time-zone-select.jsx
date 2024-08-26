import Select from 'react-select'
import timeZones from '../app/utils/time-zones.json'
import { useState } from 'react'
import { useTheme } from 'next-themes'

export function TimeZoneSelect({ isMounted, onTimeZoneChange }) {
  const [inputValue, setInputValue] = useState('')
  const { theme } = useTheme()

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
      borderColor: theme === 'dark' ? '#4a5568' : '#e2e8f0',
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? theme === 'dark'
          ? '#4a5568'
          : '#e2e8f0'
        : 'transparent',
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
      '&:active': {
        backgroundColor: theme === 'dark' ? '#4a5568' : '#cbd5e0',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme === 'dark' ? '#a0aec0' : '#a0aec0',
    }),
  }

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
          styles={customStyles}
        />
      )}
    </div>
  )
}
