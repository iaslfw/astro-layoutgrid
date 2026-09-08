import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { installCommands, type PackageManager } from '@/copy/install';

export function InstallCommand() {
	const [copied, setCopied] = useState<PackageManager | null>(null);

	const copy = useCallback((manager: PackageManager) => {
		void navigator.clipboard.writeText(installCommands[manager]);
		setCopied(manager);
		setTimeout(() => setCopied(null), 2000);
	}, []);

	return (
		<Tabs defaultValue="npm" className="mx-auto w-full max-w-xl">
			<TabsList className="no-scrollbar mx-auto max-w-full overflow-x-auto rounded-full">
				{(Object.keys(installCommands) as PackageManager[]).map((manager) => (
					<TabsTrigger key={manager} value={manager} className="shrink-0 rounded-full px-4">
						{manager}
					</TabsTrigger>
				))}
			</TabsList>

			{(Object.keys(installCommands) as PackageManager[]).map((manager) => (
				<TabsContent key={manager} value={manager}>
					<div className="border-border/60 bg-foreground/[0.05] flex items-center gap-3 rounded-2xl border py-3 pr-3 pl-5">
						<code className="flex-1 overflow-x-auto text-left font-mono text-sm whitespace-nowrap">
							{installCommands[manager]}
						</code>
						<Button
							variant="ghost"
							size="icon"
							aria-label={`Copy the ${manager} command`}
							onClick={() => copy(manager)}>
							{copied === manager ? <Check className="size-4" /> : <Copy className="size-4" />}
						</Button>
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
}
