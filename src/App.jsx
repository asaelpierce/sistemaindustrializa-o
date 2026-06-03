import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Upload, Trash2, Database, AlertCircle, FileSpreadsheet, 
  CheckCircle, RefreshCcw, Loader2, Calculator, Cloud, CloudOff, 
  ServerCrash, Truck, MapPin, ClipboardList, PackageOpen, ArrowRight, 
  LayoutDashboard, History, UploadCloud, Users, Clock, ShieldAlert, 
  ArrowLeftRight, ListChecks, Lock, Mail, LogOut, User, Shield, 
  ArrowUpCircle, UserPlus, KeyRound, Settings, XCircle, Info, 
  FileWarning, FileCheck, Layers, PieChart as PieChartIcon, Construction, Edit3,
  Calendar, Link2, Filter, Eye, AlertTriangle, FileSearch, Weight, Boxes,
  Building2, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, BarChart as BarChartIcon, Activity, Target,
  MessageSquare, X, Send, Bot, Paperclip, Save, Menu
} from 'lucide-react';

// ============================================================================
// RECHARTS COMPATIBILITY LAYER (MOCK ENGINE FOR ZERO-DEPENDENCY BUILD)
// Isso substitui a biblioteca 'recharts' para não dar erro no Vercel
// ============================================================================
export function ResponsiveContainer({ children, width = "100%", height = "100%" }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height: height || 300 });
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      {dimensions.width > 0 && dimensions.height > 0 && React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { containerWidth: dimensions.width, containerHeight: dimensions.height });
        }
        return child;
      })}
    </div>
  );
}

export const Bar = () => null;
export const Line = () => null;
export const XAxis = () => null;
export const YAxis = () => null;
export const CartesianGrid = () => null;
export const Tooltip = () => null;
export const Legend = () => null;
export const Cell = () => null;
export const LabelList = () => null;
export const Pie = () => null;

export function BarChart(props) { return <CartesianChart {...props} />; }
export function LineChart(props) { return <CartesianChart {...props} />; }
export function ComposedChart(props) { return <CartesianChart {...props} />; }

