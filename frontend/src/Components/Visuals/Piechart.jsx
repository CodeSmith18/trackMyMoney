import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ transactions }) => {
  const getCategorisedData = (transactions) => {
    const catMap = {};

    transactions.forEach((txn) => {
      if (catMap[txn.category]) catMap[txn.category] += txn.amount;
      else catMap[txn.category] = txn.amount;
    });

    return Object.entries(catMap).map(([category, totalAmount]) => ({
      category,
      totalAmount,
    }));
  };

  const catData = getCategorisedData(transactions);
  const labels = catData.map((item) => item.category);
  const amounts = catData.map((item) => item.totalAmount);

  const data = {
    labels: labels,
    datasets: [
      {
        data: amounts,
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFC300"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = labels[tooltipItem.dataIndex]; // Fixed label access
            return `${label}: $${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

PieChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PieChart;
