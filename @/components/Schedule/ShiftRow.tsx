import { useRef } from 'react';
import { formatDateLong, formatDay, formatTime, formatTotal } from '~/utils/dateFormatting';

import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';

type Props = {
  data: Data;
  index: number;
  shift: string;
  item: {
    date: number;
    end?: number | undefined;
    start?: number | undefined;
  };
  sickDays: number[];
  vacationDays: number[];
  setData: (data: Data) => void;
};

type Data = { date: number; end?: number; start?: number }[];

export default function ShiftRow({
  data,
  item,
  index,
  shift,
  setData,
  sickDays,
  vacationDays,
}: Props) {
  const endRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);

  function handleTimeChange(
    index: number,
    newTime: string,
    field: "start" | "end"
  ) {
    if (newTime === "") {
      //clear the value
      const newData = data.map((d, i) =>
        i === index ? { ...d, [field]: "" } : d
      );
      setData(newData);
    }

    if (!newTime) {
      return;
    }

    const [hour, minute]: string[] = newTime.split(":");

    const newDate = new Date(data[index]!.date * 1000);

    newDate.setHours(Number(hour));
    newDate.setMinutes(Number(minute));

    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    const newData = data.map((d, i) =>
      i === index ? { ...d, [field]: newUnixTime } : d
    );
    setData(newData);
  }

  //function like handleTimeChange but it will apply it for both start and end
  function handleTimeWithClick(index: number) {
    const [start, end] = shift?.split("-") as string[];

    if (!start || !end) {
      return;
    }

    const [startHour, startMinute] = start.split(":");
    const [endHour, endMinute] = end.split(":");

    const newDate = new Date(data[index]!.date * 1000);

    newDate.setHours(Number(startHour));
    newDate.setMinutes(Number(startMinute));

    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    const newDate2 = new Date(data[index]!.date * 1000);

    newDate2.setHours(Number(endHour));
    newDate2.setMinutes(Number(endMinute));

    const newUnixTime2 = Math.floor(newDate2.getTime() / 1000);

    const newData = data.map((d, i) =>
      i === index ? { ...d, start: newUnixTime, end: newUnixTime2 } : d
    );
    setData(newData);
  }

  return (
    <TableRow key={index} className="hover:bg-inherit">
      <TableCell className="flex pt-6">
        <span> {formatDay(item.date)}</span>
        <span className="ml-auto">{formatDateLong(item.date)}</span>
      </TableCell>
      {shift ? (
        <>
          <TableCell onClick={() => handleTimeWithClick(index)}>
            <Input
              type="text"
              ref={startRef}
              value={formatTime(item.start!)}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.currentTarget.select();
                  handleTimeChange(index, "", "start");
                  endRef.current?.select();
                  handleTimeChange(index, "", "end");
                }
              }}
              placeholder={
                vacationDays.includes(item.date)
                  ? "Vacation"
                  : undefined || sickDays.includes(item.date)
                  ? "Sick"
                  : undefined
              }
              disabled={
                sickDays.includes(item.date) || vacationDays.includes(item.date)
              }
              className={`w-fit ${
                shift &&
                !vacationDays.includes(item.date) &&
                "hover:ring-0.5 w-fit cursor-pointer ring-gray-800 dark:ring-gray-50"
              }`}
            />
          </TableCell>
          <TableCell onClick={() => handleTimeWithClick(index)}>
            <Input
              ref={endRef}
              value={formatTime(item.end!)}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.currentTarget.select();
                  handleTimeChange(index, "", "end");
                  startRef.current?.select();
                  handleTimeChange(index, "", "start");
                }
              }}
              disabled={
                sickDays.includes(item.date) || vacationDays.includes(item.date)
              }
              className={`w-fit ${
                shift &&
                !vacationDays.includes(item.date) &&
                "hover:ring-0.5 w-fit cursor-pointer ring-gray-800 dark:ring-gray-50"
              }`}
              type="text"
            />
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>
            <Input
              type="text"
              autoFocus={index === 0}
              placeholder={
                vacationDays.includes(item.date)
                  ? "Vacation"
                  : undefined || sickDays.includes(item.date)
                  ? "Sick"
                  : undefined
              }
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.currentTarget.select();
                  handleTimeChange(index, "", "start");
                  endRef.current?.select();
                  handleTimeChange(index, "", "end");
                }
              }}
              disabled={
                sickDays.includes(item.date) || vacationDays.includes(item.date)
              }
              value={formatTime(item.start!)}
              onChange={(e) => handleTimeChange(index, e.target.value, "start")}
              className="w-fit "
            />
          </TableCell>

          <TableCell>
            <Input
              value={formatTime(item.end!)}
              disabled={
                sickDays.includes(item.date) || vacationDays.includes(item.date)
              }
              onChange={(e) => handleTimeChange(index, e.target.value, "end")}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.currentTarget.select();
                  handleTimeChange(index, "", "end");
                  startRef.current?.select();
                  handleTimeChange(index, "", "start");
                }
              }}
              className="w-fit"
              type="text"
            />
          </TableCell>
        </>
      )}

      {item.start && item.end ? (
        <TableCell title="Total hours in shift" className="text-right">
          {formatTotal(item.start, item.end)}
        </TableCell>
      ) : null}

      {(vacationDays.includes(item.date) || sickDays.includes(item.date)) && (
        <TableCell title="Total hours in shift" className="text-right">
          8h
        </TableCell>
      )}

      {!item.end &&
        !item.start &&
        !sickDays.includes(item.date) &&
        !vacationDays.includes(item.date) && (
          <TableCell title="Total hours in shift" className="text-right">
            -
          </TableCell>
        )}
    </TableRow>
  );
}
