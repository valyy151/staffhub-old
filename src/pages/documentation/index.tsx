import Heading from "~/components/ui/Heading";
import Paragraph from "~/components/ui/Paragraph";

export default function DocumentationPage() {
  return (
    <main className="flex w-fit flex-col items-start px-16 pb-24 text-justify">
      <Heading className="my-4 border-b-2 border-slate-300 dark:border-slate-500">
        Documentation
      </Heading>
      <section className="ml-4">
        <Heading size={"sm"} className="mt-2">
          Staff
        </Heading>

        <Paragraph size={"lg"}>
          First thing to do is to create some{" "}
          <span className="font-semibold">staff members</span> which you can
          manage. On the employees profile page you can set and edit things like{" "}
          <span className="font-semibold">notes</span>,{" "}
          <span className="font-semibold">sick leave</span>,{" "}
          <span className="font-semibold">vacation</span>,{" "}
          <span className="font-semibold">schedules</span> or{" "}
          <span className="font-semibold">shift preferences</span>.
        </Paragraph>

        <Heading size={"sm"} className="mt-8">
          Schedules
        </Heading>

        <Paragraph size={"lg"}>
          After you have at least{" "}
          <span className="font-semibold">1 staff member</span> , you can create
          a <span className="font-semibold">monthly schedule</span> for that
          employee. This schedule will be avaliable from the{" "}
          <span className="font-semibold">profile page</span> of that employee.
          There you can print it as <span className="font-semibold">PDF</span>{" "}
          to send it to your employee. On the{" "}
          <span className="font-semibold">dashboard page</span> you will be able
          to see all the{" "}
          <span className="font-semibold">work days for the entire year</span>.
          There you can easily see if there are any{" "}
          <span className="font-semibold">notes</span> for those days, and the
          number <span className="font-semibold">shifts</span> you have planned.
        </Paragraph>

        <Heading size={"sm"} className="mt-8">
          Staff Roles
        </Heading>

        <Paragraph size={"lg"}>
          You can create different <span className="font-semibold">roles</span>{" "}
          for your staff members. You can also set how many of that role you
          need in one work day. This can be done from the{" "}
          <span className="font-semibold">roles page</span> located in your{" "}
          <span className="font-semibold">account settings</span> . You can then
          assign a role to a staff member from their{" "}
          <span className="font-semibold">profile page</span>. This will allow
          you to easily see which staff members have which role. When creating
          shifts you can assign a role to an employee and easily oversee how
          many roles you got covered for a specific day.
        </Paragraph>

        <Heading size={"sm"} className="mt-8">
          Work days
        </Heading>

        <Paragraph size={"lg"}>
          By accessing a specific work day from the{" "}
          <span className="font-semibold">dashboard</span>, you will see details
          of that work day. Here you can add, edit or delete{" "}
          <span className="font-semibold">shifts</span> or{" "}
          <span className="font-semibold">notes</span> for that day.
        </Paragraph>

        <Heading size={"sm"} className="mt-8">
          Shifts
        </Heading>

        <Paragraph size={"lg"}>
          When creating a shift, the correct format is the{" "}
          <span className="font-semibold">european format</span>. For example:
          You would write <span className="font-semibold">09:00 - 17:00</span>{" "}
          instead of <span className="font-semibold">09:00AM - 05:00PM</span>.
          If your shift ends at midnight, you will have to write it as{" "}
          <span className="font-semibold">24:00</span> and it will instantly
          change to <span className="font-semibold">00:00</span> and calculate
          the total hours of the shift. Writing{" "}
          <span className="font-semibold">00:00</span> yourself will not work.
        </Paragraph>

        <Heading size={"sm"} className="mt-8">
          Shift Models
        </Heading>

        <Paragraph size={"lg"}>
          Shift models are a way to describe the different types of shifts
          available that you use most often. For example: 06:00 - 14:00 or 12:00
          - 20:00. You can use this to create schedules faster by selecting a
          shift model and applying it quickly to a day. You can also use it to
          assign it to your staff if they have a preference to work those
          shifts.
        </Paragraph>
      </section>
    </main>
  );
}
