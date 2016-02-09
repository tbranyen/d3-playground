
import style from './style.css'

const margin = {
  top: 10,
  right: 20,
  bottom: 20,
  left: 40
}

const width = 655 - margin.left - margin.right
const height = 111 - margin.top - margin.bottom

const chart = d3.select('.chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

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
  data = reduce(data)

  x.domain(d3.extent(data, d => new Date(d.key)))
  y.domain([0, d3.max(data, d => d.durations_total_avg.value)])

  const barWidth = width / data.length

  const bar = chart.selectAll('g')
      .data(data)
    .enter().append('g')
      .attr('transform', (d, i) => `translate(${i * barWidth}, 0)`)

  bar.append('rect')
    .attr('y', d => y(d.durations_total_avg.value))
    .attr('height', d => height - y(d.durations_total_avg.value))
    .attr('width', barWidth - 1)

  chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)

  chart.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(0, 0)`)
    .call(yAxis)
})

const reduce = data => data.aggregations.durations.histograms.buckets
