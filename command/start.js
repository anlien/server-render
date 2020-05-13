const buildClient = require('./buildClient').default;
const { runBuildServer } = require('./buildServer')
// buildClient().then(()=>{
    runBuildServer();
    console.log('编译 server');
// })