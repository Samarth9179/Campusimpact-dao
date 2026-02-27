'use client';

import { motion } from 'framer-motion';
import { Zap, FileText, Wallet, TrendingUp, Filter, Clock } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ActivityPage() {
    const activities = [
        { type: 'vote', action: 'Voted YES on AgroSync: AI Crop Disease Detection', time: '2 hours ago', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10 border-success/20' },
        { type: 'milestone', action: 'NexaLearn Phase 1 milestone passed quorum', time: '5 hours ago', icon: Zap, color: 'text-primary-light', bg: 'bg-primary/10 border-primary/20' },
        { type: 'treasury', action: '15.5L USDC disbursed to GridFlow smart contract', time: '1 day ago', icon: Wallet, color: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/20' },
        { type: 'proposal', action: 'New Proposal: ClearVote Election System', time: '2 days ago', icon: FileText, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
        { type: 'vote', action: 'Voted NO on LegalMitra: AI Legal Aid', time: '3 days ago', icon: TrendingUp, color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
        { type: 'proposal', action: 'Proposal Rejected: LegalMitra (Did not meet quorum)', time: '4 days ago', icon: FileText, color: 'text-text-muted', bg: 'bg-white/5 border-white/10' },
        { type: 'treasury', action: 'Treasury incoming yield: +12.4% from Aave staking', time: '1 week ago', icon: Wallet, color: 'text-success', bg: 'bg-success/10 border-success/20' },
        { type: 'milestone', action: 'MediChain Phase 2 milestone completed', time: '1 week ago', icon: Zap, color: 'text-primary-light', bg: 'bg-primary/10 border-primary/20' },
    ];

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-caption text-text-muted uppercase tracking-widest mb-2 font-semibold">DAO Operations</p>
                    <h1 className="text-display-sm font-bold text-text-primary">
                        Recent <span className="gradient-text">Activity</span>
                    </h1>
                    <p className="text-body-md text-text-secondary mt-2">
                        Chronological feed of platform events, votes, and treasury movements.
                    </p>
                </div>
                <div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-body-sm hover:bg-white/10 transition-colors">
                        <Filter className="w-4 h-4" /> Filter Activity
                    </button>
                </div>
            </div>

            <GlassCard className="p-2 sm:p-6 relative">
                <div className="absolute left-8 sm:left-12 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                    {activities.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div key={i} variants={fadeInUp} className="flex gap-4 relative z-10">
                                <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 relative bg-surface mt-1', item.bg)}>
                                    <Icon className={cn('w-5 h-5', item.color)} />
                                </div>
                                <div className="flex-1 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <p className="text-body-sm text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
                                            {item.action}
                                        </p>
                                        <span className="text-caption text-text-muted flex items-center gap-1 flex-shrink-0">
                                            <Clock className="w-3 h-3" /> {item.time}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <div className="pt-8 text-center">
                    <button className="text-body-sm font-medium text-primary-light hover:text-primary transition-colors">
                        Load More Activity →
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
