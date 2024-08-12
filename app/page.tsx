import { Suspense } from 'react'
import TimezoneConverter from '../components/time-zone-converter'

export default function Home() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <Suspense>
        <TimezoneConverter />
      </Suspense>
    </div>
  )
}
