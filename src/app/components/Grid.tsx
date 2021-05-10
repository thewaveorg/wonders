import React from 'react';

interface IGridProps {
  gap?: string | number;
  columns?: string | number;
  rows?: string | number;
  className?: string;
};

export const Grid: React.FC<IGridProps> = ({ children, gap = 0, columns = "none", rows = "none", className}) => {
  return (
		<div className={className} style={
			{
        display: "grid",
        gridGap: gap,
        gridTemplateColumns: columns,
        gridTemplateRows: rows
			}
    }>
    	{children}
		</div>
  );
};
