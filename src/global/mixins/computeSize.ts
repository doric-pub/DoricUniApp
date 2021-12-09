import { doricInterface } from '@/doric/interface'

export default {
  methods: {
    computeSize (): Promise<any> {
      return new Promise((resolve, reject) => {
        const id = (this as any).id
        doricInterface
          .createSelectorQuery()
          .in(this)
          .select('#' + id)
          .fields(
            {
              rect: true,
              size: true,
              computedStyle: [
                'margin-left',
                'margin-right',
                'margin-top',
                'margin-bottom',
                'padding-left',
                'padding-right',
                'padding-top',
                'padding-bottom',
              ],
            },
            result => {
              resolve(result)
            },
          )
          .exec()
      })
    },
  },
}
