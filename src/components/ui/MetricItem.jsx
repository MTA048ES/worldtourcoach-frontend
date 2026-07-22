const MetricItem = ({ label, value, sub, color }) => (
  <div className="bg-[#0a0e17] rounded-xl p-3 text-center transition-all hover:bg-[#1a2233] border border-[#1a2233] hover:border-[#2a3a5a]">
    <p className="text-lg font-bold" style={{ color }}>{value}</p>
    <p className="text-xs text-[#6b7a9f]">{label}</p>
    {sub && <p className="text-[10px] text-[#4b5563]">{sub}</p>}
  </div>
);

export default MetricItem;