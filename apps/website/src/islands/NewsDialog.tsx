import { ArrowRight } from 'lucide-react';

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
import { Button } from '@/components/ui/button';
import { meta } from '@/copy/meta';
import { news } from '@/copy/news';

function withCode(text: string) {
	return text.split(/`([^`]+)`/).map((part, index) =>
		index % 2 === 1 ? (
			<code key={index} className="font-mono text-xs">
				{part}
			</code>
		) : (
			part
		),
	);
}

export function NewsDialog() {
	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						type="button"
						className="surface hover:border-brand/40 group mx-auto flex items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 text-sm transition-colors"
					/>
				}>
				<span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
					{news.badge}
				</span>
				<span className="text-foreground/80">{news.teaser}</span>
				<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
			</DialogTrigger>

			<DialogContent className="surface gap-5 p-6 sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle className="font-display text-2xl leading-tight font-extrabold tracking-tight">
						{news.title}
					</DialogTitle>
					<DialogDescription>{news.subtitle}</DialogDescription>
				</DialogHeader>

				<div className="max-h-[55vh] overflow-y-auto">
					<img
						src={news.image.src}
						alt={news.image.alt}
						width={news.image.width}
						height={news.image.height}
						className="w-full rounded-2xl"
					/>

					<div className="text-muted-foreground mt-5 space-y-4 text-sm leading-relaxed">
						{news.paragraphs.map((paragraph) => (
							<p key={paragraph.slice(0, 24)}>{withCode(paragraph)}</p>
						))}
					</div>
				</div>

				<DialogFooter className="-mx-6 -mb-6 rounded-b-xl p-6">
					<DialogClose render={<Button variant="outline" className="rounded-full" />}>
						{news.close}
					</DialogClose>
					<Button
						className="rounded-full"
						render={<a href={meta.repository} target="_blank" rel="noopener noreferrer" />}>
						{news.readMore}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
