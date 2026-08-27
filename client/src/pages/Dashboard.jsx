import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/taskSlice';
import { logout } from '../store/authSlice';
import { toast } from 'sonner';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import { useDebounce } from '../hooks/useDebounce';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: tasks, status } = useSelector(state => state.tasks);
  
  // Search, Filter, Sort States
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('dateAsc');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [navigate, dispatch, status]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/login');
  }, [dispatch, navigate]);

  const handleCreateTask = useCallback(() => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }, []);

  // Stats calculation
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start">
            Dashboard
          </Button>
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 lg:px-10">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
            U
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6 lg:p-10 space-y-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{tasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completed}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 border-b border-border pb-4">
              <h3 className="text-2xl font-bold tracking-tight">Your Tasks</h3>
              <Button onClick={handleCreateTask}>
                New Task
              </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Input 
                type="text" 
                placeholder="Search tasks..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 md:max-w-sm"
              />
              <div className="flex flex-wrap items-center gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>{filterStatus === 'All' ? 'All Status' : filterStatus}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>{filterPriority === 'All' ? 'All Priorities' : filterPriority}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Priorities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>{sortBy === 'dateAsc' ? 'Due Date (Earliest)' : 'Due Date (Latest)'}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateAsc">Due Date (Earliest)</SelectItem>
                    <SelectItem value="dateDesc">Due Date (Latest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Task List Component */}
            <Card className="p-6">
              {status === 'loading' ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading tasks...</p>
                </div>
              ) : (
                <TaskList 
                  tasks={tasks}
                  filterStatus={filterStatus}
                  filterPriority={filterPriority}
                  search={debouncedSearch}
                  sortBy={sortBy}
                  onEdit={handleEditTask}
                />
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;
