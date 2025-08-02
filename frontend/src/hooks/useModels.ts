import { useQuery, useMutation, useQueryClient } from 'react-query'
import { modelService } from '../services/modelService'
import type { Model, ModelListQuery } from '../types'

// 模型列表Hook
export const useModels = (query: ModelListQuery = {}) => {
  return useQuery(
    ['models', query],
    () => modelService.getModels(query),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5分钟
    }
  )
}

// 模型详情Hook
export const useModel = (id: number) => {
  return useQuery(
    ['model', id],
    () => modelService.getModelById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10分钟
    }
  )
}

// 模型衍生版本Hook
export const useModelVariants = (id: number) => {
  return useQuery(
    ['modelVariants', id],
    () => modelService.getModelVariants(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    }
  )
}

// 用户收藏列表Hook
export const useFavorites = (query: ModelListQuery = {}) => {
  return useQuery<any, Error>(
    ['favorites', query],
    () => modelService.getFavorites(query),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000, // 2分钟
      retry: 1, // 只重试一次
      onError: (error) => {
        console.error('获取收藏列表失败:', error)
      }
    }
  )
}

// 用户购买记录Hook
export const usePurchased = (query: ModelListQuery = {}) => {
  return useQuery<any, Error>(
    ['purchased', query],
    () => modelService.getPurchased(query),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
      retry: 1, // 只重试一次
      onError: (error) => {
        console.error('获取购买记录失败:', error)
      }
    }
  )
}

// 模型操作Hooks
export const useModelActions = () => {
  const queryClient = useQueryClient()

  // 创建模型
  const createModelMutation = useMutation(modelService.createModel, {
    onSuccess: () => {
      queryClient.invalidateQueries('models')
    },
  })

  // 更新模型
  const updateModelMutation = useMutation(
    ({ id, data }: { id: number; data: Partial<Model> }) =>
      modelService.updateModel(id, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries('models')
        queryClient.invalidateQueries(['model', variables.id])
      },
    }
  )

  // 删除模型
  const deleteModelMutation = useMutation(modelService.deleteModel, {
    onSuccess: () => {
      queryClient.invalidateQueries('models')
    },
  })

  // 收藏模型
  const favoriteModelMutation = useMutation(
    ({ modelId, notes }: { modelId: number; notes?: string }) =>
      modelService.favoriteModel(modelId, notes),
    {
      onSuccess: (_, variables) => {
        // 立即刷新所有相关查询
        queryClient.invalidateQueries('favorites')
        queryClient.invalidateQueries('models')
        queryClient.invalidateQueries(['model', variables.modelId])
        console.log('收藏操作成功，已刷新数据')
      },
      onError: (error) => {
        console.error('收藏操作失败:', error)
      }
    }
  )

  // 取消收藏
  const unfavoriteModelMutation = useMutation(modelService.unfavoriteModel, {
    onSuccess: (_, modelId) => {
      // 立即刷新所有相关查询
      queryClient.invalidateQueries('favorites')
      queryClient.invalidateQueries('models')
      queryClient.invalidateQueries(['model', modelId])
      console.log('取消收藏操作成功，已刷新数据')
    },
    onError: (error) => {
      console.error('取消收藏操作失败:', error)
    }
  })

  // 标记为已购买
  const markAsPurchasedMutation = useMutation(
    ({
      modelId,
      purchaseData,
    }: {
      modelId: number
      purchaseData: {
        purchased_date?: string
        purchased_price?: number
        purchase_notes?: string
      }
    }) => modelService.markAsPurchased(modelId, purchaseData),
    {
      onSuccess: (_, variables) => {
        // 立即刷新所有相关查询
        queryClient.invalidateQueries('purchased')
        queryClient.invalidateQueries('models')
        queryClient.invalidateQueries(['model', variables.modelId])
        console.log('购买标记操作成功，已刷新数据')
      },
      onError: (error) => {
        console.error('购买标记操作失败:', error)
      }
    }
  )

  // 取消购买标记
  const unmarkAsPurchasedMutation = useMutation(
    modelService.unmarkAsPurchased,
    {
      onSuccess: (_, modelId) => {
        // 立即刷新所有相关查询
        queryClient.invalidateQueries('purchased')
        queryClient.invalidateQueries('models')
        queryClient.invalidateQueries(['model', modelId])
        console.log('取消购买标记操作成功，已刷新数据')
      },
      onError: (error) => {
        console.error('取消购买标记操作失败:', error)
      }
    }
  )

  return {
    createModel: createModelMutation.mutateAsync,
    updateModel: updateModelMutation.mutateAsync,
    deleteModel: deleteModelMutation.mutateAsync,
    favoriteModel: favoriteModelMutation.mutateAsync,
    unfavoriteModel: unfavoriteModelMutation.mutateAsync,
    markAsPurchased: markAsPurchasedMutation.mutateAsync,
    unmarkAsPurchased: unmarkAsPurchasedMutation.mutateAsync,
    
    // 加载状态
    isCreating: createModelMutation.isLoading,
    isUpdating: updateModelMutation.isLoading,
    isDeleting: deleteModelMutation.isLoading,
    isFavoriting: favoriteModelMutation.isLoading,
    isUnfavoriting: unfavoriteModelMutation.isLoading,
    isMarkingPurchased: markAsPurchasedMutation.isLoading,
    isUnmarkingPurchased: unmarkAsPurchasedMutation.isLoading,
    
    // 错误状态
    createError: createModelMutation.error,
    updateError: updateModelMutation.error,
    deleteError: deleteModelMutation.error,
    favoriteError: favoriteModelMutation.error,
    unfavoriteError: unfavoriteModelMutation.error,
    markPurchasedError: markAsPurchasedMutation.error,
    unmarkPurchasedError: unmarkAsPurchasedMutation.error,
  }
} 