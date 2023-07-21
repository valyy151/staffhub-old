import { Dispatch, SetStateAction, useState } from "react";
import Heading from "../ui/Heading";
import {
  formatDate,
  formatDay,
  formatMonth,
  formatTime,
} from "~/utils/dateFormatting";
import Paragraph from "../ui/Paragraph";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Scroll,
  ScrollText,
  User,
  X,
} from "lucide-react";
import groupShifts from "~/utils/groupShifts";
import { Button } from "../ui/Button";
import router from "next/router";
import { Shift, WorkDay, WorkDayNote } from "@prisma/client";

interface DashboardProps {
  skip: number;
  loading: boolean;
  data: WorkDay[] | any;
  setSkip: Dispatch<SetStateAction<number>>;
}

export default function Dashboard({
  data,
  skip,
  setSkip,
  loading,
}: DashboardProps) {
  function handlePrevPage(): void {
    setSkip(skip - 1);
  }

  function handleNextPage(): void {
    setSkip(skip + 1);
  }

  return (
    <div className="dashboard p-0 pt-20">
      <div className="flex">
        <Heading size={"sm"} className="mb-4 mr-auto text-left">
          {data[3] && formatMonth(data[3].date)}
        </Heading>
        <Heading size={"sm"} className="font-normal">
          {formatDate(data[0].date)} - {formatDate(data[6].date)}
        </Heading>
      </div>
      <div className="flex min-h-[36rem] rounded border border-slate-300 bg-white shadow dark:border-slate-500 dark:bg-slate-700">
        {data.map(
          (day: {
            id: string;
            date: number;
            shifts: {
              end: number;
              date: number;
              start: number;
              count: number;
            }[];
            notes: WorkDayNote[];
          }) => (
            <div
              className="group flex w-64 cursor-pointer flex-col items-center border-x border-slate-300 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-600"
              key={day.id}
              onClick={() => router.push(`/days/${day.id}`)}
            >
              <div className="w-full text-center">
                <Heading
                  className="px-3 pt-6 transition-colors duration-75 group-hover:text-sky-400"
                  size={"xs"}
                >
                  {formatDay(day.date)}
                </Heading>
                <Paragraph className=" w-full cursor-pointer border-b-2 border-slate-300 py-2 text-center group-hover:text-sky-400 dark:border-slate-500">
                  {day && formatDate(day.date)}
                </Paragraph>
              </div>
              <div className="mt-4 flex w-full flex-col items-center">
                {groupShifts(day.shifts).length > 0 ? (
                  groupShifts(day.shifts).map((groupedShift) => (
                    <Paragraph
                      className="flex items-center"
                      title={`${day.shifts.length} ${
                        day.shifts.length === 1 ? "shift" : "shifts"
                      } `}
                      key={`${groupedShift.start}-${groupedShift.end}`}
                    >
                      <div className="mr-3 flex">
                        {`${groupedShift.count}`}{" "}
                        <User className="font-normal" />
                      </div>
                      {`${formatTime(groupedShift.start)} - ${formatTime(
                        groupedShift.end
                      )}`}
                    </Paragraph>
                  ))
                ) : (
                  <Paragraph className="flex items-center">
                    <X className="mr-2" />
                    No Shifts
                  </Paragraph>
                )}
              </div>
              {day.notes.length > 0 ? (
                <Paragraph
                  title={`${day.notes.length} ${
                    day.notes.length === 1 ? "note" : "notes"
                  } `}
                  className="mt-auto flex items-center pb-2 text-2xl"
                >
                  {day.notes.length} <ScrollText className="ml-2 h-6 w-6" />
                </Paragraph>
              ) : (
                <Paragraph
                  title={`${day.notes.length} ${
                    day.notes.length === 1 ? "note" : "notes"
                  } `}
                  className="mt-auto flex items-center pb-2 text-2xl"
                >
                  {day.notes.length} <Scroll className="ml-2 h-6 w-6" />
                </Paragraph>
              )}
            </div>
          )
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center pt-4">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : (
        <div className="h-12"></div>
      )}

      <div className="flex justify-center pt-2">
        <Button
          variant={"link"}
          title="Previous Week"
          onClick={handlePrevPage}
          className="mr-1 rounded-lg bg-slate-200 px-3 py-2 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          {<ChevronLeft size={48} />}
        </Button>

        <Button
          variant={"link"}
          title="Next Week"
          onClick={handleNextPage}
          className="mr-1 rounded-lg bg-slate-200 px-3 py-2 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          {<ChevronRight size={48} />}
        </Button>
      </div>
    </div>
  );
}
