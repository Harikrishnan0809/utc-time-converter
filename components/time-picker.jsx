import DateTime from 'react-datetime'
import { DateTime as LuxonDateTime } from 'luxon'
import 'react-datetime/css/react-datetime.css'

export default function TimePicker({ time, onTimeChange }) {
  return (
    <div className='flex flex-col items-center mb-6'>
      <label
        htmlFor='timePicker'
        className='text-lg font-medium mb-2 text-gray-700 dark:text-gray-200'
      >
        Choose Time:
      </label>
      <DateTime
        dateFormat={false} // Hide the date picker and only show time picker
        timeFormat={true}
        value={time.toJSDate()}
        onChange={(newTime) =>
          onTimeChange(LuxonDateTime.fromJSDate(newTime.toDate()))
        }
        inputProps={{
          id: 'timePicker',
          className:
            'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500',
        }}
        className='w-full'
      />
    </div>
  )
}
