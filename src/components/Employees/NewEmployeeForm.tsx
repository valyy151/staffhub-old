import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../ui/Button";
import { redirect } from "next/navigation";

export default function NewEmployeeForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createEmployee.mutate({ name, email, address, phoneNumber });
  };

  const createEmployee = api.employee.create.useMutation({
    onSuccess: (employee) => {
      console.log(employee);
      window.location.href = "/employees";
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="slide-in-bottom-h1 mx-auto mb-16 mt-12 flex flex-col gap-2 sm:w-1/3"
      >
        <label htmlFor="name">Employee Name</label>

        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name of the employee"
        />

        <label htmlFor="email">Employee Email</label>

        <input
          id="email"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the email of the employee"
        />

        <label htmlFor="phone">Employee Phone</label>

        <input
          id="phone"
          type="text"
          name="phone"
          value={phoneNumber}
          onChange={(e) => {
            const re = /^[0-9+\s]*$/;
            if (re.test(e.target.value)) {
              setPhoneNumber(e.target.value);
            }
          }}
          placeholder="Enter the phone number of the employee"
        />

        <label htmlFor="address">Employee Address</label>

        <input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter the address of the employee"
        />

        <Button
          loading={loading}
          className="slide-in-bottom mr-auto"
          title="Save information and create employee"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
