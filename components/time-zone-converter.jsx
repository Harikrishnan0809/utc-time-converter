'use client'

import { useState, useEffect } from 'react'
import { DateTime as LuxonDateTime } from 'luxon'
import { useSearchParams, useRouter } from 'next/navigation'
import { DateTimePicker } from './date-time-picker'
import { TimeZoneSelect } from './time-zone-select'
import { ControlButtons } from './control-buttons'
import { TimeZoneList } from './time-zone-list'
import timeZones from '../app/utils/time-zones.json'
import TimePicker from './time-picker'

export default function TimezoneConverter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Utility function to encode time zone (replace / with -)
  const encodeTimeZone = (timeZone) => timeZone.replace(/\//g, '-')

  // Utility function to decode time zone (replace - with /)
  const decodeTimeZone = (encodedTimeZone) => encodedTimeZone.replace(/-/g, '/')

  const [dateTime, setDateTime] = useState(LuxonDateTime.now())
  const [selectedOptions, setSelectedOptions] = useState([])
  const [convertedTimes, setConvertedTimes] = useState([])
  const [isMounted, setIsMounted] = useState(false)
  const [timeShift, setTimeShift] = useState(0)

  const [showUrlInput, setShowUrlInput] = useState(false)
  const [includeDate, setIncludeDate] = useState(false)
  const [includeTime, setIncludeTime] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState('')

  useEffect(() => {
    setIsMounted(true)

    const dateFromQuery = searchParams.get('date')
    const timeFromQuery = searchParams.get('time')
    const timeZonesFromQuery = searchParams.get('timezones')

    let newDateTime = dateTime

    if (dateFromQuery && timeFromQuery) {
      newDateTime = LuxonDateTime.fromFormat(
        `${dateFromQuery} ${timeFromQuery}`,
        'LLL-dd-yyyy h:mm a',
        { zone: 'utc' }
      )

      if (newDateTime.isValid) {
        setDateTime(newDateTime)
        setIncludeDate(true)
        setIncludeTime(true)
      }
    }

    if (timeZonesFromQuery) {
      const decodedTimeZones = timeZonesFromQuery.split(',').map(decodeTimeZone)
      const foundTimeZones = decodedTimeZones
        .map((tz) => timeZones.find((zone) => zone.value === tz))
        .filter(Boolean)
      setSelectedOptions(foundTimeZones)
      setConvertedTimes(
        foundTimeZones.map((tz) => ({
          zone: tz,
          time: newDateTime.setZone(tz.value),
        }))
      )
    }
  }, [searchParams])

  const handleTimeZoneChange = (option) => {
    if (!option) return // Prevent null options from being added

    const updatedOptions = [...selectedOptions, option]
    setSelectedOptions(updatedOptions)
    setConvertedTimes([
      ...convertedTimes,
      {
        zone: option,
        time: dateTime.setZone(option.value).plus({ minutes: timeShift }),
      },
    ])
    router.push(
      `?timezones=${updatedOptions
        .map((opt) => encodeTimeZone(opt.value))
        .join(',')}`,
      undefined,
      { shallow: true }
    )
  }

  const handleRemoveTimeZone = (zoneToRemove) => {
    const updatedOptions = selectedOptions.filter(
      (opt) => opt.value !== zoneToRemove.value
    )
    setSelectedOptions(updatedOptions)
    setConvertedTimes(
      updatedOptions.map((tz) => ({
        zone: tz,
        time: dateTime.setZone(tz.value).plus({ minutes: timeShift }),
      }))
    )
    router.push(
      updatedOptions.length
        ? `?timezones=${updatedOptions
            .map((opt) => encodeTimeZone(opt.value))
            .join(',')}`
        : '/',
      undefined,
      { shallow: true }
    )
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const reorderedOptions = Array.from(selectedOptions)
    const [removed] = reorderedOptions.splice(result.source.index, 1)
    reorderedOptions.splice(result.destination.index, 0, removed)
    setSelectedOptions(reorderedOptions)
    setConvertedTimes(
      reorderedOptions.map((tz) => ({
        zone: tz,
        time: dateTime.setZone(tz.value).plus({ minutes: timeShift }),
      }))
    )
    router.push(
      `?timezones=${reorderedOptions
        .map((opt) => encodeTimeZone(opt.value))
        .join(',')}`,
      undefined,
      { shallow: true }
    )
  }

  const handleReverse = () => {
    const reversedOptions = [...selectedOptions].reverse()
    setSelectedOptions(reversedOptions)
    setConvertedTimes(
      reversedOptions.map((tz) => ({
        zone: tz,
        time: dateTime.setZone(tz.value).plus({ minutes: timeShift }),
      }))
    )
    router.push(
      `?timezones=${reversedOptions
        .map((opt) => encodeTimeZone(opt.value))
        .join(',')}`,
      undefined,
      { shallow: true }
    )
  }

  const handleCopyUrl = () => {
    const baseUrl = window.location.origin

    // Get the current time zones from the selected options
    const timeZonesString = selectedOptions
      .map((opt) => encodeTimeZone(opt.value))
      .join(',')

    // Start building the URL
    let newUrl = `${baseUrl}/?timezones=${timeZonesString}`

    // Conditionally add date and time to the URL if checkboxes are checked
    if (includeDate) {
      const formattedDate = dateTime.toFormat('LLL-dd-yyyy')
      newUrl += `&date=${formattedDate}`
    }

    if (includeTime) {
      const formattedTime = dateTime.toFormat('h:mm a')
      newUrl += `&time=${formattedTime}`
    }

    setCopiedUrl(newUrl)
    setShowUrlInput(true)

    // Automatically copy to clipboard
    navigator.clipboard
      .writeText(newUrl)
      .then(() => {
        alert('URL copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  const handleDeleteAll = () => {
    setSelectedOptions([])
    setConvertedTimes([])

    // Clear the time zones from the URL
    router.push('/', undefined, { shallow: true })
  }

  const handleSliderChange = (value) => {
    setTimeShift(value)
    setConvertedTimes(
      selectedOptions.map((tz) => ({
        zone: tz,
        time: dateTime.setZone(tz.value).plus({ minutes: value }),
      }))
    )
  }

  const updateUrlWithDateTime = (newDateTime) => {
    const baseUrl = window.location.origin

    // Get the current time zones from the selected options
    const timeZonesString = selectedOptions
      .map((opt) => encodeTimeZone(opt.value))
      .join(',')

    // Start building the URL
    let newUrl = `${baseUrl}/?timezones=${timeZonesString}`

    // Conditionally add date and time to the URL if checkboxes are checked
    if (includeDate) {
      const formattedDate = newDateTime.toFormat('LLL-dd-yyyy')
      newUrl += `&date=${formattedDate}`
    }

    if (includeTime) {
      const formattedTime = newDateTime.toFormat('h:mm a')
      newUrl += `&time=${formattedTime}`
    }

    // Update only the copied URL in the input field
    setCopiedUrl(newUrl)

    // Automatically copy to clipboard
    navigator.clipboard.writeText(newUrl).catch((err) => {
      console.error('Failed to copy: ', err)
    })
  }

  const handleIncludeDateChange = () => {
    if (!includeDate) {
      const formattedDate = dateTime.toFormat('LLL-dd-yyyy')
      setCopiedUrl((prevUrl) => prevUrl + `&date=${formattedDate}`)
      setIncludeDate(true)
    } else {
      setIncludeDate(false)
      updateUrlWithDateTime(dateTime) // Update URL without date
    }
  }

  const handleIncludeTimeChange = () => {
    if (!includeTime) {
      const formattedTime = dateTime.toFormat('h:mm a')
      setCopiedUrl((prevUrl) => prevUrl + `&time=${formattedTime}`)
      setIncludeTime(true)
    } else {
      setIncludeTime(false)
      updateUrlWithDateTime(dateTime) // Update URL without time
    }
  }

  return (
    <div className='flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6'>
      <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-xl w-full'>
        <h1 className='text-2xl font-bold text-center mb-6 text-blue-600 dark:text-gray-200'>
          UTC to Selected Time Zones Converter
        </h1>
        <DateTimePicker
          dateTime={dateTime}
          onDateTimeChange={setDateTime}
        />
        <TimeZoneSelect
          isMounted={isMounted}
          onTimeZoneChange={handleTimeZoneChange}
        />
        <ControlButtons
          onReverse={handleReverse}
          onCopyUrl={handleCopyUrl}
          onDeleteAll={handleDeleteAll}
        />
        {showUrlInput && (
          <div className='mt-6 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full max-w-lg mx-auto'>
            <div className='mb-4'>
              <label className='block text-gray-800 dark:text-gray-200'>
                Copied URL:
              </label>
              <input
                type='text'
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md'
                value={copiedUrl}
                readOnly
              />
            </div>

            <div className='flex items-center mb-4'>
              <input
                type='checkbox'
                id='includeDate'
                className='mr-2'
                checked={includeDate}
                onChange={handleIncludeDateChange}
              />
              <label
                htmlFor='includeDate'
                className='text-gray-800 dark:text-gray-200'
              >
                Include Date
              </label>
            </div>

            <div className='flex items-center mb-4'>
              <input
                type='checkbox'
                id='includeTime'
                className='mr-2'
                checked={includeTime}
                onChange={handleIncludeTimeChange}
              />
              <label
                htmlFor='includeTime'
                className='text-gray-800 dark:text-gray-200'
              >
                Include Time
              </label>
            </div>

            {includeDate && (
              <DateTimePicker
                dateTime={dateTime}
                onDateTimeChange={(newDate) => {
                  setDateTime(newDate)
                  updateUrlWithDateTime(newDate)
                }}
              />
            )}

            {includeTime && (
              <TimePicker
                time={dateTime}
                onTimeChange={(newTime) => {
                  setDateTime(newTime)
                  updateUrlWithDateTime(newTime)
                }}
              />
            )}
          </div>
        )}

        <TimeZoneList
          convertedTimes={convertedTimes}
          timeShift={timeShift}
          onDragEnd={handleDragEnd}
          onRemoveTimeZone={handleRemoveTimeZone}
          onSliderChange={handleSliderChange}
        />
      </div>
    </div>
  )
}
