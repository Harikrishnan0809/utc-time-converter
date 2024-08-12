import { AiOutlineClose, AiOutlineDrag } from 'react-icons/ai'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export function TimeZoneList({
  convertedTimes,
  timeShift,
  onDragEnd,
  onRemoveTimeZone,
  onSliderChange,
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='timezones'>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='w-full'
          >
            {convertedTimes.map(({ zone, time }, index) => (
              <Draggable
                key={zone.value}
                draggableId={zone.value}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className='bg-gray-50 dark:bg-gray-500 p-4 rounded-lg text-center mb-4 relative flex items-center'
                  >
                    <div
                      {...provided.dragHandleProps}
                      className='mr-4 cursor-grab'
                    >
                      <AiOutlineDrag className='text-2xl text-gray-800 dark:text-gray-200' />
                    </div>
                    <div className='flex-1'>
                      <AiOutlineClose
                        className='absolute top-2 right-2 text-red-500 dark:text-red-700 cursor-pointer'
                        onClick={() => onRemoveTimeZone(zone)}
                      />
                      <h2 className='text-3xl font-bold text-gray-800 dark:text-gray-200'>
                        {zone.city}
                      </h2>
                      <p className='text-lg text-gray-600 dark:text-gray-200 mb-4'>
                        {zone.country}
                      </p>
                      <div className='mb-4'>
                        <strong className='text-lg font-semibold text-gray-800 dark:text-gray-300'>
                          UTC:{' '}
                        </strong>
                        <span className='text-lg text-gray-600 dark:text-gray-200'>
                          {time
                            .setZone('UTC')
                            .plus({ minutes: timeShift })
                            .toFormat('h:mm a')}
                        </span>
                      </div>
                      <div>
                        <strong className='text-lg font-semibold text-gray-800 dark:text-gray-300'>
                          Local Time:{' '}
                        </strong>
                        <span className='text-lg text-gray-600 dark:text-gray-200'>
                          {time.toFormat('h:mm a')}
                        </span>
                      </div>
                      <div className='mt-4'>
                        <Slider
                          min={-720}
                          max={720}
                          value={timeShift}
                          onChange={onSliderChange}
                          trackStyle={{ backgroundColor: '#4A90E2' }}
                          handleStyle={{
                            borderColor: '#4A90E2',
                            backgroundColor: '#4A90E2',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
