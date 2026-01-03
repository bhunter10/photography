import { CollectionConfig } from 'payload'

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'collection', 'date', 'published', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        published: {
          equals: true,
        },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'collection',
      type: 'relationship',
      relationTo: 'collections',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'photos',
      admin: {
        description: 'Cover image for this gallery',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'photos',
      type: 'array',
      minRows: 0,
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'photos',
          required: true,
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Order for displaying photos (drag to reorder in admin)',
          },
        },
      ],
      // RowLabel component removed - can be re-added when admin UI is fixed
      // admin: {
      //   components: {
      //     RowLabel: ({ data, index }: { data: any; index: number }) => {
      //       return data?.photo?.filename || `Photo ${String(index).padStart(2, '0')}`
      //     },
      //   },
      // },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Only published galleries are visible on the public site',
      },
    },
  ],
}

