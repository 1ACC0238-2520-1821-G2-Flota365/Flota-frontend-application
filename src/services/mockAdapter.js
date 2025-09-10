import vehiclesData from '@/data/vehicles.json'
import driversData from '@/data/drivers.json'
import fleetsData from '@/data/fleets.json'
import statsData from '@/data/stats.json'

// Simular delay de red
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Generar ID único
const generateId = collection => {
  return Math.max(...collection.map(item => item.id), 0) + 1
}

// Adaptador para vehículos
const vehicleAdapter = {
  getAll: async () => {
    await delay(300)
    return { data: [...vehiclesData] }
  },
  getById: async (id) => {
    await delay(200)
    const vehicle = vehiclesData.find(v => v.id === parseInt(id))
    if (!vehicle) throw new Error('Vehículo no encontrado')
    return { data: { ...vehicle } }
  },
  create: async (data) => {
    await delay(500)
    const newVehicle = {
      ...data,
      id: generateId(vehiclesData)
    }
    vehiclesData.push(newVehicle)
    return { data: newVehicle }
  },
  update: async (id, data) => {
    await delay(400)
    const index = vehiclesData.findIndex(v => v.id === parseInt(id))
    if (index === -1) throw new Error('Vehículo no encontrado')
    
    const updatedVehicle = { ...vehiclesData[index], ...data }
    vehiclesData[index] = updatedVehicle
    return { data: updatedVehicle }
  },
  delete: async (id) => {
    await delay(300)
    const index = vehiclesData.findIndex(v => v.id === parseInt(id))
    if (index === -1) throw new Error('Vehículo no encontrado')
    
    vehiclesData.splice(index, 1)
    return { data: { success: true } }
  }
}

// Adaptador para conductores
const driverAdapter = {
  getAll: async () => {
    await delay(300)
    return { data: [...driversData] }
  },
  getById: async (id) => {
    await delay(200)
    const driver = driversData.find(d => d.id === parseInt(id))
    if (!driver) throw new Error('Conductor no encontrado')
    return { data: { ...driver } }
  },
  create: async (data) => {
    await delay(500)
    const newDriver = {
      ...data,
      id: generateId(driversData)
    }
    driversData.push(newDriver)
    return { data: newDriver }
  },
  update: async (id, data) => {
    await delay(400)
    const index = driversData.findIndex(d => d.id === parseInt(id))
    if (index === -1) throw new Error('Conductor no encontrado')
    
    const updatedDriver = { ...driversData[index], ...data }
    driversData[index] = updatedDriver
    return { data: updatedDriver }
  },
  delete: async (id) => {
    await delay(300)
    const index = driversData.findIndex(d => d.id === parseInt(id))
    if (index === -1) throw new Error('Conductor no encontrado')
    
    driversData.splice(index, 1)
    return { data: { success: true } }
  }
}

// Adaptador para flotas
const fleetAdapter = {
  getAll: async () => {
    await delay(300)
    return { data: [...fleetsData] }
  },
  getById: async (id) => {
    await delay(200)
    const fleet = fleetsData.find(f => f.id === parseInt(id))
    if (!fleet) throw new Error('Flota no encontrada')
    return { data: { ...fleet } }
  },
  getVehicles: async (id) => {
    await delay(300)
    const fleet = fleetsData.find(f => f.id === parseInt(id))
    if (!fleet) throw new Error('Flota no encontrada')
    
    // Filtrar vehículos por flota
    const fleetVehicles = vehiclesData.filter(v => v.fleet === fleet.name)
    return { data: fleetVehicles }
  },
  create: async (data) => {
    await delay(500)
    const newFleet = {
      ...data,
      id: generateId(fleetsData),
      vehicleCount: 0,
      performance: 100
    }
    fleetsData.push(newFleet)
    return { data: newFleet }
  },
  update: async (id, data) => {
    await delay(400)
    const index = fleetsData.findIndex(f => f.id === parseInt(id))
    if (index === -1) throw new Error('Flota no encontrada')
    
    const updatedFleet = { ...fleetsData[index], ...data }
    fleetsData[index] = updatedFleet
    return { data: updatedFleet }
  },
  delete: async (id) => {
    await delay(300)
    const index = fleetsData.findIndex(f => f.id === parseInt(id))
    if (index === -1) throw new Error('Flota no encontrada')
    
    fleetsData.splice(index, 1)
    return { data: { success: true } }
  },
  assignVehicles: async (id, { vehicleIds }) => {
    await delay(500)
    const fleet = fleetsData.find(f => f.id === parseInt(id))
    if (!fleet) throw new Error('Flota no encontrada')
    
    // Actualizar vehículos seleccionados
    for (const vehicleId of vehicleIds) {
      const vehicle = vehiclesData.find(v => v.id === parseInt(vehicleId))
      if (vehicle) {
        vehicle.fleet = fleet.name
      }
    }
    
    // Actualizar contador de vehículos de la flota
    const fleetIndex = fleetsData.findIndex(f => f.id === parseInt(id))
    if (fleetIndex !== -1) {
      fleetsData[fleetIndex].vehicleCount += vehicleIds.length
    }
    
    return { data: { success: true, count: vehicleIds.length } }
  }
}

