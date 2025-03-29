import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

const CATEGORY_COLORS = {
  "FOOD_AND_DRINK": "#34D399",       // green
  "TRANSPORTATION": "#60A5FA",       // blue
  "TRANSFER_OUT": "#F87171",         // red
  "SERVICE": "#FBBF24",              // yellow
  "SHOPPING": "#A78BFA",             // purple
  "ENTERTAINMENT": "#F472B6",        // pink
  "HEALTHCARE": "#10B981",           // emerald
  "OTHER": "#D1D5DB"                 // gray fallback
};

export default function ResponsivePieChartComponent({ transactions }) {
  const [chartSize, setChartSize] = useState({ width: "100%", height: 400 });

  // Adjust chart dimensions based on window size
  useEffect(() => {
    const handleResize = () => {
      // For smaller screens, reduce the height
      if (window.innerWidth < 768) {
        setChartSize({ width: "100%", height: 300 });
      } else {
        setChartSize({ width: "100%", height: 400 });
      }
    };

    // Initial call and event listener for window resize
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const aggregateByCategory = (transactions) => {
    const categoryTotals = {};

    transactions.forEach((tx) => {
      const category = tx.personal_finance_category?.primary || "Uncategorized";
      const amount = tx.amount || 0;

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] += amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .filter(entry => entry.value > 0); // filter zeros too
  };

  const data = aggregateByCategory(transactions);
  console.log(data);

  // Calculate dynamic radius based on container size and screen width
  const getOuterRadius = () => {
    if (window.innerWidth < 480) return 80;
    if (window.innerWidth < 768) return 100;
    return 120;
  };

  // Custom render function for pie chart labels to handle responsiveness
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    // Only show label for segments that are substantial (e.g., > 5%)
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // On small screens, just show percentage
    if (window.innerWidth < 576) {
      return (
        <text x={x} y={y} fill="#000000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }

    // On larger screens, show category and percentage
    return (
      <text x={x} y={y} fill="#000000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
      <div style={{ width: "100%", height: chartSize.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={getOuterRadius()}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS["OTHER"]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend layout={window.innerWidth < 768 ? "horizontal" : "vertical"} verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}