"use client"

import { PerformanceRecord } from "@/payload-types"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from '@fe-components/ui/sheet';
import { useTranslations } from "next-intl";
import { Button } from '@fe-components/ui/button';
import { Checkbox } from '@fe-components/ui/checkbox';
import { Badge } from '@fe-components/ui/badge';
import { Input } from '@fe-components/ui/input';
import { Label } from '@fe-components/ui/label';
import { Textarea } from '@fe-components/ui/textarea';
import { Progress } from '@fe-components/ui/progress';
import { NumberField } from '@fe-components/form/number-field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@fe-components/ui/card';
import { PERFORMANCE_RECORDS_STATUS } from "@/constants/constant";
import { CheckCircle2, Clock, Plus, Trash2 } from "lucide-react";
import { countBusinessDays } from "@/app/(frontend)/helpers/time-helper";
import { Goal } from "@/app/(frontend)/types";
import { DateTime } from "luxon";
import { useForm } from "@tanstack/react-form";
import { TextField } from "@fe-components/form/text-field";
import { CheckboxOptionField } from "@fe-components/form/checkbox-option-field";

export function RecordForm({
  label,
  startDate,
  record,
}: {
  label: string,
  startDate: DateTime,
  record: PerformanceRecord | null
}) {
  const t = useTranslations();
  const getTimelineStep = (status: string) => {
    switch (status) {
      case 'new': return 0;
      case PERFORMANCE_RECORDS_STATUS.DRAFT_REGISTRATION: return 0;
      case PERFORMANCE_RECORDS_STATUS.COMPLETED_REGISTRATION: return 1;
      case PERFORMANCE_RECORDS_STATUS.DRAFT_SUMMARY: return 1;
      case PERFORMANCE_RECORDS_STATUS.PENDING_SUMMARY: return 2;
      case PERFORMANCE_RECORDS_STATUS.APPROVED_SUMMARY: return 3;
      default: return 0;
    }
  };
  const steps = [
    { title: t('performance.steps.draftReg') },
    { title: t('performance.steps.monthSummary') },
    { title: t('performance.steps.finalEval') },
  ];
  const currentStep = getTimelineStep(record?.status || 'new');
  const currentStatus = record?.status || PERFORMANCE_RECORDS_STATUS.DRAFT_REGISTRATION;
  const isRegistrationEditable = currentStatus === PERFORMANCE_RECORDS_STATUS.DRAFT_REGISTRATION;
  const isSummaryEditable = currentStatus === PERFORMANCE_RECORDS_STATUS.COMPLETED_REGISTRATION || currentStatus === PERFORMANCE_RECORDS_STATUS.DRAFT_SUMMARY;
  const defaultRecord: PerformanceRecord = {
    type: 'M',
    registeredDays: countBusinessDays(startDate.year, startDate.month),
    workingDays: null,
    goals: [] as Goal[],
    id: 0,
    label: label,
    status: 'DR',
    updatedAt: '',
    createdAt: '',
    start: startDate.toFormat('yyyy-MM'),
    end: startDate.toFormat('yyyy-MM'),
  }

  const form = useForm({
    defaultValues: defaultRecord as PerformanceRecord,
  });
  const handleSaveRegistrationDraft = () => {
    throw new Error("Function not implemented.");
  }

  const handleSubmitRegistration = () => {
    throw new Error("Function not implemented.");
  }

  const handleCancelRegistrationRequest = () => {
    throw new Error("Function not implemented.");
  }

  return (
    <SheetContent className="w-full sm:min-w-[32rem] sm:max-w-4xl data-[side=right]:sm:max-w-4xl overflow-y-auto p-6 sm:p-8">
      <SheetHeader className="mb-6">
        <SheetTitle>
          {record === null
            ? `${t('performance.newRecordForMonth')} (${label})`
            : `${t('performance.recordForMonth')} ${record.label}`}
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
              style={{ width: `${(Math.min(currentStep, steps.length - 1) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${index < currentStep ? 'bg-primary border-primary text-primary-foreground' :
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="space-y-8"
        >
          {/* Section 1: Registration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">{t('performance.startOfMonthSection')}</h3>
            <form.Field
              name={"registeredDays"}
              children={(field) => (
                <NumberField
                  label={t('performance.registeredDays')}
                  field={field}
                  disabled={!isRegistrationEditable}
                  className="max-w-50"
                  min={0}
                  max={31}
                />
              )}
            />
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base">{t('performance.goalsLabel')}</Label>
                {isRegistrationEditable && (
                  <form.Subscribe
                    selector={(state) => state.values.goals}
                    children={(goalsValue) => (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const goals = Array.isArray(goalsValue) ? goalsValue : [];
                          const newGoals = [...goals, { goal: '', isCompleted: false, result: '' }];
                          form.setFieldValue('goals', newGoals);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" /> {t('performance.addGoal')}
                      </Button>
                    )}
                  />
                )}
              </div>

              <form.Subscribe
                selector={(state: any) => state.values.goals}
                children={(goalsValue) => (
                  <div className="space-y-4">
                    {goalsValue.map((goal: any, index: number) => (
                      <Card key={goal.id || index} className="relative overflow-visible">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <form.Field
                              name={`goals[${index}].goal`}
                              children={(field) => (
                                <TextField
                                  field={field}
                                  label={t('performance.goalDescription')}
                                  placeholder={t('performance.goalPlaceholder')}
                                  disabled={!isRegistrationEditable}
                                />
                              )}
                            />

                            {currentStep >= 2 && (
                              <div className="pt-4 border-t space-y-3">
                                <form.Field
                                  name={`goals[${index}].isCompleted`}
                                  children={(field) => (
                                    <CheckboxOptionField
                                      field={field}
                                      label={t('performance.markCompleted')}
                                      disabled={!isSummaryEditable}
                                    />
                                    // <div className="flex items-center space-x-2">
                                    //   <Checkbox
                                    //     id={`goal-completed-${goal.id || index}`}
                                    //     checked={field.state.value as boolean || false}
                                    //     onCheckedChange={(checked) => field.handleChange(checked === true)}
                                    //     disabled={!isSummaryEditable}
                                    //   />
                                    //   <label
                                    //     htmlFor={`goal-completed-${goal.id || index}`}
                                    //     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    //   >
                                    //     {t('performance.markCompleted')}
                                    //   </label>
                                    // </div>
                                  )}
                                />

                                <form.Field
                                  name={`goals[${index}].result`}
                                  children={(field) => (
                                    <Textarea
                                      placeholder={t('performance.resultPlaceholder')}
                                      value={field.state.value as string || ''}
                                      onChange={(e) => field.handleChange(e.target.value)}
                                      disabled={!isSummaryEditable}
                                      className="min-h-20"
                                    />
                                  )}
                                />
                              </div>
                            )}
                          </div>

                          {isRegistrationEditable && goalsValue.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                              onClick={() => {
                                const filtered = goalsValue.filter((_: any, i: number) => i !== index);
                                form.setFieldValue('goals', filtered);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              />
            </div>

            {isRegistrationEditable && (
              <div className="flex gap-3 pt-2 justify-end">
                <Button type="button" variant="outline" onClick={handleSaveRegistrationDraft}>
                  {t('performance.saveDraft')}
                </Button>
                <Button type="button" onClick={handleSubmitRegistration}>
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
                <Button type="button" variant="outline" onClick={handleCancelRegistrationRequest}>
                  {t('performance.cancelRequest')}
                </Button>
              </div>
            )}
          </div>

          {/* Section 2: End of Month Summary */}
          {/* {currentStep >= 2 && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium border-b pb-2">{t('performance.endOfMonthSection')}</h3>

              <form.Field
                name="actualDays"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>{t('performance.actualDays')}</Label>
                    <Input
                      id={field.name}
                      type="number"
                      className="max-w-[200px]"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={!isSummaryEditable}
                    />
                  </div>
                )}
              />

              {isSummaryEditable && (
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={handleSaveSummaryDraft}>
                    {t('performance.saveDraft')}
                  </Button>
                  <Button type="button" onClick={handleSubmitSummary}>
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
                  <Button type="button" variant="outline" onClick={handleCancelSummaryRequest}>
                    {t('performance.cancelRequest')}
                  </Button>
                </div>
              )}
            </div>
          )} */}
        </form>

        {/* Final Results View */}
        {/* {currentStatus === 'approved_summary' && currentRecord?.finalScore !== undefined && (
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
                  {t('performance.formulaNote')} {team?.formula.attendanceWeight! * 100}% {t('performance.attendance')} + {team?.formula.managerWeight! * 100}% {t('performance.managerScore', 'Quản lý')} + {team?.formula.customerWeight! * 100}% {t('performance.customerTasks', 'Khách hàng')}
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
        )} */}
      </div>
    </SheetContent>
  )
}