function CartesianChart({ 
  data = [], 
  layout = "horizontal", 
  containerWidth = 400, 
  containerHeight = 300, 
  margin = { top: 15, right: 15, left: 15, bottom: 15 },
  children 
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const childrenArray = React.Children.toArray(children);
  const gridChild = childrenArray.find(c => c.type === CartesianGrid);
  const xAxisChild = childrenArray.find(c => c.type === XAxis);
  const yAxisChildren = childrenArray.filter(c => c.type === YAxis);
  const tooltipChild = childrenArray.find(c => c.type === Tooltip);
  const legendChild = childrenArray.find(c => c.type === Legend);

  const series = childrenArray.filter(c => c.type === Bar || c.type === Line).map(c => ({
    type: c.type === Bar ? 'bar' : 'line',
    dataKey: c.props.dataKey,
    name: c.props.name || c.props.dataKey,
    fill: c.props.fill,
    stroke: c.props.stroke,
    yAxisId: c.props.yAxisId || 'left',
    props: c.props
  }));

  if (!data || data.length === 0 || series.length === 0) {
    return (
      <svg width={containerWidth} height={containerHeight}>
        <text x={containerWidth/2} y={containerHeight/2} textAnchor="middle" fill="#999" fontSize={12}>
          Sem dados para exibir
        </text>
      </svg>
    );
  }

  const xAxisKey = xAxisChild?.props?.dataKey || 'name';
  const leftPadding = layout === "vertical" ? 110 : 45;
  const bottomPadding = xAxisChild?.props?.angle ? 65 : 45;
  const padding = {
    top: margin.top || 15,
    right: margin.right || 15,
    left: margin.left !== undefined ? margin.left + leftPadding : leftPadding,
    bottom: margin.bottom !== undefined ? margin.bottom + bottomPadding : bottomPadding
  };

  const chartWidth = Math.max(50, containerWidth - padding.left - padding.right);
  const chartHeight = Math.max(50, containerHeight - padding.top - padding.bottom);

  const getRange = (yAxisId) => {
    const activeKeys = series.filter(s => s.yAxisId === yAxisId).map(s => s.dataKey);
    if (activeKeys.length === 0) return { min: 0, max: 100 };
    
    let vals = [];
    data.forEach(item => {
      activeKeys.forEach(k => {
        if (typeof k === 'function') vals.push(parseFloat(k(item)) || 0);
        else if (item[k] !== undefined) vals.push(parseFloat(item[k]) || 0);
      });
    });

    const maxVal = Math.max(...vals, 10);
    const getNiceMax = (max) => {
      if (max === 0) return 10;
      const log10 = Math.floor(Math.log10(max));
      const power = Math.pow(10, log10);
      const ratio = max / power;
      const targets = [1, 2, 5, 10];
      const target = targets.find(t => t >= ratio) || 10;
      return target * power;
    };

    return { min: 0, max: getNiceMax(maxVal) };
  };

  const leftRange = getRange('left');
  const rightRange = getRange('right');

  const getY = (val, yAxisId = 'left') => {
    const range = yAxisId === 'left' ? leftRange : rightRange;
    return padding.top + chartHeight - (val / range.max) * chartHeight;
  };

  const getX = (val) => padding.left + (val / leftRange.max) * chartWidth;

  const xStep = chartWidth / data.length;
  const getCategoryX = (idx) => padding.left + idx * xStep;
  const getCategoryCenter = (idx) => padding.left + (idx + 0.5) * xStep;

  const yStep = chartHeight / data.length;
  const getCategoryY = (idx) => padding.top + idx * yStep;
  const getCategoryCenterY = (idx) => padding.top + (idx + 0.5) * yStep;

  const gridTicks = [0, 0.25, 0.5, 0.75, 1];

  const getTooltipPayload = (idx) => {
    if (idx === null || idx === undefined || !data[idx]) return [];
    const item = data[idx];
    return series.map(s => {
      const val = typeof s.dataKey === 'function' ? s.dataKey(item) : item[s.dataKey];
      return {
        name: s.name,
        value: val,
        color: s.fill || s.stroke || '#eab308',
        dataKey: s.dataKey,
        payload: item
      };
    });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (layout === "horizontal") {
      const insideX = x - padding.left;
      if (insideX >= 0 && insideX <= chartWidth) {
        const idx = Math.floor(insideX / xStep);
        setHoveredIndex(idx >= 0 && idx < data.length ? idx : null);
      } else {
        setHoveredIndex(null);
      }
    } else {
      const insideY = y - padding.top;
      if (insideY >= 0 && insideY <= chartHeight) {
        const idx = Math.floor(insideY / yStep);
        setHoveredIndex(idx >= 0 && idx < data.length ? idx : null);
      } else {
        setHoveredIndex(null);
      }
    }
  };

  const formatCurrencyShort = (val) => {
      if (val === undefined || val === null || isNaN(val) || val === '') return '';
      const num = parseFloat(val);
      if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
      if (Math.abs(num) >= 1000) return (num / 1000).toFixed(0).replace('.', ',') + 'K';
      return num.toFixed(0);
  };

  return (
    <div 
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <svg width={containerWidth} height={containerHeight} className="overflow-visible select-none">
        
        {hoveredIndex !== null && layout === "horizontal" && (
          <rect x={getCategoryX(hoveredIndex)} y={padding.top} width={xStep} height={chartHeight} fill="rgba(255,255,255,0.05)" />
        )}
        {hoveredIndex !== null && layout === "vertical" && (
          <rect x={padding.left} y={getCategoryY(hoveredIndex)} width={chartWidth} height={yStep} fill="rgba(0,0,0,0.02)" />
        )}

        {gridChild && gridTicks.map((t, idx) => {
          if (layout === "horizontal") {
            const y = padding.top + t * chartHeight;
            return <line key={idx} x1={padding.left} y1={y} x2={padding.left + chartWidth} y2={y} stroke={gridChild.props.stroke || "#e4e4e7"} strokeDasharray={gridChild.props.strokeDasharray || "3 3"} />;
          } else {
            const x = padding.left + t * chartWidth;
            return <line key={idx} x1={x} y1={padding.top} x2={x} y2={padding.top + chartHeight} stroke={gridChild.props.stroke || "#f4f4f5"} strokeDasharray={gridChild.props.strokeDasharray || "3 3"} />;
          }
        })}

        {xAxisChild && layout === "horizontal" && data.map((item, idx) => {
          const label = item[xAxisKey];
          const cx = getCategoryCenter(idx);
          const cy = padding.top + chartHeight + 15;
          const formatter = xAxisChild.props.tickFormatter;
          const displayLabel = formatter ? formatter(label) : label;

          if (xAxisChild.props.angle) {
            return (
              <text key={idx} x={cx} y={cy} fontSize={xAxisChild.props.tick?.fontSize || 9} fontWeight="bold" fill={xAxisChild.props.tick?.fill || "#71717a"} textAnchor="end" transform={`rotate(${xAxisChild.props.angle}, ${cx}, ${cy})`}>
                {displayLabel}
              </text>
            );
          }
          return <text key={idx} x={cx} y={cy} fontSize={10} fontWeight="bold" fill="#71717a" textAnchor="middle">{displayLabel}</text>;
        })}

        {layout === "vertical" && gridTicks.map((t, idx) => {
          const val = t * leftRange.max;
          const cx = padding.left + t * chartWidth;
          const cy = padding.top + chartHeight + 15;
          return <text key={idx} x={cx} y={cy} fontSize={10} fontWeight="bold" fill="#71717a" textAnchor="middle">{formatCurrencyShort(val)}</text>;
        })}

        {yAxisChildren.find(y => y.props.yAxisId !== 'right') && layout === "horizontal" && gridTicks.map((t, idx) => {
          const val = (1 - t) * leftRange.max;
          const x = padding.left - 10;
          const y = padding.top + t * chartHeight + 4;
          const formatter = yAxisChildren.find(y => y.props.yAxisId !== 'right').props.tickFormatter;
          return <text key={idx} x={x} y={y} fontSize={10} fontWeight="bold" fill="#71717a" textAnchor="end">{formatter ? formatter(val) : val}</text>;
        })}

        {yAxisChildren.find(y => y.props.yAxisId === 'right') && layout === "horizontal" && gridTicks.map((t, idx) => {
          const val = (1 - t) * rightRange.max;
          const x = padding.left + chartWidth + 10;
          const y = padding.top + t * chartHeight + 4;
          const formatter = yAxisChildren.find(y => y.props.yAxisId === 'right').props.tickFormatter;
          return <text key={idx} x={x} y={y} fontSize={10} fontWeight="bold" fill="#71717a" textAnchor="start">{formatter ? formatter(val) : `${val}%`}</text>;
        })}

        {layout === "vertical" && data.map((item, idx) => {
          const label = item[xAxisKey];
          const x = padding.left - 10;
          const y = getCategoryCenterY(idx) + 4;
          return <text key={idx} x={x} y={y} fontSize={11} fontWeight="bold" fill="#52525b" textAnchor="end">{truncateText(label, 15)}</text>;
        })}

        {layout === "horizontal" ? (
          <>
            {series.filter(s => s.type === 'bar').map((s, seriesIdx, arr) => {
              const totalBars = arr.length;
              const barGroupWidth = xStep * 0.6;
              const barWidth = barGroupWidth / totalBars;

              return data.map((item, idx) => {
                const val = parseFloat(item[s.dataKey]) || 0;
                if (val === 0) return null;

                const cx = getCategoryCenter(idx);
                const startX = cx - barGroupWidth / 2;
                const x = startX + seriesIdx * barWidth + barWidth * 0.05;
                const w = barWidth * 0.9;
                const y = getY(val, s.yAxisId);
                const h = Math.max(2, padding.top + chartHeight - y);

                let fill = s.fill || '#eab308';
                if (s.props.fill === undefined && s.dataKey === 'Realizado') {
                  const prev = parseFloat(item['Previsto']) || 0;
                  fill = val < prev ? '#ef4444' : '#10b981';
                }

                if (s.props.children) {
                  const cells = React.Children.toArray(s.props.children).filter(c => c.type === Cell);
                  if (cells[idx]) fill = cells[idx].props.fill;
                }

                return (
                  <g key={`${seriesIdx}-${idx}`}>
                    <rect x={x} y={y} width={w} height={h} rx={2} fill={fill} opacity={hoveredIndex !== null && hoveredIndex !== idx ? 0.6 : 1} />
                    {React.Children.toArray(s.props.children).find(c => c.type === LabelList) && (
                      <text x={x + w / 2} y={y - 8} fill="#71717a" fontSize={9} fontWeight="bold" textAnchor="middle">
                        {s.props.dataKey === 'Lucro' || (s.props.dataKey === 'value' && s.name.includes('R$')) ? formatCurrencyShort(val) : val}
                      </text>
                    )}
                  </g>
                );
              });
            })}

            {series.filter(s => s.type === 'line').map((s, seriesIdx) => {
              const points = data.map((item, idx) => {
                const val = parseFloat(item[s.dataKey]) || 0;
                return { x: getCategoryCenter(idx), y: getY(val, s.yAxisId), val };
              });

              const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

              return (
                <g key={`line-${seriesIdx}`}>
                  <path d={pathD} fill="none" stroke={s.stroke || "#a1a1aa"} strokeWidth={s.props.strokeWidth || 3} strokeOpacity={s.props.strokeOpacity || 1} />
                  {points.map((p, idx) => {
                    let dotColor = s.stroke || '#a1a1aa';
                    if (s.dataKey === 'Conversão %') {
                      dotColor = p.val >= 30 ? '#10b981' : (p.val >= 15 ? '#eab308' : '#ef4444');
                    }
                    return (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r={4} fill={dotColor} stroke="#ffffff" strokeWidth={1.5} style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.3))' }} />
                        {s.dataKey === 'Conversão %' && p.val > 0 && (
                          <g>
                            <rect x={p.x - 22} y={p.y - 32} width={44} height={18} fill="#ffffff" rx={9} stroke="#e4e4e7" strokeWidth={1} />
                            <text x={p.x} y={p.y - 20} fill="#000000" fontSize={9} fontWeight="900" textAnchor="middle">{p.val.toFixed(1)}%</text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </>
        ) : (
          <>
            {series.filter(s => s.type === 'bar').map((s, seriesIdx, arr) => {
              const totalBars = arr.length;
              const barGroupHeight = yStep * 0.6;
              const barHeight = barGroupHeight / totalBars;

              return data.map((item, idx) => {
                const val = parseFloat(item[s.dataKey]) || 0;
                if (val === 0) return null;

                const cy = getCategoryCenterY(idx);
                const startY = cy - barGroupHeight / 2;
                const y = startY + seriesIdx * barHeight + barHeight * 0.05;
                const h = barHeight * 0.9;
                const x = padding.left;
                const w = Math.max(2, getX(val) - padding.left);

                let fill = s.fill || '#eab308';
                if (s.props.children) {
                  const cells = React.Children.toArray(s.props.children).filter(c => c.type === Cell);
                  if (cells[idx]) fill = cells[idx].props.fill;
                }

                return (
                  <g key={`${seriesIdx}-${idx}`}>
                    <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} opacity={hoveredIndex !== null && hoveredIndex !== idx ? 0.6 : 1} />
                    {React.Children.toArray(s.props.children).find(c => c.type === LabelList) && (
                      <text x={x + w + 8} y={y + h / 2 + 3} fill="#71717a" fontSize={10} fontWeight="bold" textAnchor="start">
                        {formatCurrencyShort(val)}
                      </text>
                    )}
                  </g>
                );
              });
            })}
          </>
        )}
      </svg>

      {legendChild && (
        <div className="flex justify-center items-center gap-6 mt-4 w-full" style={{ fontSize: '11px', fontWeight: 'bold' }}>
          {series.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div style={{ width: '12px', height: '12px', backgroundColor: s.fill || s.stroke || '#eab308', borderRadius: '3px' }} />
              <span className="text-zinc-600 font-bold">{s.name}</span>
            </div>
          ))}
        </div>
      )}

      {tooltipChild && hoveredIndex !== null && data[hoveredIndex] && (
        <div style={{ position: 'absolute', left: mousePos.x + 20, top: mousePos.y - 20, pointerEvents: 'none', zIndex: 100 }}>
          {React.isValidElement(tooltipChild.props.content) ? (
            React.cloneElement(tooltipChild.props.content, { active: true, payload: getTooltipPayload(hoveredIndex), label: data[hoveredIndex][xAxisKey] })
          ) : tooltipChild.props.content ? (
            React.createElement(tooltipChild.props.content, { active: true, payload: getTooltipPayload(hoveredIndex), label: data[hoveredIndex][xAxisKey] })
          ) : (
            <div className="bg-zinc-950 text-white p-3 rounded-xl border border-zinc-800 shadow-xl text-xs font-bold">
              <p className="border-b border-zinc-800 pb-1.5 mb-1.5 text-yellow-500">{data[hoveredIndex][xAxisKey]}</p>
              {getTooltipPayload(hoveredIndex).map((p, idx) => (
                <p key={idx} style={{ color: p.color }} className="flex justify-between gap-4 mb-0.5">
                  <span>{p.name}:</span>
                  <span>{p.value}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RechartsPieChart({ children, containerWidth = 300, containerHeight = 300 }) {
  return <PieChartComponent children={children} containerWidth={containerWidth} containerHeight={containerHeight} />;
}

export function PieChart({ children, containerWidth = 300, containerHeight = 300 }) {
  return <PieChartComponent children={children} containerWidth={containerWidth} containerHeight={containerHeight} />;
}

function PieChartComponent({ children, containerWidth = 300, containerHeight = 300 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const childrenArray = React.Children.toArray(children);
  const pieChild = childrenArray.find(c => c.type === Pie);
  const legendChild = childrenArray.find(c => c.type === Legend);

  if (!pieChild) return null;

  const data = pieChild.props.data || [];
  const dataKey = pieChild.props.dataKey || 'value';
  const cx = containerWidth / 2;
  const cy = containerHeight / 2;
  const outerRadius = pieChild.props.outerRadius || 90;
  const innerRadius = pieChild.props.innerRadius || 0;

  const total = data.reduce((acc, curr) => acc + (parseFloat(curr[dataKey]) || 0), 0);

  function getSectorPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
    const rad = Math.PI / 180;
    const x1 = cx + outerRadius * Math.cos(-startAngle * rad);
    const y1 = cy + outerRadius * Math.sin(-startAngle * rad);
    const x2 = cx + outerRadius * Math.cos(-endAngle * rad);
    const y2 = cy + outerRadius * Math.sin(-endAngle * rad);
    
    const x3 = cx + innerRadius * Math.cos(-endAngle * rad);
    const y3 = cy + innerRadius * Math.sin(-endAngle * rad);
    const x4 = cx + innerRadius * Math.cos(-startAngle * rad);
    const y4 = cy + innerRadius * Math.sin(-startAngle * rad);
    
    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  }

  let cumulativeAngle = pieChild.props.startAngle || 0;

  const slices = data.map((item, idx) => {
    const val = parseFloat(item[dataKey]) || 0;
    const percentage = total > 0 ? val / total : 0;
    const angleSpan = percentage * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle - angleSpan;
    cumulativeAngle = endAngle;

    const midAngle = startAngle - angleSpan / 2;
    const rad = Math.PI / 180;
    const labelRadius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const labelX = cx + labelRadius * Math.cos(-midAngle * rad);
    const labelY = cy + labelRadius * Math.sin(-midAngle * rad);

    let fill = CHART_COLORS[idx % CHART_COLORS.length];
    if (pieChild.props.children) {
      const cells = React.Children.toArray(pieChild.props.children).filter(c => c.type === Cell);
      if (cells[idx]) fill = cells[idx].props.fill;
    }

    return { name: item.name, value: val, percentage, startAngle, endAngle, labelX, labelY, fill, raw: item };
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <svg width={containerWidth} height={containerHeight} className="overflow-visible">
        {slices.map((slice, idx) => {
          const pathD = getSectorPath(cx, cy, innerRadius, outerRadius, slice.startAngle, slice.endAngle);
          const isHovered = hoveredIndex === idx;

          return (
            <g 
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
              style={{ transform: isHovered ? 'scale(1.03)' : 'none', transformOrigin: `${cx}px ${cy}px`, transition: 'transform 0.2s ease' }}
            >
              <path d={pathD} fill={slice.fill} stroke="#ffffff" strokeWidth={1.5} opacity={hoveredIndex !== null && hoveredIndex !== idx ? 0.75 : 1} />
              {slice.percentage > 0.05 && innerRadius > 40 && (
                <text x={slice.labelX} y={slice.labelY} fill="#ffffff" fontSize={10} fontWeight="900" textAnchor="middle" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }}>
                  {(slice.percentage * 100).toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {legendChild && (
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-4 w-full" style={{ fontSize: '11px', fontWeight: 'bold' }}>
          {slices.map((slice, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div style={{ width: '10px', height: '10px', backgroundColor: slice.fill, borderRadius: '2px' }} />
              <span className="text-zinc-600">{slice.name}</span>
            </div>
          ))}
        </div>
      )}

      {hoveredIndex !== null && slices[hoveredIndex] && (
        <div style={{ position: 'absolute', left: mousePos.x + 20, top: mousePos.y - 20, pointerEvents: 'none', zIndex: 100 }}>
          <div className="bg-zinc-950 text-white p-3 rounded-xl border border-zinc-800 shadow-xl text-xs font-bold">
            <p style={{ color: slices[hoveredIndex].fill }} className="flex justify-between gap-4 font-black">
              <span>{slices[hoveredIndex].name}:</span>
              <span>{slices[hoveredIndex].value} ({(slices[hoveredIndex].percentage * 100).toFixed(1)}%)</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CONFIGURAÇÃO DO SEU SUPABASE
// ============================================================================
const SUPABASE_URL = "https://mdsxiijlkruqnhbyxbhe.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_6vD-Jyf4pIJdOpvzXKDCOw_YUcX3TcG";
// ============================================================================

const CHART_COLORS = ['#eab308', '#10b981', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444', '#14b8a6', '#f43f5e', '#06b6d4', '#84cc16'];

export default function App() {
  const [supabase, setSupabase] = useState(null);
  const [dbOnline, setDbOnline] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  const [produtosDb, setProdutosDb] = useState({});
  const [estoqueDb, setEstoqueDb] = useState({});
  const [remessasDb, setRemessasDb] = useState([]);
  const [usuariosDb, setUsuariosDb] = useState([]); 
  const [chatInternoDb, setChatInternoDb] = useState([]);
  const [relatoriosIaDb, setRelatoriosIaDb] = useState([]);
  
  const [abaAtiva, setAbaAtiva] = useState('DASHBOARD');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [openAIApiKey, setOpenAIApiKey] = useState('');

  // Estados Formulário PCP
  const [codigoBusca, setCodigoBusca] = useState('');
  const [quantidadeProduzir, setQuantidadeProduzir] = useState(1);
  const [projeto, setProjeto] = useState('');
  const [cliente, setCliente] = useState(''); 
  const [observacao, setObservacao] = useState('Industrialização'); 
  const [outrosTexto, setOutrosTexto] = useState(''); 
  const [obsExpedicao, setObsExpedicao] = useState(''); 
  const [produtoEncontrado, setProdutoEncontrado] = useState(null);
  const [itensRemessa, setItensRemessa] = useState([]);
  const [itensOriginaisBOM, setItensOriginaisBOM] = useState([]); 
  
  const [isComplemento, setIsComplemento] = useState(false);
  const [opPaiIdSelecionada, setOpPaiIdSelecionada] = useState('');
  const [modoManualAtivo, setModoManualAtivo] = useState(false);
  const [novoItemManual, setNovoItemManual] = useState({ codigoMP: '', descricao: '', quantidade: '', um: 'UN' });

  // Estados Gestão de Acessos
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', perfil: 'PCP' });
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Estados Rateio
  const [modalRateioAberto, setModalRateioAberto] = useState(false);
  const [idxItemRateio, setIdxItemRateio] = useState(null);
  const [novoRateio, setNovoRateio] = useState({ projeto: '', codigoPA: '', quantidade: '' });
  const ITENS_RATEIO = ['4941', '4942', '552', '187'];

  // Estados Expedição
  const [remessaSelecionada, setRemessaSelecionada] = useState(null);
  const [formExpedicao, setFormExpedicao] = useState({
    transporte: '', transportadora: '', quantidade: '', pesoTotal: '', destinatario: '', dataSaida: new Date().toISOString().split('T')[0]
  });
  const [templateBuffer, setTemplateBuffer] = useState(null);
  const [nomeTemplate, setNomeTemplate] = useState('');

  // Estados Logística e Filtros
  const [buscaFornecedor, setBuscaFornecedor] = useState('');
  const [remessaParaRetorno, setRemessaParaRetorno] = useState(null);
  const [qtdPecasRetornando, setQtdPecasRetornando] = useState('');
  
  const [filtrosControle, setFiltrosControle] = useState({ projeto: '', pa: '', mp: '', status: '' });
  const [sortControle, setSortControle] = useState({ key: 'data_envio', dir: 'desc' });

  const [filtrosHistorico, setFiltrosHistorico] = useState({ projeto: '', pa: '', cliente: '', status: '' });
  const [sortHistorico, setSortHistorico] = useState({ key: 'data_criacao', dir: 'desc' });

  const [filtrosAuditoria, setFiltrosAuditoria] = useState({ projeto: '', pa: '', mp: '', status: '' });
  const [sortAuditoria, setSortAuditoria] = useState({ key: 'data', dir: 'desc' });

  // Estados Dashboard e IA
  const [modalDetalheProjetoAberto, setModalDetalheProjetoAberto] = useState(false);
  const [projetoDetalheSelecionado, setProjetoDetalheSelecionado] = useState(null);
  const [buscaDetalheProjeto, setBuscaDetalheProjeto] = useState('');
  const [modalAtrasosAberto, setModalAtrasosAberto] = useState(false);
  const [filtroMesDashboard, setFiltroMesDashboard] = useState('ALL');

  // Chat IA Analista (Página)
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', content: 'Olá! Sou o Analista IA (GPT-5.5). Posso gerar relatórios, ler dados complexos e desenhar gráficos corporativos. Como posso ajudar hoje?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Chat IA Copiloto (Flutuante)
  const [isMiniIaOpen, setIsMiniIaOpen] = useState(false);
  const [miniIaMessages, setMiniIaMessages] = useState([{ role: 'assistant', content: 'Sou seu Copiloto IA. Posso fazer cálculos rápidos ou checar dados.' }]);
  const [miniIaInput, setMiniIaInput] = useState('');
  const [isMiniIaLoading, setIsMiniIaLoading] = useState(false);
  
  // Chat Interno (Equipe)
  const [isChatEquipeOpen, setIsChatEquipeOpen] = useState(false);
  const [chatEquipeInput, setChatEquipeInput] = useState('');
  const [chatEquipeDestinatario, setChatEquipeDestinatario] = useState('Geral');
  const [chatEquipeHasUnread, setChatEquipeHasUnread] = useState(false);
  const chatMessagesEndRef = useRef(null);

  // Modo Apresentação de Relatório (IA)
  const [relatorioApresentacao, setRelatorioApresentacao] = useState(null);

  // Estado Menu Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NÍVEIS DE ACESSO
  const isAdmin = usuarioLogado?.perfil === 'ADMIN';
  const isPCP = usuarioLogado?.perfil === 'PCP' || isAdmin;
  const isExp = usuarioLogado?.perfil === 'EXPEDICAO' || isAdmin;

  // FORMATADORES
  const s = (val) => (val === null || val === undefined) ? "" : String(val);
  const fmtDec = (val, unit = '') => {
      if (val === undefined || val === null || isNaN(val) || val === '') return '-';
      const num = parseFloat(val);
      const str = Number.isInteger(num) ? num.toString() : num.toFixed(2).replace('.', ',');
      return unit ? `${str} ${unit}` : str;
  };
  const parseNumBR = (v) => {
    if (typeof v === 'number') return v;
    if (!v) return 0;
    let str = s(v?.result || v).trim();
    if (str.includes('.') && str.includes(',')) {
      if (str.indexOf('.') < str.indexOf(',')) str = str.replace(/\./g, '').replace(',', '.');
      else str = str.replace(/,/g, '');
    } else { str = str.replace(',', '.'); }
    return parseFloat(str) || 0;
  };
  const normalizeKey = (k) => s(k).toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").replace(/[.-]/g, "");

  useEffect(() => {
    const scripts = [
      { id: 'xlsx-lib', src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js' },
      { id: 'exceljs-lib', src: 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js' },
      { id: 'supabase-lib', src: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2' }
    ];
    scripts.forEach(scriptObj => {
      if (!document.getElementById(scriptObj.id)) {
        const script = document.createElement('script'); script.id = scriptObj.id; script.src = scriptObj.src; script.async = true; document.body.appendChild(script);
      }
    });
    const checkInterval = setInterval(() => {
      if (window.supabase) {
        try { const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); setSupabase(client); clearInterval(checkInterval); } catch (e) {}
      }
    }, 500);
    return () => clearInterval(checkInterval);
  }, []);

  const fetchAllData = async () => {
    if (!supabase) return;
    try {
      const [prodRes, estRes, remRes, userRes, configRes, chatRes, relRes] = await Promise.all([
        supabase.from('produtos').select('*'),
        supabase.from('estoque_mp').select('*'),
        supabase.from('remessas').select('*').order('data_criacao', { ascending: false }),
        supabase.from('perfis_usuarios').select('*'),
        supabase.from('configuracoes').select('*').in('chave', ['modelo_sgq', 'openai_api_key']),
        supabase.from('chat_interno').select('*').order('data_envio', { ascending: true }),
        supabase.from('relatorios_ia').select('*').order('data_criacao', { ascending: false })
      ]);
      
      if (prodRes.data) { const pMap = {}; prodRes.data.forEach(p => { if(p.codigo_pa) pMap[p.codigo_pa] = p; }); setProdutosDb(pMap); }
      if (estRes.data) { const eMap = {}; estRes.data.forEach(e => { if(e.codigo_mp) eMap[e.codigo_mp] = e; }); setEstoqueDb(eMap); }
      if (remRes.data) setRemessasDb(remRes.data);
      if (userRes.data) setUsuariosDb(userRes.data);
      if (configRes.data) {
        const modelo = configRes.data.find(c => c.chave === 'modelo_sgq');
        if (modelo && modelo.valor_json) {
           const b64 = modelo.valor_json.data; setNomeTemplate(modelo.valor_json.nome);
           const binaryString = window.atob(b64); const bytes = new Uint8Array(binaryString.length);
           for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
           setTemplateBuffer(bytes.buffer);
        }
        const apiConf = configRes.data.find(c => c.chave === 'openai_api_key');
        if (apiConf && apiConf.valor_json) setOpenAIApiKey(apiConf.valor_json.key);
      }
      if (chatRes.data) {
         if (chatInternoDb.length > 0 && chatRes.data.length > chatInternoDb.length && !isChatEquipeOpen) setChatEquipeHasUnread(true);
         setChatInternoDb(chatRes.data);
      }
      if (relRes.data) setRelatoriosIaDb(relRes.data);
      
      setDbOnline(true);
    } catch (e) { setDbOnline(false); }
  };

  useEffect(() => { if (supabase) { fetchAllData(); const interval = setInterval(fetchAllData, 10000); return () => clearInterval(interval); } }, [supabase, isChatEquipeOpen]);

  useEffect(() => { if (chatMessagesEndRef.current) chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [chatInternoDb, isChatEquipeOpen]);

  const handleSort = (state, setState, key) => { setState(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' })); };
  const renderSortIcon = (tableSort, key) => {
    if(tableSort.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20 inline" />;
    return tableSort.dir === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-indigo-600 inline" /> : <ArrowDown className="w-3 h-3 ml-1 text-indigo-600 inline" />;
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setErroLogin('');
    if (!supabase) return setErroLogin('Conectando ao servidor...');
    setIsLoading(true);
    try {
      const { data } = await supabase.from('perfis_usuarios').select('*').eq('email', emailLogin.toLowerCase().trim()).eq('senha', senhaLogin).single();
      if (data) { setUsuarioLogado(data); setAbaAtiva(data.perfil === 'EXPEDICAO' ? 'EXPEDICAO' : 'DASHBOARD'); } 
      else { setErroLogin('Dados inválidos.'); }
    } catch (err) { setErroLogin('Falha de acesso.'); } finally { setIsLoading(false); }
  };

  const salvarUsuario = async (e) => {
    e.preventDefault(); setIsLoading(true);
    try {
      const { error } = await supabase.from('perfis_usuarios').upsert([novoUsuario], { onConflict: 'email' });
      if (error) throw error;
      setSucesso("Acesso gravado!"); setNovoUsuario({ nome: '', email: '', senha: '', perfil: 'PCP' }); setIsEditingUser(false); fetchAllData();
    } catch (err) { setErro("Erro: " + err.message); } finally { setIsLoading(false); }
  };

  const excluirUsuario = async (email) => {
    if (email === usuarioLogado?.email) return setErro("Não pode remover o seu próprio acesso.");
    if (window.confirm("Remover permanentemente?")) { await supabase.from('perfis_usuarios').delete().eq('email', email); setSucesso("Removido."); fetchAllData(); }
  };

  const buscarProduto = (e) => {
    if (e) e.preventDefault(); setErro(''); setModoManualAtivo(false);
    const cod = codigoBusca.toUpperCase().trim(); const produto = produtosDb[cod];
    if (produto) {
      setProdutoEncontrado(produto);
      const list = (produto.materiais || []).map(m => {
        const est = estoqueDb[m.codigoMP] || { saldo_disponivel: 0, descricao: 'Não catalogado' };
        const qtdBase = Number((m.quantidade * parseNumBR(quantidadeProduzir)).toFixed(4));
        return { ...m, saldoDisponivel: est.saldo_disponivel, descricao: est.descricao, quantidadeTotal: qtdBase, quantidadeOriginal: qtdBase, quantidadeRetornada: 0, rateiosExtras: [] };
      });
      setItensRemessa(list); setItensOriginaisBOM(list);
    } else {
      if(window.confirm('Produto não cadastrado na BOM. Deseja iniciar uma remessa manual?')) {
         setModoManualAtivo(true); setProdutoEncontrado({ codigo_pa: cod, descricao: 'ITEM MANUAL' }); setItensRemessa([]); setItensOriginaisBOM([]);
      } else { setErro('Busca cancelada.'); }
    }
  };

  const adicionarItemManual = () => {
     if(!novoItemManual.codigoMP || !novoItemManual.descricao || !novoItemManual.quantidade) return setErro("Preencha código, descrição e quantidade.");
     const est = estoqueDb[novoItemManual.codigoMP.toUpperCase()] || { saldo_disponivel: 0, descricao: novoItemManual.descricao };
     const qtdBase = parseNumBR(novoItemManual.quantidade);
     const newItem = { codigoMP: novoItemManual.codigoMP.toUpperCase(), descricao: novoItemManual.descricao.toUpperCase(), um: novoItemManual.um.toUpperCase(), quantidadeTotal: qtdBase, quantidadeOriginal: qtdBase, quantidadeRetornada: 0, rateiosExtras: [], saldoDisponivel: est.saldo_disponivel };
     setItensRemessa(prev => [...prev, newItem]); setNovoItemManual({ codigoMP: '', descricao: '', quantidade: '', um: 'UN' });
  };

  const enviarParaExpedicao = async () => {
    if(!projeto || !cliente) return setErro("Projeto e Cliente são obrigatórios.");
    if(isComplemento && !opPaiIdSelecionada) return setErro("Selecione a OP Original (Pai) que esta remessa irá complementar.");
    const servFinal = observacao === 'Outros' ? (outrosTexto || 'Outros') : observacao;
    
    // Validação de Estoque antes do envio
    const semSaldo = itensRemessa.filter(it => it.saldoDisponivel < it.quantidadeTotal);
    if(semSaldo.length > 0) return setErro(`Erro: Materiais sem saldo suficiente (${semSaldo.map(s => s.codigoMP).join(', ')}). Verifique se o material ainda está com terceiros ou corrija o estoque.`);

    const removidos = itensOriginaisBOM.filter(orig => !itensRemessa.find(it => it.codigoMP === orig.codigoMP)).map(r => ({ codigoMP: s(r.codigoMP), descricao: s(r.descricao), quantidade: Number(r.quantidadeTotal), um: s(r.um) }));

    // -> LÓGICA DE REGISTRO DE MATERIAIS ALTERADOS <-
    const alterados = itensRemessa.filter(it => {
       const desc = s(it.descricao).toUpperCase();
       const isEd = desc.includes('BORRACHA') || desc.includes('CHEMITAC') || desc.includes('COLA') || ITENS_RATEIO.includes(s(it.codigoMP));
       return isEd && it.quantidadeTotal !== it.quantidadeOriginal;
    });

    let notaFinalExpedicao = obsExpedicao;
    if (alterados.length > 0) {
       const notaAjuste = `[Ajuste PCP: ${alterados.map(a => {
           const diff = a.quantidadeTotal - a.quantidadeOriginal;
           return `${a.codigoMP} (${diff > 0 ? '+' : ''}${fmtDec(diff, a.um)})`;
       }).join(' | ')}]`;
       notaFinalExpedicao = notaFinalExpedicao ? `${notaFinalExpedicao} - ${notaAjuste}` : notaAjuste;
    }
    // ----------------------------------------------

    setIsLoading(true);
    try {
      for (const it of itensRemessa) {
        const { data: cur } = await supabase.from('estoque_mp').select('saldo_disponivel').eq('codigo_mp', it.codigoMP).single();
        await supabase.from('estoque_mp').update({ saldo_disponivel: Number(((cur?.saldo_disponivel || 0) - it.quantidadeTotal).toFixed(4)) }).eq('codigo_mp', it.codigoMP);
      }
      const newRemessa = {
        id: `REM-${Date.now()}`, produto_acabado: s(produtoEncontrado.codigo_pa), descricao_produto: s(produtoEncontrado.descricao),
        quantidade_op: parseNumBR(quantidadeProduzir), projeto: s(projeto).toUpperCase(), cliente: s(cliente).toUpperCase(),
        observacao: s(servFinal), obs_expedicao: s(notaFinalExpedicao), itens: itensRemessa, itens_removidos: removidos,
        status: 'PENDENTE_EXPEDICAO', criado_por: s(usuarioLogado?.nome || 'PCP'), pecas_recebidas: 0,
        remessa_pai_id: isComplemento ? s(opPaiIdSelecionada) : null
      };
      const { error: errIns } = await supabase.from('remessas').insert([newRemessa]);
      if (errIns) throw errIns;
      setSucesso('Enviado para a Expedição!'); setIsLoading(false); setProdutoEncontrado(null); setOutrosTexto(''); setObsExpedicao(''); setCliente(''); setIsComplemento(false); setOpPaiIdSelecionada(''); setModoManualAtivo(false); setAbaAtiva('HISTORICO_PCP'); fetchAllData();
    } catch (e) { setErro("Erro no envio: " + e.message); setIsLoading(false); }
  };

  const concluirExpedicao = async () => {
    if (!templateBuffer) return setErro("Modelo SGQ ausente.");
    if (!formExpedicao.transporte || !formExpedicao.destinatario) return setErro("Preencha Transporte e Destinatário.");
    setIsLoading(true);
    try {
      const { error: errExp } = await supabase.from('remessas').update({ status: 'ENVIADO', data_envio: new Date().toISOString(), enviado_por: s(usuarioLogado?.nome || 'Logística'), expedicao: formExpedicao }).eq('id', remessaSelecionada.id);
      if (errExp) throw errExp;
      const wb = new window.ExcelJS.Workbook(); await wb.xlsx.load(templateBuffer); const ws = wb.worksheets[0];
      ws.getCell('B4').value = s(remessaSelecionada.projeto); ws.getCell('C4').value = s(remessaSelecionada.cliente);
      ws.getCell('B6').value = s(formExpedicao.transporte); ws.getCell('C6').value = s(formExpedicao.transportadora);
      ws.getCell('B8').value = Number(formExpedicao.quantidade); ws.getCell('C8').value = s(formExpedicao.pesoTotal);
      ws.getCell('E8').value = `${s(remessaSelecionada.projeto)} - ${s(formExpedicao.destinatario)}`; ws.getCell('G8').value = s(formExpedicao.dataSaida);
      (remessaSelecionada.itens || []).forEach((it, i) => { const r = 12+i; ws.getCell(`C${r}`).value = s(it.codigoMP); ws.getCell(`E${r}`).value = s(it.descricao); ws.getCell(`F${r}`).value = Number(it.quantidadeTotal); ws.getCell(`G${r}`).value = s(it.um); ws.getCell(`H${r}`).value = s(remessaSelecionada.observacao); });
      const buf = await wb.xlsx.writeBuffer(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([buf])); a.download = `SGQ_${s(remessaSelecionada.projeto)}.xlsx`; a.click();
      setSucesso('Finalizado com Sucesso!'); setRemessaSelecionada(null); setIsLoading(false); fetchAllData();
    } catch (e) { setErro("Falha Excel."); setIsLoading(false); }
  };

  const processarRetornoParcial = async () => {
    const pecasDevolvidas = parseNumBR(qtdPecasRetornando); const rem = remessaParaRetorno; if(!rem) return;
    const pecasJaRecebidas = Number(rem.pecas_recebidas || 0); const saldoPendente = Number(rem.quantidade_op) - pecasJaRecebidas;
    if (pecasDevolvidas <= 0 || pecasDevolvidas > saldoPendente) return setErro("Quantidade Inválida.");
    setIsLoading(true);
    try {
      const proporcao = pecasDevolvidas / Number(rem.quantidade_op); const novosItens = [...(rem.itens || [])];
      for (let i = 0; i < novosItens.length; i++) {
          const qtdMP = Number((novosItens[i].quantidadeTotal * proporcao).toFixed(4));
          novosItens[i].quantidadeRetornada = Number(((novosItens[i].quantidadeRetornada || 0) + qtdMP).toFixed(4));
          const { data: cur } = await supabase.from('estoque_mp').select('saldo_disponivel').eq('codigo_mp', novosItens[i].codigoMP).single();
          await supabase.from('estoque_mp').update({ saldo_disponivel: Number(((cur?.saldo_disponivel || 0) + qtdMP).toFixed(4)) }).eq('codigo_mp', novosItens[i].codigoMP);
      }
      const novoTotalJa = pecasJaRecebidas + pecasDevolvidas; const novoStatus = novoTotalJa >= Number(rem.quantidade_op) ? 'RETORNADO' : 'RETORNO_PARCIAL';
      const { error } = await supabase.from('remessas').update({ itens: novosItens, status: novoStatus, pecas_recebidas: novoTotalJa, data_retorno: new Date().toISOString(), recebido_por: s(usuarioLogado?.nome || 'Sistema') }).eq('id', rem.id);
      if (error) throw error;
      setSucesso('Estoque creditado com as entradas!'); setRemessaParaRetorno(null); setQtdPecasRetornando(''); fetchAllData();
    } catch (e) { setErro("Erro no retorno."); } finally { setIsLoading(false); }
  };

  const dashboardProjetosAgrupados = useMemo(() => {
     const map = {};
     remessasDb.forEach(r => {
        if (!r.remessa_pai_id) {
           map[r.id] = { ...r, filhos: [], metaPA: Number(r.quantidade_op || 0), totalEnviado: Number(r.quantidade_op || 0), mpsConsumidas: [], pecasFisicasSaidas: [], mpsRemovidas: [] };
           if (['ENVIADO', 'RETORNO_PARCIAL', 'RETORNADO'].includes(r.status)) {
              map[r.id].pecasFisicasSaidas.push({ id: r.id, pa: r.produto_acabado, desc: r.descricao_produto, qtd: Number(r.quantidade_op || 0), data: r.data_envio, tipo: 'Raiz' });
           }
           if (Array.isArray(r.itens)) {
              r.itens.forEach(it => { map[r.id].mpsConsumidas.push({ codigoMP: s(it.codigoMP), descricao: it.descricao, um: it.um, qtdAcumulada: Number(it.quantidadeTotal || 0), qtdRetornada: Number(it.quantidadeRetornada || 0) }); });
           }
           if (Array.isArray(r.itens_removidos)) {
              r.itens_removidos.forEach(it => { map[r.id].mpsRemovidas.push({ codigoMP: s(it.codigoMP), descricao: it.descricao, um: it.um, qtd: Number(it.quantidade || 0) }); });
           }
        }
     });

     remessasDb.forEach(r => {
        if (r.remessa_pai_id && map[r.remessa_pai_id]) {
           const pai = map[r.remessa_pai_id];
           pai.filhos.push(r); pai.totalEnviado += Number(r.quantidade_op || 0);
           if (['ENVIADO', 'RETORNO_PARCIAL', 'RETORNADO'].includes(r.status)) {
              pai.pecasFisicasSaidas.push({ id: r.id, pa: r.produto_acabado, desc: r.descricao_produto, qtd: Number(r.quantidade_op || 0), data: r.data_envio, tipo: 'Complemento' });
           }
           if (Array.isArray(r.itens)) {
              r.itens.forEach(it => {
                 const mp = s(it.codigoMP); const ex = pai.mpsConsumidas.find(x => x.codigoMP === mp);
                 if (ex) { ex.qtdAcumulada += Number(it.quantidadeTotal || 0); ex.qtdRetornada += Number(it.quantidadeRetornada || 0); }
                 else pai.mpsConsumidas.push({ codigoMP: mp, descricao: it.descricao, um: it.um, qtdAcumulada: Number(it.quantidadeTotal || 0), qtdRetornada: Number(it.quantidadeRetornada || 0) });
              });
           }
           if (Array.isArray(r.itens_removidos)) {
              r.itens_removidos.forEach(it => {
                 const mp = s(it.codigoMP); const ex = pai.mpsRemovidas.find(x => x.codigoMP === mp);
                 if (ex) { ex.qtd += Number(it.quantidade || 0); }
                 else pai.mpsRemovidas.push({ codigoMP: mp, descricao: it.descricao, um: it.um, qtd: Number(it.quantidade || 0) });
              });
           }
        }
     });
     return Object.values(map).sort((a,b) => new Date(b.data_criacao) - new Date(a.data_criacao));
  }, [remessasDb]);

  const dashboardData = useMemo(() => {
    let listAgrupada = [...dashboardProjetosAgrupados];
    if(filtroMesDashboard !== 'ALL') { listAgrupada = listAgrupada.filter(r => r.data_criacao && new Date(r.data_criacao).getMonth() + 1 === parseInt(filtroMesDashboard)); }

    const topMpsMap = {}; const topPasMap = {}; const destMap = {};
    let kpiTotalOps = 0; let kpiEmTransito = 0; let kpiConcluidas = 0; let kpiVolumePecas = 0; let opsAtrasadas = [];

    listAgrupada.forEach(pai => {
       kpiTotalOps += 1 + pai.filhos.length;
       
       let paiEstaNaRua = false;
       if(['ENVIADO', 'RETORNO_PARCIAL'].includes(pai.status)) paiEstaNaRua = true;
       else if(pai.status === 'RETORNADO') kpiConcluidas++;

       if(paiEstaNaRua) { kpiEmTransito++; if (pai.data_envio) { const dias = Math.floor((new Date() - new Date(pai.data_envio))/(1000*60*60*24)); if (dias > 20) opsAtrasadas.push({ id: pai.id, projeto: pai.projeto, pa: pai.produto_acabado, destinatario: pai.expedicao?.destinatario, dias }); } }
       
       pai.filhos.forEach(f => {
          let fEstaNaRua = false;
          if(['ENVIADO', 'RETORNO_PARCIAL'].includes(f.status)) fEstaNaRua = true;
          else if(f.status === 'RETORNADO') kpiConcluidas++;

          if(fEstaNaRua) { kpiEmTransito++; if (f.data_envio) { const dias = Math.floor((new Date() - new Date(f.data_envio))/(1000*60*60*24)); if (dias > 20) opsAtrasadas.push({ id: f.id, projeto: f.projeto, pa: f.produto_acabado, destinatario: f.expedicao?.destinatario, dias }); } }
       });

       kpiVolumePecas += pai.totalEnviado;
       if(pai.produto_acabado) topPasMap[s(pai.produto_acabado)] = (topPasMap[s(pai.produto_acabado)] || 0) + pai.totalEnviado;
       pai.mpsConsumidas.forEach(mp => { 
           const shortDesc = s(mp.descricao).substring(0, 18) + (s(mp.descricao).length > 18 ? '...' : '');
           const displayName = `${mp.codigoMP} - ${shortDesc}`;
           topMpsMap[mp.codigoMP] = { nome: displayName, desc: mp.descricao, enviado: (topMpsMap[mp.codigoMP]?.enviado || 0) + mp.qtdAcumulada, retornado: (topMpsMap[mp.codigoMP]?.retornado || 0) + mp.qtdRetornada }; 
       });
       const dest = s(pai.expedicao?.destinatario || pai.cliente);
       if(dest && ['ENVIADO', 'RETORNO_PARCIAL', 'RETORNADO'].includes(pai.status)) destMap[dest] = (destMap[dest] || 0) + 1;
    });

    const mpsChart = Object.values(topMpsMap).sort((a,b) => b.enviado - a.enviado).slice(0, 5);
    const pasChart = Object.entries(topPasMap).map(([name, value]) => ({name, value})).sort((a,b) => b.value - a.value).slice(0, 5);
    const destChart = Object.entries(destMap).map(([name, value]) => ({name, value})).sort((a,b) => b.value - a.value).slice(0, 5);

    return { kpiTotalOps, kpiEmTransito, kpiConcluidas, kpiVolumePecas, mpsChart, pasChart, destChart, opsAtrasadas };
  }, [dashboardProjetosAgrupados, filtroMesDashboard]);

  const parseBotMessage = (content) => {
     if (!content) return [];
     const parts = []; let lastIndex = 0; const regex = /<(CHART|INSIGHT)>([\s\S]*?)<\/\1>/g; let match;
     while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            const rawText = content.substring(lastIndex, match.index);
            const formatted = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*)/g, '<br/><span class="text-indigo-600 font-black uppercase text-xs">$1</span><br/>').replace(/\n/g, '<br/>');
            parts.push({ type: 'text', content: formatted });
        }
        try {
           let jsonStr = match[2].trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
           parts.push({ type: match[1], payload: JSON.parse(jsonStr) });
        } catch(e) { parts.push({ type: 'error', content: `[Falha estrutural ao desenhar gráfico da IA]` }); }
        lastIndex = regex.lastIndex;
     }
     if (lastIndex < content.length) {
         const rawText = content.substring(lastIndex);
         const formatted = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*)/g, '<br/><span class="text-indigo-600 font-black uppercase text-xs">$1</span><br/>').replace(/\n/g, '<br/>');
         parts.push({ type: 'text', content: formatted });
     }
     return parts;
  };

  const enviarMensagemGPT = async (e) => {
     e.preventDefault(); if(!chatInput.trim() || !openAIApiKey) return;
     const novaMsg = { role: 'user', content: chatInput }; setChatMessages(prev => [...prev, novaMsg]); setChatInput(''); setIsChatLoading(true);
     try {
        const resumoRemessas = remessasDb.map(r => ({ 
            data_criacao: r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '', 
            data_envio: r.data_envio ? new Date(r.data_envio).toLocaleDateString('pt-BR') : '', 
            prj_br: s(r.projeto), 
            cliente: s(r.cliente), 
            destinatario: s(r.expedicao?.destinatario || r.cliente), 
            pa: s(r.produto_acabado), 
            qtd_enviada_pa: Number(r.quantidade_op), 
            qtd_recebida_de_volta_pa: Number(r.pecas_recebidas || 0), 
            saldo_na_rua_pa: Number(r.quantidade_op) - Number(r.pecas_recebidas || 0), 
            status: s(r.status), 
            obs: s(r.observacao), 
            mps_consumidas: Array.isArray(r.itens) ? r.itens.map(i => `${i.codigoMP}(${Number(i.quantidadeTotal)}${s(i.um)})`).join(', ') : '', 
            mps_removidas_auditoria: Array.isArray(r.itens_removidos) ? r.itens_removidos.map(i => `${i.codigoMP}(${Number(i.quantidade)}${s(i.um)})`).join(', ') : '' 
        }));
        const resumoEstoque = Object.values(estoqueDb).map(e => ({ mp: e.codigo_mp, desc: s(e.descricao).substring(0, 20), saldo: Number(e.saldo_disponivel), um: s(e.unidade) }));
        const dadosSistema = JSON.stringify({ remessas: resumoRemessas, estoque: resumoEstoque });

        const contextoGlobal = `Você é o Cientista de Dados Sênior e Analista Executivo do Kalenborn SGQ.
Regras: 
1. Use markdown para textos longos (negrito, listas). Formate números monetários ou métricos adequadamente. SEMPRE inclua a Unidade de Medida (UM) para materiais físicos.
2. GERE GRÁFICOS MULTI-MÉTRICAS usando a tag XML <CHART>. Para comparar valores, passe múltiplas chaves numéricas no JSON.
EXEMPLO OBRIGATÓRIO DE GRÁFICO:
<CHART>{"title": "Comparativo de Fluxo", "data": [{"name": "Aço", "Enviado": 150.50, "Retornado": 90}, {"name": "Borracha", "Enviado": 90, "Retornado": 20}]}</CHART>
3. GERE INSIGHTS GERENCIAIS com a tag <INSIGHT> contendo JSON válido.
EXEMPLO OBRIGATÓRIO DE INSIGHT:
<INSIGHT>{"title": "Alerta de Gargalo", "text": "Identifiquei que o **material X** está com terceiros há mais de 10 dias..."}</INSIGHT>
DADOS REAIS DA EMPRESA: ${dadosSistema}`;
        
        let response;
        try {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
               method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAIApiKey}` },
               body: JSON.stringify({ model: 'gpt-5.5', messages: [{ role: 'system', content: contextoGlobal }, ...chatMessages.map(m => ({role: m.role, content: m.content})), novaMsg], max_tokens: 8000, temperature: 0.1 })
            });
            if(!response.ok) throw new Error("Fallback para GPT-4o");
        } catch(fallbackErr) {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
               method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAIApiKey}` },
               body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'system', content: contextoGlobal }, ...chatMessages.map(m => ({role: m.role, content: m.content})), novaMsg], max_tokens: 4000, temperature: 0.1 })
            });
        }
        
        if(!response.ok) throw new Error("Falha na API");
        const data = await response.json();
        if(data.choices && data.choices[0]) setChatMessages(prev => [...prev, data.choices[0].message]);
     } catch (err) { setChatMessages(prev => [...prev, { role: 'assistant', content: '❌ Falha de processamento no motor de Inteligência. Verifique a chave.' }]); } finally { setIsChatLoading(false); }
  };

  const enviarMensagemMiniIA = async (e) => {
     e.preventDefault(); if(!miniIaInput.trim() || !openAIApiKey) return;
     const novaMsg = { role: 'user', content: miniIaInput }; setMiniIaMessages(prev => [...prev, novaMsg]); setMiniIaInput(''); setIsMiniIaLoading(true);
     try {
        const resumoRemessas = remessasDb.map(r => ({ prj: r.projeto, pa: r.produto_acabado, qtd_enviada: Number(r.quantidade_op), qtd_recebida: Number(r.pecas_recebidas||0), status: r.status, destinatario: s(r.expedicao?.destinatario), data_envio: r.data_envio, mps_vinculadas: Array.isArray(r.itens) ? r.itens.map(i=>i.codigoMP).join(',') : '' }));
        const contextoGlobal = `Você é o Copiloto IA do sistema SGQ. Responda perguntas sobre o sistema. Lembre-se que itens sem saldo interno frequentemente estão em poder de terceiros. Responda direto. Dados: ${JSON.stringify(resumoRemessas)}`;
        
        let response;
        try {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
               method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAIApiKey}` },
               body: JSON.stringify({ model: 'gpt-5.5', messages: [{ role: 'system', content: contextoGlobal }, ...miniIaMessages, novaMsg], max_tokens: 8000, temperature: 0.1 })
            });
            if(!response.ok) throw new Error("Fallback");
        } catch(fallbackErr) {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
               method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAIApiKey}` },
               body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'system', content: contextoGlobal }, ...miniIaMessages, novaMsg], max_tokens: 4000, temperature: 0.1 })
            });
        }

        if(!response.ok) throw new Error("Falha API");
        const data = await response.json();
        if(data.choices && data.choices[0]) setMiniIaMessages(prev => [...prev, data.choices[0].message]);
     } catch (err) { setMiniIaMessages(prev => [...prev, { role: 'assistant', content: '❌ Falha de conexão na API.' }]); } finally { setIsMiniIaLoading(false); }
  };

  const salvarRelatorioIA = async (e) => {
     e.preventDefault(); const titulo = window.prompt("Nome do Relatório Gerencial:"); if(!titulo) return;
     setIsLoading(true);
     try {
        await supabase.from('relatorios_ia').insert([{ titulo, conteudo: chatMessages, criado_por: usuarioLogado?.nome }]);
        setSucesso("Relatório arquivado com sucesso!"); fetchAllData();
     } catch(err) { setErro("Falha ao salvar relatório."); } finally { setIsLoading(false); }
  };

  const enviarMensagemEquipe = async (e) => {
     e.preventDefault(); if(!chatEquipeInput.trim()) return;
     const msg = chatEquipeInput; setChatEquipeInput('');
     try {
        await supabase.from('chat_interno').insert([{ remetente: s(usuarioLogado?.nome), destinatario: chatEquipeDestinatario, mensagem: msg }]);
        fetchAllData();
     } catch(err) {}
  };

  const pendenciasAuditoria = useMemo(() => {
    const allRemovidos = remessasDb.flatMap(r => (Array.isArray(r.itens_removidos) ? r.itens_removidos : []).map(rem => ({ ...rem, projeto: r.projeto, pa: r.produto_acabado, data: r.data_criacao, quantidade_op: r.quantidade_op, cliente: r.cliente })));
    const allEnviados = remessasDb.flatMap(r => (Array.isArray(r.itens) ? r.itens : []).map(it => ({ codigoMP: it.codigoMP, projeto: r.projeto })));
    return allRemovidos.map(p => ({ ...p, resolvido: allEnviados.some(e => e.codigoMP === p.codigoMP && e.projeto === p.projeto) }));
  }, [remessasDb]);

  const auditoriaFiltrada = useMemo(() => {
    let list = [...pendenciasAuditoria];
    if(filtrosAuditoria.projeto) list = list.filter(p => s(p.projeto).toUpperCase().includes(filtrosAuditoria.projeto.toUpperCase()));
    if(filtrosAuditoria.pa) list = list.filter(p => s(p.pa).toUpperCase().includes(filtrosAuditoria.pa.toUpperCase()));
    if(filtrosAuditoria.mp) list = list.filter(p => s(p.codigoMP).toUpperCase().includes(filtrosAuditoria.mp.toUpperCase()));
    if(filtrosAuditoria.status === 'RESOLVIDO') list = list.filter(p => p.resolvido);
    if(filtrosAuditoria.status === 'PENDENTE') list = list.filter(p => !p.resolvido);
    const k = sortAuditoria.key; const d = sortAuditoria.dir === 'asc' ? 1 : -1;
    return list.sort((a,b) => (s(a[k]) > s(b[k]) ? 1 : -1) * d);
  }, [pendenciasAuditoria, filtrosAuditoria, sortAuditoria]);

  const historicoFiltrado = useMemo(() => {
    let list = [...remessasDb];
    if(filtrosHistorico.projeto) list = list.filter(r => s(r.projeto).toUpperCase().includes(filtrosHistorico.projeto.toUpperCase()));
    if(filtrosHistorico.cliente) list = list.filter(r => s(r.cliente).toUpperCase().includes(filtrosHistorico.cliente.toUpperCase()));
    if(filtrosHistorico.pa) list = list.filter(r => s(r.produto_acabado).toUpperCase().includes(filtrosHistorico.pa.toUpperCase()));
    if(filtrosHistorico.status) list = list.filter(r => s(r.status) === filtrosHistorico.status);
    const k = sortHistorico.key; const d = sortHistorico.dir === 'asc' ? 1 : -1;
    return list.sort((a,b) => (s(a[k]) > s(b[k]) ? 1 : -1) * d);
  }, [remessasDb, filtrosHistorico, sortHistorico]);

  const controleFiltrado = useMemo(() => {
    const listFora = remessasDb.filter(r => ['ENVIADO', 'RETORNO_PARCIAL', 'RETORNADO'].includes(s(r.status)));
    let result = listFora.flatMap(r => (Array.isArray(r.itens) ? r.itens : []).map(it => ({ ...it, remessa: r, isRateio: false })));
    if(filtrosControle.projeto) result = result.filter(x => s(x.remessa?.projeto).toUpperCase().includes(filtrosControle.projeto.toUpperCase()));
    if(filtrosControle.pa) result = result.filter(x => s(x.remessa?.produto_acabado).toUpperCase().includes(filtrosControle.pa.toUpperCase()));
    if(filtrosControle.mp) result = result.filter(x => s(x.codigoMP).toUpperCase().includes(filtrosControle.mp.toUpperCase()));
    if(filtrosControle.status) result = result.filter(x => s(x.remessa?.status) === filtrosControle.status);
    const k = sortControle.key; const d = sortControle.dir === 'asc' ? 1 : -1;
    return result.sort((a,b) => { const valA = k === 'data_envio' ? s(a.remessa?.data_envio) : s(a[k] || a.remessa?.[k]); const valB = k === 'data_envio' ? s(b.remessa?.data_envio) : s(b[k] || b.remessa?.[k]); return (valA > valB ? 1 : -1) * d; });
  }, [remessasDb, filtrosControle, sortControle]);

  const optionsH = useMemo(() => ({ projeto: [...new Set(remessasDb.map(r => s(r.projeto)))].filter(x=>x).sort(), cliente: [...new Set(remessasDb.map(r => s(r.cliente)))].filter(x=>x).sort(), pa: [...new Set(remessasDb.map(r => s(r.produto_acabado)))].filter(x=>x).sort() }), [remessasDb]);
  const optionsC = useMemo(() => ({ projeto: [...new Set(remessasDb.map(r => s(r.projeto)))].filter(x=>x).sort(), pa: [...new Set(remessasDb.map(r => s(r.produto_acabado)))].filter(x=>x).sort(), mp: [...new Set(remessasDb.flatMap(r => (Array.isArray(r.itens) ? r.itens : []).map(it => s(it.codigoMP))))].filter(x=>x).sort() }), [remessasDb]);

  const remessasPendentes = useMemo(() => remessasDb.filter(r => s(r.status) === 'PENDENTE_EXPEDICAO'), [remessasDb]);
  const remessasFora = useMemo(() => remessasDb.filter(r => ['ENVIADO', 'RETORNO_PARCIAL', 'RETORNADO'].includes(s(r.status))), [remessasDb]);

  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-[2rem] shadow-2xl p-10 w-full max-w-md border border-zinc-800">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-yellow-500 text-black rounded-2xl flex items-center justify-center mb-4"><PackageOpen className="w-8 h-8" /></div>
            <h1 className="text-3xl font-black text-white tracking-tight">Kalenborn SGQ</h1>
            <p className="text-yellow-500 font-bold text-[10px] mt-2 uppercase tracking-widest leading-relaxed text-center">Industrialização Cloud</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            {erroLogin && <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-xs font-black border border-red-500/20 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> {s(erroLogin)}</div>}
            <input type="email" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 font-bold text-white outline-none focus:border-yellow-500 placeholder:text-zinc-500" placeholder="E-mail corporativo" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} />
            <input type="password" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 font-bold text-white outline-none focus:border-yellow-500 placeholder:text-zinc-500" placeholder="Senha" value={senhaLogin} onChange={e => setSenhaLogin(e.target.value)} />
            <button type="submit" className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl shadow-xl hover:bg-yellow-400 transition-all uppercase tracking-wider text-sm active:scale-95">Acessar Sistema</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-100 font-sans text-zinc-900 overflow-hidden text-sm">
      
      {/* Overlay do Menu Mobile */}
      {isMobileMenuOpen && (
         <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-300 ease-in-out z-50 w-72 bg-zinc-950 text-zinc-300 flex flex-col shadow-2xl border-r border-zinc-800 h-full`}>
        <div className="p-6 border-b border-zinc-800 flex items-center space-x-3 text-yellow-500">
          <PackageOpen className="w-8 h-8" /><h1 className="text-xl font-black">SGQ<br/><span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">Kalenborn</span></h1>
        </div>
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
           <div className="flex items-center space-x-3 truncate">
              <div className="bg-zinc-800 p-2 rounded-full flex-shrink-0">{isAdmin ? <Shield className="w-4 h-4 text-yellow-500" /> : <User className="w-4 h-4 text-zinc-400" />}</div>
              <p className="font-black text-white truncate">{s(usuarioLogado?.nome)}</p>
           </div>
           <button onClick={() => setUsuarioLogado(null)} className="text-zinc-500 hover:text-red-400 transition-colors ml-2"><LogOut className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3 custom-scrollbar">
          {isAdmin && (
            <button onClick={() => { setAbaAtiva('DASHBOARD'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'DASHBOARD' ? 'bg-yellow-500 shadow-lg text-black' : 'hover:bg-zinc-900 hover:text-white'}`}><PieChartIcon className="w-5 h-5 mr-3" /> <span className="font-bold">Painel Diretoria</span></button>
          )}
          {isPCP && (
            <>
              <div className="pt-4 pb-2 px-4"><span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">PCP</span></div>
              <button onClick={() => { setAbaAtiva('NOVA_OP'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'NOVA_OP' ? 'bg-zinc-800 shadow-lg text-white border border-zinc-700' : 'hover:bg-zinc-900 hover:text-white'}`}><LayoutDashboard className="w-5 h-5 mr-3" /> <span className="font-bold">Nova Remessa</span></button>
              <button onClick={() => { setAbaAtiva('HISTORICO_PCP'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'HISTORICO_PCP' ? 'bg-zinc-800 shadow-lg text-white border border-zinc-700' : 'hover:bg-zinc-900 hover:text-white'}`}><History className="w-5 h-5 mr-3" /> <span className="font-bold">Histórico Envios</span></button>
              <button onClick={() => { setAbaAtiva('UPLOAD_ESTOQUE'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${abaAtiva === 'UPLOAD_ESTOQUE' ? 'bg-zinc-800 shadow-lg text-white border border-zinc-700' : 'hover:bg-zinc-900 hover:text-white'}`}><UploadCloud className="w-5 h-5 mr-3" /> <span className="font-bold">Sincronizar ERP</span></button>
            </>
          )}
          {isExp && (
            <>
              <div className="pt-4 pb-2 px-4"><span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Logística</span></div>
              <button onClick={() => { setAbaAtiva('EXPEDICAO'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'EXPEDICAO' ? 'bg-zinc-800 shadow-lg text-white border border-zinc-700' : 'hover:bg-zinc-900 hover:text-white'}`}><Truck className="w-5 h-5 mr-3" /> <span className="font-bold">Fila Expedição</span>{remessasPendentes.length > 0 && <span className="ml-auto bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">{String(remessasPendentes.length)}</span>}</button>
              <button onClick={() => { setAbaAtiva('FORNECEDORES'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'FORNECEDORES' ? 'bg-zinc-800 shadow-lg text-white border border-zinc-700' : 'hover:bg-zinc-900 hover:text-white'}`}><MapPin className="w-5 h-5 mr-3" /> <span className="font-bold">Retorno Peças</span></button>
              <button onClick={() => { setAbaAtiva('CONTROLE_GERAL'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'CONTROLE_GERAL' ? 'bg-zinc-800 shadow-lg text-white border border-zinc-700' : 'hover:bg-zinc-900 hover:text-white'}`}><ListChecks className="w-5 h-5 mr-3" /> <span className="font-bold">Controle Geral</span></button>
            </>
          )}
          {isAdmin && (
            <>
              <div className="pt-4 pb-2 px-4"><span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Sistema</span></div>
              <button onClick={() => { setAbaAtiva('IA_ANALISTA'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'IA_ANALISTA' ? 'bg-indigo-600 shadow-lg text-white border border-indigo-500' : 'hover:bg-zinc-900 hover:text-white'}`}><Bot className="w-5 h-5 mr-3" /> <span className="font-bold text-indigo-300">Cientista IA</span></button>
              <button onClick={() => { setAbaAtiva('AUDITORIA'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'AUDITORIA' ? 'bg-zinc-800 shadow-lg text-white border border-zinc-700' : 'hover:bg-zinc-900 hover:text-white'}`}><FileSearch className="w-5 h-5 mr-3" /> <span className="font-bold">Auditoria BOM</span></button>
              <button onClick={() => { setAbaAtiva('GESTAO_USUARIOS'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'GESTAO_USUARIOS' ? 'bg-zinc-800 shadow-lg text-white border border-zinc-700' : 'hover:bg-zinc-900 hover:text-white'}`}><Users className="w-5 h-5 mr-3" /> <span className="font-bold">Gestão Acessos</span></button>
            </>
          )}
        </div>
        
        {(isAdmin || isPCP) && (
          <div className="p-4 bg-black space-y-4 border-t border-zinc-800">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center">Modelo SGQ Excel</p>
            <label className={`flex items-center justify-center px-3 py-3 rounded-xl cursor-pointer transition-all border ${templateBuffer ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-red-900/20 border-red-500/50 text-red-400 animate-pulse'}`}>
              <FileSpreadsheet className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="font-black uppercase text-[10px] truncate">{s(nomeTemplate || 'Carregar Modelo')}</span>
              <input type="file" accept=".xlsx" className="hidden" onChange={async (e) => {
                 const file = e.target.files[0]; if(!file) return;
                 setIsLoading(true);
                 const fr = new FileReader(); fr.onload = async(evt) => {
                    const b64 = window.btoa(new Uint8Array(evt.target.result).reduce((d, b) => d + String.fromCharCode(b), ''));
                    await supabase.from('configuracoes').upsert({ chave: 'modelo_sgq', valor_json: { nome: file.name, data: b64 } });
                    setTemplateBuffer(evt.target.result); setNomeTemplate(file.name); setIsLoading(false); setSucesso("Modelo Salvo!");
                 }; fr.readAsArrayBuffer(file);
              }} />
            </label>
            <div className="flex items-center justify-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest gap-2">
              {dbOnline ? <Cloud className="w-3 h-3 text-emerald-500" /> : <CloudOff className="w-3 h-3 text-red-500" />} {dbOnline ? 'Nuvem Ativa' : 'Offline'}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 overflow-y-auto relative p-4 md:p-6 lg:p-8 custom-scrollbar">
        
        {/* Cabecalho Mobile */}
        <div className="md:hidden flex items-center justify-between bg-zinc-950 text-yellow-500 p-4 rounded-2xl shadow-xl mb-6 border border-zinc-800 shrink-0">
           <div className="flex items-center gap-3">
              <PackageOpen className="w-6 h-6" />
              <h1 className="text-base font-black tracking-widest uppercase">Kalenborn SGQ</h1>
           </div>
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
              <Menu className="w-6 h-6 text-white" />
           </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[60] flex flex-col items-center justify-center text-center">
            <Loader2 className="w-20 h-20 text-yellow-500 animate-spin mb-6" />
            <h3 className="text-2xl font-black uppercase text-zinc-900 tracking-tighter">Processando...</h3>
          </div>
        )}

        {(erro || sucesso) && <div className={`fixed top-4 right-4 z-[100] p-5 rounded-2xl shadow-2xl flex items-start border animate-in slide-in-from-top-4 ${erro ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}><AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" /><div className="flex-1 font-black text-sm">{s(erro || sucesso)}</div><button onClick={() => {setErro(''); setSucesso('');}} className="font-black text-xl ml-4">&times;</button></div>}

        {/* 0. ABA DASHBOARD DIRETORIA */}
        {abaAtiva === 'DASHBOARD' && isAdmin && (
           <div className="max-w-7xl mx-auto space-y-8 w-full animate-in fade-in pb-10">
              <div className="flex justify-between items-end border-b-4 border-yellow-500 pb-4">
                 <div>
                    <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase leading-none">Painel Executivo</h2>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> Visão Estratégica de Operações</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-zinc-200 flex items-center font-black text-xs text-zinc-600 uppercase tracking-widest">
                       <Calendar className="w-4 h-4 mr-2 text-yellow-500"/>
                       <select className="bg-transparent outline-none cursor-pointer" value={filtroMesDashboard} onChange={e => setFiltroMesDashboard(e.target.value)}>
                          <option value="ALL">Todo o Período</option>
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>Mês {String(m).padStart(2, '0')}</option>)}
                       </select>
                    </div>
                 </div>
              </div>

              {/* KPIs Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 bg-zinc-50 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Layers className="w-10 h-10 text-zinc-200" /></div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest relative z-10">Total de PRJ-BRs Tratados</p>
                    <p className="text-4xl font-black text-zinc-900 mt-2 relative z-10">{dashboardData.kpiTotalOps}</p>
                 </div>
                 <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Boxes className="w-10 h-10 text-blue-200" /></div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest relative z-10">Volume Físico de PA Movimentado</p>
                    <p className="text-4xl font-black text-blue-600 mt-2 relative z-10">{fmtDec(dashboardData.kpiVolumePecas)} <span className="text-sm">PÇS</span></p>
                 </div>
                 <button onClick={() => { setFiltrosControle({projeto:'', pa:'', mp:'', status:'ENVIADO'}); setAbaAtiva('CONTROLE_GERAL'); }} className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm relative overflow-hidden group text-left hover:border-amber-400 transition-colors">
                    <div className="absolute -right-6 -top-6 bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Truck className="w-10 h-10 text-amber-200" /></div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest relative z-10">PRJ-BRs em Trânsito (Terceiros)</p>
                    <p className="text-4xl font-black text-amber-500 mt-2 relative z-10">{dashboardData.kpiEmTransito}</p>
                 </button>
                 <button onClick={() => { setFiltrosControle({projeto:'', pa:'', mp:'', status:'RETORNADO'}); setAbaAtiva('CONTROLE_GERAL'); }} className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm relative overflow-hidden group text-left hover:border-emerald-400 transition-colors">
                    <div className="absolute -right-6 -top-6 bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><CheckCircle className="w-10 h-10 text-emerald-200" /></div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest relative z-10">PRJ-BRs Concluídos (Retorno)</p>
                    <p className="text-4xl font-black text-emerald-500 mt-2 relative z-10">{dashboardData.kpiConcluidas}</p>
                 </button>
              </div>

              {/* Alerta OPs Atrasadas */}
              {dashboardData.opsAtrasadas.length > 0 && (
                 <button onClick={() => setModalAtrasosAberto(true)} className="w-full bg-red-600 rounded-[2rem] p-8 shadow-xl shadow-red-600/20 flex items-center justify-between group hover:bg-red-700 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse"><AlertTriangle className="w-8 h-8 text-white" /></div>
                       <div className="text-left">
                          <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Atenção Crítica: OPs Atrasadas</h3>
                          <p className="text-red-200 font-bold uppercase text-xs tracking-widest mt-1">Existem {dashboardData.opsAtrasadas.length} PRJ-BRs parados em poder de terceiros há mais de 20 dias.</p>
                       </div>
                    </div>
                    <div className="bg-white text-red-600 font-black px-6 py-3 rounded-xl uppercase tracking-widest text-xs group-hover:scale-105 transition-transform">Analisar Gargalos</div>
                 </button>
              )}

              {/* Gráficos Padrão (Tailwind Nativos) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 
                 <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] shadow-xl border border-zinc-800 flex flex-col min-h-[450px]">
                    <div className="mb-6">
                       <h3 className="text-base md:text-lg font-black text-white uppercase tracking-widest">Balanço de Materiais (Top 5 MPs)</h3>
                       <p className="text-xs font-bold text-yellow-500 mt-1 uppercase">Saída (Falta) vs Retorno (Recuperado)</p>
                    </div>
                    <div className="flex-1 flex items-end gap-2 md:gap-4 mt-4 pt-4 relative">
                       {/* Linhas de Grade de Fundo */}
                       <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0 pointer-events-none">
                          {[...Array(5)].map((_, i) => <div key={i} className="w-full border-b border-zinc-800/50"></div>)}
                       </div>
                       
                       {dashboardData.mpsChart.length === 0 ? (
                           <div className="w-full h-full flex items-center justify-center text-zinc-600 font-black uppercase tracking-widest text-xs z-10">Sem Dados Registrados</div>
                       ) : (
                           dashboardData.mpsChart.map((mp, i) => {
                               const maxVal = Math.max(...dashboardData.mpsChart.flatMap(m => [m.enviado, m.retornado]), 1);
                               const hEnv = `${(mp.enviado / maxVal) * 100}%`;
                               const hRet = `${(mp.retornado / maxVal) * 100}%`;
                               return (
                                   <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-3 z-10 group">
                                       <div className="w-full flex items-end justify-center gap-1 h-full relative">
                                           <div style={{height: hEnv}} className="w-full max-w-[3rem] bg-yellow-500 rounded-t border-t-2 border-yellow-400 relative flex justify-center hover:opacity-80 transition-all cursor-pointer">
                                              <span className="absolute -top-6 text-[10px] font-black text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 px-2 py-0.5 rounded shadow-lg">{fmtDec(mp.enviado)}</span>
                                           </div>
                                           <div style={{height: hRet}} className="w-full max-w-[3rem] bg-emerald-500 rounded-t border-t-2 border-emerald-400 relative flex justify-center hover:opacity-80 transition-all cursor-pointer">
                                              <span className="absolute -top-6 text-[10px] font-black text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 px-2 py-0.5 rounded shadow-lg">{fmtDec(mp.retornado)}</span>
                                           </div>
                                       </div>
                                       <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 text-center uppercase w-full px-1 leading-tight h-8 flex items-start justify-center overflow-hidden" title={mp.nome}>{s(mp.nome).split('-')[0]}</span>
                                   </div>
                               );
                           })
                       )}
                    </div>
                    <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-zinc-800">
                       <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div><span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Enviado Físico</span></div>
                       <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div><span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Retornado (Baixa)</span></div>
                    </div>
                 </div>

                 <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-zinc-200 flex flex-col min-h-[450px]">
                     <div className="mb-8">
                         <h3 className="text-base md:text-lg font-black text-zinc-800 uppercase tracking-widest">Alvos de Produção (Top 5 PAs)</h3>
                         <p className="text-xs font-bold text-zinc-500 mt-1 uppercase">Volume Bruto Acumulado Solicitado ao Mercado</p>
                     </div>
                     <div className="flex-1 flex flex-col justify-center gap-6">
                         {dashboardData.pasChart.length === 0 ? (
                             <div className="w-full h-full flex items-center justify-center text-zinc-400 font-black uppercase tracking-widest text-xs">Sem Dados Registrados</div>
                         ) : (
                             dashboardData.pasChart.map((pa, i) => {
                                 const total = dashboardData.pasChart.reduce((acc, curr) => acc + curr.value, 0) || 1;
                                 const pct = `${(pa.value / total) * 100}%`;
                                 const color = CHART_COLORS[i % CHART_COLORS.length];
                                 return (
                                     <div key={i} className="w-full group">
                                         <div className="flex justify-between items-end mb-2">
                                             <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: color}}></div>
                                                <span className="text-sm font-black text-zinc-700 uppercase truncate max-w-[200px]" title={pa.name}>{pa.name}</span>
                                             </div>
                                             <div className="text-right">
                                                <span className="text-sm font-black" style={{color}}>{fmtDec(pa.value)} PÇS</span>
                                                <span className="text-[10px] font-bold text-zinc-400 ml-2">({(pa.value / total * 100).toFixed(1)}%)</span>
                                             </div>
                                         </div>
                                         <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                                             <div style={{width: pct, backgroundColor: color}} className="h-full rounded-full transition-all duration-1000 group-hover:opacity-80"></div>
                                         </div>
                                     </div>
                                 );
                             })
                         )}
                     </div>
                 </div>

              </div>

              {/* Tabela de Projetos Pai */}
              <div className="bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm">
                 <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                    <div>
                       <h3 className="font-black text-zinc-900 uppercase tracking-tighter text-xl">Gestão de Demandas (Raio-X)</h3>
                       <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Cargas Principais e Vínculos de Complemento</p>
                    </div>
                    <input placeholder="Filtrar BR..." className="bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-yellow-500" value={buscaDetalheProjeto} onChange={e=>setBuscaDetalheProjeto(e.target.value)} />
                 </div>
                 <div className="overflow-x-auto"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-white border-b border-zinc-100">
                    <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                       <th className="p-5 pl-8">Lançamento</th>
                       <th className="p-5">PRJ-BR (Raiz)</th>
                       <th className="p-5">PA Alvo</th>
                       <th className="p-5 text-center">Física Saída (Qtd)</th>
                       <th className="p-5 text-center">Complementos</th>
                       <th className="p-5 text-center pr-8">Auditoria</th>
                    </tr>
                 </thead><tbody className="divide-y divide-zinc-50">
                    {dashboardProjetosAgrupados.filter(p => !buscaDetalheProjeto || p.projeto.toUpperCase().includes(buscaDetalheProjeto.toUpperCase())).map((p, idx) => (
                       <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                          <td className="p-5 pl-8 font-bold text-zinc-500">{p.data_criacao ? new Date(p.data_criacao).toLocaleDateString() : '---'}</td>
                          <td className="p-5 font-black text-zinc-900 uppercase">{s(p.projeto)}</td>
                          <td className="p-5 font-black text-blue-600 uppercase">{s(p.produto_acabado)}</td>
                          <td className="p-5 text-center font-black text-zinc-800 bg-zinc-100/50">{fmtDec(p.totalEnviado, 'PÇS')}</td>
                          <td className="p-5 text-center">{p.filhos.length > 0 ? <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black">{p.filhos.length} Vínculos</span> : <span className="text-zinc-300">-</span>}</td>
                          <td className="p-5 text-center pr-8"><button onClick={() => { setProjetoDetalheSelecionado(p); setModalDetalheProjetoAberto(true); }} className="bg-yellow-50 text-yellow-700 hover:bg-yellow-500 hover:text-black transition-colors px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center mx-auto shadow-sm"><Eye className="w-3 h-3 mr-1"/> Ver Detalhes</button></td>
                       </tr>
                    ))}
                    {dashboardProjetosAgrupados.length === 0 && <tr><td colSpan="6" className="p-16 text-center text-zinc-300 font-black uppercase tracking-widest">Sem Demandas</td></tr>}
                 </tbody></table></div>
              </div>
           </div>
        )}

        {/* Modal Alertas Atraso */}
        {modalAtrasosAberto && (
           <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                 <div className="p-8 border-b border-zinc-100 bg-red-600 flex justify-between items-center text-white">
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center"><AlertTriangle className="w-8 h-8 mr-3"/> OPs com Atraso Crítico</h2>
                      <p className="text-red-200 font-bold uppercase tracking-widest mt-1 text-xs">Aguardando Retorno há mais de 20 dias</p>
                    </div>
                    <button onClick={() => setModalAtrasosAberto(false)} className="text-white hover:scale-110 transition-transform"><XCircle className="w-8 h-8"/></button>
                 </div>
                 <div className="overflow-y-auto custom-scrollbar p-8 bg-zinc-50">
                    <table className="w-full text-left text-sm whitespace-nowrap bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden"><thead className="bg-zinc-50 border-b border-zinc-100">
                       <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          <th className="p-4 pl-6">Projeto BR</th><th className="p-4">Alvo PA</th><th className="p-4">Local (Poder de)</th><th className="p-4 text-center pr-6">Dias de Atraso</th>
                       </tr>
                    </thead><tbody className="divide-y divide-zinc-50">
                       {dashboardData.opsAtrasadas.sort((a,b)=>b.dias-a.dias).map((op, i) => (
                          <tr key={i} className="hover:bg-red-50/30 transition-colors">
                             <td className="p-4 pl-6 font-black text-zinc-900">{s(op.projeto)}</td><td className="p-4 font-black text-blue-600">{s(op.pa)}</td><td className="p-4 font-bold text-zinc-600">{s(op.destinatario || 'Desconhecido')}</td>
                             <td className="p-4 text-center pr-6"><span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full font-black text-sm border border-red-200">{op.dias} Dias</span></td>
                          </tr>
                       ))}
                    </tbody></table>
                 </div>
              </div>
           </div>
        )}

        {/* Modal Detalhe Projeto */}
        {modalDetalheProjetoAberto && projetoDetalheSelecionado && (
           <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-zinc-100 rounded-[3rem] w-full max-w-6xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[95vh] border border-zinc-800">
                 <div className="p-8 border-b border-zinc-200 bg-white flex justify-between items-center shrink-0">
                    <div>
                      <span className="bg-yellow-500 text-black px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-widest shadow-sm">Balanço Físico Master</span>
                      <h2 className="text-3xl font-black text-zinc-900 mt-2 uppercase tracking-tighter flex items-center gap-3">PRJ-BR: {s(projetoDetalheSelecionado.projeto)}</h2>
                    </div>
                    <button onClick={() => setModalDetalheProjetoAberto(false)} className="text-zinc-400 hover:text-red-500 transition-colors"><XCircle className="w-8 h-8"/></button>
                 </div>
                 <div className="overflow-y-auto custom-scrollbar p-8">
                    <div className="space-y-8">
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Volume Físico Alvo (PA)</p>
                             <h3 className="text-3xl font-black text-blue-600">{fmtDec(projetoDetalheSelecionado.totalEnviado, 'PÇS')}</h3>
                          </div>
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status Global da Carga</p>
                             <h3 className="text-xl font-black text-zinc-800 mt-2">{projetoDetalheSelecionado.status === 'RETORNADO' ? '🟢 Concluído Interno' : '🟡 Em Poder de Terceiros'}</h3>
                          </div>
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Ocorrências (Complementos)</p>
                             <h3 className="text-xl font-black text-indigo-600 mt-2">{projetoDetalheSelecionado.filhos.length} Vínculos Extras</h3>
                          </div>
                       </div>

                       <div className="bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm">
                          <div className="p-6 bg-zinc-50 border-b border-zinc-100 flex items-center gap-3"><Layers className="w-5 h-5 text-yellow-600"/><h3 className="font-black text-zinc-800 uppercase tracking-widest text-sm">Cronologia Físico-Produtiva (PAs)</h3></div>
                          <table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-white border-b border-zinc-100">
                             <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                <th className="p-4 pl-6">Data Saída</th><th className="p-4">Tipo Carga</th><th className="p-4">Ref. Sistema</th><th className="p-4">Alvo PA</th><th className="p-4 text-center pr-6">Volume Físico</th>
                             </tr>
                          </thead><tbody className="divide-y divide-zinc-50">
                             {projetoDetalheSelecionado.pecasFisicasSaidas.map((pc, i) => (
                                <tr key={i} className="hover:bg-zinc-50 transition-colors">
                                   <td className="p-4 pl-6 font-bold text-zinc-600">{pc.data ? new Date(pc.data).toLocaleDateString() : '-'}</td>
                                   <td className="p-4"><span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${pc.tipo === 'Raiz' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>{pc.tipo}</span></td>
                                   <td className="p-4 font-bold text-zinc-400 text-[10px]">{pc.id}</td><td className="p-4 font-black text-zinc-800 uppercase">{s(pc.pa)} <span className="text-[9px] font-normal text-zinc-400">({s(pc.desc).substring(0,20)})</span></td>
                                   <td className="p-4 text-center font-black text-blue-600 pr-6">{fmtDec(pc.qtd, 'PÇS')}</td>
                                </tr>
                             ))}
                          </tbody></table>
                       </div>

                       <div className="bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm">
                          <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                             <div className="flex items-center gap-3"><Boxes className="w-5 h-5 text-yellow-500"/><h3 className="font-black text-white uppercase tracking-widest text-sm">Balanço Físico de Matéria-Prima (Consolidado)</h3></div>
                             <span className="bg-zinc-800 text-yellow-500 px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase">Raiz + Complementos</span>
                          </div>
                          <table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-zinc-900 border-b border-zinc-800">
                             <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                <th className="p-4 pl-6">Cód MP</th><th className="p-4">Descrição Material</th><th className="p-4 text-center">Un.</th>
                                <th className="p-4 text-right">Física Enviada</th><th className="p-4 text-right">Física Retornada</th><th className="p-4 text-right pr-6">Saldo na Rua</th>
                             </tr>
                          </thead><tbody className="divide-y divide-zinc-100 bg-white">
                             {projetoDetalheSelecionado.mpsConsumidas.map((mp, i) => {
                                const saldoRua = mp.qtdAcumulada - mp.qtdRetornada;
                                return (
                                <tr key={i} className="hover:bg-zinc-50 transition-colors">
                                   <td className="p-4 pl-6 font-black text-zinc-900">{s(mp.codigoMP)}</td><td className="p-4 font-bold text-zinc-600 truncate max-w-[200px]">{s(mp.descricao)}</td><td className="p-4 text-center text-zinc-400 font-bold">{s(mp.um)}</td>
                                   <td className="p-4 text-right font-black text-amber-600 bg-amber-50/30">{fmtDec(mp.qtdAcumulada)}</td>
                                   <td className="p-4 text-right font-black text-emerald-600 bg-emerald-50/30">{fmtDec(mp.qtdRetornada)}</td>
                                   <td className={`p-4 text-right font-black pr-6 ${saldoRua > 0 ? 'text-red-600 bg-red-50/30' : 'text-zinc-400'}`}>{fmtDec(saldoRua)}</td>
                                </tr>
                             )})}
                          </tbody></table>
                       </div>

                       {projetoDetalheSelecionado.mpsRemovidas && projetoDetalheSelecionado.mpsRemovidas.length > 0 && (
                          <div className="bg-white rounded-[2rem] border border-red-200 overflow-hidden shadow-sm">
                             <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3"><Trash2 className="w-5 h-5 text-red-500"/><h3 className="font-black text-red-800 uppercase tracking-widest text-sm">Matérias-Primas Removidas (By-pass da BOM)</h3></div>
                             <table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-white border-b border-zinc-100">
                                <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                   <th className="p-4 pl-6">Cód MP</th><th className="p-4">Descrição Material</th><th className="p-4 text-center">Un.</th><th className="p-4 text-right pr-6">Volume Removido</th>
                                </tr>
                             </thead><tbody className="divide-y divide-zinc-50">
                                {projetoDetalheSelecionado.mpsRemovidas.map((mp, i) => (
                                   <tr key={i} className="hover:bg-red-50/30 transition-colors">
                                      <td className="p-4 pl-6 font-black text-red-600">{s(mp.codigoMP)}</td><td className="p-4 font-bold text-zinc-600 truncate max-w-[200px]">{s(mp.descricao)}</td><td className="p-4 text-center text-zinc-400 font-bold">{s(mp.um)}</td>
                                      <td className="p-4 text-right font-black text-red-600 pr-6">{fmtDec(mp.qtd)}</td>
                                   </tr>
                                ))}
                             </tbody></table>
                          </div>
                       )}

                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* 1. ABA NOVA OP */}
        {abaAtiva === 'NOVA_OP' && (
          <div className="max-w-4xl mx-auto space-y-6 w-full animate-in fade-in pb-10">
            <h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Nova Ordem de Remessa</h2>
            <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm">
              <form onSubmit={buscarProduto} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Cód Produto PA</label><input placeholder="Ex: 100200" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-black uppercase text-zinc-900 outline-none focus:border-yellow-500 shadow-inner" value={codigoBusca} onChange={e => setCodigoBusca(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Qtd Produção</label><input type="text" placeholder="Ex: 1 ou 1,5" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-black text-zinc-900 outline-none focus:border-yellow-500 shadow-inner" value={quantidadeProduzir} onChange={e => setQuantidadeProduzir(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Projeto (BR)</label><input placeholder="BR-..." className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-black uppercase text-zinc-900 outline-none focus:border-yellow-500 shadow-inner" value={projeto} onChange={e => setProjeto(e.target.value)} /></div>
                <div className="space-y-1.5 md:col-span-2 lg:col-span-1"><label className="text-[10px] font-black text-yellow-600 uppercase ml-1 tracking-widest flex items-center"><Building2 className="w-3 h-3 mr-1"/> Nome do Cliente</label><input placeholder="Cliente Final" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-black text-zinc-900 outline-none focus:border-yellow-500 shadow-inner" value={cliente} onChange={e => setCliente(e.target.value)} /></div>
                <div className={`space-y-1.5 ${observacao === 'Outros' ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
                  <label className="text-[10px] font-black text-yellow-600 uppercase ml-1 tracking-widest flex items-center"><Construction className="w-3 h-3 mr-1"/> Serviço p/ PCP</label>
                  <select className="w-full bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 font-black text-yellow-900 outline-none focus:border-yellow-500 shadow-inner cursor-pointer" value={observacao} onChange={e => setObservacao(e.target.value)}>
                    <option value="Industrialização">Industrialização (Padrão)</option><option value="Jateamento Interno">Jateamento Interno</option><option value="Jateamento Externo">Jateamento Externo</option><option value="Reforma">Reforma</option><option value="Autoclave">Autoclave</option><option value="Montagem de Placas">Montagem de Placas</option><option value="Outros">Outros (Descrever)</option>
                  </select>
                </div>
                {observacao === 'Outros' && (
                  <div className="space-y-1.5 lg:col-span-1 animate-in slide-in-from-left-2"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest flex items-center"><Edit3 className="w-3 h-3 mr-1"/> Especifique</label><input placeholder="Serviço" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-black text-zinc-900 outline-none focus:border-yellow-500 shadow-inner" value={outrosTexto} onChange={e => setOutrosTexto(e.target.value)} /></div>
                )}
                
                {/* Lógica de Complemento */}
                <div className="space-y-1.5 lg:col-span-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex flex-col gap-3">
                   <label className="flex items-center gap-3 cursor-pointer text-indigo-900 font-black uppercase tracking-widest text-xs">
                      <input type="checkbox" className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" checked={isComplemento} onChange={(e) => {setIsComplemento(e.target.checked); setOpPaiIdSelecionada('');}} />
                      ESTE ENVIO É UM COMPLEMENTO DE CARGA DE UM PROJETO JÁ EXISTENTE?
                   </label>
                   {isComplemento && (
                      <div className="animate-in slide-in-from-top-2">
                         <label className="text-[10px] font-black text-indigo-600 uppercase ml-1 tracking-widest block mb-1">Selecione a OP Original (Pai):</label>
                         <select className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 font-bold text-zinc-700 outline-none cursor-pointer" value={opPaiIdSelecionada} onChange={e => setOpPaiIdSelecionada(e.target.value)}>
                            <option value="">Selecione...</option>
                            {remessasDb.filter(r => !r.remessa_pai_id).map(r => (
                               <option key={r.id} value={r.id}>[ {new Date(r.data_criacao).toLocaleDateString()} ] BR: {s(r.projeto)} - {s(r.produto_acabado)} ({s(r.observacao)})</option>
                            ))}
                         </select>
                      </div>
                   )}
                </div>

                <div className="space-y-1.5 lg:col-span-3"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest flex items-center"><Info className="w-3 h-3 mr-1"/> Nota PCP p/ Logística</label><input placeholder="Instruções..." className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-bold text-zinc-900 outline-none focus:border-yellow-500 shadow-inner" value={obsExpedicao} onChange={e => setObsExpedicao(e.target.value)} /></div>
                <button type="submit" className="lg:col-span-3 bg-black text-yellow-500 font-black py-4 rounded-xl hover:bg-zinc-900 transition-all shadow-xl uppercase tracking-widest text-sm mt-2 active:scale-95 flex justify-center items-center gap-2"><Database size={20}/> Buscar Estrutura (BOM)</button>
              </form>
            </div>

            {modoManualAtivo && (
               <div className="bg-yellow-50 p-6 rounded-[2rem] border-2 border-yellow-200 shadow-inner animate-in zoom-in-95 flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-1.5"><label className="text-[10px] font-black text-yellow-800 uppercase ml-1 tracking-widest">Cód MP</label><input className="w-full bg-white border border-yellow-300 rounded-xl px-4 py-3 font-black uppercase text-zinc-900 outline-none focus:border-yellow-500" value={novoItemManual.codigoMP} onChange={e => setNovoItemManual({...novoItemManual, codigoMP: e.target.value})} /></div>
                  <div className="flex-[2] space-y-1.5"><label className="text-[10px] font-black text-yellow-800 uppercase ml-1 tracking-widest">Descrição Completa</label><input className="w-full bg-white border border-yellow-300 rounded-xl px-4 py-3 font-bold text-zinc-900 outline-none focus:border-yellow-500" value={novoItemManual.descricao} onChange={e => setNovoItemManual({...novoItemManual, descricao: e.target.value})} /></div>
                  <div className="w-24 space-y-1.5"><label className="text-[10px] font-black text-yellow-800 uppercase ml-1 tracking-widest">UN.</label><input className="w-full bg-white border border-yellow-300 rounded-xl px-4 py-3 font-black uppercase text-center text-zinc-900 outline-none focus:border-yellow-500" value={novoItemManual.um} onChange={e => setNovoItemManual({...novoItemManual, um: e.target.value})} /></div>
                  <div className="flex-1 space-y-1.5"><label className="text-[10px] font-black text-yellow-800 uppercase ml-1 tracking-widest">Qtd Física</label><input type="number" className="w-full bg-white border border-yellow-300 rounded-xl px-4 py-3 font-black text-zinc-900 outline-none focus:border-yellow-500" value={novoItemManual.quantidade} onChange={e => setNovoItemManual({...novoItemManual, quantidade: e.target.value})} /></div>
                  <button type="button" onClick={adicionarItemManual} className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 shadow-md">Add Linha</button>
               </div>
            )}

            {produtoEncontrado && (
              <div className="bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm animate-in zoom-in-95">
                <div className="p-5 bg-zinc-950 text-yellow-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-between">
                   <span className="flex items-center"><AlertTriangle className="w-4 h-4 mr-2"/> Auditoria Ativa: Itens removidos serão registrados.</span>
                   <span className="bg-yellow-500 text-black px-3 py-1 rounded-full">{itensRemessa.length} ITENS LISTADOS</span>
                </div>
                <div className="overflow-x-auto"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest"><th className="p-4 text-center">Tirar</th><th className="p-4">Material MP</th><th className="p-4">Descrição</th><th className="p-4 text-center">Requisitado</th><th className="p-4 text-center pr-6">Estoque ERP</th></tr>
                </thead><tbody className="divide-y divide-zinc-50">
                  {itensRemessa.map((it, i) => {
                    const descUpper = s(it.descricao).toUpperCase();
                    const isEditable = descUpper.includes('BORRACHA') || descUpper.includes('CHEMITAC') || descUpper.includes('COLA') || ITENS_RATEIO.includes(s(it.codigoMP));
                    const diffAjuste = it.quantidadeTotal - it.quantidadeOriginal;
                    const isAltered = isEditable && diffAjuste !== 0;

                    return (
                    <tr key={i} className={it.saldoDisponivel < it.quantidadeTotal ? 'bg-red-50/50' : 'hover:bg-zinc-50'}>
                      <td className="p-4 text-center"><button onClick={() => setItensRemessa(prev => prev.filter((_, idx) => idx !== i))} className="text-zinc-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4 mx-auto" /></button></td>
                      <td className="p-4 font-black text-zinc-900 uppercase tracking-tighter">{s(it.codigoMP)}</td>
                      <td className="p-4 font-bold text-zinc-600 truncate max-w-[200px]">{s(it.descricao)}</td>
                      <td className="p-4 text-center font-black text-zinc-900">
                        <div className="flex items-center justify-center gap-2">
                           {isEditable ? (
                              <div className="flex flex-col items-center justify-center gap-1">
                                 <input
                                    type="number"
                                    step="0.0001"
                                    className={`w-24 px-2 py-1 text-center rounded border font-black outline-none focus:border-yellow-500 transition-colors ${isAltered ? 'bg-yellow-100 border-yellow-400 text-yellow-900' : 'bg-white border-zinc-300'}`}
                                    value={it.quantidadeTotal}
                                    onChange={(e) => {
                                       const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                                       const n = [...itensRemessa];
                                       n[i].quantidadeTotal = val === '' ? 0 : val;
                                       setItensRemessa(n);
                                    }}
                                 />
                                 {isAltered && (
                                    <span className={`text-[9px] uppercase font-black ${diffAjuste > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                       {diffAjuste > 0 ? '+' : ''}{fmtDec(diffAjuste)} {it.um}
                                    </span>
                                 )}
                              </div>
                           ) : (
                             <span className="bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-lg shadow-sm">{fmtDec(it.quantidadeTotal, it.um)}</span>
                           )}
                           {ITENS_RATEIO.includes(s(it.codigoMP)) && (
                              <button type="button" onClick={() => { setIdxItemRateio(i); setModalRateioAberto(true); }} className={`p-1.5 rounded-lg transition-all ${it.rateiosExtras?.length > 0 ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`} title="Rateio / Ajustar Qtd"><PieChartIcon className="w-4 h-4" /></button>
                           )}
                        </div>
                      </td>
                      <td className={`p-4 text-center font-black pr-6 ${it.saldoDisponivel < it.quantidadeTotal ? 'text-red-600' : 'text-emerald-600'}`}>{fmtDec(it.saldoDisponivel, it.um)}</td>
                    </tr>
                  )})}
                  {itensRemessa.length === 0 && <tr><td colSpan="5" className="p-16 text-center text-zinc-300 font-black uppercase tracking-widest">Nenhum item na lista</td></tr>}
                </tbody></table></div>
                <div className="p-6 bg-zinc-50 flex justify-end border-t border-zinc-100">
                  <button onClick={enviarParaExpedicao} disabled={itensRemessa.length === 0} className="px-10 py-4 bg-yellow-500 text-black font-black rounded-2xl shadow-xl hover:bg-yellow-400 transition-all uppercase tracking-widest flex items-center text-sm shadow-yellow-500/20 active:scale-95 disabled:opacity-30"><ArrowRight className="w-5 h-5 mr-3" /> Validar Estoque & Enviar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ABA HISTÓRICO PCP (EXCEL STYLE) */}
        {abaAtiva === 'HISTORICO_PCP' && (
           <div className="max-w-7xl mx-auto w-full animate-in fade-in pb-10">
              <div className="flex justify-between items-end mb-6">
                <div><h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase leading-none">Histórico de Envios (PCP)</h2><p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">Metodologia de Filtro e Ordenação</p></div>
                <button onClick={() => setFiltrosHistorico({projeto:'', pa:'', cliente:'', status:''})} className="bg-white border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:text-red-500 hover:border-red-200 transition-all flex items-center shadow-sm"><XCircle className="w-3 h-3 mr-2"/> Limpar Filtros</button>
              </div>
              <div className="bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm">
                 <div className="overflow-x-auto"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-zinc-50 border-b border-zinc-100">
                    <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer">
                      <th className="p-5 pl-8 text-center" onClick={() => handleSort(sortHistorico, setSortHistorico, 'data_criacao')}>Lançamento {renderSortIcon(sortHistorico, 'data_criacao')}</th>
                      <th className="p-5" onClick={() => handleSort(sortHistorico, setSortHistorico, 'projeto')}>BR (Projeto) {renderSortIcon(sortHistorico, 'projeto')}</th>
                      <th className="p-5" onClick={() => handleSort(sortHistorico, setSortHistorico, 'cliente')}>Cliente Final {renderSortIcon(sortHistorico, 'cliente')}</th>
                      <th className="p-5" onClick={() => handleSort(sortHistorico, setSortHistorico, 'produto_acabado')}>Produto PA {renderSortIcon(sortHistorico, 'produto_acabado')}</th>
                      <th className="p-5 text-center pr-8" onClick={() => handleSort(sortHistorico, setSortHistorico, 'status')}>Situação (Fase Atual) {renderSortIcon(sortHistorico, 'status')}</th>
                    </tr>
                    <tr className="bg-white border-b border-zinc-100">
                      <th className="px-5 py-3"></th>
                      <th className="px-5 py-3"><input list="dl-h-proj" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500" placeholder="Procurar..." value={filtrosHistorico.projeto} onChange={e => setFiltrosHistorico({...filtrosHistorico, projeto: e.target.value})} /><datalist id="dl-h-proj">{optionsH.projeto.map(o => <option key={o} value={o} />)}</datalist></th>
                      <th className="px-5 py-3"><input list="dl-h-cli" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500" placeholder="Procurar..." value={filtrosHistorico.cliente} onChange={e => setFiltrosHistorico({...filtrosHistorico, cliente: e.target.value})} /><datalist id="dl-h-cli">{optionsH.cliente.map(o => <option key={o} value={o} />)}</datalist></th>
                      <th className="px-5 py-3"><input list="dl-h-pa" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500" placeholder="Procurar..." value={filtrosHistorico.pa} onChange={e => setFiltrosHistorico({...filtrosHistorico, pa: e.target.value})} /><datalist id="dl-h-pa">{optionsH.pa.map(o => <option key={o} value={o} />)}</datalist></th>
                      <th className="px-5 py-3 pr-8 text-center"><select className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500 cursor-pointer" value={filtrosHistorico.status} onChange={e => setFiltrosHistorico({...filtrosHistorico, status: e.target.value})}><option value="">Todos</option><option value="PENDENTE_EXPEDICAO">Fase 1: Solicitado</option><option value="ENVIADO">Fase 2: Enviado</option><option value="RETORNADO">Fase 3: Concluído</option></select></th>
                    </tr>
                 </thead><tbody className="divide-y divide-zinc-50">
                    {historicoFiltrado.map(r => (
                      <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="p-5 pl-8 font-bold text-zinc-500 text-center">{r.data_criacao ? new Date(r.data_criacao).toLocaleDateString() : '---'}</td>
                        <td className="p-5 font-black text-zinc-900 uppercase tracking-tighter">{s(r.projeto)} {r.remessa_pai_id && <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest align-middle">Comp.</span>}</td>
                        <td className="p-5 font-bold text-zinc-600 uppercase">{s(r.cliente || 'Interno')}</td>
                        <td className="p-5 font-black text-blue-600 uppercase tracking-tighter">{s(r.produto_acabado)}</td>
                        <td className="p-5 text-center pr-8">
                           {r.status === 'PENDENTE_EXPEDICAO' && <span className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">1. Solicitado</span>}
                           {(r.status === 'ENVIADO' || r.status === 'RETORNO_PARCIAL') && <span className="bg-amber-50 text-amber-600 border border-amber-200 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">2. Enviado SGQ</span>}
                           {r.status === 'RETORNADO' && <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">3. Concluído Interno</span>}
                        </td>
                      </tr>
                    ))}
                    {historicoFiltrado.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-zinc-300 font-black uppercase text-lg tracking-widest">Nenhum registo encontrado</td></tr>}
                 </tbody></table></div>
              </div>
           </div>
        )}

        {/* 3. ABA CONTROLE GERAL (EXCEL STYLE) */}
        {abaAtiva === 'CONTROLE_GERAL' && (
          <div className="max-w-7xl mx-auto space-y-6 w-full animate-in fade-in pb-10">
            <div className="flex justify-between items-end">
              <div><h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase leading-none">Monitoramento Geral</h2><p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">Gestão Analítica de Trânsito Externo</p></div>
              <button onClick={() => setFiltrosControle({projeto:'', pa:'', mp:'', status:''})} className="bg-white border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:text-red-500 transition-all flex items-center shadow-sm"><XCircle className="w-3 h-3 mr-2"/> Limpar Filtros</button>
            </div>
            <div className="bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-zinc-50 border-b border-zinc-100">
                <tr className="text-[9px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer">
                  <th className="p-5 pl-8 text-center" onClick={() => handleSort(sortControle, setSortControle, 'data_envio')}>Saída {renderSortIcon(sortControle, 'data_envio')}</th>
                  <th className="p-5" onClick={() => handleSort(sortControle, setSortControle, 'projeto')}>Projeto & Local/Destino {renderSortIcon(sortControle, 'projeto')}</th>
                  <th className="p-5" onClick={() => handleSort(sortControle, setSortControle, 'produto_acabado')}>PA (Alvo de Prod.) {renderSortIcon(sortControle, 'produto_acabado')}</th>
                  <th className="p-5" onClick={() => handleSort(sortControle, setSortControle, 'codigoMP')}>MP Retirada {renderSortIcon(sortControle, 'codigoMP')}</th>
                  <th className="p-5 text-right" onClick={() => handleSort(sortControle, setSortControle, 'quantidadeTotal')}>Qtd MP {renderSortIcon(sortControle, 'quantidadeTotal')}</th>
                  <th className="p-5 text-center pr-8" onClick={() => handleSort(sortControle, setSortControle, 'status')}>Status {renderSortIcon(sortControle, 'status')}</th>
                </tr>
                <tr className="bg-white border-b border-zinc-100">
                  <th className="px-5 py-3"></th>
                  <th className="px-5 py-3"><input list="dl-c-proj" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500" placeholder="Procurar..." value={filtrosControle.projeto} onChange={e => setFiltrosControle({...filtrosControle, projeto: e.target.value})} /><datalist id="dl-c-proj">{optionsC.projeto.map(o => <option key={o} value={o} />)}</datalist></th>
                  <th className="px-5 py-3"><input list="dl-c-pa" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500" placeholder="Procurar..." value={filtrosControle.pa} onChange={e => setFiltrosControle({...filtrosControle, pa: e.target.value})} /><datalist id="dl-c-pa">{optionsC.pa.map(o => <option key={o} value={o} />)}</datalist></th>
                  <th className="px-5 py-3"><input list="dl-c-mp" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500" placeholder="Procurar..." value={filtrosControle.mp} onChange={e => setFiltrosControle({...filtrosControle, mp: e.target.value})} /><datalist id="dl-c-mp">{optionsC.mp.map(o => <option key={o} value={o} />)}</datalist></th>
                  <th className="px-5 py-3"></th>
                  <th className="px-5 py-3 pr-8 text-center"><select className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none cursor-pointer focus:border-yellow-500" value={filtrosControle.status} onChange={e => setFiltrosControle({...filtrosControle, status: e.target.value})}><option value="">Todos</option><option value="ENVIADO">Trânsito</option><option value="RETORNO_PARCIAL">Parcial</option><option value="RETORNADO">Entregue</option></select></th>
                </tr>
              </thead><tbody className="divide-y divide-zinc-50">
                {controleFiltrado.map((linha, idx) => (
                  <tr key={idx} className={`hover:bg-zinc-50 transition-colors ${linha.isRateio ? 'bg-indigo-50/30' : ''}`}>
                    <td className="p-5 pl-8 font-bold text-zinc-500 text-center"><Calendar className="w-3 h-3 mx-auto opacity-30 mb-1" />{linha.remessa?.data_envio ? new Date(linha.remessa.data_envio).toLocaleDateString() : '---'}</td>
                    <td className="p-5 font-black text-zinc-900 uppercase tracking-tighter">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className={`text-sm ${linha.isRateio ? 'text-indigo-600' : ''}`}>{s(linha.remessa?.projeto)}</span>
                        <div className="flex items-center text-[9px] text-zinc-600 font-bold bg-zinc-100 border border-zinc-200 px-2 py-1 rounded w-fit"><MapPin className="w-2.5 h-2.5 mr-1 text-zinc-400"/>{linha.remessa?.status === 'RETORNADO' ? 'Estoque Interno' : s(linha.remessa?.expedicao?.destinatario || linha.remessa?.cliente || 'Em Trânsito')}</div>
                        {linha.isRateio && <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full mt-0.5"><Link2 className="w-2 h-2 mr-1 inline"/> RATEADO DE: {s(linha.origemProjeto)}</span>}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className="font-black text-blue-600 uppercase tracking-tighter text-sm">{s(linha.remessa?.produto_acabado)}</span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Alvo: {fmtDec(linha.remessa?.quantidade_op)} PÇS</span>
                      </div>
                    </td>
                    <td className="p-5 font-black text-zinc-700 uppercase tracking-tighter text-sm">{s(linha.codigoMP)}</td>
                    <td className="p-5 text-right font-black text-zinc-900"><span className="bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm">{fmtDec(linha.quantidadeTotal)} <span className="text-[9px] text-zinc-400 font-bold">{s(linha.um)}</span></span></td>
                    <td className="p-5 text-center pr-8">{linha.remessa?.status === 'RETORNADO' ? <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">Interno</span> : <span className="bg-amber-50 text-amber-600 border border-amber-200 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">Externo</span>}</td>
                  </tr>
                ))}
                {controleFiltrado.length === 0 && <tr><td colSpan="6" className="p-20 text-center font-black text-zinc-300 uppercase text-lg tracking-widest">Sem registos encontrados</td></tr>}
              </tbody></table></div>
            </div>
          </div>
        )}

        {/* 4. ABA AUDITORIA (EXCEL STYLE) */}
        {abaAtiva === 'AUDITORIA' && isAdmin && (
          <div className="max-w-6xl mx-auto space-y-6 w-full animate-in fade-in pb-10">
             <div className="border-b-4 border-red-500 pb-4 flex justify-between items-end">
               <div><h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase leading-none">Auditoria de BOM</h2><p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">Divergências Operacionais: PCP vs Estrutura Original</p></div>
               <div className="flex gap-4">
                 <button onClick={() => setFiltrosAuditoria({projeto:'', pa:'', mp:'', status:''})} className="bg-white border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:text-red-500 flex items-center shadow-sm transition-all"><XCircle className="w-3 h-3 mr-2"/> Limpar Filtros</button>
               </div>
             </div>
             <div className="bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer">
                    <th className="p-5 pl-8 text-center" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'data')}>Lançamento {renderSortIcon(sortAuditoria, 'data')}</th>
                    <th className="p-5" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'projeto')}>Projeto & Local {renderSortIcon(sortAuditoria, 'projeto')}</th>
                    <th className="p-5" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'pa')}>PA (Alvo Produtivo) {renderSortIcon(sortAuditoria, 'pa')}</th>
                    <th className="p-5" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'codigoMP')}>Material By-Pass (Ausente) {renderSortIcon(sortAuditoria, 'codigoMP')}</th>
                    <th className="p-5 text-center pr-8" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'resolvido')}>Status Lógico {renderSortIcon(sortAuditoria, 'resolvido')}</th>
                  </tr>
                  <tr className="bg-white border-b border-zinc-100">
                    <th className="px-5 py-3"></th>
                    <th className="px-5 py-3"><input list="dl-a-proj" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500" placeholder="Procurar..." value={filtrosAuditoria.projeto} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, projeto: e.target.value})} /><datalist id="dl-a-proj">{optionsC.projeto.map(o => <option key={o} value={o} />)}</datalist></th>
                    <th className="px-5 py-3"><input list="dl-a-pa" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500" placeholder="Procurar..." value={filtrosAuditoria.pa} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, pa: e.target.value})} /><datalist id="dl-a-pa">{optionsC.pa.map(o => <option key={o} value={o} />)}</datalist></th>
                    <th className="px-5 py-3"><input list="dl-a-mp" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none focus:border-yellow-500" placeholder="Procurar..." value={filtrosAuditoria.mp} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, mp: e.target.value})} /><datalist id="dl-a-mp">{optionsC.mp.map(o => <option key={o} value={o} />)}</datalist></th>
                    <th className="px-5 py-3 pr-8 text-center"><select className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-bold text-zinc-700 outline-none cursor-pointer focus:border-yellow-500" value={filtrosAuditoria.status} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, status: e.target.value})}><option value="">Todos</option><option value="PENDENTE">Pendente</option><option value="RESOLVIDO">Regularizado</option></select></th>
                  </tr>
                </thead><tbody className="divide-y divide-zinc-50">
                   {auditoriaFiltrada.map((p, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                        <td className="p-5 pl-8 font-bold text-zinc-500 text-center">{p.data ? new Date(p.data).toLocaleDateString() : '---'}</td>
                        <td className="p-5 font-black text-zinc-900 uppercase tracking-tighter">
                           <div className="flex flex-col gap-1.5">
                              <span className="text-sm">{s(p.projeto)}</span>
                              {p.cliente && <div className="flex items-center text-[9px] text-zinc-500 font-bold bg-zinc-100 px-2 py-1 rounded w-fit border border-zinc-200"><MapPin className="w-2.5 h-2.5 mr-1 text-zinc-400"/> {s(p.cliente)}</div>}
                           </div>
                        </td>
                        <td className="p-5">
                           <div className="flex flex-col items-start gap-1.5">
                             <span className="font-black text-blue-600 uppercase tracking-tighter text-sm">{s(p.pa)}</span>
                             <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shadow-sm">Alvo: {fmtDec(p.quantidade_op)} PÇS</span>
                           </div>
                        </td>
                        <td className="p-5">
                           <div className="flex flex-col items-start gap-1.5">
                              <div className="flex items-center gap-2">
                                 <span className="font-black text-red-600 uppercase text-sm">{s(p.codigoMP)}</span>
                                 <span className="bg-red-50 text-red-700 font-black text-[10px] px-2 py-0.5 rounded border border-red-200 shadow-sm">FALTOU: {fmtDec(p.quantidade, p.um)}</span>
                              </div>
                              <p className="text-[9px] text-zinc-500 font-bold max-w-[250px] truncate" title={s(p.descricao)}>{s(p.descricao)}</p>
                           </div>
                        </td>
                        <td className="p-5 text-center pr-8">
                           {p.resolvido ? (
                              <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-200 shadow-sm">Resolvido Módulo</div>
                           ) : (
                              <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-200 shadow-sm animate-pulse">Pendente Ação</div>
                           )}
                        </td>
                      </tr>
                   ))}
                   {auditoriaFiltrada.length === 0 && <tr><td colSpan="5" className="p-24 text-center font-black text-zinc-300 uppercase text-lg tracking-widest">Nenhuma divergência encontrada</td></tr>}
                </tbody></table></div>
             </div>
          </div>
        )}

        {/* 5. FILA DE EXPEDIÇÃO */}
        {abaAtiva === 'EXPEDICAO' && (
          <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-8rem)] animate-in fade-in">
             <div className="w-full md:w-1/3 bg-white rounded-[2rem] border border-zinc-200 flex flex-col overflow-hidden shadow-sm">
                <div className="p-6 border-b border-zinc-100 bg-yellow-50 flex justify-between items-center"><h2 className="font-black text-yellow-900 text-lg uppercase tracking-wider flex items-center"><Clock className="w-5 h-5 mr-2" /> Fila Logística ({remessasPendentes.length})</h2><button onClick={fetchAllData} className="text-yellow-600 hover:rotate-180 transition-all duration-500 p-2 hover:bg-yellow-200 rounded-full"><RefreshCcw className="w-4 h-4"/></button></div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-50">
                   {remessasPendentes.map(rem => (
                      <div key={rem.id} onClick={() => setRemessaSelecionada(rem)} className={`p-6 rounded-2xl border cursor-pointer transition-all ${remessaSelecionada?.id === rem.id ? 'border-yellow-500 bg-white shadow-md ring-4 ring-yellow-500/10 scale-[1.02]' : 'border-zinc-200 bg-white hover:border-yellow-300'}`}>
                         <div className="flex justify-between items-start mb-2">
                             <span className="font-black text-yellow-600 text-[10px] uppercase tracking-widest block bg-yellow-50 px-2 py-0.5 rounded">BR: {s(rem.projeto)}</span>
                             {rem.remessa_pai_id && <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-widest">Complemento</span>}
                         </div>
                         <h4 className="font-black text-zinc-900 text-xl uppercase leading-tight tracking-tighter truncate" title={s(rem.produto_acabado)}>{s(rem.produto_acabado)}</h4>
                         <span className="text-zinc-500 text-[10px] font-bold mt-1 block truncate">{s(rem.cliente || 'Interno')}</span>
                         <span className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded text-[9px] font-black uppercase mt-4 inline-block">{s(rem.observacao)}</span>
                      </div>
                   ))}
                   {remessasPendentes.length === 0 && <div className="p-24 text-center font-black text-zinc-300 uppercase tracking-widest">Fila Vazia</div>}
                </div>
             </div>
             <div className="flex-1 bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                {remessaSelecionada ? (
                  <div className="p-8 md:p-10 space-y-8 overflow-y-auto custom-scrollbar h-full animate-in slide-in-from-right-4">
                     <div className="pb-6 border-b border-zinc-100 flex justify-between items-start">
                        <div>
                          <div className="bg-black text-yellow-500 text-[10px] font-black px-4 py-1.5 rounded-full w-fit uppercase mb-4 tracking-widest shadow-sm">OP PROJETO: {s(remessaSelecionada.projeto)}</div>
                          <h3 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase leading-none tracking-tighter">{s(remessaSelecionada.produto_acabado)}</h3>
                          <p className="text-sm font-bold text-zinc-500 mt-2 uppercase">{s(remessaSelecionada.cliente)}</p>
                          {remessaSelecionada.obs_expedicao && <div className="mt-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-2xl shadow-sm"><p className="text-[10px] font-black text-red-700 uppercase mb-1">Nota Urgente PCP:</p><p className="text-sm font-bold text-zinc-800 italic">"{s(remessaSelecionada.obs_expedicao)}"</p></div>}
                        </div>
                        <button onClick={() => setRemessaSelecionada(null)} className="text-zinc-400 hover:text-red-500 transition-colors p-2 bg-zinc-50 hover:bg-red-50 rounded-full"><X size={24}/></button>
                     </div>
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest flex items-center"><Truck className="w-3 h-3 mr-1 text-zinc-400"/> Transporte</label><input placeholder="Rodoviário / Aéreo" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-4 font-black text-zinc-900 outline-none focus:border-yellow-500" value={formExpedicao.transporte} onChange={e => setFormExpedicao({...formExpedicao, transporte: e.target.value})} /></div>
                           <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest flex items-center"><PackageOpen className="w-3 h-3 mr-1 text-zinc-400"/> Transportadora</label><input placeholder="Nome Empresa" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-4 font-black text-zinc-900 outline-none focus:border-yellow-500" value={formExpedicao.transportadora} onChange={e => setFormExpedicao({...formExpedicao, transportadora: e.target.value})} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest flex items-center"><Boxes className="w-3 h-3 mr-1 text-zinc-400"/> Volumes (Qtd)</label><input type="number" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-4 font-black text-zinc-900 outline-none focus:border-yellow-500" value={formExpedicao.quantidade} onChange={e => setFormExpedicao({...formExpedicao, quantidade: e.target.value})} /></div>
                           <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest flex items-center"><Weight className="w-3 h-3 mr-1 text-zinc-400"/> Peso Total (KG)</label><input className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-4 font-black text-zinc-900 outline-none focus:border-yellow-500" value={formExpedicao.pesoTotal} onChange={e => setFormExpedicao({...formExpedicao, pesoTotal: e.target.value})} /></div>
                           <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest flex items-center"><Calendar className="w-3 h-3 mr-1 text-zinc-400"/> Data Saída</label><input type="date" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-4 font-black text-zinc-900 outline-none focus:border-yellow-500" value={formExpedicao.dataSaida} onChange={e => setFormExpedicao({...formExpedicao, dataSaida: e.target.value})} /></div>
                        </div>
                        <div className="space-y-1.5"><label className="text-[10px] font-black text-yellow-600 uppercase ml-1 tracking-widest flex items-center"><MapPin className="w-3 h-3 mr-1"/> Destinatário Final</label><input placeholder="Destino / Fornecedor Físico" className="w-full bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-4 font-black text-zinc-900 outline-none focus:border-yellow-500 shadow-inner" value={formExpedicao.destinatario} onChange={e => setFormExpedicao({...formExpedicao, destinatario: e.target.value})} /></div>
                     </div>
                     <button onClick={concluirExpedicao} className="w-full bg-black text-yellow-500 font-black py-6 rounded-2xl shadow-xl hover:bg-zinc-900 transition-all text-lg flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest"><FileSpreadsheet className="w-6 h-6" /> Gerar Planilha SGQ & Concluir Saída</button>
                  </div>
                ) : ( <div className="h-full flex items-center justify-center font-black text-zinc-200 uppercase tracking-widest flex-col p-10 text-center bg-zinc-50/50"><Truck className="w-24 h-24 mb-6 opacity-20"/><p>Aguardando Seleção de Remessa</p></div> )}
             </div>
          </div>
        )}

        {/* 6. RETORNO DE PEÇAS */}
        {abaAtiva === 'FORNECEDORES' && (
           <div className="max-w-6xl mx-auto space-y-6 w-full animate-in fade-in pb-10">
              <div className="flex justify-between items-end mb-6">
                <div><h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase leading-none">Gestão de Retornos Físicos</h2><p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">Dê entrada em materiais vindos de terceiros para o estoque</p></div>
                <div className="relative w-72">
                   <Search className="w-4 h-4 absolute left-4 top-3.5 text-zinc-400" />
                   <input placeholder="Filtrar por BR..." className="w-full bg-white border border-zinc-200 shadow-sm rounded-xl pl-12 pr-4 py-3 font-bold text-sm outline-none focus:border-yellow-500 transition-all" value={buscaFornecedor} onChange={e => setBuscaFornecedor(e.target.value)} />
                </div>
              </div>
              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 custom-scrollbar">
                 {remessasFora.filter(r => !buscaFornecedor || s(r.projeto).toUpperCase().includes(buscaFornecedor.toUpperCase())).map(rem => (
                    <div key={rem.id} className={`p-8 rounded-[2rem] border bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${rem.status === 'RETORNADO' ? 'opacity-50 grayscale shadow-none border-zinc-100' : 'shadow-sm border-zinc-200 hover:border-yellow-300'}`}>
                       <div className="space-y-2 flex-1">
                          <div className="flex gap-2 items-center">
                             <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">Destino: {s(rem.expedicao?.destinatario || rem.cliente)}</span>
                             {rem.remessa_pai_id && <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">Complemento</span>}
                          </div>
                          <h4 className="font-black text-2xl text-zinc-900 uppercase tracking-tight leading-none">{s(rem.projeto)} <span className="text-zinc-400 mx-2">•</span> <span className="text-blue-600 text-xl">{s(rem.produto_acabado)}</span></h4>
                          <div className="flex flex-wrap gap-4 mt-4 bg-zinc-50 p-3 rounded-xl border border-zinc-100 w-fit">
                            <div className="flex flex-col"><span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Física Enviada</span><span className="font-black text-zinc-800">{fmtDec(rem.quantidade_op, 'PÇS')}</span></div>
                            <div className="w-px bg-zinc-200"></div>
                            <div className="flex flex-col"><span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Recebido (Baixado)</span><span className="font-black text-emerald-600">{fmtDec(rem.pecas_recebidas||0, 'PÇS')}</span></div>
                            <div className="w-px bg-zinc-200"></div>
                            <div className="flex flex-col"><span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Saldo na Rua</span><span className="font-black text-red-600">{fmtDec(Number(rem.quantidade_op) - Number(rem.pecas_recebidas || 0), 'PÇS')}</span></div>
                          </div>
                       </div>
                       {rem.status !== 'RETORNADO' ? (
                          <button onClick={() => { setRemessaParaRetorno(rem); setQtdPecasRetornando(''); }} className="bg-black text-yellow-500 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-zinc-900 active:scale-95 transition-all flex items-center shrink-0">Baixar Retorno <ArrowLeftRight className="w-4 h-4 ml-3"/></button>
                       ) : ( <div className="text-emerald-600 font-black flex items-center uppercase text-[10px] tracking-widest bg-emerald-50 px-6 py-4 rounded-xl border border-emerald-200 shadow-sm shrink-0"><CheckCircle className="w-5 h-5 mr-2" /> Ciclo Físico Fechado</div> )}
                    </div>
                 ))}
                 {remessasFora.length === 0 && <div className="p-24 text-center font-black text-zinc-300 uppercase text-lg tracking-widest">Nenhuma carga na rua</div>}
              </div>
           </div>
        )}

        {/* MODAL DE ENTRADA (RETORNO) */}
        {remessaParaRetorno && (
           <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-zinc-100 rounded-[3rem] w-full max-w-5xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh] border border-zinc-800">
                 <div className="p-8 border-b border-zinc-200 bg-white flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Devolução Física: {s(remessaParaRetorno.projeto)}</h2>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Recuperação de Estoque ERP • {s(remessaParaRetorno.produto_acabado)}</p>
                    </div>
                    <button onClick={() => setRemessaParaRetorno(null)} className="text-zinc-400 text-2xl font-black hover:text-red-500 transition-colors p-2 bg-zinc-50 hover:bg-red-50 rounded-full"><X size={24}/></button>
                 </div>
                 <div className="p-8 grid grid-cols-1 md:grid-cols-5 gap-8 overflow-y-auto custom-scrollbar">
                    <div className="md:col-span-2 space-y-6">
                       <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm text-center">
                          <label className="text-xs font-black text-zinc-500 uppercase block mb-4 tracking-widest">Qtd Física (PA) a Baixar Agora:</label>
                          <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-8 font-black text-6xl text-zinc-900 text-center outline-none focus:border-yellow-500 transition-all shadow-inner" value={qtdPecasRetornando} onChange={e => setQtdPecasRetornando(e.target.value)} placeholder="0" />
                          <div className="mt-8 flex justify-center gap-8 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                            <div className="text-center"><p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Saída Original</p><p className="text-lg font-black text-zinc-800">{fmtDec(remessaParaRetorno.quantidade_op, 'PÇS')}</p></div>
                            <div className="w-px bg-zinc-200"></div>
                            <div className="text-center"><p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Saldo Atual na Rua</p><p className="text-lg font-black text-red-600">{fmtDec(Number(remessaParaRetorno.quantidade_op) - Number(remessaParaRetorno.pecas_recebidas || 0), 'PÇS')}</p></div>
                          </div>
                       </div>
                    </div>
                    <div className="md:col-span-3 bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                      <div className="p-6 bg-zinc-950 border-b border-zinc-800 font-black text-xs text-yellow-500 uppercase tracking-widest flex items-center justify-between"><span>Prévia de Recuperação no Estoque MP</span><Calculator className="w-5 h-5 opacity-50"/></div>
                      <div className="overflow-y-auto max-h-[350px]"><table className="w-full text-left text-xs"><thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0"><tr className="text-[10px] text-zinc-500 tracking-widest uppercase"><th className="p-4 pl-6">Material MP</th><th className="p-4 text-center">Un.</th><th className="p-4 text-right pr-6">Volume Físico Devolvido</th></tr></thead><tbody className="divide-y divide-zinc-50">
                        {(Array.isArray(remessaParaRetorno.itens) ? remessaParaRetorno.itens : []).map((it, idx) => {
                          const valDigitado = parseNumBR(qtdPecasRetornando); const ratio = valDigitado / Number(remessaParaRetorno.quantidade_op); const calc = Number((it.quantidadeTotal * ratio).toFixed(4));
                          return (<tr key={idx} className="hover:bg-zinc-50 transition-colors"><td className="p-4 pl-6 font-black uppercase text-zinc-800">{s(it.codigoMP)}</td><td className="p-4 text-center font-bold text-zinc-400">{s(it.um)}</td><td className="p-4 pr-6 text-right font-black text-emerald-600 text-sm bg-emerald-50/30">+{fmtDec(calc)}</td></tr>);
                        })}
                     </tbody></table></div></div>
                 </div>
                 <div className="p-8 bg-white border-t border-zinc-200 flex justify-end">
                    <button onClick={processarRetornoParcial} disabled={!qtdPecasRetornando || isLoading} className="bg-black text-yellow-500 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl disabled:opacity-20 transition-all hover:bg-zinc-900 active:scale-95 flex items-center gap-3"><CheckCircle className="w-5 h-5"/> Confirmar Baixa Física & Atualizar ERP</button>
                 </div>
              </div>
           </div>
        )}

        {/* 7. UPLOAD ESTOQUE */}
        {abaAtiva === 'UPLOAD_ESTOQUE' && (
          <div className="max-w-3xl mx-auto space-y-6 text-center w-full animate-in fade-in pb-10">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase leading-none">Sincronização ERP Master</h2>
            <div className="bg-white rounded-[3rem] p-16 border border-zinc-200 shadow-sm flex flex-col items-center">
              <div className="w-32 h-32 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center mb-8"><UploadCloud className="w-16 h-16 text-yellow-600" /></div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4 uppercase tracking-tighter">Injetar Planilha Base</h3>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-10 max-w-sm leading-relaxed text-center">Atualize Produtos (BOM) e Saldo de Estoque Físico.</p>
              <label className={`inline-flex items-center justify-center px-16 py-8 rounded-[2rem] font-black text-xl transition-all cursor-pointer shadow-lg uppercase tracking-widest text-sm ${isLoading ? 'bg-zinc-100 text-zinc-400 shadow-none cursor-default border border-zinc-200' : 'bg-black text-yellow-500 hover:bg-zinc-900 active:scale-95'}`}>
                {isLoading ? <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> PROCESSANDO ({uploadProgress}%)</> : <><Database className="w-6 h-6 mr-3" /> CARREGAR ARQUIVO EXCEL</>}
                <input type="file" accept=".xlsx" className="hidden" disabled={isLoading} onChange={async (e) => {
                   const file = e.target.files[0]; if(!file || !window.XLSX) return;
                   setIsLoading(true); setUploadProgress(5); const reader = new FileReader();
                   reader.onload = async (evt) => {
                      try {
                        const wb = window.XLSX.read(evt.target.result, { type: 'array' }); const json = window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                        const pMap = {}; const eMap = {};
                        json.forEach(row => {
                           const nRow = {}; Object.keys(row).forEach(k => nRow[normalizeKey(k)] = row[k]);
                           const pa = s(nRow['COD_PROD_ACABADO'] || nRow['COD_ACABADO'] || nRow['PRODUTO'] || nRow['PA'] || '').trim();
                           const mp = s(nRow['MATERIA_PRIMA'] || nRow['CODIGO_MP'] || nRow['MATERIAL'] || nRow['MP'] || '').trim();
                           if(!pa || !mp) return;
                           if(!pMap[pa]) pMap[pa] = { codigo_pa: pa, descricao: s(nRow['DESCRICAO_PRODUTO_ACABADO'] || nRow['DESCRICAO_PA'] || nRow['DESCRICAO'] || 'PA'), materiais: [] };
                           pMap[pa].materiais.push({ codigoMP: mp, quantidade: parseNumBR(nRow['QUANTIDADE'] || nRow['QTD']), um: s(nRow['UNIDADE'] || nRow['UN'] || 'UN') });
                           if(!eMap[mp]) eMap[mp] = { codigo_mp: mp, descricao: s(nRow['DESCRICAO_MATERIA_PRIMA'] || nRow['DESCRICAO_MP'] || nRow['DESCRICAO_MATERIAL'] || 'MP'), saldo_disponivel: parseNumBR(nRow['DISPONIVEL_PARA_PRODUCAO'] || nRow['SALDO_FISICO'] || nRow['DISPONIVEL'] || nRow['SALDO']), unidade: s(nRow['UNIDADE'] || nRow['UN'] || 'UN') };
                        });
                        const listProd = Object.values(pMap); const listStock = Object.values(eMap);
                        if(listProd.length === 0) throw new Error("Ficheiro inválido.");
                        setUploadProgress(40); for (let i = 0; i < listProd.length; i += 100) await supabase.from('produtos').upsert(listProd.slice(i, i + 100), { onConflict: 'codigo_pa' });
                        setUploadProgress(70); for (let i = 0; i < listStock.length; i += 100) await supabase.from('estoque_mp').upsert(listStock.slice(i, i + 100), { onConflict: 'codigo_mp' });
                        setUploadProgress(100); setSucesso("Banco mestre sincronizado!");
                      } catch(err) { setErro("Erro Sync: " + err.message); } finally { setIsLoading(false); setUploadProgress(0); fetchAllData(); }
                   }; reader.readAsArrayBuffer(file);
                }} />
              </label>
            </div>
          </div>
        )}

        {/* 8. GESTÃO DE ACESSOS */}
        {abaAtiva === 'GESTAO_USUARIOS' && isAdmin && (
           <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-10">
              <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Administração de Acessos</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm">
                   <h3 className="font-black text-zinc-900 flex items-center text-sm uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4">{isEditingUser ? <Settings className="w-5 h-5 mr-2 text-yellow-600" /> : <UserPlus className="w-5 h-5 mr-2 text-yellow-600" />} {isEditingUser ? 'Editar Acesso' : 'Novo Funcionário'}</h3>
                   <form onSubmit={salvarUsuario} className="space-y-4">
                      <input required placeholder="Nome Completo" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-bold text-zinc-900 outline-none focus:border-yellow-500" value={novoUsuario.nome} onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})} />
                      <input required type="email" placeholder="E-mail Corporativo" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-bold text-zinc-900 outline-none disabled:opacity-50 focus:border-yellow-500" value={novoUsuario.email} disabled={isEditingUser} onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})} />
                      <input required placeholder="Senha Temporária" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-bold text-zinc-900 outline-none focus:border-yellow-500" value={novoUsuario.senha} onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})} />
                      <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-black text-zinc-900 outline-none cursor-pointer focus:border-yellow-500" value={novoUsuario.perfil} onChange={e => setNovoUsuario({...novoUsuario, perfil: e.target.value})}>
                        <option value="PCP">Perfil PCP (Operacional)</option><option value="EXPEDICAO">Perfil Logística (Expedição)</option><option value="ADMIN">Administrador (Total)</option>
                      </select>
                      <button type="submit" className={`w-full text-yellow-500 font-black py-4 rounded-xl shadow-lg bg-black uppercase tracking-widest text-xs mt-4 hover:bg-zinc-900 active:scale-95 transition-all`}>Gravar Dados</button>
                   </form>
                </div>
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm">
                   <div className="p-6 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between font-black text-zinc-800 uppercase tracking-widest text-xs">Utilizadores Ativos ({usuariosDb.length})</div>
                   <table className="w-full text-left text-xs whitespace-nowrap"><tbody className="divide-y divide-zinc-50">
                      {usuariosDb.map(u => (
                        <tr key={u.email} className="hover:bg-zinc-50 transition-colors">
                           <td className="p-4 pl-8"><p className="font-black text-zinc-900 text-sm">{s(u.nome)}</p><p className="text-[10px] text-zinc-400 font-bold">{s(u.email)}</p></td>
                           <td className="p-4"><span className={`px-3 py-1 rounded border text-[9px] font-black uppercase tracking-widest shadow-sm ${u.perfil === 'ADMIN' ? 'bg-zinc-900 text-yellow-500 border-black' : u.perfil === 'EXPEDICAO' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{s(u.perfil)}</span></td>
                           <td className="p-4 text-center pr-8 flex items-center justify-end gap-2">
                              <button onClick={() => { setNovoUsuario(u); setIsEditingUser(true); }} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Settings className="w-4 h-4"/></button>
                              <button onClick={() => excluirUsuario(u.email)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                           </td>
                        </tr>
                      ))}
                   </tbody></table>
                </div>
              </div>
           </div>
        )}

        {/* 9. ABA IA ANALISTA (TELA CHEIA) */}
        {abaAtiva === 'IA_ANALISTA' && isAdmin && (
           <div className="max-w-6xl mx-auto w-full h-[calc(100vh-6rem)] flex flex-col bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden animate-in fade-in">
              {relatorioApresentacao ? (
                  <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-12">
                     <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-6 mb-10">
                        <div>
                           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Relatório Executivo Oficial</p>
                           <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">{relatorioApresentacao.titulo}</h2>
                           <p className="text-xs font-bold text-zinc-500 mt-2 uppercase">Gerado por: {relatorioApresentacao.criado_por} em {new Date(relatorioApresentacao.data_criacao).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-3">
                           <button onClick={() => window.print()} className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center"><FileSpreadsheet className="w-4 h-4 mr-2"/> Exportar / Imprimir</button>
                           <button onClick={() => setRelatorioApresentacao(null)} className="bg-black text-yellow-500 hover:bg-zinc-900 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center"><X className="w-4 h-4 mr-2"/> Fechar</button>
                        </div>
                     </div>
                     <div className="space-y-10">
                         {relatorioApresentacao.conteudo.filter(m => m.role === 'assistant').map((msg, i) => (
                             <div key={i} className="space-y-8">
                                 {parseBotMessage(msg.content).map((part, idx) => {
                                      if (part.type === 'text') return <div key={idx} className="prose prose-sm max-w-none text-zinc-700 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: part.content }} />;
                                      if (part.type === 'CHART' && part.payload.data) {
                                          const keys = Object.keys(part.payload.data[0]).filter(k => k !== 'name');
                                          return (
                                              <div key={idx} className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 h-[400px] flex flex-col">
                                                 <h4 className="text-lg font-black text-zinc-800 uppercase tracking-widest mb-6 text-center">{part.payload.title}</h4>
                                                 <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={part.payload.data} margin={{top:20, right:0, left:0, bottom:0}}>
                                                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#71717a'}} />
                                                       <Tooltip cursor={{fill: '#f4f4f5'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '12px'}} />
                                                       <Legend wrapperStyle={{fontSize: '11px', fontWeight: 'bold', paddingTop: '10px'}} />
                                                       {keys.map((k, j) => (
                                                          <Bar key={k} dataKey={k} name={k} fill={CHART_COLORS[j % CHART_COLORS.length]} radius={[4, 4, 0, 0]} maxBarSize={40}>
                                                             <LabelList dataKey={k} position="top" fill="#71717a" fontSize={10} fontWeight="bold" formatter={(v) => fmtDec(v)} />
                                                          </Bar>
                                                       ))}
                                                    </BarChart>
                                                 </ResponsiveContainer>
                                              </div>
                                          );
                                      }
                                      if (part.type === 'INSIGHT' && part.payload.title) {
                                          return (
                                              <div key={idx} className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 flex gap-4 shadow-sm">
                                                  <div className="bg-yellow-500 text-black p-3 rounded-xl h-fit shadow-sm"><Activity className="w-6 h-6"/></div>
                                                  <div><h4 className="text-sm font-black text-yellow-900 uppercase tracking-widest mb-2">{part.payload.title}</h4><p className="text-yellow-800 text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: part.payload.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>
                                              </div>
                                          );
                                      }
                                      return null;
                                 })}
                             </div>
                         ))}
                     </div>
                  </div>
              ) : (
                 <>
                    <div className="p-6 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                       <div className="flex items-center gap-3"><div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600"><Bot className="w-6 h-6"/></div><div><h2 className="font-black text-zinc-900 text-lg uppercase tracking-wider">Cientista de Dados IA</h2><p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Motor: OpenAI Class-5 Ativo</p></div></div>
                       <div className="flex gap-3">
                           {relatoriosIaDb.length > 0 && (
                               <select className="bg-white border border-zinc-200 px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 outline-none cursor-pointer hover:border-indigo-400" onChange={(e) => { const r = relatoriosIaDb.find(x => x.id === e.target.value); if(r) setRelatorioApresentacao(r); e.target.value=""; }}>
                                   <option value="">📂 Abrir Acervo ({relatoriosIaDb.length})</option>
                                   {relatoriosIaDb.map(r => <option key={r.id} value={r.id}>{r.titulo} ({new Date(r.data_criacao).toLocaleDateString()})</option>)}
                               </select>
                           )}
                           <button onClick={salvarRelatorioIA} className="bg-black text-yellow-500 px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-900 transition-colors shadow-sm flex items-center"><Save className="w-3 h-3 mr-2"/> Gravar Relatório</button>
                       </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-50/50 custom-scrollbar">
                       {chatMessages.map((m, i) => (
                          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[85%] rounded-3xl p-6 ${m.role === 'user' ? 'bg-zinc-900 text-white rounded-br-sm shadow-xl' : 'bg-white border border-zinc-200 rounded-bl-sm shadow-sm'}`}>
                                {m.role === 'user' ? ( <p className="font-medium text-sm leading-relaxed">{m.content}</p> ) : (
                                   <div className="space-y-6">
                                      {parseBotMessage(m.content).map((part, idx) => {
                                         if (part.type === 'text') return <div key={idx} className="prose prose-sm max-w-none text-zinc-700 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: part.content }} />;
                                         if (part.type === 'CHART' && part.payload.data) {
                                            const keys = Object.keys(part.payload.data[0]).filter(k => k !== 'name');
                                            return (
                                               <div key={idx} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 h-[350px] flex flex-col mt-4 shadow-xl">
                                                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">{part.payload.title}</h4>
                                                  <ResponsiveContainer width="100%" height="100%">
                                                     <BarChart data={part.payload.data} margin={{top:20, right:0, left:0, bottom:0}}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold', fill: '#a1a1aa'}} />
                                                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', color: '#fff'}} />
                                                        <Legend wrapperStyle={{fontSize: '10px', fontWeight: 'bold', paddingTop: '10px'}} />
                                                        {keys.map((k, j) => (
                                                           <Bar key={k} dataKey={k} name={k} fill={CHART_COLORS[j % CHART_COLORS.length]} radius={[4, 4, 0, 0]} maxBarSize={30}>
                                                              <LabelList dataKey={k} position="top" fill="#a1a1aa" fontSize={9} fontWeight="bold" formatter={(v) => fmtDec(v)} />
                                                           </Bar>
                                                        ))}
                                                     </BarChart>
                                                  </ResponsiveContainer>
                                               </div>
                                            );
                                         }
                                         if (part.type === 'INSIGHT' && part.payload.title) {
                                            return (
                                               <div key={idx} className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex gap-4 mt-4 shadow-sm">
                                                  <div className="bg-indigo-500 text-white p-2 rounded-xl h-fit shadow-sm"><Activity className="w-5 h-5"/></div>
                                                  <div><h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">{part.payload.title}</h4><p className="text-indigo-800 text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: part.payload.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>
                                               </div>
                                            );
                                         }
                                         if (part.type === 'error') return <div key={idx} className="text-red-500 text-xs font-black uppercase p-3 bg-red-50 rounded-lg border border-red-100">{part.content}</div>;
                                         return null;
                                      })}
                                   </div>
                                )}
                             </div>
                          </div>
                       ))}
                       {isChatLoading && <div className="flex justify-start"><div className="bg-white border border-zinc-200 rounded-3xl rounded-bl-sm p-6 shadow-sm flex items-center gap-3"><Loader2 className="w-5 h-5 text-indigo-500 animate-spin" /><span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Processando milhões de dados e gerando visualizações...</span></div></div>}
                    </div>
                    
                    <form onSubmit={enviarMensagemGPT} className="p-6 bg-white border-t border-zinc-100">
                       <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl p-2 shadow-inner focus-within:border-indigo-400 transition-colors">
                          <input className="flex-1 bg-transparent border-none px-4 py-3 text-sm font-medium text-zinc-800 outline-none placeholder:text-zinc-400" placeholder="Peça cruzamentos de dados, lógicas de pendência ou peça para desenhar gráficos gerenciais..." value={chatInput} onChange={e => setChatInput(e.target.value)} disabled={isChatLoading} />
                          <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md"><Send className="w-5 h-5" /></button>
                       </div>
                    </form>
                 </>
              )}
           </div>
        )}

        {/* MODAL DE RATEIO GLOBAL */}
        {modalRateioAberto && idxItemRateio !== null && (
           <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col">
                 <div className="p-8 border-b bg-zinc-50 flex justify-between items-center">
                    <div><span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Rateio Estratégico</span><h2 className="text-2xl font-black text-zinc-900 mt-2 uppercase tracking-tighter">MP: {s(itensRemessa[idxItemRateio]?.codigoMP)}</h2></div>
                    <button onClick={() => setModalRateioAberto(false)} className="text-zinc-400 font-black text-2xl hover:text-red-500 transition-all">&times;</button>
                 </div>
                 <div className="p-8 bg-white space-y-6">
                    <div className="flex gap-4 items-end">
                       <div className="flex-1"><label className="text-[10px] font-black text-zinc-500 uppercase">Projeto Destino</label><input placeholder="BR-..." className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-black text-zinc-900 outline-none shadow-sm focus:border-indigo-400" value={novoRateio.projeto} onChange={e => setNovoRateio({...novoRateio, projeto: e.target.value.toUpperCase()})} /></div>
                       <div className="flex-1"><label className="text-[10px] font-black text-zinc-500 uppercase">PA Destino</label><input placeholder="PA-..." className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-black text-zinc-900 outline-none shadow-sm focus:border-indigo-400" value={novoRateio.codigoPA} onChange={e => setNovoRateio({...novoRateio, codigoPA: e.target.value.toUpperCase()})} /></div>
                       <div className="w-24"><label className="text-[10px] font-black text-zinc-500 uppercase">Qtd</label><input type="number" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-black text-zinc-900 outline-none shadow-sm focus:border-indigo-400" value={novoRateio.quantidade} onChange={e => setNovoRateio({...novoRateio, quantidade: e.target.value})} /></div>
                       <button onClick={() => {
                          if(!novoRateio.projeto || !novoRateio.codigoPA || !novoRateio.quantidade) return;
                          const n = [...itensRemessa]; if(!n[idxItemRateio].rateiosExtras) n[idxItemRateio].rateiosExtras = [];
                          n[idxItemRateio].rateiosExtras.push({ projeto: novoRateio.projeto, codigoPA: novoRateio.codigoPA, quantidade: Number(novoRateio.quantidade) });
                          n[idxItemRateio].quantidadeTotal = n[idxItemRateio].quantidadeOriginal + n[idxItemRateio].rateiosExtras.reduce((acc, c) => acc + c.quantidade, 0);
                          setItensRemessa(n); setNovoRateio({ projeto: '', codigoPA: '', quantidade: '' });
                       }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-indigo-700 shadow-md transition-all">Add</button>
                    </div>
                    <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"><table className="w-full text-left text-xs"><thead className="bg-zinc-50 border-b border-zinc-100"><tr><th className="p-3 pl-5 text-zinc-500 uppercase tracking-widest text-[9px]">Destino</th><th className="p-3 text-zinc-500 uppercase tracking-widest text-[9px]">PA</th><th className="p-3 text-center text-zinc-500 uppercase tracking-widest text-[9px]">Quantidade</th><th className="p-3 text-center text-zinc-500 uppercase tracking-widest text-[9px]">Ação</th></tr></thead><tbody className="divide-y divide-zinc-50">
                       <tr className="bg-indigo-50/50"><td className="p-3 pl-5 font-black text-indigo-900">{s(projeto || 'Ficha Padrão')}</td><td className="p-3 font-bold text-indigo-700">{s(produtoEncontrado?.codigo_pa)}</td><td className="p-3 text-center font-black text-indigo-900">{fmtDec(itensRemessa[idxItemRateio]?.quantidadeOriginal)}</td><td className="p-3 text-center"><Lock className="w-3 h-3 mx-auto text-indigo-300" /></td></tr>
                       {(itensRemessa[idxItemRateio]?.rateiosExtras || []).map((r, ri) => (
                          <tr key={ri} className="hover:bg-zinc-50">
                            <td className="p-3 pl-5 font-black text-zinc-800">{s(r.projeto)}</td><td className="p-3 font-bold text-zinc-600">{s(r.codigoPA)}</td><td className="p-3 text-center font-black text-emerald-600">+{fmtDec(r.quantidade)}</td>
                            <td className="p-3 text-center"><button onClick={() => { const n = [...itensRemessa]; n[idxItemRateio].rateiosExtras.splice(ri, 1); n[idxItemRateio].quantidadeTotal = n[idxItemRateio].quantidadeOriginal + n[idxItemRateio].rateiosExtras.reduce((acc, c) => acc + c.quantidade, 0); setItensRemessa(n); }} className="text-zinc-300 hover:text-red-500 transition-all p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 mx-auto"/></button></td>
                          </tr>
                       ))}
                    </tbody></table></div>
                 </div>
                 <div className="p-8 bg-zinc-50 border-t flex justify-between items-center"><span className="font-black text-zinc-500 uppercase text-xs tracking-widest">Total Saída Carga: <span className="text-indigo-600 text-2xl ml-2">{fmtDec(itensRemessa[idxItemRateio]?.quantidadeTotal)}</span></span><button onClick={() => setModalRateioAberto(false)} className="bg-black text-yellow-500 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-900 shadow-xl transition-all">Validar Rateios</button></div>
              </div>
           </div>
        )}

      </div>

      {/* FLOAT: Chat IA Copiloto */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
         {isMiniIaOpen && (
            <div className="bg-white border border-zinc-200 rounded-[2rem] shadow-2xl w-[350px] h-[500px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
               <div className="p-4 bg-indigo-600 text-white flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2"><Bot className="w-5 h-5 text-indigo-200"/><span className="font-black text-xs uppercase tracking-widest">Copiloto IA</span></div>
                  <button onClick={() => setIsMiniIaOpen(false)} className="text-indigo-200 hover:text-white"><X className="w-5 h-5"/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 custom-scrollbar">
                  {miniIaMessages.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] rounded-2xl p-3 text-xs font-medium ${m.role === 'user' ? 'bg-zinc-900 text-white rounded-br-sm' : 'bg-white border border-zinc-200 rounded-bl-sm text-zinc-700 shadow-sm'}`}>
                           {m.content}
                        </div>
                     </div>
                  ))}
                  {isMiniIaLoading && <div className="flex justify-start"><div className="bg-white border border-zinc-200 rounded-2xl p-3 shadow-sm rounded-bl-sm"><Loader2 className="w-4 h-4 text-indigo-500 animate-spin" /></div></div>}
               </div>
               <form onSubmit={enviarMensagemMiniIA} className="p-3 bg-white border-t border-zinc-100 flex gap-2">
                  <input className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-indigo-400" placeholder="Pergunte algo rápido..." value={miniIaInput} onChange={e => setMiniIaInput(e.target.value)} disabled={isMiniIaLoading} />
                  <button type="submit" disabled={isMiniIaLoading || !miniIaInput.trim()} className="bg-indigo-600 text-white p-2 rounded-xl disabled:opacity-50"><Send className="w-4 h-4"/></button>
               </form>
            </div>
         )}
         <button onClick={() => setIsMiniIaOpen(!isMiniIaOpen)} className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all relative">
            <Bot className="w-6 h-6" />
         </button>
      </div>

      {/* FLOAT: Chat Equipe Interno */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
         {isChatEquipeOpen && (
            <div className="bg-white border border-zinc-200 rounded-[2rem] shadow-2xl w-[350px] h-[450px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
               <div className="p-4 bg-zinc-950 text-white flex justify-between items-center shrink-0 border-b border-zinc-800">
                  <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-yellow-500"/><span className="font-black text-xs uppercase tracking-widest">Chat Equipe</span></div>
                  <button onClick={() => { setIsChatEquipeOpen(false); setChatEquipeHasUnread(false); }} className="text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
               </div>
               <div className="bg-zinc-900 px-3 py-2 shrink-0">
                  <select className="w-full bg-zinc-800 text-white border-none rounded-lg text-xs font-bold p-2 outline-none cursor-pointer" value={chatEquipeDestinatario} onChange={e => setChatEquipeDestinatario(e.target.value)}>
                     <option value="Geral">📣 Sala Geral (Todos)</option>
                     {usuariosDb.filter(u => u.nome !== usuarioLogado?.nome).map(u => <option key={u.email} value={u.nome}>🔒 Privado: {s(u.nome)}</option>)}
                  </select>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 custom-scrollbar">
                  {chatInternoDb.filter(m => m.destinatario === 'Geral' || m.destinatario === usuarioLogado?.nome || m.remetente === usuarioLogado?.nome).map((m, i) => {
                     const isMe = m.remetente === usuarioLogado?.nome;
                     return (
                     <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && <span className="text-[9px] font-black text-zinc-400 uppercase ml-1 mb-1">{m.remetente} {m.destinatario !== 'Geral' && <span className="text-red-500">(Privado)</span>}</span>}
                        {isMe && m.destinatario !== 'Geral' && <span className="text-[9px] font-black text-red-500 uppercase mr-1 mb-1">Para: {m.destinatario}</span>}
                        <div className={`max-w-[90%] rounded-2xl p-3 text-xs font-bold ${isMe ? 'bg-yellow-400 text-black rounded-br-sm shadow-sm' : 'bg-white border border-zinc-200 rounded-bl-sm text-zinc-800 shadow-sm'}`}>
                           {m.mensagem}
                        </div>
                        <span className="text-[8px] font-bold text-zinc-300 mt-1 mx-1">{new Date(m.data_envio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                  )})}
                  <div ref={chatMessagesEndRef} />
               </div>
               <form onSubmit={enviarMensagemEquipe} className="p-3 bg-white border-t border-zinc-100 flex gap-2">
                  <input className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-yellow-400" placeholder="Mensagem..." value={chatEquipeInput} onChange={e => setChatEquipeInput(e.target.value)} />
                  <button type="submit" disabled={!chatEquipeInput.trim()} className="bg-black text-yellow-500 p-2 rounded-xl disabled:opacity-50"><Send className="w-4 h-4"/></button>
               </form>
            </div>
         )}
         <button onClick={() => { setIsChatEquipeOpen(!isChatEquipeOpen); setChatEquipeHasUnread(false); }} className="w-14 h-14 bg-zinc-950 border border-zinc-800 text-yellow-500 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all relative">
            <MessageSquare className="w-6 h-6" />
            {chatEquipeHasUnread && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-bounce border-2 border-zinc-900"></span>}
         </button>
      </div>

    </div>
  );
}
