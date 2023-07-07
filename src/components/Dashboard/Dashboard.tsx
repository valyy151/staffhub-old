import { WorkDay } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect } from "react";
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
  Scroll,
  ScrollText,
  User,
  X,
} from "lucide-react";
import groupShifts from "~/utils/groupShifts";
import { Button } from "../ui/Button";
import router from "next/router";

interface DashboardProps {
  data: WorkDay[];
  setSkip: Dispatch<SetStateAction<number>>;
}

export default function Dashboard({ data, setSkip }: DashboardProps) {
  function handlePrevPage(): void {
    setSkip((skip) => skip - 1);
  }

  function handleNextPage(): void {
    setSkip((skip) => skip + 1);
  }

  return (
    <div className="dashboard p-0 pt-20">
      <Heading size={"sm"} className="mb-4 mr-auto text-left">
        {data[0] && formatMonth(data[0].date)}
      </Heading>
      <div className="flex min-h-[36rem] rounded border border-slate-300 bg-white shadow dark:border-slate-500 dark:bg-slate-700">
        {data.map((day: WorkDay) => (
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
              {/* {groupShifts(day.shifts).length > 0 ? (
                groupShifts(day.shifts).map((groupedShift) => (
                  <Paragraph
                    className="flex items-center"
                    title={`${day.shifts.length} ${
                      day.shifts.length === 1 ? "shift" : "shifts"
                    } `}
                    key={`${groupedShift.start}-${groupedShift.end}`}
                  >
                    <div className="mr-3 flex">
                      {`${groupedShift.count}`} <User className="font-normal" />
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
              )} */}
            </div>
            {/* {day.notes.length > 0 ? (
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
            )} */}
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
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
