import React, { useState } from 'react'
import styled from 'styled-components'
import { X, Plus } from 'lucide-react'

interface CreateManufacturerModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string) => Promise<void>
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    padding: 4px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--color-gray-500);
    
    &:hover {
      background: var(--color-gray-100);
    }
  }
`

const FormGroup = styled.div`
  margin-bottom: 24px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--color-gray-700);
  }
  
  input {
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
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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

const CreateManufacturerModal: React.FC<CreateManufacturerModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate 
}) => {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!name.trim()) {
      setError('厂商名称不能为空')
      return
    }
    
    try {
      setLoading(true)
      await onCreate(name)
      setName('')
      onClose()
    } catch (err: any) {
      setError(err.message || '创建厂商失败')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>创建新厂商</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </ModalHeader>
        
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <label htmlFor="manufacturer-name">厂商名称 *</label>
            <input
              id="manufacturer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </FormGroup>
          
          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" $primary disabled={loading}>
              <Plus size={16} />
              创建
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  )
}

export default CreateManufacturerModal