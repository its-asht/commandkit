import type { PageTree } from 'fumadocs-core/server';
import { type ReactNode, type HTMLAttributes } from 'react';
import Link from 'next/link';
import { Languages, MoreHorizontal } from 'lucide-react';
import { notFound } from 'next/navigation';
import { cn } from '../lib/cn';
import { buttonVariants } from './ui/button';
import {
  CollapsibleSidebar,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarCollapseTrigger,
  SidebarViewport,
  SidebarPageTree,
} from './docs/sidebar';
import { replaceOrDefault, type SharedNavProps } from './shared';
import {
  type LinkItemType,
  type IconItemType,
  BaseLinkItem,
} from './links';
import { getSidebarTabs, type TabOptions } from '../lib/get-sidebar-tabs';
import { RootToggle } from './layout/root-toggle';
import { type BaseLayoutProps, getLinks } from './shared';
import {
  LanguageToggle,
  LanguageToggleText,
} from './layout/language-toggle';
import { LayoutBody, LinksMenu } from './docs.client';
import { TreeContextProvider } from 'fumadocs-ui/provider';
import { NavProvider, Title } from './layout/nav';
import { ThemeToggle } from './layout/theme-toggle';
import { Navbar, NavbarSidebarTrigger } from './docs/navbar';
import {
  LargeSearchToggle,
  SearchToggle,
} from './layout/search-toggle';
import { SearchOnly } from 'fumadocs-ui/provider';
import {
  getSidebarTabsFromOptions,
  SidebarLinkItem,
  type SidebarOptions,
} from './docs/shared';

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;

  sidebar?: Partial<SidebarOptions>;

  containerProps?: HTMLAttributes<HTMLDivElement>;
}

export function DocsLayout({
  nav: {
    enabled: navEnabled = true,
    component: navReplace,
    transparentMode,
    ...nav
  } = {},
  sidebar: {
    enabled: sidebarEnabled = true,
    collapsible = true,
    component: sidebarReplace,
    tabs: tabOptions,
    banner: sidebarBanner,
    footer: sidebarFooter,
    components: sidebarComponents,
    ...sidebar
  } = {},
  i18n = false,
  ...props
}: DocsLayoutProps): ReactNode {
  const links = getLinks(props.links ?? [], props.githubUrl);
  const Aside = collapsible ? CollapsibleSidebar : Sidebar;
  if (props.tree === undefined) notFound();

  const tabs = getSidebarTabsFromOptions(tabOptions, props.tree) ?? [];

  return (
    <TreeContextProvider tree={props.tree}>
      <NavProvider transparentMode={transparentMode}>
        {replaceOrDefault(
          { enabled: navEnabled, component: navReplace },
          <Navbar id="nd-subnav" className="h-14 md:hidden">
            <Title url={nav.url} title={nav.title} />
            <div className="flex flex-1 flex-row items-center gap-1">
              {nav.children}
            </div>
            <SearchOnly>
              <SearchToggle />
            </SearchOnly>
            <NavbarSidebarTrigger className="-me-2 md:hidden" />
          </Navbar>,
          nav,
        )}
        <LayoutBody
          id="nd-docs-layout"
          {...props.containerProps}
          className={cn(
            'flex flex-1 flex-row md:[--fd-sidebar-width:260px] xl:[--fd-toc-width:260px] [&_#nd-toc]:max-xl:hidden [&_#nd-tocnav]:xl:hidden',
            !navReplace && navEnabled
              ? '[--fd-nav-height:3.5rem] md:[--fd-nav-height:0px]'
              : null,
            props.containerProps?.className,
          )}
        >
          {collapsible ? (
            <SidebarCollapseTrigger className="fixed bottom-3 start-2 z-40 transition-opacity data-[collapsed=false]:pointer-events-none data-[collapsed=false]:opacity-0 max-md:hidden" />
          ) : null}
          {replaceOrDefault(
            { enabled: sidebarEnabled, component: sidebarReplace },
            <Aside
              {...sidebar}
              className="md:flex-1 md:data-[collapsed=true]:flex-initial"
            >
              <SidebarHeader>
                <SidebarHeaderItems {...nav} links={links} />
                {sidebarBanner}
                {tabs.length > 0 ? (
                  <RootToggle options={tabs} className="-mx-2" />
                ) : null}
                <SearchOnly>
                  <LargeSearchToggle className="rounded-lg max-md:hidden" />
                </SearchOnly>
              </SidebarHeader>
              <SidebarViewport>
                <div className="px-2 pt-4 empty:hidden md:hidden">
                  {links
                    .filter((v) => v.type !== 'icon')
                    .map((item, i) => (
                      <SidebarLinkItem key={i} item={item} />
                    ))}
                </div>
                <div className="px-2 py-4 md:px-3">
                  <SidebarPageTree components={sidebarComponents} />
                </div>
              </SidebarViewport>
              <SidebarFooter>
                <SidebarFooterItems
                  sidebarCollapsible={collapsible}
                  i18n={i18n}
                  disableThemeSwitch={props.disableThemeSwitch ?? false}
                  iconItems={links.filter((v) => v.type === 'icon')}
                />
                {sidebarFooter}
              </SidebarFooter>
            </Aside>,
            {
              ...sidebar,
              tabs,
            },
          )}
          {props.children}
        </LayoutBody>
      </NavProvider>
    </TreeContextProvider>
  );
}

function SidebarHeaderItems({
  links,
  ...props
}: SharedNavProps & { links: LinkItemType[] }) {
  const isEmpty = !props.title && !props.children && links.length === 0;
  if (isEmpty) return null;

  return (
    <div className="flex flex-row items-center max-md:hidden">
      {props.title ? (
        <Link
          href={props.url ?? '/'}
          className="inline-flex items-center gap-2.5 py-1 font-medium"
        >
          {props.title}
        </Link>
      ) : null}
      {props.children}
      {links.length > 0 ? (
        <LinksMenu
          items={links}
          className={cn(
            buttonVariants({
              size: 'icon',
              color: 'ghost',
            }),
            'ms-auto',
          )}
        >
          <MoreHorizontal />
        </LinksMenu>
      ) : null}
    </div>
  );
}

function SidebarFooterItems({
  iconItems,
  i18n,
  sidebarCollapsible,
  disableThemeSwitch,
}: {
  i18n: boolean;
  iconItems: IconItemType[];
  disableThemeSwitch: boolean;
  sidebarCollapsible: boolean;
}) {
  // empty footer items
  if (
    iconItems.length === 0 &&
    !i18n &&
    disableThemeSwitch &&
    !sidebarCollapsible
  )
    return null;

  return (
    <div className="flex flex-row items-center">
      {iconItems.map((item, i) => (
        <BaseLinkItem
          key={i}
          item={item}
          className={cn(
            buttonVariants({ size: 'icon', color: 'ghost' }),
            'text-fd-muted-foreground md:hidden',
          )}
          aria-label={item.label}
        >
          {item.icon}
        </BaseLinkItem>
      ))}
      <div role="separator" className="flex-1" />
      {i18n ? (
        <LanguageToggle className="me-1.5">
          <Languages className="size-5" />
          <LanguageToggleText className="md:hidden" />
        </LanguageToggle>
      ) : null}
      {!disableThemeSwitch ? (
        <ThemeToggle className="p-0 md:order-first" />
      ) : null}
      {sidebarCollapsible ? (
        <SidebarCollapseTrigger className="-me-1.5 max-md:hidden" />
      ) : null}
    </div>
  );
}

export { getSidebarTabs, type TabOptions, type LinkItemType };
