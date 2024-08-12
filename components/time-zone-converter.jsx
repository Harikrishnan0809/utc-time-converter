'use client'

import { useState, useEffect } from 'react'
import { DateTime as LuxonDateTime } from 'luxon'
import { useSearchParams, useRouter } from 'next/navigation'
import { DateTimePicker } from './date-time-picker'
import { TimeZoneSelect } from './time-zone-select'
import { ControlButtons } from './control-buttons'
import { TimeZoneList } from './time-zone-list'
import timeZones from '../app/utils/time-zones.json'

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

  useEffect(() => {
    setIsMounted(true)
    const timeZonesFromQuery = searchParams.get('timezones')
    if (timeZonesFromQuery) {
      const decodedTimeZones = timeZonesFromQuery.split(',').map(decodeTimeZone)
      const foundTimeZones = decodedTimeZones
        .map((tz) => timeZones.find((zone) => zone.value === tz))
        .filter(Boolean)
      setSelectedOptions(foundTimeZones)
      setConvertedTimes(
        foundTimeZones.map((tz) => ({
          zone: tz,
          time: dateTime.setZone(tz.value),
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
    navigator.clipboard
      .writeText(window.location.href)
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
