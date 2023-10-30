import { Table, TableBody, TableHead, TableHeader } from '@/components/ui/table';

import ShiftRow from './ShiftRow';

type Data = {
  date: number;
  end?: number;
  start?: number;
}[];

type ScheduleTableProps = {
  data: Data;
  shift: string;
  sickDays: number[];
  vacationDays: number[];
  setData: (data: Data) => void;
};

export default function ScheduleTable({
  data,
  shift,
  setData,
  sickDays,
  vacationDays,
}: ScheduleTableProps) {
  return (
    <div className="max-h-[81vh] overflow-y-scroll border">
      <Table className="min-w-[50vw]">
        <TableHeader className="sticky top-0 bg-background shadow shadow-border dark:shadow-md dark:shadow-border">
          <TableHead>Date</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <ShiftRow
              data={data}
              item={item}
              shift={shift}
              index={index}
              setData={setData}
              sickDays={sickDays}
              vacationDays={vacationDays}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
