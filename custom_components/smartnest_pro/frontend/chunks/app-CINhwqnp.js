import{_ as t}from"./loader-CNK6QNRK.js";const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const r=t=>new a("string"==typeof t?t:t+"",void 0,i),n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new a(s,t,i)},l=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:p,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:g}=Object,m=globalThis,f=m.trustedTypes,b=f?f.emptyScript:"",x=m.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(i){s=null}}return s}},$=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let C=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=p(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const a=i?.call(this);o?.call(this,e),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const t=this._$Eu(e,s);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const a=o.fromAttribute(e,t.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const a=this.constructor;if(!1===i&&(o=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??$)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==o||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[v("elementProperties")]=new Map,C[v("finalized")]=new Map,x?.({ReactiveElement:C}),(m.reactiveElementVersions??=[]).push("2.1.2");const _=globalThis,H=t=>t,k=_.trustedTypes,V=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,L="?"+A,S=`<${L}>`,z=document,P=()=>z.createComment(""),E=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,Z="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,D=/>/g,F=RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,I=/"/g,N=/^(?:script|style|textarea|title)$/i,W=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),U=W(1),B=W(2),q=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),Y=new WeakMap,G=z.createTreeWalker(z,129);function X(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==V?V.createHTML(e):e}class J{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,a=0;const r=t.length-1,n=this.parts,[l,c]=((t,e)=>{const s=t.length-1,i=[];let o,a=2===e?"<svg>":3===e?"<math>":"",r=j;for(let n=0;n<s;n++){const e=t[n];let s,l,c=-1,d=0;for(;d<e.length&&(r.lastIndex=d,l=r.exec(e),null!==l);)d=r.lastIndex,r===j?"!--"===l[1]?r=T:void 0!==l[1]?r=D:void 0!==l[2]?(N.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=F):void 0!==l[3]&&(r=F):r===F?">"===l[0]?(r=o??j,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,s=l[1],r=void 0===l[3]?F:'"'===l[3]?I:R):r===I||r===R?r=F:r===T||r===D?r=j:(r=F,o=void 0);const p=r===F&&t[n+1].startsWith("/>")?" ":"";a+=r===j?e+S:c>=0?(i.push(s),e.slice(0,c)+M+e.slice(c)+A+p):e+A+(-2===c?n:p)}return[X(t,a+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]})(t,e);if(this.el=J.createElement(l,s),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=G.nextNode())&&n.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(M)){const e=c[a++],s=i.getAttribute(t).split(A),r=/([.?@])?(.*)/.exec(e);n.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?it:"?"===r[1]?ot:"@"===r[1]?at:st}),i.removeAttribute(t)}else t.startsWith(A)&&(n.push({type:6,index:o}),i.removeAttribute(t));if(N.test(i.tagName)){const t=i.textContent.split(A),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),G.nextNode(),n.push({type:2,index:++o});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===L)n.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(A,t+1));)n.push({type:7,index:o}),t+=A.length-1}o++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===q)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const a=E(e)?void 0:e._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,i)),e}let tt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);G.currentNode=i;let o=G.nextNode(),a=0,r=0,n=s[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new et(o,o.nextSibling,this,t):1===n.type?e=new n.ctor(o,n.name,n.strings,this,t):6===n.type&&(e=new rt(o,this,t)),this._$AV.push(e),n=s[++r]}a!==n?.index&&(o=G.nextNode(),a++)}return G.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}};class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),E(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&E(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(X(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new J(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new et(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=H(t).nextSibling;H(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=K}_$AI(t,e=this,s,i){const o=this.strings;let a=!1;if(void 0===o)t=Q(this,t,e,0),a=!E(t)||t!==this._$AH&&t!==q,a&&(this._$AH=t);else{const i=t;let r,n;for(t=o[0],r=0;r<o.length-1;r++)n=Q(this,i[s+r],e,r),n===q&&(n=this._$AH[r]),a||=!E(n)||n!==this._$AH[r],n===K?t=K:t!==K&&(t+=(n??"")+o[r+1]),this._$AH[r]=n}a&&!i&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}let ot=class extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}};class at extends st{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??K)===q)return;const s=this._$AH,i=t===K&&s!==K||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==K&&(s===K||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=_.litHtmlPolyfillSupport;nt?.(J,et),(_.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;let ct=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(P(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const pt=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ut=(t=ht,e,s)=>{const{kind:i,metadata:o}=s;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),a.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function gt(t){return(e,s)=>"object"==typeof s?ut(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function mt(t){return gt({...t,state:!0,attribute:!1})}let ft=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const bt={},xt=(vt=class extends ft{constructor(){super(...arguments),this.key=K}render(t,e){return this.key=t,e}update(t,[e,s]){return e!==this.key&&(((t,e=bt)=>{t._$AH=e})(t),this.key=e),s}},(...t)=>({_$litDirective$:vt,values:t}));var vt,yt="M12,5A3.5,3.5 0 0,0 8.5,8.5A3.5,3.5 0 0,0 12,12A3.5,3.5 0 0,0 15.5,8.5A3.5,3.5 0 0,0 12,5M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M5.5,8A2.5,2.5 0 0,0 3,10.5C3,11.44 3.53,12.25 4.29,12.68C4.65,12.88 5.06,13 5.5,13C5.94,13 6.35,12.88 6.71,12.68C7.08,12.47 7.39,12.17 7.62,11.81C6.89,10.86 6.5,9.7 6.5,8.5C6.5,8.41 6.5,8.31 6.5,8.22C6.2,8.08 5.86,8 5.5,8M18.5,8C18.14,8 17.8,8.08 17.5,8.22C17.5,8.31 17.5,8.41 17.5,8.5C17.5,9.7 17.11,10.86 16.38,11.81C16.5,12 16.63,12.15 16.78,12.3C16.94,12.45 17.1,12.58 17.29,12.68C17.65,12.88 18.06,13 18.5,13C18.94,13 19.35,12.88 19.71,12.68C20.47,12.25 21,11.44 21,10.5A2.5,2.5 0 0,0 18.5,8M12,14C9.66,14 5,15.17 5,17.5V19H19V17.5C19,15.17 14.34,14 12,14M4.71,14.55C2.78,14.78 0,15.76 0,17.5V19H3V17.07C3,16.06 3.69,15.22 4.71,14.55M19.29,14.55C20.31,15.22 21,16.06 21,17.07V19H24V17.5C24,15.76 21.22,14.78 19.29,14.55M12,16C13.53,16 15.24,16.5 16.23,17H7.77C8.76,16.5 10.47,16 12,16Z",$t="M6.59,0.66C8.93,-1.15 11.47,1.06 12.04,4.5C12.47,4.5 12.89,4.62 13.27,4.84C13.79,4.24 14.25,3.42 14.07,2.5C13.65,0.35 16.06,-1.39 18.35,1.58C20.16,3.92 17.95,6.46 14.5,7.03C14.5,7.46 14.39,7.89 14.16,8.27C14.76,8.78 15.58,9.24 16.5,9.06C18.63,8.64 20.38,11.04 17.41,13.34C15.07,15.15 12.53,12.94 11.96,9.5C11.53,9.5 11.11,9.37 10.74,9.15C10.22,9.75 9.75,10.58 9.93,11.5C10.35,13.64 7.94,15.39 5.65,12.42C3.83,10.07 6.05,7.53 9.5,6.97C9.5,6.54 9.63,6.12 9.85,5.74C9.25,5.23 8.43,4.76 7.5,4.94C5.37,5.36 3.62,2.96 6.59,0.66M5,16H7A2,2 0 0,1 9,18V24H7V22H5V24H3V18A2,2 0 0,1 5,16M5,18V20H7V18H5M12.93,16H15L12.07,24H10L12.93,16M18,16H21V18H18V22H21V24H18A2,2 0 0,1 16,22V18A2,2 0 0,1 18,16Z",wt="M13,2V10H21A8,8 0 0,0 13,2M19.32,15.89C20.37,14.54 21,12.84 21,11H6.44L5.5,9H2V11H4.22C4.22,11 6.11,15.07 6.34,15.42C5.24,16 4.5,17.17 4.5,18.5A3.5,3.5 0 0,0 8,22C9.76,22 11.22,20.7 11.46,19H13.54C13.78,20.7 15.24,22 17,22A3.5,3.5 0 0,0 20.5,18.5C20.5,17.46 20.04,16.53 19.32,15.89M8,20A1.5,1.5 0 0,1 6.5,18.5A1.5,1.5 0 0,1 8,17A1.5,1.5 0 0,1 9.5,18.5A1.5,1.5 0 0,1 8,20M17,20A1.5,1.5 0 0,1 15.5,18.5A1.5,1.5 0 0,1 17,17A1.5,1.5 0 0,1 18.5,18.5A1.5,1.5 0 0,1 17,20Z",Ct="M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12L19,15.59M22,3A2,2 0 0,1 24,5V19A2,2 0 0,1 22,21H7C6.31,21 5.77,20.64 5.41,20.11L0,12L5.41,3.88C5.77,3.35 6.31,3 7,3H22M22,5H7L2.28,12L7,19H22V5Z",_t="M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",Ht="M8 5C7.5 5 7 5.21 6.61 5.6S6 6.45 6 7V10C5.47 10 5 10.19 4.59 10.59S4 11.47 4 12V17H5.34L6 19H7L7.69 17H16.36L17 19H18L18.66 17H20V12C20 11.47 19.81 11 19.41 10.59S18.53 10 18 10V7C18 6.45 17.8 6 17.39 5.6S16.5 5 16 5M8 7H11V10H8M13 7H16V10H13M6 12H18V15H6Z",kt="M17 10V7C17 5.9 16.11 5 15 5H9C7.9 5 7 5.9 7 7V10C5.9 10 5 10.9 5 12V17H6.33L7 19H8L8.67 17H15.33L16 19H17L17.67 17H19V12C19 10.9 18.11 10 17 10M9 7H15V10H9M17 15H7V12H17Z",Vt="M23 13H1V15H3V19H5V15H19V19H21V15H23V13Z",Mt="M20 19V3H4V19H2V21H22V19H20M16 9H18V11H16V9M14 11H6V9H14V11M18 7H16V5H18V7M14 5V7H6V5H14M6 19V13H14V14.82C13.55 15.14 13.25 15.66 13.25 16.25C13.25 17.22 14.03 18 15 18S16.75 17.22 16.75 16.25C16.75 15.66 16.45 15.13 16 14.82V13H18V19H6Z",At="M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z",Lt="M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z",St="M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z",zt="M22 10V13H19V10H22M2 13H5V10H2V13M17 5C17 3.9 16.1 3 15 3H9C7.9 3 7 3.9 7 5V13H17V5M7 15H6V17H11V18L7 22H9.8L12 19.8L14.2 22H17L13 18V17H18V15H7Z",Pt="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",Et="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",Ot="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",Zt="M18 10V7C18 5.34 16.66 4 15 4S12 5.34 12 7H14C14 6.45 14.45 6 15 6S16 6.45 16 7V10H8C9.1 10 10 9.1 10 8V4H4V8C4 9.1 4.9 10 6 10H2V12H4V20H20V12H22V10H18M13 18H11V12H13V18Z",jt="M22 10H18V7C18 5.34 16.66 4 15 4S12 5.34 12 7H14C14 6.45 14.45 6 15 6S16 6.45 16 7V10H8C9.1 10 10 9.1 10 8V4H4V8C4 9.1 4.9 10 6 10H2V12H4V20H20V12H22V10M6 6H8V8H6V6M6 18V12H11V18H6M18 18H13V12H18V18Z",Tt="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",Dt="M3 6H21C21.55 6 22 6.45 22 7C22 7.55 21.55 8 21 8V19H19V17H15V19H13V8H5V19H3V8C2.45 8 2 7.55 2 7C2 6.45 2.45 6 3 6M16 10.5V11H18V10.5C18 10.22 17.78 10 17.5 10H16.5C16.22 10 16 10.22 16 10.5M16 14.5V15H18V14.5C18 14.22 17.78 14 17.5 14H16.5C16.22 14 16 14.22 16 14.5Z",Ft="M19,3L15,7L18,10L19,9L20,10L22,8L19,5V3M3,7L2,8L5,11V14L4,15V21H6V18L8,15H15V21H17V11L14,8L13,9H5L3,7Z",Rt="M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z",It="M4 3C2.9 3 2 3.9 2 5V18C2 19.11 2.9 20 4 20V21H6V20H18V21H20V20C21.11 20 22 19.11 22 18V5C22 3.9 21.11 3 20 3H4M4 5H20V8H4V5M10 6V7H14V6H10M4 10H20V13H4V10M10 11V12H14V11H10M4 15H20V18H4V15M10 16V17H14V16H10Z",Nt="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",Wt="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",Ut="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",Bt="M19 14V16H16V14.28L19 14M19 13C19 11.9 18 11 16.8 11H10V10H5V21H10V13.91L19 13M5 9H10V7L15.36 5.21C15.74 5.09 16 4.73 16 4.33C16 3.68 15.36 3.23 14.75 3.45L5 7V9Z",qt="M9 9V11H7V9H5V11H3V9H1V21H3V19H5V21H7V19H9V21H11V19H13V21H15V19H17V21H19V19H21V21H23V9H21V11H19V9H17V11H15V9H13V11H11V9H9M3 13H5V17H3V13M7 13H9V17H7V13M11 13H13V17H11V13M15 13H17V17H15V13M19 13H21V17H19V13Z",Kt="M14,8H10V6H14V8M20,4V20C20,21.11 19.11,22 18,22H6C4.89,22 4,21.11 4,20V4A2,2 0 0,1 6,2H18C19.11,2 20,2.9 20,4M18,13H6V20H18V13M18,4H6V11H18V4M14,15H10V17H14V15Z",Yt="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z",Gt="M7,2V13H10V22L17,10H13L17,2H7Z",Xt="M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z",Jt="M8.66,13.07C6.92,13.07 5.5,11.66 5.5,9.93C5.5,9.22 5.76,8.54 6.19,8C5.77,7.46 5.5,6.78 5.5,6.07C5.5,4.34 6.93,2.93 8.66,2.93L9.09,2.96C9.56,1.81 10.69,1 12,1C13.31,1 14.44,1.81 14.91,2.96L15.34,2.93C17.07,2.93 18.5,4.34 18.5,6.07C18.5,6.78 18.24,7.46 17.81,8C18.23,8.54 18.5,9.22 18.5,9.93C18.5,11.66 17.07,13.07 15.34,13.07L14.91,13.04C14.44,14.19 13.31,15 12,15C10.69,15 9.56,14.19 9.09,13.04L8.66,13.07M12,13C12.62,13 13.12,12.5 13.14,11.9L13.03,10.81C12.71,10.93 12.36,11 12,11C11.64,11 11.3,10.93 11,10.81L10.86,11.9C10.88,12.5 11.38,13 12,13M15.34,11.07C15.97,11.07 16.5,10.56 16.5,9.92C16.5,9.5 16.23,9.08 15.83,8.89L14.95,8.47C14.83,9.21 14.44,9.85 13.89,10.3L14.7,10.87C14.88,11 15.1,11.07 15.34,11.07M14.69,5.13L13.87,5.69C14.43,6.14 14.82,6.78 14.94,7.5L15.82,7.1C16.23,6.9 16.5,6.5 16.5,6.07C16.5,5.44 15.97,4.93 15.34,4.93C15.11,4.93 14.89,5 14.69,5.13M12,3C11.38,3 10.88,3.5 10.86,4.1L11,5.19C11.3,5.07 11.64,5 12,5C12.36,5 12.71,5.07 13.03,5.19L13.14,4.1C13.12,3.5 12.62,3 12,3M8.66,4.93C8.03,4.93 7.5,5.44 7.5,6.07C7.5,6.5 7.77,6.9 8.17,7.1L9.05,7.5C9.17,6.78 9.56,6.14 10.11,5.69L9.3,5.13C9.12,5 8.9,4.93 8.66,4.93M8.17,8.9C7.77,9.1 7.5,9.5 7.5,9.92C7.5,10.55 8.03,11.06 8.66,11.06C8.89,11.06 9.11,11 9.31,10.86L10.12,10.31C9.56,9.86 9.17,9.22 9.05,8.5L8.17,8.9M12,22A9,9 0 0,1 3,13A9,9 0 0,1 12,22A9,9 0 0,1 21,13A9,9 0 0,1 12,22M14.44,19.56C16.34,18.85 17.85,17.34 18.56,15.44C16.66,16.14 15.15,17.66 14.44,19.56M5.44,15.44C6.15,17.34 7.66,18.85 9.56,19.56C8.86,17.66 7.34,16.15 5.44,15.44Z",Qt="M15.5,21.27L14.66,21.18C13.9,21.11 13.25,20.6 13,19.87C12.47,17.91 12.47,15.83 13,13.87C15.32,13.4 17,11.37 17,9C17,7 15,2 15,2H9C9,2 7,7 7,9C7,11.38 8.67,13.42 11,13.9C11.53,15.86 11.53,17.94 11,19.9C10.76,20.62 10.12,21.13 9.37,21.21L8.5,21.3C8.5,21.3 8,21.28 8,22H16C16,21.28 15.5,21.27 15.5,21.27M9.44,7L10.44,4H13.56L14.56,7H9.44Z",te="M19 17C20.21 17 22 16.2 22 14S20.21 11 19 11H17V9H19C21.2 9 22 7.21 22 6C22 3.8 20.21 3 19 3H17V2H16V3H8V2H7V3H2V5H7V7H5C3.79 7 2 7.8 2 10S3.79 13 5 13H7V15H5C3.79 15 2 15.8 2 18S3.79 21 5 21H7V22H8V21H16V22H17V21H22V19H17V17H19M19 13C19.45 13 20 13.19 20 14S19.45 15 19 15H17V13H19M16 11H8V9H16V11M19 5C19.45 5 20 5.2 20 6C20 6.45 19.81 7 19 7H17V5H19M8 5H16V7H8V5M5 11C4.55 11 4 10.81 4 10S4.55 9 5 9H7V11H5M8 13H16V15H8V13M5 19C4.55 19 4 18.81 4 18S4.55 17 5 17H7V19H5M16 19H8V17H16V19Z",ee="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22",se="M9,13H15V19H18V10L12,5.5L6,10V19H9V13M4,21V9L12,3L20,9V21H4Z",ie="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z",oe="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z",ae="M11 15H6L13 1V9H18L11 23V15Z",re="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",ne="M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",le="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",ce="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",de="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z",pe="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z",he="M12 1C16.69 1 20.5 5.93 20.5 12C20.5 18.08 16.69 23 12 23C7.31 23 3.5 18.08 3.5 12C3.5 5.93 7.31 1 12 1M12 3C8.41 3 5.5 7.03 5.5 12C5.5 16.97 8.41 21 12 21C15.59 21 18.5 16.97 18.5 12C18.5 7.03 15.59 3 12 3M8.29 10.28L11.53 7.03L12.59 8.09L9.35 11.34L8.29 10.28M8.7 14.61L14.36 8.95L15.42 10L9.76 15.67L8.7 14.61Z",ue="M8.29 10.28L11.53 7.03L12.59 8.09L9.35 11.34L8.29 10.28M8.7 14.61L14.36 8.95L15.42 10L9.76 15.67L8.7 14.61M18 3V21H6V3H18M20 1H4V23H20V1Z",ge="M14,19H18V5H14M6,19H10V5H6V19Z",me="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z",fe="M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25M22.61 18.36L18.36 22.61L13.16 17.41L14.93 15.64L15.93 16.64L18.4 14.16L19.82 15.58L18.36 17L19.42 18L20.84 16.6L22.61 18.36M6.61 10.83L1.39 5.64L5.64 1.39L7.4 3.16L4.93 5.64L6 6.7L8.46 4.22L9.88 5.64L8.46 7.05L9.46 8.05L6.61 10.83M20.71 7C21.1 6.61 21.1 6 20.71 5.59L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7Z",be="M8,5.14V19.14L19,12.14L8,5.14Z",xe="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",ve="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13",ye="M1 14V5H13C18.5 5 23 9.5 23 15V17H20.83C20.42 18.17 19.31 19 18 19C16.69 19 15.58 18.17 15.17 17H10C9.09 18.21 7.64 19 6 19C3.24 19 1 16.76 1 14M6 11C4.34 11 3 12.34 3 14C3 15.66 4.34 17 6 17C7.66 17 9 15.66 9 14C9 12.34 7.66 11 6 11M15 10V12H20.25C19.92 11.27 19.5 10.6 19 10H15Z",$e="M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z",we="M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.23,10.13 6.58,9.28 7.11,8.53Z",Ce="M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10L15.55,5.55Z",_e="M12 14C10.9 14 10 13.11 10 12S10.9 10 12 10 14 10.9 14 12 13.11 14 12 14M23 19H1V17H4V15H1V13H4V11H1V9H4V7H1V5H23V7H20V9H23V11H20V13H23V15H20V17H23V19M12 15.92C12.62 16.62 13.66 16.81 14.5 16.33C15.34 15.85 15.69 14.84 15.4 13.96C16.31 13.78 17 12.97 17 12S16.31 10.22 15.4 10.04C15.69 9.16 15.34 8.15 14.5 7.67C13.66 7.19 12.62 7.38 12 8.08C11.38 7.38 10.34 7.19 9.5 7.67C8.66 8.15 8.31 9.16 8.61 10.04C7.69 10.22 7 11.03 7 12S7.69 13.78 8.61 13.96C8.31 14.84 8.66 15.85 9.5 16.33C10.34 16.82 11.38 16.62 12 15.92Z",He="M4,18V21H7V18H17V21H20V15H4V18M19,10H22V13H19V10M2,10H5V13H2V10M17,13H7V5A2,2 0 0,1 9,3H15A2,2 0 0,1 17,5V13Z",ke="M15,5V12H9V5H15M15,3H9A2,2 0 0,0 7,5V14H17V5A2,2 0 0,0 15,3M22,10H19V13H22V10M5,10H2V13H5V10M20,15H4V21H6V17H18V21H20V15Z",Ve="M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17M9,5H10V3H9V5M9,13H10V11H9V13M9,21H10V19H9V21M5,3V5H7V3H5M5,11V13H7V11H5M5,19V21H7V19H5Z",Me="M11,13H13V16H16V11H18L12,6L6,11H8V16H11V13M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1Z",Ae="M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M11,14H13V17H16V12H18L12,7L6,12H8V17H11V14",Le="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z",Se="M1,4.27L2.28,3L20.5,21.22L19.23,22.5L17,20.25C15.57,21.57 13.87,22.54 12,23C6.84,21.74 3,16.55 3,11V6.27L1,4.27M12,1L21,5V11C21,13.28 20.35,15.5 19.23,17.41L5.65,3.82L12,1Z",ze="M21 9V7C21 5.35 19.65 4 18 4H14C13.23 4 12.53 4.3 12 4.78C11.47 4.3 10.77 4 10 4H6C4.35 4 3 5.35 3 7V9C1.35 9 0 10.35 0 12V17C0 18.65 1.35 20 3 20V22H5V20H19V22H21V20C22.65 20 24 18.65 24 17V12C24 10.35 22.65 9 21 9M14 6H18C18.55 6 19 6.45 19 7V9.78C18.39 10.33 18 11.12 18 12V14H13V7C13 6.45 13.45 6 14 6M5 7C5 6.45 5.45 6 6 6H10C10.55 6 11 6.45 11 7V14H6V12C6 11.12 5.61 10.33 5 9.78V7M22 17C22 17.55 21.55 18 21 18H3C2.45 18 2 17.55 2 17V12C2 11.45 2.45 11 3 11S4 11.45 4 12V16H20V12C20 11.45 20.45 11 21 11S22 11.45 22 12V17Z",Pe="M5 9.15V7C5 5.9 5.9 5 7 5H17C18.1 5 19 5.9 19 7V9.16C17.84 9.57 17 10.67 17 11.97V14H7V11.96C7 10.67 6.16 9.56 5 9.15M20 10C18.9 10 18 10.9 18 12V15H6V12C6 10.9 5.11 10 4 10S2 10.9 2 12V17C2 18.1 2.9 19 4 19V21H6V19H18V21H20V19C21.1 19 22 18.1 22 17V12C22 10.9 21.1 10 20 10Z",Ee="M11.45,2V5.55L15,3.77L11.45,2M10.45,8L8,10.46L11.75,11.71L10.45,8M2,11.45L3.77,15L5.55,11.45H2M10,2H2V10C2.57,10.17 3.17,10.25 3.77,10.25C7.35,10.26 10.26,7.35 10.27,3.75C10.26,3.16 10.17,2.57 10,2M17,22V16H14L19,7V13H22L17,22Z",Oe="M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",Ze="M3,3H21V21H3V3M5,5V19H19V5H5Z",je="M15,5V9H11V13H7V17H3V20H10V16H14V12H18V8H22V5H15Z",Te="M6,14H8L11,17H9L6,14M4,4H5V3A1,1 0 0,1 6,2H10A1,1 0 0,1 11,3V4H13V3A1,1 0 0,1 14,2H18A1,1 0 0,1 19,3V4H20A2,2 0 0,1 22,6V19A2,2 0 0,1 20,21V22H17V21H7V22H4V21A2,2 0 0,1 2,19V6A2,2 0 0,1 4,4M18,7A1,1 0 0,1 19,8A1,1 0 0,1 18,9A1,1 0 0,1 17,8A1,1 0 0,1 18,7M14,7A1,1 0 0,1 15,8A1,1 0 0,1 14,9A1,1 0 0,1 13,8A1,1 0 0,1 14,7M20,6H4V10H20V6M4,19H20V12H4V19M6,7A1,1 0 0,1 7,8A1,1 0 0,1 6,9A1,1 0 0,1 5,8A1,1 0 0,1 6,7M13,14H15L18,17H16L13,14Z",De="M12 22H6A2 2 0 0 1 8 20V8H2V5H16V8H10V20A2 2 0 0 1 12 22M22 2V22H20V15H15V22H13V14A2 2 0 0 1 15 12H20V2Z",Fe="M2 7H22V10H20L21 19H18.5L17.94 14H6.06L5.5 19H3L4 10H2V7M17.5 10H6.5L6.29 12H17.71L17.5 10Z",Re="M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z",Ie="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",Ne="M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z",We="M9,22H17V19.5C19.41,17.87 21,15.12 21,12V4A2,2 0 0,0 19,2H15C13.89,2 13,2.9 13,4V12H3C3,15.09 5,18 9,19.5V22M5.29,14H18.71C18.14,15.91 16.77,17.5 15,18.33V20H11V18.33C9,18 5.86,15.91 5.29,14M15,4H19V12H15V4M16,5V8H18V5H16Z",Ue="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z",Be="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",qe="M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z",Ke="M4 4V19C4 20.1 4.9 21 6 21V22H8V21H11.5V2H6C4.9 2 4 2.9 4 4M8 10H10V13H8V10M18 2H12.5V21H16V22H18V21C19.1 21 20 20.1 20 19V4C20 2.9 19.1 2 18 2M16 13H14V10H16V13Z",Ye="M14.83,11.17C16.39,12.73 16.39,15.27 14.83,16.83C13.27,18.39 10.73,18.39 9.17,16.83L14.83,11.17M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M10,4A1,1 0 0,0 9,5A1,1 0 0,0 10,6A1,1 0 0,0 11,5A1,1 0 0,0 10,4M12,8A6,6 0 0,0 6,14A6,6 0 0,0 12,20A6,6 0 0,0 18,14A6,6 0 0,0 12,8Z",Ge="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,6.9C12.44,7.42 12.84,7.85 13.68,9.07C14.89,10.83 16,13.07 16,14.23C16,16.45 14.22,18.23 12,18.23C9.78,18.23 8,16.45 8,14.23C8,13.07 9.11,10.83 10.32,9.07C11.16,7.85 11.56,7.42 12,6.9Z",Xe="M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",Je="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",Qe="M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",ts="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",es="M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z",ss="M21 20V2H3V20H1V23H23V20M19 4V11H17V4M5 4H7V11H5M5 20V13H7V20M9 20V4H15V20M17 20V13H19V20Z";function is(t){const e={version:1,settings:{home_name:"",language:"auto",theme:"auto",reduce_effects:!1},hero:{pins:[]},home:{devices:[],scenes:[]},rooms:{},pages:{},plan:{floors:[],devices:{},hidden:[]}};if(!t||"object"!=typeof t)return e;const s=t;return{version:1,experience:s.experience&&"object"==typeof s.experience?s.experience:{},access:s.access&&"object"==typeof s.access?s.access:void 0,settings:{...e.settings,...s.settings??{}},hero:{image:s.hero?.image,pins:Array.isArray(s.hero?.pins)?s.hero.pins.filter(t=>t&&"number"==typeof t.x&&"number"==typeof t.y):[]},home:{...e.home,...s.home??{},devices:Array.isArray(s.home?.devices)?s.home.devices:[],scenes:Array.isArray(s.home?.scenes)?s.home.scenes:[]},rooms:s.rooms&&"object"==typeof s.rooms?s.rooms:{},pages:s.pages&&"object"==typeof s.pages?s.pages:{},door:s.door&&"object"==typeof s.door?{...s.door}:void 0,names:s.names&&"object"==typeof s.names?s.names:{},robots:s.robots&&"object"==typeof s.robots?s.robots:{},plan:{floors:Array.isArray(s.plan?.floors)?s.plan.floors.map(t=>({...t,rooms:Array.isArray(t.rooms)?t.rooms:[],doors:Array.isArray(t.doors)?t.doors:[],furniture:Array.isArray(t.furniture)?t.furniture:[],walls:Array.isArray(t.walls)?t.walls:[]})):[],devices:s.plan?.devices&&"object"==typeof s.plan.devices?s.plan.devices:{},hidden:Array.isArray(s.plan?.hidden)?s.plan.hidden:[]}}}const os=t=>JSON.parse(JSON.stringify(t)),as=()=>Math.random().toString(36).slice(2,10),rs=t=>`smartnest.preferences.v1.${t.user?.id??"guest"}`;function ns(t){try{const e=JSON.parse(localStorage.getItem(rs(t))??"{}");return{favorites:[],start_page:"home",page_order:[],simple_mode:!1,font_scale:1,high_contrast:!1,...e,favorites:Array.isArray(e.favorites)?e.favorites.filter(t=>"string"==typeof t):[],page_order:Array.isArray(e.page_order)?e.page_order.filter(t=>"string"==typeof t):[],font_scale:Math.min(1.5,Math.max(.9,Number(e.font_scale)||1))}}catch{return{favorites:[],start_page:"home",page_order:[],simple_mode:!1,font_scale:1,high_contrast:!1}}}function ls(t,e,s=!0){try{const i={...ns(t),...e,...Object.prototype.hasOwnProperty.call(e,"favorites")?{favorites_configured:!0}:{}};if(localStorage.setItem(rs(t),JSON.stringify(i)),window.dispatchEvent(new CustomEvent("sn-preferences-change")),s){const{favorites_configured:s,screen_start_page:i,...o}=e;t.callWS({type:"smartnest_pro/preferences/save",preferences:o}).catch(()=>{})}return!0}catch{return!1}}const cs=t=>t.split(".")[0];let ds={};const ps=(t,e)=>{if(ds[e])return ds[e];const s=t.states[e];return s?.attributes.friendly_name||e.split(".")[1]?.replace(/_/g," ")||e},hs=t=>!!t&&!["off","unavailable","unknown","idle","standby","docked","closed","locked","paused"].includes(t.state),us=t=>!t||"unavailable"===t.state||"unknown"===t.state,gs=t=>{if(!t)return;const e=parseFloat(t.state);return Number.isFinite(e)?e:void 0},ms=t=>{const e=gs(t);if(void 0===e)return;const s=String(t.attributes.unit_of_measurement??"W");return"kW"===s?e:"MW"===s?1e3*e:e/1e3},fs=t=>Object.values(t.areas??{}).sort((t,e)=>t.name.localeCompare(e.name)),bs=(t,e)=>{const s=t.entities?.[e];if(s)return s.area_id?s.area_id:s.device_id?t.devices?.[s.device_id]?.area_id??void 0:void 0},xs=(t,e,s=[])=>Object.values(t.entities??{}).filter(e=>!e.hidden&&!e.entity_category&&!s.includes(e.entity_id)&&t.states[e.entity_id]).filter(s=>bs(t,s.entity_id)===e).map(t=>t.entity_id),vs=["light","switch","fan","media_player","vacuum","cover","lock","humidifier"],ys=(t,e,s)=>e.find(e=>"sensor"===cs(e)&&t.states[e]?.attributes.device_class===s);function $s(t,e,s={}){const i=t.areas?.[e],o=xs(t,e,s.hidden),a=s.climate??o.find(t=>"climate"===cs(t)),r=a?t.states[a]:void 0,n=gs(t.states[s.temperature??ys(t,o,"temperature")??""])??r?.attributes.current_temperature,l=gs(t.states[s.humidity??ys(t,o,"humidity")??""])??r?.attributes.current_humidity,c=s.occupancy??o.find(e=>"binary_sensor"===cs(e)&&["occupancy","presence","motion"].includes(t.states[e]?.attributes.device_class)),d=c?t.states[c]:void 0;let p,h;if(d){const t=gs(d);void 0!==t&&"binary_sensor"!==cs(c)?(p=t,h=t>0):h="on"===d.state}const u=o.filter(t=>vs.includes(cs(t)));return{id:e,name:i?.name??e,size:s.size_m2,climate:a,temperature:n,humidity:l,people:p,occupied:h,nodes:u,activeNodes:u.filter(e=>hs(t.states[e])).length}}function ws(t,e){const s=cs(e),i=t.states[e];return"lock"===s?t.callService("lock","locked"===i?.state?"unlock":"lock",{entity_id:e}):"cover"===s?t.callService("cover","toggle",{entity_id:e}):"vacuum"===s?t.callService("vacuum","cleaning"===i?.state?"return_to_base":"start",{entity_id:e}):"media_player"===s?t.callService("media_player",hs(i)?"turn_off":"turn_on",{entity_id:e}):"scene"===s||"script"===s?t.callService(s,"turn_on",{entity_id:e}):t.callService("homeassistant","toggle",{entity_id:e})}function Cs(t){const e=t?.attributes??{};return{target:"number"==typeof e.temperature?e.temperature:void 0,current:"number"==typeof e.current_temperature?e.current_temperature:void 0,min:"number"==typeof e.min_temp?e.min_temp:16,max:"number"==typeof e.max_temp?e.max_temp:30,step:"number"==typeof e.target_temp_step?e.target_temp_step:.5}}const _s=(t,e,s)=>t.callService("climate","set_temperature",{entity_id:e,temperature:s}),Hs=(t,e)=>Object.keys(t.states).filter(t=>cs(t)===e).filter(e=>{const s=t.entities?.[e];return!s||!s.hidden&&!s.entity_category}).sort((e,s)=>ps(t,e).localeCompare(ps(t,s))),ks=(t,e)=>{const s=bs(t,e);return s?t.areas?.[s]?.name:void 0},Vs=(t,e)=>{const s=t.entities?.[e]?.device_id;return s?Object.values(t.entities??{}).filter(i=>i.device_id===s&&i.entity_id!==e&&t.states[i.entity_id]).map(t=>t.entity_id):[]},Ms=(t,e)=>{const s=Math.max(0,(Date.now()-Date.parse(t))/1e3),i=new Intl.RelativeTimeFormat(e,{numeric:"auto",style:"short"});return s<60?i.format(0,"second"):s<3600?i.format(-Math.round(s/60),"minute"):s<86400?i.format(-Math.round(s/3600),"hour"):i.format(-Math.round(s/86400),"day")};var As=Object.defineProperty,Ls=Object.getOwnPropertyDescriptor,Ss=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Ls(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&As(e,s,a),a};let zs=class extends ct{constructor(){super(...arguments),this.step=0,this.template="keep",this.search="",this.busy=!1,this.error=""}willUpdate(){!this.draft&&this.ctx&&(this.draft=os(this.ctx.config))}set(t){const e=os(this.draft);t(e),this.draft=e}async finish(){if(!this.busy){this.busy=!0,this.error="";try{const t=os(this.draft);"keep"!==this.template&&(t.plan=function(t,e,s){if("empty"===t)return{floors:[],devices:{},hidden:[]};const i=Object.values(e.areas??{}),o="two_floors"===t?2:1,a="wall_tablet"===t?1:3,r="ar"===s;return{floors:Array.from({length:o},(e,s)=>({id:crypto.randomUUID(),name:r?s?"الطابق العلوي":"الطابق الأرضي":s?"Upper floor":"Ground floor",rooms:Array.from({length:a},(e,o)=>({id:crypto.randomUUID(),x:o%2*5,y:4*Math.floor(o/2),w:"wall_tablet"===t?8:5,h:"wall_tablet"===t?6:4,area:i[3*s+o]?.area_id})),doors:[],walls:[],furniture:[],wallHeight:1.05})),devices:{},hidden:[]}}(this.template,this.ctx.hass,this.ctx.lang)),"wall_tablet"===this.template&&(t.settings.performance="light",t.settings.plan_view="2d"),t.experience={...t.experience,setup_completed:!0},await this.complete(t)}catch{this.error=this.ctx.rtl?"تعذّر حفظ الإعدادات. إعداداتك موجودة؛ حاول مرة أخرى.":"Could not save. Your selections are preserved; retry."}finally{this.busy=!1}}}render(){if(!this.draft)return K;const t=this.draft,e="ar"===t.settings.language||"auto"===t.settings.language&&this.ctx.rtl,s=(t,s)=>e?t:s,i=["أهلا وسهلا فيك",s("خلّينا نتعرّف على بيتك","Make yourself at home"),s("اختار نقطة البداية","Choose a starting point"),s("أجهزتك المهمة","Your everyday devices"),s("كل شي جاهز","Ready when you are")],o=Object.keys(this.ctx.hass.states).filter(t=>/^(light|switch|climate|cover|vacuum|media_player)\./.test(t)).filter(t=>ps(this.ctx.hass,t).toLowerCase().includes(this.search.toLowerCase())).slice(0,60),a=(t,e)=>Object.values(this.ctx.hass.states).filter(s=>s.entity_id.startsWith(t+".")&&(!e||s.attributes.device_class===e));return U`<main dir=${e?"rtl":"ltr"}><header><span class="wordmark">Smart<span>Nest</span></span><small>${s("بيتك، أقرب إلك","A little closer to home")}</small></header>
      <section class="card ${0===this.step?"welcome":""}">
      <div class="progress" aria-label=${s("تقدم الإعداد","Setup progress")}>${i.map((t,e)=>U`<span class=${e<=this.step?"active":""}></span>`)}</div>
      ${0===this.step?U`<div class="logo-wrap"><div class="halo"></div><img class="logo" src=${this.ctx.assetBase+"smartnest-logo.png"} alt="SmartNest" width="320" height="320" /></div>`:U`<div class="eyebrow">SMARTNEST · ${this.step+1} / 5</div>`}
      <h1>${i[this.step]}</h1>
      ${0===this.step?U`<p class="intro">${s("بيت أذكى، حياة أريح. خلّينا نجهّز مساحتك على ذوقك، خطوة بخطوة.","A smarter home. A calmer day. Let’s set up your space, one simple step at a time.")}</p><div class="chips"><span>${s("تصميم إلك","Made for you")}</span><span>${s("تحكم أسهل","Effortless control")}</span><span>${s("كل بيتك بمكان واحد","One place for home")}</span></div>`:K}
      ${1===this.step?U`<p>${s("اختار الاسم والمظهر المناسبين. بتقدر تغيّرهم بأي وقت.","Choose your home name and appearance. You can change these anytime.")}</p><label>${s("اسم البيت","Home name")}<input maxlength="80" autocomplete="organization" .value=${t.settings.home_name} @input=${t=>this.set(e=>e.settings.home_name=t.target.value)} placeholder=${s("بيتنا الحلو","Our home")} /></label><div class="grid"><label>${s("اللغة","Language")}<select .value=${t.settings.language} @change=${t=>this.set(e=>e.settings.language=t.target.value)}><option value="auto">${s("لغة الجهاز","Device language")}</option><option value="ar">العربية</option><option value="en">English</option></select></label><label>${s("المظهر","Appearance")}<select .value=${t.settings.theme} @change=${t=>this.set(e=>e.settings.theme=t.target.value)}><option value="auto">${s("تلقائي","Automatic")}</option><option value="light">${s("فاتح دافئ","Warm light")}</option><option value="dark">${s("داكن","Dark")}</option><option value="purple">${s("ليلي بنفسجي","Night purple")}</option></select></label></div><label>${s("أداء الشاشة","Display performance")}<select .value=${t.settings.performance??"auto"} @change=${t=>this.set(e=>e.settings.performance=t.target.value)}><option value="auto">${s("تلقائي حسب الجهاز","Automatic for this device")}</option><option value="light">${s("خفيف للتابلت","Light for tablets")}</option><option value="high">${s("جودة عالية","High quality")}</option></select></label>`:K}
      ${2===this.step?U`<p>${s("قالب قابل للتعديل. ربط الغرف بيستخدم المناطق الموجودة عندك في Home Assistant.","A starting layout you can edit. Rooms link to your existing Home Assistant areas.")}</p><div class="templates">${[["keep",s("احتفظ بتصميمي","Keep my layout")],["empty",s("ابدأ من الصفر","Start fresh")],["apartment",s("شقة مريحة","Cozy apartment")],["two_floors",s("بيت بطابقين","Two-floor home")],["wall_tablet",s("شاشة حائط","Wall display")]].map(([t,e])=>U`<button class="template ${this.template===t?"selected":""}" @click=${()=>this.template=t} aria-pressed=${this.template===t}><span class="mini" aria-hidden="true"><i></i><i></i><i></i></span>${e}</button>`)}</div>${"keep"!==this.template&&t.plan.floors.length?U`<p class="notice">${s("حفظ القالب سيستبدل المخطط الحالي؛ خذ نسخة احتياطية إذا بدك تحتفظ فيه.","Saving a template replaces your current plan. Back it up first if you want to keep it.")}</p>`:K}`:K}
      ${3===this.step?U`<p>${s("اختار المفضلة واربط الحساسات. ما رح نشغّل أي جهاز خلال الإعداد.","Choose favorites and sensors. Setup will not operate any devices.")}</p><label>${s("ابحث عن جهاز","Find a device")}<input type="search" .value=${this.search} @input=${t=>this.search=t.target.value} /></label><div class="devices">${o.length?o.map(e=>U`<label class="check"><input type="checkbox" .checked=${t.home.devices.includes(e)} @change=${t=>this.set(s=>s.home.devices=t.target.checked?[...new Set([...s.home.devices,e])]:s.home.devices.filter(t=>t!==e))} />${ps(this.ctx.hass,e)}</label>`):U`<p>${s("ما في أجهزة مطابقة حاليًا. بتقدر تضيفها لاحقًا.","No matching devices. You can add them later.")}</p>`}</div>${[["weather","weather",void 0,s("الطقس","Weather")],["energy","sensor","energy",s("عداد الطاقة","Energy meter")],["climate","climate",void 0,s("التكييف","Climate")]].map(([e,i,o,r])=>U`<label>${r}<select .value=${t.home[e]??""} @change=${t=>this.set(s=>s.home[e]=t.target.value||void 0)}><option value="">${s("اختار لاحقًا","Choose later")}</option>${a(i,o).map(t=>U`<option value=${t.entity_id}>${ps(this.ctx.hass,t.entity_id)}</option>`)}</select></label>`)}`:K}
      ${4===this.step?U`<p>${s("راجع اختياراتك، وبعدها افتح بيتك الجديد.","Review your choices and open your new home.")}</p><div class="summary"><span>${s("البيت","Home")}<b>${t.settings.home_name||"SmartNest"}</b></span><span>${s("المفضلة","Favorites")}<b>${t.home.devices.length}</b></span><span>${s("الغرف المتاحة","Available rooms")}<b>${Object.keys(this.ctx.hass.areas??{}).length}</b></span></div><div class="tip">${s("من مركز البيت بتلاقي البحث والنسخ الاحتياطي والتنبيهات والمساعدة. ومن «تعديل المخطط» بتصمّم كل زاوية ببيتك.","The Home Center brings together search, backups, alerts and help. Edit the floor plan to make every corner yours.")}</div>`:K}
      ${this.error?U`<p class="notice" role="alert">${this.error}</p>`:K}
      <footer>${this.step?U`<button class="back" ?disabled=${this.busy} @click=${()=>this.step--}>${s("رجوع","Back")}</button>`:this.cancel?U`<button class="back" @click=${this.cancel}>${s("لاحقًا","Later")}</button>`:U`<span></span>`}<button class="next" ?disabled=${this.busy} @click=${()=>this.step<4?this.step++:this.finish()}>${this.busy?s("عم نحفظ…","Saving…"):0===this.step?s("خلّينا نبلّش","Let’s begin"):4===this.step?s("افتح بيتي","Open my home"):s("كمّل","Continue")}<span aria-hidden="true">${e?"←":"→"}</span></button></footer>
      </section><small class="privacy">${s("التحكم بالبيت بيضل داخل Home Assistant. خدمة الترخيص بتتحقق من التفعيل فقط.","Home control stays with Home Assistant. The license service only checks activation.")}</small></main>`}};zs.styles=n`
    :host{display:block;min-height:100dvh;font-family:var(--sn-font,Arial,sans-serif);color:#24312e;background:radial-gradient(ellipse at 50% 0,#fff6de,transparent 60%),#f6f4ef}*{box-sizing:border-box}main{max-width:900px;margin:auto;padding:28px 24px 40px}header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;color:#777e75}.wordmark{font-size:23px;font-weight:750;color:#24312e}.wordmark span{color:#c48b24}.card{max-width:660px;margin:auto;padding:30px 42px;background:#fffcf7;border:1px solid #e9e3d5;border-radius:30px;box-shadow:0 20px 80px #584b2810}.welcome{text-align:center}.progress{display:flex;gap:8px;justify-content:center;margin-bottom:26px}.progress span{width:30px;height:4px;border-radius:4px;background:#e8e6de}.progress .active{background:#b98832}.logo-wrap{position:relative;display:grid;place-items:center;margin:-25px auto -10px;width:min(100%,330px);aspect-ratio:1}.logo{position:relative;width:100%;height:100%;object-fit:contain;animation:reveal 800ms cubic-bezier(.23,1,.32,1) both}.halo{position:absolute;width:72%;height:72%;border-radius:50%;background:radial-gradient(circle,#f6c65a35,transparent 70%);animation:glow 1100ms ease-out both}h1{font-size:clamp(25px,5vw,38px);line-height:1.5;margin:0 0 14px;letter-spacing:-.7px}p{line-height:1.9;font-size:14px;color:#6f776d}.intro{max-width:430px;margin:0 auto 23px}.chips{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:24px}.chips span{border:1px solid #e8e3d7;border-radius:99px;padding:7px 12px;color:#7c7f72;font-size:11px}.eyebrow{color:#a8792d;font-size:11px;letter-spacing:2px;margin:24px 0 12px}label{display:grid;gap:9px;font-size:12px;margin-bottom:17px}input,select{width:100%;padding:13px 14px;border:1px solid #dfdfd5;border-radius:12px;background:white;color:inherit;font:inherit;min-height:44px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}button{font:inherit;cursor:pointer;border:0;border-radius:13px;min-height:46px;padding:12px 19px}button:disabled{opacity:.6;cursor:wait}button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #d8a543;outline-offset:3px}.templates{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:24px 0}.template{border:1px solid #e4dfd3;background:white;text-align:start;font-size:13px;color:#53604f}.template.selected{border-color:#a77b32;background:#fbf5e5;box-shadow:0 0 0 1px #a77b32}.mini{display:grid;grid-template-columns:1fr 1fr;gap:3px;width:46px;height:35px;margin-bottom:12px}.mini i{border:1px solid #b4bbab;background:#e9eddf}.mini i:last-child{grid-column:1/-1}.devices{max-height:205px;overflow:auto;border:1px solid #e8e5dc;border-radius:13px;padding:12px;margin-bottom:20px}.check{display:flex;align-items:center;gap:10px;margin:0;padding:9px 2px}.check input{width:17px;min-height:17px;accent-color:#315d45}.summary{display:grid;gap:12px;background:#f2f3eb;padding:20px;border-radius:16px;margin:25px 0}.summary span{display:flex;justify-content:space-between;font-size:13px}.tip{padding:18px;border-inline-start:3px solid #c29a43;background:#fbf4e3;font-size:13px;line-height:1.9}.notice{color:#9c4230;background:#fff0e9;padding:12px;border-radius:12px}footer{display:flex;align-items:center;justify-content:space-between;margin-top:30px;gap:12px}.next{display:flex;align-items:center;justify-content:center;gap:25px;background:#284c3b;color:#fff;min-width:165px}.back{color:#6d786b;background:#eeefe8}.privacy{display:block;max-width:600px;margin:25px auto;text-align:center;line-height:1.8;color:#8a8c7f;font-size:10px}@keyframes reveal{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}@keyframes glow{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.logo,.halo{animation:none}}@media(max-width:550px){main{padding:20px 14px}.card{padding:23px;border-radius:24px}header small{font-size:10px}.logo-wrap{width:260px}footer{margin-top:25px}.grid{grid-template-columns:1fr}.next{min-width:145px}.templates{gap:9px}}`,Ss([gt({attribute:!1})],zs.prototype,"ctx",2),Ss([gt({attribute:!1})],zs.prototype,"complete",2),Ss([gt({attribute:!1})],zs.prototype,"cancel",2),Ss([mt()],zs.prototype,"step",2),Ss([mt()],zs.prototype,"draft",2),Ss([mt()],zs.prototype,"template",2),Ss([mt()],zs.prototype,"search",2),Ss([mt()],zs.prototype,"busy",2),Ss([mt()],zs.prototype,"error",2),zs=Ss([pt("sn-onboarding")],zs);const Ps={good_morning:"Good morning,",good_afternoon:"Good afternoon,",good_evening:"Good evening,",home:"Home",rooms:"Rooms",search:"Search for a room or device…",eco_solar:"Solar {kw} kW",eco_share:"Solar covers {pct}% today",energy_usage:"Energy Usage",vs_yesterday:"{pct}% vs yesterday",no_energy:"Pick an energy meter in edit mode",climate_comfort:"Climate & Comfort",target:"Target {t}°",mode_auto:"Auto",mode_cool:"Cold",mode_heat:"Warm",mode_eco:"Eco",mode_off:"Off",smart_devices:"Smart Devices",intensity:"Intensity",low:"Low",medium:"Medium",high:"High",volume:"Volume",customize_color:"Customize color",scenes:"Scenes",zonal_climate:"Zonal climate control",nodes_in_room:"Nodes connected in a room",taken_people:"Taken ({n} people)",taken:"Taken",free:"Free",humidity:"{h}% Humidity",devices_count:"{n} devices",devices_on:"{n} on",no_climate:"No thermostat in this room",no_nodes:"No devices in this room",not_configured:"Not set up yet",pick_in_edit:"Choose devices in edit mode",no_rooms:"No areas yet. Create them in Settings → Areas.",edit:"Edit",save:"Save",cancel:"Cancel",done:"Done",settings:"Settings",add_pin:"Add pin",change_image:"Change image",reset_image:"Remove image",upload_house:"Add a picture of your house",upload_house_hint:"Press Edit, then Change image",uploading:"Uploading…",upload_failed:"Upload failed",saved:"Saved",save_failed:"Couldn't save",pin:"Pin",pin_room:"Room",pin_device:"Device",label:"Label",delete:"Delete",none:"None",choose:"Choose…",search_entities:"Search…",home_name:"Home name",language:"Language",lang_auto:"Same as Home Assistant",theme:"Theme",theme_auto:"Follow Home Assistant",theme_light:"Light",theme_dark:"Dark",theme_purple:"Night purple",reduce_effects:"Reduce effects (no blur)",default_room:"Default room",energy_meter:"Energy meter (kWh)",solar_power:"Solar power now (W/kW)",solar_energy:"Solar energy meter (kWh)",climate_entity:"Thermostat",humidity_sensor:"Humidity sensor",favorite_devices:"Favorite devices",scene_buttons:"Scene buttons",room_settings:"Room settings",size_m2:"Size (m²)",occupancy_sensor:"Occupancy sensor",temperature_sensor:"Temperature sensor",hidden_devices:"Hidden devices",edit_on_bigger:"Editing works on a tablet or computer",locked:"Locked",unlocked:"Unlocked",on:"On",off:"Off",open_menu:"Menu",brightness:"Brightness",position:"Position",opened:"Open",closed:"Closed",open:"Open",close:"Close",stop:"Stop",more:"More",climate:"Climate",n_running:"{n} running",fans:"Fans",all_ac_off:"All off",robot:"Robot",battery:"Battery {n}%",start:"Start",pause:"Pause",dock:"Dock",locate:"Locate",fan_speed:"Suction",st_cleaning:"Cleaning",st_docked:"Docked",st_returning:"Returning",st_idle:"Idle",st_paused:"Paused",st_error:"Error",st_mowing:"Mowing",map:"Map",family:"Family",at_home:"{n} at home",home_state:"Home",away:"Away",energy:"Energy",today:"Today",yesterday:"Yesterday",this_month:"This month",last_7_days:"Last 7 days",top_consumers:"Using power now",solar_today:"Solar today",now_using:"Using now",security:"Security",locks:"Locks",doors_windows:"Doors & windows",cameras:"Cameras",alarm:"Alarm",all_locked:"All locked",all_closed:"All closed",n_open:"{n} open",n_unlocked:"{n} unlocked",arm_home:"Arm home",arm_away:"Arm away",disarm:"Disarm",lock_all:"Lock all",confirm_unlock:"Hold to unlock",st_open:"Open",st_closed:"Closed",lights:"Lights",n_lights_on:"{n} on",all_off:"All off",other:"Other",media:"Media",nothing_playing:"Nothing playing",n_playing:"{n} playing",hide:"Hide",hidden_items:"Hidden",show:"Show",nothing_hidden:"Nothing is hidden",open_in_ha:"More in Home Assistant",live:"Live",fullscreen:"Full screen",last_24h:"Last 24 hours",changed:"Changed {t}",places_today:"Today",route_today:"Route today",lock:"Lock",unlock:"Unlock",hold_unlock:"Hold to unlock",run:"Run",enter_code:"Enter code",no_location:"No location yet",timer:"Timer",expand:"Expand",rename:"Rename",kiosk_mode:"Kiosk mode",kiosk_pin:"PIN (numbers)",kiosk_on_device:"Kiosk mode on this screen",kiosk_hint:"Hides Home Assistant's sidebar on this screen only. Editing, renaming and leaving kiosk mode need the PIN (tap 🔒 at the top). Tip: add ?kiosk to the address to turn it on from a non-admin tablet.",kiosk_need_pin:"Set a PIN first, then turn kiosk mode on.",enter_pin:"Enter PIN",wrong_pin:"Wrong PIN",exit_kiosk:"Leave kiosk mode",display:"Display",picture_source:"Picture (camera)",person_seen:"Person",someone_at_door:"Someone's at the door",hold_to_open:"Hold to open",door_opened:"Opening…",front_door:"Front door",doorbell:"Doorbell",door_camera:"Door camera",door_open:"Opens the door",door_hint:"When the doorbell rings, kiosk screens show the door camera live, with Open (hold) if you pick what opens the door.",door_test:"Try the popup",weather:"Weather",w_sunny:"Sunny","w_clear-night":"Clear night",w_cloudy:"Cloudy",w_partlycloudy:"Partly cloudy",w_fog:"Fog",w_hail:"Hail",w_lightning:"Thunder","w_lightning-rainy":"Thunderstorm",w_pouring:"Heavy rain",w_rainy:"Rain",w_snowy:"Snow","w_snowy-rainy":"Sleet",w_windy:"Windy","w_windy-variant":"Windy and cloudy",w_exceptional:"Dusty",nobody_home:"Nobody home",grid_power:"Grid",names_on_top:"Names at the top",greeting_name:"Name in the greeting",dashboard_title:"Dashboard title",names_on_top_hint:'Leave empty to use your Home Assistant name and "SmartNest".',room_name:"Room name on the dashboard",hide_room:"Hide this room",view:"View",view_top:"Top",view_high:"High",view_normal:"Normal",view_low:"Low",view_eye:"Eye level",robot_map:"Robot's map",clean_rooms:"Clean rooms",clear:"Clear",all:"All",robot_setup:"Robot rooms",robot_rooms_hint:"Press ⚙ to link your floor plan's rooms to the robot's rooms.",passes:"Passes",clean_selected:"Clean {n} rooms",pick_rooms:"Pick rooms to clean",cleaning_n:"Cleaning {n} rooms",robot_setup_hint:"Link each room of your floor plan to the same room in the robot's app. Roborock rooms can be read from the robot and matched by name.",robot_floor:"Floor the robot cleans",read_robot_rooms:"Read rooms from the robot",robot_rooms_failed:"Couldn't read rooms from the robot. Enter each room's number from the Roborock app instead.",loading:"Loading…",color:"Color",temperature:"Temperature",warm:"Warm",cool:"Cool",neutral:"Neutral",reset_name:"Use Home Assistant's name",ha_name:"In Home Assistant: {name}",tap_zoom:"Zoom to device on tap",tap_zoom_on:"Tap a device to zoom to it",tap_zoom_off:"Tap a device to switch it",rotate_left:"Rotate left",rotate_right:"Rotate right",floor_plan:"Floor plan",timer_set:"Turns off in {n} min",draw_plan:"Draw your floor plan",draw_plan_hint:"Press Edit, then Edit plan",edit_plan:"Edit plan",plan_failed:"The 3D view couldn't start on this device",floor_n:"Floor {n}",add_floor:"Add floor",floor_name:"Floor name",delete_floor:"Delete floor",tool_room:"Rooms",tool_door:"Doors",tool_photo:"Photo",tool_furniture:"Furniture",hint_furniture:"Pick a piece below, then tap the plan to place it. Drag a piece to move it; tap it to rotate, link a device or delete.",hint_place:"Tap the plan where it should go.",link_device:"Linked device",tool_shape:"Shape",tool_wall:"Walls",tool_open:"Open",hint_shape:"Tap each corner of the room in order. Tap the first corner again (or Finish) to close it. Corners snap to the grid and to other rooms.",hint_wall:"Tap where a wall starts, then where it ends. It keeps going from there; tap the last point again or Done to stop. Tap a drawn wall to delete it.",hint_open:"Tap a wall to take it out, e.g. between the kitchen and living room. Tap the dashed line to put it back.",points_n:"{n} corners",undo_point:"Undo",finish_room:"Finish room",delete_point:"Delete corner",wall:"Wall",height_above_floor:"Height above floor",hang_down:"Hang below ceiling",size:"Size",length:"Length",reset:"Reset",wall_height:"Wall height",search_furniture:"Search furniture…",hint_room:"Drag on the grid to draw a rectangle room. Tap a room to select it: drag it to move, drag its corners to reshape it, tap + on an edge to add a corner.",hint_door:"Tap a wall to cut a doorway. Tap a doorway again to close it.",hint_photo:"Upload a photo of your floor plan, set its width in metres, and drag it under your rooms to trace.",unlinked:"Not linked",upload_plan_photo:"Upload plan photo",photo_width:"Photo width (m)",photo_opacity:"Opacity",back:"Back"},Es={good_morning:"صباح الخير،",good_afternoon:"مساء الخير،",good_evening:"مساء الخير،",home:"الرئيسية",rooms:"الغرف",search:"دوّر على غرفة أو جهاز…",eco_solar:"الطاقة الشمسية {kw} ك.واط",eco_share:"الشمس غطّت {pct}% اليوم",energy_usage:"استهلاك الكهرباء",vs_yesterday:"{pct}% عن مبارح",no_energy:"اختار عداد الكهرباء بوضع التعديل",climate_comfort:"المناخ والراحة",target:"الهدف {t}°",mode_auto:"تلقائي",mode_cool:"تبريد",mode_heat:"تدفئة",mode_eco:"توفير",mode_off:"إطفاء",smart_devices:"الأجهزة الذكية",intensity:"الإضاءة",low:"منخفض",medium:"متوسط",high:"عالي",volume:"الصوت",customize_color:"اختار اللون",scenes:"المشاهد",zonal_climate:"تحكم بحرارة الغرفة",nodes_in_room:"الأجهزة بالغرفة",taken_people:"فيها {n} أشخاص",taken:"فيها حدا",free:"فاضية",humidity:"رطوبة {h}%",devices_count:"{n} أجهزة",devices_on:"{n} شغّالين",no_climate:"ما في مكيف بهالغرفة",no_nodes:"ما في أجهزة بهالغرفة",not_configured:"لسا مش مضبوط",pick_in_edit:"اختار الأجهزة بوضع التعديل",no_rooms:"ما في مناطق لسا. اعملها من الإعدادات ← المناطق.",edit:"تعديل",save:"حفظ",cancel:"إلغاء",done:"تم",settings:"الإعدادات",add_pin:"زيد علامة",change_image:"غيّر الصورة",reset_image:"شيل الصورة",upload_house:"حط صورة لبيتك",upload_house_hint:"اضغط تعديل، بعدين غيّر الصورة",uploading:"عم يرفع…",upload_failed:"ما زبط الرفع",saved:"انحفظ",save_failed:"ما انحفظ",pin:"علامة",pin_room:"غرفة",pin_device:"جهاز",label:"الاسم",delete:"احذف",none:"ولا شي",choose:"اختار…",search_entities:"دوّر…",home_name:"اسم البيت",language:"اللغة",lang_auto:"متل Home Assistant",theme:"الشكل",theme_auto:"متل Home Assistant",theme_light:"فاتح",theme_dark:"غامق",theme_purple:"بنفسجي ليلي",reduce_effects:"خفّف المؤثرات (بدون ضباب)",default_room:"الغرفة الأساسية",energy_meter:"عداد الكهرباء (ك.واط.س)",solar_power:"إنتاج الشمس هلأ (واط)",solar_energy:"عداد الطاقة الشمسية (ك.واط.س)",climate_entity:"المكيف",humidity_sensor:"حساس الرطوبة",favorite_devices:"الأجهزة المفضلة",scene_buttons:"أزرار المشاهد",room_settings:"إعدادات الغرفة",size_m2:"المساحة (م²)",occupancy_sensor:"حساس التواجد",temperature_sensor:"حساس الحرارة",hidden_devices:"أجهزة مخفية",edit_on_bigger:"التعديل بيصير من التابلت أو الكمبيوتر",locked:"مسكّر",unlocked:"مفتوح",on:"شغّال",off:"طافي",open_menu:"القائمة",brightness:"الإضاءة",position:"الفتحة",opened:"مفتوحة",closed:"مسكّرة",open:"افتح",close:"سكّر",stop:"وقّف",more:"المزيد",climate:"المكيفات",n_running:"{n} شغّالين",fans:"المراوح",all_ac_off:"طفّي الكل",robot:"الروبوت",battery:"البطارية {n}%",start:"ابدأ",pause:"وقّف مؤقت",dock:"ارجع للقاعدة",locate:"وينك؟",fan_speed:"قوة الشفط",st_cleaning:"عم ينظّف",st_docked:"بالقاعدة",st_returning:"راجع",st_idle:"واقف",st_paused:"موقّف",st_error:"في مشكلة",st_mowing:"عم يقص",map:"الخريطة",family:"العيلة",at_home:"{n} بالبيت",home_state:"بالبيت",away:"برّا",energy:"الكهرباء",today:"اليوم",yesterday:"مبارح",this_month:"هالشهر",last_7_days:"آخر 7 أيام",top_consumers:"شو عم يصرف هلأ",solar_today:"الشمس اليوم",now_using:"الاستهلاك هلأ",security:"الأمان",locks:"الأقفال",doors_windows:"الأبواب والشبابيك",cameras:"الكاميرات",alarm:"الإنذار",all_locked:"كلهم مسكّرين",all_closed:"كلهم مسكّرين",n_open:"{n} مفتوحين",n_unlocked:"{n} مش مقفولين",arm_home:"تفعيل بالبيت",arm_away:"تفعيل برّا",disarm:"إلغاء",lock_all:"اقفل الكل",confirm_unlock:"اضغط مطوّل لتفتح",st_open:"مفتوح",st_closed:"مسكّر",lights:"الإضاءة",n_lights_on:"{n} شغّالين",all_off:"طفّي الكل",other:"غير",media:"الميديا",nothing_playing:"ما في شي شغّال",n_playing:"{n} شغّالين",hide:"خبّي",hidden_items:"المخفي",show:"رجّعه",nothing_hidden:"ما في شي مخفي",open_in_ha:"تفاصيل أكتر بـ Home Assistant",live:"مباشر",fullscreen:"شاشة كاملة",last_24h:"آخر 24 ساعة",changed:"تغيّر {t}",places_today:"اليوم",route_today:"طريق اليوم",lock:"اقفل",unlock:"افتح",hold_unlock:"اضغط مطوّل لتفتح",run:"شغّل",enter_code:"دخّل الرمز",no_location:"ما في موقع لسا",timer:"مؤقت",expand:"كبّر",rename:"غيّر الاسم",kiosk_mode:"وضع الكشك",kiosk_pin:"الرمز (أرقام)",kiosk_on_device:"وضع الكشك على هالشاشة",kiosk_hint:"بيخبّي قائمة Home Assistant الجانبية على هالشاشة بس. التعديل وتغيير الأسامي والطلوع من الوضع بدهن الرمز (اكبس 🔒 فوق). نصيحة: زيد ?kiosk على العنوان لتشغّله من تابلت مش أدمن.",kiosk_need_pin:"حط رمز أول، وبعدين شغّل وضع الكشك.",enter_pin:"دخّل الرمز",wrong_pin:"الرمز غلط",exit_kiosk:"اطلع من وضع الكشك",display:"العرض",picture_source:"الصورة (كاميرا)",person_seen:"في شخص",someone_at_door:"في حدا عالباب",hold_to_open:"اضغط مطوّل لتفتح",door_opened:"عم يفتح…",front_door:"الباب",doorbell:"الجرس",door_camera:"كاميرا الباب",door_open:"شو بيفتح الباب",door_hint:"لما حدا يدق الجرس، شاشات الكشك بتفرجيك كاميرا الباب لايف، مع زر فتح (ضغط مطوّل) إذا اخترت شو بيفتح الباب.",door_test:"جرّب النافذة",weather:"الطقس",w_sunny:"مشمس","w_clear-night":"صافي",w_cloudy:"غايم",w_partlycloudy:"غيم خفيف",w_fog:"ضباب",w_hail:"برَد",w_lightning:"رعد","w_lightning-rainy":"عاصفة رعدية",w_pouring:"مطر قوي",w_rainy:"مطر",w_snowy:"تلج","w_snowy-rainy":"تلج ومطر",w_windy:"هوا","w_windy-variant":"هوا وغيم",w_exceptional:"غبرة",nobody_home:"ما في حدا بالبيت",grid_power:"الكهربا",names_on_top:"الأسماء يلي فوق",greeting_name:"الاسم بالترحيب",dashboard_title:"اسم الداشبورد",names_on_top_hint:'إذا تركتهن فاضيين، بيبيّن اسمك بـ Home Assistant و"SmartNest".',room_name:"اسم الغرفة بالداشبورد",hide_room:"خبّي هالغرفة",view:"عرض",view_top:"من فوق",view_high:"عالي",view_normal:"عادي",view_low:"منخفض",view_eye:"مستوى العين",robot_map:"خريطة الروبوت",clean_rooms:"نظّف غرف",clear:"امسح",all:"الكل",robot_setup:"غرف الروبوت",robot_rooms_hint:"اضغط ⚙ لتربط غرف المخطط بغرف الروبوت.",passes:"عدد المرات",clean_selected:"نظّف {n} غرف",pick_rooms:"اختار الغرف يلي بدك تنظفها",cleaning_n:"عم ينظّف {n} غرف",robot_setup_hint:"اربط كل غرفة بالمخطط بنفس الغرفة بتطبيق الروبوت. غرف Roborock بتنقرى من الروبوت وبتنربط حسب الاسم.",robot_floor:"الطابق يلي بينظفه الروبوت",read_robot_rooms:"اقرا الغرف من الروبوت",robot_rooms_failed:"ما قدرت اقرا الغرف من الروبوت. دخّل رقم كل غرفة من تطبيق Roborock.",loading:"عم يحمّل…",color:"لون",temperature:"حرارة",warm:"دافي",cool:"بارد",neutral:"عادي",reset_name:"رجّع اسم Home Assistant",ha_name:"بـ Home Assistant: {name}",tap_zoom:"قرّب عالجهاز لما تضغط",tap_zoom_on:"اضغط على جهاز لتقرّب عليه",tap_zoom_off:"اضغط على جهاز لتشغّله أو تطفيه",rotate_left:"لفّ لليسار",rotate_right:"لفّ لليمين",floor_plan:"مخطط البيت",timer_set:"بينطفي بعد {n} دقيقة",draw_plan:"ارسم مخطط بيتك",draw_plan_hint:"اضغط تعديل، بعدين عدّل المخطط",edit_plan:"عدّل المخطط",plan_failed:"العرض الثلاثي الأبعاد ما اشتغل على هالجهاز",floor_n:"طابق {n}",add_floor:"زيد طابق",floor_name:"اسم الطابق",delete_floor:"احذف الطابق",tool_room:"غرف",tool_door:"أبواب",tool_photo:"صورة",tool_furniture:"أثاث",hint_furniture:"اختار قطعة من تحت، بعدين اضغط عالمخطط لتحطها. اسحب القطعة لتحركها، واضغط عليها لتلفها أو تربطها بجهاز أو تحذفها.",hint_place:"اضغط عالمخطط وين بدك تحطها.",link_device:"الجهاز المربوط",tool_shape:"شكل",tool_wall:"حيطان",tool_open:"فتح",hint_shape:"اضغط على كل زاوية من الغرفة بالترتيب. اضغط على أول زاوية مرة تانية (أو خلّص) لتسكّرها. الزوايا بتلزق بالشبكة وبالغرف التانية.",hint_wall:"اضغط وين بيبلّش الحيط، بعدين وين بيخلص. بيكمّل من هونيك؛ اضغط على آخر نقطة مرة تانية أو تم لتوقف. اضغط على حيط مرسوم لتحذفه.",hint_open:"اضغط على حيط لتشيله، مثلاً بين المطبخ والصالة. اضغط على الخط المقطّع لترجّعه.",points_n:"{n} زوايا",undo_point:"تراجع",finish_room:"خلّص الغرفة",delete_point:"احذف الزاوية",wall:"حيط",height_above_floor:"الارتفاع عن الأرض",hang_down:"النزول عن السقف",size:"الحجم",length:"الطول",reset:"رجّع",wall_height:"ارتفاع الحيطان",search_furniture:"دوّر عالأثاث…",hint_room:"اسحب على الشبكة لترسم غرفة مستطيلة. اضغط على غرفة لتختارها: اسحبها لتحركها، اسحب زواياها لتغيّر شكلها، واضغط + على الضلع لتزيد زاوية.",hint_door:"اضغط على حيط لتفتح باب. اضغط عالباب مرة تانية لتسكّره.",hint_photo:"حط صورة لمخطط بيتك، اكتب عرضها بالمتر، واسحبها تحت الغرف لترسم فوقها.",unlinked:"مش مربوطة",upload_plan_photo:"حط صورة المخطط",photo_width:"عرض الصورة (م)",photo_opacity:"الشفافية",back:"رجوع"};function Os(t){const e="ar"===t?Es:Ps;return(t,s)=>{let i=e[t]??Ps[t]??t;if(s)for(const[e,o]of Object.entries(s))i=i.replace(`{${e}}`,String(o));return i}}const Zs=(t,e)=>"auto"===t?e.startsWith("ar")?"ar":"en":t,js=(t,e=20)=>U`<svg class="icon" width=${e} height=${e} viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex:none">
    ${B`<path fill="currentColor" d=${t}></path>`}
  </svg>`;function Ts(t,e){const s=cs(t),i=e?.attributes.device_class;return"person"===s?"M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z":"camera"===s?Lt:"alarm_control_panel"===s?Ae:"image"===s?ie:"light"===s?t.includes("ceiling")?St:"M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z":"media_player"===s?"tv"===i||/tv|oled/i.test(t)?Re:Oe:"vacuum"===s?$e:"fan"===s?Ut:"climate"===s?$t:"lock"===s?le:"cover"===s?Mt:"humidifier"===s?Xe:"sensor"===s&&"power"===i?/solar|pv/i.test(t)?Ee:Gt:"sensor"===s&&"temperature"===i?Ie:"sensor"===s?"M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.81,9.77L11.71,10C11,10.13 10.41,10.6 10.14,11.26C9.73,12.29 10.23,13.45 11.26,13.86C12.29,14.27 13.45,13.77 13.86,12.74C14.12,12.08 14,11.32 13.57,10.76L13.67,10.5L14.96,7.29L14.97,7.26C15.17,6.75 14.92,6.17 14.41,5.96C14.28,5.91 14.15,5.89 14,5.89M10,6A1,1 0 0,0 9,7A1,1 0 0,0 10,8A1,1 0 0,0 11,7A1,1 0 0,0 10,6M7,9A1,1 0 0,0 6,10A1,1 0 0,0 7,11A1,1 0 0,0 8,10A1,1 0 0,0 7,9M17,9A1,1 0 0,0 16,10A1,1 0 0,0 17,11A1,1 0 0,0 18,10A1,1 0 0,0 17,9Z":"switch"===s?"outlet"===i?"M16 7V3H14V7H10V3H8V7C7 7 6 8 6 9V14.5L9.5 18V21H14.5V18L18 14.5V9C18 8 17 7 16 7M16 13.67L13.09 16.59L12.67 17H11.33L10.92 16.59L8 13.67V9.09C8 9.06 8.06 9 8.09 9H15.92C15.95 9 16 9.06 16 9.09V13.67Z":"M17 6H7C3.69 6 1 8.69 1 12S3.69 18 7 18H17C20.31 18 23 15.31 23 12S20.31 6 17 6M17 16H7C4.79 16 3 14.21 3 12S4.79 8 7 8H17C19.21 8 21 9.79 21 12S19.21 16 17 16M17 9C15.34 9 14 10.34 14 12S15.34 15 17 15 20 13.66 20 12 18.66 9 17 9Z":ee}const Ds=(t,e)=>t.config.pages[e]?.hidden??[],Fs=(t,e,s)=>{const i=Ds(t,e);return i.length?s.filter(t=>!i.includes(t)):s},Rs=(t,e,s)=>t.update(t=>{const i=t.pages[e]??={};i.hidden=s(i.hidden??[])});function Is(t,e,s,i){return t.editing?U`<div class="hideable">
    ${i}
    <button
      class="hide-x"
      aria-label=${t.t("hide")}
      title=${t.t("hide")}
      @click=${i=>{i.stopPropagation(),Rs(t,e,t=>[...t,s])}}
    >
      ${js(Et,16)}
    </button>
  </div>`:i}function Ns(t,e,s=e=>ps(t.hass,e)){if(!t.editing)return K;const i=Ds(t,e).length;return U`<button
    class="action"
    @click=${()=>t.showSheet({title:t.t("hidden_items"),icon:Nt,render:t=>{const i=Ds(t,e);return i.length?U`<div class="restore-list">
                ${i.map(i=>U`<div class="restore">
                    <span>${s(i)}</span>
                    <button @click=${()=>Rs(t,e,t=>t.filter(t=>t!==i))}>${js(Wt,18)}${t.t("show")}</button>
                  </div>`)}
              </div>`:U`<div class="empty">${t.t("nothing_hidden")}</div>`}})}
  >
    ${js(Nt,18)}${t.t("hidden_items")} · ${i}
  </button>`}const Ws=n`
  .hideable {
    position: relative;
    display: grid;
    min-width: 0;
  }
  .hideable > :first-child {
    animation: wiggle 0.5s ease-in-out infinite alternate;
  }
  @keyframes wiggle {
    from {
      transform: rotate(-0.4deg);
    }
    to {
      transform: rotate(0.4deg);
    }
  }
  .hide-x {
    position: absolute;
    top: -8px;
    inset-inline-end: -8px;
    z-index: 3;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.85);
    background: #b5442f;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 6px 14px -4px rgba(0, 0, 0, 0.5);
  }
  .restore-list {
    display: grid;
    gap: 8px;
  }
  .restore {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 10px 10px 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.06);
  }
  .restore span {
    flex: 1;
  }
  .restore button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 14px;
    border-radius: 999px;
    border: 0;
    background: var(--sn-accent);
    color: #1d2a12;
    cursor: pointer;
    font-size: 13px;
  }
`;const Us=n`
  :host {
    --sn-font: "SN Outfit", "SN Alexandria", system-ui, -apple-system, "Segoe UI", sans-serif;
    --sn-accent: #b5dc8f;
    --sn-accent-strong: #9ccf6c;
    --sn-accent-glow: rgba(181, 220, 143, 0.55);
    --sn-bg: radial-gradient(120% 90% at 70% 10%, #d8d0c6 0%, #b8afa5 45%, #8e867e 100%);
    --sn-text-on-bg: #fbf8f4;
    --sn-text-on-bg-dim: rgba(251, 248, 244, 0.62);
    --sn-glass: rgba(74, 68, 62, 0.46);
    --sn-glass-strong: rgba(58, 53, 48, 0.62);
    --sn-glass-light: rgba(255, 255, 255, 0.16);
    --sn-glass-border: rgba(255, 255, 255, 0.16);
    --sn-glass-hi: rgba(255, 255, 255, 0.28);
    --sn-text: #f6f2ed;
    --sn-text-dim: rgba(246, 242, 237, 0.62);
    --sn-text-faint: rgba(246, 242, 237, 0.38);
    --sn-ink: #0b0b0b;
    --sn-chip: rgba(255, 255, 255, 0.1);
    --sn-shadow: 0 18px 40px -18px rgba(40, 32, 24, 0.45);
    --sn-blur: blur(22px) saturate(140%);
    --sn-radius: 28px;
    --sn-radius-sm: 18px;
    --sn-hero-filter: none;
    --sn-hero-fade: 72%;
    color-scheme: light;
  }
  :host([dark]) {
    --sn-bg: radial-gradient(120% 90% at 70% 10%, #34302c 0%, #1f1d1b 50%, #121110 100%);
    --sn-text-on-bg: #f3efe9;
    --sn-text-on-bg-dim: rgba(243, 239, 233, 0.55);
    --sn-glass: rgba(255, 255, 255, 0.06);
    --sn-glass-strong: rgba(255, 255, 255, 0.09);
    --sn-glass-light: rgba(255, 255, 255, 0.08);
    --sn-glass-border: rgba(255, 255, 255, 0.09);
    --sn-glass-hi: rgba(255, 255, 255, 0.16);
    --sn-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.7);
    --sn-hero-filter: brightness(0.78) contrast(1.06) saturate(0.9);
    --sn-hero-fade: 55%;
    color-scheme: dark;
  }
  :host([lowfx]) {
    --sn-blur: none;
    --sn-glass: rgba(74, 68, 62, 0.9);
    --sn-glass-strong: rgba(58, 53, 48, 0.95);
  }
  :host([dark][lowfx]) {
    --sn-glass: #2a2724;
    --sn-glass-strong: #322e2b;
  }
  /* Night purple: deep indigo with lavender glass, a blue accent and an orange "warm" accent. */
  :host([palette="purple"]) {
    --sn-bg: radial-gradient(70% 55% at 15% 100%, rgba(214, 120, 220, 0.38) 0%, rgba(214, 120, 220, 0) 70%),
      radial-gradient(120% 90% at 70% 0%, #4d43a6 0%, #29235f 45%, #15122f 100%);
    --sn-text-on-bg: #f4f2ff;
    --sn-text-on-bg-dim: rgba(226, 222, 255, 0.6);
    --sn-glass: rgba(118, 106, 214, 0.2);
    --sn-glass-strong: rgba(64, 54, 150, 0.62);
    --sn-glass-light: rgba(150, 140, 240, 0.14);
    --sn-glass-border: rgba(200, 190, 255, 0.16);
    --sn-glass-hi: rgba(220, 214, 255, 0.24);
    --sn-text: #f4f2ff;
    --sn-text-dim: rgba(226, 222, 255, 0.62);
    --sn-text-faint: rgba(226, 222, 255, 0.38);
    --sn-ink: #110e29;
    --sn-chip: rgba(160, 150, 255, 0.12);
    --sn-accent: #9fb0ff;
    --sn-accent-strong: #7d90ff;
    --sn-accent-glow: rgba(140, 160, 255, 0.55);
    --sn-warm: #ff8a3d;
    --sn-shadow: 0 18px 40px -18px rgba(8, 4, 30, 0.8);
    --sn-hero-filter: none;
    --sn-hero-fade: 72%;
  }
  :host([palette="purple"][lowfx]) {
    --sn-glass: #2c2670;
    --sn-glass-strong: #352e85;
  }
`,Bs=[n`
  :host {
    font-family: var(--sn-font);
    -webkit-tap-highlight-color: transparent;
  }
  * {
    box-sizing: border-box;
  }
  .glass {
    position: relative;
    background: var(--sn-glass);
    backdrop-filter: var(--sn-blur);
    -webkit-backdrop-filter: var(--sn-blur);
    border: 1px solid var(--sn-glass-border);
    border-radius: var(--sn-radius);
    box-shadow: var(--sn-shadow), inset 0 1px 0 var(--sn-glass-hi);
    color: var(--sn-text);
  }
  .card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .card-head h3 {
    flex: 1;
    margin: 0;
    font-size: 19px;
    font-weight: 400;
    letter-spacing: -0.01em;
  }
  .round {
    display: grid;
    place-items: center;
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--sn-glass-border);
    background: var(--sn-chip);
    color: inherit;
    cursor: pointer;
    padding: 0;
    font: inherit;
    transition: transform 0.15s ease, background 0.2s ease;
  }
  .round:active {
    transform: scale(0.94);
  }
  .round.light {
    background: #fff;
    color: #1d1b19;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 14px 0 6px;
    border-radius: 999px;
    background: var(--sn-chip);
    border: 1px solid var(--sn-glass-border);
    font-size: 13px;
    white-space: nowrap;
  }
  .chip .ic {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  .empty {
    display: grid;
    place-items: center;
    min-height: 90px;
    padding: 12px;
    color: var(--sn-text-faint);
    font-size: 13px;
    text-align: center;
  }
  .gear {
    width: 38px;
    height: 38px;
  }
  button {
    font-family: inherit;
  }
  .switch {
    position: relative;
    width: 52px;
    height: 30px;
    border-radius: 999px;
    border: 1px solid var(--sn-glass-border);
    background: rgba(255, 255, 255, 0.12);
    cursor: pointer;
    padding: 0;
    transition: background 0.25s ease, box-shadow 0.25s ease;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    inset-inline-start: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #fff;
    transition: inset-inline-start 0.25s cubic-bezier(0.3, 1.4, 0.5, 1);
  }
  .switch[on] {
    background: var(--sn-accent);
    box-shadow: 0 0 16px var(--sn-accent-glow);
  }
  .switch[on]::after {
    inset-inline-start: 25px;
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`,Ws],qs=n`
  .field-hint { font-size: 11px; line-height: 1.7; color: var(--sn-text-dim); }
  .field {
    display: grid;
    gap: 6px;
    margin-bottom: 16px;
  }
  .field > span {
    font-size: 13px;
    color: var(--sn-text-dim);
  }
  select,
  input[type="text"],
  input[type="number"],
  input[type="password"] {
    width: 100%;
    height: 44px;
    padding: 0 12px;
    border-radius: 14px;
    border: 1px solid var(--sn-glass-border);
    background: rgba(0, 0, 0, 0.18);
    color: var(--sn-text);
    font: inherit;
    font-size: 15px;
  }
  select option {
    color: #1d1b19;
    background: #fff;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 32px;
    padding: 0 6px 0 12px;
    border-radius: 999px;
    background: var(--sn-chip);
    border: 1px solid var(--sn-glass-border);
    font-size: 13px;
  }
  .tag button {
    all: unset;
    cursor: pointer;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }
  .check {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    font-size: 15px;
  }
  .check input {
    width: 20px;
    height: 20px;
    accent-color: var(--sn-accent-strong);
  }
  h4 {
    margin: 22px 0 10px;
    font-weight: 500;
    font-size: 15px;
  }
`;function Ks(t,e,s){return Object.keys(t.hass.states).filter(t=>e.includes(cs(t))).filter(e=>!s||s.includes(t.hass.states[e].attributes.device_class)).sort((e,s)=>ps(t.hass,e).localeCompare(ps(t.hass,s)))}function Ys(t,e,s,i,o){return U`<label class="field">
    <span>${e}</span>
    <select @change=${t=>o(t.target.value||void 0)}>
      <option value="" ?selected=${!s}>${t.t("none")}</option>
      ${s&&!i.includes(s)?U`<option value=${s} selected>${s}</option>`:K}
      ${i.map(e=>U`<option value=${e} ?selected=${e===s}>${ps(t.hass,e)} · ${e}</option>`)}
    </select>
  </label>`}function Gs(t,e,s,i,o){return U`<div class="field">
    <span>${e}</span>
    ${s.length?U`<div class="tags">
          ${s.map(e=>U`<span class="tag"
              >${ps(t.hass,e)}
              <button aria-label=${t.t("delete")} @click=${()=>o(s.filter(t=>t!==e))}>
                ${js(Et,16)}
              </button></span
            >`)}
        </div>`:K}
    <select
      @change=${t=>{const e=t.target;e.value&&o([...s,e.value]),e.value=""}}
    >
      <option value="" selected>${t.t("choose")}</option>
      ${i.filter(t=>!s.includes(t)).map(e=>U`<option value=${e}>${ps(t.hass,e)} · ${e}</option>`)}
    </select>
  </div>`}function Xs(t){const e=/[\u0600-\u06ff]/.test(t),s=(t,s)=>e?t:s;return/تعرفة|tariff/i.test(t)?s("تكلفة كيلوواط ساعة واحدة حسب مزود الكهرباء.","Your electricity price for one kilowatt-hour."):/ميزانية|budget/i.test(t)?s("الحد الشهري حسب العملة والتعرفة اللي اخترتها.","Your monthly target in the selected currency."):/طقس|weather/i.test(t)?s("اختار كيان الطقس الموجود في Home Assistant.","Choose an existing Home Assistant weather entity."):/رطوبة|humidity/i.test(t)?s("حساس الرطوبة اللي بدك تعرضه لهذه الغرفة.","The humidity sensor to display for this room."):/حرارة|temperature/i.test(t)?s("اختار الحساس المناسب؛ تأكد من وحدة القياس.","Choose the matching sensor and check its measurement unit."):/طاقة|energy|meter/i.test(t)?s("للاستهلاك اختار عداد الطاقة التراكمي بوحدة kWh.","For consumption, use a cumulative energy meter measured in kWh."):/قدرة|power/i.test(t)?s("حساس القدرة اللحظية بوحدة W أو kW.","An instantaneous power sensor measured in W or kW."):/رمز|pin/i.test(t)?s("لقفل أدوات الشاشة؛ مش بديل عن تسجيل دخول Home Assistant.","Locks screen controls; it does not replace Home Assistant sign-in."):/غرف|غرفة|room/i.test(t)?s("الغرف مرتبطة بمناطق Home Assistant. راجع الأجهزة بعد تغيير الربط.","Rooms correspond to Home Assistant areas. Review devices after changing links."):/لغة|language/i.test(t)?s("تلقائي يستعمل لغة حسابك في Home Assistant.","Automatic follows your Home Assistant language."):/مظهر|theme/i.test(t)?s("تلقائي يتبع الوضع الفاتح أو الداكن لجهازك.","Automatic follows the light or dark appearance of your device."):s("بتقدر ترجع تغيّر هالاختيار من الإعدادات بأي وقت.","You can change this choice again in Settings.")}function Js(t,e,s,i){return U`<label class="field">
    <span>${t}</span>
    <small class="field-hint">${Xs(t)}</small>
    <select @change=${t=>i(t.target.value)}>
      ${s.map(([t,s])=>U`<option value=${t} ?selected=${t===e}>${s}</option>`)}
    </select>
  </label>`}function Qs(t,e,s,i="text"){return U`<label class="field">
    <span>${t}</span>
    <small class="field-hint">${Xs(t)}</small>
    <input type=${i} .value=${e} @change=${t=>s(t.target.value)} />
  </label>`}function ti(t,e){if(0!==t.button)return;const s=t.currentTarget,i=t.clientX,o=t.clientY,a=window.setTimeout(()=>{n(),s.addEventListener("click",ei,{capture:!0,once:!0}),navigator.vibrate?.(10),e()},450),r=t=>{Math.hypot(t.clientX-i,t.clientY-o)>8&&n()},n=()=>{clearTimeout(a),s.removeEventListener("pointermove",r),s.removeEventListener("pointerup",n),s.removeEventListener("pointercancel",n),s.removeEventListener("pointerleave",n)};s.addEventListener("pointermove",r),s.addEventListener("pointerup",n),s.addEventListener("pointercancel",n),s.addEventListener("pointerleave",n)}function ei(t){t.stopPropagation(),t.preventDefault()}const si=t=>t.preventDefault();function ii(t,e){if(!e)return!1;const s=cs(t);return"light"===s?(e.attributes.supported_color_modes??[]).some(t=>"onoff"!==t):"cover"===s&&(!!(4&(e.attributes.supported_features??0))||"number"==typeof e.attributes.current_position)}const oi=new Map;function ai(t,e){let s=oi.get(e);return s||(s=t.callWS({type:"camera/capabilities",entity_id:e}).then(t=>t.frontend_stream_types??[]).catch(()=>[]),oi.set(e,s)),s}function ri(t,e){const s=t.states[e]?.attributes.entity_picture;return s?.includes("/api/camera_proxy/")?s.replace("/api/camera_proxy/","/api/camera_proxy_stream/"):void 0}function ni(t,e,s){const i=t.states[e]?.attributes.entity_picture;return i&&`${i}${i.includes("?")?"&":"?"}t=${s}`}async function li(t,e,s,i){const o=await t.callWS({type:"camera/webrtc/get_client_config",entity_id:e}).catch(()=>({})),a=new RTCPeerConnection(o.configuration??{});o.dataChannel&&a.createDataChannel(o.dataChannel),a.addTransceiver("video",{direction:"recvonly"}),a.addTransceiver("audio",{direction:"recvonly"});const r=new MediaStream;let n;a.ontrack=t=>{r.addTrack(t.track),s.srcObject=r,s.play().catch(()=>{})};const l=[],c=s=>t.callWS({type:"camera/webrtc/candidate",entity_id:e,session_id:n,candidate:s}).catch(()=>{});let d;a.onicecandidate=t=>{if(!t.candidate)return;const e=t.candidate.toJSON();n?c(e):l.push(e)};const p=new Promise((t,e)=>d=e);p.catch(()=>{});let h=!1;const u=await a.createOffer();let g;await a.setLocalDescription(u);const m=()=>{g?.(),g=void 0,a.close(),s.srcObject===r&&(s.srcObject=null)};try{g=await t.connection.subscribeMessage(async t=>{try{"session"===t.type?(n=t.session_id,l.splice(0).forEach(c)):"answer"===t.type?await a.setRemoteDescription({type:"answer",sdp:t.answer}):"candidate"===t.type?await a.addIceCandidate("string"==typeof t.candidate?{candidate:t.candidate,sdpMLineIndex:0}:t.candidate).catch(()=>{}):"error"===t.type&&d(new Error(t.message??"webrtc"))}catch(e){d(e)}},{type:"camera/webrtc/offer",entity_id:e,offer:u.sdp}),a.onconnectionstatechange=()=>{"failed"===a.connectionState&&(h?(m(),i?.()):d(new Error("webrtc failed")))},await Promise.race([new Promise(t=>s.addEventListener("loadeddata",()=>t(),{once:!0})),p,new Promise((t,e)=>setTimeout(()=>e(new Error("webrtc timeout")),1e4))])}catch(f){throw m(),f}return h=!0,m}var ci=Object.defineProperty,di=Object.getOwnPropertyDescriptor,pi=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?di(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&ci(e,s,a),a};let hi=class extends ct{constructor(){super(...arguments),this.fit="contain",this.tick=0,this.seen=!1,this.run=0,this.io=new IntersectionObserver(([t])=>{this.seen=t.isIntersecting,this.sync()}),this.vis=()=>this.sync()}connectedCallback(){super.connectedCallback(),this.io.observe(this),document.addEventListener("visibilitychange",this.vis)}disconnectedCallback(){super.disconnectedCallback(),this.io.disconnect(),document.removeEventListener("visibilitychange",this.vis),this.stop()}updated(t){t.has("entity")&&this.sync()}sync(){const t=this.seen&&"visible"===document.visibilityState&&this.entity?this.entity:void 0;t!==this.playing&&(this.stop(),t&&this.start(t))}stop(){this.run++,this.stopRtc?.(),this.stopRtc=void 0,clearInterval(this.timer),this.timer=void 0,this.playing=void 0,this.mode=void 0}async start(t){const e=++this.run;this.playing=t;const s=await ai(this.hass,t);if(e===this.run){if(s.includes("web_rtc")){this.mode="webrtc",await this.updateComplete;try{const s=await li(this.hass,t,this.video,()=>{e===this.run&&(this.stopRtc=void 0,this.playing=void 0,this.sync())});return void(e!==this.run?s():this.stopRtc=s)}catch{if(e!==this.run)return}}this.mjpeg=ri(this.hass,t),this.mode=this.mjpeg?"mjpeg":"snapshot","snapshot"===this.mode&&(this.timer=window.setInterval(()=>this.tick++,2e3))}}render(){const t=this.playing;if(!t||!this.mode)return U`<div class="wait"></div>`;if("webrtc"===this.mode)return U`<video autoplay muted playsinline disablepictureinpicture></video>`;const e="mjpeg"===this.mode?this.mjpeg:ni(this.hass,t,this.tick);return e?U`<img
          src=${e}
          alt=""
          @error=${()=>{"mjpeg"===this.mode&&(this.mode="snapshot",this.timer=window.setInterval(()=>this.tick++,2e3))}}
        />`:K}};var ui;hi.styles=n`
    :host {
      display: block;
      position: relative;
      background: #0b0b0b;
      overflow: hidden;
    }
    video,
    img,
    .wait {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    :host([fit="cover"]) video,
    :host([fit="cover"]) img {
      object-fit: cover;
    }
  `,pi([gt({attribute:!1})],hi.prototype,"hass",2),pi([gt()],hi.prototype,"entity",2),pi([gt({reflect:!0})],hi.prototype,"fit",2),pi([mt()],hi.prototype,"mode",2),pi([mt()],hi.prototype,"tick",2),pi([(ui="video",(t,e,s)=>((t,e,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,s),s))(t,e,{get(){return t=this,t.renderRoot?.querySelector(ui)??null;var t}}))],hi.prototype,"video",2),hi=pi([pt("sn-live-video")],hi);var gi=Object.defineProperty,mi=Object.getOwnPropertyDescriptor,fi=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?mi(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&gi(e,s,a),a};function bi(t){return{title:t.t("someone_at_door"),icon:"M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21M19.75,3.19L18.33,4.61C20.04,6.3 21,8.6 21,11H23C23,8.07 21.84,5.25 19.75,3.19M1,11H3C3,8.6 3.96,6.3 5.67,4.61L4.25,3.19C2.16,5.25 1,8.07 1,11Z",wide:!0,render:t=>U`<sn-door-view .ctx=${t}></sn-door-view>`}}let xi=class extends ct{constructor(){super(...arguments),this.opened=!1}render(){const{hass:t,t:e,config:s}=this.ctx,i=s.door??{};return U`
      <div class="stage">
        ${i.camera&&t.states[i.camera]?U`<sn-live-video .hass=${t} .entity=${i.camera}></sn-live-video>`:U`<div class="empty">${e("not_configured")}</div>`}
      </div>
      <div class="actions">
        ${i.open&&t.states[i.open]?U`<button
              class="open ${this.opened?"done":""}"
              @pointerdown=${t=>ti(t,()=>{!function(t,e){const s=cs(e);"lock"===s?t.hass.callService("lock","unlock",{entity_id:e}):"button"===s||"input_button"===s?t.hass.callService(s,"press",{entity_id:e}):t.hass.callService("script"===s?"script":"homeassistant","turn_on",{entity_id:e})}(this.ctx,i.open),this.opened=!0})}
              @click=${()=>!this.opened&&this.ctx.toast(e("hold_to_open"))}
              @contextmenu=${si}
            >
              ${js(Rt,22)}${this.opened?e("door_opened"):e("hold_to_open")}
            </button>`:K}
        <button class="close" @click=${()=>this.ctx.closeSheet()}>${js(Et,20)}${e("close")}</button>
      </div>
    `}};function vi(t){t.showSheet({title:t.t("energy_usage"),render:t=>{const e=e=>t.editing?t.update(e):t.saveLayout(e),s=t.config.home,i=Ks(t,["sensor"],["energy"]),o="ar"===t.lang,a=t.config.experience??{},r=(t,s)=>e(e=>{Object.assign(e.experience??={},{[t]:s})}),n=(t,e)=>U`<label class="field"><span>${e}</span><input type="number" min="0" max="100000000" step="0.01" .value=${String(a[t]??"")} @change=${e=>{const s=e.target.value,i=Number(s);s?Number.isFinite(i)&&i>=0&&i<=1e8&&r(t,i):r(t,void 0)}}></label>`;return U`
        ${Ys(t,t.t("energy_meter"),s.energy,i,t=>e(e=>e.home.energy=t))}
        ${Ys(t,t.t("solar_power"),s.solar_power,Ks(t,["sensor"],["power"]),t=>e(e=>e.home.solar_power=t))}
        ${Ys(t,t.t("solar_energy"),s.solar_energy,i,t=>e(e=>e.home.solar_energy=t))}
        ${Ys(t,o?"حساس القدرة اللحظية للبيت (W أو kW)":"Home live power sensor (W or kW)",a.power_entity,Ks(t,["sensor"],["power"]),t=>r("power_entity",t))}
        ${n("tariff",o?"تعرفة كل kWh":"Price per kWh")}
        ${Qs(o?"العملة (مثل ₪ أو $)":"Currency (for example ₪ or $)",a.currency??"",t=>r("currency",t.trim().slice(0,12)||void 0))}
        ${n("monthly_budget",o?"ميزانية الكهرباء الشهرية بالعملة المدخلة":"Monthly electricity budget in your currency")}
        ${n("power_alert_kw",o?"تنبيه عند تجاوز القدرة (kW)":"Power alert threshold (kW)")}
        <p>${o?"التكلفة تقديرية حسب التعرفة المدخلة، بدون الرسوم الثابتة والضرائب. التنبيه يستخدم حساس القدرة المختار فقط.":"Costs are estimates from your entered tariff, excluding fixed fees and taxes. Alerts use only your selected power sensor."}</p>
      `}})}function yi(t,e){t.showSheet({title:`${t.t("room_settings")} · ${t.hass.areas?.[e]?.name??e}`,render:t=>{const s=t.config.rooms[e]??{},i=s=>t.update(t=>{const i=t.rooms[e]??={};s(i)}),o=xs(t.hass,e),a=(t.config.pages.rooms?.hidden??[]).includes(e);return U`
        ${Qs(t.t("room_name"),s.name??"",t=>i(e=>e.name=t.trim()||void 0))}
        <label class="check">
          <input type="checkbox" .checked=${a} @change=${s=>{const i=s.target.checked;t.update(t=>{const s=t.pages.rooms??={},o=(s.hidden??[]).filter(t=>t!==e);s.hidden=i?[...o,e]:o})}} />
          ${t.t("hide_room")}
        </label>
        ${Qs(t.t("size_m2"),s.size_m2?.toString()??"",t=>i(e=>e.size_m2=t?Number(t):void 0),"number")}
        ${Ys(t,t.t("climate_entity"),s.climate,Ks(t,["climate"]),t=>i(e=>e.climate=t))}
        ${Ys(t,t.t("temperature_sensor"),s.temperature,Ks(t,["sensor"],["temperature"]),t=>i(e=>e.temperature=t))}
        ${Ys(t,t.t("humidity_sensor"),s.humidity,Ks(t,["sensor"],["humidity"]),t=>i(e=>e.humidity=t))}
        ${Ys(t,t.t("occupancy_sensor"),s.occupancy,Ks(t,["binary_sensor","sensor"]).filter(e=>!e.startsWith("sensor.")||!t.hass.states[e].attributes.device_class),t=>i(e=>e.occupancy=t))}
        ${Gs(t,t.t("hidden_devices"),s.hidden??[],o,t=>i(e=>e.hidden=t))}
      `}})}xi.styles=[Bs,n`
      :host {
        display: grid;
        gap: 16px;
      }
      .stage {
        aspect-ratio: 16 / 9;
        border-radius: 22px;
        overflow: hidden;
        background: #0b0b0b;
        box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.6);
      }
      .stage sn-live-video {
        width: 100%;
        height: 100%;
      }
      .empty {
        display: grid;
        place-items: center;
        height: 100%;
        color: var(--sn-text-dim);
      }
      .actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      .actions button {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        height: 56px;
        padding: 0 26px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font: inherit;
        font-size: 15px;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;
      }
      .actions .open {
        background: var(--sn-accent);
        border-color: transparent;
        color: #1d2a12;
      }
      .actions .open.done {
        background: rgba(181, 220, 143, 0.25);
        color: var(--sn-text);
      }
    `],fi([gt({attribute:!1})],xi.prototype,"ctx",2),fi([mt()],xi.prototype,"opened",2),xi=fi([pt("sn-door-view")],xi);var $i=Object.defineProperty,wi=Object.getOwnPropertyDescriptor,Ci=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?wi(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&$i(e,s,a),a};const _i=["hs","rgb","rgbw","rgbww","xy"];function Hi(t,e,s,i){const o=t.currentTarget,a=o.getBoundingClientRect(),r=t=>{const s=Math.min(1,Math.max(0,(t.clientX-a.left)/a.width));return e?1-s:s};o.setPointerCapture(t.pointerId);let n=r(t);s(n);const l=t=>s(n=r(t)),c=()=>{o.removeEventListener("pointermove",l),o.removeEventListener("pointerup",c),o.removeEventListener("pointercancel",c),i(n)};o.addEventListener("pointermove",l),o.addEventListener("pointerup",c),o.addEventListener("pointercancel",c)}let ki=class extends ct{constructor(){super(...arguments),this.live={}}setLive(t,e){const s={...this.live};void 0===e?delete s[t]:s[t]=e,this.live=s}head(t,e){return U`<div class="tile-head">
      <button class="name" @click=${()=>ws(this.ctx.hass,t)}>${ps(this.ctx.hass,t)}</button>
      <button class="round gear" aria-label=${this.ctx.t("settings")} @click=${()=>this.ctx.openEntity(t)}>${js(Ue,18)}</button>
    </div>`}lamp(t,e){const{t:s,hass:i,rtl:o}=this.ctx,a=this.live[t],r=`clip-${t.replace(/\W/g,"_")}`,n=void 0!==a?Math.round(100*a):hs(e)?Math.round((e.attributes.brightness??255)/255*100):0;return U`<div class="tile ${hs(e)?"on":""}">
      ${this.head(t,e)}
      <div class="pct">${n}<small>%</small></div>
      <div class="sub">${s("intensity")}</div>
      <div
        class="ramp"
        @pointerdown=${e=>Hi(e,o,e=>this.setLive(t,e),e=>{i.callService("light","turn_on",{entity_id:t,brightness_pct:Math.max(1,Math.round(100*e))}),setTimeout(()=>this.setLive(t),1200)})}
      >
        <svg viewBox="0 0 100 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rg" x1="0" x2="1">
              <stop offset="0" stop-color="#b5dc8f" stop-opacity="0.9"></stop>
              <stop offset="1" stop-color="#e5f4d6"></stop>
            </linearGradient>
            <clipPath id=${r}><rect width=${n} height="60"></rect></clipPath>
          </defs>
          <polygon points="0,60 100,0 100,60" fill="rgba(255,255,255,0.08)"></polygon>
          <polygon points="0,60 100,0 100,60" fill="url(#rg)" clip-path="url(#${r})"></polygon>
        </svg>
        <div class="cols"><span></span><span></span><span></span></div>
      </div>
      <div class="labels"><span>${s("low")}</span><span>${s("medium")}</span><span>${s("high")}</span></div>
    </div>`}strip(t,e){const{t:s,hass:i,rtl:o}=this.ctx,a=this.live[t],r=void 0!==a?360*a:e.attributes.hs_color?.[0]??45,n=hs(e);return U`<div class="tile ${n?"on":""}">
      ${this.head(t,e)}
      <div class="swatch" style="--c: hsl(${r} 80% 55%); opacity:${n?1:.45}"></div>
      <div
        class="hue"
        @pointerdown=${e=>Hi(e,o,e=>this.setLive(t,e),e=>{i.callService("light","turn_on",{entity_id:t,hs_color:[Math.round(360*e),85]}),setTimeout(()=>this.setLive(t),1200)})}
      >
        <span class="knob" style="inset-inline-start: calc(${r/360} * (100% - 26px))"></span>
      </div>
      <div class="sub center">${s("customize_color")}</div>
    </div>`}speaker(t,e){const{hass:s,rtl:i}=this.ctx,o=this.live[t]??("number"==typeof e.attributes.volume_level?e.attributes.volume_level:0);return U`<div class="tile ${hs(e)?"on":""}">
      ${this.head(t,e)}
      <div
        class="vol"
        @pointerdown=${e=>Hi(e,i,e=>this.setLive(t,e),e=>{s.callService("media_player","volume_set",{entity_id:t,volume_level:Math.round(100*e)/100}),setTimeout(()=>this.setLive(t),1200)})}
      >
        <div class="fill" style="width:${100*o}%"></div>
        <div class="cols"><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="labels four"><span>20%</span><span>40%</span><span>60%</span><span>100%</span></div>
    </div>`}plain(t,e){const s=hs(e);return U`<div class="tile ${s?"on":""}">
      ${this.head(t,e)}
      <div class="plain">
        <span class="big-ic">${js(Ts(t,e),34)}</span>
        <button class="switch" ?on=${s} aria-pressed=${s} @click=${()=>ws(this.ctx.hass,t)}></button>
      </div>
    </div>`}hold(t,e){t.target.closest(".ramp, .hue, .vol, .switch, .gear")||ii(e,this.ctx.hass.states[e])&&ti(t,()=>this.ctx.openLevel(e))}tile(t){return U`<div class="hold" @pointerdown=${e=>this.hold(e,t)} @contextmenu=${si}>${this.inner(t)}</div>`}inner(t){const e=this.ctx.hass.states[t];if(us(e))return U`<div class="tile off"><div class="tile-head"><span class="name">${ps(this.ctx.hass,t)}</span></div><div class="empty">${this.ctx.t("not_configured")}</div></div>`;const s=cs(t);return"light"===s&&(t=>(t.attributes.supported_color_modes??[]).some(t=>_i.includes(t)))(e)?this.strip(t,e):"light"===s&&(t=>(t.attributes.supported_color_modes??[]).some(t=>"onoff"!==t))(e)?this.lamp(t,e):"media_player"===s&&void 0!==e.attributes.volume_level?this.speaker(t,e):this.plain(t,e)}render(){const{t:t,config:e,editing:s}=this.ctx,i=e.home.devices;return U`<div class="glass card">
      <div class="card-head">
        <span class="round">${js("M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z",20)}</span>
        <h3>${t("smart_devices")}</h3>
        ${s?U`<button class="round gear" aria-label=${t("settings")} @click=${()=>{var t;(t=this.ctx).showSheet({title:t.t("smart_devices"),render:t=>Gs(t,t.t("favorite_devices"),t.config.home.devices,Ks(t,vs),e=>t.update(t=>t.home.devices=e))})}}>${js(Ot,18)}</button>`:K}
      </div>
      ${i.length?U`<div class="row">${i.map(t=>this.tile(t))}</div>`:U`<div class="empty">${t("pick_in_edit")}</div>`}
    </div>`}};async function Vi(t,e,s=24,i=!1){return((await t.callWS({type:"history/history_during_period",start_time:new Date(Date.now()-36e5*s).toISOString(),end_time:(new Date).toISOString(),entity_ids:[e],minimal_response:!i,no_attributes:!i,significant_changes_only:!1}))[e]??[]).map(t=>({t:"number"==typeof t.lu?1e3*t.lu:Date.parse(t.last_updated??t.last_changed),s:t.s??t.state,a:t.a??t.attributes}))}ki.styles=[Bs,n`
      :host {
        display: block;
        min-width: 0;
      }
      .card {
        height: 100%;
        padding: 20px 22px 22px;
      }
      .row {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(200px, 1fr);
        gap: 14px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        margin: 0 -4px;
        padding: 0 4px 2px;
      }
      .row::-webkit-scrollbar {
        display: none;
      }
      .hold {
        display: flex;
        scroll-snap-align: start;
        -webkit-touch-callout: none;
        user-select: none;
      }
      .tile {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: var(--tile-min-h, 230px);
        padding: 16px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid var(--sn-glass-border);
      }
      .tile-head {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .name {
        all: unset;
        flex: 1;
        cursor: pointer;
        font-size: 14px;
        line-height: 1.3;
      }
      .gear {
        width: 38px;
        height: 38px;
        background: rgba(0, 0, 0, 0.25);
      }
      .pct {
        margin-top: 10px;
        font-size: 34px;
        font-weight: 300;
        line-height: 1;
      }
      .pct small {
        font-size: 18px;
      }
      .sub {
        font-size: 11px;
        color: var(--sn-text-faint);
        margin-top: 4px;
      }
      .sub.center {
        text-align: center;
        margin-top: 10px;
      }
      .ramp,
      .vol {
        position: relative;
        margin-top: auto;
        height: 74px;
        border-radius: 10px;
        overflow: hidden;
        touch-action: none;
        cursor: ew-resize;
      }
      .ramp svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .ramp svg:dir(rtl) {
        transform: scaleX(-1);
      }
      .cols {
        position: absolute;
        inset: 0;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        gap: 4px;
        pointer-events: none;
      }
      .cols span {
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.03);
      }
      .vol {
        height: 110px;
        margin-top: 14px;
      }
      .vol .fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        background: linear-gradient(90deg, rgba(181, 220, 143, 0.85), rgba(181, 220, 143, 0.25));
        border-radius: 10px;
      }
      .labels {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-top: 8px;
        font-size: 10px;
        color: var(--sn-text-faint);
        text-align: center;
      }
      .labels.four {
        grid-template-columns: repeat(4, 1fr);
      }
      .swatch {
        margin-top: 14px;
        height: 84px;
        border-radius: 16px;
        background: linear-gradient(110deg, #f1efe9 0%, var(--c) 100%);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
      }
      .hue {
        position: relative;
        margin-top: 14px;
        height: 26px;
        border-radius: 999px;
        background: linear-gradient(90deg, #f33, #fd3, #3f6, #3df, #36f, #d3f, #f33);
        touch-action: none;
        cursor: ew-resize;
      }
      .hue:dir(rtl) {
        background: linear-gradient(-90deg, #f33, #fd3, #3f6, #3df, #36f, #d3f, #f33);
      }
      .knob {
        position: absolute;
        top: 0;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid rgba(0, 0, 0, 0.25);
      }
      .plain {
        margin-top: auto;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }
      .big-ic {
        color: var(--sn-text-dim);
      }
      .tile.on .big-ic {
        color: var(--sn-accent);
      }
    `],Ci([gt({attribute:!1})],ki.prototype,"ctx",2),Ci([mt()],ki.prototype,"live",2),ki=Ci([pt("sn-devices-card")],ki);var Mi=Object.defineProperty,Ai=Object.getOwnPropertyDescriptor,Li=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Ai(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Mi(e,s,a),a};const Si=n`
  :host {
    display: block;
  }
  .center {
    display: grid;
    justify-items: center;
    gap: 14px;
    padding: 8px 0 4px;
    text-align: center;
  }
  .big {
    display: grid;
    place-items: center;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 1px solid var(--sn-glass-border);
    background: rgba(255, 255, 255, 0.08);
    color: var(--sn-text-dim);
    cursor: pointer;
    -webkit-touch-callout: none;
    user-select: none;
    transition: transform 0.15s ease, background 0.3s ease, box-shadow 0.3s ease;
  }
  .big:active {
    transform: scale(0.95);
  }
  .big.on {
    background: radial-gradient(circle at 50% 40%, #e3f3d2, var(--sn-accent-strong));
    color: #1d2a12;
    box-shadow: 0 0 50px var(--sn-accent-glow);
  }
  .big.warn {
    background: radial-gradient(circle at 50% 40%, #ffd9c9, #e48a6b);
    color: #3a160b;
    box-shadow: 0 0 50px rgba(228, 138, 107, 0.45);
  }
  .state {
    font-size: 22px;
    text-transform: capitalize;
  }
  .hint {
    font-size: 13px;
    color: var(--sn-text-dim);
  }
`;let zi=class extends ct{render(){const{hass:t,t:e,lang:s}=this.ctx,i=t.states[this.entity];if(!i)return U`<div class="empty">${e("not_configured")}</div>`;const o=hs(i),a=cs(this.entity),r="scene"===a||"script"===a||"button"===a;return U`<div class="center">
      <button
        class="big ${o&&!r?"on":""}"
        aria-pressed=${o}
        @click=${()=>"button"===a?t.callService("button","press",{entity_id:this.entity}):ws(t,this.entity)}
      >
        ${js(r?be:"switch"===a||"input_boolean"===a?ve:Ts(this.entity,i),58)}
      </button>
      <span class="state">${e(r?"run":o?"on":"off")}</span>
      <span class="hint">${e("changed",{t:Ms(i.last_changed,s)})}</span>
    </div>`}};zi.styles=[Bs,Si],Li([gt({attribute:!1})],zi.prototype,"ctx",2),Li([gt()],zi.prototype,"entity",2),zi=Li([pt("sn-toggle-view")],zi);let Pi=class extends ct{render(){const{hass:t,t:e,lang:s}=this.ctx,i=t.states[this.entity];if(!i)return U`<div class="empty">${e("not_configured")}</div>`;const o="locked"===i.state,a=this.entity;return U`<div class="center">
      <button
        class="big ${o?"on":"warn"}"
        @click=${()=>o?this.ctx.toast(e("hold_unlock")):t.callService("lock","lock",{entity_id:a})}
        @pointerdown=${e=>o&&ti(e,()=>t.callService("lock","unlock",{entity_id:a}))}
        @contextmenu=${si}
      >
        ${js(o?re:ne,58)}
      </button>
      <span class="state">${e(o?"locked":"unlocked")}</span>
      <span class="hint">${e(o?"hold_unlock":"lock")} · ${Ms(i.last_changed,s)}</span>
    </div>`}};Pi.styles=[Bs,Si],Li([gt({attribute:!1})],Pi.prototype,"ctx",2),Li([gt()],Pi.prototype,"entity",2),Pi=Li([pt("sn-lock-view")],Pi);let Ei=class extends ct{constructor(){super(...arguments),this.code=""}run(t){const e=this.ctx.hass.states[this.entity],s={entity_id:this.entity};e.attributes.code_format&&this.code&&(s.code=this.code),this.ctx.hass.callService("alarm_control_panel",t,s),this.code=""}render(){const{hass:t,t:e}=this.ctx,s=t.states[this.entity];if(!s)return U`<div class="empty">${e("not_configured")}</div>`;const i=s.state.startsWith("armed"),o=!!s.attributes.code_format;return U`<div class="center">
      <span class="big ${i?"on":"triggered"===s.state?"warn":""}">${js(i?Le:Se,58)}</span>
      <span class="state">${s.state.replace(/_/g," ")}</span>
      ${o?U`<div class="dots" aria-label=${e("enter_code")}>
              ${Array.from({length:Math.max(4,this.code.length)},(t,e)=>U`<span class=${e<this.code.length?"f":""}></span>`)}
            </div>
            <div class="pad">
              ${["1","2","3","4","5","6","7","8","9","","0","⌫"].map(t=>""===t?U`<span></span>`:U`<button
                      @click=${()=>this.code="⌫"===t?this.code.slice(0,-1):(this.code+t).slice(0,10)}
                      aria-label=${"⌫"===t?"backspace":t}
                    >
                      ${"⌫"===t?js(Ct,22):t}
                    </button>`)}
            </div>`:K}
      <div class="modes">
        <button class=${"armed_home"===s.state?"on":""} @click=${()=>this.run("alarm_arm_home")}>${js(Me,18)}${e("arm_home")}</button>
        <button class=${"armed_away"===s.state?"on":""} @click=${()=>this.run("alarm_arm_away")}>${js(Le,18)}${e("arm_away")}</button>
        <button class=${"disarmed"===s.state?"on":""} @click=${()=>this.run("alarm_disarm")}>${js(Se,18)}${e("disarm")}</button>
      </div>
    </div>`}};Ei.styles=[Bs,Si,n`
      .big {
        cursor: default;
      }
      .dots {
        display: flex;
        gap: 10px;
        height: 14px;
      }
      .dots span {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1.5px solid var(--sn-text-dim);
      }
      .dots span.f {
        background: var(--sn-text);
        border-color: var(--sn-text);
      }
      .pad {
        display: grid;
        grid-template-columns: repeat(3, 72px);
        gap: 12px;
      }
      .pad button {
        display: grid;
        place-items: center;
        height: 72px;
        border-radius: 50%;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 26px;
        font-weight: 300;
        cursor: pointer;
      }
      .pad button:active {
        background: rgba(255, 255, 255, 0.2);
      }
      .modes {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }
      .modes button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 46px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
      }
      .modes button.on {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
    `],Li([gt({attribute:!1})],Ei.prototype,"ctx",2),Li([gt()],Ei.prototype,"entity",2),Li([mt()],Ei.prototype,"code",2),Ei=Li([pt("sn-alarm-view")],Ei);let Oi=class extends ct{firstUpdated(){Vi(this.ctx.hass,this.entity).then(t=>this.points=t).catch(()=>this.points=[])}line(t){const e=t.map(t=>({t:t.t,v:parseFloat(t.s)})).filter(t=>Number.isFinite(t.v));if(e.length<2)return K;const s=600,i=180,o=Date.now()-864e5,a=Math.min(...e.map(t=>t.v)),r=Math.max(...e.map(t=>t.v)),n=r-a||1,l=t=>(Math.max(t,o)-o)/864e5*s,c=t=>164-(t-a)/n*144;let d=`M${l(e[0].t)},${c(e[0].v)}`;for(const p of e.slice(1))d+=` L${l(p.t)},${c(p.v)}`;return d+=` L600,${c(e[e.length-1].v)}`,U`<svg class="chart" viewBox="0 0 ${s} ${i}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#b5dc8f" stop-opacity="0.45"></stop>
          <stop offset="1" stop-color="#b5dc8f" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
      ${B`<path d="${d} L${s},${i} L${l(e[0].t)},${i} Z" fill="url(#fill)"></path>
        <path d=${d} fill="none" stroke="#b5dc8f" stroke-width="2.5" vector-effect="non-scaling-stroke"></path>`}
    </svg>
    <div class="range"><span>${a.toFixed(1)}</span><span>${r.toFixed(1)}</span></div>`}timeline(t){const e=Date.now()-864e5,s=t.map((s,i)=>{const o=Math.max(s.t,e),a=t[i+1]?.t??Date.now();return{on:"on"===s.s,left:(o-e)/864e5*100,width:(a-o)/864e5*100}});return U`<div class="timeline">${s.map(t=>U`<span class=${t.on?"on":""} style="inset-inline-start:${t.left}%;width:${t.width}%"></span>`)}</div>`}render(){const{hass:t,t:e,lang:s}=this.ctx,i=t.states[this.entity];if(!i)return U`<div class="empty">${e("not_configured")}</div>`;const o="binary_sensor"===cs(this.entity),a=i.attributes.unit_of_measurement??"",r=o?"on"===i.state?e("on"):e("off"):i.state;return U`
      <div class="value">${r}<small>${a}</small></div>
      <div class="hint">${e("changed",{t:Ms(i.last_changed,s)})}</div>
      <div class="box">
        <div class="label">${e("last_24h")}</div>
        ${void 0===this.points?U`<div class="empty">…</div>`:o?this.timeline(this.points):this.line(this.points)}
        <div class="axis"><span>-24h</span><span>-12h</span><span>${(new Date).toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit"})}</span></div>
      </div>
    `}};Oi.styles=[Bs,Si,n`
      .value {
        font-size: 56px;
        font-weight: 300;
        letter-spacing: -0.03em;
        text-transform: capitalize;
      }
      .value small {
        font-size: 20px;
        margin-inline-start: 4px;
      }
      .box {
        margin-top: 18px;
        padding: 16px;
        border-radius: 22px;
        background: rgba(0, 0, 0, 0.16);
        border: 1px solid var(--sn-glass-border);
      }
      .label {
        font-size: 13px;
        color: var(--sn-text-dim);
        margin-bottom: 10px;
      }
      .chart {
        display: block;
        width: 100%;
        height: 180px;
        direction: ltr;
      }
      .range,
      .axis {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--sn-text-faint);
        direction: ltr;
      }
      .axis {
        margin-top: 8px;
      }
      .timeline {
        position: relative;
        height: 40px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.06);
        overflow: hidden;
      }
      .timeline span {
        position: absolute;
        inset-block: 0;
      }
      .timeline span.on {
        background: var(--sn-accent);
      }
    `],Li([gt({attribute:!1})],Oi.prototype,"ctx",2),Li([gt()],Oi.prototype,"entity",2),Li([mt()],Oi.prototype,"points",2),Oi=Li([pt("sn-sensor-view")],Oi);let Zi=class extends ct{render(){const t=this.ctx.hass.states[this.entity]?.attributes.entity_picture;return t?U`<img src=${t} alt=${ps(this.ctx.hass,this.entity)} />`:U`<div class="empty">${this.ctx.t("not_configured")}</div>`}};Zi.styles=[Bs,n`
      img {
        display: block;
        width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 22px;
        background: rgba(0, 0, 0, 0.2);
      }
    `],Li([gt({attribute:!1})],Zi.prototype,"ctx",2),Li([gt()],Zi.prototype,"entity",2),Zi=Li([pt("sn-image-view")],Zi);var ji=Object.defineProperty,Ti=Object.getOwnPropertyDescriptor,Di=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Ti(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&ji(e,s,a),a};let Fi=class extends ct{constructor(){super(...arguments),this.tick=0,this.clock=new Date}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>{this.clock=new Date,this.tick++},2e3)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.timer)}get cam(){return this.current??this.entity}thumb(t){return ni(this.ctx.hass,t,Math.floor(this.tick/5))}select(t){this.current=t}fullscreen(){const t=this.renderRoot.querySelector(".stage"),e=t;(t?.requestFullscreen?.()??e?.webkitRequestFullscreen?.())?.catch?.(()=>{})}render(){const{hass:t,t:e,lang:s}=this.ctx,i=this.cam,o=Fs(this.ctx,"security",Hs(t,"camera")),a=ks(t,i);return U`
      <div class="stage">
        ${t.states[i]?.attributes.entity_picture?U`<sn-live-video .hass=${t} .entity=${i}></sn-live-video>`:U`<div class="empty">${e("not_configured")}</div>`}
        <span class="live"><span class="dot"></span>${e("live")}</span>
        <button class="round fs" aria-label=${e("fullscreen")} @click=${this.fullscreen}>${js("M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z",22)}</button>
        <span class="label">
          <b>${ps(t,i)}</b>
          <small>${a?`${a} · `:""}${this.clock.toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</small>
        </span>
      </div>
      ${o.length>1?U`<div class="thumbs">
            ${o.map(e=>U`<button class="thumb ${e===i?"on":""}" @click=${()=>this.select(e)}>
                ${this.thumb(e)?U`<img src=${this.thumb(e)} alt="" loading="lazy" />`:K}
                <span>${ps(t,e)}</span>
              </button>`)}
          </div>`:K}
    `}};Fi.styles=[Bs,n`
      :host {
        display: block;
      }
      .stage {
        position: relative;
        aspect-ratio: 16 / 9;
        border-radius: 24px;
        overflow: hidden;
        background: #0b0b0b;
        box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.6);
      }
      .stage:fullscreen {
        border-radius: 0;
      }
      .stage sn-live-video {
        width: 100%;
        height: 100%;
      }
      .live {
        position: absolute;
        top: 14px;
        inset-inline-start: 14px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 32px;
        padding: 0 14px;
        border-radius: 999px;
        background: rgba(20, 18, 16, 0.55);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff5a4a;
        box-shadow: 0 0 10px #ff5a4a;
        animation: blink 1.4s ease-in-out infinite;
      }
      @keyframes blink {
        50% {
          opacity: 0.35;
        }
      }
      .fs {
        position: absolute;
        top: 10px;
        inset-inline-end: 10px;
        background: rgba(20, 18, 16, 0.55);
        border-color: rgba(255, 255, 255, 0.2);
        color: #fff;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      .label {
        position: absolute;
        bottom: 14px;
        inset-inline-start: 14px;
        display: grid;
        gap: 2px;
        padding: 10px 16px;
        border-radius: 16px;
        background: rgba(20, 18, 16, 0.55);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
      }
      .label b {
        font-weight: 500;
        font-size: 15px;
      }
      .label small {
        font-size: 12px;
        opacity: 0.75;
        font-variant-numeric: tabular-nums;
      }
      .thumbs {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .thumb {
        position: relative;
        flex: none;
        width: 170px;
        aspect-ratio: 16 / 10;
        padding: 0;
        border-radius: 16px;
        overflow: hidden;
        border: 2px solid transparent;
        background: #111;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease, border-color 0.2s ease;
      }
      .thumb.on {
        border-color: var(--sn-accent);
        opacity: 1;
      }
      .thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .thumb span {
        position: absolute;
        inset-inline-start: 8px;
        bottom: 6px;
        color: #fff;
        font-size: 11px;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
      }
    `],Di([gt({attribute:!1})],Fi.prototype,"ctx",2),Di([gt()],Fi.prototype,"entity",2),Di([mt()],Fi.prototype,"current",2),Di([mt()],Fi.prototype,"tick",2),Di([mt()],Fi.prototype,"clock",2),Fi=Di([pt("sn-camera-view")],Fi);var Ri=Object.defineProperty,Ii=Object.getOwnPropertyDescriptor,Ni=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Ii(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Ri(e,s,a),a};const Wi=`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="${se}"/></svg>`;let Ui=class extends ct{battery(){const{hass:t}=this.ctx,e=t.states[this.entity],s=[].concat(e?.attributes.source??[],e?.attributes.device_trackers??[]);for(const i of s){const e=t.states[i]?.attributes.battery_level;if("number"==typeof e)return e;const s=Vs(t,i).find(e=>e.startsWith("sensor.")&&"battery"===t.states[e]?.attributes.device_class),o=s?gs(t.states[s]):void 0;if(void 0!==o)return o}}async firstUpdated(){try{this.points=await Vi(this.ctx.hass,this.entity,24,!0)}catch{this.points=[]}await this.drawMap()}disconnectedCallback(){super.disconnectedCallback(),this.map?.remove(),this.map=void 0}async drawMap(){const{hass:e,dark:s}=this.ctx,i=e.states[this.entity],o=this.renderRoot.querySelector(".map"),a=i?.attributes.latitude,r=i?.attributes.longitude;if(!o||"number"!=typeof a||"number"!=typeof r)return;const n=await t(()=>import("./leaflet-src-CTtes9Cr.js").then(t=>t.l),[]),l=n.map(o,{zoomControl:!1,attributionControl:!0}).setView([a,r],14);this.map=l;const c=s?"Dark_Gray_Base":"Light_Gray_Base";n.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${c}/MapServer/tile/{z}/{y}/{x}`,{maxZoom:16,attribution:"Tiles © Esri, HERE, Garmin, © OpenStreetMap contributors"}).addTo(l),n.control.zoom({position:"bottomright"}).addTo(l);const d=(this.points??[]).map(t=>t.a).filter(t=>!!t&&"number"==typeof t.latitude&&"number"==typeof t.longitude).map(t=>[t.latitude,t.longitude]);d.length>1&&(n.polyline(d,{color:"#9ccf6c",weight:5,opacity:.9,lineCap:"round",lineJoin:"round"}).addTo(l),n.circleMarker(d[0],{radius:6,color:"#fff",weight:2,fillColor:"#9ccf6c",fillOpacity:1}).addTo(l));const p=e.states["zone.home"]?.attributes,h=n.latLngBounds([[a,r],...d]);"number"==typeof p?.latitude&&(n.marker([p.latitude,p.longitude],{icon:n.divIcon({className:"",html:`<div class="pin-home">${Wi}</div>`,iconSize:[36,36],iconAnchor:[18,18]})}).addTo(l),h.extend([p.latitude,p.longitude]));const u=i.attributes.entity_picture,g=u?`<img src="${u}" alt="">`:`<span>${ps(e,this.entity).slice(0,1).toUpperCase()}</span>`;n.marker([a,r],{icon:n.divIcon({className:"",html:`<div class="pin-me">${g}</div>`,iconSize:[54,54],iconAnchor:[27,27]}),zIndexOffset:1e3}).addTo(l),h.isValid()&&!h.getNorthEast().equals(h.getSouthWest())&&l.fitBounds(h,{padding:[48,48],maxZoom:16}),setTimeout(()=>l.invalidateSize(),350)}places(){const{t:t}=this.ctx,e=new Date;e.setHours(0,0,0,0);const s=[];for(const i of this.points??[]){i.t<e.getTime()&&s.length&&(s.length=0);const o="home"===i.s?t("home_state"):"not_home"===i.s?t("away"):i.s;s[s.length-1]?.label!==o&&s.push({at:Math.max(i.t,e.getTime()),label:o,home:"home"===i.s})}return s.reverse()}render(){const{hass:t,t:e,lang:s}=this.ctx,i=t.states[this.entity];if(!i)return U`<div class="empty">${e("not_configured")}</div>`;const o="home"===i.state,a=o?e("home_state"):"not_home"===i.state?e("away"):i.state,r=i.attributes.entity_picture,n=this.battery(),l="number"==typeof i.attributes.latitude;return U`<div class="layout">
      <div class="map-wrap">${l?U`<div class="map"></div>`:U`<div class="empty">${e("no_location")}</div>`}</div>
      <aside>
        <div class="who">
          <span class="avatar ${o?"home":""}">
            ${r?U`<img src=${r} alt="" />`:U`<span>${ps(t,this.entity).slice(0,1).toUpperCase()}</span>`}
          </span>
          <div>
            <span class="where ${o?"home":""}">${js(o?se:de,16)}${a}</span>
            <span class="since">${Ms(i.last_changed,s)}</span>
          </div>
        </div>
        ${void 0!==n?U`<div class="batt ${n<20?"low":""}">
              ${js(_t,18)}<span class="bar"><span style="width:${n}%"></span></span><b>${Math.round(n)}%</b>
            </div>`:K}
        <div class="today">
          <h4>${e("places_today")}</h4>
          ${void 0===this.points?U`<div class="empty">…</div>`:U`<ol>
                ${this.places().map(t=>U`<li class=${t.home?"home":""}>
                    <span class="time">${new Date(t.at).toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit"})}</span>
                    <span class="place">${t.label}</span>
                  </li>`)}
              </ol>`}
        </div>
      </aside>
    </div>`}};Ui.styles=[r('.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(/smartnest_pro_static/assets/layers-BWBAp2CZ.png);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(/smartnest_pro_static/assets/layers-2x-Bpkbi35X.png);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(/smartnest_pro_static/assets/marker-icon-hN30_KVU.png)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:""}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'),Bs,n`
      :host {
        display: block;
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1.7fr) minmax(240px, 1fr);
        gap: 18px;
      }
      @media (max-width: 760px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }
      .map-wrap {
        min-height: 420px;
        border-radius: 24px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.18);
        border: 1px solid var(--sn-glass-border);
        display: grid;
      }
      @media (max-width: 760px) {
        .map-wrap {
          min-height: 300px;
        }
      }
      .map {
        width: 100%;
        height: 100%;
        min-height: inherit;
        background: transparent;
        font-family: var(--sn-font);
      }
      .leaflet-control-attribution {
        font-size: 9px;
        background: rgba(255, 255, 255, 0.55) !important;
      }
      .leaflet-bar a {
        background: var(--sn-glass-strong);
        color: var(--sn-text);
        border-color: var(--sn-glass-border);
        backdrop-filter: blur(10px);
      }
      .pin-me {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        border: 3px solid #b5dc8f;
        box-shadow: 0 0 0 6px rgba(181, 220, 143, 0.35), 0 10px 20px rgba(0, 0, 0, 0.35);
        background: #3a3530;
        color: #fff;
        overflow: hidden;
        display: grid;
        place-items: center;
        font: 300 22px var(--sn-font);
      }
      .pin-me img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .pin-home {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #fff;
        color: #1d1b19;
        display: grid;
        place-items: center;
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
      }
      aside {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .who {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .who > div {
        display: grid;
        gap: 4px;
      }
      .avatar {
        display: grid;
        place-items: center;
        width: 76px;
        height: 76px;
        border-radius: 50%;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        font-size: 30px;
        font-weight: 300;
      }
      .avatar.home {
        border-color: var(--sn-accent);
        box-shadow: 0 0 22px var(--sn-accent-glow);
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .where {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 20px;
        text-transform: capitalize;
      }
      .where.home {
        color: var(--sn-accent);
      }
      .since {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .batt {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.06);
      }
      .batt .bar {
        position: relative;
        flex: 1;
        height: 8px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }
      .batt .bar span {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        background: var(--sn-accent);
        border-radius: 99px;
      }
      .batt.low .bar span {
        background: #e48a6b;
      }
      .today {
        flex: 1;
        padding: 14px 16px;
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.14);
        border: 1px solid var(--sn-glass-border);
        overflow: auto;
        max-height: 300px;
      }
      h4 {
        margin: 0 0 10px;
        font-weight: 500;
        font-size: 14px;
        color: var(--sn-text-dim);
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
      }
      li {
        position: relative;
        display: flex;
        gap: 14px;
        padding: 8px 0;
        padding-inline-start: 22px;
        font-size: 14px;
      }
      li::before {
        content: "";
        position: absolute;
        inset-inline-start: 4px;
        top: 14px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--sn-text-faint);
      }
      li::after {
        content: "";
        position: absolute;
        inset-inline-start: 8px;
        top: 26px;
        bottom: -10px;
        width: 1px;
        background: var(--sn-glass-border);
      }
      li:last-child::after {
        display: none;
      }
      li.home::before {
        background: var(--sn-accent);
      }
      .time {
        min-width: 48px;
        color: var(--sn-text-dim);
        font-variant-numeric: tabular-nums;
      }
      .place {
        text-transform: capitalize;
      }
    `],Ni([gt({attribute:!1})],Ui.prototype,"ctx",2),Ni([gt()],Ui.prototype,"entity",2),Ni([mt()],Ui.prototype,"points",2),Ui=Ni([pt("sn-person-view")],Ui);var Bi=Object.defineProperty,qi=Object.getOwnPropertyDescriptor,Ki=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?qi(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Bi(e,s,a),a};let Yi=class extends ct{constructor(){super(...arguments),this.editing=!1,this.value=""}start(){this.value=ps(this.ctx.hass,this.entity),this.editing=!0,this.updateComplete.then(()=>{const t=this.renderRoot.querySelector("input");t?.focus(),t?.select()})}save(){const t=this.value.trim(),e=this.ctx.hass.states[this.entity]?.attributes.friendly_name;this.ctx.rename(this.entity,t&&t!==e?t:void 0),this.editing=!1}render(){const{t:t,config:e,hass:s}=this.ctx,i=!!e.names?.[this.entity],o=s.states[this.entity]?.attributes.friendly_name??this.entity;return this.editing?U`<div class="row edit">
      <input
        .value=${this.value}
        maxlength="60"
        placeholder=${o}
        @input=${t=>this.value=t.target.value}
        @keydown=${t=>{"Enter"===t.key&&this.save(),"Escape"===t.key&&(this.editing=!1)}}
      />
      <button class="ok" aria-label=${t("save")} @click=${()=>this.save()}>${js(Pt,18)}</button>
      ${i?U`<button class="soft" aria-label=${t("reset_name")} title=${t("reset_name")} @click=${()=>{this.ctx.rename(this.entity,void 0),this.editing=!1}}>${js("M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z",18)}</button>`:K}
      <button class="soft" aria-label=${t("cancel")} @click=${()=>this.editing=!1}>${js(Et,18)}</button>
    </div>`:U`<div class="row">
        <button class="pen" @click=${()=>this.start()}>${js(me,16)}${t("rename")}</button>
        ${i?U`<span class="orig">${t("ha_name",{name:o})}</span>`:K}
      </div>`}};Yi.styles=[Bs,n`
      :host {
        display: block;
        margin: -4px 0 14px;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .pen {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 32px;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--sn-text-dim);
        font-size: 12px;
        cursor: pointer;
      }
      .orig {
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      input {
        flex: 1;
        min-width: 160px;
        height: 42px;
        padding: 0 14px;
        border-radius: 14px;
        border: 1px solid var(--sn-accent);
        background: rgba(0, 0, 0, 0.2);
        color: var(--sn-text);
        font: inherit;
        font-size: 15px;
        outline: none;
      }
      .ok,
      .soft {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 14px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        cursor: pointer;
      }
      .ok {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
    `],Ki([gt({attribute:!1})],Yi.prototype,"ctx",2),Ki([gt()],Yi.prototype,"entity",2),Ki([mt()],Yi.prototype,"editing",2),Ki([mt()],Yi.prototype,"value",2),Yi=Ki([pt("sn-rename")],Yi);var Gi=Object.defineProperty,Xi=Object.getOwnPropertyDescriptor,Ji=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Xi(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Gi(e,s,a),a};const Qi=["hs","rgb","rgbw","rgbww","xy"];function to(t){const e=t?.supported_color_modes??[];return{color:e.some(t=>Qi.includes(t)),temp:e.includes("color_temp")}}const eo=[[30,70],[0,85],[330,70],[275,70],[220,85],[190,75],[130,70],[50,90]];let so=class extends ct{send(t){this.ctx.hass.callService("light","turn_on",{entity_id:this.entity,...t})}wheel(t){const e=t.currentTarget,s=e.getBoundingClientRect(),i=t=>{const e=t.clientX-(s.left+s.width/2),i=t.clientY-(s.top+s.height/2),o=s.width/2,a=(180*Math.atan2(e,-i)/Math.PI+360)%360,r=Math.min(100,Math.hypot(e,i)/o*100);return{h:Math.round(a),s:Math.round(r)}};e.setPointerCapture(t.pointerId),this.live=i(t);const o=t=>this.live=i(t),a=()=>{e.removeEventListener("pointermove",o),e.removeEventListener("pointerup",a),e.removeEventListener("pointercancel",a),this.live&&this.send({hs_color:[this.live.h,this.live.s]}),setTimeout(()=>this.live=void 0,1200)};e.addEventListener("pointermove",o),e.addEventListener("pointerup",a),e.addEventListener("pointercancel",a)}render(){const t=this.ctx.hass.states[this.entity];if(!t)return K;const{t:e}=this.ctx,s=to(t.attributes);if(!s.color&&!s.temp)return K;const i=this.tab??(s.color&&"color_temp"!==t.attributes.color_mode?"color":s.temp?"white":"color"),o=this.live??(t.attributes.hs_color?{h:t.attributes.hs_color[0],s:t.attributes.hs_color[1]}:{h:30,s:0}),a=t.attributes.min_color_temp_kelvin??2200,r=t.attributes.max_color_temp_kelvin??6500,n=this.liveK??t.attributes.color_temp_kelvin??Math.round((a+r)/2),l=o.h*Math.PI/180,c=o.s/100;return U`
      ${s.color&&s.temp?U`<div class="tabs" role="tablist">
            <button role="tab" aria-selected=${"color"===i} class=${"color"===i?"on":""} @click=${()=>this.tab="color"}>${e("color")}</button>
            <button role="tab" aria-selected=${"white"===i} class=${"white"===i?"on":""} @click=${()=>this.tab="white"}>${e("temperature")}</button>
          </div>`:K}
      ${"color"===i?U`<div class="wheel" @pointerdown=${t=>this.wheel(t)}>
              <span class="knob" style="left:${50+Math.sin(l)*c*50}%; top:${50-Math.cos(l)*c*50}%; background:hsl(${o.h} ${Math.max(20,o.s)}% ${100-o.s/2}%)"></span>
            </div>
            <div class="swatches">
              ${eo.map(([t,e])=>U`<button
                  class="sw ${Math.abs(t-o.h)<6&&Math.abs(e-o.s)<8?"on":""}"
                  style="background:hsl(${t} ${e}% 60%)"
                  aria-label="hue ${t}"
                  @click=${()=>this.send({hs_color:[t,e]})}
                ></button>`)}
            </div>`:U`<div class="temp">
            <div class="kelvin"><b>${n}</b> K · ${e(n<3200?"warm":n>5e3?"cool":"neutral")}</div>
            <input
              type="range"
              min=${a}
              max=${r}
              step="50"
              .value=${String(n)}
              aria-label=${e("temperature")}
              @input=${t=>this.liveK=Number(t.target.value)}
              @change=${t=>{this.send({color_temp_kelvin:Number(t.target.value)}),setTimeout(()=>this.liveK=void 0,1200)}}
            />
            <div class="swatches">
              ${[a,50*Math.round((2*a+r)/3/50),50*Math.round((a+2*r)/3/50),r].map(t=>U`<button
                  class="sw ${Math.abs(t-n)<150?"on":""}"
                  style="background:${t<3200?"#ffcf8a":t<4200?"#ffe7c2":t<5300?"#fff6ea":"#dfeaff"}"
                  aria-label="${t} K"
                  @click=${()=>this.send({color_temp_kelvin:t})}
                ></button>`)}
            </div>
          </div>`}
    `}};so.styles=[Bs,n`
      :host {
        display: grid;
        justify-items: center;
        gap: 16px;
      }
      .tabs {
        display: flex;
        gap: 6px;
        padding: 5px;
        border-radius: 14px;
        background: rgba(0, 0, 0, 0.18);
        width: min(320px, 100%);
      }
      .tabs button {
        flex: 1;
        height: 38px;
        border-radius: 10px;
        border: 0;
        background: none;
        color: var(--sn-text-dim);
        font-size: 14px;
        cursor: pointer;
      }
      .tabs button.on {
        background: rgba(255, 255, 255, 0.14);
        color: var(--sn-text);
      }
      .wheel {
        position: relative;
        width: min(240px, 70vw);
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle, #fff 0%, rgba(255, 255, 255, 0) 70%),
          conic-gradient(from 0deg, #ff3b30, #ffcc00, #4cd964, #34c2ff, #3a5bff, #c644fc, #ff3b30);
        box-shadow: 0 18px 40px -16px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
        touch-action: none;
        cursor: crosshair;
      }
      .knob {
        position: absolute;
        width: 30px;
        height: 30px;
        margin: -15px 0 0 -15px;
        border-radius: 50%;
        border: 3px solid #fff;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
        pointer-events: none;
      }
      .swatches {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .sw {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.35);
        cursor: pointer;
        transition: transform 0.15s ease;
      }
      .sw.on {
        border-color: #fff;
        transform: scale(1.15);
        box-shadow: 0 0 0 3px var(--sn-accent-glow);
      }
      .temp {
        display: grid;
        gap: 14px;
        width: min(320px, 100%);
        justify-items: center;
      }
      .kelvin {
        font-size: 14px;
        color: var(--sn-text-dim);
      }
      .kelvin b {
        color: var(--sn-text);
        font-size: 22px;
        font-weight: 400;
      }
      .temp input {
        width: 100%;
        height: 34px;
        -webkit-appearance: none;
        appearance: none;
        border-radius: 999px;
        background: linear-gradient(90deg, #ffb46b, #fff3e0 50%, #cfe0ff);
        outline: none;
      }
      .temp input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid rgba(0, 0, 0, 0.25);
      }
      .temp input::-moz-range-thumb {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid rgba(0, 0, 0, 0.25);
      }
    `],Ji([gt({attribute:!1})],so.prototype,"ctx",2),Ji([gt()],so.prototype,"entity",2),Ji([mt()],so.prototype,"tab",2),Ji([mt()],so.prototype,"live",2),Ji([mt()],so.prototype,"liveK",2),so=Ji([pt("sn-light-color")],so);var io=Object.defineProperty,oo=Object.getOwnPropertyDescriptor,ao=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?oo(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&io(e,s,a),a};const ro=[0,25,50,75,100];let no=class extends ct{current(){const t=this.ctx.hass.states[this.entity];return t?"cover"===cs(this.entity)?"number"==typeof t.attributes.current_position?t.attributes.current_position:"open"===t.state?100:0:hs(t)?Math.round((t.attributes.brightness??255)/255*100):0:0}send(t){const{hass:e}=this.ctx,s=this.entity;this.live=t,"cover"===cs(s)?e.callService("cover","set_cover_position",{entity_id:s,position:t}):0===t?e.callService("light","turn_off",{entity_id:s}):e.callService("light","turn_on",{entity_id:s,brightness_pct:t}),clearTimeout(this.clearTimer),this.clearTimer=window.setTimeout(()=>this.live=void 0,1500)}drag(t){const e=t.currentTarget,s=e.getBoundingClientRect(),i=t=>Math.round(100*Math.min(1,Math.max(0,(s.bottom-t.clientY)/s.height)));e.setPointerCapture(t.pointerId),clearTimeout(this.clearTimer),this.live=i(t);const o=t=>this.live=i(t),a=()=>{e.removeEventListener("pointermove",o),e.removeEventListener("pointerup",a),e.removeEventListener("pointercancel",a),this.send(this.live??0)};e.addEventListener("pointermove",o),e.addEventListener("pointerup",a),e.addEventListener("pointercancel",a)}key(t){const e=this.live??this.current();if("ArrowUp"===t.key||"ArrowRight"===t.key)this.send(Math.min(100,e+5));else{if("ArrowDown"!==t.key&&"ArrowLeft"!==t.key)return;this.send(Math.max(0,e-5))}t.preventDefault()}render(){const{t:t,hass:e}=this.ctx,s=this.entity,i=e.states[s];if(!i)return U`<div class="empty">${t("not_configured")}</div>`;const o="cover"===cs(s),a=this.live??this.current(),r=t=>()=>e.callService("cover",t,{entity_id:s}),n=o?void 0:to(i.attributes),l=!!n&&(n.color||n.temp);return U`
      <div class="cols ${l?"two":""}">
      <div class="wrap">
        <div class="value">${a}<small>%</small></div>
        <div class="sub">${t(o?0===a?"closed":100===a?"opened":"position":0===a?"off":"brightness")}</div>
        <div
          class="track ${o?"cover":""}"
          role="slider"
          tabindex="0"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${a}
          aria-label=${t(o?"position":"brightness")}
          @pointerdown=${this.drag}
          @keydown=${this.key}
        >
          <div class="fill" style="height:${a}%"></div>
          <span class="ic">${js(Ts(s,i),30)}</span>
        </div>
        <div class="presets">
          ${ro.map(t=>U`<button class=${t===a?"on":""} @click=${()=>this.send(t)}>${t}%</button>`)}
        </div>
        ${o?U`<div class="actions">
              <button class="round" aria-label=${t("open")} @click=${r("open_cover")}>${js("M4.08,11.92L12,4L19.92,11.92L18.5,13.33L13,7.83V22H11V7.83L5.5,13.33L4.08,11.92M12,4H22V2H2V4H12Z")}</button>
              <button class="round" aria-label=${t("stop")} @click=${r("stop_cover")}>${js("M18,18H6V6H18V18Z")}</button>
              <button class="round" aria-label=${t("close")} @click=${r("close_cover")}>${js("M19.92,12.08L12,20L4.08,12.08L5.5,10.67L11,16.17V2H13V16.17L18.5,10.66L19.92,12.08M12,20H2V22H22V20H12Z")}</button>
            </div>`:U`<div class="actions">
              <button class="round ${hs(i)?"lit":""}" aria-label=${t("on")} @click=${()=>e.callService("light","toggle",{entity_id:s})}>${js(ve)}</button>
            </div>`}
      </div>
      ${l?U`<sn-light-color class="colour" .ctx=${this.ctx} .entity=${s}></sn-light-color>`:""}
      </div>
    `}};no.styles=[Bs,n`
      .cols {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 22px 40px;
      }
      .cols.two .track {
        height: min(300px, 40vh);
      }
      .colour {
        flex: 1;
        min-width: 260px;
      }
      .wrap {
        display: grid;
        justify-items: center;
        gap: 14px;
        padding: 4px 0 8px;
      }
      .value {
        font-size: 56px;
        font-weight: 300;
        line-height: 1;
        letter-spacing: -0.03em;
        direction: ltr;
      }
      .value small {
        font-size: 22px;
      }
      .sub {
        margin-top: -8px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .track {
        position: relative;
        width: 120px;
        height: min(320px, 42vh);
        border-radius: 34px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--sn-glass-border);
        touch-action: none;
        cursor: ns-resize;
        outline: none;
      }
      .track:focus-visible {
        box-shadow: 0 0 0 3px var(--sn-accent-glow);
      }
      .fill {
        position: absolute;
        inset: auto 0 0 0;
        background: linear-gradient(0deg, #9ccf6c, #e3f3d2);
        box-shadow: 0 0 24px var(--sn-accent-glow);
        transition: height 0.12s ease-out;
      }
      .track.cover .fill {
        background: repeating-linear-gradient(0deg, #d8d2ca 0 14px, #c7c0b7 14px 16px);
        box-shadow: none;
      }
      .ic {
        position: absolute;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%);
        color: #1d1b19;
        mix-blend-mode: normal;
      }
      .presets {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .presets button {
        height: 36px;
        min-width: 54px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .presets button.on {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
      .actions {
        display: flex;
        gap: 12px;
      }
      .round.lit {
        background: var(--sn-accent);
        color: #1d2a12;
      }
    `],ao([gt({attribute:!1})],no.prototype,"ctx",2),ao([gt()],no.prototype,"entity",2),ao([mt()],no.prototype,"live",2),no=ao([pt("sn-level")],no);var lo=Object.defineProperty,co=Object.getOwnPropertyDescriptor,po=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?co(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&lo(e,s,a),a};const ho=300,uo=120,go=(t,e=82)=>{const s=t*Math.PI/180;return[100+e*Math.cos(s),100+e*Math.sin(s)]},mo=(t,e)=>{const[s,i]=go(t),[o,a]=go(e);return`M${s},${i} A82,82 0 ${e-t>180?1:0} 1 ${o},${a}`};let fo=class extends ct{constructor(){super(...arguments),this.bare=!1}angleToTemp(t,e,s,i){const o=this.renderRoot.querySelector("svg.ring").getBoundingClientRect();let a=(180*Math.atan2(t.clientY-(o.top+o.height/2),t.clientX-(o.left+o.width/2))/Math.PI-uo+720)%360;a>ho&&(a=a-ho<30?ho:0);const r=e+a/ho*(s-e);return Math.round(r/i)*i}down(t,e){const{min:s,max:i,step:o}=Cs(this.ctx.hass.states[e]),a=t.currentTarget;a.setPointerCapture(t.pointerId),this.dragTarget=this.angleToTemp(t,s,i,o);const r=t=>{this.dragTarget=this.angleToTemp(t,s,i,o)},n=()=>{a.removeEventListener("pointermove",r),a.removeEventListener("pointerup",n),a.removeEventListener("pointercancel",n),void 0!==this.dragTarget&&_s(this.ctx.hass,e,this.dragTarget),setTimeout(()=>this.dragTarget=void 0,1500)};a.addEventListener("pointermove",r),a.addEventListener("pointerup",n),a.addEventListener("pointercancel",n)}modes(t){const e=this.ctx.hass.states[t],s=e.attributes.hvac_modes??[],i=e.attributes.preset_modes??[],o=this.ctx.t,a=[],r=e=>()=>this.ctx.hass.callService("climate","set_hvac_mode",{entity_id:t,hvac_mode:e}),n=s.includes("auto")?"auto":s.includes("heat_cool")?"heat_cool":void 0,l="eco"===e.attributes.preset_mode;return n&&a.push({key:"auto",label:o("mode_auto"),icon:"M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z",active:e.state===n&&!l,run:r(n)}),s.includes("cool")&&a.push({key:"cool",label:o("mode_cool"),icon:"M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z",active:"cool"===e.state&&!l,run:r("cool")}),s.includes("heat")&&a.push({key:"heat",label:o("mode_heat"),icon:Yt,active:"heat"===e.state&&!l,run:r("heat")}),i.includes("eco")&&a.push({key:"eco",label:o("mode_eco"),icon:oe,active:l,run:()=>this.ctx.hass.callService("climate","set_preset_mode",{entity_id:t,preset_mode:"eco"})}),s.includes("off")&&a.push({key:"off",label:o("mode_off"),icon:ve,active:"off"===e.state,run:r("off")}),a}render(){const{t:t,config:e,editing:s,hass:i}=this.ctx,o=this.entity??e.home.climate,a=o?i.states[o]:void 0,r=s&&!this.entity?U`<button class="round gear" aria-label=${t("settings")} @click=${()=>{var t;(t=this.ctx).showSheet({title:t.t("climate_comfort"),render:t=>U`
      ${Ys(t,t.t("climate_entity"),t.config.home.climate,Ks(t,["climate"]),e=>t.update(t=>t.home.climate=e))}
      ${Ys(t,t.t("humidity_sensor"),t.config.home.humidity,Ks(t,["sensor"],["humidity"]),e=>t.update(t=>t.home.humidity=e))}
    `})}}>${js(Ot,18)}</button>`:K,n=U`<div class="card-head">
      <span class="round">${js(ts,20)}</span>
      <h3>${this.entity?ps(i,this.entity):t("climate_comfort")}</h3>
      ${r}
    </div>`;if(!o||us(a))return U`<div class="card ${this.bare?"":"glass"}">${n}<div class="empty">${t("not_configured")}</div></div>`;const{target:l,current:c,min:d,max:p}=Cs(a),h=this.dragTarget??l,u=(this.entity?void 0:gs(i.states[e.home.humidity??""]))??a.attributes.current_humidity,g=void 0!==h?Math.min(1,Math.max(0,(h-d)/(p-d))):0,m=uo+g*ho,[f,b]=go(m),x=Array.from({length:31},(t,e)=>uo+e/30*ho),v="off"===a.state;return U`<div class="card ${this.bare?"":"glass"}">
      ${this.bare?K:n}
      <div class="body">
        <div class="dial">
          <svg class="ring" viewBox="0 0 200 200" @pointerdown=${t=>this.down(t,o)}>
            <defs>
              <linearGradient id="g" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stop-color="#e3f3d2"></stop>
                <stop offset="1" stop-color="#9ccf6c"></stop>
              </linearGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"></feGaussianBlur></filter>
            </defs>
            <circle cx="100" cy="100" r="64" fill="rgba(255,255,255,0.06)"></circle>
            <path d=${mo(uo,420)} stroke="rgba(255,255,255,0.12)" stroke-width="20" fill="none" stroke-linecap="round"></path>
            ${x.map(t=>{const[e,s]=go(t,79),[i,o]=go(t,85);return B`<line x1=${e} y1=${s} x2=${i} y2=${o} stroke="rgba(255,255,255,0.25)" stroke-width="1"></line>`})}
            ${!v&&g>0?B`<path d=${mo(uo,m)} stroke="url(#g)" stroke-width="20" fill="none" stroke-linecap="round" opacity="0.35" filter="url(#glow)"></path>
                 <path d=${mo(uo,m)} stroke="url(#g)" stroke-width="16" fill="none" stroke-linecap="round"></path>`:K}
            <circle cx=${f} cy=${b} r="13" fill="#d9eec4" stroke="rgba(255,255,255,0.8)" stroke-width="2"></circle>
          </svg>
          <div class="center">
            <div class="now">${void 0!==c?c.toFixed(1):"–"}°</div>
            ${void 0!==h?U`<div class="target">${t("target",{t:h})}</div>`:K}
          </div>
          ${void 0!==u?U`<span class="chip hum"><span class="ic">${js("M20 14H22V16H20C18.62 16 17.26 15.65 16 15C13.5 16.3 10.5 16.3 8 15C6.74 15.65 5.37 16 4 16H2V14H4C5.39 14 6.78 13.53 8 12.67C10.44 14.38 13.56 14.38 16 12.67C17.22 13.53 18.61 14 20 14M20 20H22V22H20C18.62 22 17.26 21.65 16 21C13.5 22.3 10.5 22.3 8 21C6.74 21.65 5.37 22 4 22H2V20H4C5.39 20 6.78 19.53 8 18.67C10.44 20.38 13.56 20.38 16 18.67C17.22 19.53 18.61 20 20 20M22 6L18 2V5H13V7H18V10",14)}</span>${Math.round(u)}% HR</span>`:K}
        </div>
        <div class="modes">
          ${this.modes(o).map(t=>U`<button class="mode ${t.active?"on":""}" @click=${t.run}>${js(t.icon,16)}<span>${t.label}</span></button>`)}
        </div>
      </div>
    </div>`}};fo.styles=[Bs,n`
      :host {
        display: block;
      }
      .card {
        height: 100%;
        padding: 20px 22px 22px;
      }
      :host([bare]) .card {
        padding: 0;
      }
      :host([bare]) .dial {
        max-width: 280px;
      }
      .body {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .dial {
        position: relative;
        flex: 1;
        min-width: 0;
        max-width: 230px;
        aspect-ratio: 1;
      }
      .ring {
        width: 100%;
        height: 100%;
        touch-action: none;
        cursor: grab;
        direction: ltr;
      }
      .center {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        text-align: center;
        pointer-events: none;
      }
      .now {
        font-size: 44px;
        font-weight: 300;
        letter-spacing: -0.03em;
        line-height: 1;
      }
      .target {
        margin-top: 4px;
        font-size: 11px;
        color: var(--sn-text-dim);
      }
      .hum {
        position: absolute;
        top: -4%;
        inset-inline-end: -6%;
        height: 30px;
        font-size: 12px;
        background: var(--sn-glass-strong);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
      }
      .modes {
        display: grid;
        gap: 6px;
        padding: 6px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.05);
        min-width: 96px;
      }
      .mode {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 38px;
        padding: 0 12px;
        border: 0;
        border-radius: 14px;
        background: transparent;
        color: var(--sn-text-dim);
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s ease, color 0.2s ease;
      }
      .mode.on {
        background: rgba(255, 255, 255, 0.14);
        color: var(--sn-text);
      }
      .mode.on .icon {
        color: var(--sn-accent);
      }
    `],po([gt({attribute:!1})],fo.prototype,"ctx",2),po([gt()],fo.prototype,"entity",2),po([gt({type:Boolean,reflect:!0})],fo.prototype,"bare",2),po([mt()],fo.prototype,"dragTarget",2),fo=po([pt("sn-climate-card")],fo);var bo=Object.defineProperty,xo=Object.getOwnPropertyDescriptor,vo=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?xo(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&bo(e,s,a),a};let yo=class extends ct{constructor(){super(...arguments),this.bare=!1,this.liveVol={}}volDrag(t,e){const s=t.currentTarget,i=s.getBoundingClientRect(),o=this.ctx.rtl,a=t=>{const e=Math.min(1,Math.max(0,(t.clientX-i.left)/i.width));return o?1-e:e};s.setPointerCapture(t.pointerId),this.liveVol={...this.liveVol,[e]:a(t)};const r=t=>this.liveVol={...this.liveVol,[e]:a(t)},n=()=>{s.removeEventListener("pointermove",r),s.removeEventListener("pointerup",n),s.removeEventListener("pointercancel",n),this.ctx.hass.callService("media_player","volume_set",{entity_id:e,volume_level:Math.round(100*this.liveVol[e])/100}),setTimeout(()=>{const{[e]:t,...s}=this.liveVol;this.liveVol=s},1500)};s.addEventListener("pointermove",r),s.addEventListener("pointerup",n),s.addEventListener("pointercancel",n)}render(){const t=this.entity,{hass:e,t:s}=this.ctx,i=e.states[t];if(!i)return U`<div class="empty">${s("not_configured")}</div>`;const o=i.attributes,a=o.supported_features??0,r=hs(i),n="playing"===i.state,l=o.entity_picture,c=o.media_title,d=[o.media_artist,o.app_name??o.source].filter(Boolean).join(" · "),p=this.liveVol[t]??("number"==typeof o.volume_level?o.volume_level:void 0),h=s=>()=>e.callService("media_player",s,{entity_id:t});return U`<div class="player ${this.bare?"":"glass"} ${n?"playing":""}">
      <div class="art" style=${l&&r?`--art: url("${l}")`:""}>
        ${l&&r?U`<img src=${l} alt="" loading="lazy" />`:js(Ts(t,i),46)}
      </div>
      <div class="body">
        <div class="head">
          <div class="titles">
            <span class="dev">${ps(e,t)}${ks(e,t)?U` · ${ks(e,t)}`:K}</span>
            <span class="title">${r?c??i.state:s("off")}</span>
            ${r&&d?U`<span class="sub">${d}</span>`:K}
          </div>
          ${128&a||r?U`<button class="round small ${r?"lit":""}" aria-label=${s("on")} @click=${h(r?"turn_off":"turn_on")}>${js(ve,18)}</button>`:K}
        </div>
        ${r?U`<div class="transport">
              ${16&a?U`<button class="round" aria-label="previous" @click=${h("media_previous_track")}>${js("M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z")}</button>`:K}
              ${16385&a?U`<button class="round big" aria-label=${n?"pause":"play"} @click=${h("media_play_pause")}>${js(n?ge:be,26)}</button>`:K}
              ${32&a?U`<button class="round" aria-label="next" @click=${h("media_next_track")}>${js("M16,18H18V6H16M6,18L14.5,12L6,6V18Z")}</button>`:K}
            </div>
            ${4&a&&void 0!==p?U`<div class="vol">
                  ${js("M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",18)}
                  <div class="vtrack" @pointerdown=${e=>this.volDrag(e,t)}>
                    <span style="width:${100*p}%"></span>
                  </div>
                  <span class="vnum">${Math.round(100*p)}</span>
                </div>`:K}`:K}
      </div>
    </div>`}};yo.styles=[Bs,n`
      :host {
        display: block;
      }
      :host([bare]) .player {
        padding: 0;
        flex-wrap: wrap;
      }
      :host([bare]) .art {
        width: 200px;
        height: 200px;
        border-radius: 28px;
      }
      .player {
        display: flex;
        gap: 16px;
        padding: 16px;
        overflow: hidden;
      }
      .art {
        position: relative;
        flex: none;
        display: grid;
        place-items: center;
        width: 120px;
        height: 120px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text-dim);
        overflow: hidden;
      }
      .art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .playing .art {
        box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.5);
      }
      .body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .head {
        display: flex;
        gap: 8px;
      }
      .titles {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      .dev {
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      .title {
        font-size: 17px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
      }
      .sub {
        font-size: 13px;
        color: var(--sn-text-dim);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .round.small {
        width: 36px;
        height: 36px;
      }
      .round.lit {
        background: var(--sn-accent);
        color: #1d2a12;
      }
      .transport {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .round.big {
        width: 54px;
        height: 54px;
        background: #fff;
        color: #1d1b19;
      }
      .vol {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--sn-text-dim);
      }
      .vtrack {
        position: relative;
        flex: 1;
        height: 26px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;
        touch-action: none;
        cursor: ew-resize;
      }
      .vtrack span {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        background: linear-gradient(90deg, rgba(181, 220, 143, 0.5), var(--sn-accent));
      }
      .vnum {
        min-width: 26px;
        font-size: 12px;
        text-align: end;
      }
    `],vo([gt({attribute:!1})],yo.prototype,"ctx",2),vo([gt()],yo.prototype,"entity",2),vo([gt({type:Boolean,reflect:!0})],yo.prototype,"bare",2),vo([mt()],yo.prototype,"liveVol",2),yo=vo([pt("sn-media-player")],yo);const $o=.25,wo=.12,Co=1.05,_o=.9,Ho=(t,e=.25)=>Math.round(t/e)*e,ko=t=>t.pts&&t.pts.length>=3?t.pts:[{x:t.x,y:t.y},{x:t.x+t.w,y:t.y},{x:t.x+t.w,y:t.y+t.h},{x:t.x,y:t.y+t.h}];function Vo(t){const e=t.map(t=>t.x),s=t.map(t=>t.y),i=Math.min(...e),o=Math.min(...s);return{x:i,y:o,w:Math.max(...e)-i,h:Math.max(...s)-o}}const Mo=(t,e)=>({...t,pts:e,...Vo(e)});function Ao(t,e,s){let i=!1;for(let o=0,a=t.length-1;o<t.length;a=o++){const r=t[o],n=t[a];r.y>s!=n.y>s&&e<(n.x-r.x)*(s-r.y)/(n.y-r.y)+r.x&&(i=!i)}return i}function Lo(t){const e=ko(t),s=function(t){let e=0,s=0,i=0;for(let o=0,a=t.length-1;o<t.length;a=o++){const r=t[a].x*t[o].y-t[o].x*t[a].y;e+=r,s+=(t[a].x+t[o].x)*r,i+=(t[a].y+t[o].y)*r}return Math.abs(e)<1e-9?{x:t[0].x,y:t[0].y}:{x:s/(3*e),y:i/(3*e)}}(e);if(Ao(e,s.x,s.y))return s;let i=s,o=1/0;for(let a=t.x+.25;a<t.x+t.w;a+=.25)for(let r=t.y+.25;r<t.y+t.h;r+=.25){if(!Ao(e,a,r))continue;const t=(a-s.x)**2+(r-s.y)**2;t<o&&(o=t,i={x:a,y:r})}return i}const So=(t,e,s)=>[...t.rooms].reverse().find(t=>Ao(ko(t),e,s));function zo(t){const e=[...t.rooms.flatMap(ko),...(t.walls??[]).flatMap(t=>[{x:t.x1,y:t.y1},{x:t.x2,y:t.y2}])];return e.length?Vo(e):{x:0,y:0,w:10,h:8}}const Po=1e-6;const Eo=(t,e,s)=>t.dx*e+t.dy*s,Oo=(t,e,s)=>-t.dy*e+t.dx*s-t.c,Zo=(t,e)=>({x:t.dx*e-t.dy*t.c,y:t.dy*e+t.dx*t.c});function jo(t){const e=[...t].sort((t,e)=>t[0]-e[0]),s=[];for(const[i,o]of e){const t=s[s.length-1];t&&i<=t[1]+Po?t[1]=Math.max(t[1],o):s.push([i,o])}return s}function To(t,e){let s=t;for(const[i,o]of e){const t=[];for(const[e,a]of s)o<=e||i>=a?t.push([e,a]):(i>e+Po&&t.push([e,i]),o<a-Po&&t.push([o,a]));s=t}return s.filter(([t,e])=>e-t>.05)}function Do(t){return void 0!==t.x&&void 0!==t.y?{x:t.x,y:t.y,angle:(t.angle??0)*Math.PI/180}:"v"===t.axis?{x:t.line??0,y:t.at??0,angle:Math.PI/2}:{x:t.at??0,y:t.line??0,angle:0}}function Fo(t){const e=new Map,s=(t,s,i,o)=>{if(Math.hypot(i-t,o-s)<.01)return;const a=function(t,e,s,i){let o=Math.atan2(i-e,s-t);o<0&&(o+=Math.PI),o>=Math.PI-1e-4&&(o-=Math.PI);const a=Math.cos(o),r=Math.sin(o),n=-r*t+a*e;return{a:o,dx:a,dy:r,c:n,key:`${Math.round(2e3*o)}:${Math.round(100*n)}`}}(t,s,i,o),r=e.get(a.key)??{line:a,parts:[],breaks:[]},n=Eo(a,t,s),l=Eo(a,i,o);r.parts.push([Math.min(n,l),Math.max(n,l)]),e.set(a.key,r)};for(const o of t.rooms){const t=ko(o);t.forEach((e,i)=>{const o=t[(i+1)%t.length];s(e.x,e.y,o.x,o.y)})}for(const o of t.walls??[])s(o.x1,o.y1,o.x2,o.y2);const i=[...t.rooms.flatMap(ko),...(t.walls??[]).flatMap(t=>[{x:t.x1,y:t.y1},{x:t.x2,y:t.y2}])];for(const o of e.values()){const t=i.filter(t=>Math.abs(Oo(o.line,t.x,t.y))<.02).map(t=>Eo(o.line,t.x,t.y));o.breaks=[...new Set(t.map(t=>Math.round(1e3*t)/1e3))].sort((t,e)=>t-e)}return e}function Ro(t,e,s=!1){const i=[];for(const o of t.doors){if(s&&!o.open)continue;const t=Do(o);let a=t.angle%Math.PI;a<0&&(a+=Math.PI);if(Math.min(Math.abs(a-e.a),Math.PI-Math.abs(a-e.a))>.01||Math.abs(Oo(e,t.x,t.y))>.03)continue;const r=Eo(e,t.x,t.y);i.push([r-o.width/2,r+o.width/2])}return i}function Io(t){const e=[];for(const{line:s,parts:i}of Fo(t).values())for(const[o,a]of To(jo(i),Ro(t,s))){const t=Zo(s,o),i=Zo(s,a);e.push({x1:t.x,y1:t.y,x2:i.x,y2:i.y,angle:s.a})}return e}function No(t,e,s,i=.4){let o;for(const{line:n,parts:l,breaks:c}of Fo(t).values()){const t=Math.abs(Oo(n,e,s));if(t>i||o&&t>=o.d)continue;const a=Eo(n,e,s),r=jo(l).find(([t,e])=>a>=t-.05&&a<=e+.05);if(!r)continue;const d=Math.max(r[0],...c.filter(t=>t<=a+1e-6)),p=Math.min(r[1],...c.filter(t=>t>=a-1e-6)),h=Zo(n,(d+p)/2),u=Zo(n,Math.min(Math.max(a,d),p));let g;if(p-d>=1){const t=Math.min(p-.45,Math.max(d+.45,Ho(a,.05)));g=Zo(n,t)}o={x:u.x,y:u.y,angle:180*n.a/Math.PI,piece:{x:h.x,y:h.y,width:p-d},door:g,d:t}}if(!o)return;const{d:a,...r}=o;return r}function Wo(t,e){const s=Do(t),i=ko(e);return i.some((t,e)=>{const o=i[(e+1)%i.length],a=Math.hypot(o.x-t.x,o.y-t.y);if(a<.01)return!1;const r=((s.x-t.x)*(o.x-t.x)+(s.y-t.y)*(o.y-t.y))/(a*a);if(r<-.05||r>1.05)return!1;const n=t.x+r*(o.x-t.x),l=t.y+r*(o.y-t.y);return Math.hypot(s.x-n,s.y-l)<.05})}function Uo(t,e,s=.3){const i=e.flatMap(ko),o=i.map(t=>t.x),a=i.map(t=>t.y),r=(t,e)=>{let i=Ho(t),o=s;for(const s of e){const e=Math.abs(s-t);e<o&&(o=e,i=s)}return i},n=r(t.x,o),l=r(t.y,a),c=r(t.x+t.w,o),d=r(t.y+t.h,a);return{...t,x:n,y:l,w:Math.max(1,c-n),h:Math.max(1,d-l)}}function Bo(t,e,s,i=.3,o=.05){let a={x:Ho(e,o),y:Ho(s,o)},r=i;const n=[...t.rooms.flatMap(ko),...(t.walls??[]).flatMap(t=>[{x:t.x1,y:t.y1},{x:t.x2,y:t.y2}])];for(const l of n){const t=Math.hypot(l.x-e,l.y-s);t<r&&(r=t,a={x:l.x,y:l.y})}return a}function qo(t,e,s=0){if(!e)return[];const i=ko(t),o={x:t.x,y:t.y+s,w:t.w,h:t.h-s};for(let r=1;r<6;r++){const t=Math.max(1,Math.round(Math.sqrt(e*o.w/Math.max(.1,o.h))*r)),s=Math.max(1,Math.ceil(e*r*r/t)),a=[];for(let e=0;e<s;e++)for(let r=0;r<t;r++){const n=o.x+(r+.5)/t*o.w,l=o.y+(e+.5)/s*o.h;Ao(i,n,l)&&a.push({x:n,y:l})}if(a.length>=e){const t=a.length/e;return Array.from({length:e},(e,s)=>a[Math.floor(s*t)])}}const a=Lo(t);return Array.from({length:e},()=>a)}const Ko=["door","window","garage_door","opening"],Yo=["light","switch","fan","media_player","vacuum","cover","lock","climate","humidifier"];function Go(t){if(Array.isArray(t.rgb_color))return t.rgb_color;const e=t.color_temp_kelvin;if(e){const t=Math.min(1,Math.max(0,(e-2200)/4300));return[255,Math.round(196+50*t),Math.round(140+110*t)]}return[255,214,160]}function Xo(t,e,s,i){const o=e.split(".")[1],a=`${s}.${o}${i}`;if(t.states[a])return a;const r=t.entities?.[e]?.device_id;return r?Object.values(t.entities??{}).find(t=>t.device_id===r&&t.entity_id.startsWith(`${s}.`)&&t.entity_id.endsWith(i))?.entity_id:void 0}function Jo(t,e){const s=Object.keys(t.states).some(e=>e.startsWith("person.")&&"home"===t.states[e].state),i=[];for(const o of e.furniture??[]){if("camera"!==o.type||!o.entity)continue;const a="camera"===cs(o.entity)?o.entity:void 0,r=a?Xo(t,a,"binary_sensor","_person_occupancy"):o.entity,n=r?t.states[r]:void 0;if("on"!==n?.state)continue;const l=e.rooms.find(t=>Ao(ko(t),o.x,o.y));if(l&&s)continue;const c=a?Xo(t,a,"image","_person"):void 0;i.push({id:o.id,camera:a,roomId:l?.id,x:o.x,y:o.y,image:c?t.states[c]?.attributes.entity_picture:void 0,since:n.last_changed})}return i}const Qo=["light","switch"],ta=["switch","input_boolean"],ea=["media_player"],sa=(t,e,s,i,o,a,r,n={})=>({type:t,category:e,name:{en:s,ar:i},icon:o,w:a,d:r,...n}),ia=[sa("ac","smart","AC (wall unit)","مكيف حيط",$t,.95,.26,{domains:["climate"],z:.72}),sa("ac_floor","smart","AC (standing)","مكيف واقف",$t,.45,.35,{domains:["climate"]}),sa("ceiling_fan","smart","Ceiling fan","مروحة سقف","M8 3V5H11V10.27C10.38 10.63 10 11.29 10 12V13H14V12C14 11.29 13.62 10.63 13 10.27V5H16V3H8M6 12C3.79 12 2 12.67 2 13.5S3.79 15 6 15 10 14.33 10 13.5 8.21 12 6 12M18 12C15.79 12 14 12.67 14 13.5S15.79 15 18 15 22 14.33 22 13.5 20.21 12 18 12M10 14V15C10 15.72 10.38 16.38 11 16.73C11.62 17.09 12.38 17.09 13 16.73C13.62 16.38 14 15.71 14 15V14H10Z",1.2,1.2,{domains:["fan",...ta],mount:"ceiling"}),sa("floor_fan","smart","Standing fan","مروحة أرضية",Ut,.45,.45,{domains:["fan",...ta]}),sa("air_purifier","smart","Air purifier","منقّي هوا","M11,9A4,4 0 0,1 15,13A4,4 0 0,1 11,17A4,4 0 0,1 7,13A4,4 0 0,1 11,9M11,11A2,2 0 0,0 9,13A2,2 0 0,0 11,15A2,2 0 0,0 13,13A2,2 0 0,0 11,11M7,4H14A4,4 0 0,1 18,8V9H16V8A2,2 0 0,0 14,6H7A2,2 0 0,0 5,8V20H16V18H18V22H3V8A4,4 0 0,1 7,4M16,11C18.5,11 18.5,9 21,9V11C18.5,11 18.5,13 16,13V11M16,15C18.5,15 18.5,13 21,13V15C18.5,15 18.5,17 16,17V15Z",.35,.35,{domains:["fan",...ta]}),sa("humidifier","smart","Humidifier","مرطّب","M11 9C8.79 9 7 10.79 7 13S8.79 17 11 17 15 15.21 15 13 13.21 9 11 9M11 15C9.9 15 9 14.11 9 13S9.9 11 11 11 13 11.9 13 13 12.11 15 11 15M7 4H14C16.21 4 18 5.79 18 8V9H16V8C16 6.9 15.11 6 14 6H7C5.9 6 5 6.9 5 8V20H16V18H18V22H3V8C3 5.79 4.79 4 7 4M19 10.5C19 10.5 21 12.67 21 14C21 15.1 20.1 16 19 16S17 15.1 17 14C17 12.67 19 10.5 19 10.5",.3,.3,{domains:["humidifier",...ta]}),sa("radiator","smart","Radiator / heater","دفاية","M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z",1,.12,{domains:["climate",...ta]}),sa("water_heater","smart","Water heater","سخان","M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z",.5,.5,{domains:[...ta,"climate","water_heater"]}),sa("floor_lamp","smart","Floor lamp","لمبادير","M15,2L17,9H7L9,2M11,10H13V20H16V22H8V20H11V10Z",.42,.42,{domains:Qo}),sa("table_lamp","smart","Table lamp","أباجورة","M14.56 4L17.23 12H6.78L9.44 4H14.56M16 2H8L4 14H20L16 2M11 15H13V20H18V22H6V20H11V15Z",.32,.32,{domains:Qo,z:.37}),sa("desk_lamp","smart","Desk lamp","ضو مكتب","M10.85,2L9.18,4.5L10.32,5.25L7.14,10C7.1,10 7.05,10 7,10A2,2 0 0,0 5,12C5,12.94 5.66,13.75 6.58,13.95L10.62,20H7V22H17V20H13L8.53,13.28C8.83,12.92 9,12.47 9,12C9,11.7 8.93,11.4 8.8,11.13L12,6.37C11.78,8.05 12.75,9.89 14.45,11L18.89,4.37C17.2,3.24 15.12,3.04 13.65,3.87L10.85,2M18.33,7L16.67,9.5C17.35,9.95 18.29,9.77 18.75,9.08C19.21,8.39 19,7.46 18.33,7Z",.25,.25,{domains:Qo,z:.54}),sa("ceiling_light","smart","Ceiling light","ضو سقف",St,.55,.55,{domains:Qo,mount:"ceiling"}),sa("kitchen_light","smart","Pendant light","ضو معلّق","M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2M14 13.58V16H13V11.41L14.71 9.71C15.1 9.32 15.1 8.68 14.71 8.29C14.32 7.9 13.68 7.9 13.29 8.29L12 9.59L10.71 8.29C10.32 7.9 9.68 7.9 9.29 8.29C8.9 8.68 8.9 9.32 9.29 9.71L11 11.41V16H10V13.58C8.23 12.81 7 11.05 7 9C7 6.24 9.24 4 12 4S17 6.24 17 9C17 11.05 15.77 12.81 14 13.58M9 20H15V21C15 21.55 14.55 22 14 22H10C9.45 22 9 21.55 9 21V20Z",.5,.5,{domains:Qo,mount:"ceiling"}),sa("chandelier","smart","Chandelier","ثريا","M15 13.1C15 14.76 13.66 16.1 12 16.1S9 14.76 9 13.1 10.34 10.1 12 10.1 15 11.44 15 13.1M9 2V3C9 4.11 9.9 5 11 5V9.1C11.32 9.04 11.66 9 12 9S12.68 9.04 13 9.1V5C14.11 5 15 4.11 15 3V2H9M4 11.1C2.34 11.1 1 12.44 1 14.1S2.34 17.1 4 17.1 7 15.76 7 14.1 5.66 11.1 4 11.1M20 11.1C18.34 11.1 17 12.44 17 14.1S18.34 17.1 20 17.1 23 15.76 23 14.1 21.66 11.1 20 11.1M20 18.1C19.32 18.1 18.67 17.96 18.08 17.71C17.6 17.95 17.07 18.1 16.5 18.1C15.39 18.1 14.41 17.57 13.77 16.77C13.22 17 12.63 17.1 12 17.1S10.78 17 10.23 16.77C9.59 17.57 8.61 18.1 7.5 18.1C6.93 18.1 6.4 17.95 5.92 17.71C5.33 17.96 4.68 18.1 4 18.1C3.73 18.1 3.46 18.06 3.2 18C4.21 19.29 5.76 20.1 7.5 20.1C8.83 20.1 10.05 19.63 11 18.84V21.1C11 21.65 11.45 22.1 12 22.1C12.55 22.1 13 21.65 13 21.1V18.84C13.95 19.63 15.17 20.1 16.5 20.1C18.24 20.1 19.79 19.29 20.8 18C20.54 18.06 20.27 18.1 20 18.1Z",.9,.9,{domains:Qo,mount:"ceiling"}),sa("spotlight","smart","Spotlight","سبوت","M2,6L7.09,8.55C6.4,9.5 6,10.71 6,12C6,13.29 6.4,14.5 7.09,15.45L2,18V6M6,3H18L15.45,7.09C14.5,6.4 13.29,6 12,6C10.71,6 9.5,6.4 8.55,7.09L6,3M22,6V18L16.91,15.45C17.6,14.5 18,13.29 18,12C18,10.71 17.6,9.5 16.91,8.55L22,6M18,21H6L8.55,16.91C9.5,17.6 10.71,18 12,18C13.29,18 14.5,17.6 15.45,16.91L18,21M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z",.2,.2,{domains:Qo,mount:"ceiling"}),sa("led_strip","smart","LED strip","شريط LED","M2.95 3L2 6.91L19.34 11.25L20.29 7.34L2.95 3M6.09 6.89L4.16 6.41L4.64 4.46L6.57 4.94L6.09 6.89M9.94 7.86L8 7.38L8.5 5.42L10.42 5.91L9.94 7.86M13.8 8.82L11.87 8.34L12.35 6.39L14.27 6.87L13.8 8.82M17.65 9.79L15.72 9.31L16.2 7.35L18.13 7.84L17.65 9.79M4.66 12.75L3.71 16.66L21.05 21L22 17.1L4.66 12.75M7.8 16.65L5.88 16.16L6.35 14.21L8.28 14.69L7.8 16.65M11.65 17.61L9.73 17.13L10.2 15.18L12.13 15.66L11.65 17.61M15.5 18.58L13.58 18.09L14.06 16.14L16 16.62L15.5 18.58M19.36 19.54L17.43 19.06L17.91 17.11L19.84 17.59L19.36 19.54M6.25 12.11L11 10.2L17.75 11.89L13 13.8L6.25 12.11Z",2,.04,{domains:Qo,z:.95}),sa("tv_unit","smart","TV + unit","تلفزيون مع طاولة",Re,1.8,.45,{domains:ea}),sa("tv_wall","smart","Wall TV","تلفزيون حيط","M3 11H0V9H3V11M3 14H0V16H3V14M5 5.12L2.88 3L1.46 4.41L3.59 6.54L5 5.12M10 5V2H8V5H10M24 9H21V11H24V9M16 5V2H14V5H16M20.41 6.54L22.54 4.42L21.12 3L19 5.12L20.41 6.54M24 14H21V16H24V14M19 9V16C19 17.1 18.1 18 17 18H15V20H9V18H7C5.9 18 5 17.1 5 16V9C5 7.9 5.9 7 7 7H17C18.1 7 19 7.9 19 9M17 9H7V16H17V9M19 19.88L21.12 22L22.54 20.59L20.41 18.47L19 19.88M3.59 18.46L1.47 20.59L2.88 22L5 19.88L3.59 18.46Z",1.4,.08,{domains:ea,z:.42}),sa("projector","smart","Projector","بروجكتر","M16,6C14.87,6 13.77,6.35 12.84,7H4C2.89,7 2,7.89 2,9V15C2,16.11 2.89,17 4,17H5V18A1,1 0 0,0 6,19H8A1,1 0 0,0 9,18V17H15V18A1,1 0 0,0 16,19H18A1,1 0 0,0 19,18V17H20C21.11,17 22,16.11 22,15V9C22,7.89 21.11,7 20,7H19.15C18.23,6.35 17.13,6 16,6M16,7.5A3.5,3.5 0 0,1 19.5,11A3.5,3.5 0 0,1 16,14.5A3.5,3.5 0 0,1 12.5,11A3.5,3.5 0 0,1 16,7.5M4,9H8V10H4V9M16,9A2,2 0 0,0 14,11A2,2 0 0,0 16,13A2,2 0 0,0 18,11A2,2 0 0,0 16,9M4,11H8V12H4V11M4,13H8V14H4V13Z",.35,.3,{domains:ea,mount:"ceiling"}),sa("projector_screen","smart","Projector screen","شاشة عرض","M4,2A1,1 0 0,0 3,3V4A1,1 0 0,0 4,5H5V14H11V16.59L6.79,20.79L8.21,22.21L11,19.41V22H13V19.41L15.79,22.21L17.21,20.79L13,16.59V14H19V5H20A1,1 0 0,0 21,4V3A1,1 0 0,0 20,2H4Z",2,.1,{domains:[...ea,"cover"],z:.25}),sa("soundbar","smart","Soundbar","ساوندبار","M4 8C2.9 8 2 8.9 2 10V14C2 15.11 2.9 16 4 16H20C21.11 16 22 15.11 22 14V10C22 8.9 21.11 8 20 8M9 10C10.11 10 11 10.9 11 12C11 13.11 10.11 14 9 14C7.9 14 7 13.11 7 12C7 10.9 7.9 10 9 10M15 10C16.11 10 17 10.9 17 12C17 13.11 16.11 14 15 14C13.9 14 13 13.11 13 12C13 10.9 13.9 10 15 10M5 11C5.55 11 6 11.45 6 12C6 12.55 5.55 13 5 13C4.45 13 4 12.55 4 12C4 11.45 4.45 11 5 11M9 11C8.45 11 8 11.45 8 12C8 12.55 8.45 13 9 13C9.55 13 10 12.55 10 12C10 11.45 9.55 11 9 11M15 11C14.45 11 14 11.45 14 12C14 12.55 14.45 13 15 13C15.55 13 16 12.55 16 12C16 11.45 15.55 11 15 11M19 11C19.55 11 20 11.45 20 12C20 12.55 19.55 13 19 13C18.45 13 18 12.55 18 12C18 11.45 18.45 11 19 11Z",.9,.12,{domains:ea,z:.3}),sa("speaker","smart","Speaker","سماعة",Oe,.3,.3,{domains:ea}),sa("speaker_round","smart","Smart speaker","سماعة ذكية","M20.07,19.07L18.66,17.66C20.11,16.22 21,14.21 21,12C21,9.78 20.11,7.78 18.66,6.34L20.07,4.93C21.88,6.74 23,9.24 23,12C23,14.76 21.88,17.26 20.07,19.07M17.24,16.24L15.83,14.83C16.55,14.11 17,13.11 17,12C17,10.89 16.55,9.89 15.83,9.17L17.24,7.76C18.33,8.85 19,10.35 19,12C19,13.65 18.33,15.15 17.24,16.24M4,3H12A2,2 0 0,1 14,5V19A2,2 0 0,1 12,21H4A2,2 0 0,1 2,19V5A2,2 0 0,1 4,3M8,5A2,2 0 0,0 6,7A2,2 0 0,0 8,9A2,2 0 0,0 10,7A2,2 0 0,0 8,5M8,11A4,4 0 0,0 4,15A4,4 0 0,0 8,19A4,4 0 0,0 12,15A4,4 0 0,0 8,11M8,13A2,2 0 0,1 10,15A2,2 0 0,1 8,17A2,2 0 0,1 6,15A2,2 0 0,1 8,13Z",.18,.18,{domains:ea,z:.37}),sa("curtain","smart","Curtain","برداية","M23 3H1V1H23V3M2 22H6C6 19 4 17 4 17C10 13 11 4 11 4H2V22M22 4H13C13 4 14 13 20 17C20 17 18 19 18 22H22V4Z",2,.14,{domains:["cover"]}),sa("blinds","smart","Blinds","ستارة شرائح",Mt,1.6,.08,{domains:["cover"],z:.2}),sa("roller_shade","smart","Roller shade","ستارة رول","M20 19V3H4V19H2V21H22V19H20M6 19V13H11V14.8C10.6 15.1 10.2 15.6 10.2 16.2C10.2 17.2 11 18 12 18S13.8 17.2 13.8 16.2C13.8 15.6 13.5 15.1 13 14.8V13H18V19H6Z",1.6,.08,{domains:["cover"],z:.2}),sa("window","smart","Window","شباك",ss,1.4,.12,{domains:["binary_sensor","cover"],z:.3}),sa("door_smart","smart","Door","باب","M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z",.95,.12,{domains:["lock","binary_sensor"]}),sa("garage_door","smart","Garage door","باب كراج","M22 9V20H20V11H4V20H2V9L12 5L22 9M19 12H5V14H19V12M19 18H5V20H19V18M19 15H5V17H19V15Z",2.6,.12,{domains:["cover"]}),sa("camera","smart","Security camera","كاميرا مراقبة",Lt,.18,.18,{domains:["camera","binary_sensor"],z:.85}),sa("electric_panel","smart","Electric panel","لوحة كهربا","M11.5,20L16.36,10.27H13V4L8,13.73H11.5V20M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12C22,14.75 21,17.1 19.05,19.05C17.1,21 14.75,22 12,22C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z",.4,.12,{domains:["sensor"],z:.45}),sa("doorbell","smart","Video doorbell","جرس بكاميرا","M14 15C14 16.11 13.11 17 12 17S10 16.11 10 15 10.9 13 12 13 14 13.9 14 15M18 4V20C18 21.1 17.11 22 16 22H8C6.9 22 6 21.11 6 20V4C6 2.9 6.9 2 8 2H16C17.11 2 18 2.9 18 4M10.5 7C10.5 7.83 11.17 8.5 12 8.5S13.5 7.83 13.5 7 12.83 5.5 12 5.5 10.5 6.17 10.5 7M16 10H8V20H16V10Z",.1,.05,{domains:["binary_sensor","camera","event"],z:.45}),sa("thermostat","smart","Thermostat","ترموستات",Ne,.14,.04,{domains:["climate"],z:.5}),sa("smoke_detector","smart","Smoke detector","حساس دخان","M12,18A6,6 0 0,0 18,12C18,8.68 15.31,6 12,6C8.68,6 6,8.68 6,12A6,6 0 0,0 12,18M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19M8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12Z",.16,.16,{domains:["binary_sensor"],mount:"ceiling"}),sa("robot","smart","Robot vacuum","روبوت تنظيف",$e,.36,.36,{domains:["vacuum"]}),sa("robot_mower","smart","Robot mower","روبوت عشب",ye,.6,.45,{domains:["lawn_mower","vacuum"]}),sa("washer","smart","Washing machine","غسالة",Ye,.6,.6,{domains:[...ta,"sensor","binary_sensor"]}),sa("dryer","smart","Dryer","نشافة","M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M10,4A1,1 0 0,0 9,5A1,1 0 0,0 10,6A1,1 0 0,0 11,5A1,1 0 0,0 10,4M12,8A6,6 0 0,0 6,14A6,6 0 0,0 12,20A6,6 0 0,0 18,14A6,6 0 0,0 12,8M8.11,10.5H10C9.76,11.88 10,12.67 10.58,13.29C11.68,14.36 12.16,15.71 11.89,17.5H10C10.24,16.12 10,15.33 9.42,14.71C8.32,13.64 7.85,12.29 8.11,10.5M12.11,10.5H14C13.76,11.88 14,12.67 14.58,13.29C15.68,14.36 16.16,15.71 15.89,17.5H14C14.24,16.12 14,15.33 13.42,14.71C12.32,13.64 11.85,12.29 12.11,10.5Z",.6,.6,{domains:[...ta,"sensor","binary_sensor"]}),sa("dishwasher","smart","Dishwasher","جلاية","M18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2M10,4A1,1 0 0,1 11,5A1,1 0 0,1 10,6A1,1 0 0,1 9,5A1,1 0 0,1 10,4M7,4A1,1 0 0,1 8,5A1,1 0 0,1 7,6A1,1 0 0,1 6,5A1,1 0 0,1 7,4M18,20H6V8H18V20M14.67,15.33C14.69,16.03 14.41,16.71 13.91,17.21C12.86,18.26 11.15,18.27 10.09,17.21C9.59,16.71 9.31,16.03 9.33,15.33C9.4,14.62 9.63,13.94 10,13.33C10.37,12.5 10.81,11.73 11.33,11L12,10C13.79,12.59 14.67,14.36 14.67,15.33",.6,.6,{domains:[...ta,"sensor","binary_sensor"]}),sa("coffee_machine","smart","Coffee machine","ماكينة قهوة","M18 6V4H20V2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H20V20H15.97C17.2 19.09 18 17.64 18 16V11H8V16C8 17.64 8.81 19.09 10.03 20H6V4H8V6C8 6.55 8.45 7 9 7H17C17.55 7 18 6.55 18 6M13 8C13.55 8 14 8.45 14 9S13.55 10 13 10 12 9.55 12 9 12.45 8 13 8Z",.3,.35,{domains:ta,z:.62}),sa("kettle","smart","Kettle","غلاية","M12.5,3C7.81,3 4,5.69 4,9V9C4,10.19 4.5,11.34 5.44,12.33C4.53,13.5 4,14.96 4,16.5C4,17.64 4,18.83 4,20C4,21.11 4.89,22 6,22H19C20.11,22 21,21.11 21,20C21,18.85 21,17.61 21,16.5C21,15.28 20.66,14.07 20,13L22,11L19,8L16.9,10.1C15.58,9.38 14.05,9 12.5,9C10.65,9 8.95,9.53 7.55,10.41C7.19,9.97 7,9.5 7,9C7,7.21 9.46,5.75 12.5,5.75V5.75C13.93,5.75 15.3,6.08 16.33,6.67L18.35,4.65C16.77,3.59 14.68,3 12.5,3M12.5,11C12.84,11 13.17,11.04 13.5,11.09C10.39,11.57 8,14.25 8,17.5V20H6V17.5A6.5,6.5 0 0,1 12.5,11Z",.2,.2,{domains:ta,z:.62}),sa("ev_charger","smart","EV charger","شاحن سيارة","M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M8,18V13.5H6L10,6V11H12L8,18Z",.3,.2,{domains:[...ta,"sensor","binary_sensor"],z:.35}),sa("router","smart","Wi-Fi router","راوتر","M20.2,5.9L21,5.1C19.6,3.7 17.8,3 16,3C14.2,3 12.4,3.7 11,5.1L11.8,5.9C13,4.8 14.5,4.2 16,4.2C17.5,4.2 19,4.8 20.2,5.9M19.3,6.7C18.4,5.8 17.2,5.3 16,5.3C14.8,5.3 13.6,5.8 12.7,6.7L13.5,7.5C14.2,6.8 15.1,6.5 16,6.5C16.9,6.5 17.8,6.8 18.5,7.5L19.3,6.7M19,13H17V9H15V13H5A2,2 0 0,0 3,15V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V15A2,2 0 0,0 19,13M8,18H6V16H8V18M11.5,18H9.5V16H11.5V18M15,18H13V16H15V18Z",.25,.15,{domains:[...ta,"binary_sensor","device_tracker"],z:.37}),sa("pet_feeder","smart","Pet feeder","أكل الحيوان",Ft,.3,.3,{domains:ta}),sa("aquarium","smart","Aquarium","حوض سمك","M19.11,5H21V3H3V5H4.89C3.11,6.8 2,9.27 2,12C2,15.97 4.31,19.39 7.66,21H16.34C19.69,19.39 22,15.97 22,12C22,9.27 20.89,6.8 19.11,5M6.32,6.41L7.7,5H16.3L17.68,6.41C18.23,6.96 18.69,7.58 19.05,8.25C18,8.09 16.94,7.66 16,7C13.56,8.71 10.44,8.71 8,7C7.06,7.66 6,8.09 4.95,8.25C5.31,7.58 5.77,6.96 6.32,6.41M15.85,19H8.15C5.58,17.59 4,14.95 4,12C4,11.43 4.07,10.86 4.19,10.32C5.5,10.29 6.8,9.95 8,9.33C10.5,10.63 13.5,10.63 16,9.33C17.2,9.95 18.5,10.29 19.81,10.32C19.93,10.86 20,11.43 20,12C20,14.95 18.42,17.59 15.85,19M17,14.5C17,15.88 15.32,17 13.25,17C12.09,17 11.06,16.64 10.33,16.16C9.67,17 8.33,17 7,17C8.1,17 8.5,15.88 8.5,14.5C8.5,13.12 8.1,12 7,12C8.33,12 9.67,12 10.37,12.91C11.06,12.36 12.09,12 13.25,12C15.32,12 17,13.12 17,14.5Z",1.2,.45,{domains:Qo}),sa("sofa","living","Sofa","كنباية",ze,2.1,.9),sa("loveseat","living","Loveseat","كنباية صغيرة",ze,1.5,.85),sa("sofa_l","living","Corner sofa","كنباية زاوية",ze,2.5,1.7),sa("sofa_u","living","U-shaped sofa","كنباية حرف U","M12.5 7C12.5 5.89 13.39 5 14.5 5H18C19.1 5 20 5.9 20 7V9.16C18.84 9.57 18 10.67 18 11.97V14H12.5V7M6 11.96V14H11.5V7C11.5 5.89 10.61 5 9.5 5H6C4.9 5 4 5.9 4 7V9.15C5.16 9.56 6 10.67 6 11.96M20.66 10.03C19.68 10.19 19 11.12 19 12.12V15H5V12C5 10.9 4.11 10 3 10S1 10.9 1 12V17C1 18.1 1.9 19 3 19V21H5V19H19V21H21V19C22.1 19 23 18.1 23 17V12C23 10.79 21.91 9.82 20.66 10.03Z",3,2.2),sa("armchair","living","Armchair","كرسي مريح","M19 9V7C19 5.35 17.65 4 16 4H8C6.35 4 5 5.35 5 7V9C3.35 9 2 10.35 2 12V17C2 18.65 3.35 20 5 20V22H7V20H17V22H19V20C20.65 20 22 18.65 22 17V12C22 10.35 20.65 9 19 9M7 7C7 6.45 7.45 6 8 6H16C16.55 6 17 6.45 17 7V9.78C16.39 10.33 16 11.12 16 12V14H8V12C8 11.12 7.61 10.33 7 9.78V7M20 17C20 17.55 19.55 18 19 18H5C4.45 18 4 17.55 4 17V12C4 11.45 4.45 11 5 11S6 11.45 6 12V16H18V12C18 11.45 18.45 11 19 11S20 11.45 20 12V17Z",.85,.85),sa("bean_bag","living","Bean bag","بين باغ",ke,.8,.8),sa("pouf","living","Pouf","بوف",ke,.5,.5),sa("coffee_table","living","Coffee table","طاولة وسط",Fe,1.1,.6),sa("coffee_round","living","Round coffee table","طاولة وسط مدورة",Fe,.8,.8),sa("side_table","living","Side table","طاولة جانبية",Fe,.45,.45),sa("console_table","living","Console table","كونسول","M4,3H20A2,2 0 0,1 22,5V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V5A2,2 0 0,1 4,3M4,7V10H8V7H4M10,7V10H14V7H10M20,10V7H16V10H20M4,12V15H8V12H4M4,20H8V17H4V20M10,12V15H14V12H10M10,20H14V17H10V20M20,20V17H16V20H20M20,12H16V15H20V12Z",1.2,.35),sa("sideboard","living","Sideboard","بوفيه",It,1.8,.45),sa("tv_stand","living","TV stand (no TV)","طاولة تلفزيون",It,1.8,.45),sa("bookshelf","living","Bookshelf","مكتبة",At,1,.35),sa("shelf_wall","living","Wall shelf","رف حيط","M12 21.5C10.65 20.65 8.2 20 6.5 20C4.85 20 3.15 20.3 1.75 21.05C1.65 21.1 1.6 21.1 1.5 21.1C1.25 21.1 1 20.85 1 20.6V6C1.6 5.55 2.25 5.25 3 5C4.11 4.65 5.33 4.5 6.5 4.5C8.45 4.5 10.55 4.9 12 6C13.45 4.9 15.55 4.5 17.5 4.5C18.67 4.5 19.89 4.65 21 5C21.75 5.25 22.4 5.55 23 6V20.6C23 20.85 22.75 21.1 22.5 21.1C22.4 21.1 22.35 21.1 22.25 21.05C20.85 20.3 19.15 20 17.5 20C15.8 20 13.35 20.65 12 21.5M12 8V19.5C13.35 18.65 15.8 18 17.5 18C18.7 18 19.9 18.15 21 18.5V7C19.9 6.65 18.7 6.5 17.5 6.5C15.8 6.5 13.35 7.15 12 8M13 11.5C14.11 10.82 15.6 10.5 17.5 10.5C18.41 10.5 19.26 10.59 20 10.78V9.23C19.13 9.08 18.29 9 17.5 9C15.73 9 14.23 9.28 13 9.84V11.5M17.5 11.67C15.79 11.67 14.29 11.93 13 12.46V14.15C14.11 13.5 15.6 13.16 17.5 13.16C18.54 13.16 19.38 13.24 20 13.4V11.9C19.13 11.74 18.29 11.67 17.5 11.67M20 14.57C19.13 14.41 18.29 14.33 17.5 14.33C15.67 14.33 14.17 14.6 13 15.13V16.82C14.11 16.16 15.6 15.83 17.5 15.83C18.54 15.83 19.38 15.91 20 16.07V14.57Z",1,.25,{z:.55}),sa("fireplace","living","Fireplace","موقدة","M22,22H2V20H22V22M22,6H2V3H22V6M20,7V19H17V11C17,11 14.5,10 12,10C9.5,10 7,11 7,11V19H4V7H20M14.5,14.67H14.47L14.81,15.22L14.87,15.34C15.29,16.35 15,17.5 14.21,18.24C13.5,18.9 12.5,19.07 11.58,18.95C10.71,18.84 9.9,18.29 9.45,17.53C9.3,17.3 9.19,17.03 9.13,16.77L9,16.11C8.96,15.15 9.34,14.14 10.06,13.54C9.73,14.26 9.81,15.16 10.3,15.79L10.36,15.87C10.44,15.94 10.55,15.97 10.64,15.92C10.73,15.89 10.8,15.8 10.8,15.7L10.76,15.56C10.23,14.17 10.68,12.55 11.79,11.63C12.1,11.38 12.5,11.15 12.87,11.05C12.46,11.87 12.61,12.93 13.25,13.57L14.14,14.3L14.5,14.67M13.11,17.44V17.44C13.37,17.2 13.53,16.8 13.5,16.44V16.25C13.38,15.65 12.85,15.46 12.5,15L12.26,14.55C12.13,14.85 12.12,15.13 12.17,15.46C12.23,15.8 12.37,16.09 12.29,16.44C12.2,16.83 11.9,17.22 11.37,17.35C11.67,17.64 12.15,17.87 12.64,17.71L13.11,17.44Z",1.4,.4,{domains:Qo}),sa("piano","living","Piano","بيانو","M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M14.74 14H15V20H9V14H9.31C9.86 14 10.3 13.56 10.3 13V4H13.75V13C13.75 13.56 14.19 14 14.74 14M4 4H6.8V13C6.8 13.56 7.24 14 7.79 14H8V20H4V4M20 20H16V14H16.26C16.81 14 17.25 13.56 17.25 13V4H20V20Z",1.5,.6),sa("mirror_floor","living","Floor mirror","مراية",he,.6,.06),sa("wall_art","living","Wall art","لوحة","M10,14.29L6.5,19H17.46L14.75,15.46L12.78,17.8L10,14.29M5,21V7H18.96V21H5M12,2.4L14.61,5.03H9.37L12,2.4M5,5.03C4.5,5.03 4,5.22 3.61,5.61C3.2,6 3,6.46 3,7V21C3,21.5 3.2,22 3.61,22.39C4,22.8 4.5,23 5,23H18.96C19.5,23 19.96,22.8 20.37,22.39C20.77,22 21,21.5 21,21V7C21,6.46 20.77,6 20.37,5.61C19.96,5.22 19.5,5.03 18.96,5.03H16L12,1L7.96,5.03H5Z",1,.04,{z:.45}),sa("clock_wall","living","Wall clock","ساعة حيط","M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z",.4,.04,{z:.6}),sa("rug","living","Rug","سجادة",_e,2.2,1.5),sa("rug_round","living","Round rug","سجادة مدورة",_e,1.8,1.8),sa("plant","living","Plant","نبتة",Jt,.5,.5),sa("plant_tall","living","Tall plant","نبتة طويلة","M3,13A9,9 0 0,0 12,22A9,9 0 0,0 3,13M5.44,15.44C7.35,16.15 8.85,17.65 9.56,19.56C7.65,18.85 6.15,17.35 5.44,15.44M12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,22M14.42,19.57C15.11,17.64 16.64,16.11 18.57,15.42C17.86,17.34 16.34,18.86 14.42,19.57M12,14A6,6 0 0,0 18,8V3C17.26,3 16.53,3.12 15.84,3.39C15.29,3.62 14.8,3.96 14.39,4.39L12,2L9.61,4.39C9.2,3.96 8.71,3.62 8.16,3.39C7.47,3.12 6.74,3 6,3V8A6,6 0 0,0 12,14M8,5.61L9.57,7.26L12,4.83L14.43,7.26L16,5.61V8A4,4 0 0,1 12,12A4,4 0 0,1 8,8V5.61Z",.55,.55),sa("cactus","living","Cactus","صبّار","M14,16V21H10V18H9A3,3 0 0,1 6,15V12A1,1 0 0,1 7,11A1,1 0 0,1 8,12V15C8,15.56 8.45,16 9,16H10V6A2,2 0 0,1 12,4A2,2 0 0,1 14,6V14H15A1,1 0 0,0 16,13V11A1,1 0 0,1 17,10A1,1 0 0,1 18,11V13A3,3 0 0,1 15,16H14Z",.3,.3),sa("candle","living","Candles","شموع","M12.5,2C10.84,2 9.5,5.34 9.5,7A3,3 0 0,0 12.5,10A3,3 0 0,0 15.5,7C15.5,5.34 14.16,2 12.5,2M12.5,6.5A1,1 0 0,1 13.5,7.5A1,1 0 0,1 12.5,8.5A1,1 0 0,1 11.5,7.5A1,1 0 0,1 12.5,6.5M10,11A1,1 0 0,0 9,12V20H7A1,1 0 0,1 6,19V18A1,1 0 0,0 5,17A1,1 0 0,0 4,18V19A3,3 0 0,0 7,22H19A1,1 0 0,0 20,21A1,1 0 0,0 19,20H16V12A1,1 0 0,0 15,11H10Z",.25,.25,{domains:Qo,z:.3}),sa("pillar","structure","Column","عامود","M6,5H18A1,1 0 0,1 19,6A1,1 0 0,1 18,7H6A1,1 0 0,1 5,6A1,1 0 0,1 6,5M21,2V4H3V2H21M15,8H17V22H15V8M7,8H9V22H7V8M11,8H13V22H11V8Z",.4,.4),sa("stairs","structure","Stairs","درج",je,1,2.6),sa("bed_king","bedroom","King bed","تخت كبير","M20 10V7A2 2 0 0 0 18 5H6A2 2 0 0 0 4 7V10A2 2 0 0 0 2 12V17H3.33L4 19H5L5.67 17H18.33L19 19H20L20.67 17H22V12A2 2 0 0 0 20 10M13 7H18V10H13M6 7H11V10H6M20 15H4V12H20Z",2,2.2),sa("bed_double","bedroom","Double bed","تخت مزدوج",Ht,1.7,2.1),sa("bed_single","bedroom","Single bed","تخت مفرد",kt,1,2),sa("bunk_bed","bedroom","Bunk bed","تخت طابقين","M1 2V23H3V21H21V23H23V7C23 4.79 21.21 3 19 3H10V8H3V2M6.5 2A2.5 2.5 0 0 0 4 4.5A2.5 2.5 0 0 0 6.5 7A2.5 2.5 0 0 0 9 4.5A2.5 2.5 0 0 0 6.5 2M3 11H21V13.56C20.41 13.21 19.73 13 19 13H10V18H3M6.5 12A2.5 2.5 0 0 0 4 14.5A2.5 2.5 0 0 0 6.5 17A2.5 2.5 0 0 0 9 14.5A2.5 2.5 0 0 0 6.5 12Z",1,2),sa("crib","bedroom","Crib","سرير بيبي",wt,.7,1.3),sa("nightstand","bedroom","Nightstand","كومودينا",It,.45,.4),sa("dresser","bedroom","Dresser","تسريحة أدراج",It,1.2,.5),sa("vanity","bedroom","Dressing table","تسريحة",ue,1.1,.5),sa("wardrobe","bedroom","Wardrobe","خزانة","M6 2C4.89 2 4 2.9 4 4V19C4 20.11 4.89 21 6 21V22H8V21H16V22H18V21C19.11 21 20 20.11 20 19V4C20 2.9 19.11 2 18 2H6M6 4H11V19H6V4M13 4H18V19H13V4M8 10V13H10V10H8M14 10V13H16V10H14Z",1.4,.6),sa("wardrobe_big","bedroom","Big wardrobe","خزانة كبيرة",Ke,2.4,.6),sa("clothes_rack","bedroom","Clothes rack","علّاقة تياب","M12 4A3.5 3.5 0 0 0 8.5 7.5H10.5A1.5 1.5 0 0 1 12 6A1.5 1.5 0 0 1 13.5 7.5A1.5 1.5 0 0 1 12 9C11.45 9 11 9.45 11 10V11.75L2.4 18.2A1 1 0 0 0 3 20H21A1 1 0 0 0 21.6 18.2L13 11.75V10.85A3.5 3.5 0 0 0 15.5 7.5A3.5 3.5 0 0 0 12 4M12 13.5L18 18H6Z",1.2,.45),sa("shoe_rack","bedroom","Shoe rack","جزامة","M21.5,9V8H20.5L19.5,9H15L14,8H13L7,12H4A2,2 0 0,0 2,14V16H10L13,15H15V16H21.5V14C21.5,14 22,13 22,11.5C22,10 21.5,9 21.5,9Z",.9,.3),sa("bench","bedroom","Bench","مقعد",Vt,1.2,.4),sa("counter","kitchen","Kitchen counter","مطبخ",jt,2.4,.62),sa("counter_sink","kitchen","Counter with sink","مجلى",Zt,1.2,.62),sa("counter_corner","kitchen","Corner counter","زاوية مطبخ",jt,1.2,1.2),sa("wall_cabinets","kitchen","Wall cabinets","خزاين علوية",It,2.4,.35,{z:.65}),sa("island","kitchen","Kitchen island","جزيرة مطبخ",jt,1.6,.9),sa("stove","kitchen","Stove","غاز",Te,.75,.65,{domains:ta}),sa("oven_tall","kitchen","Oven tower","فرن عامودي",Te,.65,.62,{domains:ta}),sa("microwave","kitchen","Microwave","ميكرويف","M4,5A2,2 0 0,0 2,7V17A2,2 0 0,0 4,19H20A2,2 0 0,0 22,17V7A2,2 0 0,0 20,5H4M4,7H16V17H4V7M19,7A1,1 0 0,1 20,8A1,1 0 0,1 19,9A1,1 0 0,1 18,8A1,1 0 0,1 19,7M13,9V15H15V9H13M19,11A1,1 0 0,1 20,12A1,1 0 0,1 19,13A1,1 0 0,1 18,12A1,1 0 0,1 19,11Z",.5,.4,{domains:ta,z:.62}),sa("toaster","kitchen","Toaster","توستر","M21 11A2 2 0 0 0 19 9H5A2 2 0 0 0 3 11H2V13H3V20H21V13H22V11M17 15A2 2 0 1 1 19 13A2 2 0 0 1 17 15M18 8H6C6.33 5.75 8.88 4 12 4S17.63 5.75 18 8Z",.28,.18,{domains:ta,z:.62}),sa("fridge","kitchen","Fridge","براد","M9,21V22H7V21A2,2 0 0,1 5,19V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V19A2,2 0 0,1 17,21V22H15V21H9M7,4V9H17V4H7M7,19H17V11H7V19M8,12H10V15H8V12M8,6H10V8H8V6Z",.75,.7),sa("fridge_double","kitchen","Double fridge","براد بابين","M17 2H7C5.9 2 5 2.9 5 4V19C5 20.11 5.9 21 7 21V22H9V21H15V22H17V21C18.11 21 19 20.11 19 19V4C19 2.9 18.11 2 17 2M17 19H7V4H17V19M10 15H8V10H10V15Z",.95,.75),sa("wine_fridge","kitchen","Wine fridge","براد نبيذ",Qt,.6,.6,{domains:ta}),sa("pantry","kitchen","Pantry cabinet","خزانة مونة",It,.9,.6),sa("trash","kitchen","Trash bin","زبالة","M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z",.35,.35),sa("dining","kitchen","Dining table (6)","طاولة سفرة 6",De,1.8,1.6),sa("dining_4","kitchen","Dining table (4)","طاولة سفرة 4",De,1.3,1.4),sa("table_round","kitchen","Round table","طاولة مدورة",De,1.4,1.4),sa("bar_counter","kitchen","Bar counter","بار",Zt,1.8,.5),sa("stool","kitchen","Bar stool","كرسي بار","M20 6C20 3.79 18.21 2 16 2H8C5.78 2 4 3.79 4 6V8H7L4 22H6L7.5 15H11V22H13V15H16.5L18 22H20L17 8H20V6M7.93 13L9 8H11V13H7.93M16.07 13H13V8H15L16.07 13Z",.4,.4),sa("chair","kitchen","Chair","كرسي",zt,.5,.5),sa("toilet","bath","Toilet","تواليت",We,.42,.68),sa("basin","bath","Wash basin","مغسلة",Bt,.7,.45),sa("vanity_double","bath","Double basin","مغسلة مزدوجة",Bt,1.4,.5),sa("bathtub","bath","Bathtub","بانيو","M7 5C8.11 5 9 5.9 9 7S8.11 9 7 9 5 8.11 5 7 5.9 5 7 5M20 13V4.83C20 3.27 18.73 2 17.17 2C16.42 2 15.7 2.3 15.17 2.83L13.92 4.08C13.76 4.03 13.59 4 13.41 4C13 4 12.64 4.12 12.33 4.32L15.09 7.08C15.29 6.77 15.41 6.4 15.41 6C15.41 5.82 15.38 5.66 15.34 5.5L16.59 4.24C16.74 4.09 16.95 4 17.17 4C17.63 4 18 4.37 18 4.83V13H11.15C10.85 12.79 10.58 12.55 10.33 12.28L8.93 10.73C8.74 10.5 8.5 10.35 8.24 10.23C7.93 10.08 7.59 10 7.24 10C6 10 5 11 5 12.25V13H2V19C2 20.1 2.9 21 4 21C4 21.55 4.45 22 5 22H19C19.55 22 20 21.55 20 21C21.1 21 22 20.1 22 19V13H20M20 19H4V15H20V19Z",1.7,.78),sa("jacuzzi","bath","Jacuzzi","جاكوزي","M7 5C8.11 5 9 5.9 9 7S8.11 9 7 9 5 8.11 5 7 5.9 5 7 5M20 13V4.83C20 3.27 18.73 2 17.17 2C16.42 2 15.7 2.3 15.17 2.83L13.92 4.08C13.76 4.03 13.59 4 13.41 4C13 4 12.64 4.12 12.33 4.32L15.09 7.08C15.29 6.77 15.41 6.4 15.41 6C15.41 5.82 15.38 5.66 15.34 5.5L16.59 4.24C16.74 4.09 16.95 4 17.17 4C17.63 4 18 4.37 18 4.83V13H11.15C10.85 12.79 10.58 12.55 10.33 12.28L8.93 10.73C8.74 10.5 8.5 10.35 8.24 10.23C7.93 10.08 7.59 10 7.24 10C6 10 5 11 5 12.25V13H2V19C2 20.1 2.9 21 4 21C4 21.55 4.45 22 5 22H19C19.55 22 20 21.55 20 21C21.1 21 22 20.1 22 19V13H20Z",1.6,1.6,{domains:ta}),sa("shower","bath","Shower","دوش","M21,14V15C21,16.91 19.93,18.57 18.35,19.41L19,22H17L16.5,20C16.33,20 16.17,20 16,20H8C7.83,20 7.67,20 7.5,20L7,22H5L5.65,19.41C4.07,18.57 3,16.91 3,15V14H2V12H20V5A1,1 0 0,0 19,4C18.5,4 18.12,4.34 18,4.79C18.63,5.33 19,6.13 19,7H13A3,3 0 0,1 16,4C16.06,4 16.11,4 16.17,4C16.58,2.84 17.69,2 19,2A3,3 0 0,1 22,5V14H21V14M19,14H5V15A3,3 0 0,0 8,18H16A3,3 0 0,0 19,15V14Z",.95,.95),sa("mirror_wall","bath","Wall mirror","مراية حيط",ue,.8,.04,{z:.45,domains:Qo}),sa("towel_rail","bath","Heated towel rail","منشفة مدفّاة",te,.6,.1,{z:.3,domains:ta}),sa("laundry_basket","bath","Laundry basket","سلة غسيل","M22 9H17.21L12.83 2.44C12.64 2.16 12.32 2 12 2S11.36 2.16 11.17 2.45L6.79 9H2C1.45 9 1 9.45 1 10C1 10.09 1 10.18 1.04 10.27L3.58 19.54C3.81 20.38 4.58 21 5.5 21H18.5C19.42 21 20.19 20.38 20.43 19.54L22.97 10.27L23 10C23 9.45 22.55 9 22 9M12 4.8L14.8 9H9.2L12 4.8M18.5 19L5.5 19L3.31 11H20.7L18.5 19M12 13C10.9 13 10 13.9 10 15S10.9 17 12 17 14 16.1 14 15 13.1 13 12 13Z",.4,.4),sa("bath_mat","bath","Bath mat","دعّاسة",_e,.8,.5),sa("desk","office","Desk","مكتب",Dt,1.3,.65),sa("desk_l","office","Corner desk","مكتب زاوية",Dt,1.6,1.6),sa("office_chair","office","Office chair","كرسي مكتب",zt,.6,.6),sa("monitor","office","Monitor","شاشة","M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z",.6,.22,{domains:[...ta,...ea],z:.54}),sa("laptop","office","Laptop","لابتوب","M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z",.35,.25,{domains:[...ta,"binary_sensor"],z:.54}),sa("printer","office","Printer","طابعة","M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z",.45,.4,{domains:[...ta,"sensor"],z:.37}),sa("server_rack","office","Server rack","سيرفر",Ve,.6,.8,{domains:ta}),sa("game_console","office","Game console","بلايستيشن","M6,9H8V11H10V13H8V15H6V13H4V11H6V9M18.5,9A1.5,1.5 0 0,1 20,10.5A1.5,1.5 0 0,1 18.5,12A1.5,1.5 0 0,1 17,10.5A1.5,1.5 0 0,1 18.5,9M15.5,12A1.5,1.5 0 0,1 17,13.5A1.5,1.5 0 0,1 15.5,15A1.5,1.5 0 0,1 14,13.5A1.5,1.5 0 0,1 15.5,12M17,5A7,7 0 0,1 24,12A7,7 0 0,1 17,19C15.04,19 13.27,18.2 12,16.9C10.73,18.2 8.96,19 7,19A7,7 0 0,1 0,12A7,7 0 0,1 7,5H17M7,7A5,5 0 0,0 2,12A5,5 0 0,0 7,17C8.64,17 10.09,16.21 11,15H13C13.91,16.21 15.36,17 17,17A5,5 0 0,0 22,12A5,5 0 0,0 17,7H7Z",.3,.2,{domains:[...ta,...ea],z:.3}),sa("filing_cabinet","office","Filing cabinet","خزانة ملفات",Kt,.45,.6),sa("outdoor_sofa","outdoor","Outdoor sofa","كنباية برّا",ze,2,.85),sa("lounger","outdoor","Sun lounger","شيزلونج",He,.7,1.9),sa("outdoor_table","outdoor","Patio table","طاولة برّا",De,1.4,1.4),sa("parasol","outdoor","Parasol","شمسية","M21 19.57L19.57 21L13.13 14.56L14.56 13.13L21 19.57M13.12 3C10.54 3 7.96 4 6 5.95L5.97 5.96C2 9.91 2 16.32 5.97 20.27L20.27 5.96C18.3 4 15.71 3 13.12 3M6.14 17.27C5.4 16.03 5 14.61 5 13.12C5 12.19 5.16 11.3 5.46 10.45C5.65 12.36 6.35 14.24 7.53 15.89L6.14 17.27M9 14.43C7.63 12.38 7.12 9.93 7.6 7.6C8.18 7.5 8.76 7.42 9.35 7.42C11.15 7.42 12.9 7.97 14.43 9L9 14.43M10.45 5.46C11.3 5.16 12.19 5 13.12 5C14.61 5 16.03 5.4 17.27 6.14L15.88 7.53C14.23 6.35 12.36 5.65 10.45 5.46Z",2.2,2.2),sa("bbq","outdoor","Grill","شوّاية","M8.06,2C7.88,3.17 8.17,4.16 8.95,4.97C9.45,5.47 9.61,6.14 9.42,7H10.41C10.53,6.45 10.55,6 10.45,5.55C10.36,5.13 10.05,4.63 9.5,4.03C9.05,3.47 8.89,2.8 9.05,2H8.06M10.55,2C10.36,3.17 10.66,4.16 11.44,4.97C11.94,5.47 12.09,6.14 11.91,7H12.89C13,6.45 13.03,6 12.94,5.55C12.84,5.13 12.53,4.63 12,4.03C11.53,3.47 11.38,2.8 11.53,2H10.55M13.08,2C12.89,3.17 13.19,4.16 13.97,4.97C14.47,5.47 14.61,6.14 14.39,7H15.42C15.55,6.45 15.56,6 15.47,5.55C15.38,5.13 15.06,4.63 14.53,4.03C14.06,3.47 13.91,2.8 14.06,2H13.08M5,8C5,9.42 5.39,10.7 6.14,11.84C6.87,12.96 7.91,13.85 9.14,14.39L5.16,20.44C5.06,20.56 5,20.75 5,21C5,21.41 5.16,21.69 5.44,21.84C5.56,21.94 5.75,22 6,22C6.41,22 6.69,21.84 6.84,21.56L7.83,19.97H14.2C14.41,20.55 14.79,21.05 15.28,21.42C15.78,21.8 16.36,22 17,22C17.83,22 18.53,21.69 19.13,21.09C19.72,20.5 20,19.8 20,19C20,18.17 19.72,17.47 19.13,16.88C18.53,16.28 17.83,16 17,16C16.36,16 15.78,16.17 15.28,16.55C14.78,16.92 14.42,17.41 14.2,18H9.14L11.11,14.95C11.27,15 11.56,15 12,15C12.44,15 12.73,15 12.89,14.95L13.88,16.5C14.29,15.96 14.84,15.54 15.47,15.28L14.91,14.39C16.03,13.89 17,13 17.79,11.77C18.59,10.5 19,9.27 19,8H5M17,18C17.3,18 17.53,18.09 17.72,18.28C17.91,18.47 18,18.72 18,19C18,19.27 17.91,19.5 17.72,19.71C17.54,19.91 17.28,20 17,20C16.74,20 16.5,19.91 16.29,19.71C16.09,19.5 16,19.26 16,19C16,18.7 16.09,18.47 16.29,18.28C16.5,18.09 16.73,18 17,18Z",1,.6,{domains:ta}),sa("pool","outdoor","Pool","مسبح","M2,15C3.67,14.25 5.33,13.5 7,13.17V5A3,3 0 0,1 10,2C11.31,2 12.42,2.83 12.83,4H10A1,1 0 0,0 9,5V6H14V5A3,3 0 0,1 17,2C18.31,2 19.42,2.83 19.83,4H17A1,1 0 0,0 16,5V14.94C18,14.62 20,13 22,13V15C19.78,15 17.56,17 15.33,17C13.11,17 10.89,15 8.67,15C6.44,15 4.22,16 2,17V15M14,8H9V10H14V8M14,12H9V13C10.67,13.16 12.33,14.31 14,14.79V12M2,19C4.22,18 6.44,17 8.67,17C10.89,17 13.11,19 15.33,19C17.56,19 19.78,17 22,17V19C19.78,19 17.56,21 15.33,21C13.11,21 10.89,19 8.67,19C6.44,19 4.22,20 2,21V19Z",4,2.2,{domains:ta}),sa("tree","outdoor","Tree","شجرة","M11,21V16.74C10.53,16.91 10.03,17 9.5,17C7,17 5,15 5,12.5C5,11.23 5.5,10.09 6.36,9.27C6.13,8.73 6,8.13 6,7.5C6,5 8,3 10.5,3C12.06,3 13.44,3.8 14.25,5C14.33,5 14.41,5 14.5,5A5.5,5.5 0 0,1 20,10.5A5.5,5.5 0 0,1 14.5,16C14,16 13.5,15.93 13,15.79V21H11Z",1.6,1.6),sa("pine","outdoor","Pine tree","صنوبرة","M10,21V18H3L8,13H5L10,8H7L12,3L17,8H14L19,13H16L21,18H14V21H10Z",1.2,1.2),sa("hedge","outdoor","Hedge","سياج نبات","M10.5,3C8,3 6,5 6,7.5C6,8.11 6.13,8.71 6.37,9.27C5.5,10.12 5,11.28 5,12.5C5,15 7,17 9.5,17C10,17 10.5,16.89 11,16.72V21H13V15.77C13.5,15.91 14,16 14.5,16A5.5,5.5 0 0,0 20,10.5A5.5,5.5 0 0,0 14.5,5C14.41,5 14.33,5 14.24,5C13.41,3.76 12,3 10.5,3M10.5,5C11.82,5 12.91,6.03 13,7.35C13.46,7.12 14,7 14.5,7A3.5,3.5 0 0,1 18,10.5A3.5,3.5 0 0,1 14.5,14C13.54,14 12.63,13.61 11.96,12.91C11.76,14.12 10.72,15 9.5,15A2.5,2.5 0 0,1 7,12.5C7,11.12 7.8,10.54 9,9.79C8.2,8.76 8,8.16 8,7.5A2.5,2.5 0 0,1 10.5,5Z",2,.6),sa("flower_bed","outdoor","Flower bed","حوض ورد","M18.5,12A3.5,3.5 0 0,0 22,8.5A6.5,6.5 0 0,0 15.5,2A3.5,3.5 0 0,0 12,5.5A3.5,3.5 0 0,0 8.5,2A6.5,6.5 0 0,0 2,8.5A3.5,3.5 0 0,0 5.5,12A3.5,3.5 0 0,0 2,15.5A6.5,6.5 0 0,0 8.5,22A3.5,3.5 0 0,0 12,18.5A3.5,3.5 0 0,0 15.5,22A6.5,6.5 0 0,0 22,15.5A3.5,3.5 0 0,0 18.5,12M12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16M14.5,12A2.5,2.5 0 0,1 12,14.5A2.5,2.5 0 0,1 9.5,12A2.5,2.5 0 0,1 12,9.5A2.5,2.5 0 0,1 14.5,12Z",1.5,.6,{domains:["switch","valve"]}),sa("fence","outdoor","Fence","سور",qt,2,.08),sa("car","outdoor","Car","سيارة","M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z",1.9,4.4,{domains:["device_tracker","binary_sensor","sensor"]}),sa("bicycle","outdoor","Bicycle","بسكليت","M19 10C18.44 10 17.91 10.11 17.41 10.28L14.46 4.5H11V6H13.54L14.42 7.72L12 13.13L10.23 8.95C10.5 8.85 10.74 8.58 10.74 8.25C10.74 7.84 10.41 7.5 10 7.5H8C7.58 7.5 7.24 7.84 7.24 8.25S7.58 9 8 9H8.61L10.86 14.25H9.92C9.56 11.85 7.5 10 5 10C2.24 10 0 12.24 0 15S2.24 20 5 20C7.5 20 9.56 18.15 9.92 15.75H12.5L15.29 9.43L16.08 10.96C14.82 11.87 14 13.34 14 15C14 17.76 16.24 20 19 20S24 17.76 24 15 21.76 10 19 10M5 18.5C3.07 18.5 1.5 16.93 1.5 15S3.07 11.5 5 11.5C6.67 11.5 8.07 12.68 8.41 14.25H4V15.75H8.41C8.07 17.32 6.67 18.5 5 18.5M19 18.5C17.07 18.5 15.5 16.93 15.5 15C15.5 13.92 16 12.97 16.77 12.33L18.57 15.85L19.89 15.13L18.1 11.63C18.39 11.56 18.69 11.5 19 11.5C20.93 11.5 22.5 13.07 22.5 15S20.93 18.5 19 18.5Z",.6,1.7),sa("counter_plain","kitchen","Counter (plain)","مطبخ فاضي",jt,2.4,.62),sa("base_cabinet","kitchen","Base cabinet","خزانة سفلية",It,.6,.62),sa("upper_cabinet","kitchen","Upper cabinet","خزانة علوية",It,.8,.35,{z:.65}),sa("range_hood","kitchen","Range hood","شفاط",Ut,.9,.5,{domains:[...Qo,"fan"],z:.72}),sa("island_seats","kitchen","Island with stools","جزيرة مع كراسي",Zt,1.7,1.4),sa("breakfast_table","kitchen","Breakfast table (2)","طاولة فطور",De,.8,1.5),sa("bar_table","kitchen","Bar table","طاولة بار",Fe,.7,.7),sa("dining_bench","kitchen","Dining bench","مقعد سفرة",Vt,1.4,.4),sa("water_dispenser","kitchen","Water dispenser","براد مي","M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z",.35,.35,{domains:ta}),sa("fruit_bowl","kitchen","Fruit bowl","صحن فواكه","M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z",.3,.3,{z:.62}),sa("recliner","living","Recliner","كرسي استرخاء",Pe,.9,1.3),sa("chaise","living","Chaise longue","شيزلونج داخلي",He,.7,1.6),sa("ottoman_round","living","Round ottoman","بوف مدور",ke,.6,.6),sa("floor_cushion","living","Floor cushion","مخدة أرضية","M8 3H16C18.76 3 21 5.24 21 8V16C21 18.76 18.76 21 16 21H8C5.24 21 3 18.76 3 16V8C3 5.24 5.24 3 8 3Z",.6,.6),sa("bookcase_tall","living","Tall bookcase","مكتبة طويلة",At,.9,.35),sa("vitrine","living","Glass cabinet","فترينة",It,.9,.45,{domains:Qo}),sa("room_divider","living","Room divider","فاصل","M19,13H5V11H19V13M12,5A2,2 0 0,1 14,7A2,2 0 0,1 12,9A2,2 0 0,1 10,7A2,2 0 0,1 12,5M12,15A2,2 0 0,1 14,17A2,2 0 0,1 12,19A2,2 0 0,1 10,17A2,2 0 0,1 12,15Z",1.4,.2),sa("floor_vase","living","Floor vase","مزهرية",Jt,.3,.3),sa("bar_cart","living","Bar cart","عربة بار",Qt,.7,.45),sa("massage_chair","living","Massage chair","كرسي مساج",Pe,.8,1.2),sa("rocking_chair","living","Rocking chair","كرسي هزاز",zt,.7,.9),sa("mirror_round","living","Round mirror","مراية مدورة",he,.6,.04,{z:.45}),sa("rug_runner","living","Runner rug","سجادة طويلة",_e,2.5,.8),sa("record_player","living","Record player","جرامافون","M5,17.5A0.5,0.5 0 0,1 4.5,18H3.5A0.5,0.5 0 0,1 3,17.5V17H2A1,1 0 0,1 1,16V13A1,1 0 0,1 2,12H19V10H7L6,11V9A1,1 0 0,1 7,8H19V7H21V8A1,1 0 0,1 22,9V10H21V12H22A1,1 0 0,1 23,13V16A1,1 0 0,1 22,17H21V17.5A0.5,0.5 0 0,1 20.5,18H19.5A0.5,0.5 0 0,1 19,17.5V17H5V17.5M3,14V15H5V14H3M6,14V15H8V14H6M20.5,13.5A1,1 0 0,0 19.5,14.5A1,1 0 0,0 20.5,15.5A1,1 0 0,0 21.5,14.5A1,1 0 0,0 20.5,13.5Z",.45,.35,{domains:ea,z:.37}),sa("plant_hanging","living","Hanging plant","نبتة معلّقة",Jt,.35,.35,{mount:"ceiling"}),sa("wardrobe_sliding","bedroom","Sliding wardrobe","خزانة سحّاب",Ke,2,.65),sa("chest","bedroom","Chest / trunk","صندوق","M5,4H19A3,3 0 0,1 22,7V11H15V10H9V11H2V7A3,3 0 0,1 5,4M11,11H13V13H11V11M2,12H9V13L11,15H13L15,13V12H22V20H2V12Z",.9,.45),sa("toy_box","bedroom","Toy box","صندوق ألعاب","M19 6V5A2 2 0 0 0 17 3H15A2 2 0 0 0 13 5V6H11V5A2 2 0 0 0 9 3H7A2 2 0 0 0 5 5V6H3V20H21V6M19 18H5V8H19Z",.7,.4),sa("changing_table","bedroom","Changing table","طاولة غيار",wt,.9,.55),sa("kids_bed","bedroom","Kids bed","تخت ولاد",kt,.9,1.7),sa("nightstand_round","bedroom","Round side table","كومودينا مدورة",Fe,.45,.45),sa("washer_dryer","bath","Washer-dryer stack","غسالة ونشافة",Ye,.6,.62,{domains:[...ta,"sensor","binary_sensor"]}),sa("bidet","bath","Bidet","شطّاف",We,.38,.55),sa("bath_cabinet","bath","Tall bath cabinet","خزانة حمام",It,.4,.35),sa("standing_desk","office","Standing desk","مكتب واقف",Dt,1.4,.7),sa("whiteboard","office","Whiteboard","لوح أبيض","M9.75 20.85C11.53 20.15 11.14 18.22 10.24 17C9.35 15.75 8.12 14.89 6.88 14.06C6 13.5 5.19 12.8 4.54 12C4.26 11.67 3.69 11.06 4.27 10.94C4.86 10.82 5.88 11.4 6.4 11.62C7.31 12 8.21 12.44 9.05 12.96L10.06 11.26C8.5 10.23 6.5 9.32 4.64 9.05C3.58 8.89 2.46 9.11 2.1 10.26C1.78 11.25 2.29 12.25 2.87 13.03C4.24 14.86 6.37 15.74 7.96 17.32C8.3 17.65 8.71 18.04 8.91 18.5C9.12 18.94 9.07 18.97 8.6 18.97C7.36 18.97 5.81 18 4.8 17.36L3.79 19.06C5.32 20 7.88 21.47 9.75 20.85M20.84 5.25C21.06 5.03 21.06 4.67 20.84 4.46L19.54 3.16C19.33 2.95 18.97 2.95 18.76 3.16L17.74 4.18L19.82 6.26M11 10.92V13H13.08L19.23 6.85L17.15 4.77L11 10.92Z",1.2,.05,{z:.35}),sa("meeting_table","office","Meeting table","طاولة اجتماعات",De,2.2,2.4),sa("office_cabinet","office","Office cabinet","خزانة مكتب",Kt,.8,.45),sa("bookshelf_ladder","office","Ladder shelf","رف سلّم",At,.8,.45),sa("garden_bench","outdoor","Garden bench","مقعد حديقة",Vt,1.4,.55),sa("fire_pit","outdoor","Fire pit","موقد نار",Yt,1,1,{domains:[...ta,...Qo]}),sa("outdoor_heater","outdoor","Patio heater","دفاية برّا",te,.5,.5,{domains:ta}),sa("lamp_post","outdoor","Lamp post","عامود ضو","M14 3L13 1H11L10 3L5 6H7L8 14L10 16L10.5 17H9V23H15V17H13.5L14 16L16 14L17 6H19L14 3M14.16 13H9.84L9 6H15L14.16 13Z",.3,.3,{domains:Qo}),sa("wall_light_out","outdoor","Outdoor wall light","ضو حيط برّا","M11,4L7,13H19L15,4H11M4,14V22H6V19H14V14H12V17H6V14H4Z",.15,.12,{domains:Qo,z:.6}),sa("gate","outdoor","Gate","بوابة","M9 6V11H7V7H5V11H3V9H1V21H3V19H5V21H7V19H9V21H11V19H13V21H15V19H17V21H19V19H21V21H23V9H21V11H19V7H17V11H15V6H13V11H11V6H9M3 13H5V17H3V13M7 13H9V17H7V13M11 13H13V17H11V13M15 13H17V17H15V13M19 13H21V17H19V13Z",2.2,.15,{domains:["cover","switch","lock"]}),sa("trampoline","outdoor","Trampoline","ترامبولين","M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",2.4,2.4),sa("garden_swing","outdoor","Garden swing","مرجوحة",He,1.9,1.2),sa("kids_slide","outdoor","Kids slide","زحليطة","M14.83 15.45C14.47 14.9 14.18 14.39 13.91 13.92C12.74 11.91 11.79 10.55 9 10.13V5.5C9 3.57 7.43 2 5.5 2S2 3.57 2 5.5V22H4V20H7V22H9V12.16C10.76 12.5 11.29 13.39 12.17 14.92C12.46 15.43 12.78 15.97 13.17 16.56C15.41 19.92 17.67 22 22 22V20C18.53 20 16.8 18.4 14.83 15.45M5.5 4C6.33 4 7 4.67 7 5.5V10H4V5.5C4 4.67 4.67 4 5.5 4M4 18V16H7V18H4M7 14H4V12H7V14Z",.6,2.2),sa("sunbed_double","outdoor","Double sunbed","سرير شمس",Ht,1.6,2),sa("planter","outdoor","Planter box","حوض زرع",Jt,1,.4),sa("shed","outdoor","Garden shed","مخزن حديقة",ee,2,1.6),sa("dog_house","outdoor","Dog house","بيت كلب",Ft,.8,1),sa("mailbox","outdoor","Mailbox","صندوق بريد","M17,4H7A5,5 0 0,0 2,9V20H20A2,2 0 0,0 22,18V9A5,5 0 0,0 17,4M10,18H4V9A3,3 0 0,1 7,6A3,3 0 0,1 10,9V18M20,18H12V9C12,7.92 11.65,6.86 11,6H17A3,3 0 0,1 20,9V18M13,11V13H17V15H19V11H13M9,11H5V9H9V11Z",.3,.45),sa("motorcycle","outdoor","Motorcycle","موتور","M17.42,10L13.41,6H9V8H12.59L14.59,10H6.5C4,10 2,12 2,14.5C2,17 4,19 6.5,19C8.72,19 10.56,17.38 10.92,15.27L13.04,14C13,14.17 13,14.33 13,14.5C13,17 15,19 17.5,19C20,19 22,17 22,14.5C22,12 20,10 17.5,10M8.84,15.26C8.5,16.27 7.58,17 6.47,17C5.09,17 3.97,15.88 3.97,14.5C3.97,13.12 5.09,12 6.47,12C7.59,12 8.5,12.74 8.84,13.75H6V15.25L8.84,15.26M17.47,17C16.09,17 14.97,15.88 14.97,14.5C14.97,13.12 16.09,12 17.47,12A2.5,2.5 0 0,1 19.97,14.5A2.5,2.5 0 0,1 17.47,17Z",.6,2),sa("spiral_stairs","structure","Spiral stairs","درج حلزوني",je,1.6,1.6),sa("railing","structure","Railing","درابزين",qt,2,.06),sa("glass_wall","structure","Glass partition","حيط زجاج",es,2,.05),sa("column_square","structure","Square column","عامود مربع",Ze,.4,.4),sa("built_in_shelves","structure","Built-in shelves","رفوف بالحيط",At,1.6,.35)],oa=[{key:"smart",name:{en:"Smart",ar:"ذكية"}},{key:"living",name:{en:"Living",ar:"صالة"}},{key:"bedroom",name:{en:"Bedroom",ar:"نوم"}},{key:"kitchen",name:{en:"Kitchen",ar:"مطبخ"}},{key:"bath",name:{en:"Bath",ar:"حمام"}},{key:"office",name:{en:"Office",ar:"مكتب"}},{key:"outdoor",name:{en:"Outdoor",ar:"برّا"}},{key:"structure",name:{en:"Structure",ar:"بناء"}}],aa=t=>ia.find(e=>e.type===t),ra=(t,e)=>e??aa(t)?.z??0,na=["tv_unit","tv_wall","monitor"];var la=Object.defineProperty,ca=Object.getOwnPropertyDescriptor,da=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?ca(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&la(e,s,a),a};function pa(t){t.showSheet({title:t.t("edit_plan"),icon:fe,wide:!0,render:t=>U`<sn-plan-editor .ctx=${t}></sn-plan-editor>`})}const ha=t=>!!t?.locked,ua=t=>t?.label,ga=t=>t.map(t=>`${t.x},${t.y}`).join(" ");let ma=class extends ct{constructor(){super(...arguments),this.tool="room",this.uploading=!1,this.category="smart",this.search="",this.shapePts=[],this.live={},this.selectedFurnIds=[],this.multiSelect=!1,this.gridSnap=!0,this.measurePoints=[],this.undoStack=[],this.redoStack=[],this.historyKey=t=>{this.isConnected&&(t.ctrlKey||t.metaKey)&&(t.composedPath().some(t=>t instanceof HTMLElement&&(t.matches("input,textarea,select")||t.isContentEditable))||"z"!==t.key.toLowerCase()&&"y"!==t.key.toLowerCase()||(t.preventDefault(),this.restoreHistory(t.shiftKey||"y"===t.key.toLowerCase())))},this.down=t=>{const e=this.point(t),s=this.floorOrEmpty;t.currentTarget.setPointerCapture(t.pointerId);const i=t.target;switch(this.tool){case"measure":{const t=this.snapToFloor(s,e.x,e.y);return void(this.measurePoints=1===this.measurePoints.length?[...this.measurePoints,t]:[t])}case"door":{const t=No(s,e.x,e.y),i=s.doors.find(t=>!t.open&&Math.hypot(Do(t).x-e.x,Do(t).y-e.y)<.54);if(i)this.edit(t=>t.doors=t.doors.filter(t=>t.id!==i.id));else if(t?.door){const e=t.door;this.edit(s=>s.doors.push({id:as(),x:e.x,y:e.y,angle:t.angle,width:_o}))}return}case"open":{const t=i.closest("[data-open]");if(t)return void this.edit(e=>e.doors=e.doors.filter(e=>e.id!==t.dataset.open));const o=No(s,e.x,e.y);return void(o&&o.piece.width>.1&&this.edit(t=>t.doors.push({id:as(),x:o.piece.x,y:o.piece.y,angle:o.angle,width:o.piece.width,open:!0})))}case"wall":{const t=i.closest("[data-wall]");if(t&&!this.wallStart)return void(this.selWall=t.dataset.wall);this.selWall=void 0;const o=this.snapToFloor(s,e.x,e.y);if(!this.wallStart)return void(this.wallStart=o);const a=this.wallStart;return Math.hypot(o.x-a.x,o.y-a.y)<.1?void(this.wallStart=void 0):(this.edit(t=>t.walls=[...t.walls??[],{id:as(),x1:a.x,y1:a.y,x2:o.x,y2:o.y}]),void(this.wallStart=o))}case"shape":{const t=this.snapToFloor(s,e.x,e.y),i=this.shapePts;if(i.length>=3&&Math.hypot(t.x-i[0].x,t.y-i[0].y)<.3)return void this.finishShape();if(i.length&&Math.hypot(t.x-i[i.length-1].x,t.y-i[i.length-1].y)<.05)return;return void(this.shapePts=[...i,t])}case"furniture":{const o=i.closest("[data-furn]"),a=o?s.furniture?.find(t=>t.id===o.dataset.furn):void 0;if(a){if(this.selFurn=a.id,t.shiftKey||this.multiSelect)return this.selectedFurnIds=this.selectedFurnIds.includes(a.id)?this.selectedFurnIds.filter(t=>t!==a.id):[...this.selectedFurnIds,a.id],void(this.selFurn=this.selectedFurnIds[this.selectedFurnIds.length-1]);if(this.selectedFurnIds.includes(a.id)||(this.selectedFurnIds=[a.id]),ha(a))return;const i=(s.furniture??[]).filter(t=>this.selectedFurnIds.includes(t.id)&&!ha(t)).map(t=>({id:t.id,x:t.x,y:t.y}));return void(this.drag={kind:"fmove",id:a.id,dx:e.x-a.x,dy:e.y-a.y,x:a.x,y:a.y,members:i})}if(this.placing){const t=as(),s=this.placing,i=this.snapValue(e.x,.05),o=this.snapValue(e.y,.05);return this.edit(e=>e.furniture=[...e.furniture??[],{id:t,type:s,x:i,y:o,rot:0}]),this.selFurn=t,this.selectedFurnIds=[t],void(this.placing=void 0)}return this.selFurn=void 0,void(this.selectedFurnIds=[])}case"photo":{const t=s.underlay;return void(t&&(this.drag={kind:"photo",dx:e.x-t.x,dy:e.y-t.y,x:t.x,y:t.y}))}}const o=s.rooms.find(t=>t.id===this.selected),a=i.closest("[data-vertex]"),r=i.closest("[data-mid]");if(o&&!ha(o)&&a)return this.selVertex=Number(a.dataset.vertex),void(this.drag={kind:"vertex",index:this.selVertex,room:Mo(o,ko(o).map(t=>({...t})))});if(o&&!ha(o)&&r){const t=Number(r.dataset.mid),e=ko(o).map(t=>({...t})),s=e[t],i=e[(t+1)%e.length];return e.splice(t+1,0,{x:(s.x+i.x)/2,y:(s.y+i.y)/2}),this.selVertex=t+1,void(this.drag={kind:"vertex",index:t+1,room:Mo(o,e)})}const n=i.closest("[data-room]"),l=n?s.rooms.find(t=>t.id===n.dataset.room):void 0;if(l)return this.selected=l.id,this.selVertex=void 0,void(ha(l)||(this.drag={kind:"move",start:e,orig:l,room:l}));const c=this.snapValue(e.x,$o),d=this.snapValue(e.y,$o);this.selected=void 0,this.selVertex=void 0,this.drag={kind:"draw",x0:c,y0:d,rect:{id:as(),x:c,y:d,w:0,h:0}}},this.move=t=>{const e=this.point(t);"shape"!==this.tool&&"wall"!==this.tool&&"measure"!==this.tool||(this.cursor=this.snapToFloor(this.floorOrEmpty,e.x,e.y));const s=this.drag;if(s)switch(s.kind){case"draw":{const t=this.snapValue(e.x,$o),i=this.snapValue(e.y,$o);return void(this.drag={...s,rect:{...s.rect,x:Math.min(s.x0,t),y:Math.min(s.y0,i),w:Math.abs(t-s.x0),h:Math.abs(i-s.y0)}})}case"move":{const t=this.snapValue(e.x-s.start.x,.05),i=this.snapValue(e.y-s.start.y,.05),o=s.orig;return void(this.drag={...s,room:{...o,x:o.x+t,y:o.y+i,pts:o.pts?.map(e=>({x:e.x+t,y:e.y+i}))}})}case"vertex":{const t=this.snapToFloor(this.without(s.room.id),e.x,e.y),i=ko(s.room).map((e,i)=>i===s.index?t:e);return void(this.drag={...s,room:Mo(s.room,i)})}case"photo":case"fmove":return void(this.drag={...s,x:this.snapValue(e.x-s.dx,.05),y:this.snapValue(e.y-s.dy,.05)})}},this.up=()=>{const t=this.drag;if(this.drag=void 0,t)switch(t.kind){case"draw":{if(t.rect.w<1||t.rect.h<1)return;const e=this.gridSnap?Uo(t.rect,this.floorOrEmpty.rooms):t.rect;return this.selected=e.id,void this.edit(t=>t.rooms.push(e))}case"move":{const e=this.without(t.room.id);if(!this.gridSnap)return void this.setRoom(t.room);if(!t.room.pts)return void this.setRoom(Uo(t.room,e.rooms));let s={x:0,y:0};for(const i of t.room.pts){const t=Bo(e,i.x,i.y,.3,.05);if(t.x!==Ho(i.x,.05)||t.y!==Ho(i.y,.05)){s={x:t.x-i.x,y:t.y-i.y};break}}return void this.setRoom(Mo(t.room,t.room.pts.map(t=>({x:t.x+s.x,y:t.y+s.y}))))}case"vertex":return void this.setRoom(t.room);case"photo":return void this.edit(e=>e.underlay&&(e.underlay.x=t.x,e.underlay.y=t.y));case"fmove":{const e=t.members.find(e=>e.id===t.id);if(!e)return;return void this.edit(s=>{s.furniture=(s.furniture??[]).map(s=>{const i=t.members.find(t=>t.id===s.id);return i&&!ha(s)?{...s,x:i.x+t.x-e.x,y:i.y+t.y-e.y}:s})})}}}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.historyKey)}disconnectedCallback(){window.removeEventListener("keydown",this.historyKey),super.disconnectedCallback()}text(t,e){return"ar"===this.ctx.lang?t:e}snapValue(t,e=.05){return this.gridSnap?Ho(t,e):t}snapToFloor(t,e,s){return this.gridSnap?Bo(t,e,s):{x:e,y:s}}mutate(t){this.ctx.update(e=>{const s=JSON.stringify(e.plan);t(e),s!==JSON.stringify(e.plan)&&(this.undoStack=[...this.undoStack.slice(-59),s],this.redoStack=[])})}restoreHistory(t=!1){const e=t?this.redoStack:this.undoStack,s=e[e.length-1];s&&(this.ctx.update(e=>{const i=JSON.stringify(e.plan);e.plan=JSON.parse(s),t?(this.redoStack=this.redoStack.slice(0,-1),this.undoStack=[...this.undoStack,i]):(this.undoStack=this.undoStack.slice(0,-1),this.redoStack=[...this.redoStack,i])}),this.drag=void 0,this.live={},this.setTool(this.tool))}rotateFurniture(t){const e=new Set(this.selectedFurnIds.length?this.selectedFurnIds:this.selFurn?[this.selFurn]:[]),s=(this.floor?.furniture??[]).filter(t=>e.has(t.id)&&!ha(t));if(!s.length)return;const i=s.reduce((t,e)=>t+e.x,0)/s.length,o=s.reduce((t,e)=>t+e.y,0)/s.length,a=t*Math.PI/180;this.edit(e=>{e.furniture=(e.furniture??[]).map(e=>{if(!s.some(t=>t.id===e.id))return e;const r=e.x-i,n=e.y-o;return{...e,x:i+r*Math.cos(a)-n*Math.sin(a),y:o+r*Math.sin(a)+n*Math.cos(a),rot:((e.rot||0)+t+360)%360}})})}get floor(){const t=this.ctx.config.plan.floors;return t.find(t=>t.id===this.floorId)??t[0]}get floorOrEmpty(){return this.floor??{id:"",name:"",rooms:[],doors:[]}}edit(t){const e=this.floor?.id;this.mutate(s=>{let i=s.plan.floors.find(t=>t.id===e)??s.plan.floors[0];i||(i={id:as(),name:this.ctx.t("floor_n",{n:1}),rooms:[],doors:[],walls:[],furniture:[]},s.plan.floors.push(i)),t(i)})}setRoom(t){ha(this.floor?.rooms.find(e=>e.id===t.id))||this.edit(e=>e.rooms=e.rooms.map(e=>e.id===t.id?{...t,area:e.area}:e))}setTool(t){this.tool=t,this.selected=void 0,this.selVertex=void 0,this.selFurn=void 0,this.selectedFurnIds=[],this.measurePoints=[],this.selWall=void 0,this.shapePts=[],this.wallStart=void 0}point(t){const e=this.renderRoot.querySelector("svg.board"),s=e.createSVGPoint();s.x=t.clientX,s.y=t.clientY;const i=s.matrixTransform(e.getScreenCTM().inverse());return{x:i.x,y:i.y}}view(){const t=this.floor,e=t&&(t.rooms.length||t.walls?.length)?zo(t):{x:0,y:0,w:0,h:0},s=Math.min(0,e.x)-2,i=Math.min(0,e.y)-2;return{x:s,y:i,w:Math.max(16,e.x+e.w)+2-s,h:Math.max(10,e.y+e.h)+2-i}}without(t){const e=this.floorOrEmpty;return{...e,rooms:e.rooms.filter(e=>e.id!==t)}}finishShape(){const t=this.shapePts;if(t.length<3)return;const e=Mo({id:as(),x:0,y:0,w:0,h:0},t);this.edit(t=>t.rooms.push(e)),this.shapePts=[],this.tool="room",this.selected=e.id}deleteVertex(){const t=this.floorOrEmpty.rooms.find(t=>t.id===this.selected);if(!t||ha(t)||void 0===this.selVertex)return;const e=ko(t).filter((t,e)=>e!==this.selVertex);e.length<3||(this.setRoom(Mo(t,e)),this.selVertex=void 0)}setFurn(t,e){this.edit(s=>s.furniture=(s.furniture??[]).map(s=>(s.id!==t||ha(s)||e(s),s)))}furniturePanel(){const{t:t,lang:e,hass:s}=this.ctx,i=this.floor?.furniture?.find(t=>t.id===this.selFurn),o=i?aa(i.type):void 0;if(i){const a=o?.domains?Ks(this.ctx,o.domains):[],r="ceiling"===o?.mount,n=this.live.z??ra(i.type,i.z),l=this.live.scale??i.scale??1,c=t=>Math.min(2.5,Math.max(0,Math.round(100*t)/100)),d=t=>Math.min(2.5,Math.max(.4,Math.round(100*t)/100)),p=t=>this.setFurn(i.id,e=>e.z=c(t)),h=t=>this.setFurn(i.id,e=>e.scale=d(t)),u=t=>this.setFurn(i.id,e=>e.z=c(ra(e.type,e.z)+t)),g=t=>this.setFurn(i.id,e=>e.scale=d((e.scale??1)+t)),m=this.live.stretch??i.stretch??1,f=t=>Math.min(4,Math.max(.25,Math.round(100*t)/100)),b=t=>this.setFurn(i.id,e=>e.stretch=f(t)),x=t=>this.setFurn(i.id,e=>e.stretch=f((e.stretch??1)+t)),v=(o?.w??.5)*l*m;return U`<div class="panel">
        <span class="fname">${((t,e)=>aa(t)?.name[e]??t)(i.type,e)} ${this.selectedFurnIds.length>1?`· ${this.selectedFurnIds.length}`:""}</span>
        <button class="soft" aria-pressed=${ha(i)} @click=${()=>this.edit(t=>{t.furniture=(t.furniture??[]).map(t=>t.id===i.id?{...t,locked:!ha(t)}:t)})}>${js(le,18)}${this.text(ha(i)?"فتح القفل":"قفل القطعة",ha(i)?"Unlock":"Lock piece")}</button>
        <label class="field inline"><span>${this.text("اسم القطعة","Piece label")}</span><input maxlength="80" ?disabled=${ha(i)} .value=${ua(i)??""} @change=${t=>this.setFurn(i.id,e=>Object.assign(e,{label:t.target.value.trim().slice(0,80)}))}></label>
        <div class="rot">
          <button aria-label="-15°" @click=${()=>this.rotateFurniture(-15)}>${js(we,18)}</button>
          <button aria-label="90°" @click=${()=>this.rotateFurniture(90)}>${js("M12,5C16.97,5 21,7.69 21,11C21,12.68 19.96,14.2 18.29,15.29C19.36,14.42 20,13.32 20,12.13C20,9.29 16.42,7 12,7V10L8,6L12,2V5M12,19C7.03,19 3,16.31 3,13C3,11.32 4.04,9.8 5.71,8.71C4.64,9.58 4,10.68 4,11.88C4,14.71 7.58,17 12,17V14L16,18L12,22V19Z",18)}90°</button>
          <button aria-label="+15°" @click=${()=>this.rotateFurniture(15)}>${js(Ce,18)}</button>
        </div>
        ${o?.domains?U`<label class="field inline grow">
              <span>${t("link_device")}</span>
              <select @change=${t=>{const e=t.target.value||void 0;this.setFurn(i.id,t=>t.entity=e)}}>
                <option value="" ?selected=${!i.entity}>${t("none")}</option>
                ${i.entity&&!s.states[i.entity]?U`<option value=${i.entity} selected disabled>${this.text("جهاز غير موجود","Missing device")}: ${i.entity}</option>`:K}
                ${a.map(t=>U`<option value=${t} ?selected=${t===i.entity}>${ps(s,t)} · ${t}</option>`)}
              </select>
            </label>`:K}
        ${i.entity&&!s.states[i.entity]?U`<p class="missing-link" role="status">${this.text("الجهاز المرتبط مش موجود. اختار جهاز بديل من القائمة؛ مكان القطعة وإعداداتها رح تضل محفوظة.","The linked device is missing. Pick a replacement above; its position and settings stay intact.")}</p>`:K}
        ${na.includes(i.type)?U`<label class="field inline grow">
              <span>${t("picture_source")}</span>
              <select @change=${t=>{const e=t.target.value||void 0;this.setFurn(i.id,t=>t.source=e)}}>
                <option value="" ?selected=${!i.source}>${t("none")}</option>
                ${Ks(this.ctx,["camera"]).map(t=>U`<option value=${t} ?selected=${t===i.source}>${ps(s,t)} · ${t}</option>`)}
              </select>
            </label>`:K}
        <div class="exact-fields">
          <label class="field inline"><span>${this.text("العرض الدقيق (m)","Exact width (m)")}</span><input type="number" min=${(o?.w??.5)*l*.25} max=${(o?.w??.5)*l*4} step="0.01" ?disabled=${ha(i)} .value=${v.toFixed(2)} @change=${t=>{const e=Number(t.target.value);Number.isFinite(e)&&e>0&&b(e/((o?.w??.5)*l))}}></label>
          ${["x","y","rot"].map(t=>U`<label class="field inline"><span>${"rot"===t?this.text("الزاوية °","Angle °"):t.toUpperCase()+" (m)"}</span><input type="number" step=${"rot"===t?"1":"0.05"} ?disabled=${ha(i)} .value=${String(i[t]??0)} @change=${e=>{const s=Number(e.target.value);Number.isFinite(s)&&Math.abs(s)<=1e4&&this.setFurn(i.id,e=>{e[t]="rot"===t?(s%360+360)%360:s})}}></label>`)}
        </div>
        <button class="danger" ?disabled=${ha(i)} @click=${()=>{const t=new Set(this.selectedFurnIds.length?this.selectedFurnIds:[i.id]);this.edit(e=>e.furniture=(e.furniture??[]).filter(e=>!t.has(e.id)||ha(e))),this.selFurn=void 0}}>${js(Tt,18)}</button>
        <div class="sliders">
          ${this.stepper(t(r?"hang_down":"height_above_floor"),`${n.toFixed(2)} m`,n,0,2.5,.01,.05,"z",p,u)}
          ${this.stepper(t("size"),`${Math.round(100*l)}%`,l,.4,2.5,.05,.1,"scale",h,g)}
          ${this.stepper(t("length"),`${v.toFixed(2)} m`,m,.25,4,.05,.1,"stretch",b,x)}
          <button class="reset" @click=${()=>this.setFurn(i.id,t=>(t.z=void 0,t.scale=void 0,t.stretch=void 0))}>${t("reset")}</button>
        </div>
      </div>`}return U`<div class="catalog">
      <div class="cats">
        <input
          class="search"
          type="search"
          placeholder=${t("search_furniture")}
          .value=${this.search}
          @input=${t=>this.search=t.target.value}
        />
        ${oa.map(t=>U`<button class=${t.key!==this.category||this.search?"":"on"} @click=${()=>(this.category=t.key,this.search="")}>${t.name[e]}</button>`)}
      </div>
      <div class="items">
        ${ia.filter(t=>{const e=this.search.trim().toLowerCase();return e?t.name.en.toLowerCase().includes(e)||t.name.ar.includes(e)||t.type.includes(e):t.category===this.category}).map(t=>U`<button class="item ${this.placing===t.type?"on":""}" @click=${()=>this.placing=this.placing===t.type?void 0:t.type}>
            ${js(t.icon,26)}<span>${t.name[e]}</span>
          </button>`)}
      </div>
    </div>`}async upload(t){const e=t.target,s=e.files?.[0];if(e.value="",s){this.uploading=!0;try{const t=new FormData;t.append("file",s);const e=await this.ctx.hass.fetchWithAuth("/api/smartnest_pro/upload",{method:"POST",body:t});if(!e.ok)throw new Error(String(e.status));const{url:i}=await e.json(),o=this.view();this.edit(t=>t.underlay={url:i,x:o.x+2,y:o.y+2,width:12,opacity:.5}),this.tool="photo"}catch{this.ctx.toast(this.ctx.t("upload_failed"))}finally{this.uploading=!1}}}addFloor(){const t=as();this.mutate(e=>e.plan.floors.push({id:t,name:this.ctx.t("floor_n",{n:e.plan.floors.length+1}),rooms:[],doors:[],walls:[],furniture:[]})),this.floorId=t,this.setTool(this.tool)}removeFloor(t){this.mutate(e=>e.plan.floors=e.plan.floors.filter(e=>e.id!==t)),this.floorId=void 0,this.setTool(this.tool)}stepper(t,e,s,i,o,a,r,n,l,c){return U`<div class="slider ${"wall"===n?"wall":""}">
      <span>${t} <b>${e}</b></span>
      <input class="precise" aria-label=${"stretch"===n?this.text("عامل تمديد الطول","Length multiplier"):t} title=${"stretch"===n?this.text("عامل التمديد؛ لتحديد العرض بالمتر استعمل خانة العرض الدقيق","Multiplier; use Exact width for dimensions in metres"):t} type="number" min=${"scale"===n?100*i:i} max=${"scale"===n?100*o:o} step=${"scale"===n?100*a:a} .value=${String("scale"===n?Math.round(100*s):s)} @change=${t=>{const e=Number(t.target.value)/("scale"===n?100:1);Number.isFinite(e)&&l(Math.min(o,Math.max(i,e)))}}>
      <div class="step-row">
        <button class="nudge" aria-label="−" @click=${()=>c(-r)}>−</button>
        <input
          type="range"
          min=${i}
          max=${o}
          step=${a}
          .value=${String(s)}
          @input=${t=>this.live={...this.live,[n]:Number(t.target.value)}}
          @change=${t=>{l(Number(t.target.value)),this.live={...this.live,[n]:void 0}}}
        />
        <button class="nudge" aria-label="+" @click=${()=>c(r)}>+</button>
      </div>
    </div>`}toolPanel(){const{t:t,hass:e}=this.ctx,s=this.floorOrEmpty;switch(this.tool){case"measure":{const t=this.measurePoints,e=2===t.length?Math.hypot(t[1].x-t[0].x,t[1].y-t[0].y):void 0;return U`<div class="panel"><span>${void 0===e?this.text("اضغط على نقطتين لقياس المسافة بالمتر","Tap two points to measure in metres"):`${e.toFixed(2)} m`}</span><button class="soft" @click=${()=>this.measurePoints=[]}>${this.text("قياس جديد","New measurement")}</button></div>`}case"shape":return U`<div class="panel">
          <span class="fname">${t("points_n",{n:this.shapePts.length})}</span>
          <button class="soft" ?disabled=${!this.shapePts.length} @click=${()=>this.shapePts=this.shapePts.slice(0,-1)}>${js(Be,18)}${t("undo_point")}</button>
          <button class="soft" ?disabled=${!this.shapePts.length} @click=${()=>this.shapePts=[]}>${js(Et,18)}${t("cancel")}</button>
          <button class="ok" ?disabled=${this.shapePts.length<3} @click=${()=>this.finishShape()}>${js(Pt,18)}${t("finish_room")}</button>
        </div>`;case"wall":return this.selWall?U`<div class="panel">
              <span class="fname">${t("wall")}</span>
              ${(()=>{const t=s.walls?.find(t=>t.id===this.selWall);return t?U`
                <button class="soft" @click=${()=>this.edit(e=>{e.walls=(e.walls??[]).map(e=>e.id===t.id?{...e,locked:!ha(e)}:e)})}>${js(le,18)}${this.text(ha(t)?"فتح القفل":"قفل الجدار",ha(t)?"Unlock wall":"Lock wall")}</button>
                ${["x1","y1","x2","y2"].map(e=>U`<label class="field inline"><span>${e} (m)</span><input type="number" step="0.05" ?disabled=${ha(t)} .value=${String(t[e])} @change=${s=>{const i=Number(s.target.value);Number.isFinite(i)&&Math.abs(i)<1e4&&this.edit(s=>{s.walls=(s.walls??[]).map(s=>s.id!==t.id||ha(s)?s:{...s,[e]:i})})}}></label>`)}
              `:K})()}
              <button class="danger" ?disabled=${ha(s.walls?.find(t=>t.id===this.selWall))} @click=${()=>{const t=this.selWall;this.edit(e=>e.walls=(e.walls??[]).filter(e=>e.id!==t)),this.selWall=void 0}}>${js(Tt,18)}${t("delete")}</button>
            </div>`:this.wallStart?U`<div class="panel">
                <button class="ok" @click=${()=>this.wallStart=void 0}>${js(Pt,18)}${t("done")}</button>
              </div>`:K;case"photo":{const e=s.underlay;return U`<div class="panel">
          <label class="upload">
            ${js(ie,18)}${this.uploading?t("uploading"):t(e?"change_image":"upload_plan_photo")}
            <input type="file" accept="image/png,image/jpeg,image/webp" hidden @change=${this.upload} />
          </label>
          ${e?U`<label class="field inline"
                  ><span>${t("photo_width")}</span>
                  <input type="number" min="2" max="80" step="0.1" .value=${String(e.width)} @change=${t=>this.edit(s=>s.underlay&&(s.underlay.width=Math.max(1,Number(t.target.value)||e.width)))} />
                </label>
                <label class="field inline"
                  ><span>${t("photo_opacity")}</span>
                  <input type="range" min="0.1" max="1" step="0.05" .value=${String(e.opacity)} @input=${t=>this.edit(e=>e.underlay&&(e.underlay.opacity=Number(t.target.value)))} />
                </label>
                <button class="danger" @click=${()=>this.edit(t=>t.underlay=void 0)}>${js(Tt,18)}</button>`:K}
        </div>`}case"furniture":return this.furniturePanel();case"room":{const i=s.rooms.find(t=>t.id===this.selected);if(!i)return K;const o=ko(i);return U`<div class="panel">
          <button class="soft" @click=${()=>this.edit(t=>{t.rooms=t.rooms.map(t=>t.id===i.id?{...t,locked:!ha(t)}:t)})}>${js(le,18)}${this.text(ha(i)?"فتح القفل":"قفل الغرفة",ha(i)?"Unlock room":"Lock room")}</button>
          ${i.pts?K:["x","y","w","h"].map(t=>U`<label class="field inline"><span>${{x:"X",y:"Y",w:this.text("العرض","Width"),h:this.text("الطول","Depth")}[t]} (m)</span><input type="number" step="0.05" ?disabled=${ha(i)} .value=${String(i[t])} @change=${e=>{const s=Number(e.target.value);Number.isFinite(s)&&Math.abs(s)<1e4&&("w"!==t&&"h"!==t||s>=.25)&&this.setRoom({...i,[t]:s})}}></label>`)}
          <label class="field inline grow">
            <span>${t("pin_room")}</span>
            <select @change=${t=>{const e=t.target.value||void 0;this.edit(t=>t.rooms=t.rooms.map(t=>t.id===i.id?{...t,area:e}:t))}}>
              <option value="" ?selected=${!i.area}>${t("unlinked")}</option>
              ${fs(e).map(t=>U`<option value=${t.area_id} ?selected=${t.area_id===i.area}>${t.name}</option>`)}
            </select>
          </label>
          ${void 0!==this.selVertex&&o.length>3?U`<button class="soft" @click=${()=>this.deleteVertex()}>${js(Et,18)}${t("delete_point")}</button>`:K}
          <button class="danger" ?disabled=${ha(i)} @click=${()=>{this.edit(t=>t.rooms=t.rooms.filter(t=>t.id!==i.id)),this.selected=void 0}}>${js(Tt,18)}${t("delete")}</button>
        </div>`}default:return K}}render(){const{t:t,hass:e,config:s}=this.ctx,i=this.floorOrEmpty,o=this.view(),a=this.drag,r=i.rooms.map(t=>a&&"room"in a&&a.room.id===t.id?a.room:t);"draw"===a?.kind&&a.rect.w>0&&a.rect.h>0&&r.push(a.rect);const n={...i,rooms:r},l=r.find(t=>t.id===this.selected),c=i.underlay,d="photo"===a?.kind?a.x:c?.x,p="photo"===a?.kind?a.y:c?.y,h={room:t("hint_room"),shape:t("hint_shape"),wall:t("hint_wall"),door:t("hint_door"),open:t("hint_open"),furniture:this.placing?t("hint_place"):t("hint_furniture"),photo:t("hint_photo"),measure:this.text("اضغط على نقطتين؛ القياس لا يغيّر التصميم","Tap two points; measuring does not change the layout")},u=(i.furniture??[]).map(t=>{if("fmove"!==a?.kind)return t;const e=a.members.find(t=>t.id===a.id),s=a.members.find(e=>e.id===t.id);return s&&e?{...t,x:s.x+a.x-e.x,y:s.y+a.y-e.y}:t}),g=[["room",Ze,t("tool_room")],["shape","M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17",t("tool_shape")],["wall",qe,t("tool_wall")],["door",Rt,t("tool_door")],["open","M5 5V11H19V5H5M17 9H7V7H17V9M5.27 13.32L3.5 15.09L4.91 16.5L6.68 14.73L5.27 13.32M18.73 13.32L17.32 14.73L19.09 16.5L20.5 15.09L18.73 13.32M11 16V19H13V16H11Z",t("tool_open")],["furniture",ze,t("tool_furniture")],["photo",ie,t("tool_photo")],["measure","M1.39,18.36L3.16,16.6L4.58,18L5.64,16.95L4.22,15.54L5.64,14.12L8.11,16.6L9.17,15.54L6.7,13.06L8.11,11.65L9.53,13.06L10.59,12L9.17,10.59L10.59,9.17L13.06,11.65L14.12,10.59L11.65,8.11L13.06,6.7L14.47,8.11L15.54,7.05L14.12,5.64L15.54,4.22L18,6.7L19.07,5.64L16.6,3.16L18.36,1.39L22.61,5.64L5.64,22.61L1.39,18.36Z",this.text("قياس","Measure")]],m=l?ko(l):[];return U`
      <div class="bar">
        <div class="floors">
          ${s.plan.floors.map(t=>U`<button class=${t.id===this.floor?.id?"on":""} @click=${()=>(this.floorId=t.id,this.setTool(this.tool))}>${t.name}</button>`)}
          <button class="add" aria-label=${t("add_floor")} title=${t("add_floor")} @click=${this.addFloor}>${js(xe,18)}</button>
        </div>
        <div class="tools" role="group">
          ${g.map(([t,e,s])=>U`<button class=${this.tool===t?"on":""} @click=${()=>this.setTool(t)}>${js(e,18)}${s}</button>`)}
        </div>
      </div>
      <div class="history-tools">
        <button class="soft" ?disabled=${!this.undoStack.length} title="Ctrl/Cmd+Z" @click=${()=>this.restoreHistory()}>${js(Be,18)}${this.text("تراجع","Undo")}</button>
        <button class="soft" ?disabled=${!this.redoStack.length} title="Ctrl/Cmd+Shift+Z" @click=${()=>this.restoreHistory(!0)}>${js("M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z",18)}${this.text("إعادة","Redo")}</button>
        <button class="soft" aria-pressed=${this.gridSnap} @click=${()=>this.gridSnap=!this.gridSnap}>${this.text("محاذاة الشبكة","Grid snap")}: ${this.gridSnap?this.text("مفعّلة","On"):this.text("متوقفة","Off")}</button>
        ${"furniture"===this.tool?U`<button class="soft" aria-pressed=${this.multiSelect} @click=${()=>this.multiSelect=!this.multiSelect}>${this.text("تحديد متعدد","Multi-select")}: ${this.multiSelect?this.text("مفعّل","On"):this.text("متوقف","Off")}</button>`:K}
      </div>
      <p class="hint">${h[this.tool]}</p>

      <svg
        class="board tool-${this.tool}"
        viewBox="${o.x} ${o.y} ${o.w} ${o.h}"
        @pointerdown=${this.down}
        @pointermove=${this.move}
        @pointerup=${this.up}
        @pointercancel=${this.up}
        @pointerleave=${()=>this.cursor=void 0}
      >
        <defs>
          <pattern id="minor" width=${.5} height=${.5} patternUnits="userSpaceOnUse">
            <path d="M ${.5} 0 L 0 0 0 ${.5}" fill="none" class="g1"></path>
          </pattern>
          <pattern id="major" width="1" height="1" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="url(#minor)"></rect>
            <path d="M 1 0 L 0 0 0 1" fill="none" class="g2"></path>
          </pattern>
        </defs>
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="url(#major)"></rect>
        ${c?B`<image href=${c.url} x=${d} y=${p} width=${c.width} opacity=${c.opacity} preserveAspectRatio="xMinYMin meet" class="underlay"></image>`:K}
        ${r.map(s=>{const i=s.area?e.areas?.[s.area]?.name??s.area:t("unlinked"),o=ko(s),a=Lo(s),r=s.pts?`${(t=>Math.abs(t.reduce((e,s,i)=>e+s.x*t[(i+1)%t.length].y-t[(i+1)%t.length].x*s.y,0))/2)(o).toFixed(1)} m²`:`${s.w.toFixed(2)} × ${s.h.toFixed(2)} m`;return B`<g data-room=${s.id} class="room ${s.id===this.selected?"sel":""} ${s.area?"":"loose"} ${ha(s)?"locked":""}">
            <polygon points=${ga(o)}></polygon>
            <text x=${a.x} y=${a.y} font-size=${Math.min(.5,s.w/6)}>${i}</text>
            <text class="dim" x=${a.x} y=${a.y+.5} font-size="0.32">${r}</text>
          </g>`})}
        ${Io(n).map(t=>B`<line class="wall" x1=${t.x1} y1=${t.y1} x2=${t.x2} y2=${t.y2}></line>`)}
        ${(i.walls??[]).map(t=>B`<line data-wall=${t.id} class="wall-hit ${t.id===this.selWall?"sel":""}" x1=${t.x1} y1=${t.y1} x2=${t.x2} y2=${t.y2}></line>`)}
        ${function(t){return t.doors.filter(t=>t.open).map(t=>{const e=Do(t),s=Math.cos(e.angle)*(t.width/2),i=Math.sin(e.angle)*(t.width/2);return{id:t.id,x1:e.x-s,y1:e.y-i,x2:e.x+s,y2:e.y+i,angle:e.angle}})}(i).map(t=>B`<line data-open=${t.id} class="open-line" x1=${t.x1} y1=${t.y1} x2=${t.x2} y2=${t.y2}></line>`)}
        ${function(t){return t.doors.filter(t=>!t.open).map(t=>{const e=Do(t),s=Math.cos(e.angle)*(t.width/2),i=Math.sin(e.angle)*(t.width/2);return{id:t.id,x1:e.x-s,y1:e.y-i,x2:e.x+s,y2:e.y+i,angle:e.angle}})}(i).map(t=>B`<line class="door" x1=${t.x1} y1=${t.y1} x2=${t.x2} y2=${t.y2}></line>`)}
        ${u.map(t=>{const e=aa(t.type),s=e?.w??.5,i=e?.d??.5,o=.7*Math.min(s,i)/24;return B`<g data-furn=${t.id} class="furn ${this.selectedFurnIds.includes(t.id)||t.id===this.selFurn?"sel":""} ${ha(t)?"locked":""} ${t.entity?"linked":""}" transform="translate(${t.x} ${t.y}) rotate(${t.rot||0}) scale(${(t.scale??1)*(t.stretch??1)} ${t.scale??1})">
            <rect x=${-s/2} y=${-i/2} width=${s} height=${i} rx="0.05"></rect>
            ${e?B`<path d=${e.icon} transform="translate(${-12*o} ${-12*o}) scale(${o})"></path>`:K}
          </g>${ua(t)?B`<text class="furn-label" x=${t.x} y=${t.y+i*(t.scale??1)/2+.3}>${ua(t)}</text>`:K}`})}
        ${this.measurePoints.length?B`${this.measurePoints.map(t=>B`<circle class="ptdot" cx=${t.x} cy=${t.y} r="0.16"></circle>`)}${2===this.measurePoints.length?B`<line class="measurement" x1=${this.measurePoints[0].x} y1=${this.measurePoints[0].y} x2=${this.measurePoints[1].x} y2=${this.measurePoints[1].y}></line><text class="furn-label" x=${(this.measurePoints[0].x+this.measurePoints[1].x)/2} y=${(this.measurePoints[0].y+this.measurePoints[1].y)/2-.25}>${Math.hypot(this.measurePoints[1].x-this.measurePoints[0].x,this.measurePoints[1].y-this.measurePoints[0].y).toFixed(2)} m</text>`:K}`:K}
        ${l&&!ha(l)&&"room"===this.tool?B`${m.map((t,e)=>{const s=m[(e+1)%m.length];return B`<g data-mid=${e} class="mid"><circle cx=${(t.x+s.x)/2} cy=${(t.y+s.y)/2} r="0.2"></circle>
                <path d="M ${(t.x+s.x)/2-.1} ${(t.y+s.y)/2} h 0.2 M ${(t.x+s.x)/2} ${(t.y+s.y)/2-.1} v 0.2"></path></g>`})}
            ${m.map((t,e)=>B`<circle data-vertex=${e} class="vertex ${e===this.selVertex?"on":""}" cx=${t.x} cy=${t.y} r="0.26"></circle>`)}`:K}
        ${"shape"===this.tool&&this.shapePts.length?B`<polyline class="draft" points=${ga(this.cursor?[...this.shapePts,this.cursor]:this.shapePts)}></polyline>
            ${this.shapePts.map((t,e)=>B`<circle class="ptdot ${0===e&&this.shapePts.length>=3?"close":""}" cx=${t.x} cy=${t.y} r=${0===e?.24:.15}></circle>`)}`:K}
        ${"wall"===this.tool&&this.wallStart?B`<circle class="ptdot" cx=${this.wallStart.x} cy=${this.wallStart.y} r="0.18"></circle>
            ${this.cursor?B`<line class="draft-wall" x1=${this.wallStart.x} y1=${this.wallStart.y} x2=${this.cursor.x} y2=${this.cursor.y}></line>`:K}`:K}
        ${"shape"!==this.tool&&"wall"!==this.tool||!this.cursor?K:B`<circle class="cursor" cx=${this.cursor.x} cy=${this.cursor.y} r="0.1"></circle>`}
      </svg>

      ${this.toolPanel()}

      ${this.floor?U`<div class="panel floor">
            <label class="field inline grow">
              <span>${t("floor_name")}</span>
              <input type="text" .value=${this.floor.name} @change=${t=>this.edit(e=>e.name=t.target.value||e.name)} />
            </label>
            ${(()=>{const e=this.live.wall??this.floor.wallHeight??Co,s=t=>Math.min(3,Math.max(.5,Math.round(100*t)/100));return this.stepper(t("wall_height"),`${e.toFixed(2)} m`,e,.5,3,.05,.05,"wall",t=>this.edit(e=>e.wallHeight=s(t)),t=>this.edit(e=>e.wallHeight=s((e.wallHeight??Co)+t)))})()}
            <button class="danger" @click=${()=>this.removeFloor(this.floor.id)}>${js(Tt,18)}${t("delete_floor")}</button>
          </div>`:K}
    `}};ma.styles=[Bs,qs,n`
      :host {
        display: grid;
        gap: 12px;
      }
      .history-tools, .exact-fields { display: flex; flex-wrap: wrap; gap: 8px; }
      .history-tools .soft[aria-pressed="true"] { border-color: var(--sn-accent); color: var(--sn-accent); }
      .precise { max-width: 120px; padding: 6px; border-radius: 8px; color: var(--sn-text); background: transparent; border: 1px solid var(--sn-glass-border); }
      .furn-label { fill: var(--sn-text); font-size: 0.28px; text-anchor: middle; pointer-events: none; }
      .locked { opacity: .65; }
      .missing-link { flex-basis: 100%; color: var(--sn-warm, #ffad75); margin: 0; font-size: 12px; }
      .measurement { stroke: var(--sn-accent); stroke-width: .06; stroke-dasharray: .15 .08; pointer-events: none; }
      .soft:disabled, .danger:disabled { opacity: .4; cursor: default; }
      .tool-measure .room, .tool-measure .furn { pointer-events: none; }
      .bar {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: space-between;
      }
      .floors,
      .tools {
        display: flex;
        gap: 6px;
        padding: 5px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid var(--sn-glass-border);
      }
      .floors button,
      .tools button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 36px;
        padding: 0 14px;
        border-radius: 999px;
        border: 0;
        background: none;
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .floors button.on,
      .tools button.on {
        background: var(--sn-accent);
        color: #1d1b30;
      }
      .floors .add {
        padding: 0 10px;
      }
      .hint {
        margin: 0;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .board {
        width: 100%;
        height: min(56vh, 560px);
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.18);
        border: 1px solid var(--sn-glass-border);
        touch-action: none;
        cursor: crosshair;
        direction: ltr;
        user-select: none;
        -webkit-user-select: none;
      }
      .board.tool-photo {
        cursor: move;
      }
      .g1 {
        stroke: rgba(255, 255, 255, 0.06);
        stroke-width: 0.02;
      }
      .g2 {
        stroke: rgba(255, 255, 255, 0.14);
        stroke-width: 0.03;
      }
      .underlay {
        pointer-events: none;
      }
      .room polygon {
        fill: rgba(255, 255, 255, 0.1);
        stroke: rgba(255, 255, 255, 0.25);
        stroke-width: 0.03;
        cursor: move;
      }
      .room.loose polygon {
        fill: rgba(255, 180, 120, 0.1);
      }
      .room.sel polygon {
        fill: color-mix(in srgb, var(--sn-accent) 28%, transparent);
        stroke: var(--sn-accent);
        stroke-width: 0.06;
      }
      .room text {
        fill: var(--sn-text);
        text-anchor: middle;
        dominant-baseline: middle;
        pointer-events: none;
      }
      .room text.dim {
        fill: var(--sn-text-dim);
      }
      .wall {
        stroke: var(--sn-text);
        stroke-width: 0.12;
        stroke-linecap: square;
        pointer-events: none;
      }
      .door {
        stroke: var(--sn-warm, #ff8a3d);
        stroke-width: 0.12;
        stroke-dasharray: 0.12 0.1;
        pointer-events: none;
      }
      .furn {
        pointer-events: none;
      }
      .tool-furniture .furn {
        pointer-events: auto;
        cursor: move;
      }
      .furn rect {
        fill: rgba(255, 255, 255, 0.16);
        stroke: rgba(255, 255, 255, 0.45);
        stroke-width: 0.025;
      }
      .furn.linked rect {
        stroke: var(--sn-accent);
      }
      .furn.sel rect {
        fill: color-mix(in srgb, var(--sn-accent) 35%, transparent);
        stroke: var(--sn-accent);
        stroke-width: 0.05;
      }
      .furn path {
        fill: var(--sn-text);
        opacity: 0.85;
      }
      .sliders {
        flex-basis: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 18px;
      }
      .slider {
        display: grid;
        gap: 6px;
        flex: 1;
        min-width: 180px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .slider b {
        color: var(--sn-text);
        font-weight: 500;
        margin-inline-start: 6px;
      }
      .slider input {
        width: 100%;
        accent-color: var(--sn-accent-strong);
      }
      .slider.wall {
        max-width: 340px;
      }
      .step-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .nudge {
        flex: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 18px;
        cursor: pointer;
      }
      .reset {
        height: 38px;
        padding: 0 14px;
        border-radius: 12px;
        border: 1px solid var(--sn-glass-border);
        background: none;
        color: var(--sn-text-dim);
        cursor: pointer;
      }
      .search {
        flex: none;
        width: 170px;
        height: 34px;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(0, 0, 0, 0.18);
        color: var(--sn-text);
        font: inherit;
        font-size: 13px;
      }
      .catalog {
        display: grid;
        gap: 10px;
        padding: 12px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--sn-glass-border);
      }
      .cats {
        display: flex;
        gap: 6px;
        overflow-x: auto;
      }
      .cats button {
        height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: none;
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
      }
      .cats button.on {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
      .items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
        gap: 8px;
        max-height: 260px;
        overflow-y: auto;
      }
      .item {
        display: grid;
        justify-items: center;
        gap: 6px;
        padding: 12px 6px;
        border-radius: 16px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--sn-text);
        font-size: 12px;
        text-align: center;
        cursor: pointer;
      }
      .item.on {
        background: color-mix(in srgb, var(--sn-accent) 30%, transparent);
        border-color: var(--sn-accent);
      }
      .fname {
        font-size: 15px;
        align-self: center;
      }
      .rot {
        display: flex;
        gap: 6px;
      }
      .rot button {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 44px;
        padding: 0 12px;
        border-radius: 14px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        cursor: pointer;
      }
      .handle {
        fill: #fff;
        stroke: var(--sn-accent-strong);
        stroke-width: 0.06;
        cursor: nwse-resize;
      }
      .panel {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--sn-glass-border);
      }
      .field.inline {
        margin: 0;
        min-width: 140px;
      }
      .field.grow {
        flex: 1;
      }
      .upload,
      .danger {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 16px;
        border-radius: 14px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
      }
      .danger {
        background: #8a3b2e;
        border-color: transparent;
        color: #fff;
      }
      input[type="range"] {
        width: 160px;
        accent-color: var(--sn-accent-strong);
      }
      .wall-hit {
        stroke: transparent;
        stroke-width: 0.35;
        pointer-events: none;
      }
      .tool-wall .wall-hit {
        pointer-events: stroke;
        cursor: pointer;
      }
      .wall-hit.sel {
        stroke: color-mix(in srgb, var(--sn-accent) 55%, transparent);
      }
      .open-line {
        stroke: var(--sn-accent);
        stroke-width: 0.08;
        stroke-dasharray: 0.18 0.14;
        pointer-events: none;
      }
      .tool-open .open-line {
        pointer-events: stroke;
        stroke-width: 0.3;
        stroke-opacity: 0.6;
        cursor: pointer;
      }
      .vertex {
        fill: #fff;
        stroke: var(--sn-accent-strong);
        stroke-width: 0.06;
        cursor: move;
      }
      .vertex.on {
        fill: var(--sn-accent);
      }
      .mid circle {
        fill: rgba(255, 255, 255, 0.25);
        stroke: #fff;
        stroke-width: 0.03;
        cursor: copy;
      }
      .mid path {
        stroke: #fff;
        stroke-width: 0.04;
        pointer-events: none;
      }
      .draft,
      .draft-wall {
        fill: color-mix(in srgb, var(--sn-accent) 18%, transparent);
        stroke: var(--sn-accent);
        stroke-width: 0.08;
        stroke-dasharray: 0.2 0.12;
        pointer-events: none;
      }
      .draft-wall {
        stroke-width: 0.12;
        stroke-dasharray: none;
      }
      .ptdot {
        fill: var(--sn-accent);
        stroke: #fff;
        stroke-width: 0.04;
        pointer-events: none;
      }
      .ptdot.close {
        fill: #fff;
        stroke: var(--sn-accent-strong);
        stroke-width: 0.08;
      }
      .cursor {
        fill: #fff;
        pointer-events: none;
      }
      .tool-shape,
      .tool-wall,
      .tool-door,
      .tool-open {
        cursor: crosshair;
      }
      .tool-shape .room,
      .tool-wall .room,
      .tool-door .room,
      .tool-open .room,
      .tool-furniture .room {
        pointer-events: none;
      }
      .soft,
      .ok {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 16px;
        border-radius: 14px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
      }
      .ok {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
      .soft:disabled,
      .ok:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .tools {
        flex-wrap: wrap;
      }
    `],da([gt({attribute:!1})],ma.prototype,"ctx",2),da([mt()],ma.prototype,"floorId",2),da([mt()],ma.prototype,"tool",2),da([mt()],ma.prototype,"selected",2),da([mt()],ma.prototype,"selVertex",2),da([mt()],ma.prototype,"drag",2),da([mt()],ma.prototype,"uploading",2),da([mt()],ma.prototype,"placing",2),da([mt()],ma.prototype,"category",2),da([mt()],ma.prototype,"selFurn",2),da([mt()],ma.prototype,"search",2),da([mt()],ma.prototype,"shapePts",2),da([mt()],ma.prototype,"wallStart",2),da([mt()],ma.prototype,"selWall",2),da([mt()],ma.prototype,"cursor",2),da([mt()],ma.prototype,"live",2),da([mt()],ma.prototype,"selectedFurnIds",2),da([mt()],ma.prototype,"multiSelect",2),da([mt()],ma.prototype,"gridSnap",2),da([mt()],ma.prototype,"measurePoints",2),da([mt()],ma.prototype,"undoStack",2),da([mt()],ma.prototype,"redoStack",2),ma=da([pt("sn-plan-editor")],ma);var fa=Object.defineProperty,ba=Object.getOwnPropertyDescriptor,xa=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?ba(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&fa(e,s,a),a};const va={top:88,high:66,normal:52,low:32,eye:12},ya=[[120,160,255],[255,255,255],[255,214,170],[255,138,61]],$a=[15,30,60,120],wa=t=>{try{return localStorage.getItem(t)}catch{return null}},Ca=(t,e)=>{try{localStorage.setItem(t,e)}catch{}};let _a=class extends ct{constructor(){super(...arguments),this.big=!1,this.pick=!1,this.timerMenu=!1,this.timers={},this.failed=!1,this.builtKey="",this.effectsKey="",this.alertsKey="",this.palette="",this.resize=new ResizeObserver(([t])=>this.scene?.resize(t.contentRect.width,t.contentRect.height)),this.pointers=new Map,this.tapZoom="1"===wa("sn-plan-tapzoom"),this.view=wa("sn-plan-view")in va?wa("sn-plan-view"):"normal",this.viewMenu=!1,this.flat=null===wa("sn-plan-flat")?void 0:"1"===wa("sn-plan-flat"),this.summaryCache=new Map,this.down=t=>{if(!t.target.closest(".dev, .ring, .ui")){if(t.currentTarget.setPointerCapture(t.pointerId),this.pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),1===this.pointers.size){this.gesture={moved:!1,rotate:2===t.button||t.shiftKey};const e=this.ctx.editing||this.pick||!this.scene?void 0:this.pickAt(t);if(e?.entity){const t=this.gesture;t.hold=window.setTimeout(()=>{t.moved||(t.held=!0,navigator.vibrate?.(10),this.ringAt=this.scene.piecePos(e.id),this.openRing(e.entity))},450)}}if(2===this.pointers.size){const[t,e]=[...this.pointers.values()];this.gesture={moved:!0,pinch:Math.hypot(t.x-e.x,t.y-e.y),twist:Math.atan2(e.y-t.y,e.x-t.x)}}}},this.move=t=>{const e=this.pointers.get(t.pointerId);if(!e||!this.scene)return;const s={x:t.clientX,y:t.clientY};if(this.pointers.set(t.pointerId,s),2===this.pointers.size&&this.gesture?.pinch){const[t,e]=[...this.pointers.values()],s=Math.hypot(t.x-e.x,t.y-e.y);this.scene.zoomBy(s/this.gesture.pinch),this.gesture.pinch=s;const i=Math.atan2(e.y-t.y,e.x-t.x);let o=i-(this.gesture.twist??i);return o>Math.PI&&(o-=2*Math.PI),o<-Math.PI&&(o+=2*Math.PI),this.gesture.twist=i,void(Math.abs(o)>.002&&this.scene.rotateBy(180*-o/Math.PI,!1))}const i=s.x-e.x,o=s.y-e.y;this.gesture&&!this.gesture.moved&&Math.hypot(i,o)<3||(this.gesture&&(this.gesture.moved=!0,clearTimeout(this.gesture.hold)),this.gesture?.rotate?this.scene.rotateBy(.4*i,!1):this.scene.pan(i,o))},this.up=t=>{const e=this.gesture;e&&clearTimeout(e.hold),(e?.rotate||void 0!==e?.twist)&&this.saveAngle();const s=1===this.pointers.size&&e&&!e.moved&&!e.held;if(this.pointers.delete(t.pointerId),!s||!this.scene||!this.floor)return;if(this.ring)return void(this.ring=void 0);if(this.pick){const e=this.renderRoot.querySelector(".canvas").getBoundingClientRect(),s=this.scene.unproject(t.clientX-e.left,t.clientY-e.top),i=So(this.floor,s.x,s.y);return void(!i||this.pickable&&!this.pickable.has(i.id)||this.dispatchEvent(new CustomEvent("room-pick",{detail:i.id,bubbles:!0,composed:!0})))}const i=this.ctx.editing?void 0:this.pickAt(t);if(i?.entity&&this.ctx.hass.states[i.entity])return["camera","sensor"].includes(cs(i.entity))?void this.ctx.openEntity(i.entity):void(this.tapZoom?this.focusDevice(i.entity,this.scene.piecePos(i.id)):ws(this.ctx.hass,i.entity));const o=this.renderRoot.querySelector(".canvas").getBoundingClientRect(),a=this.scene.unproject(t.clientX-o.left,t.clientY-o.top),r=So(this.floor,a.x,a.y);if(r&&r.id!==this.focusRoom){this.focusRoom=r.id;const t=this.ctx.phone||this.big?0:Math.min(380,.42*this.clientWidth)/2+8;this.scene.flyTo(r,this.floor,this.ctx.rtl?-t:t),r.area&&this.ctx.selectRoom(r.area)}else this.unfocus()},this.wheel=t=>{t.preventDefault(),this.scene?.zoomBy(t.deltaY<0?1.1:1/1.1)}}get isFlat(){return this.flat??"2d"===this.ctx.config.settings.plan_view}get lightQuality(){const t=this.ctx.config.settings;if(t.reduce_effects||"light"===t.performance)return!0;if("high"===t.performance)return!1;const e=navigator.deviceMemory;return"number"==typeof e&&e<=4||navigator.hardwareConcurrency>0&&navigator.hardwareConcurrency<=4}text(t,e){return"ar"===this.ctx.lang?t:e}floorSummary(t){this.summaryHass===this.ctx.hass&&this.summaryConfig===this.ctx.config||(this.summaryHass=this.ctx.hass,this.summaryConfig=this.ctx.config,this.summaryCache.clear());const e=this.summaryCache.get(t.id);if(void 0!==e)return e;const s=this.lives(t).filter(t=>t.occupied).length,i=[...new Set(t.rooms.flatMap(t=>t.area?xs(this.ctx.hass,t.area,this.ctx.config.rooms[t.area]?.hidden):[]))].filter(t=>"light"===cs(t)&&hs(this.ctx.hass.states[t])).length,o=this.text(`${s} غرف مشغولة · ${i} أضواء`,`${s} occupied · ${i} lights`);return this.summaryCache.set(t.id,o),o}get floor(){const t=this.ctx.config.plan.floors;return t.find(t=>t.id===(this.fixedFloor??this.floorId))??t[0]}disconnectedCallback(){super.disconnectedCallback(),this.resize.disconnect(),this.scene?.dispose(),this.scene=void 0,this.loading=void 0,this.builtKey=""}async ensureScene(){if(this.scene||this.loading)return this.loading;const e=this.renderRoot.querySelector(".canvas");return e?(this.loading=t(async()=>{const{PlanScene:t}=await(import("./scene-Do0vyN2c.js"));return{PlanScene:t}},[]).then(({PlanScene:t})=>{if(!this.isConnected)return;const s=new t(e,this.ctx.palette,!0);s.onRender=()=>this.requestUpdate(),this.pick||(s.hass=()=>this.ctx.hass),this.scene=s;const i=Number(wa("sn-plan-azimuth"));Number.isFinite(i)&&null!==wa("sn-plan-azimuth")&&s.setAzimuth(i),"normal"!==this.view&&s.setElevation(va[this.view],!1),this.palette=this.ctx.palette,this.resize.observe(e);const o=e.getBoundingClientRect();s.resize(o.width,o.height),this.sync()}).catch(()=>{this.failed=!0}),this.loading):void 0}updated(){this.floor?.rooms.length&&this.ensureScene(),this.sync()}sync(){const t=this.scene,e=this.floor;if(!t||!e)return;t.setQuality(this.lightQuality),t.setFlatView(this.isFlat),this.palette!==this.ctx.palette&&(this.palette=this.ctx.palette,t.setPalette(this.ctx.palette),this.builtKey="");const s=JSON.stringify([e.id,e.rooms,e.doors,e.furniture,e.walls,e.wallHeight]);s!==this.builtKey&&(this.builtKey=s,this.effectsKey="",this.alertsKey="",this.lastHass=void 0,t.build(e));const i=this.lives(e),o=this.pick?[]:Jo(this.ctx.hass,e),a={};for(const l of o)l.roomId&&(a[l.roomId]="alert");if(this.pick)for(const l of e.rooms)this.picked?.has(l.id)?a[l.id]="on":this.pickable&&!this.pickable.has(l.id)&&(a[l.id]="dim");const r=JSON.stringify([i,a]);r!==this.effectsKey&&(this.effectsKey=r,t.setMarks(a),t.setEffects(i));const n=o.map(t=>t.id).join();n!==this.alertsKey&&(this.alertsKey=n,t.setAlerts(new Set(o.map(t=>t.id)))),this.lastHass!==this.ctx.hass&&(this.lastHass=this.ctx.hass,t.setStates(this.ctx.hass.states))}lives(t){return t.rooms.map(t=>function(t,e,s,i){if(!i||!t.areas?.[i])return{roomId:s,occupied:!1,open:!1};const o=xs(t,i,e.rooms[i]?.hidden),a=$s(t,i,e.rooms[i]);let r;for(const h of o.filter(t=>"light"===cs(t))){const e=t.states[h];if(!hs(e))continue;const s="number"==typeof e.attributes.brightness?e.attributes.brightness/255:1;(!r||s>r.level)&&(r={rgb:Go(e.attributes),level:s})}const n=a.climate?t.states[a.climate]:void 0,l=n?.attributes.hvac_action,c=n?.state,d="cooling"===l||!l&&"cool"===c?"cool":"heating"===l||!l&&"heat"===c?"heat":void 0,p=o.some(e=>"binary_sensor"===cs(e)&&Ko.includes(t.states[e]?.attributes.device_class)&&"on"===t.states[e].state);return{roomId:s,light:r,climate:d,temperature:a.temperature,occupied:!!a.occupied,people:a.people,open:p}}(this.ctx.hass,this.ctx.config,t.id,t.area))}pickAt(t){const e=this.renderRoot.querySelector(".canvas").getBoundingClientRect();return this.scene.pickFurniture(t.clientX-e.left,t.clientY-e.top)}saveAngle(){window.setTimeout(()=>this.scene&&Ca("sn-plan-azimuth",String(Math.round(10*this.scene.azimuthDeg)/10)),600)}rotate(t){this.scene?.rotateBy(t),this.saveAngle()}focusDevice(t,e){const s=this.floor;if(!s||!e||!this.scene)return;const i=So(s,e.x,e.y);this.focusRoom=i?.id;const o=this.ctx.phone||this.big?0:Math.min(380,.42*this.clientWidth)/2+8;this.scene.flyTo(i,s,this.ctx.rtl?-o:o,e),i?.area&&!this.ctx.phone&&this.ctx.selectRoom(i.area),this.ringAt=e,this.openRing(t)}bumpWalls(t,e){this.ctx.update(s=>{const i=s.plan.floors.find(e=>e.id===t);i&&(i.wallHeight=Math.min(3,Math.max(.5,Math.round(100*((i.wallHeight??Co)+e))/100)))})}unfocus(){this.focusRoom=void 0,this.scene&&this.floor&&this.scene.flyTo(void 0,this.floor),this.dispatchEvent(new CustomEvent("unfocus"))}devDown(t,e){if(t.stopPropagation(),!this.ctx.editing)return void ti(t,()=>{this.ringAt=void 0,this.openRing(e)});const s=t.currentTarget;s.setPointerCapture(t.pointerId);const i=this.renderRoot.querySelector(".canvas").getBoundingClientRect(),o=t=>{const s=this.scene.unproject(t.clientX-i.left,t.clientY-i.top);this.drag={id:e,x:s.x,y:s.y}},a=()=>{s.removeEventListener("pointermove",o),s.removeEventListener("pointerup",a),s.removeEventListener("pointercancel",a);const t=this.drag;if(this.drag=void 0,t&&this.floor){const e=this.floor.id;this.ctx.update(s=>s.plan.devices[t.id]={floor:e,x:Math.round(100*t.x)/100,y:Math.round(100*t.y)/100})}};s.addEventListener("pointermove",o),s.addEventListener("pointerup",a),s.addEventListener("pointercancel",a)}async openRing(t){this.ring=t,this.timerMenu=!1;try{this.timers=await this.ctx.hass.callWS({type:"smartnest_pro/timer/list"})}catch{this.timers={}}}setTimer(t,e){const s=this.ctx.hass;e?s.callWS({type:"smartnest_pro/timer/set",entity_id:t,minutes:e}).catch(()=>this.ctx.toast(this.ctx.t("save_failed"))):s.callWS({type:"smartnest_pro/timer/cancel",entity_id:t}),this.timers={...this.timers,[t]:e?60*e:0},this.timerMenu=!1,e&&this.ctx.toast(this.ctx.t("timer_set",{n:e}))}ringView(t,e,s){const{hass:i,t:o}=this.ctx,a=i.states[t],r=cs(t),n=hs(a),l=this.timers[t],c=[];ii(t,a)&&c.push({icon:Ue,label:o("brightness"),run:()=>(this.ring=void 0,this.ctx.openLevel(t))}),"lock"!==r&&"vacuum"!==r&&c.push({icon:"M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z",label:o("timer"),active:!!l,run:()=>this.timerMenu=!this.timerMenu}),"light"===r&&(a.attributes.supported_color_modes??[]).some(t=>["hs","rgb","rgbw","rgbww","xy"].includes(t))&&c.push({icon:"M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",label:o("customize_color"),run:()=>(this.timerMenu=!1,this.ring=`${t}|color`)}),c.push({icon:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",label:o("open_in_ha"),run:()=>(this.ring=void 0,this.ctx.openEntity(t))});const d=this.ring===`${t}|color`,p=e>.62*(this.renderRoot.querySelector(".canvas")?.clientWidth??600)?-1:1,h=((t,e,s)=>t===`${e}|color`?ya.length:s)(this.ring,t,c.length),u=s<110?-10:-46*(h-1)/2;return U`<div class="ring" style="left:${e}px; top:${s}px" @pointerdown=${t=>t.stopPropagation()}>
      <span class="halo"></span>
      <button class="core ${n?"on":""}" aria-label=${o("on")} @click=${()=>ws(i,t)}>${js("light"===r?ve:Ts(t,a),30)}</button>
      ${(d?ya.map(e=>({icon:"",label:`rgb(${e})`,color:`rgb(${e.join(",")})`,run:()=>{i.callService("light","turn_on",{entity_id:t,rgb_color:e}),this.ring=t}})):c).map((t,e)=>{const s=(u+46*e)*Math.PI/180;return U`<button
          class="orb ${t.active?"active":""}"
          style="transform: translate(${p*Math.cos(s)*80}px, ${80*Math.sin(s)}px); animation-delay:${40*e}ms; ${t.color?`--swatch:${t.color}`:""}"
          aria-label=${t.label}
          title=${t.label}
          @click=${t.run}
        >
          ${t.color?U`<span class="swatch"></span>`:js(t.icon,18)}
        </button>`})}
      ${this.timerMenu?U`<div class="timer-menu">
            ${$a.map(e=>U`<button @click=${()=>this.setTimer(t,e)}>${e<60?`${e}m`:e/60+"h"}</button>`)}
            ${l?U`<button class="off" @click=${()=>this.setTimer(t)}>${js(Et,14)}</button>`:K}
          </div>`:K}
      <span class="ring-name">${ps(i,t)}${l?U` · ${Math.ceil(l/60)}m`:K}</span>
    </div>`}placeholder(){const{t:t,isAdmin:e,phone:s,editing:i}=this.ctx;return U`<div class="placeholder glass">
      ${js(Xt,54)}
      <span>${t("draw_plan")}</span>
      ${e&&!s?i?U`<button class="pill" @click=${()=>pa(this.ctx)}>${js(fe,18)}${t("edit_plan")}</button>`:U`<small>${t("draw_plan_hint")}</small>`:K}
    </div>`}render(){const{config:t,hass:e,t:s,editing:i,room:o}=this.ctx,a=this.floor;if(!a||!a.rooms.length)return this.placeholder();const r=this.scene,n=new Set((a.furniture??[]).map(t=>t.entity).filter(Boolean)),l=r&&!this.pick?function(t,e,s){const i=[],o=e.plan.hidden;for(const a of s.rooms){if(!a.area||!t.areas?.[a.area])continue;const r=xs(t,a.area,e.rooms[a.area]?.hidden).filter(t=>Yo.includes(cs(t))&&!o.includes(t)),n=r.filter(t=>e.plan.devices[t]?.floor!==s.id),l=Math.min(.8,.25*a.h),c=qo(a,n.length,l);n.forEach((t,e)=>i.push({id:t,...c[e],roomId:a.id}));for(const t of r){const o=e.plan.devices[t];o?.floor===s.id&&i.push({id:t,x:o.x,y:o.y,roomId:a.id})}}return i}(e,t,a).filter(t=>!n.has(t.id)):[],c=new Map(this.lives(a).map(t=>[t.roomId,t])),d=zo(a),p=r?.viewRect(),h=t.plan.floors,u=this.ring?.split("|")[0];return U`
      <div class="canvas" @contextmenu=${t=>t.preventDefault()} @pointerdown=${this.down} @pointermove=${this.move} @pointerup=${this.up} @pointercancel=${this.up} @wheel=${this.wheel}>
        ${this.failed?U`<div class="empty">${s("plan_failed")}</div>`:r?K:U`<div class="plan-loading" role="status"><svg viewBox="${d.x-1} ${d.y-1} ${d.w+2} ${d.h+2}" aria-hidden="true">${a.rooms.map(t=>B`<polygon points=${ko(t).map(t=>`${t.x},${t.y}`).join(" ")}></polygon>`)}</svg><span>${this.text("عم نجهّز مخطط بيتك…","Preparing your home plan…")}</span></div>`}
      </div>
      ${r?U`<div class="overlay">
            ${a.rooms.map(s=>{const i=c.get(s.id);if(!s.area||(t.pages.rooms?.hidden??[]).includes(s.area))return K;const a=s.pts?Lo(s):{x:s.x+s.w/2,y:s.y+.35},n=r.project(a.x,a.y,.02),l=e.areas?.[s.area]?.name??s.area;return U`<div class="label ${s.area===o?"sel":""}" style="left:${n.left}px; top:${n.top}px">
                <b>${l}</b>
                ${void 0!==i?.temperature?U`<span>${i.temperature.toFixed(1)}°</span>`:K}
              </div>`})}
            ${(a.furniture??[]).filter(t=>t.label).map(t=>{const e=r.project(t.x,t.y,(t.z??0)+.1);return U`<span class="piece-label" style="left:${e.left}px;top:${e.top}px">${t.label}</span>`})}
            ${a.rooms.map(t=>{const e=c.get(t.id);if(!e?.occupied||this.pick)return K;const s=Lo(t),i=r.project(s.x,s.y,.02);return U`<div class="presence" style="left:${i.left}px; top:${i.top}px">
                <span class="pulse"></span>
                ${e.people?U`<span class="count">${js(yt,13)}${e.people}</span>`:K}
              </div>`})}
            ${(this.pick?[]:(a.furniture??[]).filter(t=>"electric_panel"===t.type&&t.entity&&e.states[t.entity])).map(t=>{const s=Number(e.states[t.entity].state)*("kW"===e.states[t.entity].attributes.unit_of_measurement?1e3:1);if(!Number.isFinite(s))return K;const i=r.project(t.x,t.y,.75);return U`<button class="power" style="left:${i.left}px; top:${i.top}px" @click=${()=>this.ctx.openEntity(t.entity)}>
                ${js(ae,13)}${s>=1e3?`${(s/1e3).toFixed(1)} kW`:`${Math.round(s)} W`}
              </button>`})}
            ${(this.pick?[]:Jo(e,a)).map(t=>{const i=r.project(t.x,t.y,.9),o=Math.min(Math.max(i.left,86),this.clientWidth-86),a=Math.min(Math.max(i.top,150),this.clientHeight-10);return U`<button
                class="alert"
                style="left:${o}px; top:${a}px"
                @click=${()=>t.camera&&this.ctx.openEntity(t.camera)}
              >
                ${t.image?U`<img src=${t.image} alt="" />`:K}
                <span><b>${s("person_seen")}</b>${t.camera?ps(e,t.camera):""}${t.since?` · ${Ms(t.since,this.ctx.lang)}`:""}</span>
              </button>`})}
            ${l.map(t=>{const o=this.drag?.id===t.id?this.drag:t,a=r.project(o.x,o.y,.25),n=e.states[t.id],l=hs(n),c=n?.attributes.rgb_color;return U`<button
                class="dev ${l?"on":""} ${i?"editing":""} ${u===t.id?"ringed":""}"
                style="left:${a.left}px; top:${a.top}px; ${l&&c?`--glow: rgb(${c.join(",")})`:""}"
                aria-label=${ps(e,t.id)}
                title=${ps(e,t.id)}
                @pointerdown=${e=>this.devDown(e,t.id)}
                @click=${()=>!i&&(this.tapZoom?this.focusDevice(t.id,t):ws(e,t.id))}
                @contextmenu=${si}
              >
                ${js(Ts(t.id,n),15)}
                ${this.timers[t.id]?U`<span class="tdot"></span>`:K}
              </button>
              ${i?U`<button
                    class="dev-x"
                    style="left:${a.left+14}px; top:${a.top-14}px"
                    aria-label=${s("hide")}
                    @click=${()=>this.ctx.update(e=>e.plan.hidden.push(t.id))}
                  >
                    ${js(Et,11)}
                  </button>`:K}`})}
            ${u&&(l.some(t=>t.id===u)||this.ringAt)?(()=>{const t=l.find(t=>t.id===u)??this.ringAt,e=r.project(t.x,t.y,.45);return this.ringView(u,e.left,e.top)})():K}
          </div>`:K}

      ${h.length>1&&!this.fixedFloor?U`<div class="ui floors ${this.ctx.phone?"top":""}">
            ${h.map(t=>U`<button class=${t.id===a.id?"on":""} title=${this.floorSummary(t)} @click=${()=>(this.floorId=t.id,this.ring=void 0)}><span>${t.name}</span><small>${this.floorSummary(t)}</small></button>`)}
          </div>`:K}

      <div class="ui tools">
        <button class="tool" aria-pressed=${this.isFlat} title=${this.text("تبديل عرض المخطط","Switch plan view")} @click=${()=>{this.flat=!this.isFlat,Ca("sn-plan-flat",this.flat?"1":"0"),this.scene?.setFlatView(this.flat)}}>${this.isFlat?"2D":"3D"}</button>
        ${i&&!this.pick?U`<div class="walls" title=${s("wall_height")}>
                <button aria-label="−" @click=${()=>this.bumpWalls(a.id,-.1)}>−</button>
                <span>${js(qe,16)}${(a.wallHeight??Co).toFixed(2)} m</span>
                <button aria-label="+" @click=${()=>this.bumpWalls(a.id,.1)}>+</button>
              </div>
              <button class="tool wide" @click=${()=>pa(this.ctx)}>${js(fe,18)}${s("edit_plan")}</button>`:K}
        ${this.pick?K:U`<button
          class="tool ${this.tapZoom?"on":""}"
          aria-pressed=${this.tapZoom}
          aria-label=${s("tap_zoom")}
          title=${this.tapZoom?s("tap_zoom_on"):s("tap_zoom_off")}
          @click=${()=>{this.tapZoom=!this.tapZoom,Ca("sn-plan-tapzoom",this.tapZoom?"1":"0"),this.ctx.toast(this.tapZoom?s("tap_zoom_on"):s("tap_zoom_off"))}}
        >
          ${js("M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z",20)}
        </button>`}
        <div class="view-wrap" ?hidden=${this.isFlat}>
          <button class="tool ${this.viewMenu?"on":""}" aria-label=${s("view")} title=${s("view")} @click=${()=>this.viewMenu=!this.viewMenu}>
            ${js(Wt,20)}
          </button>
          ${this.viewMenu?U`<div class="view-menu">
                ${Object.keys(va).map(t=>U`<button
                    class=${t===this.view?"on":""}
                    @click=${()=>{this.view=t,this.viewMenu=!1,Ca("sn-plan-view",t),this.scene?.setElevation(va[t],!this.ctx.config.settings.reduce_effects)}}
                  >
                    <span class="angle" style="--a:${va[t]}deg"></span>${s(`view_${t}`)}
                  </button>`)}
              </div>`:K}
        </div>
        <button class="tool" ?hidden=${this.isFlat} aria-label=${s("rotate_left")} title=${s("rotate_left")} @click=${()=>this.rotate(-45)}>${js(we,20)}</button>
        <button class="tool" ?hidden=${this.isFlat} aria-label=${s("rotate_right")} title=${s("rotate_right")} @click=${()=>this.rotate(45)}>${js(Ce,20)}</button>
        <button class="tool" aria-label="zoom in" @click=${()=>r?.zoomBy(1.25)}>${js("M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z",20)}</button>
        <button class="tool" aria-label="zoom out" @click=${()=>r?.zoomBy(.8)}>${js("M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z",20)}</button>
        <button class="tool" aria-label="fit" @click=${()=>r?.reset(a)}>${js("M17 4H20C21.1 4 22 4.9 22 6V8H20V6H17V4M4 8V6H7V4H4C2.9 4 2 4.9 2 6V8H4M20 16V18H17V20H20C21.1 20 22 19.1 22 18V16H20M7 18H4V16H2V18C2 19.1 2.9 20 4 20H7V18M16 10V14H8V10H16M18 8H6V16H18V8Z",20)}</button>
        ${this.big||this.pick?K:U`<button
              class="tool"
              aria-label=${s("expand")}
              title=${s("expand")}
              @click=${()=>this.ctx.showSheet({title:s("floor_plan"),icon:Xt,wide:!0,render:t=>U`<sn-floorplan big .ctx=${t}></sn-floorplan>`})}
            >
              ${js("M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",20)}
            </button>`}
      </div>

      ${!p||this.ctx.phone||this.pick?K:U`<svg class="ui mini" viewBox="${d.x-.5} ${d.y-.5} ${d.w+1} ${d.h+1}" preserveAspectRatio="xMidYMid meet">
            ${a.rooms.map(t=>B`<polygon points=${ko(t).map(t=>`${t.x},${t.y}`).join(" ")} class=${t.area&&t.area===o?"sel":""}></polygon>`)}
            <rect class="view" x=${p.x} y=${p.y} width=${p.w} height=${p.h}></rect>
          </svg>`}
    `}};_a.styles=[Bs,n`
      :host {
        position: relative;
        display: block;
        min-height: 0;
      }
      :host([big]) {
        height: min(74vh, 760px);
      }
      :host([pick]) {
        height: 300px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(0, 0, 0, 0.1);
      }
      :host([pick]) .tools {
        bottom: 8px;
        inset-inline-end: 8px;
        gap: 6px;
      }
      :host([pick]) .tool {
        min-width: 36px;
        height: 36px;
      }
      :host {
        overflow: hidden;
        border-radius: var(--sn-radius);
        -webkit-touch-callout: none;
        user-select: none;
      }
      .canvas {
        position: absolute;
        inset: 0;
        touch-action: none;
        cursor: grab;
      }
      .canvas:active {
        cursor: grabbing;
      }
      .overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .overlay > * {
        pointer-events: auto;
      }
      .label {
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: baseline;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 999px;
        background: rgba(20, 16, 40, 0.28);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        color: #fff;
        font-size: 11px;
        white-space: nowrap;
        pointer-events: none;
      }
      .label b {
        font-weight: 500;
      }
      .label span {
        opacity: 0.8;
      }
      .label.sel {
        background: var(--sn-accent);
        color: #1d1b30;
      }
      .power {
        position: absolute;
        transform: translate(-50%, -100%);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid rgba(255, 210, 120, 0.5);
        background: rgba(20, 18, 16, 0.7);
        color: #ffd27a;
        font: inherit;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        cursor: pointer;
        pointer-events: auto;
      }
      .alert {
        position: absolute;
        transform: translate(-50%, calc(-100% - 10px));
        display: grid;
        width: 150px;
        padding: 0;
        border: 2px solid #ff4a3d;
        border-radius: 14px;
        overflow: hidden;
        background: rgba(20, 16, 15, 0.82);
        color: #fff;
        font: inherit;
        font-size: 11px;
        text-align: start;
        cursor: pointer;
        pointer-events: auto;
        box-shadow: 0 0 0 0 rgba(255, 74, 61, 0.6);
        animation: alert-ring 1.6s ease-out infinite;
        z-index: 3;
      }
      .alert img {
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        display: block;
      }
      .alert span {
        display: grid;
        gap: 1px;
        padding: 6px 9px;
        opacity: 0.85;
      }
      .alert b {
        color: #ff8a80;
        font-weight: 500;
        font-size: 12px;
      }
      @keyframes alert-ring {
        70% {
          box-shadow: 0 0 0 12px rgba(255, 74, 61, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 74, 61, 0);
        }
      }
      .presence {
        position: absolute;
        width: 0;
        height: 0;
        pointer-events: none;
      }
      .pulse {
        position: absolute;
        left: -26px;
        top: -16px;
        width: 52px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid var(--sn-accent);
        animation: pulse 2.4s ease-out infinite;
      }
      @keyframes pulse {
        from {
          transform: scale(0.4);
          opacity: 0.9;
        }
        to {
          transform: scale(1.8);
          opacity: 0;
        }
      }
      .count {
        position: absolute;
        left: -18px;
        top: 14px;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 7px;
        border-radius: 999px;
        background: var(--sn-accent);
        color: #1d1b30;
        font-size: 11px;
        font-weight: 600;
      }
      .dev {
        position: absolute;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        padding: 0;
        border-radius: 50%;
        border: 1.5px solid rgba(255, 255, 255, 0.85);
        background: rgba(30, 26, 60, 0.35);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        color: #fff;
        cursor: pointer;
        touch-action: none;
        transition: transform 0.2s ease, background 0.25s ease, box-shadow 0.25s ease;
      }
      .dev:active {
        transform: translate(-50%, -50%) scale(0.9);
      }
      .dev.on {
        background: var(--glow, #fff3d6);
        color: #2a2416;
        box-shadow: 0 0 18px var(--glow, rgba(255, 230, 170, 0.8));
      }
      .dev.editing {
        cursor: move;
        outline: 1.5px dashed rgba(255, 255, 255, 0.7);
        outline-offset: 3px;
      }
      .dev.ringed {
        opacity: 0;
      }
      .tdot {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--sn-warm, #ff8a3d);
        border: 2px solid #fff;
      }
      .dev-x {
        position: absolute;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        width: 20px;
        height: 20px;
        padding: 0;
        border-radius: 50%;
        border: 1.5px solid #fff;
        background: #b5442f;
        color: #fff;
        cursor: pointer;
      }
      .ring {
        position: absolute;
        width: 0;
        height: 0;
        z-index: 5;
      }
      .halo {
        position: absolute;
        left: -82px;
        top: -82px;
        width: 164px;
        height: 164px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.35);
        background: radial-gradient(circle, rgba(140, 160, 255, 0.28), rgba(140, 160, 255, 0) 70%);
        animation: grow 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2);
      }
      .core {
        position: absolute;
        left: -32px;
        top: -32px;
        width: 64px;
        height: 64px;
        display: grid;
        place-items: center;
        padding: 0;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.9);
        background: rgba(40, 34, 90, 0.65);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
        cursor: pointer;
        box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6);
        animation: grow 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3);
      }
      .core.on {
        background: var(--sn-warm, #ff8a3d);
        border-color: #fff;
        box-shadow: 0 0 30px var(--sn-warm, #ff8a3d);
      }
      .orb {
        position: absolute;
        left: -19px;
        top: -19px;
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        padding: 0;
        border-radius: 50%;
        border: 1.5px solid rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.92);
        color: #2a2650;
        cursor: pointer;
        animation: pop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.4) both;
      }
      .orb.active {
        background: var(--sn-warm, #ff8a3d);
        color: #fff;
      }
      .swatch {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--swatch);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
      }
      @keyframes grow {
        from {
          transform: scale(0.3);
          opacity: 0;
        }
      }
      @keyframes pop {
        from {
          opacity: 0;
          scale: 0.2;
        }
      }
      .timer-menu {
        position: absolute;
        left: 0;
        top: 74px;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
        padding: 6px;
        border-radius: 999px;
        background: var(--sn-glass-strong);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        border: 1px solid var(--sn-glass-border);
        animation: grow 0.25s ease;
      }
      .timer-menu button {
        height: 32px;
        min-width: 42px;
        padding: 0 10px;
        border-radius: 999px;
        border: 0;
        background: rgba(255, 255, 255, 0.12);
        color: var(--sn-text);
        font-size: 12px;
        cursor: pointer;
      }
      .timer-menu .off {
        display: grid;
        place-items: center;
        min-width: 32px;
        background: #b5442f;
      }
      .ring-name {
        position: absolute;
        left: 0;
        top: -62px;
        transform: translateX(-50%);
        padding: 4px 12px;
        border-radius: 999px;
        background: rgba(20, 16, 40, 0.55);
        color: #fff;
        font-size: 12px;
        white-space: nowrap;
      }
      .ui {
        position: absolute;
        z-index: 4;
      }
      /* Beside the minimap, leaving the bottom-right for the (longer, in edit mode) toolbar. */
      .piece-label { position: absolute; transform: translate(-50%, 12px); color: var(--sn-text); background: var(--sn-bg, #26232c); border: 1px solid var(--sn-glass-border); border-radius: 7px; padding: 3px 6px; font-size: 10px; pointer-events: none; white-space: nowrap; }
      .plan-loading { position: absolute; inset: 0; display: grid; place-items: center; padding: 36px; color: var(--sn-text-dim); font-size: 12px; pointer-events: none; }
      .plan-loading svg { width: 100%; height: 80%; fill: color-mix(in srgb, var(--sn-accent) 12%, transparent); stroke: var(--sn-text-dim); stroke-width: .05; }
      .floors small { display: block; font-size: 9px; font-weight: 400; opacity: .75; margin-top: 3px; }
      [hidden] { display: none !important; }
      .floors {
        bottom: 12px;
        inset-inline-start: 136px;
        display: flex;
        gap: 6px;
        padding: 5px;
        border-radius: 999px;
        background: var(--sn-glass);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        border: 1px solid var(--sn-glass-border);
      }
      .floors.top {
        top: 12px;
        bottom: auto;
        left: 12px;
        transform: none;
      }
      .floors button {
        height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        border: 0;
        background: none;
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .floors button.on {
        background: #fff;
        color: #1d1b30;
      }
      .tools {
        bottom: 12px;
        inset-inline-end: 12px;
        display: flex;
        gap: 8px;
      }
      .tool {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-width: 40px;
        height: 40px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-glass);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        color: var(--sn-text-on-bg);
        cursor: pointer;
        font-size: 13px;
      }
      .view-wrap {
        position: relative;
      }
      .view-menu {
        position: absolute;
        bottom: 50px;
        inset-inline-end: 0;
        display: grid;
        gap: 4px;
        min-width: 170px;
        padding: 6px;
        border-radius: 18px;
        background: var(--sn-glass-strong);
        border: 1px solid var(--sn-glass-border);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        box-shadow: var(--sn-shadow);
        animation: grow 0.2s ease;
        transform-origin: bottom right;
      }
      .view-menu button {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 40px;
        padding: 0 12px;
        border-radius: 12px;
        border: 0;
        background: none;
        color: var(--sn-text);
        font-size: 14px;
        text-align: start;
        cursor: pointer;
      }
      .view-menu button.on {
        background: var(--sn-accent);
        color: #1d1b30;
      }
      /* A little line tilted at the view's angle, as a hint of what it looks like. */
      .angle {
        width: 18px;
        height: 2px;
        border-radius: 1px;
        background: currentColor;
        transform: rotate(calc(-1 * var(--a)));
      }
      .walls {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        height: 40px;
        padding: 0 4px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-glass);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        color: var(--sn-text-on-bg);
        font-size: 13px;
      }
      .walls span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0 6px;
        white-space: nowrap;
      }
      .walls button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 0;
        background: rgba(255, 255, 255, 0.12);
        color: inherit;
        font-size: 18px;
        cursor: pointer;
      }
      .tool.on {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
        box-shadow: 0 0 14px var(--sn-accent-glow);
      }
      .tool.wide {
        padding: 0 16px;
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
      .mini {
        bottom: 12px;
        inset-inline-start: 12px;
        width: 110px;
        height: 84px;
        padding: 6px;
        border-radius: 14px;
        background: var(--sn-glass);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        border: 1px solid var(--sn-glass-border);
        pointer-events: none;
      }
      .mini rect,
      .mini polygon {
        fill: none;
        stroke: var(--sn-text-on-bg);
        stroke-opacity: 0.7;
        stroke-width: 0.12;
      }
      .mini polygon.sel {
        fill: var(--sn-accent);
        fill-opacity: 0.35;
      }
      .mini rect.view {
        fill: rgba(255, 255, 255, 0.08);
        stroke: var(--sn-accent);
        stroke-width: 0.18;
        stroke-dasharray: 0.4 0.3;
      }
      .placeholder {
        position: absolute;
        inset: 0;
        margin: auto;
        width: min(340px, 90%);
        height: max-content;
        display: grid;
        justify-items: center;
        gap: 12px;
        padding: 32px 26px;
        text-align: center;
        color: var(--sn-text-dim);
      }
      .placeholder small {
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 42px;
        padding: 0 18px;
        border-radius: 999px;
        border: 0;
        background: var(--sn-accent);
        color: #1d1b30;
        font-size: 14px;
        cursor: pointer;
      }
    `],xa([gt({attribute:!1})],_a.prototype,"ctx",2),xa([gt({type:Boolean,reflect:!0})],_a.prototype,"big",2),xa([gt({type:Boolean,reflect:!0})],_a.prototype,"pick",2),xa([gt({attribute:!1})],_a.prototype,"picked",2),xa([gt({attribute:!1})],_a.prototype,"pickable",2),xa([gt()],_a.prototype,"fixedFloor",2),xa([mt()],_a.prototype,"floorId",2),xa([mt()],_a.prototype,"ring",2),xa([mt()],_a.prototype,"timerMenu",2),xa([mt()],_a.prototype,"timers",2),xa([mt()],_a.prototype,"drag",2),xa([mt()],_a.prototype,"failed",2),xa([mt()],_a.prototype,"tapZoom",2),xa([mt()],_a.prototype,"view",2),xa([mt()],_a.prototype,"viewMenu",2),xa([mt()],_a.prototype,"flat",2),_a=xa([pt("sn-floorplan")],_a);var Ha=Object.defineProperty,ka=Object.getOwnPropertyDescriptor,Va=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?ka(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Ha(e,s,a),a};async function Ma(t,e){const s=await t.hass.callWS({type:"call_service",domain:"roborock",service:"get_maps",target:{entity_id:e},return_response:!0});return(s.response?.[e]?.maps??[]).flatMap(t=>Object.entries(t.rooms??{}).map(([e,s])=>({id:Number(e),name:s,map:t.name})))}function Aa(t,e){const s=t.config.plan.floors,i=t.config.robots?.[e]?.floor;return s.find(t=>t.id===i)??s.find(t=>(t.furniture??[]).some(t=>t.entity===e))??s.find(t=>t.rooms.length)}const La=(t,e,s)=>{const i=e.rooms.find(t=>t.id===s);return i?.area&&t.hass.areas?.[i.area]?.name||t.t("unlinked")};let Sa=class extends ct{constructor(){super(...arguments),this.picked=new Set,this.repeat=1,this.triedDirect=!1}toggle(t){const e=new Set(this.picked);e.has(t)?e.delete(t):e.add(t),this.picked=e}segments(t){const e=this.ctx.config.robots?.[this.entity]?.segments??{};return t&&Object.keys(e).length?[...this.picked].map(t=>e[t]).filter(t=>Number.isFinite(t)):[...this.picked].map(Number).filter(t=>Number.isFinite(t))}clean(t){const e=this.segments(t);e.length&&(this.ctx.hass.callService("vacuum","send_command",{entity_id:this.entity,command:"app_segment_clean",params:[{segments:e,repeat:this.repeat}]}),this.ctx.toast(this.ctx.t("cleaning_n",{n:e.length})))}updated(){Object.keys(this.ctx.config.robots?.[this.entity]?.segments??{}).length||this.triedDirect||(this.triedDirect=!0,Ma(this.ctx,this.entity).then(t=>this.direct=t).catch(()=>this.direct=[]))}selects(){const{hass:t}=this.ctx;return Vs(t,this.entity).filter(e=>"select"===cs(e)&&Array.isArray(t.states[e]?.attributes.options)).slice(0,3)}render(){const{t:t,hass:e,isAdmin:s}=this.ctx,i=e.states[this.entity];if(!i)return K;const o=Aa(this.ctx,this.entity),a=this.ctx.config.robots?.[this.entity]?.segments??{},r=o?o.rooms.filter(t=>Number.isFinite(a[t.id])):[],n=!!o&&r.length>0,l=i.attributes.fan_speed_list??[],c=this.segments(o).length;return U`<div class="box">
      <div class="head">
        <h4>${t("clean_rooms")}</h4>
        ${n?U`<button class="mini" @click=${()=>this.picked=this.picked.size?new Set:new Set(r.map(t=>t.id))}>
              ${js("M9,9H15V15H9M7,17H17V7H7M15,5H17V3H15M15,21H17V19H15M19,17H21V15H19M19,9H21V7H19M19,21A2,2 0 0,0 21,19H19M19,13H21V11H19M11,21H13V19H11M9,3H7V5H9M3,17H5V15H3M5,21V19H3A2,2 0 0,0 5,21M19,3V5H21A2,2 0 0,0 19,3M13,3H11V5H13M3,9H5V7H3M7,21H9V19H7M3,13H5V11H3M3,5H5V3A2,2 0 0,0 3,5Z",16)}${this.picked.size?t("clear"):t("all")}
            </button>`:K}
        ${s?U`<button class="mini" aria-label=${t("robot_setup")} title=${t("robot_setup")} @click=${()=>this.ctx.showSheet({title:t("robot_setup"),icon:Ot,render:t=>U`<sn-robot-setup .ctx=${t} .entity=${this.entity}></sn-robot-setup>`})}>${js(Ot,16)}</button>`:K}
      </div>

      ${n?U`<sn-floorplan
            pick
            .ctx=${this.ctx}
            .fixedFloor=${o.id}
            .picked=${this.picked}
            .pickable=${new Set(r.map(t=>t.id))}
            @room-pick=${t=>this.toggle(t.detail)}
          ></sn-floorplan>`:this.direct?.length?U`<div class="chips">
              ${this.direct.map(t=>U`<button class=${this.picked.has(String(t.id))?"on":""} @click=${()=>this.toggle(String(t.id))}>${t.name}</button>`)}
            </div>`:U`<div class="hint">${t(s?"robot_rooms_hint":"not_configured")}</div>`}

      ${l.length?U`<div class="row"><span>${t("fan_speed")}</span>
            ${l.map(t=>U`<button class=${t===i.attributes.fan_speed?"on":""} @click=${()=>e.callService("vacuum","set_fan_speed",{entity_id:this.entity,fan_speed:t})}>${t.replace(/_/g," ")}</button>`)}
          </div>`:K}
      ${this.selects().map(t=>{const s=e.states[t];return U`<div class="row"><span>${ps(e,t)}</span>
          ${s.attributes.options.map(i=>U`<button class=${i===s.state?"on":""} @click=${()=>e.callService("select","select_option",{entity_id:t,option:i})}>${i.replace(/_/g," ")}</button>`)}
        </div>`})}
      <div class="row"><span>${t("passes")}</span>
        ${[1,2,3].map(t=>U`<button class=${t===this.repeat?"on":""} @click=${()=>this.repeat=t}>${t}×</button>`)}
      </div>

      <button class="go" ?disabled=${!c} @click=${()=>this.clean(o)}>
        ${js(be,18)}${c?t("clean_selected",{n:c}):t("pick_rooms")}
      </button>
    </div>`}};Sa.styles=[Bs,n`
      .box {
        display: grid;
        gap: 12px;
        padding: 14px;
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.12);
        border: 1px solid var(--sn-glass-border);
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      h4 {
        flex: 1;
        margin: 0;
        font-size: 15px;
        font-weight: 500;
      }
      .mini {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 32px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--sn-text-dim);
        font-size: 12px;
        cursor: pointer;
      }
      .plan {
        width: 100%;
        max-height: 260px;
        direction: ltr;
      }
      .r polygon {
        fill: rgba(255, 255, 255, 0.08);
        stroke: rgba(255, 255, 255, 0.45);
        stroke-width: 0.06;
        cursor: pointer;
        transition: fill 0.2s ease;
      }
      .r.on polygon {
        fill: color-mix(in srgb, var(--sn-accent) 45%, transparent);
        stroke: var(--sn-accent);
      }
      .r.off polygon {
        fill: rgba(0, 0, 0, 0.15);
        stroke-dasharray: 0.15 0.12;
        cursor: default;
      }
      .r text {
        fill: var(--sn-text);
        text-anchor: middle;
        dominant-baseline: middle;
        pointer-events: none;
      }
      .r.off text {
        fill: var(--sn-text-faint);
      }
      .chips,
      .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
      }
      .row span {
        min-width: 70px;
        margin-inline-end: 4px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .chips button,
      .row button {
        height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 13px;
        text-transform: capitalize;
        cursor: pointer;
      }
      .chips button.on,
      .row button.on {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
      .hint {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .go {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 50px;
        border-radius: 18px;
        border: 0;
        background: var(--sn-accent);
        color: #1d1b30;
        font-size: 15px;
        cursor: pointer;
      }
      .go:disabled {
        opacity: 0.45;
        cursor: default;
      }
    `],Va([gt({attribute:!1})],Sa.prototype,"ctx",2),Va([gt()],Sa.prototype,"entity",2),Va([mt()],Sa.prototype,"picked",2),Va([mt()],Sa.prototype,"repeat",2),Va([mt()],Sa.prototype,"direct",2),Sa=Va([pt("sn-robot-rooms")],Sa);let za=class extends ct{constructor(){super(...arguments),this.loading=!1,this.failed=!1}save(t){const e=this.entity;this.ctx.saveLayout(s=>{const i={...s.robots??{}},o={floor:i[e]?.floor,segments:{...i[e]?.segments??{}}};t(o),i[e]=o,s.robots=i})}async fetch(t){this.loading=!0,this.failed=!1;try{if(this.rooms=await Ma(this.ctx,this.entity),t&&this.rooms.length){const e=this.ctx.config.robots?.[this.entity]?.segments??{},s={};for(const i of t.rooms){if(Number.isFinite(e[i.id]))continue;const o=La(this.ctx,t,i.id).toLowerCase(),a=this.rooms.find(t=>t.name.toLowerCase()===o||o.includes(t.name.toLowerCase())||t.name.toLowerCase().includes(o));a&&(s[i.id]=a.id)}Object.keys(s).length&&this.save(t=>Object.assign(t.segments,s))}}catch{this.failed=!0}finally{this.loading=!1}}render(){const{t:t,config:e}=this.ctx,s=Aa(this.ctx,this.entity),i=e.robots?.[this.entity]?.segments??{};return U`
      <p class="lead">${t("robot_setup_hint")}</p>
      ${e.plan.floors.length>1?U`<label class="field">
            <span>${t("robot_floor")}</span>
            <select @change=${t=>{const e=t.target.value;this.save(t=>t.floor=e)}}>
              ${e.plan.floors.map(t=>U`<option value=${t.id} ?selected=${t.id===s?.id}>${t.name}</option>`)}
            </select>
          </label>`:K}
      <button class="fetch" ?disabled=${this.loading} @click=${()=>this.fetch(s)}>
        ${js(ce,18)}${this.loading?t("loading"):t("read_robot_rooms")}
      </button>
      ${this.failed?U`<p class="warn">${t("robot_rooms_failed")}</p>`:K}
      ${s?U`<div class="list">
            ${s.rooms.map(e=>{const o=i[e.id];return U`<label class="line">
                <span>${La(this.ctx,s,e.id)}</span>
                ${this.rooms?.length?U`<select @change=${t=>{const s=t.target.value;this.save(t=>s?t.segments[e.id]=Number(s):delete t.segments[e.id])}}>
                      <option value="" ?selected=${!Number.isFinite(o)}>${t("none")}</option>
                      ${this.rooms.map(t=>U`<option value=${t.id} ?selected=${t.id===o}>${t.name} · ${t.id}${t.map?` (${t.map})`:""}</option>`)}
                    </select>`:U`<input
                      type="number"
                      min="1"
                      placeholder="#"
                      .value=${Number.isFinite(o)?String(o):""}
                      @change=${t=>{const s=t.target.value;this.save(t=>s?t.segments[e.id]=Number(s):delete t.segments[e.id])}}
                    />`}
              </label>`})}
          </div>`:U`<p class="warn">${t("draw_plan")}</p>`}
    `}};za.styles=[Bs,qs,n`
      :host {
        display: grid;
        gap: 14px;
      }
      .lead,
      .warn {
        margin: 0;
        font-size: 13px;
        color: var(--sn-text-dim);
        line-height: 1.5;
      }
      .warn {
        color: #f6b49b;
      }
      .fetch {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 46px;
        border-radius: 14px;
        border: 0;
        background: var(--sn-accent);
        color: #1d1b30;
        font-size: 14px;
        cursor: pointer;
      }
      .list {
        display: grid;
        gap: 8px;
      }
      .line {
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        align-items: center;
        gap: 12px;
        font-size: 14px;
      }
    `],Va([gt({attribute:!1})],za.prototype,"ctx",2),Va([gt()],za.prototype,"entity",2),Va([mt()],za.prototype,"rooms",2),Va([mt()],za.prototype,"loading",2),Va([mt()],za.prototype,"failed",2),za=Va([pt("sn-robot-setup")],za);var Pa=Object.defineProperty,Ea=Object.getOwnPropertyDescriptor,Oa=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Ea(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Pa(e,s,a),a};let Za=class extends ct{constructor(){super(...arguments),this.bare=!1}render(){const t=this.entity;if(!this.ctx.hass.states[t])return U`<div class="empty">${this.ctx.t("not_configured")}</div>`;const{hass:e,t:s}=this.ctx,i=e.states[t],o="lawn_mower"===cs(t),a=Vs(e,t),r=a.find(t=>"image"===cs(t)||"camera"===cs(t)),n=r?e.states[r].attributes.entity_picture:void 0,l=("number"==typeof i.attributes.battery_level?i.attributes.battery_level:void 0)??gs(e.states[a.find(t=>"battery"===e.states[t]?.attributes.device_class)??""]);i.attributes.fan_speed_list;const c=["cleaning","mowing","returning"].includes(i.state),d=`st_${i.state}`,p=["cleaning","docked","returning","idle","paused","error","mowing"].includes(i.state)?s(d):i.state,h=s=>()=>e.callService(o?"lawn_mower":"vacuum",s,{entity_id:t});return U`<div class="robot ${this.bare?"":"glass"}">
      <div class="top">
        <span class="avatar ${c?"busy":""}">${js(o?ye:$e,44)}</span>
        <div class="info">
          <h2>${ps(e,t)}</h2>
          <span class="state ${i.state}">${p}</span>
        </div>
        ${void 0!==l?U`<span class="batt">${js(_t,16)}${s("battery",{n:Math.round(l)})}
              <span class="bar"><span style="width:${l}%"></span></span></span>`:K}
      </div>
      ${n&&this.ctx.config.plan.floors.some(t=>t.rooms.length)&&!o?U`<button class="map-link" @click=${()=>this.ctx.openEntity(r)}>${js("M20.5,3L20.34,3.03L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21L3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19.03 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3M10,5.47L14,6.87V18.53L10,17.13V5.47M5,6.46L8,5.45V17.15L5,18.31V6.46M19,17.54L16,18.55V6.86L19,5.7V17.54Z",16)}${s("robot_map")}</button>`:n?U`<button class="map" @click=${()=>this.ctx.openEntity(r)}><img src=${n} alt=${s("map")} loading="lazy" /></button>`:K}
      ${o?K:U`<sn-robot-rooms .ctx=${this.ctx} .entity=${t}></sn-robot-rooms>`}
      <div class="controls">
        ${c?U`<button class="ctl primary" @click=${h("pause")}>${js(ge)}${s("pause")}</button>`:U`<button class="ctl primary" @click=${h(o?"start_mowing":"start")}>${js(be)}${s("start")}</button>`}
        <button class="ctl" @click=${h(o?"dock":"return_to_base")}>${js("M15 13L11 17V14H2V12H11V9L15 13M5 20V16H7V18H17V10.19L12 5.69L7.21 10H4.22L12 3L22 12H19V20H5Z")}${s("dock")}</button>
        ${o?K:U`<button class="ctl" @click=${h("locate")}>${js("M12,1C7.59,1 4,4.59 4,9C4,14.57 10.96,22.34 11.26,22.67L12,23.5L12.74,22.67C13.04,22.34 20,14.57 20,9C20,4.59 16.41,1 12,1M12,20.47C9.82,17.86 6,12.54 6,9A6,6 0 0,1 12,3A6,6 0 0,1 18,9C18,12.83 13.75,18.36 12,20.47M11.13,14H12.88V15.75H11.13M12,5A3.5,3.5 0 0,0 8.5,8.5H10.25A1.75,1.75 0 0,1 12,6.75A1.75,1.75 0 0,1 13.75,8.5C13.75,10.26 11.13,10.04 11.13,12.88H12.88C12.88,10.91 15.5,10.69 15.5,8.5A3.5,3.5 0 0,0 12,5Z")}${s("locate")}</button>`}
      </div>
    </div>`}};function ja(t,e){for(const s of t.config.plan.floors)for(const i of s.furniture??[])if(i.entity===e&&i.source&&t.hass.states[i.source])return i.source}Za.styles=[Bs,n`
      :host {
        display: block;
      }
      :host([bare]) .robot {
        padding: 0;
      }
      .bar {
        position: relative;
        height: 8px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }
      .bar > span {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        border-radius: 99px;
        background: var(--sn-accent);
      }
      .robot {
        display: grid;
        gap: 18px;
        padding: 22px;
      }
      .top {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      .avatar {
        display: grid;
        place-items: center;
        width: 76px;
        height: 76px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text-dim);
      }
      .avatar.busy {
        background: rgba(181, 220, 143, 0.2);
        color: var(--sn-accent);
        box-shadow: 0 0 26px var(--sn-accent-glow);
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes pulse {
        50% {
          box-shadow: 0 0 6px var(--sn-accent-glow);
        }
      }
      .info {
        flex: 1;
        display: grid;
        gap: 4px;
      }
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 400;
      }
      .state {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .state.cleaning,
      .state.mowing {
        color: var(--sn-accent);
      }
      .state.error {
        color: #f2a487;
      }
      .batt {
        display: grid;
        grid-template-columns: auto auto;
        align-items: center;
        gap: 4px 6px;
        font-size: 12px;
        color: var(--sn-text-dim);
      }
      .batt .bar {
        grid-column: 1 / -1;
        width: 110px;
      }
      .map-link {
        justify-self: start;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 32px;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--sn-text-dim);
        font-size: 12px;
        cursor: pointer;
      }
      .map {
        all: unset;
        cursor: zoom-in;
        border-radius: 20px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.2);
      }
      .map img {
        display: block;
        width: 100%;
        max-height: 320px;
        object-fit: contain;
      }
      .speeds {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .speeds span {
        margin-inline-end: 6px;
      }
      .speeds button {
        height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 13px;
        text-transform: capitalize;
        cursor: pointer;
      }
      .speeds button.on {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
      .controls {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .ctl {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-width: 110px;
        height: 50px;
        border-radius: 18px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
      }
      .ctl.primary {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
    `],Oa([gt({attribute:!1})],Za.prototype,"ctx",2),Oa([gt()],Za.prototype,"entity",2),Oa([gt({type:Boolean,reflect:!0})],Za.prototype,"bare",2),Za=Oa([pt("sn-robot-card")],Za);const Ta=["switch","fan","input_boolean","light","cover","humidifier","siren","scene","script","button","automation"];function Da(t,e){const s=cs(e);return{title:ps(t.hass,e),titleFor:t=>ps(t.hass,e),subtitle:ks(t.hass,e),icon:Ts(e,t.hass.states[e]),wide:"camera"===s||"person"===s||"media_player"===s&&!!ja(t,e),medium:"light"===s&&(to(t.hass.states[e]?.attributes).color||to(t.hass.states[e]?.attributes).temp),render:t=>U`
      ${t.isAdmin?U`<sn-rename .ctx=${t} .entity=${e}></sn-rename>`:K}
      ${function(t,e){const s=cs(e),i=t.hass.states[e];if(("light"===s||"cover"===s)&&ii(e,i))return U`<sn-level .ctx=${t} .entity=${e}></sn-level>`;switch(s){case"camera":return U`<sn-camera-view .ctx=${t} .entity=${e}></sn-camera-view>`;case"person":return U`<sn-person-view .ctx=${t} .entity=${e}></sn-person-view>`;case"climate":return U`<sn-climate-card bare .ctx=${t} .entity=${e}></sn-climate-card>`;case"media_player":{const s=ja(t,e),o=i&&!["off","standby","unavailable","unknown"].includes(i.state);return U`${s&&o?U`<sn-live-video .hass=${t.hass} .entity=${s}
              style="aspect-ratio:16/9;border-radius:20px;margin-bottom:16px;box-shadow:0 24px 50px -20px rgba(0,0,0,.6)"></sn-live-video>`:K}
        <sn-media-player bare .ctx=${t} .entity=${e}></sn-media-player>`}case"vacuum":case"lawn_mower":return U`<sn-robot-card bare .ctx=${t} .entity=${e}></sn-robot-card>`;case"lock":return U`<sn-lock-view .ctx=${t} .entity=${e}></sn-lock-view>`;case"alarm_control_panel":return U`<sn-alarm-view .ctx=${t} .entity=${e}></sn-alarm-view>`;case"image":return U`<sn-image-view .ctx=${t} .entity=${e}></sn-image-view>`;case"sensor":case"binary_sensor":case"number":case"input_number":return U`<sn-sensor-view .ctx=${t} .entity=${e}></sn-sensor-view>`}return Ta.includes(s)?U`<sn-toggle-view .ctx=${t} .entity=${e}></sn-toggle-view>`:U`<sn-sensor-view .ctx=${t} .entity=${e}></sn-sensor-view>`}(t,e)}
      ${t.isAdmin||"person"!==s?U`<div style="display:flex;justify-content:center;margin-top:18px">
            <button
              style="display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 16px;border-radius:999px;border:1px solid var(--sn-glass-border);background:transparent;color:var(--sn-text-dim);font:inherit;font-size:13px;cursor:pointer"
              @click=${s=>{var i,o;i=s.currentTarget,o=e,i.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:o},bubbles:!0,composed:!0})),t.closeSheet()}}
            >
              ${js("M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",16)}${t.t("open_in_ha")}
            </button>
          </div>`:K}
    `}}var Fa=Object.defineProperty,Ra=Object.getOwnPropertyDescriptor,Ia=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Ra(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Fa(e,s,a),a};const Na={"clear-night":Je,cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",exceptional:"M3 5C3 4.4 3.4 4 4 4H5C5.6 4 6 4.4 6 5S5.6 6 5 6H4C3.4 6 3 5.6 3 5M4 13C4 12.4 4.4 12 5 12H6C6.6 12 7 12.4 7 13S6.6 14 6 14H5C4.4 14 4 13.6 4 13M4 16C3.4 16 3 16.4 3 17S3.4 18 4 18H9C9.6 18 10 17.6 10 17S9.6 16 9 16H4M18 5C18 4.4 18.4 4 19 4H21C21.6 4 22 4.4 22 5S21.6 6 21 6H19C18.4 6 18 5.6 18 5M7 20C6.4 20 6 20.4 6 21S6.4 22 7 22H11C11.6 22 12 21.6 12 21S11.6 20 11 20H7M3 10C2.4 10 2 9.6 2 9S2.4 8 3 8H12C13.1 8 14 7.1 14 6S13.1 4 12 4C11.4 4 10.9 4.2 10.6 4.6C10.2 5 9.6 5 9.2 4.6C8.8 4.2 8.8 3.6 9.2 3.2C9.9 2.5 10.9 2 12 2C14.2 2 16 3.8 16 6S14.2 10 12 10H3M19 12C19.6 12 20 11.6 20 11S19.6 10 19 10C18.7 10 18.5 10.1 18.3 10.3C17.9 10.7 17.3 10.7 16.9 10.3C16.5 9.9 16.5 9.3 16.9 8.9C17.4 8.3 18.2 8 19 8C20.7 8 22 9.3 22 11S20.7 14 19 14H10C9.4 14 9 13.6 9 13S9.4 12 10 12H19M18 18H13C12.4 18 12 17.6 12 17S12.4 16 13 16H18C19.7 16 21 17.3 21 19S19.7 22 18 22C17.2 22 16.4 21.7 15.9 21.1C15.5 20.7 15.5 20.1 15.9 19.7C16.3 19.3 16.9 19.3 17.3 19.7C17.5 19.9 17.7 20 18 20C18.6 20 19 19.6 19 19S18.6 18 18 18Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",hail:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z","lightning-rainy":"M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",partlycloudy:Qe,pouring:"M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z","snowy-rainy":"M18.5,18.67C18.5,19.96 17.5,21 16.25,21C15,21 14,19.96 14,18.67C14,17.12 16.25,14.5 16.25,14.5C16.25,14.5 18.5,17.12 18.5,18.67M4,17.36C3.86,16.82 4.18,16.25 4.73,16.11L7,15.5L5.33,13.86C4.93,13.46 4.93,12.81 5.33,12.4C5.73,12 6.4,12 6.79,12.4L8.45,14.05L9.04,11.8C9.18,11.24 9.75,10.92 10.29,11.07C10.85,11.21 11.17,11.78 11,12.33L10.42,14.58L12.67,14C13.22,13.83 13.79,14.15 13.93,14.71C14.08,15.25 13.76,15.82 13.2,15.96L10.95,16.55L12.6,18.21C13,18.6 13,19.27 12.6,19.67C12.2,20.07 11.54,20.07 11.15,19.67L9.5,18L8.89,20.27C8.75,20.83 8.18,21.14 7.64,21C7.08,20.86 6.77,20.29 6.91,19.74L7.5,17.5L5.26,18.09C4.71,18.23 4.14,17.92 4,17.36M1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,11.85 3.35,12.61 3.91,13.16C4.27,13.55 4.26,14.16 3.88,14.54C3.5,14.93 2.85,14.93 2.47,14.54C1.56,13.63 1,12.38 1,11Z",sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",windy:ts,"windy-variant":"M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z"};function Wa(t,e=!1){return e&&"partlycloudy"===t?"M22,10.28C21.74,10.3 21.5,10.31 21.26,10.31C19.32,10.31 17.39,9.57 15.91,8.09C14.25,6.44 13.5,4.19 13.72,2C13.77,1.53 13.22,1 12.71,1C12.57,1 12.44,1.04 12.32,1.12C12,1.36 11.66,1.64 11.36,1.94C9.05,4.24 8.55,7.66 9.84,10.46C8.31,11.11 7.13,12.43 6.69,14.06L6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22H19A3,3 0 0,0 22,19A3,3 0 0,0 19,16C18.42,16 17.88,16.16 17.42,16.45L17.5,15.5C17.5,15.28 17.5,15.05 17.46,14.83C19.14,14.67 20.77,13.94 22.06,12.64C22.38,12.34 22.64,12 22.88,11.68C23.27,11.13 22.65,10.28 22.04,10.28M19,18A1,1 0 0,1 20,19A1,1 0 0,1 19,20H6A2,2 0 0,1 4,18A2,2 0 0,1 6,16H8.5V15.5C8.5,13.94 9.53,12.64 10.94,12.18C11.1,12.13 11.26,12.09 11.43,12.06C11.61,12.03 11.8,12 12,12C12.23,12 12.45,12.03 12.66,12.07C12.73,12.08 12.8,12.1 12.87,12.13C13,12.16 13.15,12.2 13.28,12.25C13.36,12.28 13.44,12.32 13.5,12.36C13.63,12.41 13.74,12.47 13.84,12.54C13.92,12.59 14,12.64 14.07,12.7C14.17,12.77 14.25,12.84 14.34,12.92C14.41,13 14.5,13.05 14.55,13.12C14.63,13.2 14.69,13.29 14.76,13.37C14.82,13.45 14.89,13.53 14.94,13.62C15,13.71 15.04,13.8 15.09,13.9C15.14,14 15.2,14.08 15.24,14.18C15.41,14.59 15.5,15.03 15.5,15.5V18M16.83,12.86C15.9,11.16 14.08,10 12,10H11.87C11.41,9.19 11.14,8.26 11.14,7.29C11.14,6.31 11.39,5.37 11.86,4.55C12.21,6.41 13.12,8.14 14.5,9.5C15.86,10.88 17.58,11.79 19.45,12.14C18.66,12.6 17.76,12.84 16.83,12.86Z":e&&"sunny"===t?Je:Na[t??""]??Qe}function Ua(t){const e=t.config.home.weather;return e&&t.hass.states[e]?e:Object.keys(t.hass.states).find(e=>e.startsWith("weather.")&&"unavailable"!==t.hass.states[e].state)}const Ba=t=>"below_horizon"===t.states["sun.sun"]?.state;let qa=class extends ct{constructor(){super(...arguments),this.days=[]}connectedCallback(){super.connectedCallback(),this.unsub=this.ctx.hass.connection.subscribeMessage(t=>this.days=(t.forecast??[]).slice(0,5),{type:"weather/subscribe_forecast",entity_id:this.entity,forecast_type:"daily"}).catch(()=>()=>{})}disconnectedCallback(){super.disconnectedCallback(),this.unsub?.then(t=>t()),this.unsub=void 0}render(){const{hass:t,t:e,lang:s}=this.ctx,i=t.states[this.entity];if(!i)return K;const o=i.attributes,a=o.temperature_unit??"°";return U`
      <div class="now">
        <span class="big-icon">${js(Wa(i.state,Ba(t)),64)}</span>
        <div>
          <div class="temp">${Math.round(o.temperature)}<small>${a.replace(/[CF]$/,"")}</small></div>
          <div class="cond">${e(`w_${i.state}`)}</div>
        </div>
        <div class="extra">
          ${void 0!==o.humidity?U`<span>${js(Xe,16)}${Math.round(o.humidity)}%</span>`:K}
          ${void 0!==o.wind_speed?U`<span>${js(ts,16)}${Math.round(o.wind_speed)} ${o.wind_speed_unit??""}</span>`:K}
        </div>
      </div>
      <div class="days">
        ${this.days.map(t=>U`<div class="day">
            <span class="dname">${new Date(t.datetime).toLocaleDateString(s,{weekday:"short"})}</span>
            ${js(Wa(t.condition),30)}
            <b>${void 0!==t.temperature?Math.round(t.temperature):"–"}°</b>
            <span class="low">${void 0!==t.templow?`${Math.round(t.templow)}°`:""}</span>
            ${t.precipitation_probability?U`<span class="rain">${t.precipitation_probability}%</span>`:K}
          </div>`)}
      </div>
    `}};qa.styles=[Bs,n`
      :host {
        display: grid;
        gap: 22px;
      }
      .now {
        display: flex;
        align-items: center;
        gap: 18px;
        flex-wrap: wrap;
      }
      .big-icon {
        color: #ffd27a;
        filter: drop-shadow(0 0 18px rgba(255, 200, 100, 0.4));
      }
      .temp {
        font-size: 56px;
        font-weight: 300;
        line-height: 1;
      }
      .temp small {
        font-size: 24px;
        vertical-align: top;
      }
      .cond {
        color: var(--sn-text-dim);
        font-size: 15px;
      }
      .extra {
        display: grid;
        gap: 6px;
        margin-inline-start: auto;
        color: var(--sn-text-dim);
        font-size: 14px;
      }
      .extra span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .days {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
      }
      .day {
        display: grid;
        justify-items: center;
        gap: 6px;
        padding: 14px 6px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid var(--sn-glass-border);
        font-size: 13px;
      }
      .dname {
        color: var(--sn-text-dim);
      }
      .day b {
        font-size: 18px;
        font-weight: 500;
      }
      .low {
        color: var(--sn-text-dim);
      }
      .rain {
        color: #8fc4ff;
        font-size: 12px;
      }
    `],Ia([gt({attribute:!1})],qa.prototype,"ctx",2),Ia([gt()],qa.prototype,"entity",2),Ia([mt()],qa.prototype,"days",2),qa=Ia([pt("sn-weather-view")],qa);var Ka=Object.defineProperty,Ya=Object.getOwnPropertyDescriptor,Ga=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Ya(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Ka(e,s,a),a};let Xa=class extends ct{constructor(){super(...arguments),this.phone=!1,this.full=!1,this.dragY=0,this.down=t=>{this.phone&&(this.startY=t.clientY,t.currentTarget.setPointerCapture(t.pointerId))},this.move=t=>{void 0!==this.startY&&(this.dragY=t.clientY-this.startY)},this.up=()=>{if(void 0===this.startY)return;const t=this.dragY;this.startY=void 0,this.dragY=0,t<-60?this.full=!0:t>80&&(this.full&&this.spec?.half?this.full=!1:this.close())}}willUpdate(t){t.has("spec")&&(this.full=!1)}close(){this.dispatchEvent(new CustomEvent("close"))}render(){const t=this.spec;if(!t)return K;const e=this.phone&&t.half&&!this.full;return U`
      <div class="scrim" @click=${this.close}></div>
      <section
        class="panel glass ${e?"half":""} ${t.wide?"wide":""} ${t.medium?"medium":""}"
        role="dialog"
        aria-label=${t.title}
        style=${this.dragY?`transform: translateY(${Math.max(this.dragY,-80)}px); transition: none`:""}
      >
        <header @pointerdown=${this.down} @pointermove=${this.move} @pointerup=${this.up} @pointercancel=${this.up}>
          ${this.phone?U`<div class="grab"></div>`:K}
          ${t.icon?U`<span class="hicon">${js(t.icon,22)}</span>`:K}
          <div class="titles">
            <h2>${t.titleFor?.(this.ctx)??t.title}</h2>
            ${t.subtitle?U`<span class="subtitle">${t.subtitle}</span>`:K}
          </div>
          <button class="round" aria-label="close" @click=${this.close}>${js(Et)}</button>
        </header>
        <div class="body">${t.render(this.ctx)}</div>
      </section>
    `}};Xa.styles=[Bs,qs,n`
      :host {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: grid;
        place-items: center;
        pointer-events: none;
      }
      .scrim {
        position: absolute;
        inset: 0;
        background: rgba(20, 16, 12, 0.42);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        pointer-events: auto;
        animation: fade 0.2s ease;
      }
      .panel {
        position: relative;
        width: min(560px, calc(100vw - 32px));
        max-height: min(80vh, 760px);
        display: flex;
        flex-direction: column;
        pointer-events: auto;
        background: var(--sn-glass-strong);
        animation: pop 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.1);
      }
      :host([phone]) {
        place-items: end stretch;
      }
      :host([phone]) .panel {
        width: 100%;
        max-height: calc(100vh - 40px - env(safe-area-inset-top));
        height: calc(100vh - 40px - env(safe-area-inset-top));
        border-radius: 28px 28px 0 0;
        padding-bottom: env(safe-area-inset-bottom);
        transition: height 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), transform 0.25s ease;
        animation: rise 0.32s cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      :host([phone]) .panel:not(.half) {
        height: auto;
      }
      :host([phone]) .panel.half {
        height: 55vh;
      }
      header {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 18px 18px 8px 22px;
        touch-action: none;
      }
      .grab {
        position: absolute;
        top: 7px;
        left: 50%;
        width: 40px;
        height: 5px;
        margin-left: -20px;
        border-radius: 3px;
        background: var(--sn-text-faint);
      }
      .titles {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .subtitle {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .hicon {
        display: grid;
        place-items: center;
        flex: none;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--sn-glass-border);
        color: var(--sn-accent);
      }
      .panel.medium {
        width: min(760px, calc(100vw - 48px));
      }
      .panel.wide {
        width: min(980px, calc(100vw - 48px));
        max-height: min(90vh, 900px);
      }
      .more-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
      .more-grid button {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 16px 6px;
        border-radius: 20px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.07);
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .more-grid button.on {
        background: rgba(181, 220, 143, 0.22);
        border-color: rgba(181, 220, 143, 0.6);
      }
      .body {
        overflow: auto;
        padding: 8px 22px 22px;
        overscroll-behavior: contain;
      }
      @keyframes fade {
        from {
          opacity: 0;
        }
      }
      @keyframes pop {
        from {
          opacity: 0;
          transform: scale(0.96) translateY(8px);
        }
      }
      @keyframes rise {
        from {
          transform: translateY(100%);
        }
      }
    `],Ga([gt({attribute:!1})],Xa.prototype,"spec",2),Ga([gt({type:Boolean,reflect:!0})],Xa.prototype,"phone",2),Ga([mt()],Xa.prototype,"full",2),Ga([mt()],Xa.prototype,"dragY",2),Ga([gt({attribute:!1})],Xa.prototype,"ctx",2),Xa=Ga([pt("sn-sheet")],Xa);var Ja=Object.defineProperty,Qa=Object.getOwnPropertyDescriptor,tr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Qa(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Ja(e,s,a),a};let er=class extends ct{constructor(){super(...arguments),this.pin="",this.wrongLabel="",this.typed="",this.wrong=!1,this.key=t=>{/^[0-9]$/.test(t.key)?this.press(t.key):"Backspace"===t.key?this.press("del"):"Enter"===t.key&&this.press("ok")}}press(t){this.wrong=!1,"del"===t?this.typed=this.typed.slice(0,-1):"ok"===t?this.check():this.typed.length<8&&(this.typed+=t,this.typed===this.pin&&this.check())}check(){this.typed!==this.pin?(this.wrong=!0,this.typed=""):this.dispatchEvent(new CustomEvent("ok"))}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.key)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.key)}render(){const t=Math.max(4,this.pin.length,this.typed.length);return U`
      <div class="dots ${this.wrong?"shake":""}">
        ${Array.from({length:t},(t,e)=>U`<span class=${e<this.typed.length?"on":""}></span>`)}
      </div>
      <div class="msg">${this.wrong?this.wrongLabel:""}</div>
      <div class="pad" dir="ltr">
        ${["1","2","3","4","5","6","7","8","9"].map(t=>U`<button @click=${()=>this.press(t)}>${t}</button>`)}
        <button class="fn" aria-label="⌫" @click=${()=>this.press("del")}>${js(Ct,22)}</button>
        <button @click=${()=>this.press("0")}>0</button>
        <button class="fn" aria-label="OK" @click=${()=>this.press("ok")}>${js(Pt,22)}</button>
      </div>
    `}};er.styles=[Bs,n`
      :host {
        display: grid;
        justify-items: center;
        gap: 10px;
        padding: 6px 0 4px;
      }
      .dots {
        display: flex;
        gap: 14px;
        height: 18px;
        align-items: center;
      }
      .dots span {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid var(--sn-text-dim);
        transition: background 0.15s ease, transform 0.15s ease;
      }
      .dots span.on {
        background: var(--sn-text);
        border-color: var(--sn-text);
        transform: scale(1.1);
      }
      .shake {
        animation: shake 0.4s ease;
      }
      @keyframes shake {
        20%,
        60% {
          transform: translateX(-8px);
        }
        40%,
        80% {
          transform: translateX(8px);
        }
      }
      .msg {
        min-height: 18px;
        font-size: 13px;
        color: #ff8a80;
      }
      .pad {
        display: grid;
        grid-template-columns: repeat(3, 72px);
        gap: 14px;
      }
      .pad button {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        border: 0;
        background: rgba(255, 255, 255, 0.1);
        color: var(--sn-text);
        font-size: 26px;
        font-weight: 300;
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: background 0.12s ease, transform 0.12s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .pad button:active {
        background: rgba(255, 255, 255, 0.28);
        transform: scale(0.94);
      }
      .pad button.fn {
        background: none;
      }
    `],tr([gt()],er.prototype,"pin",2),tr([gt()],er.prototype,"wrongLabel",2),tr([mt()],er.prototype,"typed",2),tr([mt()],er.prototype,"wrong",2),er=tr([pt("sn-pin-pad")],er);var sr=Object.defineProperty,ir=Object.getOwnPropertyDescriptor,or=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?ir(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&sr(e,s,a),a};let ar=class extends ct{constructor(){super(...arguments),this.now=new Date,this.drift={x:0,y:0},this.wake=t=>{t.preventDefault(),t.stopPropagation(),this.dispatchEvent(new CustomEvent("wake"))}}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>{this.now=new Date,this.now.getSeconds()<2&&(this.drift={x:16*(Math.random()-.5),y:14*(Math.random()-.5)})},1e3)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.timer)}render(){const{hass:t,lang:e,t:s}=this.ctx,i=Ua(this.ctx),o=i?t.states[i]:void 0,a=Object.keys(t.states).filter(e=>e.startsWith("person.")&&"home"===t.states[e].state),r=this.now.getHours();return U`<div
      class="saver ${r>=22||r<6?"night":""}"
      @click=${this.wake}
    >
      <div class="content" style="transform: translate(${this.drift.x}vw, ${this.drift.y}vh)">
        <div class="clock">${this.now.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}</div>
        <div class="date">${this.now.toLocaleDateString(e,{weekday:"long",day:"numeric",month:"long"})}</div>
        ${o&&"number"==typeof o.attributes.temperature?U`<div class="weather">
              ${js(Wa(o.state,Ba(t)),34)}
              <b>${Math.round(o.attributes.temperature)}°</b>
              <span>${s(`w_${o.state}`)}</span>
            </div>`:K}
        <div class="people">
          ${a.length?a.map(e=>{const s=t.states[e].attributes.entity_picture,i=ps(t,e);return U`<div class="person">
                  ${s?U`<img src=${s} alt="" />`:U`<span class="initial">${i.slice(0,1)}</span>`}
                  <small>${i.split(" ")[0]}</small>
                </div>`}):U`<small class="nobody">${s("nobody_home")}</small>`}
        </div>
      </div>
    </div>`}};ar.styles=n`
    :host {
      position: fixed;
      inset: 0;
      z-index: 50;
      animation: fade 0.8s ease;
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    .saver {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: radial-gradient(circle at 50% 40%, #1d1a17, #050404 70%);
      color: #f4efe8;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
      transition: opacity 1s ease;
    }
    .saver.night .content {
      opacity: 0.45;
    }
    .content {
      display: grid;
      justify-items: center;
      gap: 14px;
      transition: transform 3s ease, opacity 1s ease;
    }
    .clock {
      font-size: clamp(90px, 18vw, 220px);
      font-weight: 200;
      letter-spacing: -0.02em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .date {
      font-size: clamp(18px, 2.4vw, 28px);
      opacity: 0.7;
    }
    .weather {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-top: 10px;
      font-size: 20px;
      color: #ffd27a;
    }
    .weather b {
      color: #f4efe8;
      font-weight: 400;
      font-size: 30px;
    }
    .weather span {
      color: #f4efe8;
      opacity: 0.7;
    }
    .people {
      display: flex;
      gap: 18px;
      margin-top: 22px;
    }
    .person {
      display: grid;
      justify-items: center;
      gap: 6px;
      font-size: 13px;
      opacity: 0.85;
    }
    .person img,
    .initial {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(181, 220, 143, 0.7);
      box-shadow: 0 0 18px rgba(181, 220, 143, 0.25);
    }
    .initial {
      display: grid;
      place-items: center;
      background: #2a2622;
      font-size: 22px;
    }
    .nobody {
      opacity: 0.6;
    }
  `,or([gt({attribute:!1})],ar.prototype,"ctx",2),or([mt()],ar.prototype,"now",2),or([mt()],ar.prototype,"drift",2),ar=or([pt("sn-screensaver")],ar);var rr=Object.defineProperty,nr=Object.getOwnPropertyDescriptor,lr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?nr(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&rr(e,s,a),a};let cr=class extends ct{constructor(){super(...arguments),this.requestVersion=0}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.refresh(!0),6e5)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.timer),this.requestVersion++}updated(){this.refresh(!1)}async refresh(t){const e=this.ctx?.config.home.energy,s=e+(new Date).toDateString();if(!e)return this.hours=void 0,void(this.loadedFor=void 0);if(!t&&this.loadedFor===s)return;this.loadedFor=s;const i=++this.requestVersion;try{const t=await async function(t,e){const s=new Date;s.setHours(0,0,0,0),s.setDate(s.getDate()-1);const i=await t.hass.callWS({type:"recorder/statistics_during_period",start_time:s.toISOString(),end_time:(new Date).toISOString(),statistic_ids:[e],period:"hour",types:["change"],units:{energy:"kWh"}}),o=new Array(24).fill(null),a=new Array(24).fill(null),r=new Date;r.setHours(0,0,0,0);const n=r.getTime();for(const l of i[e]??[]){const t="number"==typeof l.start?l.start:Date.parse(l.start);if(!Number.isFinite(t)||"number"!=typeof l.change||!Number.isFinite(l.change))continue;const e=new Date(t).getHours(),s=t>=n?o:a;s[e]=(s[e]??0)+l.change}return{today:o,yesterday:a}}(this.ctx,e);i===this.requestVersion&&this.isConnected&&(this.hours=t)}catch{i===this.requestVersion&&this.isConnected&&(this.hours=void 0)}}chart(t,e){const s=(new Date).getHours(),i=110,o=Math.max(.1,...t.filter(t=>null!==t),...e.filter(t=>null!==t)),a=t=>t/24*300,r=t=>96-t/o*80,n=(t,e)=>{let s="",i=!1;for(let o=0;o<=e&&o<24;o++){const e=t[o];null!==e?(s+=`${i?"L":"M"}${a(o)},${r(e)} L${a(o+1)},${r(e)} `,i=!0):i=!1}return s},l=t.map((t,e)=>[t,e]).filter(t=>null!==t[0]&&t[1]<=s).sort((t,e)=>e[0]-t[0]).slice(0,2).filter(([t])=>t>0).map(([,t])=>t);return B`
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="6" height="6" fill="rgba(181,220,143,0.12)"></rect>
          <line x1="0" y1="0" x2="0" y2="6" stroke="#b5dc8f" stroke-width="2.4"></line>
        </pattern>
        <linearGradient id="fadeHatch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="1"></stop>
          <stop offset="1" stop-color="#fff" stop-opacity="0.15"></stop>
        </linearGradient>
        <mask id="m"><rect width="${300}" height="${i}" fill="url(#fadeHatch)"></rect></mask>
      </defs>
      ${l.map(e=>B`<g mask="url(#m)"><rect x=${a(e)} y=${r(t[e])} width=${12.5} height=${96-r(t[e])} fill="url(#hatch)"></rect></g>
          <circle cx=${a(e)} cy=${r(t[e])} r="2.4" fill="#d9f2bf"></circle>
          <circle cx=${a(e+1)} cy=${r(t[e])} r="2.4" fill="#d9f2bf"></circle>`)}
      <path d=${n(e,23)} fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"></path>
      <path d=${n(t,s)} fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.4" stroke-dasharray="2.5 3"></path>
      ${t.slice(0,s+1).map((t,e)=>e%3==0&&null!==t?B`<circle cx=${a(e)} cy=${r(t)} r="2" fill="#e8e8e8"></circle>`:K)}
    `}render(){const{t:t,config:e,editing:s}=this.ctx,i=e.home.energy,o=this.hours,a=(new Date).getHours(),r=o?.today.filter(t=>null!==t),n=r?.length?r.reduce((t,e)=>t+e,0):void 0,l=o?.today.slice(0,a),c=o?.yesterday.slice(0,a),d=a>0&&l?.every(t=>null!==t)&&c?.every(t=>null!==t),p=l?.reduce((t,e)=>t+(e??0),0),h=c?.reduce((t,e)=>t+(e??0),0),u=d&&h&&void 0!==p?Math.round((p-h)/h*100):void 0,g=e.experience,m="number"==typeof g?.tariff&&Number.isFinite(g.tariff)&&g.tariff>=0?g.tariff:void 0,f=g?.power_entity,b=f?ms(this.ctx.hass.states[f]):void 0,x=void 0!==b&&void 0!==m?Math.max(0,b)*m:void 0,v="ar"===this.ctx.lang;return U`
      <div class="card">
        <div class="head">
          <span class="badge">${js(Ve,22)}</span>
          <div>
            <h3>${t("energy_usage")}</h3>
            ${void 0!==u?U`<span class="delta ${u>0?"up":""}"
                  ><span class="dot">${js(u>0?"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z":"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",14)}</span>${t("vs_yesterday",{pct:u>0?`+${u}`:u})}</span
                >`:K}
          </div>
          ${s?U`<button class="round gear" aria-label=${t("settings")} @click=${()=>vi(this.ctx)}>${js(Ot,18)}</button>`:K}
        </div>
        ${i?U`
              <div class="value">${void 0!==n?n.toFixed(1):"–"}<small>kWh</small></div>
              ${o&&void 0!==n?U`<svg class="chart" viewBox="0 0 300 110" preserveAspectRatio="none">${this.chart(o.today,o.yesterday)}</svg>
                    <div class="axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>`:U`<div class="empty">${v?"ما في بيانات إحصائية متاحة. تأكد من إعداد عداد الطاقة وRecorder.":"No recorded statistics are available. Check your energy meter and Recorder."}</div>`}
              ${void 0!==u?U`<p class="cost-note">${v?"المقارنة للساعات المكتملة نفسها من اليومين.":"Comparison uses matching completed hours in both days."}</p>`:K}
              ${void 0!==x?U`<p class="cost-note">${v?"التكلفة التقديرية بالمعدل الحالي":"Estimated cost at the current rate"}: <b>${x.toFixed(2)} ${g?.currency||(v?"عملة":"currency")}/${v?"ساعة":"hour"}</b></p>`:K}
            `:U`<div class="empty">${t("no_energy")}</div>`}
      </div>
    `}};cr.styles=[Bs,n`
      :host {
        display: block;
      }
      .card {
        height: 100%;
        padding: 22px 22px 18px;
        border-radius: 34px;
        background: var(--sn-ink);
        color: #f5f5f5;
        box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.6);
      }
      .head {
        display: flex;
        gap: 14px;
        align-items: flex-start;
      }
      .head > div {
        flex: 1;
        display: grid;
        gap: 6px;
      }
      .badge {
        display: grid;
        place-items: center;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: #1e1e1e;
      }
      h3 {
        margin: 4px 0 0;
        font-weight: 400;
        font-size: 21px;
      }
      .delta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        width: max-content;
        padding: 3px 12px 3px 3px;
        border-radius: 999px;
        background: #1c1c1c;
        font-size: 12px;
        color: #cfcfcf;
      }
      .delta .dot {
        display: grid;
        place-items: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #34452a;
        color: var(--sn-accent);
      }
      .delta.up .dot {
        background: #4a2f26;
        color: #f2a487;
      }
      .value {
        margin: 18px 0 8px;
        font-size: 52px;
        font-weight: 300;
        letter-spacing: -0.03em;
        line-height: 1;
      }
      .value small {
        font-size: 15px;
        letter-spacing: 0;
        margin-inline-start: 2px;
      }
      .chart {
        display: block;
        width: 100%;
        height: 110px;
        direction: ltr;
      }
      .axis {
        display: flex;
        justify-content: space-between;
        direction: ltr;
        font-size: 11px;
        color: #8c8c8c;
      }
      .cost-note { font-size: 11px; line-height: 1.8; color: #bdbdbd; margin: 9px 0 0; }
      .empty {
        color: #7d7d7d;
      }
      .round {
        border-color: #2a2a2a;
        background: #1c1c1c;
        color: #eee;
      }
    `],lr([gt({attribute:!1})],cr.prototype,"ctx",2),lr([mt()],cr.prototype,"hours",2),cr=lr([pt("sn-energy-card")],cr);var dr=Object.defineProperty,pr=Object.getOwnPropertyDescriptor,hr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?pr(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&dr(e,s,a),a};let ur=class extends ct{constructor(){super(...arguments),this.bare=!1}nudge(t,e){const s=this.ctx.hass.states[t],{target:i,min:o,max:a,step:r}=Cs(s),n=this.pending??i??22;this.pending=Math.min(a,Math.max(o,Math.round(10*(n+e*r))/10)),this.requestUpdate(),clearTimeout(this.sendTimer),this.sendTimer=window.setTimeout(()=>{void 0!==this.pending&&_s(this.ctx.hass,t,this.pending),setTimeout(()=>{this.pending=void 0,this.requestUpdate()},1500)},600)}zonal(t){const{t:e,hass:s,editing:i}=this.ctx,o=s.states[t],{target:a,min:r,max:n}=Cs(o),l=this.pending??a,c=void 0!==l?(l-r)/(n-r):0,d="off"===o?.state,p=Array.from({length:65},(t,e)=>{const s=Math.PI+e/64*Math.PI,i=160+140*Math.cos(s),o=120+90*Math.sin(s),a=160+128*Math.cos(s),r=120+80*Math.sin(s),n=e/64,l=!d&&Math.abs(n-c)<.18;return B`<line x1=${i} y1=${o} x2=${a} y2=${r} stroke=${l?"#e9f6dc":"rgba(255,255,255,0.35)"} stroke-width=${l?1.6:1} stroke-linecap="round"></line>`}),h=160+134*Math.cos(Math.PI+c*Math.PI);return U`<div class="zone">
      <div class="zone-head">
        <span>${e("zonal_climate")}</span>
        <button
          class="round light"
          aria-label=${e("settings")}
          @click=${()=>i&&this.area?yi(this.ctx,this.area):this.ctx.openEntity(t)}
        >
          ${js(i?Ot:Ue,18)}
        </button>
      </div>
      <div class="arc">
        <svg viewBox="0 0 320 150">
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"></feGaussianBlur></filter>
          </defs>
          ${d?K:B`<ellipse cx=${h} cy="44" rx="58" ry="16" fill="#b5dc8f" opacity="0.75" filter="url(#blur)"></ellipse>`}
          ${p}
        </svg>
        <button class="round pm minus" aria-label="-" @click=${()=>this.nudge(t,-1)}>${js("M19,13H5V11H19V13Z")}</button>
        <button class="round pm plus" aria-label="+" @click=${()=>this.nudge(t,1)}>${js(xe)}</button>
        <div class="temp">${void 0!==l?l.toFixed(1):"–"}<small>°C</small></div>
      </div>
    </div>`}node(t){const e=this.ctx.hass.states[t],s=hs(e),i=e?.attributes.entity_picture,o=ii(t,e),a=this.area,r=U`<div class="node ${s?"on":""}">
      <button
        class="pic"
        @click=${()=>this.ctx.openEntity(t)}
        @pointerdown=${e=>o&&ti(e,()=>this.ctx.openLevel(t))}
        @contextmenu=${si}
      >
        ${i?U`<img src=${i} alt="" loading="lazy" />`:js(Ts(t,e),40)}
      </button>
      <span class="nname">${ps(this.ctx.hass,t)}</span>
      <button class="switch" ?on=${s} ?disabled=${us(e)} aria-pressed=${s} @click=${()=>ws(this.ctx.hass,t)}></button>
    </div>`;return this.ctx.editing?U`<div class="hideable">
      ${r}
      <button
        class="hide-x"
        aria-label=${this.ctx.t("hide")}
        @click=${()=>this.ctx.update(e=>{const s=e.rooms[a]??={};s.hidden=[...s.hidden??[],t]})}
      >
        ${js(Et,16)}
      </button>
    </div>`:r}renameRoom(t){const e=this.ctx;e.showSheet({title:e.t("room_settings"),render:e=>{const s=(e.config.pages.rooms?.hidden??[]).includes(t);return U`
          ${Qs(e.t("room_name"),e.config.rooms[t]?.name??"",s=>e.saveLayout(e=>{(e.rooms[t]??={}).name=s.trim()||void 0}))}
          <label class="check">
            <input type="checkbox" .checked=${s} @change=${s=>{const i=s.target.checked;e.saveLayout(e=>{const s=e.pages.rooms??={},o=(s.hidden??[]).filter(e=>e!==t);s.hidden=i?[...o,t]:o}),i&&e.closeSheet()}} />
            ${e.t("hide_room")}
          </label>
        `}})}render(){const{t:t,hass:e,config:s,editing:i}=this.ctx,o=this.area;if(!o||!e.areas?.[o])return U`<div class="wrap glass"><div class="empty">${t("no_rooms")}</div></div>`;const a=$s(e,o,s.rooms[o]),r=void 0!==a.people?a.people>0?t("taken_people",{n:a.people}):t("free"):void 0!==a.occupied?a.occupied?t("taken"):t("free"):void 0;return U`<div class="wrap ${this.bare?"":"glass"}">
      <div class="top">
        ${this.bare?U`<span class="spacer"></span>`:U`<span class="round">${js(Rt,20)}</span>${this.ctx.isAdmin?U`<h2><button class="name-btn" title=${t("rename")} @click=${()=>this.renameRoom(o)}>${a.name}</button></h2>`:U`<h2>${a.name}</h2>`}`}
        <div class="meta">
          <span class="chip small">ID: ${o}</span>
          ${a.size?U`<span class="chip small">${a.size} m²</span>`:K}
        </div>
        ${i&&!this.bare?U`<button class="round gear" aria-label=${t("room_settings")} @click=${()=>yi(this.ctx,o)}>${js(Ot,18)}</button>`:K}
      </div>
      <div class="chips">
        ${void 0!==a.temperature?U`<span class="chip"><span class="ic">${js(Ie,14)}</span>${a.temperature.toFixed(1)} °C</span>`:K}
        ${r?U`<span class="chip"><span class="ic">${js(yt,14)}</span>${r}</span>`:K}
        ${void 0!==a.humidity?U`<span class="chip"><span class="ic">${js(Ge,14)}</span>${t("humidity",{h:Math.round(a.humidity)})}</span>`:K}
      </div>
      <div class="scroll">
        ${a.climate?this.zonal(a.climate):U`<div class="zone"><div class="empty">${t("no_climate")}</div></div>`}
        <div class="nodes">
          <div class="nodes-head">${t("nodes_in_room")}</div>
          ${a.nodes.length?U`<div class="grid">${a.nodes.map(t=>this.node(t))}</div>`:U`<div class="empty">${t("no_nodes")}</div>`}
        </div>
      </div>
    </div>`}};ur.styles=[Bs,n`
      :host {
        display: block;
        min-width: 0;
        min-height: 0;
      }
      /*
       * The glass card is the fixed frame; only .scroll moves inside it. Scrolling the glass card itself cut its
       * rounded top off and showed a scrollbar, which looked like a loose layer over the AC and devices.
       */
      .wrap {
        height: 100%;
        max-height: 100%;
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: var(--sn-glass-light);
        overflow: hidden;
      }
      .scroll {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin: 0 -18px -18px;
        padding: 0 18px 18px;
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-width: none;
        -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 10px, #000 calc(100% - 28px), transparent 100%);
        mask-image: linear-gradient(to bottom, transparent 0, #000 10px, #000 calc(100% - 28px), transparent 100%);
      }
      .scroll::-webkit-scrollbar {
        display: none;
      }
      :host([bare]) .scroll {
        margin: 0;
        padding: 0;
        overflow: visible;
        -webkit-mask-image: none;
        mask-image: none;
      }
      :host([bare]) .wrap {
        overflow: visible;
      }
      :host([bare]) .wrap {
        padding: 0;
        background: none;
      }
      .top {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .name-btn {
        all: unset;
        cursor: pointer;
        border-bottom: 1px dashed transparent;
      }
      .name-btn:hover {
        border-bottom-color: currentColor;
      }
      h2 {
        flex: 1;
        margin: 0;
        font-size: 22px;
        font-weight: 400;
        white-space: nowrap;
      }
      .spacer {
        flex: 1;
      }
      .meta {
        display: flex;
        gap: 6px;
        order: 3;
      }
      .chip.small {
        height: 28px;
        padding: 0 10px;
        font-size: 11px;
        color: var(--sn-text-dim);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .zone {
        padding: 16px;
        border-radius: 24px;
        background: linear-gradient(160deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.12));
        border: 1px solid var(--sn-glass-border);
      }
      .zone-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: var(--sn-text-dim);
      }
      .arc {
        position: relative;
        margin-top: 4px;
      }
      .arc svg {
        display: block;
        width: 100%;
        direction: ltr;
      }
      .pm {
        position: absolute;
        top: 46%;
        width: 48px;
        height: 48px;
        background: rgba(40, 36, 32, 0.75);
        color: #fff;
      }
      .plus {
        left: 0;
      }
      .minus {
        right: 0;
      }
      .temp {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 4%;
        text-align: center;
        font-size: 50px;
        font-weight: 300;
        letter-spacing: -0.03em;
        direction: ltr;
        /* Sits over the + and − buttons' row; taps must reach them. */
        pointer-events: none;
      }
      .temp small {
        font-size: 20px;
      }
      .nodes {
        padding: 16px;
        border-radius: 24px;
        background: rgba(0, 0, 0, 0.12);
        border: 1px solid var(--sn-glass-border);
      }
      .nodes-head {
        font-size: 14px;
        color: var(--sn-text-dim);
        margin-bottom: 12px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
        gap: 10px;
      }
      .node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 10px 8px 12px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid var(--sn-glass-border);
        text-align: center;
      }
      .node.on {
        background: rgba(255, 255, 255, 0.12);
      }
      .pic {
        all: unset;
        -webkit-touch-callout: none;
        user-select: none;
        cursor: pointer;
        display: grid;
        place-items: center;
        width: 100%;
        height: 72px;
        color: var(--sn-text-dim);
      }
      .node.on .pic {
        color: var(--sn-accent);
      }
      .pic img {
        max-width: 100%;
        max-height: 72px;
        object-fit: contain;
        border-radius: 10px;
      }
      .nname {
        font-size: 12px;
        line-height: 1.25;
        min-height: 2.5em;
      }
    `],hr([gt({attribute:!1})],ur.prototype,"ctx",2),hr([gt()],ur.prototype,"area",2),hr([gt({type:Boolean,reflect:!0})],ur.prototype,"bare",2),ur=hr([pt("sn-room-panel")],ur);var gr=Object.defineProperty,mr=Object.getOwnPropertyDescriptor,fr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?mr(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&gr(e,s,a),a};let br=class extends ct{run(t){ws(this.ctx.hass,t),this.fired=t,setTimeout(()=>this.fired=void 0,1400)}render(){const{config:t,hass:e,editing:s,t:i}=this.ctx,o=t.home.scenes.filter(t=>e.states[t]);return o.length||s?U`<div class="bar">
      ${o.map(t=>{e.states[t].attributes.icon;return U`<button class="scene ${this.fired===t?"fired":""}" @click=${()=>this.run(t)} title=${ps(e,t)}>
          <span class="dot">${js(be,14)}</span>
          <span class="name">${ps(e,t)}</span>
          ${cs(t),K}
        </button>`})}
      ${s?U`<button class="gear" aria-label=${i("scene_buttons")} title=${i("scene_buttons")} @click=${()=>{var t;(t=this.ctx).showSheet({title:t.t("scenes"),render:t=>Gs(t,t.t("scene_buttons"),t.config.home.scenes,Ks(t,["scene","script"]),e=>t.update(t=>t.home.scenes=e))})}}>
            ${js(o.length?Ot:xe,18)}${o.length?K:U`<span class="name">${i("scene_buttons")}</span>`}
          </button>`:K}
    </div>`:K}};br.styles=[Bs,n`
      :host {
        display: block;
        min-width: 0;
      }
      .bar {
        display: flex;
        gap: 6px;
        padding: 6px;
        max-width: 100%;
        overflow-x: auto;
        scrollbar-width: none;
        border-radius: 999px;
        background: var(--sn-glass);
        border: 1px solid var(--sn-glass-border);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        box-shadow: var(--sn-shadow), inset 0 1px 0 var(--sn-glass-hi);
      }
      .bar::-webkit-scrollbar {
        display: none;
      }
      .scene,
      .gear {
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 42px;
        padding: 0 16px 0 5px;
        border-radius: 999px;
        border: 0;
        background: transparent;
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.15s ease;
      }
      .scene:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .scene:active {
        transform: scale(0.96);
      }
      .dot {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        transition: background 0.3s ease, box-shadow 0.3s ease;
      }
      .scene.fired {
        background: color-mix(in srgb, var(--sn-accent) 25%, transparent);
      }
      .scene.fired .dot {
        background: var(--sn-accent);
        color: #1d1b30;
        box-shadow: 0 0 16px var(--sn-accent-glow);
      }
      .gear {
        padding: 0 12px;
        background: rgba(255, 255, 255, 0.08);
      }
      .name {
        white-space: nowrap;
      }
    `],fr([gt({attribute:!1})],br.prototype,"ctx",2),fr([mt()],br.prototype,"fired",2),br=fr([pt("sn-scene-bar")],br);const xr=(t,e=[],s)=>U`<header class="page-head">
    <h1>${t}</h1>
    <div class="page-chips">${e.filter(Boolean).map(t=>U`<span class="page-chip">${t}</span>`)}</div>
    <div class="page-actions">${s??K}</div>
  </header>`,vr=n`
  :host {
    display: block;
  }
  .page-head {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px 16px;
    margin-bottom: 20px;
    color: var(--sn-text-on-bg);
  }
  h1 {
    margin: 0;
    font-size: 34px;
    font-weight: 400;
    letter-spacing: -0.02em;
  }
  .page-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .page-chips {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .page-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: var(--sn-blur);
    -webkit-backdrop-filter: var(--sn-blur);
    font-size: 13px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--min, 300px), 1fr));
    gap: 16px;
    align-items: start;
  }
  .section {
    margin: 26px 0 12px;
    font-size: 15px;
    font-weight: 500;
    color: var(--sn-text-on-bg-dim);
  }
  .card {
    padding: 18px 20px;
  }
  .action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 42px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.16);
    color: var(--sn-text-on-bg);
    font-size: 14px;
    cursor: pointer;
    backdrop-filter: var(--sn-blur);
    -webkit-backdrop-filter: var(--sn-blur);
  }
  .action.primary {
    background: var(--sn-accent);
    color: #1d2a12;
    border-color: transparent;
  }
  .bar {
    position: relative;
    height: 8px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
  .bar > span {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    border-radius: 99px;
    background: var(--sn-accent);
  }
  @container (max-width: 600px) {
    h1 {
      font-size: 26px;
    }
  }
`;var yr=Object.defineProperty,$r=Object.getOwnPropertyDescriptor,wr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?$r(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&yr(e,s,a),a};let Cr=class extends ct{render(){const{hass:t,config:e,t:s,room:i,phone:o}=this.ctx,a=Fs(this.ctx,"rooms",fs(t).map(t=>t.area_id)),r=fs(t).filter(t=>a.includes(t.area_id)),n=xr(s("rooms"),[],Ns(this.ctx,"rooms",e=>t.areas?.[e]?.name??e));return r.length?U`${n}<div class="layout ${o?"phone":""}">
      <div class="grid">
        ${r.map(a=>{const r=$s(t,a.area_id,e.rooms[a.area_id]);return Is(this.ctx,"rooms",a.area_id,U`<button class="glass room ${a.area_id!==i||o?"":"sel"}" @click=${()=>this.ctx.selectRoom(a.area_id)}>
            <span class="name">${r.name}</span>
            <span class="stats">
              ${void 0!==r.temperature?U`<span>${js(Ie,14)}${r.temperature.toFixed(1)}°</span>`:K}
              ${void 0!==r.humidity?U`<span>${js(Ge,14)}${Math.round(r.humidity)}%</span>`:K}
              ${void 0!==r.occupied?U`<span class=${r.occupied?"occ":""}>${js(yt,14)}${r.people??(r.occupied?"•":"0")}</span>`:K}
            </span>
            <span class="foot">
              <span>${s("devices_count",{n:r.nodes.length})}</span>
              ${r.activeNodes?U`<span class="on">${s("devices_on",{n:r.activeNodes})}</span>`:K}
            </span>
          </button>`)})}
      </div>
      ${o?K:U`<sn-room-panel .ctx=${this.ctx} .area=${i}></sn-room-panel>`}
    </div>`:U`${n}<div class="glass"><div class="empty">${s("no_rooms")}</div></div>`}};Cr.styles=[Bs,vr,n`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .layout {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr minmax(340px, 400px);
        gap: 20px;
        height: 100%;
        min-height: 0;
      }
      .layout.phone {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
        gap: 16px;
        align-content: start;
        overflow: auto;
        padding: 2px;
      }
      .phone .grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      sn-room-panel {
        min-height: 0;
      }
      .room {
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-height: 150px;
        padding: 18px;
        text-align: start;
        cursor: pointer;
        font: inherit;
        transition: transform 0.15s ease, background 0.2s ease;
      }
      .room:active {
        transform: scale(0.98);
      }
      .room.sel {
        background: var(--sn-glass-strong);
        border-color: rgba(181, 220, 143, 0.6);
      }
      .name {
        font-size: 18px;
      }
      .stats {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .stats span {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .stats .occ {
        color: var(--sn-accent);
      }
      .foot {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      .foot .on {
        color: var(--sn-accent);
      }
    `],wr([gt({attribute:!1})],Cr.prototype,"ctx",2),Cr=wr([pt("sn-rooms-page")],Cr);var _r=Object.defineProperty,Hr=Object.getOwnPropertyDescriptor,kr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Hr(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&_r(e,s,a),a};let Vr=class extends ct{render(){const{hass:t,t:e}=this.ctx,s=Fs(this.ctx,"climate",Hs(t,"climate")),i=Fs(this.ctx,"climate",Hs(t,"fan")),o=s.filter(e=>"off"!==t.states[e].state);return U`
      ${xr(e("climate"),[e("n_running",{n:o.length})],U`${o.length?U`<button class="action" @click=${()=>t.callService("climate","turn_off",{entity_id:o})}>
            ${js(ve,18)}${e("all_ac_off")}
          </button>`:K}${Ns(this.ctx,"climate")}`)}
      ${s.length?U`<div class="grid" style="--min: 340px">
            ${s.map(e=>Is(this.ctx,"climate",e,U`<div class="wrap">
                ${ks(t,e)?U`<span class="area">${ks(t,e)}</span>`:K}
                <sn-climate-card .ctx=${this.ctx} .entity=${e}></sn-climate-card>
              </div>`))}
          </div>`:U`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
      ${i.length?U`<div class="section">${e("fans")}</div>
            <div class="grid" style="--min: 200px">
              ${i.map(s=>{const i=t.states[s],o=hs(i);return Is(this.ctx,"climate",s,U`<div class="glass card fan ${o?"on":""}">
                  <span class="spin">${js(Ut,30)}</span>
                  <span class="name">${ps(t,s)}<small>${"number"==typeof i.attributes.percentage&&o?`${i.attributes.percentage}%`:e(o?"on":"off")}</small></span>
                  <button class="switch" ?on=${o} aria-pressed=${o} @click=${()=>ws(t,s)}></button>
                </div>`)})}
            </div>`:K}
    `}};Vr.styles=[Bs,vr,n`
      .wrap {
        position: relative;
      }
      .area {
        position: absolute;
        top: 24px;
        inset-inline-end: 22px;
        z-index: 1;
        font-size: 12px;
        color: var(--sn-text-dim);
      }
      .fan {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .fan .name {
        flex: 1;
        display: grid;
        font-size: 14px;
      }
      .fan small {
        color: var(--sn-text-dim);
        font-size: 12px;
      }
      .fan .spin {
        color: var(--sn-text-dim);
      }
      .fan.on .spin {
        color: var(--sn-accent);
        animation: spin 1.6s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `],kr([gt({attribute:!1})],Vr.prototype,"ctx",2),Vr=kr([pt("sn-climate-page")],Vr);var Mr=Object.defineProperty,Ar=Object.getOwnPropertyDescriptor,Lr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Ar(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Mr(e,s,a),a};let Sr=class extends ct{tile(t){const{hass:e}=this.ctx,s=e.states[t],i=hs(s),o=i&&"number"==typeof s.attributes.brightness?Math.round(s.attributes.brightness/255*100):i?100:0,a=s.attributes.rgb_color;return U`<button
      class="glass light ${i?"on":""}"
      style=${i&&a?`--glow: rgb(${a.join(",")})`:""}
      @click=${()=>ws(e,t)}
      @pointerdown=${e=>ii(t,s)&&ti(e,()=>this.ctx.openLevel(t))}
      @contextmenu=${si}
    >
      <span class="bulb">${js(Ts(t,s),26)}</span>
      <span class="name">${ps(e,t)}</span>
      <span class="pct">${i?`${o}%`:this.ctx.t("off")}</span>
      <span class="bar"><span style="width:${o}%"></span></span>
    </button>`}render(){const{hass:t,t:e}=this.ctx,s=Fs(this.ctx,"lights",Hs(t,"light")),i=s.filter(e=>hs(t.states[e])),o=fs(t).map(e=>({name:e.name,ids:s.filter(s=>bs(t,s)===e.area_id)})).filter(t=>t.ids.length),a=s.filter(e=>!bs(t,e));return a.length&&o.push({name:e("other"),ids:a}),U`
      ${xr(e("lights"),[e("n_lights_on",{n:i.length})],U`${i.length?U`<button class="action" @click=${()=>t.callService("light","turn_off",{entity_id:i})}>
            ${js("M20.84 22.73L18.09 20C18.06 20 18.03 20 18 20H16.83C16.94 19.68 17 19.34 17 19V18.89L14.75 16.64C14.57 16.86 14.31 17 14 17H10C9.45 17 9 16.55 9 16V14C7.4 12.8 6.74 10.84 7.12 9L5.5 7.4C5.18 8.23 5 9.11 5 10C5 11.83 5.72 13.58 7 14.88V17H5C4.45 17 4 16.55 4 16V14.45C2.86 13.79 2.12 12.62 2 11.31C1.85 9.27 3.25 7.5 5.2 7.09L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M15 6C13.22 4.67 10.86 4.72 9.13 5.93L16.08 12.88C17.63 10.67 17.17 7.63 15 6M19.79 16.59C19.91 16.42 20 16.22 20 16V14.45C21.91 13.34 22.57 10.9 21.46 9C20.8 7.85 19.63 7.11 18.32 7C18.77 7.94 19 8.96 19 10C19 11.57 18.47 13.09 17.5 14.31L19.79 16.59M10 19C10 19.55 10.45 20 11 20H13C13.55 20 14 19.55 14 19V18H10V19M7 18H5V19C5 19.55 5.45 20 6 20H7.17C7.06 19.68 7 19.34 7 19V18Z",18)}${e("all_off")}
          </button>`:K}${Ns(this.ctx,"lights")}`)}
      ${s.length?o.map(t=>U`<div class="section">${t.name}</div><div class="grid" style="--min: 150px">${t.ids.map(t=>Is(this.ctx,"lights",t,this.tile(t)))}</div>`):U`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
    `}};Sr.styles=[Bs,vr,n`
      .section:first-of-type {
        margin-top: 0;
      }
      .light {
        display: grid;
        gap: 8px;
        padding: 16px;
        text-align: start;
        font: inherit;
        cursor: pointer;
        -webkit-touch-callout: none;
        user-select: none;
        transition: transform 0.15s ease, background 0.2s ease;
      }
      .light:active {
        transform: scale(0.97);
      }
      .bulb {
        display: grid;
        place-items: center;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text-dim);
      }
      .light.on {
        background: var(--sn-glass-strong);
      }
      .light.on .bulb {
        background: var(--glow, #f6e7b8);
        color: #2a2416;
        box-shadow: 0 0 22px var(--glow, rgba(246, 231, 184, 0.7));
      }
      .name {
        font-size: 14px;
        margin-top: 4px;
      }
      .pct {
        font-size: 12px;
        color: var(--sn-text-dim);
      }
    `],Lr([gt({attribute:!1})],Sr.prototype,"ctx",2),Sr=Lr([pt("sn-lights-page")],Sr);var zr=Object.defineProperty,Pr=Object.getOwnPropertyDescriptor,Er=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Pr(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&zr(e,s,a),a};let Or=class extends ct{render(){const{hass:t,t:e}=this.ctx,s=Fs(this.ctx,"robot",[...Hs(t,"vacuum"),...Hs(t,"lawn_mower")]);return U`
      ${xr(e("robot"),[],Ns(this.ctx,"robot"))}
      ${s.length?U`<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 620px))">
            ${s.map(t=>Is(this.ctx,"robot",t,U`<sn-robot-card .ctx=${this.ctx} .entity=${t}></sn-robot-card>`))}
          </div>`:U`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
    `}};Or.styles=[Bs,vr,n``],Er([gt({attribute:!1})],Or.prototype,"ctx",2),Or=Er([pt("sn-robot-page")],Or);var Zr=Object.defineProperty,jr=Object.getOwnPropertyDescriptor,Tr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?jr(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Zr(e,s,a),a};let Dr=class extends ct{battery(t){const{hass:e}=this.ctx,s=e.states[t],i=[].concat(s.attributes.source??[],s.attributes.device_trackers??[]);for(const o of i){const t=e.states[o]?.attributes.battery_level;if("number"==typeof t)return t;const s=Vs(e,o).find(t=>"battery"===e.states[t]?.attributes.device_class&&t.startsWith("sensor.")),i=s?gs(e.states[s]):void 0;if(void 0!==i)return i}}person(t){const{hass:e,t:s,lang:i}=this.ctx,o=e.states[t],a="home"===o.state,r=a?s("home_state"):"not_home"===o.state?s("away"):o.state,n=o.attributes.entity_picture,l=ps(e,t),c=this.battery(t);return U`<button class="glass person ${a?"home":""}" @click=${()=>this.ctx.openEntity(t)}>
      <span class="avatar">
        ${n?U`<img src=${n} alt="" />`:U`<span class="initials">${l.slice(0,1).toUpperCase()}</span>`}
        <span class="dot"></span>
      </span>
      <span class="name">${l}</span>
      <span class="where">${js(a?se:de,15)}${r}</span>
      <span class="meta">
        <span>${Ms(o.last_changed,i)}</span>
        ${void 0!==c?U`<span class=${c<20?"low":""}>${js(_t,14)}${Math.round(c)}%</span>`:K}
      </span>
    </button>`}render(){const{hass:t,t:e}=this.ctx,s=Fs(this.ctx,"family",Hs(t,"person")),i=s.filter(e=>"home"===t.states[e].state).length;return U`
      ${xr(e("family"),[e("at_home",{n:i})],Ns(this.ctx,"family"))}
      ${s.length?U`<div class="grid" style="--min: 150px">${s.map(t=>Is(this.ctx,"family",t,this.person(t)))}</div>`:U`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
    `}};Dr.styles=[Bs,vr,n`
      .person {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 24px 16px 18px;
        font: inherit;
        cursor: pointer;
        text-align: center;
      }
      .avatar {
        position: relative;
        width: 92px;
        height: 92px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
      }
      .person.home .avatar {
        border-color: var(--sn-accent);
        box-shadow: 0 0 22px var(--sn-accent-glow);
      }
      .avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      .initials {
        display: grid;
        place-items: center;
        height: 100%;
        font-size: 34px;
        font-weight: 300;
      }
      .dot {
        position: absolute;
        bottom: 4px;
        inset-inline-end: 4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #8d867f;
        border: 3px solid var(--sn-glass-strong);
      }
      .person.home .dot {
        background: var(--sn-accent);
      }
      .name {
        margin-top: 6px;
        font-size: 18px;
      }
      .where {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--sn-text-dim);
        text-transform: capitalize;
      }
      .person.home .where {
        color: var(--sn-accent);
      }
      .meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      .meta span {
        display: inline-flex;
        align-items: center;
        gap: 3px;
      }
      .meta .low {
        color: #f2a487;
      }
    `],Tr([gt({attribute:!1})],Dr.prototype,"ctx",2),Dr=Tr([pt("sn-family-page")],Dr);var Fr=Object.defineProperty,Rr=Object.getOwnPropertyDescriptor,Ir=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Rr(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Fr(e,s,a),a};const Nr=t=>`${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;let Wr=class extends ct{constructor(){super(...arguments),this.requestVersion=0,this.loading=!1,this.statisticsError=!1}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.refresh(!0),6e5)}disconnectedCallback(){clearInterval(this.timer),this.requestVersion++,super.disconnectedCallback()}updated(){this.refresh(!1)}async refresh(t){const{energy:e,solar_energy:s}=this.ctx.config.home,i=[...new Set([e,s].filter(Boolean))],o=i.join()+Nr(new Date);if(!i.length)return this.days=void 0,void(this.loadedFor=void 0);if(!t&&o===this.loadedFor)return;this.loadedFor=o;const a=++this.requestVersion;this.loading=!0,this.statisticsError=!1;const r=new Date,n=new Date(r.getFullYear(),r.getMonth()-1,1);try{const t=await async function(t,e,s){const i=await t.hass.callWS({type:"recorder/statistics_during_period",start_time:s.toISOString(),end_time:(new Date).toISOString(),statistic_ids:e,period:"day",types:["change"],units:{energy:"kWh"}}),o={};for(const a of e){const t=new Map;for(const e of i[a]??[]){const s="number"==typeof e.start?e.start:Date.parse(e.start);if(!Number.isFinite(s)||"number"!=typeof e.change||!Number.isFinite(e.change))continue;const i=Nr(new Date(s));t.set(i,(t.get(i)??0)+e.change)}o[a]=t}return o}(this.ctx,i,n);a===this.requestVersion&&this.isConnected&&(this.days=t)}catch{a===this.requestVersion&&this.isConnected&&(this.days=void 0,this.statisticsError=!0)}finally{a===this.requestVersion&&this.isConnected&&(this.loading=!1)}}text(t,e){return"ar"===this.ctx.lang?t:e}render(){const{hass:t,t:e,config:s,lang:i}=this.ctx,{energy:o,solar_energy:a,solar_power:r}=s.home,n=o?this.days?.[o]:void 0,l=a?this.days?.[a]:void 0,c=new Date,d=t=>{const e=new Date(c);return e.setDate(e.getDate()-t),e},p=(t,e)=>t?.get(Nr(e)),h=Array.from({length:c.getDate()},(t,e)=>new Date(c.getFullYear(),c.getMonth(),e+1)),u=h.map(t=>p(n,t)).filter(t=>void 0!==t),g=u.length?u.reduce((t,e)=>t+e,0):void 0,m=u.length===h.length,f=new Date(c.getFullYear(),c.getMonth(),0).getDate(),b=Math.min(c.getDate()-1,f),x=Array.from({length:b},(t,e)=>p(n,new Date(c.getFullYear(),c.getMonth(),e+1))),v=Array.from({length:b},(t,e)=>p(n,new Date(c.getFullYear(),c.getMonth()-1,e+1))),y=b>0&&x.every(t=>void 0!==t)&&v.every(t=>void 0!==t),$=x.reduce((t,e)=>t+(e??0),0),w=v.reduce((t,e)=>t+(e??0),0),C=y&&w>0?($-w)/w*100:void 0,_=s.experience??{},H="number"==typeof _.tariff&&Number.isFinite(_.tariff)&&_.tariff>=0?_.tariff:void 0,k=_.currency?.trim()||this.text("عملة","currency"),V=_.power_entity,M=V?ms(t.states[V]):void 0,A="number"==typeof _.monthly_budget&&_.monthly_budget>0?_.monthly_budget:void 0,L=void 0!==g&&void 0!==H?g*H:void 0,S=void 0!==L&&A?L/A*100:void 0,z="number"==typeof _.power_alert_kw&&_.power_alert_kw>0?_.power_alert_kw:void 0,P=void 0!==M&&void 0!==z&&M>z,E=Array.from({length:7},(t,e)=>d(6-e)),O=Math.max(.1,...E.map(t=>(p(n,t)??0)+(p(l,t)??0))),Z=t=>void 0===t?"–":t.toFixed(1),j=Fs(this.ctx,"energy",Hs(t,"sensor")).filter(e=>"power"===t.states[e].attributes.device_class&&e!==r).map(e=>({id:e,kw:ms(t.states[e])??0})).filter(t=>t.kw>.001).sort((t,e)=>e.kw-t.kw).slice(0,8),T=j[0]?.kw??1,D=r?ms(t.states[r]):void 0;return o?U`
      ${xr(e("energy"),[void 0!==D?U`${js(Ee,16)}${e("eco_solar",{kw:D.toFixed(1)})}`:void 0],Ns(this.ctx,"energy"))}
      ${this.loading?U`<p class="status-note" role="status">${this.text("عم نقرأ إحصائيات الطاقة المسجلة…","Loading recorded energy statistics…")}</p>`:K}
      ${this.statisticsError?U`<div class="glass energy-note" role="status">${this.text("تعذّر قراءة إحصائيات Home Assistant. تأكد من تفعيل Recorder وإحصائيات عداد الطاقة.","Home Assistant statistics could not be read. Check Recorder and the energy meter statistics.")}<button class="pill" @click=${()=>this.refresh(!0)}>${this.text("إعادة المحاولة","Retry")}</button></div>`:K}
      ${P?U`<div class="glass energy-alert" role="alert">${this.text("الاستهلاك اللحظي أعلى من الحد المحدد","Current power exceeds your configured limit")}: ${M.toFixed(2)} kW / ${z.toFixed(2)} kW</div>`:K}
      <div class="stats">
        <div class="glass stat"><span>${e("today")}</span><b>${Z(p(n,c))}<small>kWh</small></b></div>
        <div class="glass stat"><span>${e("yesterday")}</span><b>${Z(p(n,d(1)))}<small>kWh</small></b></div>
        <div class="glass stat"><span>${e("this_month")}</span><b>${Z(g)}<small>kWh</small></b></div>
        <div class="glass stat"><span>${this.text("القدرة الآن","Power now")}</span><b>${Z(M)}<small>kW</small></b>${V?void 0===M?U`<small>${this.text("حساس القدرة غير متاح","Power sensor unavailable")}</small>`:K:U`<small>${this.text("اختار حساس القدرة من الإعدادات","Choose a power sensor in settings")}</small>`}</div>
        <div class="glass stat"><span>${this.text("تكلفة تقديرية حسب الاستهلاك الحالي","Estimated cost at the current rate")}</span><b>${void 0!==M&&void 0!==H?(Math.max(0,M)*H).toFixed(2):"–"}<small>${k}/${this.text("ساعة","hour")}</small></b>${void 0===H?U`<small>${this.text("أدخل تعرفة kWh في الإعدادات","Set your kWh tariff in settings")}</small>`:K}</div>
        <div class="glass stat"><span>${this.text("تكلفة الاستهلاك المسجل هذا الشهر","Recorded month-to-date cost")}</span><b>${void 0===L?"–":L.toFixed(2)}<small>${k}</small></b>${m||void 0===g?K:U`<small>${this.text("بعض الأيام بدون بيانات؛ الإجمالي غير مكتمل","Some days have no data; this total is incomplete")}</small>`}</div>
        ${a?U`<div class="glass stat sun"><span>${e("solar_today")}</span><b>${Z(p(l,c))}<small>kWh</small></b></div>`:K}
      </div>
      <div class="energy-insights">
        <div class="glass card"><h3>${this.text("مقارنة الشهر الماضي","Previous-month comparison")}</h3>${void 0===C?U`<p>${this.text("نحتاج بيانات كاملة للأيام المقابلة حتى نعرض مقارنة دقيقة.","Complete data for matching days is needed for an accurate comparison.")}</p>`:U`<b class="comparison">${C>0?"+":""}${C.toFixed(1)}%</b><p>${this.text(`مقارنة أول ${b} أيام مكتملة من الشهرين؛ اليوم الحالي مستثنى.`,`Comparing the first ${b} completed days in each month; today is excluded.`)}</p>`}</div>
        <div class="glass card"><h3>${this.text("ميزانية الطاقة الشهرية","Monthly energy budget")}</h3>${void 0===S?U`<p>${this.text("حدد التعرفة والميزانية وعدّاد الطاقة من الإعدادات لعرض التقدم.","Set your tariff, budget and energy meter in settings to track progress.")}</p>`:U`<div class="budget-head"><b>${L.toFixed(2)} / ${A.toFixed(2)} ${k}</b><span>${S.toFixed(0)}%</span></div><progress max="100" .value=${Math.min(100,Math.max(0,S))} aria-label=${this.text("نسبة استهلاك الميزانية","Budget used")}></progress><p>${m?S>100?this.text("تجاوزت الميزانية المحددة.","Your configured budget has been exceeded."):this.text("تقدير حسب التعرفة المدخلة؛ لا يشمل الرسوم والضرائب.","Estimate from your entered tariff; excludes fixed fees and taxes."):this.text("التقدم مبني على الأيام المتاحة فقط.","Progress is based only on days with data.")}</p>`}</div>
      </div>
      ${this.ctx.isAdmin?U`<button class="pill configure" @click=${()=>vi(this.ctx)}>${js(Ot,16)}${this.text("إعدادات الطاقة والتكلفة","Energy and cost settings")}</button>`:K}
      <div class="cols">
        <sn-energy-card .ctx=${this.ctx}></sn-energy-card>
        <div class="glass card week">
          <h3>${e("last_7_days")}</h3>
          <div class="bars">
            ${E.map(t=>{const e=p(n,t),s=p(l,t),o=e??0,a=s??0;return U`<div class="col">
                <span class="v">${void 0!==e||void 0!==s?(o+a).toFixed(0):"–"}</span>
                <div class="stack" style="height:${(o+a)/O*100}%">
                  ${a?U`<span class="s" style="flex:${a}"></span>`:K}
                  <span class="g" style="flex:${o||1e-4}"></span>
                </div>
                <span class="d">${t.toLocaleDateString(i,{weekday:"short"})}</span>
              </div>`})}
          </div>
        </div>
      </div>
      ${j.length?U`<div class="section">${e("top_consumers")}</div>
            <div class="glass card list">
              ${j.map(e=>Is(this.ctx,"energy",e.id,U`<div class="row" @click=${()=>this.ctx.openEntity(e.id)}>
                  <span class="ic">${js(Gt,16)}</span>
                  <span class="name">${ps(t,e.id)}</span>
                  <span class="bar"><span style="width:${e.kw/T*100}%"></span></span>
                  <span class="kw">${e.kw>=1?`${e.kw.toFixed(2)} kW`:`${Math.round(1e3*e.kw)} W`}</span>
                </div>`))}
            </div>`:K}
    `:U`${xr(e("energy"))}<div class="glass"><div class="empty">${e("no_energy")}<p>${this.text("اختار عداد طاقة تراكمي من إعدادات الطاقة لعرض الاستهلاك والتكلفة الفعلية.","Choose a cumulative energy meter in energy settings to show recorded consumption and estimated cost.")}</p>${this.ctx.isAdmin?U`<button class="pill" @click=${()=>vi(this.ctx)}>${js(Ot,16)}${e("settings")}</button>`:K}</div></div>`}};Wr.styles=[Bs,vr,n`
      .energy-insights { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; margin-bottom: 16px; }
      .energy-insights p, .status-note { color: var(--sn-text-dim); font-size: 12px; line-height: 1.8; }
      .energy-note, .energy-alert { padding: 16px; margin-bottom: 14px; font-size: 13px; line-height: 1.8; }
      .energy-alert { border-color: #d49351; color: var(--sn-warm, #ffad75); }
      .energy-note .pill { margin-inline-start: 12px; }
      .configure { margin-bottom: 16px; }
      .comparison { font-size: 32px; font-weight: 400; }
      .budget-head { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; }
      progress { display: block; width: 100%; height: 10px; margin-top: 14px; accent-color: var(--sn-accent); }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
        gap: 14px;
        margin-bottom: 16px;
      }
      .stat {
        display: grid;
        gap: 6px;
        padding: 16px 18px;
      }
      .stat span {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .stat b {
        font-size: 30px;
        font-weight: 300;
      }
      .stat small {
        font-size: 13px;
        margin-inline-start: 3px;
      }
      .stat.sun b {
        color: var(--sn-accent);
      }
      .cols {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 16px;
      }
      h3 {
        margin: 0 0 14px;
        font-size: 19px;
        font-weight: 400;
      }
      .bars {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        height: 220px;
      }
      .col {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        gap: 6px;
        min-height: 0;
      }
      .stack {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 38px;
        min-height: 4px;
        border-radius: 10px;
        overflow: hidden;
      }
      .stack .g {
        background: rgba(255, 255, 255, 0.55);
      }
      .stack .s {
        background: var(--sn-accent);
      }
      .v,
      .d {
        font-size: 11px;
        color: var(--sn-text-dim);
      }
      .list {
        display: grid;
        gap: 12px;
      }
      .row {
        cursor: pointer;
        display: grid;
        grid-template-columns: auto minmax(90px, 1fr) 2fr auto;
        align-items: center;
        gap: 12px;
        font-size: 14px;
      }
      .ic {
        color: var(--sn-accent);
      }
      .kw {
        font-size: 13px;
        color: var(--sn-text-dim);
        min-width: 64px;
        text-align: end;
      }
    `],Ir([gt({attribute:!1})],Wr.prototype,"ctx",2),Ir([mt()],Wr.prototype,"days",2),Ir([mt()],Wr.prototype,"loading",2),Ir([mt()],Wr.prototype,"statisticsError",2),Wr=Ir([pt("sn-energy-page")],Wr);var Ur=Object.defineProperty,Br=Object.getOwnPropertyDescriptor,qr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Br(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Ur(e,s,a),a};const Kr=["door","window","garage_door","opening"];let Yr=class extends ct{lock(t){const{hass:e,t:s}=this.ctx,i="locked"===e.states[t].state;return U`<button
      class="glass tile lock ${i?"ok":"warn"}"
      @click=${()=>i?this.ctx.toast(s("confirm_unlock")):e.callService("lock","lock",{entity_id:t})}
      @pointerdown=${s=>i&&ti(s,()=>e.callService("lock","unlock",{entity_id:t}))}
      @contextmenu=${si}
    >
      <span class="ic">${js(i?re:ne,24)}</span>
      <span class="name">${ps(e,t)}</span>
      <span class="st">${s(i?"locked":"unlocked")}</span>
    </button>`}opening(t){const{hass:e,t:s,lang:i}=this.ctx,o=e.states[t],a="on"===o.state,r=o.attributes.device_class;return U`<button class="glass tile ${a?"warn":"ok"}" @click=${()=>this.ctx.openEntity(t)}>
      <span class="ic">${js("window"===r?a?ss:es:"garage_door"===r?a?"M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12Z":"M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12M8,15H16V17H8V15M16,18V20H8V18H16Z":a?Rt:"M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z",24)}</span>
      <span class="name">${ps(e,t)}</span>
      <span class="st">${s(a?"st_open":"st_closed")} · ${Ms(o.last_changed,i)}</span>
    </button>`}alarm(t){const{hass:e,t:s}=this.ctx,i=e.states[t],o=i.state.startsWith("armed"),a=!!i.attributes.code_format&&!1!==i.attributes.code_arm_required,r=s=>()=>a||"alarm_disarm"===s&&i.attributes.code_format?this.ctx.openEntity(t):e.callService("alarm_control_panel",s,{entity_id:t});return U`<div class="glass alarm ${o?"armed":""} ${"triggered"===i.state?"triggered":""}">
      <span class="shield">${js(o?Le:Se,34)}</span>
      <div class="ainfo">
        <span class="name">${ps(e,t)}</span>
        <span class="st">${i.state.replace(/_/g," ")}</span>
      </div>
      <div class="abtns">
        <button class=${"armed_home"===i.state?"on":""} @click=${r("alarm_arm_home")}>${js(Me,18)}${s("arm_home")}</button>
        <button class=${"armed_away"===i.state?"on":""} @click=${r("alarm_arm_away")}>${js(Le,18)}${s("arm_away")}</button>
        <button class=${"disarmed"===i.state?"on":""} @click=${r("alarm_disarm")}>${js(Se,18)}${s("disarm")}</button>
      </div>
    </div>`}camera(t){const{hass:e}=this.ctx,s=e.states[t].attributes.entity_picture,i=ks(e,t);return U`<button class="glass cam" @click=${()=>this.ctx.openEntity(t)}>
      ${s?U`<sn-live-video fit="cover" .hass=${e} .entity=${function(t,e){const s=/fluent|_sub|sub_|substream|_low|_ext/i;if(s.test(e))return e;const i=t.entities?.[e]?.device_id;if(!i)return e;const o=Object.values(t.entities??{}).find(o=>o.device_id===i&&o.entity_id!==e&&o.entity_id.startsWith("camera.")&&s.test(o.entity_id)&&"unavailable"!==t.states[o.entity_id]?.state);return o?.entity_id??e}(e,t)}></sn-live-video>`:K}
      <span class="cam-label">${ps(e,t)}${i?U`<small>${i}</small>`:K}</span>
    </button>`}render(){const{hass:t,t:e}=this.ctx,s=t=>Fs(this.ctx,"security",t),i=s(Hs(t,"alarm_control_panel")),o=s(Hs(t,"lock")),a=s(Hs(t,"binary_sensor").filter(e=>Kr.includes(t.states[e].attributes.device_class))),r=s(Hs(t,"camera")),n=o.filter(e=>"locked"!==t.states[e].state),l=a.filter(e=>"on"===t.states[e].state),c=i.length+o.length+a.length+r.length;return U`
      ${xr(e("security"),[o.length?n.length?e("n_unlocked",{n:n.length}):e("all_locked"):void 0,a.length?l.length?e("n_open",{n:l.length}):e("all_closed"):void 0],U`${n.length?U`<button class="action" @click=${()=>t.callService("lock","lock",{entity_id:n})}>${js(re,18)}${e("lock_all")}</button>`:K}${Ns(this.ctx,"security")}`)}
      ${c?K:U`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
      ${i.map(t=>Is(this.ctx,"security",t,this.alarm(t)))}
      ${o.length?U`<div class="section">${e("locks")}</div><div class="grid" style="--min: 180px">${o.map(t=>Is(this.ctx,"security",t,this.lock(t)))}</div>`:K}
      ${a.length?U`<div class="section">${e("doors_windows")}</div>
            <div class="grid" style="--min: 180px">${[...l,...a.filter(t=>!l.includes(t))].map(t=>Is(this.ctx,"security",t,this.opening(t)))}</div>`:K}
      ${r.length?U`<div class="section">${e("cameras")}</div><div class="grid" style="--min: 280px">${r.map(t=>Is(this.ctx,"security",t,this.camera(t)))}</div>`:K}
    `}};Yr.styles=[Bs,vr,n`
      .tile {
        display: grid;
        gap: 6px;
        padding: 16px;
        text-align: start;
        font: inherit;
        cursor: pointer;
        -webkit-touch-callout: none;
        user-select: none;
      }
      .tile .ic {
        display: grid;
        place-items: center;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
      }
      .tile.ok .ic {
        color: var(--sn-accent);
      }
      .tile.warn .ic {
        background: rgba(242, 164, 135, 0.22);
        color: #f6b49b;
      }
      .name {
        font-size: 15px;
      }
      .st {
        font-size: 12px;
        color: var(--sn-text-dim);
      }
      .alarm {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        padding: 18px 20px;
        margin-bottom: 8px;
      }
      .shield {
        display: grid;
        place-items: center;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
      }
      .alarm.armed .shield {
        background: rgba(181, 220, 143, 0.25);
        color: var(--sn-accent);
        box-shadow: 0 0 24px var(--sn-accent-glow);
      }
      .alarm.triggered .shield {
        background: #b5442f;
        color: #fff;
      }
      .ainfo {
        flex: 1;
        display: grid;
        gap: 4px;
        min-width: 140px;
      }
      .ainfo .st {
        text-transform: capitalize;
      }
      .abtns {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .abtns button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 44px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .abtns button.on {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
      .cam {
        position: relative;
        padding: 0;
        overflow: hidden;
        aspect-ratio: 16 / 10;
        cursor: pointer;
        font: inherit;
      }
      .cam sn-live-video {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .cam-label {
        position: absolute;
        inset-inline-start: 12px;
        bottom: 12px;
        display: grid;
        padding: 8px 14px;
        border-radius: 14px;
        background: rgba(20, 18, 16, 0.55);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
        font-size: 13px;
        text-align: start;
      }
      .cam-label small {
        opacity: 0.7;
        font-size: 11px;
      }
    `],qr([gt({attribute:!1})],Yr.prototype,"ctx",2),Yr=qr([pt("sn-security-page")],Yr);var Gr=Object.defineProperty,Xr=Object.getOwnPropertyDescriptor,Jr=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?Xr(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&Gr(e,s,a),a};let Qr=class extends ct{render(){const{hass:t,t:e}=this.ctx,s=Fs(this.ctx,"media",Hs(t,"media_player")),i=e=>"playing"===t.states[e].state?0:hs(t.states[e])?1:2,o=[...s].sort((t,e)=>i(t)-i(e)),a=s.filter(e=>"playing"===t.states[e].state).length;return U`
      ${xr(e("media"),[a?e("n_playing",{n:a}):e("nothing_playing")],Ns(this.ctx,"media"))}
      ${o.length?U`<div class="grid" style="--min: 340px">
            ${o.map(t=>Is(this.ctx,"media",t,U`<sn-media-player .ctx=${this.ctx} .entity=${t}></sn-media-player>`))}
          </div>`:U`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
    `}};Qr.styles=[Bs,vr,n``],Jr([gt({attribute:!1})],Qr.prototype,"ctx",2),Qr=Jr([pt("sn-media-page")],Qr);var tn=Object.defineProperty,en=Object.getOwnPropertyDescriptor,sn=(t,e,s,i)=>{for(var o,a=i>1?void 0:i?en(e,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(a=(i?o(e,s,a):o(a))||a);return i&&a&&tn(e,s,a),a};const on=t=>{const e=to(t);return e.color||e.temp};!function(){if(document.getElementById("sn-pro-fonts"))return;const t=document.createElement("style");t.id="sn-pro-fonts",t.textContent='\n    @font-face { font-family: "SN Outfit"; font-style: normal; font-display: swap; font-weight: 100 900;\n      src: url(/smartnest_pro_static/assets/outfit-latin-wght-normal-Bc-8i84L.woff2) format("woff2-variations"); }\n    @font-face { font-family: "SN Alexandria"; font-style: normal; font-display: swap; font-weight: 100 900;\n      src: url(/smartnest_pro_static/assets/alexandria-arabic-wght-normal-BMWQQIfH.woff2) format("woff2-variations");\n      unicode-range: U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0898-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC; }\n  ',document.head.appendChild(t)}();const an=["home","rooms","climate","lights"],rn="sn-kiosk",nn="sn-kiosk-dock",ln=t=>{try{return localStorage.getItem(t)}catch{return null}},cn=(t,e)=>{try{null===e?localStorage.removeItem(t):localStorage.setItem(t,e)}catch{}};let dn=class extends ct{constructor(){super(...arguments),this.narrow=!1,this.page="home",this.navDir=1,this.navOrder=[],this.panelOpen=!1,this.width=1200,this.query="",this.kiosk=function(){const t=new URLSearchParams(location.search);return t.has("kiosk")&&cn(rn,"0"===t.get("kiosk")?null:"1"),"1"===ln(rn)}(),this.unlocked=!1,this.saver=!1,this.idle=()=>{clearTimeout(this.idleTimer),this.idleTimer=window.setTimeout(()=>this.sleep(),12e4)},this.checkingLicense=!1,this.loadingConfig=!1,this.lifecycle=0,this.configCycle=0,this.licenseRevision=0,this.setupOpen=!1,this.actionState="",this.pendingActions=new Map,this.layoutQueue=Promise.resolve(),this.setupRequest=()=>{this.hass?.user?.is_admin&&!this.previewConfig&&(this.setupOpen=!0,this.sheet=void 0)},this.preferencesChanged=()=>this.requestUpdate(),this.persistDraft=()=>{clearTimeout(this.draftTimer),this.draft&&this.hass?.user?.is_admin&&(this.draftTimer=window.setTimeout(()=>{if(!this.draft)return;const t=os(this.draft);delete t.settings.kiosk_pin,cn(this.draftKey(),JSON.stringify({config:t,saved_at:Date.now()})),ln(this.draftKey())&&(this.draftSavedAt=Date.now())},400))},this.resize=new ResizeObserver(([t])=>this.width=t.contentRect.width),this.closePanel=()=>{this.panelOpen=!1,this.renderRoot.querySelector("sn-floorplan")?.unfocus()}}draftKey(){return`smartnest.draft.v1.${this.hass?.user?.id??"guest"}`}connectedCallback(){super.connectedCallback(),this.resize.observe(this),window.addEventListener("sn-open-setup",this.setupRequest),window.addEventListener("sn-preferences-change",this.preferencesChanged),this.licenseTimer=window.setInterval(()=>{this.checkLicense()},6e4),this.hass&&this.checkLicense();for(const t of["pointerdown","keydown","wheel"])window.addEventListener(t,this.idle,{capture:!0,passive:!0});this.idle()}disconnectedCallback(){super.disconnectedCallback();for(const t of["pointerdown","keydown","wheel"])window.removeEventListener(t,this.idle,{capture:!0});window.removeEventListener("sn-open-setup",this.setupRequest),window.removeEventListener("sn-preferences-change",this.preferencesChanged),clearTimeout(this.draftTimer),clearTimeout(this.idleTimer),clearTimeout(this.bellTimer),clearInterval(this.licenseTimer),this.lifecycle++,this.configCycle++,this.checkingLicense=!1,this.loadingConfig=!1,this.licenseUnsub?.(),this.licenseUnsub=void 0,this.licenseValid=void 0,this.config=void 0,this.resize.disconnect(),this.unsub?.(),this.unsub=void 0}willUpdate(t){t.has("hass")&&this.hass&&void 0===this.licenseValid&&this.checkLicense(),t.has("hass")&&this.checkDoorbell()}checkDoorbell(){const t=this.config?.door?.doorbell,e=t?this.hass?.states[t]:void 0,s=e&&"unavailable"!==e.state?t.startsWith("event.")?e.state:"on"===e.state?e.last_changed:"":"",i=this.bellSeen;this.bellSeen=s,void 0!==i&&s&&s!==i&&this.kiosk&&this.live&&(this.bellSheet=bi(this.ctx()),this.sheet=this.bellSheet,this.saver=!1,this.idle(),clearTimeout(this.bellTimer),this.bellTimer=window.setTimeout(()=>{this.sheet===this.bellSheet&&(this.sheet=void 0)},9e4))}updated(t){(t.has("kiosk")||t.has("accessScope")||t.has("licenseValid")||t.has("hass")&&!t.get("hass"))&&this.applySidebar()}applySidebar(){const t=this.hass?.dockedSidebar;if(!this.hass)return;const e=t=>this.dispatchEvent(new CustomEvent("hass-dock-sidebar",{bubbles:!0,composed:!0,detail:{dock:t}}));if(this.kiosk&&!0===this.licenseValid&&!this.accessScope?.guest_expired){if("always_hidden"===t)return;null===ln(nn)&&cn(nn,t??"docked"),e("always_hidden")}else{const t=ln(nn);if(null===t)return;cn(nn,null),"always_hidden"!==t&&e(t)}}sleep(){if(this.kiosk&&!this.draft&&this.live){if(this.sheet&&this.sheet===this.bellSheet)return this.idle();this.sheet=void 0,this.saver=!0}}wake(){this.saver=!1,this.go("home"),this.idle()}setKiosk(t){cn(rn,t?"1":null),this.kiosk=t,t&&(this.unlocked=!!this.draft)}unlock(t){const e=t.config.settings.kiosk_pin??"",s=()=>this.sheet={title:t.t("kiosk_mode"),icon:le,render:t=>U`<div class="more-grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">
          ${this.hass.user?.is_admin&&!this.phone?U`<button @click=${()=>{this.unlocked=!0,this.sheet=void 0,this.startEdit()}}><span>${js(me,26)}</span>${t.t("edit")}</button>`:K}
          <button @click=${()=>{this.sheet=void 0,this.setKiosk(!1)}}><span>${js("M19,3H5C3.89,3 3,3.89 3,5V9H5V5H19V19H5V15H3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10.08,15.58L11.5,17L16.5,12L11.5,7L10.08,8.41L12.67,11H3V13H12.67L10.08,15.58Z",26)}</span>${t.t("exit_kiosk")}</button>
        </div>`};if(!e)return s();this.sheet={title:t.t("enter_pin"),icon:le,render:t=>U`<sn-pin-pad .pin=${e} .wrongLabel=${t.t("wrong_pin")} @ok=${s}></sn-pin-pad>`}}async licenseRequest(t){let e;try{return await Promise.race([t,new Promise((t,s)=>{e=window.setTimeout(()=>s(new Error("License status unavailable")),1e4)})])}finally{clearTimeout(e)}}acceptLicense(t){const e=!0===t.valid;this.licenseValid=e,e?this.config||this.load():(this.configCycle++,this.loadingConfig=!1,this.unsub?.(),this.unsub=void 0,this.config=void 0,this.draft=void 0,this.previewConfig=void 0,this.sheet=void 0,this.bellSheet=void 0,this.saver=!1,this.unlocked=!1,clearTimeout(this.bellTimer),this.loadError=void 0)}async checkLicense(){if(!this.hass||!this.isConnected||this.checkingLicense)return;this.checkingLicense=!0;const t=this.lifecycle,e=()=>this.isConnected&&t===this.lifecycle;try{if(!this.licenseUnsub){let t=!0;const i=this.hass.connection.subscribeMessage(s=>{t&&e()&&(this.licenseRevision++,this.acceptLicense(s))},{type:"smartnest_pro/license/subscribe"});i.then(s=>{t&&e()||s()},()=>{});try{const t=await this.licenseRequest(i);if(!e())return void t();this.licenseUnsub=t}catch(s){throw t=!1,s}}const t=this.licenseRevision,i=await this.licenseRequest(this.hass.callWS({type:"smartnest_pro/license/status"}));e()&&t===this.licenseRevision&&this.acceptLicense(i),e()&&this.accessScope?.guest_until&&1e3*this.accessScope.guest_until<=Date.now()&&(this.accessScope={...this.accessScope,guest_expired:!0}),e()&&this.requestUpdate()}catch{e()&&(this.licenseUnsub?.(),this.licenseUnsub=void 0,this.acceptLicense({valid:!1,reason:"unavailable"}))}finally{e()&&(this.checkingLicense=!1)}}async load(){if(!0!==this.licenseValid)return void this.checkLicense();if(this.loadingConfig||!this.hass||!this.isConnected)return;this.loadingConfig=!0;const t=this.hass,e=++this.configCycle,s=()=>this.isConnected&&e===this.configCycle&&!0===this.licenseValid;this.loadError="";try{const e=await this.licenseRequest(t.callWS({type:"smartnest_pro/config/get"}));if(!s())return;const i=await this.licenseRequest(t.callWS({type:"smartnest_pro/access/get"}));if(!s())return;this.accessScope=i;try{const{preferences:e}=await t.callWS({type:"smartnest_pro/preferences/get"});s()&&e&&Object.keys(e).length&&ls(t,e,!1)}catch{}if(!s())return;this.config=is(e.config),this.page=ns(t).screen_start_page||ns(t).start_page||"home",this.unsub?.();const o=await t.connection.subscribeMessage(e=>{s()&&!this.draft&&(this.config=is(e.config),t.callWS({type:"smartnest_pro/access/get"}).then(t=>{s()&&(this.accessScope=t)}).catch(()=>{s()&&(this.accessScope={restricted:!0,areas:[],entities:[],guest_expired:!0})}))},{type:"smartnest_pro/config/subscribe"});s()?this.unsub=o:o()}catch(i){s()&&(this.loadError=i?.message??"SmartNest failed to load")}finally{s()&&(this.loadingConfig=!1)}}get phone(){return this.width<760}get live(){return!0===this.licenseValid?this.draft??this.previewConfig??this.config:void 0}defaultRoom(t){const e=this.hass;if(t.settings.default_room&&e.areas?.[t.settings.default_room])return t.settings.default_room;const s=t.pages.rooms?.hidden??[],i=fs(e).filter(t=>!s.includes(t.area_id));return i.find(s=>$s(e,s.area_id,t.rooms[s.area_id]).occupied)?.area_id??i[0]?.area_id}withRoomNames(t,e){const s=Object.entries(e.rooms).filter(([,t])=>t.name);if(!s.length||!t.areas)return t;const i=JSON.stringify(s.map(([t,e])=>[t,e.name]));if(this.named&&this.named.src===t&&this.named.key===i)return this.named.out;const o={...t.areas};for(const[r,n]of s)o[r]&&(o[r]={...o[r],name:n.name});const a={...t,areas:o};return this.named={src:t,key:i,out:a},a}async openCenter(e,s="overview"){const i={title:e.rtl?"مركز البيت":"Home Center",wide:!0,render:()=>U`<p role="status">${e.rtl?"جاري فتح الأدوات…":"Loading your tools…"}</p>`};this.sheet=i;try{const{openHomeCenter:e}=await t(async()=>{const{openHomeCenter:t}=await(import("./home-center-D6XcpSQP.js"));return{openHomeCenter:t}},[]);this.isConnected&&!0===this.licenseValid&&this.sheet===i&&e(this.ctx(),s)}catch{this.sheet===i&&(this.sheet=void 0),this.toast(e.rtl?"تعذّر فتح الأدوات. تحقّق من الاتصال.":"Could not load tools. Check the connection.")}}runAction(t,e,s){if(this.previewConfig)return this.toast(this.ctx().rtl?"المعاينة لا تشغّل الأجهزة.":"Device actions are disabled during preview."),Promise.resolve();const i=JSON.stringify([t,e,s]),o=this.pendingActions.get(i);if(o)return o;const a="ar"===Zs(this.live?.settings.language??"auto",this.hass?.language??"en");if(("lock"===t&&["unlock","open"].includes(e)||"alarm_control_panel"===t&&"alarm_disarm"===e)&&!window.confirm(a?"تأكيد تنفيذ أمر أمان حساس؟":"Confirm this sensitive security action?"))return Promise.resolve();const r=(async()=>{this.actionState=a?"جاري تنفيذ الأمر…":"Executing…",this.failedAction=void 0;try{const i=await this.hass.callWS({type:"smartnest_pro/action",domain:t,service:e,data:s});return this.actionState="",this.toast(a?"تم تنفيذ الأمر":"Action completed"),i}catch(o){throw this.actionState=a?"تعذّر تنفيذ الأمر. تحقّق من اتصال الجهاز وصلاحياتك.":"Action failed. Check the device connection and your permissions.",this.failedAction=()=>this.runAction(t,e,s),o}finally{this.pendingActions.delete(i)}})();return this.pendingActions.set(i,r),r.catch(()=>{}),r}ctx(){let t=this.live;const e=ns(this.hass);!this.draft&&e.favorites_configured&&(t={...t,home:{...t.home,devices:e.favorites.filter(t=>!!this.hass.states[t])}});const s=this.withRoomNames(function(t,e){if(!e?.restricted||t.user?.is_admin)return t;const s=s=>{if(e.guest_expired)return!1;if(e.entities.includes(s))return!0;const i=t.entities?.[s],o=i?.area_id??(i?.device_id?t.devices?.[i.device_id]?.area_id:void 0);return!!o&&e.areas.includes(o)&&!s.startsWith("scene.")&&!s.startsWith("script.")},i=Object.fromEntries(Object.entries(t.states).filter(([t])=>s(t))),o=Object.fromEntries(Object.entries(t.entities??{}).filter(([t])=>s(t))),a=new Set(Object.values(o).map(t=>t.device_id));return{...t,states:i,entities:o,devices:Object.fromEntries(Object.entries(t.devices??{}).filter(([t])=>a.has(t))),areas:Object.fromEntries(Object.entries(t.areas??{}).filter(([t])=>e.areas.includes(t)))}}(this.hass,this.accessScope),t),i={...s,callService:(t,e,s={})=>this.runAction(t,e,s),callWS:t=>{return this.previewConfig&&("call_service"===(e=String(t.type))||"smartnest_pro/action"===e||/^smartnest_pro\/(?:timer|schedule)\/(?:set|add|cancel)$/.test(e)||"smartnest_pro/config/save"===e||"smartnest_pro/preferences/save"===e)?(this.toast(this.ctx().rtl?"المعاينة لا تنفذ أوامر أو تحفظ تغييرات.":"Preview does not execute actions or publish changes."),Promise.resolve({success:!1,preview:!0})):s.callWS(t);var e},fetchWithAuth:(t,e)=>this.previewConfig&&e?.method&&!["GET","HEAD"].includes(e.method.toUpperCase())?Promise.resolve(new Response(JSON.stringify({error:"preview_read_only"}),{status:403})):s.fetchWithAuth(t,e)};var o;o=t.names,ds=o??{};const a=Zs(t.settings.language,this.hass.language??"en"),r=this.room&&this.hass.areas?.[this.room]?this.room:this.defaultRoom(t),n=t.settings.theme,l="purple"===n?"purple":"dark"===n||"auto"===n&&this.hass.themes?.darkMode?"dark":"light",c={hass:i,config:t,t:Os(a),lang:a,rtl:"ar"===a,dark:"light"!==l,palette:l,phone:this.phone,isAdmin:!!this.hass.user?.is_admin&&(!this.kiosk||this.unlocked)&&!this.previewConfig,editing:!!this.draft,kiosk:this.kiosk,setKiosk:t=>this.setKiosk(t),assetBase:this.panel?.config?.asset_base??"/smartnest_pro_static/static/",room:r,selectRoom:t=>{this.room=t,this.phone?this.openRoomSheet(t):this.panelOpen=!0},update:t=>{const e=os(this.draft??this.config);t(e),this.draft=e,this.persistDraft()},showSheet:t=>this.sheet=t,closeSheet:()=>this.sheet=void 0,openEntity:t=>this.sheet={...Da(c,t),back:this.sheet},openLevel:t=>this.sheet={title:ps(this.hass,t),titleFor:e=>ps(e.hass,t),medium:on(this.hass.states[t]?.attributes),render:e=>U`<sn-level .ctx=${e} .entity=${t}></sn-level>`,back:this.sheet},toast:t=>this.toast(t),rename:(t,e)=>this.rename(t,e),saveLayout:t=>this.saveLayout(t)};return c}openRoomSheet(t){this.sheet={title:this.hass.areas?.[t]?.name??t,half:!0,render:e=>U`<sn-room-panel bare .ctx=${e} .area=${t}></sn-room-panel>`}}rename(t,e){this.saveLayout(s=>{const i={...s.names??{}};e&&e.trim()?i[t]=e.trim():delete i[t],s.names=i})}async saveLayout(t){if(this.draft){const e=os(this.draft);return t(e),this.draft=e,void this.persistDraft()}const e=this.layoutQueue.then(async()=>{if(!this.config||!this.hass||!this.isConnected)return;const e=os(this.config);t(e);const s=Os(Zs(e.settings.language,this.hass.language??"en"));try{await this.hass.callWS({type:"smartnest_pro/config/save",config:e}),this.config=e,this.toast(s("saved"))}catch(i){throw this.toast(s("save_failed")),i}});return this.layoutQueue=e.catch(()=>{}),e}toast(t){this.toastMsg=t,clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastMsg=void 0,2600)}startEdit(){const t=this.ctx().rtl,e=ln(this.draftKey());if(e)try{const s=JSON.parse(e);if(s.config&&window.confirm(t?"في مسودة محفوظة. بدك ترجع تكملها؟":"Restore your saved draft?"))return this.draft=is(s.config),this.draft.settings.kiosk_pin=this.config?.settings.kiosk_pin,void(this.draftSavedAt=s.saved_at)}catch{}this.draft=os(this.config)}cancelEdit(){this.draft=void 0,this.sheet=void 0,this.unlocked=!1,clearTimeout(this.draftTimer),cn(this.draftKey(),null),this.draftSavedAt=void 0}async save(t){if(this.draft)try{await this.hass.callWS({type:"smartnest_pro/config/save",config:this.draft}),this.config=this.draft,this.draft=void 0,clearTimeout(this.draftTimer),cn(this.draftKey(),null),this.draftSavedAt=void 0,this.sheet=void 0,this.unlocked=!1,this.toast(t("saved"))}catch{this.toast(t("save_failed"))}}greeting(t){const e=(new Date).getHours(),s=e<12?t.t("good_morning"):e<18?t.t("good_afternoon"):t.t("good_evening"),i=t.config.settings.greeting_name||this.hass.user?.name?.split(" ")[0]||t.config.settings.home_name;return U`<div class="greet"><span>${s}</span>${t.isAdmin?U`<button class="greet-name" title=${t.t("rename")} @click=${()=>this.renameTop(t)}>${i}</button>`:U`<strong>${i}</strong>`}</div>`}renameTop(t){t.showSheet({title:t.t("names_on_top"),render:t=>U`
        ${Qs(t.t("greeting_name"),t.config.settings.greeting_name??"",e=>t.saveLayout(t=>t.settings.greeting_name=e.trim()||void 0))}
        ${Qs(t.t("dashboard_title"),t.config.settings.title??"",e=>t.saveLayout(t=>t.settings.title=e.trim()||void 0))}
        <p style="margin:0;font-size:13px;color:var(--sn-text-dim)">${t.t("names_on_top_hint")}</p>
      `})}weatherChip(t){const e=Ua(t),s=e?t.hass.states[e]:void 0;return e&&s&&"number"==typeof s.attributes.temperature?U`<button
      class="eco wx"
      @click=${()=>t.showSheet({title:t.t("weather"),icon:Wa(s.state),render:t=>U`<sn-weather-view .ctx=${t} .entity=${e}></sn-weather-view>`})}
    >
      <span class="leaf">${js(Wa(s.state,Ba(t.hass)),18)}</span>${Math.round(s.attributes.temperature)}°
    </button>`:K}ecoChip(t){const e=t.config.home.solar_power;if(!e)return K;const s=ms(this.hass.states[e]);return void 0===s?K:U`<span class="eco ${s>.05?"lit":""}"
      ><span class="leaf">${js(oe,16)}</span>${t.t("eco_solar",{kw:s.toFixed(1)})}</span
    >`}search(t){const e=this.query.trim().toLowerCase(),s=e?[...fs(t.hass).filter(t=>t.name.toLowerCase().includes(e)).map(e=>({key:e.area_id,label:e.name,icon:Rt,go:()=>(t.selectRoom(e.area_id),this.page=this.phone?this.page:"rooms")})),...Object.keys(t.hass.states).filter(s=>ps(t.hass,s).toLowerCase().includes(e)).slice(0,8).map(e=>({key:e,label:ps(t.hass,e),icon:ce,go:()=>t.openEntity(e)}))].slice(0,10):[];return U`<div class="search">
      ${js(ce,18)}
      <input
        .value=${this.query}
        placeholder=${t.t("search")}
        @input=${t=>this.query=t.target.value}
        @keydown=${t=>"Escape"===t.key&&(this.query="")}
      />
      ${s.length?U`<div class="results glass">
            ${s.map(t=>U`<button
                @click=${()=>{this.query="",t.go()}}
              >
                ${js(t.icon,16)}${t.label}
              </button>`)}
          </div>`:K}
    </div>`}lockButton(t){return U`<button class="round lock" aria-label=${t.t("kiosk_mode")} title=${t.t("kiosk_mode")} @click=${()=>this.unlock(t)}>${js(le,18)}</button>`}editControls(t){if(this.kiosk&&!t.editing)return this.lockButton(t);const e=U`<button class="pill" @click=${()=>this.openCenter(t)}>${js(ee,18)}${t.rtl?"مركز البيت":"Home Center"}</button>`;return!t.isAdmin||this.phone?e:t.editing?U`<div class="edit-bar">
      ${e}
      <button class="pill" @click=${()=>{if(!this.draft)return;this.previewConfig=os(this.draft);const t=os(this.draft);delete t.settings.kiosk_pin,cn(this.draftKey(),JSON.stringify({config:t,saved_at:Date.now()})),this.draft=void 0,this.sheet=void 0}}>${t.rtl?"معاينة":"Preview"}</button>
      ${this.draftSavedAt?U`<small>${t.rtl?"مسودة محفوظة":"Draft saved"}</small>`:K}
      <button class="pill" @click=${()=>{var e;(e=t).showSheet({title:e.t("settings"),render:t=>{const e=t.config.settings;return U`
        ${Qs(t.t("home_name"),e.home_name,e=>t.update(t=>t.settings.home_name=e))}
        ${Js(t.t("language"),e.language,[["auto",t.t("lang_auto")],["en","English"],["ar","العربية"]],e=>t.update(t=>t.settings.language=e))}
        ${Js(t.t("theme"),e.theme,[["auto",t.t("theme_auto")],["light",t.t("theme_light")],["dark",t.t("theme_dark")],["purple",t.t("theme_purple")]],e=>t.update(t=>t.settings.theme=e))}
        ${Js(t.t("default_room"),e.default_room??"",[["",t.t("none")],...fs(t.hass).map(t=>[t.area_id,t.name])],e=>t.update(t=>t.settings.default_room=e||void 0))}
        ${Ys(t,t.t("weather"),t.config.home.weather,Ks(t,["weather"]),e=>t.update(t=>t.home.weather=e))}
        <h4>${t.t("energy_usage")}</h4>
        ${Ys(t,t.t("energy_meter"),t.config.home.energy,Ks(t,["sensor"],["energy"]),e=>t.update(t=>t.home.energy=e))}
        ${Ys(t,t.t("solar_power"),t.config.home.solar_power,Ks(t,["sensor"],["power"]),e=>t.update(t=>t.home.solar_power=e))}
        ${Ys(t,t.t("solar_energy"),t.config.home.solar_energy,Ks(t,["sensor"],["energy"]),e=>t.update(t=>t.home.solar_energy=e))}
        <h4>${t.t("floor_plan")}</h4>
        ${Gs(t,t.t("hidden_devices"),t.config.plan.hidden,[],e=>t.update(t=>t.plan.hidden=e))}
        <h4>${t.t("front_door")}</h4>
        ${Ys(t,t.t("doorbell"),t.config.door?.doorbell,Ks(t,["binary_sensor","event"]),e=>t.update(t=>t.door={...t.door,doorbell:e}))}
        ${Ys(t,t.t("door_camera"),t.config.door?.camera,Ks(t,["camera"]),e=>t.update(t=>t.door={...t.door,camera:e}))}
        ${Ys(t,t.t("door_open"),t.config.door?.open,Ks(t,["lock","script","button","input_button","switch"]),e=>t.update(t=>t.door={...t.door,open:e}))}
        <p style="margin:0;font-size:13px;color:var(--sn-text-dim)">${t.t("door_hint")}</p>
        <button style="justify-self:start;height:40px;padding:0 18px;border-radius:999px;border:1px solid var(--sn-glass-border);background:rgba(255,255,255,0.08);color:var(--sn-text);font:inherit;font-size:14px;cursor:pointer" @click=${()=>t.showSheet({...bi(t),back:void 0})}>${t.t("door_test")}</button>
        <h4>${t.t("kiosk_mode")}</h4>
        <label class="field">
          <span>${t.t("kiosk_pin")}</span>
          <input
            type="password"
            inputmode="numeric"
            autocomplete="off"
            maxlength="8"
            .value=${e.kiosk_pin??""}
            @input=${t=>{const e=t.target;e.value=e.value.replace(/\D/g,"")}}
            @change=${e=>t.update(t=>t.settings.kiosk_pin=e.target.value||void 0)}
          />
        </label>
        <label class="check">
          <input type="checkbox" .checked=${t.kiosk} ?disabled=${!e.kiosk_pin&&!t.kiosk} @change=${e=>t.setKiosk(e.target.checked)} />
          ${t.t("kiosk_on_device")}
        </label>
        <p style="margin:0;font-size:13px;color:var(--sn-text-dim)">${t.t(e.kiosk_pin?"kiosk_hint":"kiosk_need_pin")}</p>
        <h4>${t.t("display")}</h4>
        <label class="check">
          <input type="checkbox" .checked=${e.reduce_effects} @change=${e=>t.update(t=>t.settings.reduce_effects=e.target.checked)} />
          ${t.t("reduce_effects")}
        </label>
      `}})}}>${js(Ot,18)}${t.t("settings")}</button>
      <button class="pill" @click=${this.cancelEdit}>${js(Et,18)}${t.t("cancel")}</button>
      <button class="pill primary" @click=${()=>this.save(t.t)}>${js(Pt,18)}${t.t("save")}</button>
    </div>`:U`${e}<button class="pill" @click=${this.startEdit}>${js(me,18)}${t.t("edit")}</button>`}navItems(t){const e=(...e)=>Object.keys(t.hass.states).some(t=>e.includes(t.split(".")[0])),s=[{page:"home",icon:ee,label:t.t("home"),show:!0},{page:"rooms",icon:"M3 11H11V3H3M5 5H9V9H5M13 21H21V13H13M15 15H19V19H15M3 21H11V13H3M5 15H9V19H5M13 3V11H21V3M19 9H15V5H19Z",label:t.t("rooms"),show:!0},{page:"climate",icon:Ne,label:t.t("climate"),show:e("climate","fan")},{page:"lights",icon:"M7 19A2.93 2.93 0 0 0 7.17 20H6A1 1 0 0 1 5 19V18H7M10 19A1 1 0 0 0 11 20H13A1 1 0 0 0 14 19V18H10M4 16A1 1 0 0 0 5 17H7V14.88A6.92 6.92 0 0 1 5 10A6.79 6.79 0 0 1 5.68 7A4 4 0 0 0 4 14.45M17 19A2.93 2.93 0 0 1 16.83 20H18A1 1 0 0 0 19 19V18H17M17 10A5 5 0 0 1 15 14V16A1 1 0 0 1 14 17H10A1 1 0 0 1 9 16V14A5 5 0 1 1 17 10M15 10A3 3 0 1 0 11 12.82V15H13V12.82A3 3 0 0 0 15 10M18.32 7A6.79 6.79 0 0 1 19 10A6.92 6.92 0 0 1 17 14.88V17H19A1 1 0 0 0 20 16V14.45A4 4 0 0 0 18.32 7Z",label:t.t("lights"),show:e("light")},{page:"robot",icon:$e,label:t.t("robot"),show:e("vacuum","lawn_mower")},{page:"family",icon:yt,label:t.t("family"),show:e("person")},{page:"energy",icon:ae,label:t.t("energy"),show:!0},{page:"security",icon:Ae,label:t.t("security"),show:e("lock","alarm_control_panel","camera","binary_sensor")},{page:"media",icon:"M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z",label:t.t("media"),show:e("media_player")}],i=ns(t.hass),o=s.filter(t=>t.show&&(!i.simple_mode||["home","rooms","lights","climate"].includes(t.page)));return i.page_order.length&&o.sort((t,e)=>{const s=t=>{const e=i.page_order.indexOf(t);return e<0?99:e};return s(t.page)-s(e.page)}),o}go(t){t!==this.page&&(this.navDir=this.navOrder.indexOf(t)>=this.navOrder.indexOf(this.page)?1:-1),this.page=t,this.sheet=void 0,this.renderRoot.querySelector("main")?.scrollTo({top:0})}animated(t){return xt(this.page,U`<div class="page" style="--dir: ${this.navDir}">${t}</div>`)}renderPage(t){switch(this.page){case"rooms":return U`<sn-rooms-page .ctx=${t}></sn-rooms-page>`;case"climate":return U`<sn-climate-page .ctx=${t}></sn-climate-page>`;case"lights":return U`<sn-lights-page .ctx=${t}></sn-lights-page>`;case"robot":return U`<sn-robot-page .ctx=${t}></sn-robot-page>`;case"family":return U`<sn-family-page .ctx=${t}></sn-family-page>`;case"energy":return U`<sn-energy-page .ctx=${t}></sn-energy-page>`;case"security":return U`<sn-security-page .ctx=${t}></sn-security-page>`;case"media":return U`<sn-media-page .ctx=${t}></sn-media-page>`;default:return this.phone?this.homePhone(t):this.homeWide(t)}}tabbar(t){const e=this.navItems(t),s=e.filter(t=>an.includes(t.page)),i=e.filter(t=>!an.includes(t.page)),o=i.some(t=>t.page===this.page),a=s.length+(i.length?1:0),r=o?s.length:s.findIndex(t=>t.page===this.page);return U`<nav class="tabbar glass">
      <span
        class="tab-ind"
        style="width: calc((100% - 16px) / ${a}); transform: translateX(${100*r*(t.rtl?-1:1)}%); opacity: ${r<0?0:1}"
      ></span>
      ${s.map(t=>U`<button class=${this.page===t.page?"on":""} @click=${()=>this.go(t.page)}>${js(t.icon,22)}<span>${t.label}</span></button>`)}
      ${i.length?U`<button
            class=${o?"on":""}
            @click=${()=>this.sheet={title:t.t("more"),render:()=>U`<div class="more-grid">
                  ${i.map(t=>U`<button class=${this.page===t.page?"on":""} @click=${()=>this.go(t.page)}>
                      <span>${js(t.icon,26)}</span>${t.label}
                    </button>`)}
                </div>`}}
          >
            ${js(o?i.find(t=>t.page===this.page).icon:"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",22)}<span>${o?i.find(t=>t.page===this.page).label:t.t("more")}</span>
          </button>`:K}
    </nav>`}homeWide(t){return U`<div class="home-plan">
      <sn-floorplan class="plan" .ctx=${t} @unfocus=${()=>this.panelOpen=!1}></sn-floorplan>
      <div class="plan-top">
        ${this.greeting(t)}
        <sn-scene-bar .ctx=${t}></sn-scene-bar>
      </div>
      ${this.panelOpen&&t.room?U`<aside class="room-float">
            <button class="round close" aria-label=${t.t("cancel")} @click=${this.closePanel}>${js(Et,18)}</button>
            <sn-room-panel .ctx=${t} .area=${t.room}></sn-room-panel>
          </aside>`:K}
    </div>`}homePhone(t){const e=t.config.pages.rooms?.hidden??[],s=fs(t.hass).filter(t=>!e.includes(t.area_id));return U`<div class="home-phone">
      <sn-scene-bar .ctx=${t}></sn-scene-bar>
      <sn-floorplan class="plan" .ctx=${t}></sn-floorplan>
      ${s.length?U`<div class="room-chips">
            ${s.map(e=>{const s=$s(t.hass,e.area_id,t.config.rooms[e.area_id]);return U`<button class="room-chip ${s.occupied?"occ":""}" @click=${()=>t.selectRoom(e.area_id)}>
                <b>${e.name}</b>
                <span>${[void 0!==s.temperature?`${s.temperature.toFixed(1)}°`:"",s.people?`${s.people} 👤`:""].filter(Boolean).join(" · ")||"—"}</span>
              </button>`})}
          </div>`:K}
    </div>`}render(){if(!1===this.licenseValid){const t="ar"===Zs("auto",this.hass?.language??"en");return U`<div class="center" dir=${t?"rtl":"ltr"} style="padding:24px;text-align:center;gap:16px;flex-direction:column">
        <strong>${t?"يلزم تفعيل SmartNest":"SmartNest activation required"}</strong>
        <p>${this.hass?.user?.is_admin?t?"تحقّق من الاتصال، ثم افتح الإعدادات ← الأجهزة والخدمات ← SmartNest ← إعادة التهيئة لإدخال الترخيص.":"Check your connection, then open Settings → Devices & services → SmartNest → Reconfigure to enter your license.":t?"تواصل مع مسؤول المنزل للتحقق من الاتصال وترخيص SmartNest.":"Contact your home administrator to check the connection and SmartNest license."}</p>
        <button class="pill" @click=${()=>{this.checkLicense()}}>${t?"إعادة المحاولة":"Retry"}</button>
        <a href="/config/integrations/integration/smartnest_pro">${t?"إعدادات الإضافة":"Integration settings"}</a>
      </div>`}if(this.loadError)return U`<div class="center">${this.loadError}<button class="pill" @click=${()=>this.load()}>↻</button></div>`;if(!this.hass||!this.live)return U`<div class="center"><div class="spinner"></div></div>`;const t=this.ctx();if(this.accessScope?.guest_expired)return U`<div class="center" dir=${t.rtl?"rtl":"ltr"}>${t.rtl?"انتهت صلاحية دخول الضيف. تواصل مع مسؤول البيت.":"Guest access has expired. Contact the home administrator."}</div>`;const e=!t.config.experience?.setup_completed&&!t.config.plan.floors.length&&!t.config.settings.home_name;if(t.isAdmin&&(this.setupOpen||e))return U`<sn-onboarding .ctx=${t} .cancel=${e?void 0:()=>{this.setupOpen=!1}} .complete=${async t=>{await this.hass.callWS({type:"smartnest_pro/config/save",config:t}),this.config=t,this.setupOpen=!1,this.openCenter(this.ctx(),"help")}}></sn-onboarding>`;const s=ns(t.hass);this.style.setProperty("--sn-user-scale",String(s.font_scale)),this.style.setProperty("zoom",String(s.font_scale));const i=s.high_contrast?{"--sn-text":t.dark?"#ffffff":"#101810","--sn-text-dim":t.dark?"#eeeeee":"#293329","--sn-glass":t.dark?"#111911":"#ffffff","--sn-glass-strong":t.dark?"#111911":"#ffffff","--sn-glass-border":t.dark?"#aabbaa":"#354535"}:{};for(const a of["--sn-text","--sn-text-dim","--sn-glass","--sn-glass-strong","--sn-glass-border"]){const t=i[a];t?this.style.setProperty(a,t):this.style.removeProperty(a)}this.toggleAttribute("high-contrast",s.high_contrast),t.config.settings,this.toggleAttribute("dark","light"!==t.palette),this.setAttribute("palette",t.palette),this.toggleAttribute("lowfx",function(t){if("light"===t.settings.performance)return!0;if("high"===t.settings.performance)return!1;const e=navigator;return!!t.settings.reduce_effects||!!e.connection?.saveData||void 0!==e.deviceMemory&&e.deviceMemory<=4||navigator.hardwareConcurrency<=4}(t.config)),this.toggleAttribute("phone",this.phone),this.dir=t.rtl?"rtl":"ltr",this.lang=t.lang,this.navOrder=this.navItems(t).map(t=>t.page),this.navOrder.includes(this.page)||(this.page="home");const o=this.renderPage(t);return U`
      <div class="bg"></div>
      ${this.phone?U`<div class="shell-phone">
            <header class="top-phone">
              ${this.narrow&&!this.kiosk?U`<button class="round" aria-label=${t.t("open_menu")} @click=${()=>this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))}>${js(pe)}</button>`:K}
              ${this.greeting(t)} ${this.weatherChip(t)} ${this.ecoChip(t)}<button class="round" aria-label=${t.rtl?"مركز البيت":"Home Center"} @click=${()=>this.openCenter(t)}>${js(ee,18)}</button>
              ${this.kiosk?U`<span class="spacer"></span>${this.lockButton(t)}`:K}
            </header>
            <main>${this.animated(o)}</main>
            ${this.tabbar(t)}
          </div>`:U`<div class="shell">
            <div class="brand">
              ${this.narrow&&!this.kiosk?U`<button class="round" aria-label=${t.t("open_menu")} @click=${()=>this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))}>${js(pe)}</button>`:U`<svg class="logo" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z"></path></svg>`}
              <span>${t.config.settings.title||"SmartNest"}</span>
            </div>
            <header class="top">
              ${this.search(t)} ${this.weatherChip(t)} ${this.ecoChip(t)}
              <span class="spacer"></span>
              ${this.editControls(t)}
            </header>
            <nav class="rail glass">
              <div class="rail-scroll">
                <span class="ind" style="transform: translateY(${58*this.navItems(t).findIndex(t=>t.page===this.page)}px)"></span>
                ${this.navItems(t).map(t=>U`<button class=${this.page===t.page?"on":""} aria-label=${t.label} title=${t.label} @click=${()=>this.go(t.page)}>
                    ${js(t.icon,20)}
                  </button>`)}
              </div>
            </nav>
            <main>${this.animated(o)}</main>
          </div>`}
      ${this.previewConfig?U`<div role="status" style="position:fixed;top:12px;inset-inline:12px;z-index:101;background:#284c3b;color:#fff;padding:12px;border-radius:14px;display:flex;gap:12px;align-items:center;justify-content:center">${t.rtl?"معاينة خاصة — التصميم لم يُنشر بعد":"Private preview — changes have not been published"}<button class="pill" @click=${()=>{this.draft=this.previewConfig,this.previewConfig=void 0}}>${t.rtl?"رجوع للتعديل":"Back to editing"}</button><button class="pill" @click=${()=>{this.previewConfig=void 0,this.sheet=void 0}}>${t.rtl?"إغلاق المعاينة":"Close preview"}</button></div>`:K}
      ${this.actionState?U`<div class="action-status" role="status" style="position:fixed;bottom:78px;inset-inline:20px;z-index:100;display:flex;gap:12px;justify-content:center;align-items:center;background:var(--sn-panel,#fff);color:var(--sn-text);padding:12px;border-radius:14px;box-shadow:0 4px 25px #0002">${this.actionState}${this.failedAction?U`<button class="pill" @click=${()=>{this.failedAction?.().catch(()=>{})}}>${t.rtl?"إعادة المحاولة":"Retry"}</button>`:K}</div>`:K}
      <sn-sheet .spec=${this.sheet} .ctx=${t} ?phone=${this.phone} @close=${()=>this.sheet=this.sheet?.back}></sn-sheet>
      ${this.toastMsg?U`<div class="toast glass">${this.toastMsg}</div>`:K}
      ${this.saver?U`<sn-screensaver .ctx=${t} @wake=${()=>this.wake()}></sn-screensaver>`:K}
    `}};dn.styles=[Us,Bs,n`
      :host {
        display: block;
        position: relative;
        /* dvh: the visible height on iPad and phones, so the panel never sits taller than the screen and drifts. */
        min-height: 100vh;
        height: 100vh;
        min-height: 100dvh;
        height: 100dvh;
        overflow: hidden;
        color: var(--sn-text-on-bg);
      }
      .bg {
        position: absolute;
        inset: 0;
        background: var(--sn-bg);
        z-index: 0;
      }
      .center {
        position: relative;
        display: grid;
        place-items: center;
        gap: 12px;
        height: 100%;
        background: var(--sn-bg);
      }
      .spinner {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.25);
        border-top-color: #fff;
        animation: spin 0.9s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* ---------- wide: rail + top bar + page ---------- */
      .shell {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 72px 1fr;
        grid-template-rows: 72px 1fr;
        gap: 12px 24px;
        height: 100%;
        padding: 18px 24px 24px 20px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 22px;
        font-weight: 500;
        white-space: nowrap;
        color: var(--sn-text-on-bg);
      }
      .logo {
        width: 34px;
        height: 34px;
        color: var(--sn-accent-strong);
        filter: drop-shadow(0 0 10px var(--sn-accent-glow));
      }
      .top {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
        padding-inline-start: 110px;
      }
      .spacer {
        flex: 1;
      }
      .search {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        width: min(380px, 40%);
        height: 48px;
        padding: 0 18px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        color: var(--sn-text-on-bg-dim);
      }
      .search input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: 0;
        background: none;
        color: var(--sn-text-on-bg);
        font: inherit;
        font-size: 14px;
      }
      .search input::placeholder {
        color: var(--sn-text-on-bg-dim);
      }
      .results {
        position: absolute;
        top: 56px;
        inset-inline: 0;
        z-index: 20;
        display: grid;
        padding: 6px;
        background: var(--sn-glass-strong);
        border-radius: 20px;
      }
      .results button {
        all: unset;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 14px;
        cursor: pointer;
        font-size: 14px;
      }
      .results button:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .eco {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        height: 48px;
        padding: 0 18px 0 6px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        font-size: 14px;
        white-space: nowrap;
        color: var(--sn-text-on-bg);
      }
      .leaf {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.35);
      }
      .wx {
        cursor: pointer;
        font: inherit;
        font-size: 15px;
      }
      .wx .leaf {
        color: #ffd27a;
      }
      :host(:not([dark])) .wx .leaf {
        color: #b9771a;
      }
      .eco.lit .leaf {
        background: rgba(181, 220, 143, 0.35);
        box-shadow: 0 0 14px var(--sn-accent-glow);
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: rgba(255, 255, 255, 0.16);
        color: var(--sn-text-on-bg);
        font-size: 14px;
        cursor: pointer;
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
      }
      .pill.primary {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
      .edit-bar {
        display: flex;
        gap: 8px;
      }
      /*
       * The glass pill never scrolls itself: a blurred, rounded box that scrolls gets a square compositing layer
       * drawn over its buttons. The scrolling happens in .rail-scroll inside it.
       */
      .rail {
        align-self: start;
        max-height: 100%;
        display: flex;
        /* 48px buttons + 8px padding each side + the 1px glass border each side. */
        width: 66px;
        padding: 8px;
        border-radius: 33px;
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 255, 255, 0.25);
        overflow: hidden;
      }
      .rail-scroll {
        position: relative;
        display: grid;
        gap: 10px;
        justify-items: center;
        align-content: start;
        width: 100%;
        max-height: 100%;
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-width: none;
        border-radius: 24px;
      }
      .rail-scroll::-webkit-scrollbar {
        display: none;
      }
      .ind {
        position: absolute;
        top: 0;
        left: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.35);
        transition: transform 0.45s cubic-bezier(0.3, 1.3, 0.5, 1);
      }
      .rail button {
        position: relative;
        z-index: 1;
        transition: color 0.3s ease;
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid transparent;
        background: none;
        color: var(--sn-text-on-bg);
        cursor: pointer;
      }
      .rail button.on {
        color: #1d1b19;
      }
      .rail button:not(.on):hover {
        background: rgba(255, 255, 255, 0.12);
      }

      /* Page change: the new page rises in from the side of the menu it came from. */
      .page {
        animation: page-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }
      .shell .page {
        height: 100%;
        --from: translate3d(0, calc(var(--dir) * 22px), 0) scale(0.985);
      }
      .shell-phone .page {
        --from: translate3d(calc(var(--dir) * 32px), 0, 0);
      }
      :host([dir="rtl"]) .shell-phone .page {
        --from: translate3d(calc(var(--dir) * -32px), 0, 0);
      }
      @keyframes page-in {
        /* No filter here: a filtered ancestor would switch off the cards' glass blur for the length of the animation. */
        from {
          opacity: 0;
          transform: var(--from);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      main {
        position: relative;
        min-height: 0;
        min-width: 0;
      }
      .shell main {
        overflow: auto;
      }

      /* ---------- Home, wide: the plan is the page ---------- */
      .shell main {
        container-type: inline-size;
      }
      .home-plan {
        position: relative;
        height: 100%;
        min-height: 520px;
        border-radius: 32px;
        overflow: hidden;
        background: radial-gradient(90% 80% at 50% 45%, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0) 70%);
        border: 1px solid var(--sn-glass-border);
        box-shadow: inset 0 1px 0 var(--sn-glass-hi);
      }
      .home-plan .plan {
        position: absolute;
        inset: 0;
        border-radius: 0;
      }
      .plan-top {
        position: absolute;
        top: 18px;
        inset-inline: 22px;
        z-index: 6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        pointer-events: none;
      }
      .plan-top > * {
        pointer-events: auto;
      }
      .plan-top sn-scene-bar {
        min-width: 0;
        max-width: 64%;
      }
      .greet {
        display: grid;
        gap: 2px;
        color: var(--sn-text-on-bg);
        text-shadow: 0 2px 18px rgba(0, 0, 0, 0.18);
      }
      .greet span {
        font-size: 18px;
        font-weight: 300;
        color: var(--sn-text-on-bg-dim);
      }
      .greet-name {
        all: unset;
        cursor: pointer;
        font-size: 34px;
        font-weight: 400;
        letter-spacing: -0.02em;
        line-height: 1.05;
        border-bottom: 1px dashed transparent;
      }
      .greet-name:hover {
        border-bottom-color: currentColor;
      }
      .top-phone .greet-name {
        font-size: 28px;
      }
      .greet strong {
        font-size: 34px;
        font-weight: 400;
        letter-spacing: -0.02em;
        line-height: 1.05;
      }
      .room-float {
        position: absolute;
        top: 92px;
        /* Leaves the plan's zoom and rotate buttons uncovered below it. */
        bottom: 66px;
        inset-inline-end: 16px;
        z-index: 7;
        width: min(380px, 42%);
        display: flex;
        animation: slide-in 0.45s cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      :host([dir="rtl"]) .room-float {
        animation-name: slide-in-rtl;
      }
      .room-float sn-room-panel {
        flex: 1;
        min-height: 0;
      }
      .room-float .close {
        position: absolute;
        top: -14px;
        inset-inline-start: -14px;
        z-index: 2;
        width: 36px;
        height: 36px;
        background: var(--sn-glass-strong);
        color: var(--sn-text);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
      }
      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateX(40px);
        }
      }
      @keyframes slide-in-rtl {
        from {
          opacity: 0;
          transform: translateX(-40px);
        }
      }
      @media (max-width: 1180px) {
        .top {
          padding-inline-start: 60px;
        }
      }

      /* ---------- phone ---------- */
      .shell-phone {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .top-phone {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: calc(14px + env(safe-area-inset-top)) 16px 6px;
      }
      .top-phone .greet {
        flex: 1;
      }
      .top-phone .greet span {
        font-size: 15px;
      }
      .top-phone .greet strong {
        font-size: 28px;
      }
      .top-phone .eco {
        height: 40px;
        font-size: 12px;
        padding-inline-end: 12px;
      }
      .top-phone .leaf {
        width: 30px;
        height: 30px;
      }
      .top-phone .round {
        color: var(--sn-text-on-bg);
      }
      .shell-phone main {
        flex: 1;
        overflow: auto;
        padding: 0 16px calc(96px + env(safe-area-inset-bottom));
        -webkit-overflow-scrolling: touch;
      }
      .home-phone {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .home-phone .plan {
        height: 62vh;
        min-height: 320px;
        margin: 0 -16px;
        border-radius: 0;
      }
      .room-chips {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        margin: 0 -16px;
        padding: 0 16px 2px;
        scrollbar-width: none;
      }
      .room-chips::-webkit-scrollbar {
        display: none;
      }
      .room-chip {
        flex: none;
        display: grid;
        gap: 2px;
        min-width: 116px;
        padding: 10px 16px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: rgba(255, 255, 255, 0.16);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        color: var(--sn-text-on-bg);
        text-align: start;
        cursor: pointer;
      }
      .room-chip b {
        font-weight: 500;
        font-size: 14px;
      }
      .room-chip span {
        font-size: 12px;
        color: var(--sn-text-on-bg-dim);
      }
      .room-chip.occ {
        border-color: rgba(181, 220, 143, 0.7);
      }
      .tabbar {
        position: absolute;
        left: 16px;
        right: 16px;
        bottom: calc(12px + env(safe-area-inset-bottom));
        z-index: 10;
        display: flex;
        justify-content: space-around;
        padding: 8px;
        border-radius: 999px;
        background: var(--sn-glass-strong);
      }
      .tab-ind {
        position: absolute;
        top: 8px;
        bottom: 8px;
        inset-inline-start: 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.14);
        transition: transform 0.45s cubic-bezier(0.3, 1.25, 0.5, 1), opacity 0.2s ease;
      }
      .tabbar button {
        position: relative;
        z-index: 1;
        display: grid;
        justify-items: center;
        gap: 2px;
        flex: 1;
        padding: 6px 0;
        border: 0;
        border-radius: 999px;
        background: none;
        color: var(--sn-text-dim);
        font-size: 11px;
        cursor: pointer;
      }
      .tabbar button.on {
        color: var(--sn-text);
      }
      .tabbar button.on .icon {
        color: var(--sn-accent);
      }

      .toast {
        position: fixed;
        left: 50%;
        bottom: 28px;
        transform: translateX(-50%);
        z-index: 60;
        padding: 12px 22px;
        border-radius: 999px;
        background: var(--sn-glass-strong);
        font-size: 14px;
        animation: toast 0.25s ease;
      }
      :host([phone]) .toast {
        bottom: calc(96px + env(safe-area-inset-bottom));
      }
      @keyframes toast {
        from {
          opacity: 0;
          transform: translate(-50%, 10px);
        }
      }
    `],sn([gt({attribute:!1})],dn.prototype,"hass",2),sn([gt({type:Boolean})],dn.prototype,"narrow",2),sn([gt({attribute:!1})],dn.prototype,"panel",2),sn([mt()],dn.prototype,"config",2),sn([mt()],dn.prototype,"draft",2),sn([mt()],dn.prototype,"page",2),sn([mt()],dn.prototype,"navDir",2),sn([mt()],dn.prototype,"room",2),sn([mt()],dn.prototype,"sheet",2),sn([mt()],dn.prototype,"toastMsg",2),sn([mt()],dn.prototype,"panelOpen",2),sn([mt()],dn.prototype,"width",2),sn([mt()],dn.prototype,"query",2),sn([mt()],dn.prototype,"loadError",2),sn([mt()],dn.prototype,"kiosk",2),sn([mt()],dn.prototype,"unlocked",2),sn([mt()],dn.prototype,"saver",2),sn([mt()],dn.prototype,"licenseValid",2),sn([mt()],dn.prototype,"setupOpen",2),sn([mt()],dn.prototype,"previewConfig",2),sn([mt()],dn.prototype,"accessScope",2),sn([mt()],dn.prototype,"actionState",2),sn([mt()],dn.prototype,"draftSavedAt",2),dn=sn([pt("smartnest-pro-panel")],dn);const pn=Object.freeze(Object.defineProperty({__proto__:null,get SmartNestProPanel(){return dn}},Symbol.toStringTag,{value:"Module"}));export{K as A,Lo as B,Io as C,wo as D,Do as E,Wo as F,pn as G,Co as W,hs as a,U as b,fs as c,cs as d,is as e,os as f,ns as g,Bs as h,ct as i,qs as j,n as k,gt as l,ai as m,ps as n,li as o,ms as p,ri as q,mt as r,ls as s,pt as t,ni as u,ra as v,aa as w,Ao as x,ko as y,zo as z};
