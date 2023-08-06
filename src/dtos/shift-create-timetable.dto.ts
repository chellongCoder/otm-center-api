import { Shifts } from '@/models/shifts.model';

export class ShiftCreateTimetableDto extends Shifts {
  classShiftsClassroomId: number;
}
