export const accountApi = {
  getInfo: (params: any) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (params.count % 3) {
          resolve(params.count)
        } else {
          reject({ error: params.count })
        }
      }, 1000)
    }),
}
