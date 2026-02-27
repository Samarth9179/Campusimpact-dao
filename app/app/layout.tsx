import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background pt-16">
            <Sidebar />
            <div className="pl-64">
                <div className="min-h-screen p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
