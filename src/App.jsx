import { useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

function formatDateTime(dt) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(dt)
  } catch {
    return dt.toLocaleString()
  }
}

function getAQIInfo(aqi) {
  if (aqi === '' || aqi === null || Number.isNaN(Number(aqi))) {
    return null
  }
  const v = Number(aqi)
  if (v < 0) return null

  if (v <= 50) {
    return {
      category: 'Good',
      color: '#00A65A', // green
      bg: 'bg-emerald-500',
      comment: 'Air quality is good. Enjoy outdoor activities.'
    }
  }
  if (v <= 100) {
    return {
      category: 'Moderate',
      color: '#F1C40F', // yellow
      bg: 'bg-yellow-400',
      comment: 'Moderate air quality. Sensitive individuals should consider limiting prolonged outdoor exertion.'
    }
  }
  if (v <= 150) {
    return {
      category: 'Unhealthy for Sensitive Groups',
      color: '#F39C12', // orange
      bg: 'bg-orange-400',
      comment: 'Members of sensitive groups may experience health effects. Reduce prolonged or heavy exertion outdoors.'
    }
  }
  if (v <= 200) {
    return {
      category: 'Unhealthy',
      color: '#E74C3C', // red
      bg: 'bg-red-500',
      comment: 'Everyone may begin to experience health effects. Limit outdoor activities; consider wearing a mask.'
    }
  }
  if (v <= 300) {
    return {
      category: 'Very Unhealthy',
      color: '#8E44AD', // purple
      bg: 'bg-purple-600',
      comment: 'Serious health effects possible. Avoid outdoor exertion. Use air purifiers indoors if available.'
    }
  }
  return {
    category: 'Hazardous',
    color: '#6B1F1F', // maroon
    bg: 'bg-rose-900',
    comment: 'Health alert: everyone may experience more serious effects. Stay indoors and use a well-fitted mask if you must go out.'
  }
}

const tips = [
  'Use public transportation or carpool when possible.',
  'Avoid idling your vehicle and maintain proper tire pressure.',
  'Choose walking or cycling for short trips.',
  'Reduce energy consumption at home; switch to LED bulbs.',
  'Avoid burning trash or leaves; compost instead.',
  'Plant trees and maintain indoor plants to improve air quality.',
  'Refuel vehicles in the evening to reduce ozone formation.',
  'Work from home when possible to reduce commuting emissions.'
]

export default function App() {
  const [aqi, setAqi] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const [timestamp, setTimestamp] = useState(null)

  const info = useMemo(() => getAQIInfo(submitted), [submitted])
  const dynamicBg = info?.color ?? '#ffffff'
  const tip = useMemo(() => tips[Math.floor(Math.random() * tips.length)], [timestamp, submitted])

  const handleCheck = () => {
    if (aqi === '' || Number.isNaN(Number(aqi)) || Number(aqi) < 0) {
      alert('Please enter a valid non-negative AQI number.')
      return
    }
    setSubmitted(Number(aqi))
    setTimestamp(new Date())
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Hero with Spline cover */}
      <section className="relative w-full" style={{ height: '52vh' }}>
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white pointer-events-none" />
        <div className="relative h-full max-w-5xl mx-auto px-6 flex items-center">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl shadow-xl p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">Air Quality Monitor</h1>
            <p className="mt-2 text-gray-600 max-w-xl">Enter an AQI value to see the category, color indicator, and recommended precautions.</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1">
        {/* Dynamic background swatch strip */}
        <div className="w-full" style={{ backgroundColor: dynamicBg }}>
          <div className="max-w-5xl mx-auto px-6 py-6"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 -mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input + Result card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                  <div className="flex-1">
                    <label htmlFor="aqi" className="block text-sm font-medium text-gray-700">Enter AQI value</label>
                    <input
                      id="aqi"
                      type="number"
                      min={0}
                      placeholder="e.g., 42"
                      value={aqi}
                      onChange={(e) => setAqi(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                    />
                  </div>
                  <button
                    onClick={handleCheck}
                    className="inline-flex justify-center items-center rounded-xl bg-gray-900 text-white px-6 py-3 font-medium shadow-sm hover:opacity-95 active:opacity-90 transition"
                  >
                    Check AQI
                  </button>
                </div>

                {/* Result display */}
                {submitted !== null && info && (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="col-span-1 sm:col-span-1">
                      <div className="rounded-xl p-4 border border-gray-100 shadow-sm" style={{ backgroundColor: info.color + '1A' }}>
                        <div className="text-sm text-gray-600">AQI</div>
                        <div className="mt-1 text-3xl font-semibold text-gray-900">{submitted}</div>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-1">
                      <div className="rounded-xl p-4 border border-gray-100 shadow-sm" style={{ backgroundColor: info.color + '1A' }}>
                        <div className="text-sm text-gray-600">Category</div>
                        <div className="mt-1 text-xl font-semibold" style={{ color: info.color }}>{info.category}</div>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-1">
                      <div className="rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                        <span className="inline-block w-6 h-6 rounded-full border" style={{ backgroundColor: info.color, borderColor: info.color }} />
                        <span className="text-sm text-gray-700">Background reflects level</span>
                      </div>
                    </div>
                  </div>
                )}

                {submitted !== null && info && (
                  <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5 text-gray-800">
                    {info.comment}
                  </div>
                )}
              </div>
            </div>

            {/* Meta card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Reading Details</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date & time</span>
                    <span className="text-sm font-medium text-gray-900">{timestamp ? formatDateTime(timestamp) : '—'}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600">Tip to reduce air pollution</div>
                    <div className="mt-1 text-sm font-medium text-gray-900">{tip}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal footer */}
          <div className="py-10 text-center text-sm text-gray-500">Stay informed. Breathe better.</div>
        </div>
      </main>
    </div>
  )
}
