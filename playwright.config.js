import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  webServer: {
    command: 'node -e "const h=require(\'http\'),fs=require(\'fs\'),p=require(\'path\');const types={\'.html\':\'text/html\',\'.js\':\'text/javascript\',\'.css\':\'text/css\',\'.webmanifest\':\'application/manifest+json\'};h.createServer((req,res)=>{const f=p.join(process.cwd(),req.url.split(\'?\')[0]);fs.readFile(f,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.writeHead(200,{\'Content-Type\':types[p.extname(f)]||\'application/octet-stream\'});res.end(data);});}).listen(4173);"',
    url: 'http://localhost:4173/index.html',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4173',
  },
  projects: [
    {
      name: 'webkit',
      use: { ...devices['iPad (gen 7)'] },
    },
  ],
});
