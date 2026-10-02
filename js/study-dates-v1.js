(()=>{"use strict";
function dateOnly(value){
 if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
 const date=new Date(value+"T00:00:00Z");
 return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value?value:null;
}
function publishedDate(value){
 const plain=dateOnly(value);if(plain)return plain;
 if(typeof value!=="string"||!dateOnly(value.slice(0,10))||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value))return null;
 const date=new Date(value);if(!Number.isFinite(date.getTime()))return null;
 const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date),values=Object.fromEntries(parts.map(part=>[part.type,part.value]));
 return values.year+"-"+values.month+"-"+values.day;
}
window.CentralStudyDatesV1={dateOnly,publishedDate};
})();
