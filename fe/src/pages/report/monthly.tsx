"use client";
import {
  ArrowUp,
  ArrowDown,
  BarChart2,
  ShoppingCart,
  Truck,
  TrendingUp,
} from "lucide-react";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface MonthlyReport {
  month: number;
  total_quantity: number;
}

export default function MonthlyReportPage() {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());
  const [stockInReport, setStockInReport] = useState<MonthlyReport[]>([]);
  const [stockOutReport, setStockOutReport] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, [year]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const [inRes, outRes] = await Promise.all([
        axios.get<MonthlyReport[]>(
          `http://localhost:4001/stock-in/report/monthly?year=${year}`
        ),
        axios.get<MonthlyReport[]>(
          `http://localhost:4001/stock-out/report/monthly?year=${year}`
        ),
      ]);
      setStockInReport(inRes.data);
      setStockOutReport(outRes.data);
    } catch (err: any) {
      setError(err.message || "Lỗi khi lấy dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const inQty =
      stockInReport.find((r) => r.month === month)?.total_quantity || 0;
    const outQty =
      stockOutReport.find((r) => r.month === month)?.total_quantity || 0;
    return {
      month: `Tháng ${month}`,
      Nhập: inQty,
      Xuất: outQty,
      difference: inQty - outQty,
    };
  });

  const totalIn = chartData.reduce((acc, cur) => acc + cur.Nhập, 0);
  const totalOut = chartData.reduce((acc, cur) => acc + cur.Xuất, 0);
  const totalDiff = totalIn - totalOut;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-[32px] font-sans">
      <div className="max-w-[1200px] mx-auto bg-[#fff] rounded-[16px] shadow-[0_4px_24px_rgba(123,104,238,0.08)] border border-[#E5E7EB] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[32px] py-[24px] flex justify-between items-center">
          <h1 className="text-[#fff] text-[24px] font-[800] flex items-center gap-[8px]">
            📊 Báo cáo nhập/xuất
          </h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center px-[18px] py-[10px] rounded-[8px] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#fff] font-[600] text-[15px] shadow transition-all"
          >
            <ArrowLeft size={20} className="mr-[6px]" /> Quay lại
          </button>
        </div>

        {/* Year selector */}
        <div className="p-[24px] border-b border-[#E5E7EB] flex flex-wrap gap-[12px] items-center">
          <label className="font-[500] text-[#374151]">Chọn năm:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-[12px] py-[6px] rounded-[6px] border border-[#D1D5DB] w-[100px] focus:ring-[1px] focus:ring-[#7B68EE] outline-none"
          />
        </div>

        {loading && (
          <p className="text-center mt-[40px] text-[16px] text-[#6B7280] animate-pulse">
            Đang tải dữ liệu...
          </p>
        )}
        {error && (
          <p className="text-center mt-[40px] text-[16px] text-[#EF4444]">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <div className="flex flex-wrap gap-[24px] mb-[32px] p-[24px]">
              {/* Tổng nhập */}
              <div
                className="
                  flex-1
                  min-w-[260px]
                  flex items-center gap-[18px]
                  bg-[#16a34a] text-[#fff]
                  px-[32px] py-[28px]
                  rounded-[18px]
                  shadow-[0_4px_24px_0_rgba(22,163,74,0.15)]
                  transition-transform duration-300
                  hover:scale-[1.04]
                  hover:shadow-[0_8px_32px_0_rgba(22,163,74,0.22)]
                "
              >
                {/* Icon */}
                <div
                  className="
                    p-[18px]
                    bg-[#fff]/20
                    rounded-full
                    flex items-center justify-center
                    backdrop-blur-sm
                  "
                >
                  <ArrowUp className="h-[36px] w-[36px] text-[#fff]" />
                </div>

                {/* Text */}
                <div>
                  <p className="font-[600] text-[18px] mb-[4px]">Tổng nhập</p>
                  <p className="text-[28px] font-[700]">
                    <CountUp end={totalIn} duration={1.5} separator="," />
                  </p>
                </div>
              </div>

              {/* Tổng xuất */}
              <div
                className="
                  flex-1
                  min-w-[260px]
                  flex items-center gap-[18px]
                  bg-[#dc2626] text-[#fff]
                  px-[32px] py-[28px]
                  rounded-[18px]
                  shadow-[0_4px_24px_0_rgba(220,38,38,0.15)]
                  transition-transform duration-300
                  hover:scale-[1.04]
                  hover:shadow-[0_8px_32px_0_rgba(220,38,38,0.22)]
                "
              >
                {/* Icon */}
                <div
                  className="
                    p-[18px]
                    bg-[#fff]/20
                    rounded-full
                    flex items-center justify-center
                    backdrop-blur-sm
                  "
                >
                  <ArrowDown className="h-[36px] w-[36px] text-[#fff]" />
                </div>

                {/* Text */}
                <div>
                  <p className="font-[600] text-[18px] mb-[4px]">Tổng xuất</p>
                  <p className="text-[28px] font-[700]">
                    <CountUp end={totalOut} duration={1.5} separator="," />
                  </p>
                </div>
              </div>

              {/* Chênh lệch */}
              <div
                className="
                  flex-1
                  min-w-[260px]
                  flex items-center gap-[18px]
                  bg-[#2563eb] text-[#fff]
                  px-[32px] py-[28px]
                  rounded-[18px]
                  shadow-[0_4px_24px_0_rgba(37,99,235,0.15)]
                  transition-transform duration-300
                  hover:scale-[1.04]
                  hover:shadow-[0_8px_32px_0_rgba(37,99,235,0.22)]
                "
              >
                {/* Icon */}
                <div
                  className="
                    p-[18px]
                    bg-[#fff]/20
                    rounded-full
                    flex items-center justify-center
                    backdrop-blur-sm
                  "
                >
                  <BarChart2 className="h-[36px] w-[36px] text-[#fff]" />
                </div>

                {/* Text */}
                <div>
                  <p className="font-[600] text-[18px] mb-[4px]">Chênh lệch</p>
                  <p className="text-[28px] font-[700]">
                    <CountUp end={totalDiff} duration={1.5} separator="," />
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="p-[24px] overflow-x-auto">
              <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(123,104,238,0.04)]">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
                      <th className="px-[24px] py-[16px] font-[600] text-[#374151]">
                        Tháng
                      </th>
                      <th className="px-[24px] py-[16px] font-[600] text-[#16a34a]">
                        Nhập
                      </th>
                      <th className="px-[24px] py-[16px] font-[600] text-[#dc2626]">
                        Xuất
                      </th>
                      <th className="px-[24px] py-[16px] font-[600] text-[#2563eb]">
                        Chênh lệch
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((d, idx) => (
                      <tr
                        key={d.month}
                        className="hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF] transition"
                      >
                        <td className="px-[24px] py-[12px] font-[500]">
                          {d.month}
                        </td>
                        <td className="px-[24px] py-[12px] font-[500] text-[#16a34a]">
                          {d.Nhập}
                        </td>
                        <td className="px-[24px] py-[12px] font-[500] text-[#dc2626]">
                          {d.Xuất}
                        </td>
                        <td className="px-[24px] py-[12px] font-[500]">
                          {d.difference > 0 ? (
                            <span className="text-[#16a34a]">
                              ↗️ {d.difference}
                            </span>
                          ) : d.difference < 0 ? (
                            <span className="text-[#dc2626]">
                              ↘️ {Math.abs(d.difference)}
                            </span>
                          ) : (
                            <span className="text-[#2563eb]">➡️ 0</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bar Chart */}
            <h2 className="mb-[20px] text-[20px] font-[600] font-arial p-[24px]">
              📊 Biểu đồ nhập/xuất theo tháng
            </h2>
            <div className="p-[24px]">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="Nhập" fill="#16a34a" />
                  <Bar dataKey="Xuất" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
