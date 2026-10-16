'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BatteryCharging,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  CloudSun,
  Database,
  Download,
  Gauge,
  GitBranch,
  Layers3,
  LineChart,
  Menu,
  Moon,
  MoreHorizontal,
  Play,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  ThermometerSun,
  Zap,
} from 'lucide-react'

const actual = [61, 58, 55, 53, 51, 54, 66, 78, 83, 88, 91, 94, 97, 96, 92, 89, 86, 90, 102, 108, 104, 96, 84, 72]
const baseForecast = [59, 56, 54, 52, 51, 56, 64, 76, 81, 86, 89, 93, 95, 94, 90, 87, 84, 88, 99, 104, 101, 93, 82, 70]
const hours = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']

function MiniSparkline({ points, color = 'var(--chart-1)' }: { points: number[]; color?: string }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const path = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 100
    const y = 32 - ((point - min) / (max - min || 1)) * 25
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  return (
    <svg aria-hidden="true" viewBox="0 0 100 36" preserveAspectRatio="none" className="h-10 w-full">
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function ForecastChart({ adjustment }: { adjustment: number }) {
  const forecast = baseForecast.map((value, index) => Math.round(value * (1 + adjustment / 100) + Math.sin(index * 0.8) * 2))
  const max = 120
  const chartPoints = [...actual, ...forecast]
  const actualPath = actual.map((point, index) => `${index === 0 ? 'M' : 'L'} ${(index / 23) * 100} ${100 - (point / max) * 100}`).join(' ')
  const forecastPath = forecast.map((point, index) => `${index === 0 ? 'M' : 'L'} ${(index / 23) * 100} ${100 - (point / max) * 100}`).join(' ')
  const areaPath = `${actualPath} L 100 100 L 0 100 Z`

  return (
    <div className="relative mt-5 h-64 w-full">
      <div className="absolute inset-0 flex flex-col justify-between text-[11px] text-muted-foreground">
        {[120, 90, 60, 30, 0].map((value) => (
          <div className="flex items-center gap-3" key={value}>
            <span className="w-7 text-right tabular-nums">{value}</span>
            <div className="h-px flex-1 border-t border-dashed border-border" />
          </div>
        ))}
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute bottom-7 left-10 right-0 top-0 h-[calc(100%-28px)] w-[calc(100%-40px)] overflow-visible">
        <path d={areaPath} fill="var(--chart-1)" opacity="0.08" />
        <path d={actualPath} fill="none" stroke="var(--chart-1)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <path d={forecastPath} fill="none" stroke="var(--chart-2)" strokeWidth="1.6" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
        <line x1="50" x2="50" y1="0" y2="100" stroke="var(--border)" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        <circle cx="50" cy={100 - (actual[12] / max) * 100} r="2" fill="var(--chart-1)" />
      </svg>
      <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[11px] text-muted-foreground">
        {hours.map((hour) => <span key={hour}>{hour}:00</span>)}
      </div>
      <div className="absolute left-[52%] top-4 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm">
        <p className="font-medium">Now · 12:00</p>
        <p className="mt-0.5 text-muted-foreground">Actual <span className="font-semibold text-foreground">97 kWh</span></p>
      </div>
    </div>
  )
}

export default function EnergyDashboard() {
  const [range, setRange] = useState('Today')
  const [adjustment, setAdjustment] = useState(0)
  const [running, setRunning] = useState(false)
  const forecastTotal = useMemo(() => Math.round(baseForecast.reduce((sum, value) => sum + value, 0) * (1 + adjustment / 100)), [adjustment])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-border px-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Zap className="size-5" fill="currentColor" /></div>
          <div><p className="text-sm font-semibold tracking-tight">Gridwise AI</p><p className="text-[11px] text-muted-foreground">Energy intelligence</p></div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Main navigation">
          <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workspace</p>
          <button className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-left text-sm font-medium text-primary-foreground"><Gauge className="size-4" /> Overview</button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><LineChart className="size-4" /> Forecasts</button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><Database className="size-4" /> Data sources</button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><Layers3 className="size-4" /> Scenarios</button>
          <p className="px-3 pb-2 pt-8 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Project</p>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><BookOpen className="size-4" /> Documentation</button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><GitBranch className="size-4" /> GitHub proof</button>
        </nav>
        <div className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><Settings2 className="size-4" /> Settings</button></div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="flex h-20 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-muted lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button><div><p className="text-xs text-muted-foreground">Workspace / Overview</p><h1 className="mt-0.5 text-xl font-semibold tracking-tight">Energy operations</h1></div></div>
          <div className="flex items-center gap-2 sm:gap-4"><div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground sm:flex"><span className="size-2 rounded-full bg-chart-1" /> Model live <ChevronDown className="size-3.5" /></div><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Help"><CircleHelp className="size-5" /></button><div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">AR</div></div>
        </header>

        <main className="mx-auto max-w-[1440px] p-5 sm:p-8">
          <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-medium text-chart-2"><span className="size-1.5 rounded-full bg-chart-2" /> Simulation mode</div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Demand forecast overview</h2><p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">Monitor consumption patterns, test scenarios, and make smarter energy decisions with your forecasting model.</p></div><div className="flex items-center gap-2"><button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-muted"><Download className="size-4" /> Export report</button><button onClick={() => setRunning(!running)} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"><Play className="size-3.5" fill="currentColor" /> {running ? 'Running...' : 'Run forecast'}</button></div></section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[{label:'Forecast accuracy', value:'94.2%', change:'+2.4%', icon:Target, trend:'up', detail:'vs. previous model'}, {label:'Predicted demand', value:`${forecastTotal} kWh`, change:'-4.8%', icon:Activity, trend:'down', detail:'vs. baseline'}, {label:'Peak load', value:`${Math.round(108 * (1 + adjustment / 100))} kW`, change:'at 20:00', icon:Zap, trend:'neutral', detail:'highest expected'}, {label:'Est. cost avoided', value:'$184', change:'+12.6%', icon:BatteryCharging, trend:'up', detail:'this billing cycle'}].map((item) => { const Icon = item.icon; return <article className="rounded-xl border border-border bg-card p-5 shadow-sm" key={item.label}><div className="flex items-center justify-between"><div className="flex size-9 items-center justify-center rounded-lg bg-muted"><Icon className="size-4 text-foreground" /></div><MoreHorizontal className="size-4 text-muted-foreground" /></div><p className="mt-5 text-xs text-muted-foreground">{item.label}</p><div className="mt-1 flex items-baseline gap-2"><p className="text-2xl font-semibold tracking-tight tabular-nums">{item.value}</p>{item.trend === 'up' && <ArrowUpRight className="size-4 text-chart-2" />}{item.trend === 'down' && <ArrowDownRight className="size-4 text-chart-2" />}</div><p className="mt-1 text-xs text-muted-foreground"><span className={item.trend === 'neutral' ? 'text-muted-foreground' : 'font-medium text-chart-2'}>{item.change}</span> <span>{item.detail}</span></p></article> })}
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <article className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2"><h3 className="font-semibold">Consumption forecast</h3><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">kWh</span></div><p className="mt-1 text-xs text-muted-foreground">Actual usage and predicted demand for the next 24 hours</p></div><div className="flex rounded-lg border border-border p-0.5 text-xs"><button onClick={() => setRange('Today')} className={`rounded-md px-3 py-1.5 ${range === 'Today' ? 'bg-muted font-medium' : 'text-muted-foreground'}`}>Today</button><button onClick={() => setRange('7 days')} className={`rounded-md px-3 py-1.5 ${range === '7 days' ? 'bg-muted font-medium' : 'text-muted-foreground'}`}>7 days</button><button onClick={() => setRange('30 days')} className={`rounded-md px-3 py-1.5 ${range === '30 days' ? 'bg-muted font-medium' : 'text-muted-foreground'}`}>30 days</button></div></div><div className="mt-4 flex items-center gap-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-chart-1" /> Actual</span><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-chart-2" /> Forecast</span><span className="ml-auto hidden items-center gap-1 sm:flex"><CalendarDays className="size-3.5" /> Tue, Oct 15, 2024</span></div><ForecastChart adjustment={adjustment} /></article>

            <article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><h3 className="font-semibold">Model health</h3><p className="mt-1 text-xs text-muted-foreground">Random Forest v2.4</p></div><span className="flex items-center gap-1.5 rounded-full bg-chart-2/10 px-2 py-1 text-[10px] font-medium text-chart-2"><span className="size-1.5 rounded-full bg-chart-2" /> Healthy</span></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-lg bg-muted/60 p-3"><p className="text-[11px] text-muted-foreground">RMSE</p><p className="mt-1 text-lg font-semibold">4.8</p></div><div className="rounded-lg bg-muted/60 p-3"><p className="text-[11px] text-muted-foreground">R² score</p><p className="mt-1 text-lg font-semibold">0.91</p></div></div><div className="mt-6"><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Confidence score</span><span className="font-medium">94.2%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 w-[94.2%] rounded-full bg-chart-1" /></div></div><div className="mt-6 flex items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground"><div className="flex size-8 items-center justify-center rounded-full bg-chart-1/10"><Check className="size-4 text-chart-1" /></div><p>Last trained<br /><span className="font-medium text-foreground">Today at 09:42 AM</span></p></div></article>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_1.15fr]">
            <article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Daily load profile</h3><p className="mt-1 text-xs text-muted-foreground">Average by hour · last 30 days</p></div><button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Load profile options"><MoreHorizontal className="size-4" /></button></div><MiniSparkline points={actual} color="var(--chart-1)" /><div className="mt-2 flex justify-between text-[11px] text-muted-foreground"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div><div className="mt-5 flex items-end justify-between"><div><p className="text-2xl font-semibold">82.4 <span className="text-sm font-normal text-muted-foreground">kWh avg.</span></p><p className="mt-1 text-xs text-chart-2">+3.1% from last month</p></div><CloudSun className="size-8 text-muted-foreground/60" /></div></article>
            <article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Weather impact</h3><p className="mt-1 text-xs text-muted-foreground">Inputs affecting the forecast</p></div><ThermometerSun className="size-5 text-muted-foreground" /></div><div className="mt-5 flex items-end justify-between"><div><p className="text-3xl font-semibold">24°C</p><p className="mt-1 text-xs text-muted-foreground">Partly cloudy · 62% humidity</p></div><Sun className="size-10 text-chart-2" /></div><div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs"><span className="text-muted-foreground">Temperature sensitivity</span><span className="font-medium">High <span className="ml-1 text-chart-2">+8.4%</span></span></div></article>
            <article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><h3 className="font-semibold">Scenario simulator</h3><p className="mt-1 text-xs text-muted-foreground">Test a change in demand drivers</p></div><SlidersHorizontal className="size-5 text-muted-foreground" /></div><div className="mt-5"><div className="flex items-center justify-between text-xs"><label htmlFor="demand-adjustment" className="text-muted-foreground">Demand adjustment</label><span className="font-semibold tabular-nums">{adjustment > 0 ? '+' : ''}{adjustment}%</span></div><input id="demand-adjustment" type="range" min="-15" max="15" value={adjustment} onChange={(event) => setAdjustment(Number(event.target.value))} className="mt-4 w-full accent-[var(--chart-1)]" /><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>-15%</span><span>Baseline</span><span>+15%</span></div></div><div className="mt-5 flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2.5"><span className="text-xs text-muted-foreground">Projected peak</span><span className="text-sm font-semibold">{Math.round(108 * (1 + adjustment / 100))} kW</span></div><button onClick={() => setRunning(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"><Play className="size-3.5" fill="currentColor" /> Apply scenario</button></article>
          </section>

          <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row"><p>Gridwise AI · Student proof-of-work project</p><p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-chart-2" /> Data simulated from public smart-grid patterns · Updated just now</p></footer>
        </main>
      </div>
    </div>
  )
}
