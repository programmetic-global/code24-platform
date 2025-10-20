// Elite Workers API Integration
// Connects React frontend to our deployed Elite Workers

const ELITE_WORKERS_API = process.env.ELITE_WORKERS_API || 'https://staging.code24.dev/elite'

export interface BrandAnalysisRequest {
  url: string
  companyName: string
  industry?: string
  targetAudience?: string
}

export interface BrandAnalysisResponse {
  brandStrength: number
  visualIdentity: number
  marketDifferentiation: number
  brandConsistency: number
  recommendations: string[]
  strengths: string[]
  weaknesses: string[]
}

export interface DesignCreationRequest {
  businessType: string
  industry: string
  targetAudience: string
  primaryGoal: 'sales' | 'leads' | 'signups' | 'bookings' | 'traffic'
  style?: 'modern' | 'minimalist' | 'bold' | 'elegant' | 'playful'
  colors?: string[]
}

export interface DesignCreationResponse {
  designSystem: {
    colors: {
      primary: string
      secondary: string
      accent: string
      neutral: string[]
    }
    typography: {
      headings: string
      body: string
      mono: string
    }
    spacing: number[]
    borderRadius: number[]
  }
  components: Array<{
    type: string
    html: string
    css: string
    description: string
  }>
  modernityScore: number
  conversionOptimization: string[]
}

export interface CodeAnalysisRequest {
  codebase: string
  language: string
  analysisType?: 'performance' | 'security' | 'maintainability' | 'all'
}

export interface CodeAnalysisResponse {
  codeQuality: number
  performance: number
  security: number
  scalability: number
  maintainability: number
  recommendations: Array<{
    category: string
    priority: 'high' | 'medium' | 'low'
    description: string
    implementation: string
  }>
  technicalDebt: {
    score: number
    issues: string[]
  }
}

class EliteWorkersAPI {
  private baseUrl: string

  constructor(baseUrl: string = ELITE_WORKERS_API) {
    this.baseUrl = baseUrl
  }

  // Brand Worker Methods
  async analyzeBrand(request: BrandAnalysisRequest): Promise<BrandAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/brand/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Brand analysis failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Brand Worker error:', error)
      throw error
    }
  }

  async createBrandIdentity(request: Omit<BrandAnalysisRequest, 'url'>): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/brand/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Brand creation failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Brand Worker error:', error)
      throw error
    }
  }

  // Designer Worker Methods
  async createDesign(request: DesignCreationRequest): Promise<DesignCreationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/design/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Design creation failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Designer Worker error:', error)
      throw error
    }
  }

  async analyzeDesign(url: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/design/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error(`Design analysis failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Designer Worker error:', error)
      throw error
    }
  }

  async getDesignTrends(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/design/trends`)

      if (!response.ok) {
        throw new Error(`Design trends failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Designer Worker error:', error)
      throw error
    }
  }

  // Developer Worker Methods
  async analyzeCode(request: CodeAnalysisRequest): Promise<CodeAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/develop/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Code analysis failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Developer Worker error:', error)
      throw error
    }
  }

  async createProject(request: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/develop/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Project creation failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Developer Worker error:', error)
      throw error
    }
  }

  async optimizeCode(request: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/develop/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Code optimization failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Developer Worker error:', error)
      throw error
    }
  }

  // Health Check Methods
  async checkBrandWorker(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/brand/`)
      return response.ok
    } catch {
      return false
    }
  }

  async checkDesignWorker(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/design/`)
      return response.ok
    } catch {
      return false
    }
  }

  async checkDeveloperWorker(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/develop/`)
      return response.ok
    } catch {
      return false
    }
  }

  async checkAllWorkers(): Promise<{
    brand: boolean
    design: boolean
    develop: boolean
  }> {
    const [brand, design, develop] = await Promise.all([
      this.checkBrandWorker(),
      this.checkDesignWorker(),
      this.checkDeveloperWorker(),
    ])

    return { brand, design, develop }
  }
}

// Export singleton instance
export const eliteWorkersAPI = new EliteWorkersAPI()

// Export class for custom instances
export { EliteWorkersAPI }

// Utility functions
export const getWorkerStatus = async () => {
  return await eliteWorkersAPI.checkAllWorkers()
}

export const runLiveDemo = async (demoType: 'brand' | 'design' | 'develop') => {
  switch (demoType) {
    case 'brand':
      return await eliteWorkersAPI.analyzeBrand({
        url: 'https://staging.code24.dev',
        companyName: 'Code24',
        industry: 'technology',
        targetAudience: 'developers'
      })
    
    case 'design':
      return await eliteWorkersAPI.createDesign({
        businessType: 'saas',
        industry: 'technology',
        targetAudience: 'developers',
        primaryGoal: 'signups',
        style: 'modern'
      })
    
    case 'develop':
      return await eliteWorkersAPI.analyzeCode({
        codebase: 'staging.code24.dev',
        language: 'typescript',
        analysisType: 'all'
      })
    
    default:
      throw new Error('Invalid demo type')
  }
}