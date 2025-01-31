import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TransactionChart = ({ incomeData, expenseData }) => {
  incomeData.sort((a, b) => new Date(a.date) - new Date(b.date));
  expenseData.sort((a, b) => new Date(a.date) - new Date(b.date));

  let labels = [
    ...new Set([
      ...incomeData.map((t) => new Date(t.date).toISOString().split("T")[0]),
      ...expenseData.map((t) => new Date(t.date).toISOString().split("T")[0]),
    ]),
  ];

  const incomeAmounts = labels.map((date) =>
    incomeData
      .filter((t) => new Date(t.date).toISOString().split("T")[0] === date)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const expenseAmounts = labels.map((date) =>
    expenseData
      .filter((t) => new Date(t.date).toISOString().split("T")[0] === date)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeAmounts,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: expenseAmounts,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Income vs Expenses Over Time",
      },
    },
  };

  return <Line data={data} options={options} />;
};
TransactionChart.propTypes = {
  incomeData: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,

  expenseData: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TransactionChart;
