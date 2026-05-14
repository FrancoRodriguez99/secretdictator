function RoleReveal({ socket, gameId, myRole }) {
  if (!myRole) return <div>Loading your role...</div>

  const { role, party, fascistNames } = myRole

  return (
    <div>
      <h2>Your Role</h2>
      <h1>{role}</h1>
      <p>Party: {party}</p>

      {role === 'FASCIST' && fascistNames?.length > 0 && (
        <p>Fellow fascists: {fascistNames.join(', ')}</p>
      )}

      {role === 'HITLER' && (
        <p>You are Hitler. You do not know who the fascists are.</p>
      )}

      <button onClick={() => socket?.emit('role_confirmed', { gameId })}>
        I understand my role
      </button>
    </div>
  )
}

export default RoleReveal
