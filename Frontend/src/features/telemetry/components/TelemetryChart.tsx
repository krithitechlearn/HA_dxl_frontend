/**
 * TelemetryChart component.
 * Renders a time-series line chart of telemetry data using recharts.
 * @see US-008, API-026
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TelemetryResponse } from '../types/telemetry.types';
import { formatDateTime } from '../../../utils/dateUtils';

interface TelemetryChartProps {
  data: TelemetryResponse[];
  metricName: string;
}

export function TelemetryChart({ data, metricName }: TelemetryChartProps) {
  const chartData = data.map((item) => ({
    time: formatDateTime(item.recordedAt),
    value: item.metricValue,
    unit: item.unit ?? '',
  }));

  return (
    <div style={{ width: '100%', height: 320 }} aria-label={`Telemetry chart for ${metricName}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
          <Tooltip
            formatter={(value: number, _name: string, props: { payload?: { unit?: string } }) =>
              [`${value} ${props.payload?.unit ?? ''}`, metricName]
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name={metricName}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
