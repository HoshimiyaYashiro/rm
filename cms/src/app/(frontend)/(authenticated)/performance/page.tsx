'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Clock, CheckCircle, ChevronRight, Check, ChartColumnIcon, ChartLineIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import { useForm } from '@tanstack/react-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from '../../components/ui/sheet';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslations } from 'next-intl';
import { Button } from '../../components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '../../services/user-api';
import { countBusinessDays } from '../../helpers/time-helper';
import { Goal } from '../../types';
import { PerformanceRecord } from '@/payload-types';
import { recordQueries } from '../../services/record-api';
import { RecordForm } from './components/record-form';
import { PERFORMANCE_RECORDS_STATUS } from '@/constants/constant';

export default function PerformancePage() {
  const { data: authUser, refetch: refetchMe, isFetching: isFetchingMe, isError: isErrorMe } = useQuery(userQueries.me());
  // const { data: records, refetch: refetchRecord, isFetching: isFetchingRecord, isError: isErrorRecord } = useQuery(recordQueries.find());
  const records: any[] = []
  // const { currentUser } = useAuthStore();
  // const { records, createRecord, updateRecord, teams } = useAppStore();
  const t = useTranslations();

  const currentMonth = DateTime.now();
  const nextMonth = currentMonth.plus({ months: 1 });

  // const myRecords = records.filter(r => r.userId === currentUser?.id).sort((a, b) => b.month.localeCompare(a.month));
  // const team = teams.find(t => t.id === currentUser?.teamId);

  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toFormat('yyyy-MM'));

  const defaultRecord: PerformanceRecord = {
    type: 'M',
    registeredDays: countBusinessDays(currentMonth.year, currentMonth.month),
    workingDays: null,
    goals: [] as Goal[],
    id: 0,
    label: selectedMonth,
    status: 'DR',
    updatedAt: '',
    createdAt: '',
    start: selectedMonth,
    end: selectedMonth,
  }

  const form = useForm({
    defaultValues: defaultRecord,
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const currentRecord = React.useMemo(() => {
    return records.find((r: any) => r.id === selectedRecordId) || null;
  }, [records, selectedRecordId]);

  useEffect(() => {
    if (selectedRecordId === null) return;
    if (selectedRecordId === 0) {
      // setSelectedMonth(myRecords.some(r => r.month === currentMonth) ? nextMonth : currentMonth);
      setSelectedMonth(selectedMonth);
      form.reset(defaultRecord);
    } else {
      const record = records.find((r: any) => r.id === selectedRecordId);
      if (record) {
        setSelectedMonth(record.month);
        form.reset(record);
      }
    }
    setIsSheetOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecordId]);

  const currentStatus = currentRecord?.status || PERFORMANCE_RECORDS_STATUS.DRAFT_REGISTRATION;
  const isRegistrationEditable = currentStatus === PERFORMANCE_RECORDS_STATUS.DRAFT_REGISTRATION;
  const isSummaryEditable = currentStatus === PERFORMANCE_RECORDS_STATUS.APPROVED_REGISTRATION || currentStatus === PERFORMANCE_RECORDS_STATUS.DRAFT_SUMMARY;

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
    // const recordData = {
    //   userId: currentUser.id,
    //   month: selectedMonth,
    //   registeredWorkingDays: Number(registeredDays),
    //   goals: goals.filter(g => g.description.trim() !== ''),
    //   actualWorkingDays: 0,
    //   managerScore: 0,
    //   customerTaskScore: 0,
    //   status: 'draft_registration' as const,
    //   currentReviewLevel: 0
    // };

    // if (selectedRecordId === 'new') {
    //   const newId = `rec_${Date.now()}`;
    //   createRecord({ ...recordData, id: newId });
    //   setSelectedRecordId(newId);
    // } else if (currentRecord) {
    //   updateRecord(currentRecord.id, recordData);
    // }
  };

  const handleSubmitRegistration = () => {
    // const recordData = {
    //   userId: currentUser.id,
    //   month: selectedMonth,
    //   registeredWorkingDays: Number(registeredDays),
    //   goals: goals.filter(g => g.description.trim() !== ''),
    //   actualWorkingDays: 0,
    //   managerScore: 0,
    //   customerTaskScore: 0,
    //   status: 'pending_registration' as const,
    //   currentReviewLevel: 1
    // };

    // if (selectedRecordId === 'new') {
    //   const newId = `rec_${Date.now()}`;
    //   createRecord({ ...recordData, id: newId });
    //   setSelectedRecordId(newId);
    // } else if (currentRecord) {
    //   updateRecord(currentRecord.id, recordData);
    // }
  };

  const handleSaveSummaryDraft = () => {
    // if (!currentRecord || selectedRecordId === 'new') return;
    // updateRecord(currentRecord.id, {
    //   actualWorkingDays: Number(actualDays),
    //   goals,
    //   status: 'draft_summary'
    // });
  };

  const handleSubmitSummary = () => {
    // if (!currentRecord || selectedRecordId === 'new') return;
    // updateRecord(currentRecord.id, {
    //   actualWorkingDays: Number(actualDays),
    //   goals,
    //   status: 'pending_summary',
    //   currentReviewLevel: 1
    // });
  };

  const handleCancelRegistrationRequest = () => {
    // if (!currentRecord || selectedRecordId === 'new') return;
    // updateRecord(currentRecord.id, { status: 'draft_registration' });
  };

  const handleCancelSummaryRequest = () => {
    // if (!currentRecord || selectedRecordId === 'new') return;
    // updateRecord(currentRecord.id, { status: 'draft_summary' });
  };

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
  // const chartData = [...myRecords].reverse()
  //   .filter(record => record.status === 'approved_summary')
  //   .map(record => ({
  //     name: record.month,
  //     finalScore: record.finalScore || 0,
  //     managerScore: record.managerScore || 0,
  //     customerScore: record.customerTaskScore || 0,
  //     attendanceScore: record.registeredWorkingDays ? Math.round((record.actualWorkingDays || 0) / record.registeredWorkingDays * 100) : 0
  //   }));

  // const targetMonth = myRecords.some(r => r.month === currentMonth) ? nextMonth : currentMonth;
  // const isCreateDisabled = myRecords.some(r => r.month === currentMonth) && myRecords.some(r => r.month === nextMonth);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('performance.title')}</h1>
          <p className="text-muted-foreground">{t('performance.historySubtitle')}</p>
        </div>

        <Button
          onClick={() => {
            // setSelectedMonth(targetMonth);
            setSelectedRecordId(0);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('performance.newRecord')} ({selectedMonth})
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* <Card>
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
                <Button variant={chartType === 'bar' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('bar')} className="h-7 text-xs"><ChartColumnIcon /></Button>
                <Button variant={chartType === 'line' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('line')} className="h-7 text-xs"><ChartLineIcon /></Button>
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
        </Card> */}

        {/* <Card>
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
        </Card> */}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) setTimeout(() => setSelectedRecordId(null), 300);
      }}>
        <RecordForm label={selectedMonth} record={currentRecord} startDate={currentMonth} />
      </Sheet>
    </div>
  );
}

