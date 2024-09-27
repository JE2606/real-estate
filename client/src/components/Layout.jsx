import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
    const location = useLocation();
    const noHeaderFooterRoutes = ['/sign-in', '/sign-up'];
    const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {shouldShowHeaderFooter && <Header />}
            <main className="flex-grow">
                <Outlet />
            </main>
            {shouldShowHeaderFooter && <Footer />}
        </div>
    );
}

export default Layout;
