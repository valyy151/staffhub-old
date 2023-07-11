import axios from 'axios'
import Vacation from './Vacation.tsx'
import Input from '../../ui/Input.tsx'
import Dropdown from '../Dropdown.tsx'
import Button from '../../ui/Button.tsx'
import Heading from '../../ui/Heading.tsx'
import { Logout } from '../../../Auth.tsx'
import Container from '../../ui/Container.tsx'
import VacationPlanner from './VacationPlanner.tsx'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Check, FileDigit, MoreVertical, Palmtree, X } from 'lucide-react'

interface VacationListProps {
	loading: boolean
	employee: Employee
	showDropdown: boolean
	setLoading: Dispatch<SetStateAction<boolean>>
	setError: Dispatch<SetStateAction<string | null>>
	setShowDropdown: Dispatch<SetStateAction<boolean>>
	setMessage: Dispatch<SetStateAction<string | null>>
}

interface Employee {
	_id: string
	name: string
	email: string
	phone: string
	notes: string[]
	vacationDays: number
	shiftPreferences: string[]
	vacations: [{ start: number; end: number }]
}

const VacationList: FC<VacationListProps> = ({
	loading,
	setLoading,
	employee,
	setMessage,
	setError,
	showDropdown,
	setShowDropdown,
}) => {
	const [showModal, setShowModal] = useState<boolean>(false)
	const [daysPlanned, setDaysPlanned] = useState<number>(0)
	const [showPlanner, setShowPlanner] = useState<boolean>(false)
	const [amount, setAmount] = useState<number>(employee.vacationDays)
	const [showChangeAmount, setShowChangeAmount] = useState<boolean>(false)
	const [daysRemaining, setDaysRemaining] = useState(employee.vacationDays)

	const updateAmount = async (e: React.FormEvent) => {
		e.preventDefault()

		if (employee.vacationDays === amount) {
			return setShowChangeAmount(false)
		}

		setLoading(true)
		try {
			const token = localStorage.getItem('token')
			const { data } = await axios.put(
				`${import.meta.env.VITE_BASE_URL}/employees/employees/vacation`,
				{
					employeeId: employee._id,
					amount: amount,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)

			setMessage(data.message)
			setShowChangeAmount(false)
		} catch (error: any) {
			setError(error.data.response.message)
			if (error.response.status === 401) {
				Logout()
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container
			size={'lg'}
			className='pt-20'>
			<div className='relative ml-auto flex'>
				<Button
					className='ml-auto min-w-0 rounded-full hover:bg-slate-50 dark:hover:bg-slate-600'
					variant={'link'}
					onClick={() => setShowDropdown(!showDropdown)}>
					<MoreVertical size={24} />
				</Button>
				{showDropdown && (
					<Dropdown
						employee={employee}
						setShowModal={setShowModal}
						setShowDropdown={setShowDropdown}
					/>
				)}
			</div>
			<div className='flex w-full items-center justify-center space-x-8 border-b-2 border-slate-300 pb-4 dark:border-slate-600'>
				<Heading size={'sm'}>
					{employee.name} - Vacation days remaining: {daysRemaining <= employee.vacationDays ? daysRemaining : 0}
				</Heading>

				<div className='space-x-2'>
					{showPlanner ? (
						<Button
							size={'sm'}
							variant={'outline'}
							className='w-36'
							onClick={() => {
								setShowPlanner(false)
								setDaysRemaining(employee.vacationDays)
							}}>
							Cancel <X className='ml-2' />
						</Button>
					) : (
						<Button
							className='w-36'
							size={'sm'}
							title='Create a new vacation'
							onClick={() => {
								setShowPlanner(true)
								setShowChangeAmount(false)
							}}>
							New Vacation <Palmtree className='ml-2' />
						</Button>
					)}
					{showChangeAmount ? (
						<Button
							className='w-56'
							size={'sm'}
							variant={'outline'}
							onClick={() => setShowChangeAmount(false)}>
							Cancel
							<X className='ml-2' />
						</Button>
					) : (
						<Button
							className='w-56'
							size={'sm'}
							variant={'outline'}
							title='Change the amount of vacation days'
							onClick={() => {
								setShowChangeAmount(true)
								setShowPlanner(false)
							}}>
							Change number of days
							<FileDigit className='ml-2' />
						</Button>
					)}
				</div>
			</div>

			{showChangeAmount && (
				<>
					<Heading
						size={'xs'}
						className='slide-in-bottom mb-3 mt-32'>
						Change the amount of vacation days
					</Heading>
					<form
						onSubmit={updateAmount}
						className=' flex w-full items-center justify-center pb-3 dark:border-slate-700'>
						<Input
							type='text'
							size={'lg'}
							value={amount}
							className='slide-in-bottom m-0 w-[36rem] text-center text-2xl font-bold shadow-md '
							onChange={(e) => setAmount(Number(e.target.value))}
						/>
						<Button
							size={'sm'}
							variant={'link'}
							className='slide-in-bottom w-20 min-w-0 '>
							<Check size={36} />
						</Button>
					</form>
				</>
			)}
			{showPlanner && (
				<>
					{' '}
					<Heading
						size={'xs'}
						className='slide-in-bottom mt-12 font-normal'>
						Days planned: {daysPlanned > 0 ? daysPlanned : 0}
					</Heading>
					<VacationPlanner
						loading={loading}
						employee={employee}
						setError={setError}
						setAmount={setAmount}
						setMessage={setMessage}
						setLoading={setLoading}
						daysPlanned={daysPlanned}
						daysRemaining={daysRemaining}
						setDaysPlanned={setDaysPlanned}
						setShowPlanner={setShowPlanner}
						setDaysRemaining={setDaysRemaining}
					/>
				</>
			)}

			{!showChangeAmount && !showPlanner && employee.vacations.length > 0 ? (
				<div className='slide-in-bottom'>
					<Heading
						size={'xs'}
						className='mb-3 mt-32 text-center'>
						Vacations
					</Heading>
					{employee.vacations.map((vacation, index) => (
						<Vacation
							key={index}
							index={index}
							loading={loading}
							vacation={vacation}
							employee={employee}
							setError={setError}
							setAmount={setAmount}
							setLoading={setLoading}
							setMessage={setMessage}
						/>
					))}
				</div>
			) : (
				!showChangeAmount &&
				!showPlanner && (
					<Heading
						className='slide-in-bottom mt-16'
						size={'xs'}>
						This employee has no planned vacations.
					</Heading>
				)
			)}
		</Container>
	)
}

export default VacationList
