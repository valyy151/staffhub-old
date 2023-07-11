import axios from 'axios'
import { Check, X } from 'lucide-react'
import Button from '../../ui/Button.tsx'
import 'react-calendar/dist/Calendar.css'
import { Calendar } from 'react-calendar'
import { Logout } from '../../../Auth.tsx'
import Heading from '../../ui/Heading.tsx'
import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react'

interface VacationPlannerProps {
	loading: boolean
	employee: Employee
	daysPlanned: number
	daysRemaining: number
	setAmount: Dispatch<SetStateAction<number>>
	setLoading: Dispatch<SetStateAction<boolean>>
	setDaysPlanned: Dispatch<SetStateAction<number>>
	setShowPlanner: Dispatch<SetStateAction<boolean>>
	setError: Dispatch<SetStateAction<string | null>>
	setDaysRemaining: Dispatch<SetStateAction<number>>
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
}

const VacationPlanner: FC<VacationPlannerProps> = ({
	loading,
	setLoading,
	employee,
	setMessage,
	setError,
	setShowPlanner,
	setAmount,
	daysPlanned,
	setDaysPlanned,
	daysRemaining,
	setDaysRemaining,
}) => {
	const [end, setEnd] = useState(new Date())
	const [start, setStart] = useState(new Date())

	const calculateTotalDays = () => {
		const millisecondsPerDay = 24 * 60 * 60 * 1000
		let totalDays = Math.ceil((end.getTime() - start.getTime()) / millisecondsPerDay) + 1
		if (totalDays > 0 && daysRemaining <= employee.vacationDays) {
			setDaysPlanned(totalDays)
			setDaysRemaining(employee.vacationDays - totalDays)
		} else {
			setDaysPlanned(0)
			setDaysRemaining(employee.vacationDays)
		}
	}

	useEffect(() => {
		calculateTotalDays()
	}, [start, end])

	const handleStartChange: any = (date: Date) => {
		const newStart = date
		const millisecondsPerDay = 24 * 60 * 60 * 1000
		const newTotalDays = Math.ceil((end.getTime() - newStart.getTime()) / millisecondsPerDay) + 1

		if (employee.vacationDays - newTotalDays < 0) {
			return setError("You can't plan that many days.")
		}

		setStart(newStart)

		if (newTotalDays > 0 && daysRemaining < employee.vacationDays) {
			setDaysPlanned(newTotalDays)
			setDaysRemaining(employee.vacationDays - newTotalDays)
		}
	}

	const handleEndChange: any = (date: Date) => {
		const newEnd = date
		const millisecondsPerDay = 24 * 60 * 60 * 1000
		const newTotalDays = Math.ceil((newEnd.getTime() - start.getTime()) / millisecondsPerDay) + 1

		if (newEnd < start) {
			return setError('End date must be after start date.')
		}

		if (employee.vacationDays - newTotalDays < 0) {
			return setError("You can't plan that many days.")
		}

		setEnd(newEnd)

		if (newTotalDays > 0 && daysRemaining < employee.vacationDays) {
			setDaysPlanned(newTotalDays)
			setDaysRemaining(employee.vacationDays - newTotalDays)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		try {
			const token = localStorage.getItem('token')
			const { data } = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/employees/vacation`,
				{
					employeeId: employee._id,
					start: start.getTime(),
					end: end.getTime(),
					daysRemaining: daysRemaining,
					daysPlanned: daysPlanned,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			setEnd(new Date())
			setStart(new Date())
			setShowPlanner(false)
			setAmount(daysRemaining)
			setMessage(data.message)
		} catch (error: any) {
			setError(error.response.data.message)
			if (error.response.status === 401) {
				Logout()
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className='slide-in-bottom mt-6 flex h-96 space-x-24'>
				<div>
					<Heading
						className='mb-2 text-center font-normal'
						size={'sm'}>
						Start: {start.toLocaleDateString('en-GB')}
					</Heading>
					<Calendar
						value={start}
						onChange={handleStartChange}
					/>
				</div>
				<div>
					<Heading
						className='mb-2 text-center font-normal'
						size={'sm'}>
						End: {end.toLocaleDateString('en-GB')}
					</Heading>
					<Calendar
						value={end}
						onChange={handleEndChange}
					/>
				</div>
			</div>

			<form
				onSubmit={handleSubmit}
				className='flex space-x-2'>
				<Button
					size={'sm'}
					title='Create vacation'
					loading={loading}
					className='slide-in-bottom w-36'>
					Submit <Check className='ml-2' />
				</Button>
			</form>
		</>
	)
}

export default VacationPlanner
