import { useRef } from 'react';
import { ExternalLink, Menu } from 'lucide-react';

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GithubIcon, LinkedinIcon, SubstackIcon, XIcon } from '@/islands/brand-icons';
import { meta } from '@/copy/meta';
import { nav, type SocialKind } from '@/copy/nav';

const icons: Record<SocialKind, typeof GithubIcon> = {
	github: GithubIcon,
	x: XIcon,
	linkedin: LinkedinIcon,
	substack: SubstackIcon,
};

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

const repositoryClass =
	'bg-foreground text-background hover:bg-foreground/85 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5';

export function Nav() {
	const menu = useRef<HTMLDivElement>(null);
	const links = [nav.docs, nav.blog].filter((link) => link.href !== '');

	return (
		<header className="page-col flex items-center justify-between gap-4 py-6 sm:py-8">
			<a
				href="/"
				className="flex shrink-0 items-center gap-2.5"
				aria-label={`${meta.siteName}, ${nav.homeLabel}`}>
				<img src="/favicon.svg" alt="" width={22} height={22} className="size-5 sm:size-[22px]" />
				<span className="font-display text-title-md sm:text-title-lg font-bold">{meta.siteName}</span>
			</a>

			<div ref={menu} className="hidden sm:block">
				<NavigationMenu align="end" anchor={menu}>
					<NavigationMenuList>
						{links.map((link) => (
							<NavigationMenuItem key={link.href}>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									render={<a href={link.href} {...external} />}>
									{link.label}
								</NavigationMenuLink>
							</NavigationMenuItem>
						))}

						{nav.socials.length > 0 && (
							<NavigationMenuItem>
								<NavigationMenuTrigger>{nav.socialsLabel}</NavigationMenuTrigger>
								<NavigationMenuContent className="p-2">
									<ul className="grid w-64 gap-1">
										{nav.socials.map((social) => {
											const Icon = icons[social.kind];
											return (
												<li key={social.href}>
													<NavigationMenuLink
														className="hover:bg-muted flex items-start gap-3 rounded-xl p-3 transition-colors"
														render={<a href={social.href} {...external} />}>
														<Icon className="text-brand-ink mt-0.5 size-4 shrink-0" />
														<span className="flex flex-col gap-0.5">
															<span className="text-sm font-medium">{social.label}</span>
															<span className="text-muted-foreground text-xs leading-snug">
																{social.description}
															</span>
														</span>
													</NavigationMenuLink>
												</li>
											);
										})}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						)}

						<NavigationMenuItem>
							<NavigationMenuLink
								className={repositoryClass}
								render={<a href={nav.repository.href} {...external} />}>
								{nav.repository.label}
								<ExternalLink className="size-3.5" />
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<Dialog>
				<DialogTrigger
					render={
						<Button
							variant="outline"
							size="icon"
							aria-label={nav.menuLabel}
							className="surface rounded-full sm:hidden"
						/>
					}>
					<Menu className="size-5" />
				</DialogTrigger>

				<DialogContent className="surface gap-5 p-6">
					<DialogHeader>
						<DialogTitle className="font-display text-xl font-bold tracking-tight">
							{nav.menuTitle}
						</DialogTitle>
					</DialogHeader>

					<nav className="flex flex-col gap-1">
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								{...external}
								className="hover:bg-muted rounded-xl px-3 py-2.5 text-base font-medium transition-colors">
								{link.label}
							</a>
						))}

						<span className="text-muted-foreground mt-3 px-3 text-xs font-semibold tracking-wider uppercase">
							{nav.socialsLabel}
						</span>
						{nav.socials.map((social) => {
							const Icon = icons[social.kind];
							return (
								<a
									key={social.href}
									href={social.href}
									{...external}
									className="hover:bg-muted flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors">
									<Icon className="text-brand-ink size-4 shrink-0" />
									<span className="text-base font-medium">{social.label}</span>
								</a>
							);
						})}
					</nav>

					<a href={nav.repository.href} {...external} className={`${repositoryClass} justify-center`}>
						{nav.repository.label}
						<ExternalLink className="size-3.5" />
					</a>
				</DialogContent>
			</Dialog>
		</header>
	);
}
