import style from './style.css'
import { outerHTML as diffOuterHTML } from 'diffhtml'

const margin = {
  top: 10,
  right: 20,
  bottom: 20,
  left: 40
}

const width = 655 - margin.left - margin.right
const height = 111 - margin.top - margin.bottom

const chart = document.querySelector('.chart')

const x = d3.time.scale()
  .rangeRound([0, width])
  .nice(d3.time.minute)

const y = d3.scale.linear()
  .range([height, 0])

const xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom')
  .ticks(d3.time.minutes, 5)
  .tickFormat(d3.time.format('%X'))
  .tickSize(5)
  .tickPadding(3)

const yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')
  .ticks(5)
  .tickSize(5)
  .tickPadding(3)
  .tickFormat(d => d + 'ms')

d3.json('data.json', function(err, data) {
  if (err) throw err

  x.domain(d3.extent(data, d => new Date(d.key)))
  y.domain([0, d3.max(data, d => d.durations_total_avg.value)])

  const barWidth = width / data.length

  diffOuterHTML(chart, `
    <svg class="chart" width="${width + margin.left + margin.left}" height="${height + margin.top + margin.bottom}">
      <g transform="translate(${[margin.left, margin.top]})">
        ${data.map((d, i) => `
          <g transform="translate(${[i * barWidth, 0]})">
            <rect
              y="${y(d.durations_total_avg.value)}"
              height="${height - y(d.durations_total_avg.value)}"
              width="${barWidth - 1}"
            ></rect>
          </g>
        `).join('\n')}

        <g class="x axis" transform="translate(${[0, height]})"></g>
        <g class="y axis" transform="translate(${[0, 0]})"></g>
      </g>
    </svg>
  `)

  xAxis(d3.select(chart.querySelector('.x.axis')));
  yAxis(d3.select(chart.querySelector('.y.axis')));
})
