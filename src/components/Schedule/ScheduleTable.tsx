import { useRef } from "react";
import { Employee } from "~/utils/api";
import { findVacationDays } from "~/utils/checkAbsence";
import {
  formatDateLong,
  formatDay,
  formatTime,
  formatTotal,
} from "~/utils/dateFormatting";

interface ScheduleTableProps {
  data: {
    date: number;
    end?: number;
    start?: number;
  }[];
  sickDays: string[];
  vacationDays: string[];
  shift: string | undefined;
  setData: (
    data: {
      date: number;
      end?: number;
      start?: number;
    }[]
  ) => void;
}

export default function ScheduleTable({
  data,
  shift,
  setData,
  sickDays,
  vacationDays,
}: ScheduleTableProps) {
  const headings = ["Date", "Start", "End", "Total"];

  function handleTimeChange(
    index: number,
    newTime: string | undefined,
    field: "start" | "end"
  ) {
    if (newTime === undefined) {
      //clear the value
      const newData = data.map((d, i) =>
        i === index ? { ...d, [field]: undefined } : d
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
    <div className="h-[44rem] overflow-x-hidden rounded border-2 border-slate-300 shadow-md dark:border-slate-500">
      <table className="w-[90rem] divide-y-2 divide-slate-300 overflow-scroll rounded bg-white text-left text-xl shadow-md dark:divide-slate-600 dark:bg-slate-800">
        <thead>
          <tr className="sticky top-0 bg-white dark:bg-slate-800 ">
            {headings.map((heading, index) => (
              <th
                className={`px-8 py-4 font-semibold ${
                  index === 3 && "text-right"
                }`}
                key={index}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-slate-300 dark:divide-slate-600 ">
          {data.map((item: any, index) => {
            return (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-slate-100 dark:bg-slate-700"
                    : "bg-white dark:bg-slate-800"
                }
              >
                <td className="flex w-96 items-baseline justify-between px-8 py-4">
                  <span className="text-md">
                    {item.date && formatDay(item.date)}
                  </span>

                  <span className="w-48">
                    {item.date && formatDateLong(item.date)}
                  </span>
                </td>
                {shift ? (
                  <>
                    <td onClick={() => handleTimeWithClick(index)}>
                      <input
                        type="text"
                        value={formatTime(item.start!)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            e.currentTarget.select();
                            handleTimeChange(index, undefined, "start");
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
                          sickDays.includes(item.date) ||
                          vacationDays.includes(item.date)
                        }
                        className={`rounded bg-transparent py-4 pl-8 text-left placeholder-slate-500 focus:bg-white dark:placeholder-slate-400 dark:outline-none dark:ring-slate-100 dark:focus:bg-transparent dark:focus:ring-1 ${
                          shift &&
                          !vacationDays.includes(item.date) &&
                          "cursor-pointer ring-slate-800 hover:ring-0.5 dark:ring-slate-50"
                        }`}
                      />
                    </td>
                    <td onClick={() => handleTimeWithClick(index)}>
                      <input
                        value={formatTime(item.end!)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            e.currentTarget.select();
                            handleTimeChange(index, undefined, "end");
                          }
                        }}
                        disabled={
                          sickDays.includes(item.date) ||
                          vacationDays.includes(item.date)
                        }
                        className={`rounded bg-transparent py-4 pl-8 text-left ring-slate-100 focus:bg-white dark:outline-none dark:focus:bg-transparent dark:focus:ring-1 ${
                          shift &&
                          !vacationDays.includes(item.date) &&
                          "cursor-pointer ring-slate-800 hover:ring-0.5 dark:ring-slate-50"
                        }`}
                        type="text"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <input
                        type="text"
                        autoFocus={index === 0}
                        placeholder={
                          vacationDays.includes(item.date)
                            ? "Vacation"
                            : undefined || sickDays.includes(item.date)
                            ? "Sick"
                            : undefined
                        }
                        onContextMenu={(e) => {
                          e.preventDefault();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            e.currentTarget.select();
                            handleTimeChange(index, undefined, "start");
                          }
                        }}
                        disabled={
                          sickDays.includes(item.date) ||
                          vacationDays.includes(item.date)
                        }
                        value={formatTime(item.start!)}
                        onChange={(e) =>
                          handleTimeChange(index, e.target.value, "start")
                        }
                        className="rounded bg-transparent py-4 pl-8 text-left placeholder-slate-500 focus:bg-white dark:placeholder-slate-400 dark:outline-none dark:ring-slate-100 dark:focus:bg-transparent dark:focus:ring-1"
                      />
                    </td>

                    <td>
                      <input
                        value={formatTime(item.end!)}
                        disabled={
                          sickDays.includes(item.date) ||
                          vacationDays.includes(item.date)
                        }
                        onChange={(e) =>
                          handleTimeChange(index, e.target.value, "end")
                        }
                        onContextMenu={(e) => {
                          e.preventDefault();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            e.currentTarget.select();
                            handleTimeChange(index, undefined, "end");
                          }
                        }}
                        className="rounded bg-transparent py-4 pl-8 text-left ring-slate-100 focus:bg-white dark:outline-none dark:focus:bg-transparent dark:focus:ring-1"
                        type="text"
                      />
                    </td>
                  </>
                )}

                {item.start && item.end && (
                  <td
                    title="Total hours in shift"
                    className="w-40 px-8 py-4 text-right"
                  >
                    {formatTotal(item.start, item.end)}
                  </td>
                )}

                {(vacationDays.includes(item.date) ||
                  sickDays.includes(item.date)) && (
                  <td
                    title="Total hours in shift"
                    className="w-40 px-8 py-4 text-right"
                  >
                    8h
                  </td>
                )}

                {!item.end &&
                  !item.start &&
                  !sickDays.includes(item.date) &&
                  !vacationDays.includes(item.date) && (
                    <td
                      title="Total hours in shift"
                      className="w-40 px-8 py-4 text-right"
                    ></td>
                  )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
