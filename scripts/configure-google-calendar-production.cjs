// Explicit release configuration for the production project only.
// Values travel via stdin, never command-line arguments, git or printed CLI output.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
require('@next/env').loadEnvConfig(process.cwd());
if(!process.argv.includes('--confirm-production'))throw Error('Use --confirm-production for an authorized release.');
const reuse=process.argv.includes('--reuse-reviewed-calendar-client');
const clientId=reuse?process.env.GOOGLE_CALENDAR_CLIENT_ID:process.env.GOOGLE_CALENDAR_PRODUCTION_CLIENT_ID;
const clientSecret=reuse?process.env.GOOGLE_CALENDAR_CLIENT_SECRET:process.env.GOOGLE_CALENDAR_PRODUCTION_CLIENT_SECRET;
if(!clientId || !clientSecret)throw Error('Provide production-specific Calendar credentials, or explicitly authorize --reuse-reviewed-calendar-client.');
const settings={
  GOOGLE_CALENDAR_CLIENT_ID:clientId,
  GOOGLE_CALENDAR_CLIENT_SECRET:clientSecret,
  GOOGLE_CALENDAR_ENCRYPTION_KEY:process.env.GOOGLE_CALENDAR_PRODUCTION_ENCRYPTION_KEY,
  GOOGLE_CALENDAR_ENABLED:'true',
  GOOGLE_CALENDAR_REDIRECT_URI:'https://app.norsepaw.com/api/integrations/google/callback',
};
if(!settings.GOOGLE_CALENDAR_CLIENT_ID?.endsWith('.apps.googleusercontent.com')||!settings.GOOGLE_CALENDAR_CLIENT_SECRET||Buffer.from(settings.GOOGLE_CALENDAR_ENCRYPTION_KEY||'','base64').length!==32||settings.GOOGLE_CALENDAR_ENCRYPTION_KEY===process.env.GOOGLE_CALENDAR_ENCRYPTION_KEY)throw Error('Supply valid credentials and a separate production encryption key.');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'norsepaw-production-config-'));
try{
  fs.mkdirSync(path.join(dir,'.vercel'));fs.writeFileSync(path.join(dir,'.vercel/project.json'),JSON.stringify({projectId:'prj_1UpHuPVi1buH2QvNuNyITwNAYaZi',orgId:'team_pcnzsAgLdyysPlY45Ak4wSuI',projectName:'doglog'}));
  for(const [name,value]of Object.entries(settings)){
    const result=spawnSync('vercel',['env','add',name,'production','--sensitive','--force','--yes'],{cwd:dir,input:value,encoding:'utf8',timeout:60000});
    if(result.status!==0)throw Error(`Could not configure ${name}; no values or raw responses displayed.`);
    console.log(`${name}: configured for doglog Production only`);
  }
}finally{fs.rmSync(dir,{recursive:true,force:true});}
