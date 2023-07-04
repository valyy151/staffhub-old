import Paragraph from "~/components/ui/Paragraph";

export default function DocumentationPage() {
  return (
    <main className="mt-4 flex flex-col items-center px-2 md:px-16">
      <h1 className="w-full max-w-3xl pb-4 text-center text-3xl">
        Documentation
      </h1>

      <Paragraph className="text-justify">
        <h2 className="mb-3 mt-4 text-2xl md:mt-8">Employees</h2>
        First thing to do is to create some employees which you can manage.
        After you have at least 1 employee you can create a monthly schedule for
        that employee. On the employees profile page you can set and edit things
        like notes, vacation, schedules or shift preferences.
      </Paragraph>

      <Paragraph className="text-justify">
        <h2 className="mb-3 mt-4 text-2xl md:mt-8">Schedules</h2>
        Once you have at least 1 employee you can create a monthly schedule for
        that employee. This schedule will be avaliable from the profile page of
        that employee. There you can print it as PDF to send it to your
        employee. On the dashboard page you will be able to see all the work
        days for the entire year. There you can easily see if there are any
        notes for a specific work day, and the number of employees that have
        shifts.
      </Paragraph>

      <Paragraph className="text-justify">
        <h2 className="mb-3 mt-4 text-2xl md:mt-8">Work days</h2>
        By accessing a specific work day from the dashboard, you will see
        details of that work day. Here you can add or edit shifts or notes for
        that day.
      </Paragraph>

      <Paragraph className="text-justify">
        <h2 className="mb-3 mt-4 text-2xl md:mt-8">Shifts</h2>
        When creating a shift, the correct format is the european format. For
        example: 09:00 - 17:00. If your shift ends at midnight, you will have to
        write it as 24:00 and it will instantly change to 00:00 and calculate
        the total hours of the shift. Writing 00:00 yourself will not work.
      </Paragraph>
    </main>
  );
}
