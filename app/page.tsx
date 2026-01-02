'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Rocket, Calendar, Trash } from 'lucide-react';
import { Task } from '@/lib/database.types';
import { MonthColumn } from '@/components/month-column';
import { TaskCard } from '@/components/task-card';
import { TrashBin } from '@/components/trash-bin';
import { TaskEditModal } from '@/components/task-edit-modal';
import { TaskDetailModal } from '@/components/task-detail-modal';
import { AddTaskButton } from '@/components/add-task-button';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { JsonUpload } from '@/components/json-upload';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function HomePage() { // Renamed to HomePage
  const { data: session, status } = useSession();
  const router = useRouter(); // Import useRouter
  
  // Redirect authenticated users to /projects
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/projects');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Rocket className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <p className="text-cyan-400 font-mono text-sm">LOADING AUTH...</p>
        </div>
      </div>
    );
  }

  // Only show login UI if not authenticated
  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Rocket className="w-16 h-16 text-cyan-400" />
          </motion.div>
          <h1 className="text-4xl font-bold font-mono text-cyan-400 tracking-wider">
            CYCLECTL
          </h1>
          <p className="text-lg font-mono text-cyan-500/60">
            The system that exists only to ship.
          </p>
          <div className="flex gap-4 mt-8">
            <Button onClick={() => signIn('github')}>Sign in with GitHub</Button>
            <Button onClick={() => signIn('google')}>Sign in with Google</Button>
          </div>
        </div>
      </div>
    )
  }

  return null; // Should redirect if authenticated
}