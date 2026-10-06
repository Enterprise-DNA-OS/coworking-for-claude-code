import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {getDb,REPO_ROOT} from './lib/db.mjs';
import {parseCsv,pick} from './lib/csv.mjs';
import {table} from './lib/format.mjs';

export const TABLES=['locations','plans','members','spaces','memberships','bookings','invoices','visits','actions','notes','imports'];
export const FIELDS={
 locations:'code name currency jurisdiction emergency_plan_ref emergency_test_due',
 plans:'code name location_id monthly_cents room_minutes',
 members:'code name location_id email company status last_contact_on privacy_review_on induction_on',
 spaces:'code name location_id kind capacity active',
 memberships:'code name member_id plan_id space_id start_on end_on renew_on status agreement_ref',
 bookings:'code name member_id space_id starts_at ends_at status charge_cents invoiced',
 invoices:'code name member_id due_on amount_cents paid_cents reconciliation_ref',
 visits:'code name member_id arrived_at departed_at',
 actions:'code name location_id owner due_on status completion_ref'
};
export const READS={
 locations:'select code,name,currency,jurisdiction,emergency_plan_ref,emergency_test_due from cowork.locations order by code',
 plans:'select p.code,p.name,l.code location,l.currency,p.monthly_cents,p.room_minutes from cowork.plans p join cowork.locations l on l.id=p.location_id order by p.code',
 members:'select m.code,m.name,m.status,m.email,l.code location,m.last_contact_on from cowork.members m join cowork.locations l on l.id=m.location_id order by m.code',
 spaces:'select s.code,s.name,s.kind,s.capacity,s.active,l.code location from cowork.spaces s join cowork.locations l on l.id=s.location_id order by s.code',
 memberships:'select code,member,plan,space,location,currency,monthly_cents,start_on,end_on,renew_on,status from cowork.membership_register order by code',
 occupancy:'select code,name,kind,capacity,location,member,end_on from cowork.occupancy order by location,code',
 vacancies:'select code,name,kind,capacity,location from cowork.occupancy where member is null order by code',
 'renewals-due':"select code,member,location,currency,monthly_cents,renew_on,end_on from cowork.membership_register where status='active' and renew_on<=current_date+60 order by renew_on,code",
 'room-diary':"select code,member,room,location,starts_at,ends_at,status from cowork.room_diary where status<>'cancelled' and ends_at>=current_date order by starts_at,code",
 bookings:'select code,member,room,location,currency,starts_at,ends_at,charge_cents,invoiced,status from cowork.room_diary order by starts_at,code',
 arrears:'select code,member,location,currency,due_on,days_overdue,balance_cents from cowork.arrears order by days_overdue desc,code',
 invoices:'select i.code,m.name member,l.currency,i.due_on,i.amount_cents,i.paid_cents from cowork.invoices i join cowork.members m on m.id=i.member_id join cowork.locations l on l.id=m.location_id order by i.code',
 visitors:'select v.code,v.name,m.name host,v.arrived_at,v.departed_at from cowork.visits v join cowork.members m on m.id=v.member_id order by v.arrived_at,v.code',
 actions:"select a.code,a.name,l.code location,a.owner,a.due_on,a.status from cowork.actions a join cowork.locations l on l.id=a.location_id where a.status='open' order by a.due_on,a.code",
 compliance:'select * from cowork.compliance order by rule,record',
 'quiet-members':"select code,name,last_contact_on,current_date-last_contact_on days_quiet from cowork.members where status='active' and(last_contact_on is null or last_contact_on<current_date-30) order by code",
 'renewal-arrears':"select x.code,x.member,x.renew_on,x.location,x.currency,(select sum(a.balance_cents) from cowork.arrears a where a.member_id=x.member_id) overdue_cents from cowork.membership_register x where x.status='active' and x.renew_on<=current_date+60 and exists(select 1 from cowork.arrears a where a.member_id=x.member_id) order by x.renew_on,x.code",
 'room-revenue':"select location,currency,room,sum(minutes) booked_minutes,sum(charge_cents) booked_charge_cents from cowork.room_diary where status<>'cancelled' and starts_at>=date_trunc('month',current_date) and starts_at<date_trunc('month',current_date)+interval '1 month' group by location,currency,room order by location,room",
 'uninvoiced-bookings':"select code,member,room,currency,charge_cents,ends_at from cowork.room_diary where status<>'cancelled' and not invoiced and charge_cents>0 and ends_at<now() order by ends_at,code",
 'expiry-exposure':"select location,currency,count(*) memberships,sum(monthly_cents) monthly_cents from cowork.membership_register where status='active' and end_on between current_date and current_date+60 group by location,currency order by location,currency",
 'room-allowance':"select m.code,m.name,l.currency,coalesce((select sum(x.room_minutes) from cowork.membership_register x where x.member_id=m.id and x.status='active' and current_date between x.start_on and x.end_on),0) allowance_minutes,coalesce((select sum(b.minutes) from cowork.room_diary b where b.member_id=m.id and b.status<>'cancelled' and b.starts_at>=date_trunc('month',current_date) and b.starts_at<date_trunc('month',current_date)+interval '1 month'),0) booked_minutes from cowork.members m join cowork.locations l on l.id=m.location_id where m.status='active' order by m.code",
 'late-visitors':"select v.code,v.name,m.name host,v.arrived_at from cowork.visits v join cowork.members m on m.id=v.member_id where v.departed_at is null and v.arrived_at<now()-interval '12 hours' order by v.arrived_at,v.code",
 'plan-mix':"select location,currency,plan,count(*) memberships,sum(monthly_cents) monthly_cents from cowork.membership_register where status='active' and current_date between start_on and end_on group by location,currency,plan order by location,plan",
 'member-history':"select m.code,m.name,(select count(*) from cowork.bookings b where b.member_id=m.id and b.status<>'cancelled') bookings,(select count(*) from cowork.notes n where n.member_id=m.id) notes,(select coalesce(sum(i.amount_cents-i.paid_cents),0) from cowork.invoices i where i.member_id=m.id) outstanding_cents,l.currency from cowork.members m join cowork.locations l on l.id=m.location_id order by m.code",
 attention:"select 'renewal' kind,code record,member detail,renew_on due_on from cowork.membership_register where status='active' and renew_on<=current_date+30 union all select 'arrears',code,member,due_on from cowork.arrears union all select 'action',code,name,due_on from cowork.actions where status='open' and due_on<=current_date+7 order by due_on,record"
};
const REFS={location_id:'locations',member_id:'members',plan_id:'plans',space_id:'spaces'};
export function isoDate(v){if(typeof v!=='string'||!/^\d{4}-\d\d-\d\d$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v)throw Error(`Invalid ISO date: ${v}`);return v;}
export async function resolve(db,t,ref){
 if(!TABLES.includes(t)||!ref)throw Error('Record type and reference required');
 let rows=await db.query(`select * from cowork.${t} where lower(code)=lower($1)`,[ref]);
 if(!rows.length) rows=await db.query(`select * from cowork.${t} where lower(name)=lower($1) or id::text ilike $2 order by code`,[ref,ref+'%']);
 if(!rows.length)rows=await db.query(`select * from cowork.${t} where name ilike $1 order by code`,['%'+ref+'%']);
 if(rows.length!==1)throw Error(`${rows.length?'Ambiguous':'No'} ${t}: ${rows.map(x=>`${x.code} ${x.name}`).join('; ')||ref}`);
 return rows[0];
}
export async function mutate(db,cmd,t,ref,data){
 if(!FIELDS[t]||!data||Array.isArray(data)||!Object.keys(data).length)throw Error('Supported type and nonempty JSON object required');
 const allow=FIELDS[t].split(' ');
 for(const [k,v] of Object.entries(data)){
  if(!allow.includes(k))throw Error(`Unsupported field ${k}`);
  if(cmd==='update'&&['code','location_id','member_id','plan_id','space_id','currency','jurisdiction','kind'].includes(k))throw Error(`Immutable relationship or identity ${k}`);
  if(v!==null){
   if(k.endsWith('_on')||k==='emergency_test_due')isoDate(v);
   if(k.endsWith('_at')&&(!/T.*(?:Z|[+-]\d\d:\d\d)$/.test(v)||!Number.isFinite(Date.parse(v))))throw Error('Timestamp requires ISO date/time and explicit timezone');
   if(k.endsWith('_cents')||['capacity','room_minutes'].includes(k)){if(!Number.isSafeInteger(v)||v<0)throw Error('Amounts require nonnegative integer cents; capacities and minutes require integers');}
   if(['active','invoiced'].includes(k)&&typeof v!=='boolean')throw Error('Boolean required');
   if(['code','name','email','owner'].includes(k)&&(typeof v!=='string'||!v.trim()))throw Error('Nonempty text required');
   if(REFS[k])data[k]=(await resolve(db,REFS[k],v)).id;
  }
 }
 const keys=Object.keys(data),vals=Object.values(data);
 if(cmd==='add')return (await db.query(`insert into cowork.${t}(${keys.join(',')}) values(${keys.map((_,i)=>'$'+(i+1)).join(',')}) returning *`,vals))[0];
 const rec=await resolve(db,t,ref);
 return (await db.query(`update cowork.${t} set ${keys.map((k,i)=>`${k}=$${i+1}`).join(',')} where id=$${keys.length+1} returning *`,[...vals,rec.id]))[0];
}
export async function importNexudus(db,file,{location,map={},dry=false}={}){
 if(!file||path.extname(file).toLowerCase()!=='.csv')throw Error('Save the Nexudus customer XLS export as UTF-8 CSV first; --file required');
 const loc=await resolve(db,'locations',location);
 if(Object.keys(map).some(k=>!['id','name','email','company'].includes(k)))throw Error('Unknown import map key');
 const source=parseCsv(fs.readFileSync(file,'utf8'));if(!source.length)throw Error('Empty customer export');
 const rows=source.map((r,i)=>{
  const take=(key,...aliases)=>map[key]?pick(r,map[key]):pick(r,...aliases);
  const id=take('id','Id','Customer ID','CoworkerId').trim(),name=take('name','FullName','Full Name','Name').trim(),email=take('email','Email','Email Address').trim(),company=take('company','CompanyName','Company').trim();
  if(!id||!name||!email.includes('@'))throw Error(`Row ${i+2}: customer ID, name and email required; check --map`);
  return {id,name,email,company};
 });
 if(new Set(rows.map(r=>r.id)).size!==rows.length)throw Error('Duplicate customer ID in export');
 let inserted=0,skipped=0;
 await db.exec('BEGIN');try{
  for(const r of rows){
   const sourceId=`nexudus:${loc.code}:${r.id}`,fingerprint=crypto.createHash('sha256').update(JSON.stringify(r)).digest('hex');
   const old=(await db.query('select * from cowork.imports where source_id=$1',[sourceId]))[0];
   if(old){if(old.fingerprint!==fingerprint)throw Error(`Changed imported customer ${r.id}; reconcile explicitly`);skipped++;continue;}
   const member=await mutate(db,'add','members',null,{code:sourceId,name:r.name,email:r.email,company:r.company,location_id:loc.code,status:'contact'});
   await db.query('insert into cowork.imports(source_id,fingerprint,member_id,source_file,mapped_fields) values($1,$2,$3,$4,$5)',[sourceId,fingerprint,member.id,path.basename(file),JSON.stringify(r)]);inserted++;
  }
  await db.exec(dry?'ROLLBACK':'COMMIT');return {inserted,skipped,dry_run:dry,status:'Imported as contacts; verify before activation',mapped:['customer ID','name','email','company']};
 }catch(e){await db.exec('ROLLBACK');throw e;}
}
function parse(args){
 const pos=[],opt={};for(const a of args){if(a.startsWith('--')){const i=a.indexOf('='),k=a.slice(2,i<0?undefined:i),v=i<0?true:a.slice(i+1);if(k in opt)throw Error(`Duplicate option --${k}`);opt[k]=v;}else pos.push(a);}
 for(const k of ['json','dry-run'])if(k in opt&&opt[k]!==true)throw Error(`--${k} is a boolean flag`);
 return {pos,opt};
}
function options(opt,allowed){for(const k of Object.keys(opt))if(!['json',...allowed].includes(k))throw Error(`Unknown option --${k}`);for(const [k,v] of Object.entries(opt))if(!['json','dry-run'].includes(k)&&(v===true||v===''))throw Error(`--${k} requires a value`);}
function arity(pos,n){if(pos.length!==n)throw Error('Missing or unexpected arguments; use --help');}
function outputFile(dir,name,content){const base=process.env.OUTPUT_DIR||REPO_ROOT;fs.mkdirSync(path.join(base,dir),{recursive:true});const file=path.join(base,dir,`${name}-${Date.now()}-${crypto.randomUUID().slice(0,8)}.md`);fs.writeFileSync(file,content,{flag:'wx'});return {file,sent:false};}
export async function run(db,args){
 const {pos,opt}=parse(args);const [cmd,...rest]=pos;
 if(cmd in READS){arity(rest,0);options(opt,[]);return db.query(READS[cmd]);}
 if(cmd==='member'){
  arity(rest,1);options(opt,[]);const m=await resolve(db,'members',rest[0]);const out={member:m};
  for(const t of ['memberships','bookings','invoices','visits','notes'])out[t]=await db.query(`select * from cowork.${t} where member_id=$1 order by created_at,id`,[m.id]);return out;
 }
 if(cmd==='add'||cmd==='update'){
  arity(rest,cmd==='add'?1:2);options(opt,['data']);if(!opt.data)throw Error('--data=file.json required');return mutate(db,cmd,rest[0],rest[1],JSON.parse(fs.readFileSync(opt.data,'utf8')));
 }
 if(cmd==='log'){
  arity(rest,1);options(opt,['author','text','date']);if(!opt.author||!opt.text||!opt.date)throw Error('--author --text --date required');isoDate(opt.date);
  const m=await resolve(db,'members',rest[0]);await db.exec('BEGIN');try{
   const n=(await db.query('insert into cowork.notes(member_id,author,body,contact_on) values($1,$2,$3,$4) returning *',[m.id,opt.author,opt.text,opt.date]))[0];
   await db.query('update cowork.members set last_contact_on=greatest(last_contact_on,$1::date) where id=$2',[opt.date,m.id]);await db.exec('COMMIT');return n;
  }catch(e){await db.exec('ROLLBACK');throw e;}
 }
 if(cmd==='import'){
  arity(rest,1);options(opt,['file','location','map','dry-run']);if(rest[0]!=='nexudus')throw Error('Only import nexudus is supported');return importNexudus(db,opt.file,{location:opt.location,map:opt.map?JSON.parse(fs.readFileSync(opt.map,'utf8')):{},dry:!!opt['dry-run']});
 }
 if(cmd==='export'){
  arity(rest,0);options(opt,['out']);const snapshot={format:'cowork-v1',exported_at:new Date().toISOString()};
  await db.exec('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');try{for(const t of TABLES)snapshot[t]=await db.query(`select * from cowork.${t} order by id`);await db.exec('COMMIT');}catch(e){await db.exec('ROLLBACK');throw e;}
  if(opt.out){fs.writeFileSync(opt.out,JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});return {file:opt.out,collections:TABLES.length};}return snapshot;
 }
 if(cmd==='draft-weekly'||cmd==='weekly-review'){
  arity(rest,0);options(opt,[]);const data={};for(const r of ['attention','occupancy','compliance'])data[r]=await db.query(READS[r]);
  return outputFile('drafts','weekly-review','# Weekly space review\n\nFictional demo or live records as selected. Check balances against accounting before action. Assign an owner and deadline to each open item.\n\n'+Object.entries(data).map(([k,v])=>'## '+k+'\n\n'+format(v)).join('\n\n'));
 }
 if(cmd==='draft-renewal'){
  arity(rest,1);options(opt,[]);const m=await resolve(db,'members',rest[0]);const rows=await db.query("select code,member,plan,renew_on,end_on,currency,monthly_cents from cowork.membership_register where member_id=$1 and status='active' order by renew_on",[m.id]);if(!rows.length)throw Error('No active membership');
  return outputFile('drafts','renewal','# Draft membership review\n\nFor '+m.name+'\n\nPlease review these recorded membership dates with the operator. This is a conversation brief, not an automatic renewal or legal notice.\n\n'+format(rows));
 }
 throw Error('Unknown command; use --help');
}
export function format(value){if(!Array.isArray(value))return JSON.stringify(value,null,2);if(!value.length)return '(none)';return table(value,Object.keys(value[0]).map(key=>({key,label:key.replace(/_cents$/, '').replace(/_/g,' '),format:(v)=>v===null?'':key.endsWith('_cents')?(Number(v)/100).toFixed(2):v instanceof Date?v.toISOString():typeof v==='object'?JSON.stringify(v):v})));}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 if(process.argv.includes('--help')){console.log('cowork: '+Object.keys(READS).join(', ')+', member <ref>, add <type> --data=file, update <type> <ref> --data=file, log <member> --author= --text= --date=, import nexudus --file= --location= [--map=] [--dry-run], export [--out=], weekly-review, draft-weekly, draft-renewal <member>. All accept --json.');}
 else{let db;try{db=await getDb();const out=await run(db,process.argv.slice(2));console.log(process.argv.includes('--json')?JSON.stringify(out,null,2):format(out));}catch(e){console.error(e.message);process.exitCode=1;}finally{if(db)await db.close();}}
}
