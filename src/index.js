import '@babel/polyfill/noConflict'
import server from './graphqlServer'
import multer from 'multer'
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'images/rice')
//       },
//       filename: function (req, file, cb) {
//         cb(null, file.fieldname + '.jpg')
//       }
// })
const upload = multer({
    dest: "client/public/img",
    limits: {
        fileSize: 5000000
    },
    // fileFilter(req, file, cb) {
    //     if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //         return cb(new Error('Please upload an image.'))
    //     }
    //     cd(undefined, true)
    // },

})

server.express.post('/checkout/rice', upload.single('rice'), async (req,res) => {
    console.log(req)
    res.send()
})
server.express.post('/checkout/greens', upload.single('greens'), async (req,res) => {
    res.send()
})
server.express.post('/checkout/melonFruit', upload.single('melonFruit'), async (req,res) => {
    res.send()
})
server.express.get('/test/test', async (req,res) => {
    res.send("test")
})

server.start({port: process.env.PORT || 4000}, () => {
    console.log('The server is up.')
})

