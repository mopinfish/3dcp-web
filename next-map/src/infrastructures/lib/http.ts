export async function request<T>(url: string, method: string, data?: unknown): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(`${url}`, options)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.json()
}

export async function get<T>(url: string): Promise<T> {
  return request<T>(url, 'GET')
}

export async function post<T>(url: string, data: unknown): Promise<T> {
  return request<T>(url, 'POST', data)
}

export async function put<T>(url: string, data: unknown): Promise<T> {
  return request<T>(url, 'PUT', data)
}

export async function del<T>(url: string): Promise<T> {
  return request<T>(url, 'DELETE')
}
