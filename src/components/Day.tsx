import moment, { Moment } from "moment";
import React, { ReactNode, Ref, forwardRef } from "react";

export const Day = forwardRef(
	(
		{
			date,
			children,
		}: {
			date: Moment;
			children?: ReactNode;
		},
		ref: Ref<HTMLDivElement>
	) => {
		return (
			<div
				className="flex flex-row gap-2 border-b border-l-0 border-r-0 border-t-0 border-solid py-3"
				ref={ref}
			>
				{/* Date */}
				<div className="flex flex-0 basis-16 flex-col px-4">
					{/* Day of month */}
					<label
						className="font-bold text-xl"
						title={moment(date).format("YYYY-MM-DD")}
					>
						{moment(date).format("DD")}
					</label>
					{/* Day of week */}
					<label
						className="text-xs"
						title={moment(date).format("YYYY-MM-DD")}
					>
						{moment(date).format("ddd")}
					</label>
				</div>

				{/* Events or empty state */}
				<div className="flex flex-col gap-2 flex-1 mb-1">
					{children || (
						<span className="text-center text-xs">No events</span>
					)}
				</div>
			</div>
		);
	}
);
