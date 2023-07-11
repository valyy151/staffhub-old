import axios from 'axios'
import { Trash2 } from 'lucide-react'
import Modal from '../../ui/Modal.tsx'
import Button from '../../ui/Button.tsx'
import { Logout } from '../../../Auth.tsx'
import Paragraph from '../../ui/Paragraph.tsx'
import { formatDate, formatDateLong } from '../../../utils/DateFormatting.ts'
import { FC, useState, SetStateAction, Dispatch, useEffect } from 'react'

interface VacationProps {
	index: number
	loading: boolean
	employee: Employee
	vacation: { start: number; end: number }
	setAmount: Dispatch<SetStateAction<number>>
	setLoading: Dispatch<SetStateAction<boolean>>
	setError: Dispatch<SetStateAction<string | null>>
	setMessage: Dispatch<SetStateAction<string | null>>
}

interface Employee {
	_id: string
	vacations: [{ start: number | string; end: number | string }]
}

const Vacation: FC<VacationProps> = ({
	vacation: v,
	index,
	employee,
	loading,
	setError,
	setLoading,
	setMessage,
	setAmount,
}) => {
	const [end, setEnd] = useState<number | string>(v.end)
	const [showModal, setShowModal] = useState<boolean>(false)
	const [start, setStart] = useState<number | string>(v.start)
	const [vacationIndex, setVacationIndex] = useState<number | null>(null)
	const [vacation, setVacation] = useState<{ start: number | string; end: number | string }>(v)

	useEffect(() => {
		setVacation({ start: start, end: end })
	}, [start, end])

	const deleteVacation = async (index: number | null) => {
		try {
			setLoading(true)
			const token = localStorage.getItem('token')
			const { data } = await axios.delete(
				`${import.meta.env.VITE_BASE_URL}/employees/vacation/?employeeId=${employee?._id}&index=${index}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			setMessage(data.message)
			setAmount((prev) => prev + data.totalDays)
		} catch (error: any) {
			setError(error.response.data.message)
			if (error.response.status === 401) {
				Logout()
			}
		} finally {
			setLoading(false)
			setShowModal(false)
		}
	}

	return (
		<div className='my-1 flex w-full items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700'>
			<div className='flex items-center space-x-6'>
				<Paragraph
					size={'xl'}
					className='w-[36rem] min-w-[16rem] rounded-md bg-white px-2 py-2 text-left dark:bg-slate-700'
					key={employee?._id}>
					From <span className='font-bold'>{formatDateLong(Number(vacation.start) / 1000)}. </span> untill{' '}
					<span className='font-bold'>{formatDateLong(Number(vacation.end) / 1000)}.</span>
				</Paragraph>

				<Button
					size={'sm'}
					variant={'link'}
					className='w-16 min-w-0 rounded-full p-5 text-red-500 hover:bg-slate-200 dark:text-red-400'
					onClick={() => {
						setShowModal(true)
						setVacationIndex(index)
					}}
					title='Delete vacation'>
					{<Trash2 />}
				</Button>

				{showModal && (
					<Modal
						loading={loading}
						showModal={showModal}
						text={'Delete vacation?'}
						cancel={() => setShowModal(false)}
						submit={() => deleteVacation(vacationIndex)}
					/>
				)}
			</div>
		</div>
	)
}

export default Vacation
