import useStore from '../store/useStore'

export default function Onboarding() {
  const { userId } = useStore()

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Onboarding</h2>
      <p className="mt-4">Current Participant ID: <strong>{userId}</strong></p>
    </div>
  )
}
