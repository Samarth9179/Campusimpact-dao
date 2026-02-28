'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Wallet, TrendingUp, TrendingDown, Filter, Clock } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface ActivityItem {
    type: 'vote' | 'proposal' | 'treasury';
    action: string;
    time: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    timestamp: Date;
}

function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
}

export default function ActivityPage() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'vote' | 'proposal'>('all');

    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            const items: ActivityItem[] = [];

            // Step 1: Fetch all proposals to build a lookup map (id -> title)
            const { data: proposals } = await supabase
                .from('proposals')
                .select('id, title, status, created_at')
                .order('created_at', { ascending: false })
                .limit(50);

            const proposalMap: Record<string, string> = {};
            if (proposals) {
                for (const p of proposals) {
                    proposalMap[p.id] = p.title;
                }
            }

            // Step 2: Fetch all votes — manually look up proposal title from the map
            const { data: votes } = await supabase
                .from('votes')
                .select('id, proposal_id, voter_address, choice, created_at')
                .order('created_at', { ascending: false })
                .limit(30);

            if (votes) {
                for (const vote of votes) {
                    const proposalTitle = proposalMap[vote.proposal_id] || `Proposal #${String(vote.proposal_id).substring(0, 8)}`;
                    const isYes = vote.choice === 'yes';
                    items.push({
                        type: 'vote',
                        action: `Voted ${isYes ? 'YES ✓' : 'NO ✗'} on "${proposalTitle}"`,
                        time: timeAgo(new Date(vote.created_at)),
                        icon: isYes ? TrendingUp : TrendingDown,
                        color: isYes ? 'text-success' : 'text-danger',
                        bg: isYes ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20',
                        timestamp: new Date(vote.created_at),
                    });
                }
            }

            if (proposals) {
                for (const p of proposals) {
                    items.push({
                        type: 'proposal',
                        action: `New Proposal submitted: ${p.title}`,
                        time: timeAgo(new Date(p.created_at)),
                        icon: FileText,
                        color: 'text-warning',
                        bg: 'bg-warning/10 border-warning/20',
                        timestamp: new Date(p.created_at),
                    });

                    if (p.status === 'passed') {
                        items.push({
                            type: 'proposal',
                            action: `Proposal Passed: ${p.title}`,
                            time: timeAgo(new Date(p.created_at)),
                            icon: Zap,
                            color: 'text-success',
                            bg: 'bg-success/10 border-success/20',
                            timestamp: new Date(p.created_at),
                        });
                    }
                    if (p.status === 'rejected') {
                        items.push({
                            type: 'proposal',
                            action: `Proposal Rejected: ${p.title} (Did not meet quorum)`,
                            time: timeAgo(new Date(p.created_at)),
                            icon: FileText,
                            color: 'text-text-muted',
                            bg: 'bg-white/5 border-white/10',
                            timestamp: new Date(p.created_at),
                        });
                    }
                }
            }

            // If no real data yet, show a helpful empty state placeholder
            if (items.length === 0) {
                items.push({
                    type: 'treasury',
                    action: 'CampusImpact DAO launched — submit your first proposal!',
                    time: 'just now',
                    icon: Wallet,
                    color: 'text-primary-light',
                    bg: 'bg-primary/10 border-primary/20',
                    timestamp: new Date(),
                });
            }

            // Sort all items by newest first
            items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            setActivities(items);
            setLoading(false);
        };

        fetchActivity();
    }, []);

    const filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter);

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-caption text-text-muted uppercase tracking-widest mb-2 font-semibold">DAO Operations</p>
                    <h1 className="text-display-sm font-bold text-text-primary">
                        Recent <span className="gradient-text">Activity</span>
                    </h1>
                    <p className="text-body-md text-text-secondary mt-2">
                        Live feed of platform events, votes, and proposals — pulled directly from the database.
                    </p>
                </div>
                {/* Filter Buttons */}
                <div className="flex gap-2">
                    {(['all', 'vote', 'proposal'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 border rounded-xl text-body-sm transition-colors capitalize',
                                filter === f
                                    ? 'bg-primary/20 border-primary/40 text-primary-light'
                                    : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                            )}
                        >
                            {f === 'all' && <Filter className="w-4 h-4" />}
                            {f === 'vote' && <TrendingUp className="w-4 h-4" />}
                            {f === 'proposal' && <FileText className="w-4 h-4" />}
                            {f === 'all' ? 'All Activity' : f === 'vote' ? 'Votes' : 'Proposals'}
                        </button>
                    ))}
                </div>
            </div>

            <GlassCard className="p-2 sm:p-6 relative">
                <div className="absolute left-8 sm:left-12 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-text-muted">
                        <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-body-md">No activity yet. Submit a proposal or cast a vote!</p>
                    </div>
                ) : (
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                        {filtered.map((item, i) => {
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
                )}
            </GlassCard>
        </div>
    );
}
