import DateTime from 'react-datetime'
import { DateTime as LuxonDateTime } from 'luxon'
import 'react-datetime/css/react-datetime.css'

export function DateTimePicker({ dateTime, onDateTimeChange }) {
  return (
    <div className='flex flex-col items-center mb-6'>
      <label
        htmlFor='dateTimePicker'
        className='text-lg font-medium mb-2 text-gray-700 dark:text-gray-200'
      >
        Choose Date & Time:
      </label>
      <DateTime
        value={dateTime.toJSDate()}
        onChange={(newDate) =>
          onDateTimeChange(LuxonDateTime.fromJSDate(newDate.toDate()))
        }
        inputProps={{
          id: 'dateTimePicker',
          className:
            'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500',
        }}
        className='w-full'
      />
    </div>
  )
}
