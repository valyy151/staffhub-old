import Input from "../ui/Input";

interface RolesDropdownProps {
  isOpen: boolean;
  role: { name: string; id: string };
  setIsOpen: (isOpen: boolean) => void;
  roles: { name: string; id: string }[];
  setOpenStaff?: (openStaff: boolean) => void;
  setRole: (role: { name: string; id: string }) => void;
}

export default function RolesDropdown({
  role,
  roles,
  isOpen,
  setRole,
  setIsOpen,
  setOpenStaff,
}: RolesDropdownProps) {
  function handleSelect(role: { name: string; id: string }) {
    setRole(role);
    setIsOpen(false);
  }
  return (
    <main className="relative w-full">
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setOpenStaff && setOpenStaff(false);
        }}
        className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-750 dark:shadow-slate-950 "
      >
        <Input
          readOnly
          type="text"
          value={role.name}
          placeholder={"Choose a Role..."}
          className="group m-0 h-14 cursor-pointer text-xl caret-transparent ring-offset-0 focus:ring-0 focus:ring-offset-0 dark:placeholder:text-slate-400"
        />
      </div>
      {isOpen && (
        <div
          className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-slate-700 dark:text-slate-300`}
        >
          <ul
            className={`${
              roles.length > 8 && "h-[28.5rem] overflow-y-scroll"
            } p-1`}
          >
            {roles.map((role) => (
              <li
                className="flex h-14 cursor-pointer items-center rounded-md px-4 py-2 text-xl hover:bg-gray-100 dark:hover:bg-slate-600"
                key={role.id}
                onClick={() => handleSelect(role)}
              >
                {role.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
