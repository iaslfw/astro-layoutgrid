import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { roadmap, roadmapColumns, type ColumnState } from '@/copy/roadmap';

const dot: Record<ColumnState, string> = {
	planned: 'border-brand/50 border-2 bg-transparent',
	active: 'bg-brand/45',
	shipped: 'bg-brand',
};

export function Roadmap() {
	return (
		<Tabs defaultValue={roadmap[0].state} className="w-full">
			<TabsList className="no-scrollbar max-w-full overflow-x-auto rounded-full">
				{roadmap.map((column) => (
					<TabsTrigger key={column.state} value={column.state} className="shrink-0 rounded-full px-4">
						<span className={`size-2 shrink-0 rounded-full ${dot[column.state]}`} aria-hidden="true" />
						{column.label}
						<span className="text-muted-foreground font-mono text-xs tabular-nums">
							{column.items.length}
						</span>
					</TabsTrigger>
				))}
			</TabsList>

			{roadmap.map((column) => (
				<TabsContent key={column.state} value={column.state}>
					<div className="surface overflow-x-auto p-1 sm:p-2">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-44 min-w-36">{roadmapColumns.item}</TableHead>
									<TableHead className="w-40 min-w-28">{roadmapColumns.note}</TableHead>
									<TableHead className="min-w-56">{roadmapColumns.detail}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{column.items.map((item) => (
									<TableRow key={item.title}>
										<TableCell className="align-top">
											<span className="font-display text-title-md block font-bold">{item.title}</span>
										</TableCell>
										<TableCell className="align-top">
											{item.meta && (
												<span className="text-brand-ink bg-brand/10 inline-block rounded-full px-2 py-0.5 font-mono text-[11px] whitespace-nowrap">
													{item.meta}
												</span>
											)}
										</TableCell>
										<TableCell className="text-muted-foreground text-body-md align-top whitespace-normal">
											{item.body}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
}
