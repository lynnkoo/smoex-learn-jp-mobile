export const accountApi = {
  getInfo: (params: any) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(111)
        // if (params.count % 3) {
        //   resolve(111)
        // } else {
        //   reject({ error: params.count })
        // }
      }, 1000)
    }),
}
