import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const ChartRenderer = ({ data, config }) => {
  if (!data || data.length === 0) return <div className="p-8 text-center text-slate-500 font-medium bg-slate-50 rounded-xl">No data available for this query.</div>;

  // Performance Optimization: Limit data points to prevent browser freeze
  const chartData = data.slice(0, 100);

  const { chartType, dimensions = [], metrics = [] } = config;
  const xAxisKey = dimensions[0] || Object.keys(data[0])[0];
  const yAxisKeys = metrics.length > 0 ? metrics : Object.keys(data[0]).filter(k => k !== xAxisKey);

  const renderTooltip = () => (
    <Tooltip 
      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
      cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} 
    />
  );

  switch (chartType) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
            {renderTooltip()}
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {yAxisKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
            {renderTooltip()}
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {yAxisKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {renderTooltip()}
            <Legend verticalAlign="bottom" height={36}/>
            <Pie
              data={chartData}
              dataKey={yAxisKeys[0]}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    case 'scatter':
      return (
         <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={xAxisKey} type="category" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
            <YAxis dataKey={yAxisKeys[0]} type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
            {renderTooltip()}
            <Scatter name={yAxisKeys[0]} data={chartData} fill={COLORS[0]} />
          </ScatterChart>
        </ResponsiveContainer>
      );
    case 'table':
    default:
      return (
        <div className="overflow-auto max-h-full rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-slate-50 sticky top-0 shadow-sm">
              <tr>
                {Object.keys(chartData[0] || {}).map(key => (
                  <th key={key} className="px-4 py-3 font-semibold text-slate-700 uppercase tracking-wider text-[11px]">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {chartData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {typeof val === 'number' ? val.toLocaleString() : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 100 && (
            <div className="p-2 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
              Showing first 100 of {data.length} records.
            </div>
          )}
        </div>
      );
  }
};
export default ChartRenderer;
