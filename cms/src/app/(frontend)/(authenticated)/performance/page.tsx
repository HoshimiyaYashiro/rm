'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Clock, CheckCircle, ChevronRight, Check, ChartColumnIcon, ChartLineIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from '../../components/ui/sheet';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '../../store/mock-auth-store';
import { useAppStore } from '../../store/app-store';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Progress } from '../../components/ui/progress';

export default function PerformancePage() {
  const { currentUser } = useAuthStore();
  const { records, createRecord, updateRecord, teams } = useAppStore();
  const t = useTranslations();
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const nextMonthObj = new Date();
  nextMonthObj.setMonth(nextMonthObj.getMonth() + 1);
  const nextMonth = nextMonthObj.toISOString().slice(0, 7);
  
  const myRecords = records.filter(r => r.userId === currentUser?.id).sort((a, b) => b.month.localeCompare(a.month));
  const team = teams.find(t => t.id === currentUser?.teamId);

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  
  // Drawer state
  const [registeredDays, setRegisteredDays] = useState('22');
  const [goals, setGoals] = useState<any[]>([]);
  const [actualDays, setActualDays] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const currentRecord = React.useMemo(() => {
    return records.find(r => r.id === selectedRecordId) || null;
  }, [records, selectedRecordId]);

  useEffect(() => {
    if (!selectedRecordId) return;

    if (selectedRecordId === 'new') {
      setRegisteredDays('22');
      setGoals([{ id: `g_${Date.now()}`, description: '', isCompleted: false, resultDescription: '' }]);
      setActualDays('');
      setSelectedMonth(myRecords.some(r => r.month === currentMonth) ? nextMonth : currentMonth);
    } else {
      const record = records.find(r => r.id === selectedRecordId);
      if (record) {
        setRegisteredDays(record.registeredWorkingDays.toString());
        setGoals(record.goals || []);
        setActualDays(record.actualWorkingDays ? record.actualWorkingDays.toString() : '');
        setSelectedMonth(record.month);
      }
    }
    setIsSheetOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecordId]);

  if (!currentUser) return null;

  const currentStatus = currentRecord?.status || 'draft_registration';
  const isRegistrationEditable = currentStatus === 'draft_registration';
  const isSummaryEditable = currentStatus === 'approved_registration' || currentStatus === 'draft_summary';

  const formatStatus = (status: string) => {
    return t(`performance.status.${status}`);
  };

  const getBadgeVariant = (status: string) => {
    if (status.includes('draft')) return 'secondary';
    if (status.includes('pending')) return 'outline'; // Using outline for pending, or we can use custom classes
    if (status.includes('approved_registration')) return 'default';
    if (status === 'approved_summary') return 'default'; // In a real app we'd add custom variants
    return 'outline';
  };

  const handleSaveRegistrationDraft = () => {
    const recordData = {
      userId: currentUser.id,
      month: selectedMonth,
      registeredWorkingDays: Number(registeredDays),
      goals: goals.filter(g => g.description.trim() !== ''),
      actualWorkingDays: 0,
      managerScore: 0,
      customerTaskScore: 0,
      status: 'draft_registration' as const,
      currentReviewLevel: 0
    };

    if (selectedRecordId === 'new') {
      const newId = `rec_${Date.now()}`;
      createRecord({ ...recordData, id: newId });
      setSelectedRecordId(newId);
    } else if (currentRecord) {
      updateRecord(currentRecord.id, recordData);
    }
  };

  const handleSubmitRegistration = () => {
    const recordData = {
      userId: currentUser.id,
      month: selectedMonth,
      registeredWorkingDays: Number(registeredDays),
      goals: goals.filter(g => g.description.trim() !== ''),
      actualWorkingDays: 0,
      managerScore: 0,
      customerTaskScore: 0,
      status: 'pending_registration' as const,
      currentReviewLevel: 1
    };

    if (selectedRecordId === 'new') {
      const newId = `rec_${Date.now()}`;
      createRecord({ ...recordData, id: newId });
      setSelectedRecordId(newId);
    } else if (currentRecord) {
      updateRecord(currentRecord.id, recordData);
    }
  };

  const handleSaveSummaryDraft = () => {
    if (!currentRecord || selectedRecordId === 'new') return;
    updateRecord(currentRecord.id, {
      actualWorkingDays: Number(actualDays),
      goals,
      status: 'draft_summary'
    });
  };

  const handleSubmitSummary = () => {
    if (!currentRecord || selectedRecordId === 'new') return;
    updateRecord(currentRecord.id, {
      actualWorkingDays: Number(actualDays),
      goals,
      status: 'pending_summary',
      currentReviewLevel: 1
    });
  };

  const handleCancelRegistrationRequest = () => {
    if (!currentRecord || selectedRecordId === 'new') return;
    updateRecord(currentRecord.id, { status: 'draft_registration' });
  };

  const handleCancelSummaryRequest = () => {
    if (!currentRecord || selectedRecordId === 'new') return;
    updateRecord(currentRecord.id, { status: 'draft_summary' });
  };

  const getTimelineStep = () => {
    switch (currentStatus) {
      case 'draft_registration': return 0;
      case 'pending_registration': return 1;
      case 'approved_registration': return 2;
      case 'draft_summary': return 2;
      case 'pending_summary': return 3;
      case 'approved_summary': return 4;
      default: return 0;
    }
  };

  const currentStep = getTimelineStep();

  const steps = [
    { title: t('performance.steps.draftReg') },
    { title: t('performance.steps.managerApproval') },
    { title: t('performance.steps.monthSummary') },
    { title: t('performance.steps.finalEval') },
  ];

  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
  const [visibleSeries, setVisibleSeries] = useState({
    finalScore: true,
    managerScore: false,
    customerScore: false,
    attendanceScore: false,
  });

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Chart data
  const chartData = [...myRecords].reverse()
    .filter(record => record.status === 'approved_summary')
    .map(record => ({
      name: record.month,
      finalScore: record.finalScore || 0,
      managerScore: record.managerScore || 0,
      customerScore: record.customerTaskScore || 0,
      attendanceScore: record.registeredWorkingDays ? Math.round((record.actualWorkingDays || 0) / record.registeredWorkingDays * 100) : 0
    }));

  const targetMonth = myRecords.some(r => r.month === currentMonth) ? nextMonth : currentMonth;
  const isCreateDisabled = myRecords.some(r => r.month === currentMonth) && myRecords.some(r => r.month === nextMonth);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('performance.title')}</h1>
          <p className="text-muted-foreground">{t('performance.historySubtitle')}</p>
        </div>
        <Button
          onClick={() => {
            setSelectedMonth(targetMonth);
            setSelectedRecordId('new');
          }}
          disabled={isCreateDisabled}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('performance.newRecord')} ({targetMonth})
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
            <div>
              <CardTitle>{t('performance.chartTitle')}</CardTitle>
              <CardDescription>{t('performance.chartDesc')}</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-4 mr-0 sm:mr-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={visibleSeries.finalScore} onCheckedChange={() => toggleSeries('finalScore')} />
                  {t('performance.finalScore')}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={visibleSeries.attendanceScore} onCheckedChange={() => toggleSeries('attendanceScore')} />
                  {t('performance.attendance')}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={visibleSeries.managerScore} onCheckedChange={() => toggleSeries('managerScore')} />
                  {t('performance.managerScore')}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={visibleSeries.customerScore} onCheckedChange={() => toggleSeries('customerScore')} />
                  {t('performance.customerTasks')}
                </label>
              </div>
              <div className="flex bg-muted p-1 rounded-md">
                <Button variant={chartType === 'bar' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('bar')} className="h-7 text-xs"><ChartColumnIcon/></Button>
                <Button variant={chartType === 'line' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('line')} className="h-7 text-xs"><ChartLineIcon/></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    {visibleSeries.finalScore && <Line type="monotone" name={t('performance.finalScore')} dataKey="finalScore" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} />}
                    {visibleSeries.attendanceScore && <Line type="monotone" name={t('performance.attendance')} dataKey="attendanceScore" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />}
                    {visibleSeries.managerScore && <Line type="monotone" name={t('performance.managerScore')} dataKey="managerScore" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />}
                    {visibleSeries.customerScore && <Line type="monotone" name={t('performance.customerTasks')} dataKey="customerScore" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />}
                    <Legend />
                  </LineChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    {visibleSeries.finalScore && <Bar name={t('performance.finalScore')} dataKey="finalScore" fill="#2563eb" radius={[4, 4, 0, 0]} />}
                    {visibleSeries.attendanceScore && <Bar name={t('performance.attendance')} dataKey="attendanceScore" fill="#10b981" radius={[4, 4, 0, 0]} />}
                    {visibleSeries.managerScore && <Bar name={t('performance.managerScore')} dataKey="managerScore" fill="#8b5cf6" radius={[4, 4, 0, 0]} />}
                    {visibleSeries.customerScore && <Bar name={t('performance.customerTasks')} dataKey="customerScore" fill="#f59e0b" radius={[4, 4, 0, 0]} />}
                    <Legend />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('performance.list')}</CardTitle>
            <CardDescription>{t('performance.historySubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('approvals.table.month')}</TableHead>
                    <TableHead>{t('approvals.table.requestType')}</TableHead>
                    <TableHead>{t('approvals.registered')}</TableHead>
                    <TableHead>{t('approvals.actual')}</TableHead>
                    <TableHead>{t('performance.attendance')}</TableHead>
                    <TableHead>{t('performance.managerScore')}</TableHead>
                    <TableHead>{t('performance.customerTasks')}</TableHead>
                    <TableHead className="text-right">{t('performance.finalScore')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        {t('performance.noRecords')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRecords.map((record) => (
                      <TableRow 
                        key={record.id} 
                        className="cursor-pointer hover:bg-muted/50" 
                        onClick={() => setSelectedRecordId(record.id)}
                      >
                        <TableCell className="font-medium">{record.month}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(record.status)} className={
                            record.status.includes('pending') ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''
                          }>
                            {formatStatus(record.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.registeredWorkingDays}</TableCell>
                        <TableCell>{record.status.includes('registration') ? '-' : record.actualWorkingDays}</TableCell>
                        <TableCell>{record.status.includes('registration') ? '-' : Math.round((record.actualWorkingDays || 0) / record.registeredWorkingDays * 100)}</TableCell>
                        <TableCell>{record.status === 'approved_summary' ? record.managerScore : '-'}</TableCell>
                        <TableCell>{record.status === 'approved_summary' ? record.customerTaskScore : '-'}</TableCell>
                        <TableCell className="text-right font-bold text-blue-600">
                          {record.finalScore !== undefined ? record.finalScore.toFixed(1) : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) setTimeout(() => setSelectedRecordId(null), 300);
      }}>
        <SheetContent className="w-full sm:min-w-[32rem] sm:max-w-4xl data-[side=right]:sm:max-w-4xl overflow-y-auto p-6 sm:p-8">
          <SheetHeader className="mb-6">
            <SheetTitle>
              {selectedRecordId === 'new' 
                ? `${t('performance.newRecordForMonth')} (${selectedMonth})` 
                : `${t('performance.recordForMonth')} ${selectedMonth}`}
            </SheetTitle>
            <SheetDescription>
              {t('performance.sheetDesc')}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8 pb-10">
            {/* Timeline component mapping Steps */}
            <div className="bg-muted/40 p-6 rounded-xl border overflow-hidden">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full z-0"></div>
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>
                
                {steps.map((step, index) => (
                  <div key={index} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                      index < currentStep ? 'bg-primary border-primary text-primary-foreground' : 
                      index === currentStep ? 'bg-background border-primary text-primary' : 
                      'bg-background border-muted-foreground/30 text-muted-foreground'
                    }`}>
                      {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="text-center absolute top-10 w-24 left-1/2 -translate-x-1/2">
                      <p className={`text-[11px] font-medium leading-tight ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-8"></div>
            </div>

            <div className="space-y-8">
              {/* Section 1: Registration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">{t('performance.startOfMonthSection')}</h3>
                
                <div className="space-y-2">
                  <Label>{t('performance.registeredDays')}</Label>
                  <Input
                    type="number"
                    className="max-w-[200px]"
                    value={registeredDays}
                    onChange={(e) => setRegisteredDays(e.target.value)}
                    disabled={!isRegistrationEditable}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base">{t('performance.goalsLabel')}</Label>
                    {isRegistrationEditable && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setGoals([...goals, { id: `g_${Date.now()}`, description: '', isCompleted: false, resultDescription: '' }])}
                      >
                        <Plus className="w-4 h-4 mr-1" /> {t('performance.addGoal')}
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {goals.map((goal, index) => (
                      <Card key={goal.id} className="relative overflow-visible">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>{t('performance.goalDescription')}</Label>
                              <Input
                                placeholder={t('performance.goalPlaceholder')}
                                value={goal.description}
                                onChange={(e) => {
                                  const newGoals = [...goals];
                                  newGoals[index].description = e.target.value;
                                  setGoals(newGoals);
                                }}
                                disabled={!isRegistrationEditable}
                              />
                            </div>
                            
                            {currentStep >= 2 && (
                              <div className="pt-4 border-t space-y-3">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`goal-completed-${goal.id}`}
                                    checked={goal.isCompleted}
                                    onCheckedChange={(checked) => {
                                      const newGoals = [...goals];
                                      newGoals[index].isCompleted = checked === true;
                                      setGoals(newGoals);
                                    }}
                                    disabled={!isSummaryEditable}
                                  />
                                  <label
                                    htmlFor={`goal-completed-${goal.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {t('performance.markCompleted')}
                                  </label>
                                </div>
                                <Textarea
                                  placeholder={t('performance.resultPlaceholder')}
                                  value={goal.resultDescription}
                                  onChange={(e) => {
                                    const newGoals = [...goals];
                                    newGoals[index].resultDescription = e.target.value;
                                    setGoals(newGoals);
                                  }}
                                  disabled={!isSummaryEditable}
                                  className="min-h-[80px]"
                                />
                              </div>
                            )}
                          </div>

                          {isRegistrationEditable && goals.length > 1 && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                              onClick={() => setGoals(goals.filter((_, i) => i !== index))}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {isRegistrationEditable && (
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={handleSaveRegistrationDraft}>
                      {t('performance.saveDraft')}
                    </Button>
                    <Button onClick={handleSubmitRegistration}>
                      {t('performance.submitRegistration')}
                    </Button>
                  </div>
                )}
                
                {currentStatus === 'pending_registration' && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t mt-4">
                    <div className="flex-1 bg-amber-50 text-amber-800 px-4 py-2.5 rounded-lg border border-amber-200 text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t('performance.waitingManagerApproval')}
                    </div>
                    <Button variant="outline" onClick={handleCancelRegistrationRequest}>
                      {t('performance.cancelRequest')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Section 2: End of Month Summary */}
              {currentStep >= 2 && (
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium border-b pb-2">{t('performance.endOfMonthSection')}</h3>
                  
                  <div className="space-y-2">
                    <Label>{t('performance.actualDays')}</Label>
                    <Input
                      type="number"
                      className="max-w-[200px]"
                      value={actualDays}
                      onChange={(e) => setActualDays(e.target.value)}
                      disabled={!isSummaryEditable}
                    />
                  </div>

                  {isSummaryEditable && (
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" onClick={handleSaveSummaryDraft}>
                        {t('performance.saveDraft')}
                      </Button>
                      <Button onClick={handleSubmitSummary}>
                        {t('performance.submitSummary')}
                      </Button>
                    </div>
                  )}

                  {currentStatus === 'pending_summary' && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t mt-4">
                      <div className="flex-1 bg-amber-50 text-amber-800 px-4 py-2.5 rounded-lg border border-amber-200 text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {t('performance.waitingManagerApproval')}
                      </div>
                      <Button variant="outline" onClick={handleCancelSummaryRequest}>
                        {t('performance.cancelRequest')}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Final Results View */}
              {currentStatus === 'approved_summary' && currentRecord?.finalScore !== undefined && (
                <div className="pt-6 border-t">
                  <h3 className="text-xl font-medium mb-6">{t('performance.evaluationResults')}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t('performance.attendance')}</p>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-2xl font-light">{currentRecord.actualWorkingDays}</span>
                          <span className="text-muted-foreground pb-1 text-sm">/ {currentRecord.registeredWorkingDays} {t('performance.days')}</span>
                        </div>
                        <Progress value={(currentRecord.actualWorkingDays / currentRecord.registeredWorkingDays) * 100} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t('performance.managerScore')}</p>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-2xl font-light">{currentRecord.managerScore}</span>
                          <span className="text-muted-foreground pb-1 text-sm">/ 100</span>
                        </div>
                        <Progress value={currentRecord.managerScore} className="h-2 bg-muted [&>div]:bg-indigo-500" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t('performance.customerTasks')}</p>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-2xl font-light">{currentRecord.customerTaskScore}</span>
                          <span className="text-muted-foreground pb-1 text-sm">/ 100</span>
                        </div>
                        <Progress value={currentRecord.customerTaskScore} className="h-2 bg-muted [&>div]:bg-amber-500" />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-medium text-primary">{t('performance.finalPerformanceScore')}</h4>
                      <p className="text-sm text-primary/80 mt-1">
                        {t('performance.formulaNote')} {team?.formula.attendanceWeight! * 100}% {t('performance.attendance')} + {team?.formula.managerWeight! * 100}% {t('performance.managerScore')} + {team?.formula.customerWeight! * 100}% {t('performance.customerTasks')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-background px-6 py-3 rounded-lg border shadow-sm">
                      <CheckCircle className="w-8 h-8 text-primary" />
                      <span className="text-3xl font-semibold text-primary">
                        {currentRecord.finalScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
