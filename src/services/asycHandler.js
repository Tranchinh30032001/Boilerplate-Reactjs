import axiosInstance from '../configs/axios'

export const getHandler = async (endpoint) => {
  try {
    const res = await axiosInstance.get(endpoint)
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const postHandler = async (endpoint, body) => {
  try {
    const res = await axiosInstance.post(endpoint, body)
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}
