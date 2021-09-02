import React, {useMemo} from 'react'
import {Chart} from 'react-charts'

function BarChartView({data, label, axes}) {
    const chartData = useMemo(
        () => [
            {
                label: label,
                datums: data
            },
        ],
        [data, label]
    )
    const series = React.useMemo(
        () => ({
            type: 'bar'
        }),
        []
    )
    if (chartData.length > 0) {
        console.log(chartData)
        return (
            <div style={{
                width: '400px',
                height: '350px',
                alignItems: 'center'
            }}>
                <div
                    style={{
                        width: '400px',
                        height: '300px',
                    }}
                >
                    <Chart data={chartData} axes={axes} series={series} tooltip/>
                </div>
                <h3>{label}</h3>
            </div>
        )
    } else {
        return <></>
    }
}

BarChartView.defaultProps = {
    data: [],
    label: "Series",
    series: {
        type: 'line'
    },
    axes: [
        {primary: true, type: 'linear', position: 'bottom'},
        {type: 'linear', position: 'left'}
    ]
}

export default BarChartView