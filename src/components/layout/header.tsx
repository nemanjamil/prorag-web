import { useLocation, Link } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { NAV_ITEMS } from '@/lib/constants';

export function Header() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const currentNav = NAV_ITEMS.find((item) =>
    location.pathname.startsWith(item.path),
  );

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">ProRAG</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {currentNav && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {segments.length > 1 ? (
                  <BreadcrumbLink asChild>
                    <Link to={currentNav.path}>{currentNav.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{currentNav.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}
          {segments.length > 1 && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
