import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/lib/database.types';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { db } = await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const project = searchParams.get('project');

        if (!project) {
            return NextResponse.json({ error: 'Project name is required.' }, { status: 400 });
        }
        
        const tasks: Partial<Task>[] = await request.json(); // Get JSON directly from body

        if (!Array.isArray(tasks)) {
            return NextResponse.json({ error: 'Invalid JSON format. Expected an array of tasks.' }, { status: 400 });
        }

        const MONTHS = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const validateTask = (task: any): task is Partial<Task> => {
            const monthIndex = MONTHS.indexOf(task.month);
            if (monthIndex === -1) return false;

            const daysInMonth = new Date(task.year, monthIndex + 1, 0).getDate();

            return (
                typeof task.task_title === 'string' &&
                typeof task.task_description === 'string' &&
                typeof task.start === 'number' &&
                typeof task.end === 'number' &&
                task.start <= task.end &&
                task.start >= 1 && task.start <= daysInMonth &&
                task.end >= 1 && task.end <= daysInMonth &&
                typeof task.month === 'string' &&
                typeof task.year === 'number' &&
                ['pending', 'in_progress', 'completed', 'overdue'].includes(task.status)
            );
        };

        const validTasks = tasks.filter(validateTask);

        if (validTasks.length === 0) {
            return NextResponse.json({ error: 'No valid tasks found in the provided JSON.' }, { status: 400 });
        }

        const lastTask = await db.collection('tasks').findOne(
            { project, userId: session.user.id },
            { sort: { order_index: -1 } }
        );
        const highestOrderIndex = lastTask?.order_index || 0;

        const tasksWithProjectAndOrder = validTasks.map((task, index) => {
            const monthIndex = MONTHS.indexOf(task.month!);
            const start = `${task.year}-${String(monthIndex + 1).padStart(2, '0')}-${String(task.start).padStart(2, '0')}`;
            const end = `${task.year}-${String(monthIndex + 1).padStart(2, '0')}-${String(task.end).padStart(2, '0')}`;

            return {
                ...task,
                start,
                end,
                _id: undefined, // Ensure MongoDB generates a new _id
                userId: session.user.id,
                project: project,
                order_index: highestOrderIndex + index + 1,
            }
        });

        await db.collection('tasks').insertMany(tasksWithProjectAndOrder);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error importing tasks:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
