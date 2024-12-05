
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./PieChart.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ graphData, calculateBarLengths }) => {
  const [data, setData] = useState({ food: 100, travel: 0, entertaiment: 0 });
  const generatedata = (graphData) => {
    let obj = { food: 0, travel: 0, entertaiment: 0 };
    if (graphData.length) {
      graphData.forEach((e) => {
        if (e.category === "food") {
          obj.food += parseInt(e.price);
        } else if (e.category === "travel") {
          obj.travel += parseInt(e.price);
        } else if (e.category === "entertaiment") {
          obj.entertaiment += parseInt(e.price);
        }
      });
    } else {
      return { food: 100, travel: 0, entertaiment: 0 }; 
    }
    return obj;
  };
  useEffect(() => {
    const newData = generatedata(graphData);
    if (JSON.stringify(newData) !== JSON.stringify(data)) {
      setData(newData); 
      calculateBarLengths(newData); 
    }
  }, [graphData, calculateBarLengths, data]); 

  return (
    <div className={styles.PieChart}>
      <Pie
        className={styles.chart}
        id="451"
        data={{
          labels: Object.keys(data), 
          datasets: [
            {
              label: "User expenses",
              data: Object.values(data), 
              borderRadius: 4,
              borderWidth: 2,
              fontColor: ["rgba(255,255,255,1)"],
              borderColor: "rgba(0,0,0,0)",
              spacing: 0.1,
              backgroundColor: [
                "rgba(245, 158, 11, 0.8)",
                "rgba(250, 204, 21, 0.8)",
                "rgba(160, 0, 255, 0.8)", 
              ],
              hoverOffset: 20, 
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom", 
              labels: {
                font: {
                  size: 14, 
                  family: 'Arial', 
                  weight: 'bold', 
                },
                color: 'white', 
                padding: 20, 
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
