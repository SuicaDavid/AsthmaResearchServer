import React, {useMemo} from 'react'
import {Chart, Bar} from 'react-charts'
import {Card} from "@material-ui/core"

function ChartView({data, label, series, axes}) {
    const chartData = useMemo(
        () => [
            {
                label: label,
                data: data
            },
        ],
        [data, label]
    )
    const chartSeries = React.useMemo(
        () => series,
        [series]
    )
    if (chartData.length > 0) {
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
                    <Chart data={chartData} axes={axes} series={chartSeries}/>
                </div>
                <h3>{label}</h3>
            </div>
        )
    } else {
        return <></>
    }
}

ChartView.defaultProps = {
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

export default ChartView