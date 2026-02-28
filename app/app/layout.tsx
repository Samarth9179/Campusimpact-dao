import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-16 pl-64">
                <Sidebar />
                <div className="min-h-screen p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
