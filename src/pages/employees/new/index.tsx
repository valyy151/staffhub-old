import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Input from "~/components/ui/Input";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";

export default function NewEmployeePage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createEmployee.mutate({ name, email, address, phoneNumber });
  }

  const createEmployee = api.employee.create.useMutation({
    onSuccess: () => {
      toast.success("Employee created successfully.");
      window.location.href = "/employees";
    },
  });

  return (
    <div className="w-full">
      <Heading className="mt-12 text-center">Create an Employee</Heading>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mb-16 mt-12 flex flex-col gap-2 sm:w-1/3"
      >
        <label htmlFor="name">Employee Name</label>

        <Input
          id="name"
          type="text"
          name="name"
          value={name}
          className="h-12 text-lg"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name of the employee"
        />

        <label htmlFor="email">Employee Email</label>

        <Input
          id="email"
          type="text"
          name="email"
          value={email}
          className="h-12 text-lg"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the email of the employee"
        />

        <label htmlFor="phone">Employee Phone</label>

        <Input
          id="phone"
          type="text"
          name="phone"
          value={phoneNumber}
          className="h-12 text-lg"
          onChange={(e) => {
            const re = /^[0-9+\s]*$/;
            if (re.test(e.target.value)) {
              setPhoneNumber(e.target.value);
            }
          }}
          placeholder="Enter the phone number of the employee"
        />

        <label htmlFor="address">Employee Address</label>

        <Input
          type="text"
          id="address"
          name="address"
          value={address}
          className="h-12 text-lg"
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter the address of the employee"
        />

        <Button
          className="mt-2 w-1/3 text-lg"
          title="Save information and create employee"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
