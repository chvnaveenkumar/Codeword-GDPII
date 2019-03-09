module.exports = {
    title: 'Codeword Documentation',
    description: 'Write Description',
    themeConfig: {
        sidebar: [
          {
            title: 'Installation Steps',
            collapsable: true,
            children: [
              '/installation',
              '/test'
            ]
          },
          {
            title: 'Technologies Used',
            collapsable: true,
            children: [ 
              '/ Vue.js',
              '/ Node.js',
              '/ MongoDB',
              '/ Heroku'
            ]
          }
        ]
      }
  }