import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../public/measurement.js',import.meta.url),'utf8');
function setup(consent=null,hostname='www.midcoastweb.com.au') {
  let panel=null; const scripts=[],cookies=[],listeners={};
  const storage=new Map(consent ? [['mwc-analytics-consent',consent]]:[]);
  const document={referrer:'https://example.com/private?email=private@example.com',
    head:{append:s=>scripts.push(s)},body:{append:p=>panel=p},
    createElement:()=>({setAttribute(){},addEventListener(t,fn){this[t]=fn},remove(){panel=null}}),
    querySelector:()=>panel,addEventListener:(t,fn)=>listeners[t]=fn,
    set cookie(value){cookies.push(value)}};
  const window={}; const location={hostname,origin:'https://'+hostname,pathname:'/contact/',search:'?email=private@example.com',reload(){}};
  vm.runInNewContext(source,{document,window,location,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},URL});
  return {window,scripts,cookies,storage,choose(value){panel.click({target:{closest:()=>({dataset:{choice:value}})}})},
    click(href,enquiry=false,prefs=false){listeners.click({preventDefault(){},target:{closest:()=>({getAttribute:()=>href,matches:s=>s==='[data-enquiry-link]'?enquiry:prefs})}})}};
}
test('no tag before consent; rejecting does not load one',()=>{const s=setup();assert.equal(s.scripts.length,0);s.choose('no');assert.equal(s.scripts.length,0)});
test('consent enables tag and redacts URL and referrer details',()=>{const s=setup();s.choose('yes');assert.equal(s.scripts.length,1);const config=s.window.dataLayer[1][2];assert.equal(config.page_location,'https://www.midcoastweb.com.au/contact/');assert.equal(config.page_referrer,'https://example.com')});
test('clicks are distinct events, never submission conversions',()=>{const s=setup('yes');s.click('mailto:hello@midcoastweb.com.au');s.click('tel:+61466715661');s.click('https://docs.google.com/forms/',true);assert.deepEqual(Array.from(s.window.dataLayer.slice(2),x=>x[1]),['email_click','phone_click','enquiry_form_open'])});
test('preview does not report traffic to production',()=>assert.equal(setup('yes','localhost').scripts.length,0));
test('withdrawal disables tag and expires analytics cookies',()=>{const s=setup('yes');s.click('/privacy/',false,true);assert.equal(s.window['ga-disable-G-L9W9MW0S9J'],true);assert.equal(s.storage.get('mwc-analytics-consent'),'no');assert.equal(s.cookies.length,6)});
test('decline can be changed to allow on the same page',()=>{const s=setup();s.choose('no');s.click('/privacy/',false,true);s.choose('yes');assert.equal(s.window['ga-disable-G-L9W9MW0S9J'],false);assert.equal(s.scripts.length,1)});