// Adaptador para reportes
const reportAdapter = {
  generate: async (params) => {
    await delay(800)
    // Simular generación de reporte
    const newReport = {
      id: generateId(statsData.reports),
      name: `Reporte_${params.type}_${new Date().toISOString().split('T')[0]}.${params.format}`,
      type: {
        performance: 'Rendimiento de flota',
        fuel: 'Consumo de combustible',
        maintenance: 'Mantenimiento',
        drivers: 'Desempeño de conductores',
        custom: 'Reporte personalizado'
      }[params.type],
      date: new Date().toLocaleString(),
      author: 'Juan Supervisor'
    }
    
    statsData.reports.push(newReport)
    return { data: newReport }
  },
  getAll: async () => {
    await delay(300)
    return { data: [...statsData.reports] }
  },
  getById: async (id) => {
    await delay(200)
    const report = statsData.reports.find(r => r.id === parseInt(id))
    if (!report) throw new Error('Reporte no encontrado')
    return { data: { ...report } }
  },
  delete: async (id) => {
    await delay(300)
    const index = statsData.reports.findIndex(r => r.id === parseInt(id))
    if (index === -1) throw new Error('Reporte no encontrado')
    
    statsData.reports.splice(index, 1)
    return { data: { success: true } }
  }
}

// Adaptador para monitoreo
const monitoringAdapter = {
  getActiveVehicles: async () => {
    await delay(300)
    // Simular pequeñas variaciones en la ubicación y velocidad
    const updatedVehicles = statsData.monitoring.vehicles.map(vehicle => {
      // Solo actualizar vehículos activos
      if (vehicle.status === 'active' || vehicle.status === 'warning') {
        return {
          ...vehicle,
          speed: Math.max(0, Math.min(120, vehicle.speed + (Math.random() * 10 - 5))),
          location: {
            lat: vehicle.location.lat + (Math.random() * 0.005 - 0.0025),
            lng: vehicle.location.lng + (Math.random() * 0.005 - 0.0025)
          }
        }
      }
      return { ...vehicle }
    })
    
    return { data: updatedVehicles }
  },
  getVehicleLocation: async (id) => {
    await delay(200)
    const vehicle = statsData.monitoring.vehicles.find(v => v.id === parseInt(id))
    if (!vehicle) throw new Error('Vehículo no encontrado en monitoreo')
    
    // Simular pequeña variación en la ubicación
    const updatedLocation = {
      lat: vehicle.location.lat + (Math.random() * 0.002 - 0.001),
      lng: vehicle.location.lng + (Math.random() * 0.002 - 0.001)
    }
    
    return { data: updatedLocation }
  },
  getAlerts: async () => {
    await delay(300)
    return { data: [...statsData.monitoring.alerts] }
  }
}

// Adaptador para analytics
const analyticsAdapter = {
  runAnalysis: async (_params) => {
    await delay(3000)
    // Simular resultados del análisis
    const results = {
      vehicles: [
        { model: 'Toyota Hilux', plate: 'ABC-123', probability: 87, system: 'Sistema de frenos' },
        { model: 'Ford Ranger', plate: 'XYZ-789', probability: 92, system: 'Sistema de transmisión' },
        { model: 'Nissan Frontier', plate: 'GHI-789', probability: 78, system: 'Sistema eléctrico' },
        { model: 'Toyota Hilux', plate: 'JKL-012', probability: 81, system: 'Sistema de suspensión' }
      ],
      recommendations: [
        'Programar mantenimiento preventivo para los 4 vehículos identificados',
        'Revisar historial de mantenimiento de la flota Ford Ranger (alta incidencia de problemas de transmisión)',
        'Implementar ciclo de inspección más frecuente para el sistema eléctrico de vehículos Nissan Frontier',
        'Actualizar programa de mantenimiento preventivo de los sistemas de suspensión'
      ]
    }
    
      return { data: results }
  },
  getPredictions: async () => {
    await delay(300)
    // Simular predicciones
    const predictions = {
      failureProbability: [
        { vehicle: 'ABC-123', probability: 0.87, system: 'frenos', timeFrame: 30 },
        { vehicle: 'XYZ-789', probability: 0.92, system: 'transmisión', timeFrame: 15 },
        { vehicle: 'GHI-789', probability: 0.78, system: 'eléctrico', timeFrame: 45 },
        { vehicle: 'JKL-012', probability: 0.81, system: 'suspensión', timeFrame: 30 }
      ]
    }
    
    return { data: predictions }
  },
  getRecentAnalyses: async () => {
    await delay(300)
    return { data: statsData.analytics.recent_analyses }
  }
}

// Adaptador para autenticación
const authAdapter = {
  login: async (credentials) => {
    await delay(800)
    
    // Simular autenticación básica
    if (credentials.email && credentials.password) {
      const token = `mock-token-${Date.now()}`
      const user = {
        id: 1,
        name: 'Juan Supervisor',
        role: 'Administrador',
        email: credentials.email
      }
      
      return { data: { user, token } }
    } else {
      throw new Error('Credenciales inválidas')
    }
  },
  logout: async () => {
    await delay(300)
    return { data: { success: true } }
  },
  getProfile: async () => {
    await delay(200)
    const user = {
      id: 1,
      name: 'Juan Supervisor',
      role: 'Administrador',
      email: 'juan@flota365.com'
    }
    
    return { data: user }
  }
}

export {
  vehicleAdapter,
  driverAdapter,
  fleetAdapter,
  reportAdapter,
  monitoringAdapter,
  analyticsAdapter,
  authAdapter
}