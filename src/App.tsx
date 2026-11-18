import { useState, useMemo } from 'react'
import { Room, COMMON_DEVICES, calculateElectrical } from './utils/electrical'

function App() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', name: 'Phòng khách', devices: [] }
  ])

  const addRoom = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    setRooms([...rooms, { id: newId, name: `Phòng mới ${rooms.length + 1}`, devices: [] }])
  }

  const removeRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id))
  }

  const updateRoomName = (id: string, name: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, name } : r))
  }

  const addDevice = (roomId: string, deviceId: string) => {
    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        const existing = r.devices.find(d => d.deviceId === deviceId)
        if (existing) {
          return {
            ...r,
            devices: r.devices.map(d => d.deviceId === deviceId ? { ...d, quantity: d.quantity + 1 } : d)
          }
        }
        return { ...r, devices: [...r.devices, { deviceId, quantity: 1 }] }
      }
      return r
    }))
  }

  const updateQuantity = (roomId: string, deviceId: string, delta: number) => {
    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          devices: r.devices.map(d => {
            if (d.deviceId === deviceId) {
              const newQty = Math.max(0, d.quantity + delta)
              return { ...d, quantity: newQty }
            }
            return d
          }).filter(d => d.quantity > 0)
        }
      }
      return r
    }))
  }

  const result = useMemo(() => calculateElectrical(rooms), [rooms])

  return (
    <div className="container">
      <header className="header">
        <h1>Thiết Kế Điện Dân Dụng</h1>
        <p>Tính toán công suất, dây dẫn và aptomat chuyên nghiệp</p>
      </header>

      <main>
        <div className="grid">
          {rooms.map(room => (
            <div key={room.id} className="card glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => updateRoomName(room.id, e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    fontFamily: 'Outfit',
                    width: '70%'
                  }}
                />
                <button onClick={() => removeRoom(room.id)} className="button button-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                  Xóa
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                {room.devices.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chưa có thiết bị nào</p>}
                {room.devices.map(d => {
                  const deviceData = COMMON_DEVICES.find(cd => cd.id === d.deviceId)
                  return (
                    <div key={d.deviceId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                      <span>{deviceData?.icon} {deviceData?.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => updateQuantity(room.id, d.deviceId, -1)} className="button-outline" style={{ borderRadius: '4px', width: '24px' }}>-</button>
                        <span>{d.quantity}</span>
                        <button onClick={() => updateQuantity(room.id, d.deviceId, 1)} className="button-outline" style={{ borderRadius: '4px', width: '24px' }}>+</button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {COMMON_DEVICES.slice(0, 6).map(device => (
                  <button
                    key={device.id}
                    onClick={() => addDevice(room.id, device.id)}
                    className="button button-outline"
                    style={{ fontSize: '0.7rem', padding: '0.4rem 0.6rem' }}
                    title={device.name}
                  >
                    + {device.icon}
                  </button>
                ))}
                <select
                  onChange={(e) => {
                    if (e.target.value) addDevice(room.id, e.target.value)
                    e.target.value = ''
                  }}
                  className="button button-outline"
                  style={{ fontSize: '0.7rem', padding: '0.4rem 0.6rem', color: 'var(--text-secondary)' }}
                >
                  <option value="">Thêm khác...</option>
                  {COMMON_DEVICES.slice(6).map(device => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <div
            onClick={addRoom}
            className="card glass"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderStyle: 'dashed',
              cursor: 'pointer',
              minHeight: '200px'
            }}
          >
            <span style={{ fontSize: '3rem', color: 'var(--text-secondary)' }}>+</span>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Thêm phòng mới</p>
          </div>
        </div>

        <div className="results-panel glass">
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Kết Quả Tính Toán</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div className="result-stat">
              <span className="stat-label">Tổng Công Suất</span>
              <span className="stat-value">{(result.totalPower / 1000).toFixed(2)} kW</span>
            </div>
            <div className="result-stat">
              <span className="stat-label">Dòng Điện Tải</span>
              <span className="stat-value">{result.current.toFixed(1)} A</span>
            </div>
            <div className="result-stat">
              <span className="stat-label">Aptomat (MCB)</span>
              <span className="stat-value">{result.recommendedMCB} A</span>
            </div>
            <div className="result-stat">
              <span className="stat-label">Kích Thước Dây</span>
              <span className="stat-value">{result.recommendedWireSize} mm²</span>
            </div>
          </div>
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px', border: '1px solid var(--accent-glow)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong>Lưu ý:</strong> Kết quả trên dựa trên tiêu chuẩn lắp đặt dây dẫn Cu/PVC trong ống ghen.
              Vui lòng tham khảo kỹ sư điện để được tư vấn chính xác nhất cho công trình thực thực tế.
            </p>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)', padding: '2rem' }}>
        <p>&copy; 2024 Electrical Design Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
