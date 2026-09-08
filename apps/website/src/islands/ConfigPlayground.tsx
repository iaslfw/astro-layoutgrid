import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, Grid2x2, Grid2x2X } from 'lucide-react';

import { DEFAULTS, resolve, type LayoutgridConfig } from 'astro-layoutgrid';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { format, fullConfig, parse, toOptions } from '@/lib/config-snippet';
import { isOverlayVisible, setOverlayVisible, updateOverlay } from '@/lib/page-overlay';
import { playground } from '@/copy/playground';

export function ConfigPlayground() {
	const [source, setSource] = useState(() => format(toOptions(DEFAULTS, true)));
	const [valid, setValid] = useState(true);
	const [visible, setVisible] = useState(false);
	const [copied, setCopied] = useState(false);
	const [lastValid, setLastValid] = useState(source);

	useEffect(() => setVisible(isOverlayVisible()), []);

	const apply = useCallback((text: string) => {
		setSource(text);

		const parsed = parse(text);
		if (parsed === null) {
			setValid(false);
			return;
		}

		setValid(true);
		setLastValid(text);
		updateOverlay(resolve(parsed as LayoutgridConfig));
	}, []);

	const toggle = useCallback(() => {
		const next = !isOverlayVisible();
		setOverlayVisible(next);
		setVisible(next);
	}, []);

	const copy = useCallback(() => {
		void navigator.clipboard.writeText(fullConfig(lastValid));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [lastValid]);

	return (
		<div className="flex flex-wrap items-center justify-center gap-3">
			<Dialog>
				<DialogTrigger render={<Button size="lg" className="rounded-full px-7 py-5 text-base" />}>
					Edit the configuration
				</DialogTrigger>

				<DialogContent className="surface gap-5 p-6 sm:max-w-xl">
					<DialogHeader>
						<DialogTitle className="font-display text-2xl font-extrabold tracking-tight">
							{playground.title}
						</DialogTitle>
						<DialogDescription>{playground.description}</DialogDescription>
					</DialogHeader>

					<div>
						<div className="border-border/60 bg-foreground/[0.03] overflow-hidden rounded-lg border font-mono text-[13px] leading-relaxed">
							<div className="text-muted-foreground px-5 pt-4 select-none">{playground.prefix}</div>
							<textarea
								aria-label={playground.textareaLabel}
								spellCheck={false}
								value={source}
								onChange={(event) => apply(event.target.value)}
								rows={Math.max(4, source.split('\n').length)}
								className={`w-full resize-none bg-transparent px-5 py-1 font-mono text-[13px] leading-relaxed outline-none ${
									valid ? 'text-foreground' : 'text-destructive'
								}`}
							/>
							<div className="text-muted-foreground px-5 pb-4 select-none">{playground.suffix}</div>
						</div>

						<p
							className={`mt-3 text-xs ${valid ? 'text-muted-foreground' : 'text-destructive'}`}
							role="status">
							{valid ? playground.applied : playground.invalid}
						</p>
					</div>

					<DialogFooter className="-mx-6 -mb-6 rounded-b-xl p-6">
						<Button variant="outline" className="rounded-full" onClick={copy}>
							{copied ? <Check className="size-4" /> : <Copy className="size-4" />}
							{copied ? playground.copied : playground.copy}
						</Button>
						<DialogClose render={<Button className="rounded-full px-6" />}>
							{playground.confirm}
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Button
				variant="outline"
				size="lg"
				onClick={toggle}
				className="surface rounded-full px-7 py-5 text-base">
				{visible ? <Grid2x2X className="size-5" /> : <Grid2x2 className="size-5" />}
				{playground.toggle}
			</Button>
		</div>
	);
}
