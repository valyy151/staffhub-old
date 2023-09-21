import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import Heading from "~/components/ui/Heading";
import { Button } from "@/components/ui/button";
import Sidebar from "~/components/Staff/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import router from "next/router";
import { Label } from "@/components/ui/label";

type EmployeePersonalProps = {
  query: { id: string };
};

EmployeePersonalPage.getInitialProps = ({ query }: EmployeePersonalProps) => {
  return { query };
};

export default function EmployeePersonalPage({ query }: EmployeePersonalProps) {
  const { data: employee, failureReason } = api.employee?.findOne.useQuery({
    id: query.id,
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (!employee) {
      return;
    }
    employee.name && setName(employee.name);
    employee.email && setEmail(employee.email);
    employee.address && setAddress(employee.address);
    employee.phoneNumber && setPhone(employee.phoneNumber);
  }, [employee]);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const updatePersonalInfo = api.employee?.update.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast({ title: "Personal information updated successfully." });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !email || !address || !phone) {
      return toast({ title: "Please fill out all fields." });
    }

    updatePersonalInfo.mutate({
      name,
      email,
      address,
      phoneNumber: phone,
      employeeId: query.id,
    });
  }

  if (!employee || !employee.name) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />
      <div className="mt-4 flex flex-col">
        <Heading size={"sm"}>
          {employee.name.endsWith("s")
            ? `${employee.name}'`
            : `${employee.name}'s`}{" "}
          Personal Information
        </Heading>

        <form onSubmit={handleSubmit} className="mt-8 w-4/5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2 bg-white text-lg dark:bg-transparent"
          />
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 bg-white text-lg dark:bg-transparent"
          />

          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mb-2 bg-white text-lg dark:bg-transparent"
          />

          <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-2 bg-white text-lg dark:bg-transparent"
          />
          <Button
            size={"lg"}
            title="Update information"
            className="mt-4 text-xl"
          >
            Save changes {<Save className="ml-2" />}
          </Button>
        </form>
      </div>
    </main>
  );
}
