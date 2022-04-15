import React, { useState, useEffect } from "react";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Legend, Title, Tooltip } from 'chart.js'
import { Line } from 'react-chartjs-2'
import io from 'socket.io-client';
import Alert from './Alert';
const socket = io("http://176.235.202.77:4001/", { transports: ['websocket', 'polling', 'flashsocket'] })


ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const temp = [];
const hum = [];
const tempLabel = [];

socket.emit("telemetry_topic", "tempDev");
socket.on("telemetry_topic_message", function (msg) {
  let info = JSON.parse(msg);
  console.log(temp);
  const date = new Date();
  if (tempLabel.length > 15) {
    tempLabel.shift();
    temp.shift();
  }
  temp.push(info.temperature);
  tempLabel.push(date.getHours() + ":" + date.getMinutes());
});

const LineChart = (props) => {

  const { id, } = props;


  const [openAlert, setOpenAlert] = useState(true);
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const currentDate = new Date().toLocaleString();


  const [chart, setChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature",
        data: [],
        borderColor: "#FF0000",
        fill: true,
      },
      {
        label: "Humidity",
        data: [],
        borderColor: "#3e95cd",
        fill: true,
      },
    ],
  })
  useEffect(() => {

    setTimeout(function () {
      setChart({
        labels: tempLabel,
        datasets: [
          {
            label: "Temperature",
            data: temp,
            borderColor: "#FF0000",
            fill: true,
          },
          // {
          //   label: "Humidity",
          //   data: hum,
          //   borderColor: "#3e95cd",
          //   fill: true,
          // },
        ],
      }, [tempLabel, temp]);

    }, 2000);
  })


  var options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Graph',
      }
    },
    maintainAspectRactio: false,
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return value + " \u2103 ";
          },
        },
      },
    },
    legend: {
      labels: {
        fontSize: 26
      }
    },
  }
  return (
    <div style={{ width: '80%' }}>
      <Line
        data={chart}
        height={400}
        width={600}
        options={options}
      />
    </div>
  )
}

export default LineChart