import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeft, Save, X } from 'lucide-react'
import { modelService } from '../services/modelService'
import { manufacturerService } from '../services/manufacturerService'
import type { Manufacturer } from '../types'
import StarRating from '../components/StarRating'

const Container = styled.div`
  padding: 24px 48px;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 16px 24px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin: 0;
    flex: 1;
    text-align: center;
  }
  
  button {
    background: none;
    border: none;
    padding: 8px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--color-gray-600);
    
    &:hover {
      background: var(--color-gray-100);
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`

const Form = styled.form`
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
`

const FormGroup = styled.div`
  margin-bottom: 24px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--color-gray-700);
  }
  
  input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    transition: border-color var(--transition-fast);
    
    &:focus {
      border-color: var(--color-blue-500);
      outline: none;
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
`

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.$primary ? `
    background: var(--color-blue-500);
    color: white;
    
    &:hover {
      background: var(--color-blue-600);
    }
  ` : `
    background: var(--color-gray-100);
    color: var(--color-gray-700);
    
    &:hover {
      background: var(--color-gray-200);
    }
  `}
`

const ErrorMessage = styled.div`
  color: var(--color-red-500);
  font-size: 0.875rem;
  margin-top: 8px;
`

const RatingContainer = styled.div`
  padding: 8px 0;
`

const AddOption = styled.option`
  font-style: italic;
  color: var(--color-blue-500);
`

const AddModelPage: React.FC = () => {
  const navigate = useNavigate()
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    manufacturer_id: '',
    name: '',
    series: '',
    category: 'hg',
    status: '现货',
    release_date: '',
    rating: 0,
    notes: ''
  })
  const [showAddManufacturerInput, setShowAddManufacturerInput] = useState(false)
  const [newManufacturerName, setNewManufacturerName] = useState('')

  useEffect(() => {
    // 获取厂商列表
    const fetchManufacturers = async () => {
      try {
        const data = await manufacturerService.getManufacturers()
        setManufacturers(data)
        setLoading(false)
      } catch (err: any) {
        console.error('获取厂商列表失败:', err)
        setError('获取厂商列表失败: ' + (err.message || ''))
        setLoading(false)
      }
    }

    fetchManufacturers()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleManufacturerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'add-new') {
      setShowAddManufacturerInput(true)
    } else {
      setFormData(prev => ({
        ...prev,
        manufacturer_id: value
      }))
      setShowAddManufacturerInput(false)
    }
  }

  const handleAddManufacturer = async () => {
    if (!newManufacturerName.trim()) {
      setError('厂商名称不能为空')
      return
    }
    
    try {
      // 调用API创建新厂商
      const newManufacturer = await manufacturerService.createManufacturer(newManufacturerName)
      
      // 更新厂商列表
      setManufacturers(prev => [...prev, newManufacturer])
      
      // 设置为当前选中的厂商
      setFormData(prev => ({
        ...prev,
        manufacturer_id: String(newManufacturer.id)
      }))
      
      // 重置状态
      setShowAddManufacturerInput(false)
      setNewManufacturerName('')
      setError(null)
    } catch (err: any) {
      setError('创建厂商失败: ' + (err.message || ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // 如果正在添加新厂商，先完成添加
    if (showAddManufacturerInput) {
      await handleAddManufacturer()
      if (error) return // 如果添加失败，停止提交
    }
    
    try {
      // 准备提交数据
      const modelData: any = {
        manufacturer_id: parseInt(formData.manufacturer_id),
        name: formData.name,
        category: formData.category,
        status: formData.status
      }
      
      if (formData.series) modelData.series = formData.series
      if (formData.release_date) modelData.release_date = formData.release_date
      if (formData.rating) modelData.rating = formData.rating
      if (formData.notes) modelData.notes = formData.notes
      
      await modelService.createModel(modelData)
      navigate('/explore')
    } catch (err: any) {
      console.error('创建模型失败:', err)
      setError(err.message || '创建模型失败')
    }
  }

  if (loading) {
    return (
      <Container>
        <p>正在加载厂商数据...</p>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1>添加模型</h1>
        <div style={{ width: 36 }}></div> {/* 占位符，保持标题居中 */}
      </Header>
      
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormGroup>
          <label htmlFor="manufacturer_id">厂商 *</label>
          {showAddManufacturerInput ? (
            <div>
              <input
                type="text"
                value={newManufacturerName}
                onChange={(e) => setNewManufacturerName(e.target.value)}
                placeholder="输入新厂商名称"
                autoFocus
              />
              <ButtonGroup style={{ marginTop: '12px', justifyContent: 'flex-start' }}>
                <Button type="button" onClick={handleAddManufacturer} $primary>
                  添加厂商
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setShowAddManufacturerInput(false)
                    setNewManufacturerName('')
                  }}
                >
                  取消
                </Button>
              </ButtonGroup>
            </div>
          ) : (
            <select
              id="manufacturer_id"
              name="manufacturer_id"
              value={formData.manufacturer_id}
              onChange={handleManufacturerChange}
              required
            >
              <option value="">请选择厂商</option>
              {manufacturers.map(manufacturer => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
              <AddOption value="add-new">没有想要的厂商？添加一个吧</AddOption>
            </select>
          )}
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="name">模型名称 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="series">系列</label>
          <input
            type="text"
            id="series"
            name="series"
            value={formData.series}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <label htmlFor="category">分类</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="hg">HG</option>
              <option value="mg">MG</option>
              <option value="rg">RG</option>
              <option value="pg">PG</option>
            </select>
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="status">状态</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="现货">现货</option>
              <option value="预售">预售</option>
              <option value="下架">下架</option>
            </select>
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <label htmlFor="release_date">发售日期</label>
            <input
              type="date"
              id="release_date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="rating">评分</label>
            <RatingContainer>
              <StarRating 
                rating={formData.rating} 
                onRatingChange={handleRatingChange}
                editable={true}
              />
            </RatingContainer>
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <label htmlFor="notes">备注</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </FormGroup>
        
        <ButtonGroup>
          <Button type="button" onClick={() => navigate(-1)}>
            <X size={16} />
            取消
          </Button>
          <Button type="submit" $primary>
            <Save size={16} />
            保存
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  )
}

export default AddModelPage