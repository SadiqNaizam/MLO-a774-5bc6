import React from 'react';
import CountUp from 'react-countup';

interface AnimatedFinancialValueProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  startValue?: number; // Optional: if you want to animate from a specific start
}

const AnimatedFinancialValue: React.FC<AnimatedFinancialValueProps> = ({
  value,
  duration = 1.5,
  decimals = 2,
  prefix = '',
  suffix = '',
  className = '',
  startValue, // If undefined, CountUp usually animates from 0 or previous value
}) => {
  console.log(`Rendering AnimatedFinancialValue: ${prefix}${value}${suffix}`);

  return (
    <span className={className}>
      <CountUp
        start={startValue !== undefined ? startValue : undefined}
        end={value}
        duration={duration}
        decimals={decimals}
        decimal="."
        prefix={prefix}
        suffix={suffix}
        separator=","
        useEasing={true}
      />
    </span>
  );
};

export default AnimatedFinancialValue;