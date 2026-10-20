const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new a(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:o,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:h}=Object,g=globalThis,u=g.trustedTypes,m=u?u.emptyScript:"",f=g.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(i){s=null}}return s}},x=(t,e)=>!o(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:a}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);a?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=h(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const t=this._$Eu(e,s);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),a=t.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i;const n=a.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,a){if(void 0!==t){const n=this.constructor;if(!1===i&&(a=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??x)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:a},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==a||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[v("elementProperties")]=new Map,$[v("finalized")]=new Map,f?.({ReactiveElement:$}),(g.reactiveElementVersions??=[]).push("2.1.2");const _=globalThis,w=t=>t,k=_.trustedTypes,C=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,H="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,V="?"+A,M=`<${V}>`,L=document,S=()=>L.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,E=Array.isArray,O="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,j=/>/g,D=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),Z=/'/g,U=/"/g,R=/^(?:script|style|textarea|title)$/i,N=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),F=N(1),I=N(2),W=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),Y=new WeakMap,q=L.createTreeWalker(L,129);function G(t,e){if(!E(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}class X{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let a=0,n=0;const r=t.length-1,o=this.parts,[l,c]=((t,e)=>{const s=t.length-1,i=[];let a,n=2===e?"<svg>":3===e?"<math>":"",r=P;for(let o=0;o<s;o++){const e=t[o];let s,l,c=-1,d=0;for(;d<e.length&&(r.lastIndex=d,l=r.exec(e),null!==l);)d=r.lastIndex,r===P?"!--"===l[1]?r=T:void 0!==l[1]?r=j:void 0!==l[2]?(R.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=D):void 0!==l[3]&&(r=D):r===D?">"===l[0]?(r=a??P,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,s=l[1],r=void 0===l[3]?D:'"'===l[3]?U:Z):r===U||r===Z?r=D:r===T||r===j?r=P:(r=D,a=void 0);const p=r===D&&t[o+1].startsWith("/>")?" ":"";n+=r===P?e+M:c>=0?(i.push(s),e.slice(0,c)+H+e.slice(c)+A+p):e+A+(-2===c?o:p)}return[G(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]})(t,e);if(this.el=X.createElement(l,s),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=q.nextNode())&&o.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(H)){const e=c[n++],s=i.getAttribute(t).split(A),r=/([.?@])?(.*)/.exec(e);o.push({type:1,index:a,name:r[2],strings:s,ctor:"."===r[1]?et:"?"===r[1]?st:"@"===r[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(A)&&(o.push({type:6,index:a}),i.removeAttribute(t));if(R.test(i.tagName)){const t=i.textContent.split(A),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],S()),q.nextNode(),o.push({type:2,index:++a});i.append(t[e],S())}}}else if(8===i.nodeType)if(i.data===V)o.push({type:2,index:a});else{let t=-1;for(;-1!==(t=i.data.indexOf(A,t+1));)o.push({type:7,index:a}),t+=A.length-1}a++}}static createElement(t,e){const s=L.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===W)return e;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const n=z(e)?void 0:e._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),void 0===n?a=void 0:(a=new n(t),a._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(e=J(t,a._$AS(t,e.values),a,i)),e}let K=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??L).importNode(e,!0);q.currentNode=i;let a=q.nextNode(),n=0,r=0,o=s[0];for(;void 0!==o;){if(n===o.index){let e;2===o.type?e=new Q(a,a.nextSibling,this,t):1===o.type?e=new o.ctor(a,o.name,o.strings,this,t):6===o.type&&(e=new at(a,this,t)),this._$AV.push(e),o=s[++r]}n!==o?.index&&(a=q.nextNode(),n++)}return q.currentNode=L,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}};class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),z(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>E(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=X.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new K(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new X(t)),e}k(t){E(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const a of t)i===e.length?e.push(s=new Q(this.O(S()),this.O(S()),this,this.options)):s=e[i],s._$AI(a),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,a){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=B}_$AI(t,e=this,s,i){const a=this.strings;let n=!1;if(void 0===a)t=J(this,t,e,0),n=!z(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const i=t;let r,o;for(t=a[0],r=0;r<a.length-1;r++)o=J(this,i[s+r],e,r),o===W&&(o=this._$AH[r]),n||=!z(o)||o!==this._$AH[r],o===B?t=B:t!==B&&(t+=(o??"")+a[r+1]),this._$AH[r]=o}n&&!i&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class it extends tt{constructor(t,e,s,i,a){super(t,e,s,i,a),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??B)===W)return;const s=this._$AH,i=t===B&&s!==B||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==B&&(s===B||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const nt=_.litHtmlPolyfillSupport;nt?.(X,Q),(_.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class ot extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let a=i._$litPart$;if(void 0===a){const t=s?.renderBefore??null;i._$litPart$=a=new Q(e.insertBefore(S(),t),t,void 0,s??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const lt=rt.litElementPolyfillSupport;lt?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:x},pt=(t=dt,e,s)=>{const{kind:i,metadata:a}=s;let n=globalThis.litPropertyMetadata.get(a);if(void 0===n&&globalThis.litPropertyMetadata.set(a,n=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const a=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,a,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const a=this[i];e.call(this,s),this.requestUpdate(i,a,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ht(t){return(e,s)=>"object"==typeof s?pt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function gt(t){return ht({...t,state:!0,attribute:!1})}var ut="M12,5A3.5,3.5 0 0,0 8.5,8.5A3.5,3.5 0 0,0 12,12A3.5,3.5 0 0,0 15.5,8.5A3.5,3.5 0 0,0 12,5M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M5.5,8A2.5,2.5 0 0,0 3,10.5C3,11.44 3.53,12.25 4.29,12.68C4.65,12.88 5.06,13 5.5,13C5.94,13 6.35,12.88 6.71,12.68C7.08,12.47 7.39,12.17 7.62,11.81C6.89,10.86 6.5,9.7 6.5,8.5C6.5,8.41 6.5,8.31 6.5,8.22C6.2,8.08 5.86,8 5.5,8M18.5,8C18.14,8 17.8,8.08 17.5,8.22C17.5,8.31 17.5,8.41 17.5,8.5C17.5,9.7 17.11,10.86 16.38,11.81C16.5,12 16.63,12.15 16.78,12.3C16.94,12.45 17.1,12.58 17.29,12.68C17.65,12.88 18.06,13 18.5,13C18.94,13 19.35,12.88 19.71,12.68C20.47,12.25 21,11.44 21,10.5A2.5,2.5 0 0,0 18.5,8M12,14C9.66,14 5,15.17 5,17.5V19H19V17.5C19,15.17 14.34,14 12,14M4.71,14.55C2.78,14.78 0,15.76 0,17.5V19H3V17.07C3,16.06 3.69,15.22 4.71,14.55M19.29,14.55C20.31,15.22 21,16.06 21,17.07V19H24V17.5C24,15.76 21.22,14.78 19.29,14.55M12,16C13.53,16 15.24,16.5 16.23,17H7.77C8.76,16.5 10.47,16 12,16Z",mt="M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",ft="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",vt="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",bt="M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z",xt="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",yt="M7,2V13H10V22L17,10H13L17,2H7Z",$t="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22",_t="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z",wt="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",kt="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",Ct="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z",Ht="M14,19H18V5H14M6,19H10V5H6V19Z",At="M8,5.14V19.14L19,12.14L8,5.14Z",Vt="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13",Mt="M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z",Lt="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z",St="M1,4.27L2.28,3L20.5,21.22L19.23,22.5L17,20.25C15.57,21.57 13.87,22.54 12,23C6.84,21.74 3,16.55 3,11V6.27L1,4.27M12,1L21,5V11C21,13.28 20.35,15.5 19.23,17.41L5.65,3.82L12,1Z",zt="M11.45,2V5.55L15,3.77L11.45,2M10.45,8L8,10.46L11.75,11.71L10.45,8M2,11.45L3.77,15L5.55,11.45H2M10,2H2V10C2.57,10.17 3.17,10.25 3.77,10.25C7.35,10.26 10.26,7.35 10.27,3.75C10.26,3.16 10.17,2.57 10,2M17,22V16H14L19,7V13H22L17,22Z",Et="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",Ot="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z",Pt="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,6.9C12.44,7.42 12.84,7.85 13.68,9.07C14.89,10.83 16,13.07 16,14.23C16,16.45 14.22,18.23 12,18.23C9.78,18.23 8,16.45 8,14.23C8,13.07 9.11,10.83 10.32,9.07C11.16,7.85 11.56,7.42 12,6.9Z";function Tt(t){const e={version:1,settings:{home_name:"",language:"auto",theme:"auto",reduce_effects:!1},hero:{pins:[]},home:{devices:[],scenes:[]},rooms:{}};if(!t||"object"!=typeof t)return e;const s=t;return{version:1,settings:{...e.settings,...s.settings??{}},hero:{image:s.hero?.image,pins:Array.isArray(s.hero?.pins)?s.hero.pins.filter(t=>t&&"number"==typeof t.x&&"number"==typeof t.y):[]},home:{...e.home,...s.home??{},devices:Array.isArray(s.home?.devices)?s.home.devices:[],scenes:Array.isArray(s.home?.scenes)?s.home.scenes:[]},rooms:s.rooms&&"object"==typeof s.rooms?s.rooms:{}}}const jt=t=>JSON.parse(JSON.stringify(t)),Dt={good_morning:"Good morning,",good_afternoon:"Good afternoon,",good_evening:"Good evening,",home:"Home",rooms:"Rooms",search:"Search for a room or device…",eco_solar:"Solar {kw} kW",eco_share:"Solar covers {pct}% today",energy_usage:"Energy Usage",vs_yesterday:"{pct}% vs yesterday",no_energy:"Pick an energy meter in edit mode",climate_comfort:"Climate & Comfort",target:"Target {t}°",mode_auto:"Auto",mode_cool:"Cold",mode_heat:"Warm",mode_eco:"Eco",mode_off:"Off",smart_devices:"Smart Devices",intensity:"Intensity",low:"Low",medium:"Medium",high:"High",volume:"Volume",customize_color:"Customize color",scenes:"Scenes",zonal_climate:"Zonal climate control",nodes_in_room:"Nodes connected in a room",taken_people:"Taken ({n} people)",taken:"Taken",free:"Free",humidity:"{h}% Humidity",devices_count:"{n} devices",devices_on:"{n} on",no_climate:"No thermostat in this room",no_nodes:"No devices in this room",not_configured:"Not set up yet",pick_in_edit:"Choose devices in edit mode",no_rooms:"No areas yet. Create them in Settings → Areas.",edit:"Edit",save:"Save",cancel:"Cancel",done:"Done",settings:"Settings",add_pin:"Add pin",change_image:"Change image",reset_image:"Remove image",upload_house:"Add a picture of your house",upload_house_hint:"Press Edit, then Change image",uploading:"Uploading…",upload_failed:"Upload failed",saved:"Saved",save_failed:"Couldn't save",pin:"Pin",pin_room:"Room",pin_device:"Device",label:"Label",delete:"Delete",none:"None",choose:"Choose…",search_entities:"Search…",home_name:"Home name",language:"Language",lang_auto:"Same as Home Assistant",theme:"Theme",theme_auto:"Follow Home Assistant",theme_light:"Light",theme_dark:"Dark",reduce_effects:"Reduce effects (no blur)",default_room:"Default room",energy_meter:"Energy meter (kWh)",solar_power:"Solar power now (W/kW)",solar_energy:"Solar energy meter (kWh)",climate_entity:"Thermostat",humidity_sensor:"Humidity sensor",favorite_devices:"Favorite devices",scene_buttons:"Scene buttons",room_settings:"Room settings",size_m2:"Size (m²)",occupancy_sensor:"Occupancy sensor",temperature_sensor:"Temperature sensor",hidden_devices:"Hidden devices",edit_on_bigger:"Editing works on a tablet or computer",locked:"Locked",unlocked:"Unlocked",on:"On",off:"Off",open_menu:"Menu",brightness:"Brightness",position:"Position",opened:"Open",closed:"Closed",open:"Open",close:"Close",stop:"Stop",more:"More",climate:"Climate",n_running:"{n} running",fans:"Fans",all_ac_off:"All off",robot:"Robot",battery:"Battery {n}%",start:"Start",pause:"Pause",dock:"Dock",locate:"Locate",fan_speed:"Suction",st_cleaning:"Cleaning",st_docked:"Docked",st_returning:"Returning",st_idle:"Idle",st_paused:"Paused",st_error:"Error",st_mowing:"Mowing",map:"Map",family:"Family",at_home:"{n} at home",home_state:"Home",away:"Away",energy:"Energy",today:"Today",yesterday:"Yesterday",this_month:"This month",last_7_days:"Last 7 days",top_consumers:"Using power now",solar_today:"Solar today",now_using:"Using now",security:"Security",locks:"Locks",doors_windows:"Doors & windows",cameras:"Cameras",alarm:"Alarm",all_locked:"All locked",all_closed:"All closed",n_open:"{n} open",n_unlocked:"{n} unlocked",arm_home:"Arm home",arm_away:"Arm away",disarm:"Disarm",lock_all:"Lock all",confirm_unlock:"Hold to unlock",st_open:"Open",st_closed:"Closed",lights:"Lights",n_lights_on:"{n} on",all_off:"All off",other:"Other",media:"Media",nothing_playing:"Nothing playing",n_playing:"{n} playing",back:"Back"},Zt={good_morning:"صباح الخير،",good_afternoon:"مساء الخير،",good_evening:"مساء الخير،",home:"الرئيسية",rooms:"الغرف",search:"دوّر على غرفة أو جهاز…",eco_solar:"الطاقة الشمسية {kw} ك.واط",eco_share:"الشمس غطّت {pct}% اليوم",energy_usage:"استهلاك الكهرباء",vs_yesterday:"{pct}% عن مبارح",no_energy:"اختار عداد الكهرباء بوضع التعديل",climate_comfort:"المناخ والراحة",target:"الهدف {t}°",mode_auto:"تلقائي",mode_cool:"تبريد",mode_heat:"تدفئة",mode_eco:"توفير",mode_off:"إطفاء",smart_devices:"الأجهزة الذكية",intensity:"الإضاءة",low:"منخفض",medium:"متوسط",high:"عالي",volume:"الصوت",customize_color:"اختار اللون",scenes:"المشاهد",zonal_climate:"تحكم بحرارة الغرفة",nodes_in_room:"الأجهزة بالغرفة",taken_people:"فيها {n} أشخاص",taken:"فيها حدا",free:"فاضية",humidity:"رطوبة {h}%",devices_count:"{n} أجهزة",devices_on:"{n} شغّالين",no_climate:"ما في مكيف بهالغرفة",no_nodes:"ما في أجهزة بهالغرفة",not_configured:"لسا مش مضبوط",pick_in_edit:"اختار الأجهزة بوضع التعديل",no_rooms:"ما في مناطق لسا. اعملها من الإعدادات ← المناطق.",edit:"تعديل",save:"حفظ",cancel:"إلغاء",done:"تم",settings:"الإعدادات",add_pin:"زيد علامة",change_image:"غيّر الصورة",reset_image:"شيل الصورة",upload_house:"حط صورة لبيتك",upload_house_hint:"اضغط تعديل، بعدين غيّر الصورة",uploading:"عم يرفع…",upload_failed:"ما زبط الرفع",saved:"انحفظ",save_failed:"ما انحفظ",pin:"علامة",pin_room:"غرفة",pin_device:"جهاز",label:"الاسم",delete:"احذف",none:"ولا شي",choose:"اختار…",search_entities:"دوّر…",home_name:"اسم البيت",language:"اللغة",lang_auto:"متل Home Assistant",theme:"الشكل",theme_auto:"متل Home Assistant",theme_light:"فاتح",theme_dark:"غامق",reduce_effects:"خفّف المؤثرات (بدون ضباب)",default_room:"الغرفة الأساسية",energy_meter:"عداد الكهرباء (ك.واط.س)",solar_power:"إنتاج الشمس هلأ (واط)",solar_energy:"عداد الطاقة الشمسية (ك.واط.س)",climate_entity:"المكيف",humidity_sensor:"حساس الرطوبة",favorite_devices:"الأجهزة المفضلة",scene_buttons:"أزرار المشاهد",room_settings:"إعدادات الغرفة",size_m2:"المساحة (م²)",occupancy_sensor:"حساس التواجد",temperature_sensor:"حساس الحرارة",hidden_devices:"أجهزة مخفية",edit_on_bigger:"التعديل بيصير من التابلت أو الكمبيوتر",locked:"مسكّر",unlocked:"مفتوح",on:"شغّال",off:"طافي",open_menu:"القائمة",brightness:"الإضاءة",position:"الفتحة",opened:"مفتوحة",closed:"مسكّرة",open:"افتح",close:"سكّر",stop:"وقّف",more:"المزيد",climate:"المكيفات",n_running:"{n} شغّالين",fans:"المراوح",all_ac_off:"طفّي الكل",robot:"الروبوت",battery:"البطارية {n}%",start:"ابدأ",pause:"وقّف مؤقت",dock:"ارجع للقاعدة",locate:"وينك؟",fan_speed:"قوة الشفط",st_cleaning:"عم ينظّف",st_docked:"بالقاعدة",st_returning:"راجع",st_idle:"واقف",st_paused:"موقّف",st_error:"في مشكلة",st_mowing:"عم يقص",map:"الخريطة",family:"العيلة",at_home:"{n} بالبيت",home_state:"بالبيت",away:"برّا",energy:"الكهرباء",today:"اليوم",yesterday:"مبارح",this_month:"هالشهر",last_7_days:"آخر 7 أيام",top_consumers:"شو عم يصرف هلأ",solar_today:"الشمس اليوم",now_using:"الاستهلاك هلأ",security:"الأمان",locks:"الأقفال",doors_windows:"الأبواب والشبابيك",cameras:"الكاميرات",alarm:"الإنذار",all_locked:"كلهم مسكّرين",all_closed:"كلهم مسكّرين",n_open:"{n} مفتوحين",n_unlocked:"{n} مش مقفولين",arm_home:"تفعيل بالبيت",arm_away:"تفعيل برّا",disarm:"إلغاء",lock_all:"اقفل الكل",confirm_unlock:"اضغط مطوّل لتفتح",st_open:"مفتوح",st_closed:"مسكّر",lights:"الإضاءة",n_lights_on:"{n} شغّالين",all_off:"طفّي الكل",other:"غير",media:"الميديا",nothing_playing:"ما في شي شغّال",n_playing:"{n} شغّالين",back:"رجوع"};function Ut(t){const e="ar"===t?Zt:Dt;return(t,s)=>{let i=e[t]??Dt[t]??t;if(s)for(const[e,a]of Object.entries(s))i=i.replace(`{${e}}`,String(a));return i}}const Rt=t=>t.split(".")[0],Nt=(t,e)=>{const s=t.states[e];return s?.attributes.friendly_name||e.split(".")[1]?.replace(/_/g," ")||e},Ft=t=>!!t&&!["off","unavailable","unknown","idle","standby","docked","closed","locked","paused"].includes(t.state),It=t=>!t||"unavailable"===t.state||"unknown"===t.state,Wt=t=>{if(!t)return;const e=parseFloat(t.state);return Number.isFinite(e)?e:void 0},Bt=t=>{const e=Wt(t);if(void 0===e)return;const s=String(t.attributes.unit_of_measurement??"W");return"kW"===s?e:"MW"===s?1e3*e:e/1e3},Yt=t=>Object.values(t.areas??{}).sort((t,e)=>t.name.localeCompare(e.name)),qt=(t,e)=>{const s=t.entities?.[e];if(s)return s.area_id?s.area_id:s.device_id?t.devices?.[s.device_id]?.area_id??void 0:void 0},Gt=(t,e,s=[])=>Object.values(t.entities??{}).filter(e=>!e.hidden&&!e.entity_category&&!s.includes(e.entity_id)&&t.states[e.entity_id]).filter(s=>qt(t,s.entity_id)===e).map(t=>t.entity_id),Xt=["light","switch","fan","media_player","vacuum","cover","lock","humidifier"],Jt=(t,e,s)=>e.find(e=>"sensor"===Rt(e)&&t.states[e]?.attributes.device_class===s);function Kt(t,e,s={}){const i=t.areas?.[e],a=Gt(t,e,s.hidden),n=s.climate??a.find(t=>"climate"===Rt(t)),r=n?t.states[n]:void 0,o=Wt(t.states[s.temperature??Jt(t,a,"temperature")??""])??r?.attributes.current_temperature,l=Wt(t.states[s.humidity??Jt(t,a,"humidity")??""])??r?.attributes.current_humidity,c=s.occupancy??a.find(e=>"binary_sensor"===Rt(e)&&["occupancy","presence","motion"].includes(t.states[e]?.attributes.device_class)),d=c?t.states[c]:void 0;let p,h;if(d){const t=Wt(d);void 0!==t&&"binary_sensor"!==Rt(c)?(p=t,h=t>0):h="on"===d.state}const g=a.filter(t=>Xt.includes(Rt(t)));return{id:e,name:i?.name??e,size:s.size_m2,climate:n,temperature:o,humidity:l,people:p,occupied:h,nodes:g,activeNodes:g.filter(e=>Ft(t.states[e])).length}}function Qt(t,e){const s=Rt(e),i=t.states[e];return"lock"===s?t.callService("lock","locked"===i?.state?"unlock":"lock",{entity_id:e}):"cover"===s?t.callService("cover","toggle",{entity_id:e}):"vacuum"===s?t.callService("vacuum","cleaning"===i?.state?"return_to_base":"start",{entity_id:e}):"media_player"===s?t.callService("media_player",Ft(i)?"turn_off":"turn_on",{entity_id:e}):"scene"===s||"script"===s?t.callService(s,"turn_on",{entity_id:e}):t.callService("homeassistant","toggle",{entity_id:e})}function te(t){const e=t?.attributes??{};return{target:"number"==typeof e.temperature?e.temperature:void 0,current:"number"==typeof e.current_temperature?e.current_temperature:void 0,min:"number"==typeof e.min_temp?e.min_temp:16,max:"number"==typeof e.max_temp?e.max_temp:30,step:"number"==typeof e.target_temp_step?e.target_temp_step:.5}}const ee=(t,e,s)=>t.callService("climate","set_temperature",{entity_id:e,temperature:s}),se=(t,e)=>Object.keys(t.states).filter(t=>Rt(t)===e).filter(e=>{const s=t.entities?.[e];return!s||!s.hidden&&!s.entity_category}).sort((e,s)=>Nt(t,e).localeCompare(Nt(t,s))),ie=(t,e)=>{const s=qt(t,e);return s?t.areas?.[s]?.name:void 0},ae=(t,e)=>{const s=t.entities?.[e]?.device_id;return s?Object.values(t.entities??{}).filter(i=>i.device_id===s&&i.entity_id!==e&&t.states[i.entity_id]).map(t=>t.entity_id):[]},ne=(t,e)=>{const s=Math.max(0,(Date.now()-Date.parse(t))/1e3),i=new Intl.RelativeTimeFormat(e,{numeric:"auto",style:"short"});return s<60?i.format(0,"second"):s<3600?i.format(-Math.round(s/60),"minute"):s<86400?i.format(-Math.round(s/3600),"hour"):i.format(-Math.round(s/86400),"day")};const re=n`
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
`,oe=n`
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
`,le=(t,e=20)=>F`<svg class="icon" width=${e} height=${e} viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex:none">
    ${I`<path fill="currentColor" d=${t}></path>`}
  </svg>`;function ce(t,e){const s=Rt(t),i=e?.attributes.device_class;return"light"===s?t.includes("ceiling")?"M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z":"M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z":"media_player"===s?"tv"===i||/tv|oled/i.test(t)?"M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z":"M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z":"vacuum"===s?Mt:"fan"===s?xt:"climate"===s?"M6.59,0.66C8.93,-1.15 11.47,1.06 12.04,4.5C12.47,4.5 12.89,4.62 13.27,4.84C13.79,4.24 14.25,3.42 14.07,2.5C13.65,0.35 16.06,-1.39 18.35,1.58C20.16,3.92 17.95,6.46 14.5,7.03C14.5,7.46 14.39,7.89 14.16,8.27C14.76,8.78 15.58,9.24 16.5,9.06C18.63,8.64 20.38,11.04 17.41,13.34C15.07,15.15 12.53,12.94 11.96,9.5C11.53,9.5 11.11,9.37 10.74,9.15C10.22,9.75 9.75,10.58 9.93,11.5C10.35,13.64 7.94,15.39 5.65,12.42C3.83,10.07 6.05,7.53 9.5,6.97C9.5,6.54 9.63,6.12 9.85,5.74C9.25,5.23 8.43,4.76 7.5,4.94C5.37,5.36 3.62,2.96 6.59,0.66M5,16H7A2,2 0 0,1 9,18V24H7V22H5V24H3V18A2,2 0 0,1 5,16M5,18V20H7V18H5M12.93,16H15L12.07,24H10L12.93,16M18,16H21V18H18V22H21V24H18A2,2 0 0,1 16,22V18A2,2 0 0,1 18,16Z":"lock"===s?"M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z":"cover"===s?"M20 19V3H4V19H2V21H22V19H20M16 9H18V11H16V9M14 11H6V9H14V11M18 7H16V5H18V7M14 5V7H6V5H14M6 19V13H14V14.82C13.55 15.14 13.25 15.66 13.25 16.25C13.25 17.22 14.03 18 15 18S16.75 17.22 16.75 16.25C16.75 15.66 16.45 15.13 16 14.82V13H18V19H6Z":"humidifier"===s?"M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z":"sensor"===s&&"power"===i?/solar|pv/i.test(t)?zt:yt:"sensor"===s&&"temperature"===i?Et:"switch"===s?"outlet"===i?"M16 7V3H14V7H10V3H8V7C7 7 6 8 6 9V14.5L9.5 18V21H14.5V18L18 14.5V9C18 8 17 7 16 7M16 13.67L13.09 16.59L12.67 17H11.33L10.92 16.59L8 13.67V9.09C8 9.06 8.06 9 8.09 9H15.92C15.95 9 16 9.06 16 9.09V13.67Z":"M17 6H7C3.69 6 1 8.69 1 12S3.69 18 7 18H17C20.31 18 23 15.31 23 12S20.31 6 17 6M17 16H7C4.79 16 3 14.21 3 12S4.79 8 7 8H17C19.21 8 21 9.79 21 12S19.21 16 17 16M17 9C15.34 9 14 10.34 14 12S15.34 15 17 15 20 13.66 20 12 18.66 9 17 9Z":$t}const de=n`
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
  input[type="number"] {
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
`;function pe(t,e,s){return Object.keys(t.hass.states).filter(t=>e.includes(Rt(t))).filter(e=>!s||s.includes(t.hass.states[e].attributes.device_class)).sort((e,s)=>Nt(t.hass,e).localeCompare(Nt(t.hass,s)))}function he(t,e,s,i,a){return F`<label class="field">
    <span>${e}</span>
    <select @change=${t=>a(t.target.value||void 0)}>
      <option value="" ?selected=${!s}>${t.t("none")}</option>
      ${s&&!i.includes(s)?F`<option value=${s} selected>${s}</option>`:B}
      ${i.map(e=>F`<option value=${e} ?selected=${e===s}>${Nt(t.hass,e)} · ${e}</option>`)}
    </select>
  </label>`}function ge(t,e,s,i,a){return F`<div class="field">
    <span>${e}</span>
    ${s.length?F`<div class="tags">
          ${s.map(e=>F`<span class="tag"
              >${Nt(t.hass,e)}
              <button aria-label=${t.t("delete")} @click=${()=>a(s.filter(t=>t!==e))}>
                ${le(ft,16)}
              </button></span
            >`)}
        </div>`:B}
    <select
      @change=${t=>{const e=t.target;e.value&&a([...s,e.value]),e.value=""}}
    >
      <option value="" selected>${t.t("choose")}</option>
      ${i.filter(t=>!s.includes(t)).map(e=>F`<option value=${e}>${Nt(t.hass,e)} · ${e}</option>`)}
    </select>
  </div>`}function ue(t,e,s,i){return F`<label class="field">
    <span>${t}</span>
    <select @change=${t=>i(t.target.value)}>
      ${s.map(([t,s])=>F`<option value=${t} ?selected=${t===e}>${s}</option>`)}
    </select>
  </label>`}function me(t,e,s,i="text"){return F`<label class="field">
    <span>${t}</span>
    <input type=${i} .value=${e} @change=${t=>s(t.target.value)} />
  </label>`}function fe(t,e){t.showSheet({title:`${t.t("room_settings")} · ${t.hass.areas?.[e]?.name??e}`,render:t=>{const s=t.config.rooms[e]??{},i=s=>t.update(t=>{const i=t.rooms[e]??={};s(i)}),a=Gt(t.hass,e);return F`
        ${me(t.t("size_m2"),s.size_m2?.toString()??"",t=>i(e=>e.size_m2=t?Number(t):void 0),"number")}
        ${he(t,t.t("climate_entity"),s.climate,pe(t,["climate"]),t=>i(e=>e.climate=t))}
        ${he(t,t.t("temperature_sensor"),s.temperature,pe(t,["sensor"],["temperature"]),t=>i(e=>e.temperature=t))}
        ${he(t,t.t("humidity_sensor"),s.humidity,pe(t,["sensor"],["humidity"]),t=>i(e=>e.humidity=t))}
        ${he(t,t.t("occupancy_sensor"),s.occupancy,pe(t,["binary_sensor","sensor"]).filter(e=>!e.startsWith("sensor.")||!t.hass.states[e].attributes.device_class),t=>i(e=>e.occupancy=t))}
        ${ge(t,t.t("hidden_devices"),s.hidden??[],a,t=>i(e=>e.hidden=t))}
      `}})}function ve(t,e){t.showSheet({title:t.t("pin"),render:t=>{const s=t.config.hero.pins.find(t=>t.id===e);if(!s)return F``;const i=s=>t.update(t=>{const i=t.hero.pins.find(t=>t.id===e);i&&s(i)}),a=s.entity?"entity":"area";return F`
        ${ue(t.t("pin"),a,[["area",t.t("pin_room")],["entity",t.t("pin_device")]],t=>i(e=>{"area"===t?e.entity=void 0:(e.area=void 0,e.entity=e.entity??"")}))}
        ${"area"===a?ue(t.t("pin_room"),s.area??"",[["",t.t("none")],...Yt(t.hass).map(t=>[t.area_id,t.name])],t=>i(e=>e.area=t||void 0)):he(t,t.t("pin_device"),s.entity||void 0,pe(t,[...Xt,"climate","sensor","binary_sensor","alarm_control_panel"]),t=>i(e=>e.entity=t??""))}
        ${me(t.t("label"),s.label??"",t=>i(e=>e.label=t||void 0))}
        <button
          class="danger"
          style="height:44px;padding:0 18px;border-radius:14px;border:0;background:#8a3b2e;color:#fff;font-size:15px;cursor:pointer"
          @click=${()=>{t.update(t=>t.hero.pins=t.hero.pins.filter(t=>t.id!==e)),t.closeSheet()}}
        >
          ${t.t("delete")}
        </button>
      `}})}function be(t,e){if(0!==t.button)return;const s=t.currentTarget,i=t.clientX,a=t.clientY,n=window.setTimeout(()=>{o(),s.addEventListener("click",xe,{capture:!0,once:!0}),navigator.vibrate?.(10),e()},450),r=t=>{Math.hypot(t.clientX-i,t.clientY-a)>8&&o()},o=()=>{clearTimeout(n),s.removeEventListener("pointermove",r),s.removeEventListener("pointerup",o),s.removeEventListener("pointercancel",o),s.removeEventListener("pointerleave",o)};s.addEventListener("pointermove",r),s.addEventListener("pointerup",o),s.addEventListener("pointercancel",o),s.addEventListener("pointerleave",o)}function xe(t){t.stopPropagation(),t.preventDefault()}const ye=t=>t.preventDefault();function $e(t,e){if(!e)return!1;const s=Rt(t);return"light"===s?(e.attributes.supported_color_modes??[]).some(t=>"onoff"!==t):"cover"===s&&(!!(4&(e.attributes.supported_features??0))||"number"==typeof e.attributes.current_position)}var _e=Object.defineProperty,we=Object.getOwnPropertyDescriptor,ke=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?we(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&_e(e,s,n),n};const Ce=(t,e)=>t.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0})),He=["hs","rgb","rgbw","rgbww","xy"];function Ae(t,e,s,i){const a=t.currentTarget,n=a.getBoundingClientRect(),r=t=>{const s=Math.min(1,Math.max(0,(t.clientX-n.left)/n.width));return e?1-s:s};a.setPointerCapture(t.pointerId);let o=r(t);s(o);const l=t=>s(o=r(t)),c=()=>{a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",c),a.removeEventListener("pointercancel",c),i(o)};a.addEventListener("pointermove",l),a.addEventListener("pointerup",c),a.addEventListener("pointercancel",c)}let Ve=class extends ot{constructor(){super(...arguments),this.live={}}setLive(t,e){const s={...this.live};void 0===e?delete s[t]:s[t]=e,this.live=s}head(t,e){return F`<div class="tile-head">
      <button class="name" @click=${()=>Qt(this.ctx.hass,t)}>${Nt(this.ctx.hass,t)}</button>
      <button class="round gear" aria-label=${this.ctx.t("settings")} @click=${()=>Ce(this,t)}>${le(Ot,18)}</button>
    </div>`}lamp(t,e){const{t:s,hass:i,rtl:a}=this.ctx,n=this.live[t],r=`clip-${t.replace(/\W/g,"_")}`,o=void 0!==n?Math.round(100*n):Ft(e)?Math.round((e.attributes.brightness??255)/255*100):0;return F`<div class="tile ${Ft(e)?"on":""}">
      ${this.head(t,e)}
      <div class="pct">${o}<small>%</small></div>
      <div class="sub">${s("intensity")}</div>
      <div
        class="ramp"
        @pointerdown=${e=>Ae(e,a,e=>this.setLive(t,e),e=>{i.callService("light","turn_on",{entity_id:t,brightness_pct:Math.max(1,Math.round(100*e))}),setTimeout(()=>this.setLive(t),1200)})}
      >
        <svg viewBox="0 0 100 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rg" x1="0" x2="1">
              <stop offset="0" stop-color="#b5dc8f" stop-opacity="0.9"></stop>
              <stop offset="1" stop-color="#e5f4d6"></stop>
            </linearGradient>
            <clipPath id=${r}><rect width=${o} height="60"></rect></clipPath>
          </defs>
          <polygon points="0,60 100,0 100,60" fill="rgba(255,255,255,0.08)"></polygon>
          <polygon points="0,60 100,0 100,60" fill="url(#rg)" clip-path="url(#${r})"></polygon>
        </svg>
        <div class="cols"><span></span><span></span><span></span></div>
      </div>
      <div class="labels"><span>${s("low")}</span><span>${s("medium")}</span><span>${s("high")}</span></div>
    </div>`}strip(t,e){const{t:s,hass:i,rtl:a}=this.ctx,n=this.live[t],r=void 0!==n?360*n:e.attributes.hs_color?.[0]??45,o=Ft(e);return F`<div class="tile ${o?"on":""}">
      ${this.head(t,e)}
      <div class="swatch" style="--c: hsl(${r} 80% 55%); opacity:${o?1:.45}"></div>
      <div
        class="hue"
        @pointerdown=${e=>Ae(e,a,e=>this.setLive(t,e),e=>{i.callService("light","turn_on",{entity_id:t,hs_color:[Math.round(360*e),85]}),setTimeout(()=>this.setLive(t),1200)})}
      >
        <span class="knob" style="inset-inline-start: calc(${r/360} * (100% - 26px))"></span>
      </div>
      <div class="sub center">${s("customize_color")}</div>
    </div>`}speaker(t,e){const{hass:s,rtl:i}=this.ctx,a=this.live[t]??("number"==typeof e.attributes.volume_level?e.attributes.volume_level:0);return F`<div class="tile ${Ft(e)?"on":""}">
      ${this.head(t,e)}
      <div
        class="vol"
        @pointerdown=${e=>Ae(e,i,e=>this.setLive(t,e),e=>{s.callService("media_player","volume_set",{entity_id:t,volume_level:Math.round(100*e)/100}),setTimeout(()=>this.setLive(t),1200)})}
      >
        <div class="fill" style="width:${100*a}%"></div>
        <div class="cols"><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="labels four"><span>20%</span><span>40%</span><span>60%</span><span>100%</span></div>
    </div>`}plain(t,e){const s=Ft(e);return F`<div class="tile ${s?"on":""}">
      ${this.head(t,e)}
      <div class="plain">
        <span class="big-ic">${le(ce(t,e),34)}</span>
        <button class="switch" ?on=${s} aria-pressed=${s} @click=${()=>Qt(this.ctx.hass,t)}></button>
      </div>
    </div>`}hold(t,e){t.target.closest(".ramp, .hue, .vol, .switch, .gear")||$e(e,this.ctx.hass.states[e])&&be(t,()=>this.ctx.openLevel(e))}tile(t){return F`<div class="hold" @pointerdown=${e=>this.hold(e,t)} @contextmenu=${ye}>${this.inner(t)}</div>`}inner(t){const e=this.ctx.hass.states[t];if(It(e))return F`<div class="tile off"><div class="tile-head"><span class="name">${Nt(this.ctx.hass,t)}</span></div><div class="empty">${this.ctx.t("not_configured")}</div></div>`;const s=Rt(t);return"light"===s&&(t=>(t.attributes.supported_color_modes??[]).some(t=>He.includes(t)))(e)?this.strip(t,e):"light"===s&&(t=>(t.attributes.supported_color_modes??[]).some(t=>"onoff"!==t))(e)?this.lamp(t,e):"media_player"===s&&void 0!==e.attributes.volume_level?this.speaker(t,e):this.plain(t,e)}render(){const{t:t,config:e,editing:s}=this.ctx,i=e.home.devices;return F`<div class="glass card">
      <div class="card-head">
        <span class="round">${le("M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z",20)}</span>
        <h3>${t("smart_devices")}</h3>
        ${s?F`<button class="round gear" aria-label=${t("settings")} @click=${()=>{var t;(t=this.ctx).showSheet({title:t.t("smart_devices"),render:t=>ge(t,t.t("favorite_devices"),t.config.home.devices,pe(t,Xt),e=>t.update(t=>t.home.devices=e))})}}>${le(vt,18)}</button>`:B}
      </div>
      ${i.length?F`<div class="row">${i.map(t=>this.tile(t))}</div>`:F`<div class="empty">${t("pick_in_edit")}</div>`}
    </div>`}};Ve.styles=[oe,n`
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
        min-height: 230px;
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
    `],ke([ht({attribute:!1})],Ve.prototype,"ctx",2),ke([gt()],Ve.prototype,"live",2),Ve=ke([ct("sn-devices-card")],Ve);var Me=Object.defineProperty,Le=Object.getOwnPropertyDescriptor,Se=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?Le(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&Me(e,s,n),n};let ze=class extends ot{constructor(){super(...arguments),this.phone=!1,this.full=!1,this.dragY=0,this.down=t=>{this.phone&&(this.startY=t.clientY,t.currentTarget.setPointerCapture(t.pointerId))},this.move=t=>{void 0!==this.startY&&(this.dragY=t.clientY-this.startY)},this.up=()=>{if(void 0===this.startY)return;const t=this.dragY;this.startY=void 0,this.dragY=0,t<-60?this.full=!0:t>80&&(this.full&&this.spec?.half?this.full=!1:this.close())}}willUpdate(t){t.has("spec")&&(this.full=!1)}close(){this.dispatchEvent(new CustomEvent("close"))}render(){const t=this.spec;if(!t)return B;const e=this.phone&&t.half&&!this.full;return F`
      <div class="scrim" @click=${this.close}></div>
      <section
        class="panel glass ${e?"half":""}"
        role="dialog"
        aria-label=${t.title}
        style=${this.dragY?`transform: translateY(${Math.max(this.dragY,-80)}px); transition: none`:""}
      >
        <header @pointerdown=${this.down} @pointermove=${this.move} @pointerup=${this.up} @pointercancel=${this.up}>
          ${this.phone?F`<div class="grab"></div>`:B}
          <h2>${t.title}</h2>
          <button class="round" aria-label="close" @click=${this.close}>${le(ft)}</button>
        </header>
        <div class="body">${t.render(this.ctx)}</div>
      </section>
    `}};ze.styles=[oe,de,n`
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
        background: rgba(20, 16, 12, 0.35);
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
      h2 {
        flex: 1;
        margin: 0;
        font-size: 20px;
        font-weight: 400;
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
    `],Se([ht({attribute:!1})],ze.prototype,"spec",2),Se([ht({type:Boolean,reflect:!0})],ze.prototype,"phone",2),Se([gt()],ze.prototype,"full",2),Se([gt()],ze.prototype,"dragY",2),Se([ht({attribute:!1})],ze.prototype,"ctx",2),ze=Se([ct("sn-sheet")],ze);var Ee=Object.defineProperty,Oe=Object.getOwnPropertyDescriptor,Pe=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?Oe(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&Ee(e,s,n),n};const Te=[0,25,50,75,100];let je=class extends ot{current(){const t=this.ctx.hass.states[this.entity];return t?"cover"===Rt(this.entity)?"number"==typeof t.attributes.current_position?t.attributes.current_position:"open"===t.state?100:0:Ft(t)?Math.round((t.attributes.brightness??255)/255*100):0:0}send(t){const{hass:e}=this.ctx,s=this.entity;this.live=t,"cover"===Rt(s)?e.callService("cover","set_cover_position",{entity_id:s,position:t}):0===t?e.callService("light","turn_off",{entity_id:s}):e.callService("light","turn_on",{entity_id:s,brightness_pct:t}),clearTimeout(this.clearTimer),this.clearTimer=window.setTimeout(()=>this.live=void 0,1500)}drag(t){const e=t.currentTarget,s=e.getBoundingClientRect(),i=t=>Math.round(100*Math.min(1,Math.max(0,(s.bottom-t.clientY)/s.height)));e.setPointerCapture(t.pointerId),clearTimeout(this.clearTimer),this.live=i(t);const a=t=>this.live=i(t),n=()=>{e.removeEventListener("pointermove",a),e.removeEventListener("pointerup",n),e.removeEventListener("pointercancel",n),this.send(this.live??0)};e.addEventListener("pointermove",a),e.addEventListener("pointerup",n),e.addEventListener("pointercancel",n)}key(t){const e=this.live??this.current();if("ArrowUp"===t.key||"ArrowRight"===t.key)this.send(Math.min(100,e+5));else{if("ArrowDown"!==t.key&&"ArrowLeft"!==t.key)return;this.send(Math.max(0,e-5))}t.preventDefault()}render(){const{t:t,hass:e}=this.ctx,s=this.entity,i=e.states[s];if(!i)return F`<div class="empty">${t("not_configured")}</div>`;const a="cover"===Rt(s),n=this.live??this.current(),r=t=>()=>e.callService("cover",t,{entity_id:s});return F`
      <div class="wrap">
        <div class="value">${n}<small>%</small></div>
        <div class="sub">${t(a?0===n?"closed":100===n?"opened":"position":0===n?"off":"brightness")}</div>
        <div
          class="track ${a?"cover":""}"
          role="slider"
          tabindex="0"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${n}
          aria-label=${t(a?"position":"brightness")}
          @pointerdown=${this.drag}
          @keydown=${this.key}
        >
          <div class="fill" style="height:${n}%"></div>
          <span class="ic">${le(ce(s,i),30)}</span>
        </div>
        <div class="presets">
          ${Te.map(t=>F`<button class=${t===n?"on":""} @click=${()=>this.send(t)}>${t}%</button>`)}
        </div>
        ${a?F`<div class="actions">
              <button class="round" aria-label=${t("open")} @click=${r("open_cover")}>${le("M4.08,11.92L12,4L19.92,11.92L18.5,13.33L13,7.83V22H11V7.83L5.5,13.33L4.08,11.92M12,4H22V2H2V4H12Z")}</button>
              <button class="round" aria-label=${t("stop")} @click=${r("stop_cover")}>${le("M18,18H6V6H18V18Z")}</button>
              <button class="round" aria-label=${t("close")} @click=${r("close_cover")}>${le("M19.92,12.08L12,20L4.08,12.08L5.5,10.67L11,16.17V2H13V16.17L18.5,10.66L19.92,12.08M12,20H2V22H22V20H12Z")}</button>
            </div>`:F`<div class="actions">
              <button class="round ${Ft(i)?"lit":""}" aria-label=${t("on")} @click=${()=>e.callService("light","toggle",{entity_id:s})}>${le(Vt)}</button>
            </div>`}
      </div>
    `}};je.styles=[oe,n`
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
    `],Pe([ht({attribute:!1})],je.prototype,"ctx",2),Pe([ht()],je.prototype,"entity",2),Pe([gt()],je.prototype,"live",2),je=Pe([ct("sn-level")],je);var De=Object.defineProperty,Ze=Object.getOwnPropertyDescriptor,Ue=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?Ze(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&De(e,s,n),n};let Re=class extends ot{constructor(){super(...arguments),this.uploading=!1,this.moved=!1,this.resize=new ResizeObserver(()=>this.measure())}connectedCallback(){super.connectedCallback(),this.resize.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.resize.disconnect()}measure(){const t=this.img,e=this.renderRoot.querySelector(".stage");if(!t?.naturalWidth||!e)return;const s=Math.min(e.clientWidth/t.naturalWidth,e.clientHeight/t.naturalHeight),i=Math.floor(t.naturalWidth*s),a=Math.floor(t.naturalHeight*s);i===this.fit?.w&&a===this.fit?.h||(this.fit={w:i,h:a})}get img(){return this.renderRoot.querySelector("img.house")}placeholder(){const{t:t,isAdmin:e,phone:s}=this.ctx;return F`<div class="placeholder glass">
      ${le("M6,21V8A2,2 0 0,1 8,6L16,3V6A2,2 0 0,1 18,8V21H12V16H8V21H6M14,19H16V16H14V19M8,13H10V9H8V13M12,13H16V9H12V13Z",54)}
      <span>${t("upload_house")}</span>
      ${e&&!s?F`<small>${t("upload_house_hint")}</small>`:B}
    </div>`}status(t){const{hass:e,config:s,t:i}=this.ctx;if(t.area){const a=Kt(e,t.area,s.rooms[t.area]);return[void 0!==a.temperature?`${a.temperature.toFixed(1)}°C`:"",a.nodes.length?i("devices_count",{n:a.nodes.length}):""].filter(Boolean).join(" · ")||void 0}if(t.entity){const s=e.states[t.entity];if(It(s))return;const a=Rt(t.entity);if("lock"===a)return"locked"===s.state?i("locked"):i("unlocked");if("sensor"===a&&"power"===s.attributes.device_class){const t=Bt(s);return void 0!==t?`${t.toFixed(1)}kW`:void 0}return"sensor"===a?`${s.state}${s.attributes.unit_of_measurement?` ${s.attributes.unit_of_measurement}`:""}`:"climate"===a?void 0!==s.attributes.current_temperature?`${s.attributes.current_temperature}°C`:s.state:Ft(s)?i("on"):i("off")}}tap(t){if(this.ctx.editing)this.moved||ve(this.ctx,t.id);else if(t.area)this.ctx.selectRoom(t.area);else if(t.entity){const e=Rt(t.entity);["light","switch","fan","cover","lock"].includes(e)?Qt(this.ctx.hass,t.entity):Ce(this,t.entity)}}pointFromEvent(t){const e=this.img.getBoundingClientRect();return{x:Math.min(100,Math.max(0,(t.clientX-e.left)/e.width*100)),y:Math.min(100,Math.max(0,(t.clientY-e.top)/e.height*100))}}down(t,e){if(!this.ctx.editing){const s=e.entity;return void(s&&$e(s,this.ctx.hass.states[s])&&be(t,()=>this.ctx.openLevel(s)))}if(!this.img)return;t.preventDefault();const s=t.currentTarget;s.setPointerCapture(t.pointerId),this.moved=!1;const i=t.clientX,a=t.clientY,n=t=>{Math.hypot(t.clientX-i,t.clientY-a)>4&&(this.moved=!0),this.moved&&(this.dragging={id:e.id,...this.pointFromEvent(t)})},r=()=>{s.removeEventListener("pointermove",n),s.removeEventListener("pointerup",r),s.removeEventListener("pointercancel",r);const t=this.dragging;t&&this.ctx.update(e=>{const s=e.hero.pins.find(e=>e.id===t.id);s&&(s.x=Math.round(10*t.x)/10,s.y=Math.round(10*t.y)/10)}),this.dragging=void 0,setTimeout(()=>this.moved=!1,0)};s.addEventListener("pointermove",n),s.addEventListener("pointerup",r),s.addEventListener("pointercancel",r)}addPin(){const t=Math.random().toString(36).slice(2,10);this.ctx.update(e=>e.hero.pins.push({id:t,x:50,y:50})),ve(this.ctx,t)}async upload(t){const e=t.target,s=e.files?.[0];if(e.value="",s){this.uploading=!0;try{const t=new FormData;t.append("file",s);const e=await this.ctx.hass.fetchWithAuth("/api/smartnest_pro/upload",{method:"POST",body:t});if(!e.ok)throw new Error(String(e.status));const{url:i}=await e.json();this.ctx.update(t=>t.hero.image=i)}catch{this.ctx.toast(this.ctx.t("upload_failed"))}finally{this.uploading=!1}}}pinIcon(t){if(t.entity)return ce(t.entity,this.ctx.hass.states[t.entity])}render(){const{config:t,editing:e,t:s,hass:i,room:a}=this.ctx;return F`
      <div class="stage">
        ${t.hero.image?F`<div class="frame" style=${this.fit?`width:${this.fit.w}px;height:${this.fit.h}px`:"visibility:hidden"}>
          <img class="house" src=${t.hero.image} alt="" draggable="false" @load=${()=>this.measure()} />
          ${t.hero.pins.map(t=>{const s=this.dragging?.id===t.id?this.dragging:t,n=t.area&&t.area===a||t.entity&&Ft(i.states[t.entity]),r=this.status(t),o=this.pinIcon(t);return F`<button
              class="pin ${n?"active":""} ${e?"editing":""} ${s.x>70?"flip":""}"
              style="left:${s.x}%; top:${s.y}%"
              @pointerdown=${e=>this.down(e,t)}
              @contextmenu=${ye}
              @click=${()=>this.tap(t)}
            >
              <span class="dot">${o?le(o,16):F`<span class="core"></span>`}</span>
              <span class="label"><b>${((t,e)=>e.label||(e.area?t.hass.areas?.[e.area]?.name:e.entity?Nt(t.hass,e.entity):"")||"•")(this.ctx,t)}</b>${r?F`<i>${r}</i>`:B}</span>
            </button>`})}
        </div>`:this.placeholder()}
      </div>
      ${e?F`<div class="tools">
            <button class="tool" @click=${this.addPin}>${le("M15 17H18V14H20V17H23V19H20V22H18V19H15V17M9 6.5C10.4 6.5 11.5 7.6 11.5 9S10.4 11.5 9 11.5 6.5 10.4 6.5 9 7.6 6.5 9 6.5M9 2C12.9 2 16 5.1 16 9C16 14.2 9 22 9 22S2 14.2 2 9C2 5.1 5.1 2 9 2M9 4C6.2 4 4 6.2 4 9C4 10 4 12 9 18.7C14 12 14 10 14 9C14 6.2 11.8 4 9 4Z",18)}${s("add_pin")}</button>
            <label class="tool">
              ${le("M22.7 14.3L21.7 15.3L19.7 13.3L20.7 12.3C20.8 12.2 20.9 12.1 21.1 12.1C21.2 12.1 21.4 12.2 21.5 12.3L22.8 13.6C22.9 13.8 22.9 14.1 22.7 14.3M13 19.9V22H15.1L21.2 15.9L19.2 13.9L13 19.9M11.21 15.83L9.25 13.47L6.5 17H13.12L15.66 14.55L13.96 12.29L11.21 15.83M11 19.9V19.05L11.05 19H5V5H19V11.31L21 9.38V5C21 3.9 20.11 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H11V19.9Z",18)}${this.uploading?s("uploading"):s("change_image")}
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden @change=${this.upload} />
            </label>
            ${t.hero.image?F`<button class="tool" @click=${()=>this.ctx.update(t=>t.hero.image=void 0)}>
                  ${le("M13 19C13 19.7 13.13 20.37 13.35 21H5C3.9 21 3 20.11 3 19V5C3 3.9 3.9 3 5 3H19C20.11 3 21 3.9 21 5V13.35C20.37 13.13 19.7 13 19 13V5H5V19H13M11.21 15.83L9.25 13.47L6.5 17H13.35C13.75 15.88 14.47 14.91 15.4 14.21L13.96 12.29L11.21 15.83M22.54 16.88L21.12 15.47L19 17.59L16.88 15.47L15.47 16.88L17.59 19L15.47 21.12L16.88 22.54L19 20.41L21.12 22.54L22.54 21.12L20.41 19L22.54 16.88Z",18)}${s("reset_image")}
                </button>`:B}
          </div>`:B}
    `}};Re.styles=[oe,n`
      :host {
        position: relative;
        display: block;
        min-height: 0;
      }
      .stage {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
      }
      .frame {
        position: relative;
        direction: ltr;
      }
      .house {
        display: block;
        width: 100%;
        height: 100%;
        user-select: none;
        -webkit-user-drag: none;
        /* Soft edges so any render, beige or not, melts into the backdrop in both themes. */
        filter: var(--sn-hero-filter);
        -webkit-mask-image: radial-gradient(closest-side, #000 var(--sn-hero-fade), transparent 100%);
        mask-image: radial-gradient(closest-side, #000 var(--sn-hero-fade), transparent 100%);
        -webkit-mask-size: 118% 118%;
        mask-size: 118% 118%;
        -webkit-mask-position: center;
        mask-position: center;
      }
      .pin {
        position: absolute;
        transform: translate(-22px, -50%);
        display: flex;
        align-items: center;
        gap: 10px;
        height: 46px;
        padding: 0 16px 0 5px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.35);
        background: rgba(120, 112, 104, 0.42);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        box-shadow: 0 10px 24px -10px rgba(30, 24, 18, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        color: #fff;
        cursor: pointer;
        white-space: nowrap;
        touch-action: none;
        -webkit-touch-callout: none;
        user-select: none;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .pin.flip {
        transform: translate(calc(-100% + 22px), -50%);
        flex-direction: row-reverse;
        padding: 0 5px 0 16px;
      }
      .pin.editing {
        cursor: grab;
        outline: 1.5px dashed rgba(255, 255, 255, 0.7);
        outline-offset: 3px;
      }
      .dot {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.35);
      }
      .core {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
      }
      .pin.active .dot {
        background: var(--sn-accent);
        color: #1d2a12;
        box-shadow: 0 0 18px var(--sn-accent-glow);
      }
      .pin.active .core {
        border-color: #1d2a12;
      }
      .label {
        display: flex;
        align-items: baseline;
        gap: 6px;
        font-size: 13px;
      }
      .label b {
        font-weight: 500;
      }
      .label i {
        font-style: normal;
        font-size: 11px;
        opacity: 0.75;
      }
      .tools {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        padding: 6px;
        border-radius: 999px;
        background: var(--sn-glass-strong);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        border: 1px solid var(--sn-glass-border);
      }
      .tool {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 14px;
        border: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
      }
      .placeholder {
        display: grid;
        justify-items: center;
        gap: 10px;
        max-width: 320px;
        padding: 34px 28px;
        text-align: center;
        color: var(--sn-text-dim);
        font-size: 15px;
      }
      .placeholder small {
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      @media (max-width: 600px) {
        .pin {
          height: 36px;
          padding-inline-end: 10px;
          gap: 6px;
        }
        .dot {
          width: 28px;
          height: 28px;
        }
        .label i {
          display: none;
        }
      }
    `],Ue([ht({attribute:!1})],Re.prototype,"ctx",2),Ue([gt()],Re.prototype,"dragging",2),Ue([gt()],Re.prototype,"uploading",2),Ue([gt()],Re.prototype,"fit",2),Re=Ue([ct("sn-house-hero")],Re);var Ne=Object.defineProperty,Fe=Object.getOwnPropertyDescriptor,Ie=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?Fe(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&Ne(e,s,n),n};let We=class extends ot{connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.refresh(!0),6e5)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.timer)}updated(){this.refresh(!1)}async refresh(t){const e=this.ctx?.config.home.energy;if(e&&(t||this.loadedFor!==e)){this.loadedFor=e;try{this.hours=await async function(t,e){const s=new Date;s.setHours(0,0,0,0),s.setDate(s.getDate()-1);const i=await t.hass.callWS({type:"recorder/statistics_during_period",start_time:s.toISOString(),end_time:(new Date).toISOString(),statistic_ids:[e],period:"hour",types:["change"],units:{energy:"kWh"}}),a=new Array(24).fill(0),n=new Array(24).fill(0),r=s.getTime()+864e5;for(const o of i[e]??[]){const t="number"==typeof o.start?o.start:Date.parse(o.start);(t>=r?a:n)[new Date(t).getHours()]+=o.change??0}return{today:a,yesterday:n}}(this.ctx,e)}catch{this.hours=void 0}}}chart(t,e){const s=(new Date).getHours(),i=110,a=Math.max(.1,...t,...e),n=t=>t/24*300,r=t=>96-t/a*80,o=(t,e)=>{let s="";for(let i=0;i<=e&&i<24;i++)s+=`${i?"L":"M"}${n(i)},${r(t[i])} L${n(i+1)},${r(t[i])} `;return s},l=t.map((t,e)=>[t,e]).filter(([,t])=>t<=s).sort((t,e)=>e[0]-t[0]).slice(0,2).filter(([t])=>t>0).map(([,t])=>t);return I`
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
      ${l.map(e=>I`<g mask="url(#m)"><rect x=${n(e)} y=${r(t[e])} width=${12.5} height=${96-r(t[e])} fill="url(#hatch)"></rect></g>
          <circle cx=${n(e)} cy=${r(t[e])} r="2.4" fill="#d9f2bf"></circle>
          <circle cx=${n(e+1)} cy=${r(t[e])} r="2.4" fill="#d9f2bf"></circle>`)}
      <path d=${o(e,23)} fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"></path>
      <path d=${o(t,s)} fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.4" stroke-dasharray="2.5 3"></path>
      ${t.slice(0,s+1).map((t,e)=>e%3==0?I`<circle cx=${n(e)} cy=${r(t)} r="2" fill="#e8e8e8"></circle>`:B)}
    `}render(){const{t:t,config:e,editing:s}=this.ctx,i=e.home.energy,a=this.hours,n=(new Date).getHours(),r=a?a.today.reduce((t,e)=>t+e,0):void 0,o=a?a.yesterday.slice(0,n+1).reduce((t,e)=>t+e,0):0,l=a&&o>0?Math.round((r-o)/o*100):void 0;return F`
      <div class="card">
        <div class="head">
          <span class="badge">${le("M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17M9,5H10V3H9V5M9,13H10V11H9V13M9,21H10V19H9V21M5,3V5H7V3H5M5,11V13H7V11H5M5,19V21H7V19H5Z",22)}</span>
          <div>
            <h3>${t("energy_usage")}</h3>
            ${void 0!==l?F`<span class="delta ${l>0?"up":""}"
                  ><span class="dot">${le(l>0?"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z":"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",14)}</span>${t("vs_yesterday",{pct:l>0?`+${l}`:l})}</span
                >`:B}
          </div>
          ${s?F`<button class="round gear" aria-label=${t("settings")} @click=${()=>{var t;(t=this.ctx).showSheet({title:t.t("energy_usage"),render:t=>{const e=t.config.home,s=pe(t,["sensor"],["energy"]);return F`
        ${he(t,t.t("energy_meter"),e.energy,s,e=>t.update(t=>t.home.energy=e))}
        ${he(t,t.t("solar_power"),e.solar_power,pe(t,["sensor"],["power"]),e=>t.update(t=>t.home.solar_power=e))}
        ${he(t,t.t("solar_energy"),e.solar_energy,s,e=>t.update(t=>t.home.solar_energy=e))}
      `}})}}>${le(vt,18)}</button>`:B}
        </div>
        ${i?F`
              <div class="value">${void 0!==r?r.toFixed(1):"–"}<small>kWh</small></div>
              ${a?F`<svg class="chart" viewBox="0 0 300 110" preserveAspectRatio="none">${this.chart(a.today,a.yesterday)}</svg>
                    <div class="axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>`:F`<div class="empty">${t("not_configured")}</div>`}
            `:F`<div class="empty">${t("no_energy")}</div>`}
      </div>
    `}};We.styles=[oe,n`
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
      .empty {
        color: #7d7d7d;
      }
      .round {
        border-color: #2a2a2a;
        background: #1c1c1c;
        color: #eee;
      }
    `],Ie([ht({attribute:!1})],We.prototype,"ctx",2),Ie([gt()],We.prototype,"hours",2),We=Ie([ct("sn-energy-card")],We);var Be=Object.defineProperty,Ye=Object.getOwnPropertyDescriptor,qe=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?Ye(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&Be(e,s,n),n};const Ge=300,Xe=120,Je=(t,e=82)=>{const s=t*Math.PI/180;return[100+e*Math.cos(s),100+e*Math.sin(s)]},Ke=(t,e)=>{const[s,i]=Je(t),[a,n]=Je(e);return`M${s},${i} A82,82 0 ${e-t>180?1:0} 1 ${a},${n}`};let Qe=class extends ot{angleToTemp(t,e,s,i){const a=this.renderRoot.querySelector("svg.ring").getBoundingClientRect();let n=(180*Math.atan2(t.clientY-(a.top+a.height/2),t.clientX-(a.left+a.width/2))/Math.PI-Xe+720)%360;n>Ge&&(n=n-Ge<30?Ge:0);const r=e+n/Ge*(s-e);return Math.round(r/i)*i}down(t,e){const{min:s,max:i,step:a}=te(this.ctx.hass.states[e]),n=t.currentTarget;n.setPointerCapture(t.pointerId),this.dragTarget=this.angleToTemp(t,s,i,a);const r=t=>{this.dragTarget=this.angleToTemp(t,s,i,a)},o=()=>{n.removeEventListener("pointermove",r),n.removeEventListener("pointerup",o),n.removeEventListener("pointercancel",o),void 0!==this.dragTarget&&ee(this.ctx.hass,e,this.dragTarget),setTimeout(()=>this.dragTarget=void 0,1500)};n.addEventListener("pointermove",r),n.addEventListener("pointerup",o),n.addEventListener("pointercancel",o)}modes(t){const e=this.ctx.hass.states[t],s=e.attributes.hvac_modes??[],i=e.attributes.preset_modes??[],a=this.ctx.t,n=[],r=e=>()=>this.ctx.hass.callService("climate","set_hvac_mode",{entity_id:t,hvac_mode:e}),o=s.includes("auto")?"auto":s.includes("heat_cool")?"heat_cool":void 0,l="eco"===e.attributes.preset_mode;return o&&n.push({key:"auto",label:a("mode_auto"),icon:"M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z",active:e.state===o&&!l,run:r(o)}),s.includes("cool")&&n.push({key:"cool",label:a("mode_cool"),icon:"M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z",active:"cool"===e.state&&!l,run:r("cool")}),s.includes("heat")&&n.push({key:"heat",label:a("mode_heat"),icon:"M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z",active:"heat"===e.state&&!l,run:r("heat")}),i.includes("eco")&&n.push({key:"eco",label:a("mode_eco"),icon:_t,active:l,run:()=>this.ctx.hass.callService("climate","set_preset_mode",{entity_id:t,preset_mode:"eco"})}),s.includes("off")&&n.push({key:"off",label:a("mode_off"),icon:Vt,active:"off"===e.state,run:r("off")}),n}render(){const{t:t,config:e,editing:s,hass:i}=this.ctx,a=this.entity??e.home.climate,n=a?i.states[a]:void 0,r=s&&!this.entity?F`<button class="round gear" aria-label=${t("settings")} @click=${()=>{var t;(t=this.ctx).showSheet({title:t.t("climate_comfort"),render:t=>F`
      ${he(t,t.t("climate_entity"),t.config.home.climate,pe(t,["climate"]),e=>t.update(t=>t.home.climate=e))}
      ${he(t,t.t("humidity_sensor"),t.config.home.humidity,pe(t,["sensor"],["humidity"]),e=>t.update(t=>t.home.humidity=e))}
    `})}}>${le(vt,18)}</button>`:B,o=F`<div class="card-head">
      <span class="round">${le("M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",20)}</span>
      <h3>${this.entity?Nt(i,this.entity):t("climate_comfort")}</h3>
      ${r}
    </div>`;if(!a||It(n))return F`<div class="glass card">${o}<div class="empty">${t("not_configured")}</div></div>`;const{target:l,current:c,min:d,max:p}=te(n),h=this.dragTarget??l,g=(this.entity?void 0:Wt(i.states[e.home.humidity??""]))??n.attributes.current_humidity,u=void 0!==h?Math.min(1,Math.max(0,(h-d)/(p-d))):0,m=Xe+u*Ge,[f,v]=Je(m),b=Array.from({length:31},(t,e)=>Xe+e/30*Ge),x="off"===n.state;return F`<div class="glass card">
      ${o}
      <div class="body">
        <div class="dial">
          <svg class="ring" viewBox="0 0 200 200" @pointerdown=${t=>this.down(t,a)}>
            <defs>
              <linearGradient id="g" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stop-color="#e3f3d2"></stop>
                <stop offset="1" stop-color="#9ccf6c"></stop>
              </linearGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"></feGaussianBlur></filter>
            </defs>
            <circle cx="100" cy="100" r="64" fill="rgba(255,255,255,0.06)"></circle>
            <path d=${Ke(Xe,420)} stroke="rgba(255,255,255,0.12)" stroke-width="20" fill="none" stroke-linecap="round"></path>
            ${b.map(t=>{const[e,s]=Je(t,79),[i,a]=Je(t,85);return I`<line x1=${e} y1=${s} x2=${i} y2=${a} stroke="rgba(255,255,255,0.25)" stroke-width="1"></line>`})}
            ${!x&&u>0?I`<path d=${Ke(Xe,m)} stroke="url(#g)" stroke-width="20" fill="none" stroke-linecap="round" opacity="0.35" filter="url(#glow)"></path>
                 <path d=${Ke(Xe,m)} stroke="url(#g)" stroke-width="16" fill="none" stroke-linecap="round"></path>`:B}
            <circle cx=${f} cy=${v} r="13" fill="#d9eec4" stroke="rgba(255,255,255,0.8)" stroke-width="2"></circle>
          </svg>
          <div class="center">
            <div class="now">${void 0!==c?c.toFixed(1):"–"}°</div>
            ${void 0!==h?F`<div class="target">${t("target",{t:h})}</div>`:B}
          </div>
          ${void 0!==g?F`<span class="chip hum"><span class="ic">${le("M20 14H22V16H20C18.62 16 17.26 15.65 16 15C13.5 16.3 10.5 16.3 8 15C6.74 15.65 5.37 16 4 16H2V14H4C5.39 14 6.78 13.53 8 12.67C10.44 14.38 13.56 14.38 16 12.67C17.22 13.53 18.61 14 20 14M20 20H22V22H20C18.62 22 17.26 21.65 16 21C13.5 22.3 10.5 22.3 8 21C6.74 21.65 5.37 22 4 22H2V20H4C5.39 20 6.78 19.53 8 18.67C10.44 20.38 13.56 20.38 16 18.67C17.22 19.53 18.61 20 20 20M22 6L18 2V5H13V7H18V10",14)}</span>${Math.round(g)}% HR</span>`:B}
        </div>
        <div class="modes">
          ${this.modes(a).map(t=>F`<button class="mode ${t.active?"on":""}" @click=${t.run}>${le(t.icon,16)}<span>${t.label}</span></button>`)}
        </div>
      </div>
    </div>`}};Qe.styles=[oe,n`
      :host {
        display: block;
      }
      .card {
        height: 100%;
        padding: 20px 22px 22px;
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
    `],qe([ht({attribute:!1})],Qe.prototype,"ctx",2),qe([ht()],Qe.prototype,"entity",2),qe([gt()],Qe.prototype,"dragTarget",2),Qe=qe([ct("sn-climate-card")],Qe);var ts=Object.defineProperty,es=Object.getOwnPropertyDescriptor,ss=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?es(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&ts(e,s,n),n};let is=class extends ot{constructor(){super(...arguments),this.bare=!1}nudge(t,e){const s=this.ctx.hass.states[t],{target:i,min:a,max:n,step:r}=te(s),o=this.pending??i??22;this.pending=Math.min(n,Math.max(a,Math.round(10*(o+e*r))/10)),this.requestUpdate(),clearTimeout(this.sendTimer),this.sendTimer=window.setTimeout(()=>{void 0!==this.pending&&ee(this.ctx.hass,t,this.pending),setTimeout(()=>{this.pending=void 0,this.requestUpdate()},1500)},600)}zonal(t){const{t:e,hass:s,editing:i}=this.ctx,a=s.states[t],{target:n,min:r,max:o}=te(a),l=this.pending??n,c=void 0!==l?(l-r)/(o-r):0,d="off"===a?.state,p=Array.from({length:65},(t,e)=>{const s=Math.PI+e/64*Math.PI,i=160+140*Math.cos(s),a=120+90*Math.sin(s),n=160+128*Math.cos(s),r=120+80*Math.sin(s),o=e/64,l=!d&&Math.abs(o-c)<.18;return I`<line x1=${i} y1=${a} x2=${n} y2=${r} stroke=${l?"#e9f6dc":"rgba(255,255,255,0.35)"} stroke-width=${l?1.6:1} stroke-linecap="round"></line>`}),h=160+134*Math.cos(Math.PI+c*Math.PI);return F`<div class="zone">
      <div class="zone-head">
        <span>${e("zonal_climate")}</span>
        <button
          class="round light"
          aria-label=${e("settings")}
          @click=${()=>i&&this.area?fe(this.ctx,this.area):Ce(this,t)}
        >
          ${le(i?vt:Ot,18)}
        </button>
      </div>
      <div class="arc">
        <svg viewBox="0 0 320 150">
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"></feGaussianBlur></filter>
          </defs>
          ${d?B:I`<ellipse cx=${h} cy="44" rx="58" ry="16" fill="#b5dc8f" opacity="0.75" filter="url(#blur)"></ellipse>`}
          ${p}
        </svg>
        <button class="round pm minus" aria-label="-" @click=${()=>this.nudge(t,-1)}>${le("M19,13H5V11H19V13Z")}</button>
        <button class="round pm plus" aria-label="+" @click=${()=>this.nudge(t,1)}>${le("M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z")}</button>
        <div class="temp">${void 0!==l?l.toFixed(1):"–"}<small>°C</small></div>
      </div>
    </div>`}node(t){const e=this.ctx.hass.states[t],s=Ft(e),i=e?.attributes.entity_picture,a=$e(t,e);return F`<div class="node ${s?"on":""}">
      <button
        class="pic"
        @click=${()=>Ce(this,t)}
        @pointerdown=${e=>a&&be(e,()=>this.ctx.openLevel(t))}
        @contextmenu=${ye}
      >
        ${i?F`<img src=${i} alt="" loading="lazy" />`:le(ce(t,e),40)}
      </button>
      <span class="nname">${Nt(this.ctx.hass,t)}</span>
      <button class="switch" ?on=${s} ?disabled=${It(e)} aria-pressed=${s} @click=${()=>Qt(this.ctx.hass,t)}></button>
    </div>`}render(){const{t:t,hass:e,config:s,editing:i}=this.ctx,a=this.area;if(!a||!e.areas?.[a])return F`<div class="wrap glass"><div class="empty">${t("no_rooms")}</div></div>`;const n=Kt(e,a,s.rooms[a]),r=void 0!==n.people?n.people>0?t("taken_people",{n:n.people}):t("free"):void 0!==n.occupied?n.occupied?t("taken"):t("free"):void 0;return F`<div class="wrap ${this.bare?"":"glass"}">
      <div class="top">
        ${this.bare?F`<span class="spacer"></span>`:F`<span class="round">${le(bt,20)}</span><h2>${n.name}</h2>`}
        <div class="meta">
          <span class="chip small">ID: ${a}</span>
          ${n.size?F`<span class="chip small">${n.size} m²</span>`:B}
        </div>
        ${i&&!this.bare?F`<button class="round gear" aria-label=${t("room_settings")} @click=${()=>fe(this.ctx,a)}>${le(vt,18)}</button>`:B}
      </div>
      <div class="chips">
        ${void 0!==n.temperature?F`<span class="chip"><span class="ic">${le(Et,14)}</span>${n.temperature.toFixed(1)} °C</span>`:B}
        ${r?F`<span class="chip"><span class="ic">${le(ut,14)}</span>${r}</span>`:B}
        ${void 0!==n.humidity?F`<span class="chip"><span class="ic">${le(Pt,14)}</span>${t("humidity",{h:Math.round(n.humidity)})}</span>`:B}
      </div>
      ${n.climate?this.zonal(n.climate):F`<div class="zone"><div class="empty">${t("no_climate")}</div></div>`}
      <div class="nodes">
        <div class="nodes-head">${t("nodes_in_room")}</div>
        ${n.nodes.length?F`<div class="grid">${n.nodes.map(t=>this.node(t))}</div>`:F`<div class="empty">${t("no_nodes")}</div>`}
      </div>
    </div>`}};is.styles=[oe,n`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        height: 100%;
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: var(--sn-glass-light);
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
    `],ss([ht({attribute:!1})],is.prototype,"ctx",2),ss([ht()],is.prototype,"area",2),ss([ht({type:Boolean,reflect:!0})],is.prototype,"bare",2),is=ss([ct("sn-room-panel")],is);var as=Object.defineProperty,ns=Object.getOwnPropertyDescriptor,rs=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?ns(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&as(e,s,n),n};let os=class extends ot{run(t){Qt(this.ctx.hass,t),this.fired=t,setTimeout(()=>this.fired=void 0,1200)}render(){const{t:t,config:e,editing:s,hass:i}=this.ctx,a=e.home.scenes;return F`<div class="glass card">
      <div class="card-head">
        <span class="round">${le("M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",20)}</span>
        <h3>${t("scenes")}</h3>
        ${s?F`<button class="round gear" aria-label=${t("settings")} @click=${()=>{var t;(t=this.ctx).showSheet({title:t.t("scenes"),render:t=>ge(t,t.t("scene_buttons"),t.config.home.scenes,pe(t,["scene","script"]),e=>t.update(t=>t.home.scenes=e))})}}>${le(vt,18)}</button>`:B}
      </div>
      ${a.length?F`<div class="row">
            ${a.map(t=>F`<button class="scene ${this.fired===t?"fired":""}" ?disabled=${!i.states[t]} @click=${()=>this.run(t)}>
                <span class="play">${le(At,16)}</span>${Nt(i,t)}
              </button>`)}
          </div>`:F`<div class="empty">${t("pick_in_edit")}</div>`}
    </div>`}};os.styles=[oe,n`
      :host {
        display: block;
        min-width: 0;
      }
      .card {
        padding: 18px 20px;
      }
      .card-head {
        margin-bottom: 12px;
      }
      .row {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .row::-webkit-scrollbar {
        display: none;
      }
      .scene {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex: none;
        height: 48px;
        padding: 0 18px 0 6px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.15s ease;
      }
      .scene:active {
        transform: scale(0.97);
      }
      .scene:disabled {
        opacity: 0.4;
      }
      .play {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
      }
      .scene.fired {
        background: rgba(181, 220, 143, 0.28);
      }
      .scene.fired .play {
        background: var(--sn-accent);
        color: #1d2a12;
      }
    `],rs([ht({attribute:!1})],os.prototype,"ctx",2),rs([gt()],os.prototype,"fired",2),os=rs([ct("sn-scenes-card")],os);var ls=Object.defineProperty,cs=Object.getOwnPropertyDescriptor,ds=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?cs(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&ls(e,s,n),n};let ps=class extends ot{render(){const{hass:t,config:e,t:s,room:i,phone:a}=this.ctx,n=Yt(t);return n.length?F`<div class="layout ${a?"phone":""}">
      <div class="grid">
        ${n.map(n=>{const r=Kt(t,n.area_id,e.rooms[n.area_id]);return F`<button class="glass room ${n.area_id!==i||a?"":"sel"}" @click=${()=>this.ctx.selectRoom(n.area_id)}>
            <span class="name">${r.name}</span>
            <span class="stats">
              ${void 0!==r.temperature?F`<span>${le(Et,14)}${r.temperature.toFixed(1)}°</span>`:B}
              ${void 0!==r.humidity?F`<span>${le(Pt,14)}${Math.round(r.humidity)}%</span>`:B}
              ${void 0!==r.occupied?F`<span class=${r.occupied?"occ":""}>${le(ut,14)}${r.people??(r.occupied?"•":"0")}</span>`:B}
            </span>
            <span class="foot">
              <span>${s("devices_count",{n:r.nodes.length})}</span>
              ${r.activeNodes?F`<span class="on">${s("devices_on",{n:r.activeNodes})}</span>`:B}
            </span>
          </button>`})}
      </div>
      ${a?B:F`<sn-room-panel .ctx=${this.ctx} .area=${i}></sn-room-panel>`}
    </div>`:F`<div class="glass"><div class="empty">${s("no_rooms")}</div></div>`}};ps.styles=[oe,n`
      :host {
        display: block;
        height: 100%;
      }
      .layout {
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
        overflow: auto;
        border-radius: var(--sn-radius);
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
    `],ds([ht({attribute:!1})],ps.prototype,"ctx",2),ps=ds([ct("sn-rooms-page")],ps);const hs=(t,e=[],s)=>F`<header class="page-head">
    <h1>${t}</h1>
    <div class="page-chips">${e.filter(Boolean).map(t=>F`<span class="page-chip">${t}</span>`)}</div>
    ${s??B}
  </header>`,gs=n`
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
`;var us=Object.defineProperty,ms=Object.getOwnPropertyDescriptor,fs=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?ms(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&us(e,s,n),n};let vs=class extends ot{render(){const{hass:t,t:e}=this.ctx,s=se(t,"climate"),i=se(t,"fan"),a=s.filter(e=>"off"!==t.states[e].state);return F`
      ${hs(e("climate"),[e("n_running",{n:a.length})],a.length?F`<button class="action" @click=${()=>t.callService("climate","turn_off",{entity_id:a})}>
            ${le(Vt,18)}${e("all_ac_off")}
          </button>`:void 0)}
      ${s.length?F`<div class="grid" style="--min: 340px">
            ${s.map(e=>F`<div class="wrap">
                ${ie(t,e)?F`<span class="area">${ie(t,e)}</span>`:B}
                <sn-climate-card .ctx=${this.ctx} .entity=${e}></sn-climate-card>
              </div>`)}
          </div>`:F`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
      ${i.length?F`<div class="section">${e("fans")}</div>
            <div class="grid" style="--min: 200px">
              ${i.map(s=>{const i=t.states[s],a=Ft(i);return F`<div class="glass card fan ${a?"on":""}">
                  <span class="spin">${le(xt,30)}</span>
                  <span class="name">${Nt(t,s)}<small>${"number"==typeof i.attributes.percentage&&a?`${i.attributes.percentage}%`:e(a?"on":"off")}</small></span>
                  <button class="switch" ?on=${a} aria-pressed=${a} @click=${()=>Qt(t,s)}></button>
                </div>`})}
            </div>`:B}
    `}};vs.styles=[oe,gs,n`
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
    `],fs([ht({attribute:!1})],vs.prototype,"ctx",2),vs=fs([ct("sn-climate-page")],vs);var bs=Object.defineProperty,xs=Object.getOwnPropertyDescriptor,ys=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?xs(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&bs(e,s,n),n};let $s=class extends ot{tile(t){const{hass:e}=this.ctx,s=e.states[t],i=Ft(s),a=i&&"number"==typeof s.attributes.brightness?Math.round(s.attributes.brightness/255*100):i?100:0,n=s.attributes.rgb_color;return F`<button
      class="glass light ${i?"on":""}"
      style=${i&&n?`--glow: rgb(${n.join(",")})`:""}
      @click=${()=>Qt(e,t)}
      @pointerdown=${e=>$e(t,s)&&be(e,()=>this.ctx.openLevel(t))}
      @contextmenu=${ye}
    >
      <span class="bulb">${le(ce(t,s),26)}</span>
      <span class="name">${Nt(e,t)}</span>
      <span class="pct">${i?`${a}%`:this.ctx.t("off")}</span>
      <span class="bar"><span style="width:${a}%"></span></span>
    </button>`}render(){const{hass:t,t:e}=this.ctx,s=se(t,"light"),i=s.filter(e=>Ft(t.states[e])),a=Yt(t).map(e=>({name:e.name,ids:s.filter(s=>qt(t,s)===e.area_id)})).filter(t=>t.ids.length),n=s.filter(e=>!qt(t,e));return n.length&&a.push({name:e("other"),ids:n}),F`
      ${hs(e("lights"),[e("n_lights_on",{n:i.length})],i.length?F`<button class="action" @click=${()=>t.callService("light","turn_off",{entity_id:i})}>
            ${le("M20.84 22.73L18.09 20C18.06 20 18.03 20 18 20H16.83C16.94 19.68 17 19.34 17 19V18.89L14.75 16.64C14.57 16.86 14.31 17 14 17H10C9.45 17 9 16.55 9 16V14C7.4 12.8 6.74 10.84 7.12 9L5.5 7.4C5.18 8.23 5 9.11 5 10C5 11.83 5.72 13.58 7 14.88V17H5C4.45 17 4 16.55 4 16V14.45C2.86 13.79 2.12 12.62 2 11.31C1.85 9.27 3.25 7.5 5.2 7.09L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M15 6C13.22 4.67 10.86 4.72 9.13 5.93L16.08 12.88C17.63 10.67 17.17 7.63 15 6M19.79 16.59C19.91 16.42 20 16.22 20 16V14.45C21.91 13.34 22.57 10.9 21.46 9C20.8 7.85 19.63 7.11 18.32 7C18.77 7.94 19 8.96 19 10C19 11.57 18.47 13.09 17.5 14.31L19.79 16.59M10 19C10 19.55 10.45 20 11 20H13C13.55 20 14 19.55 14 19V18H10V19M7 18H5V19C5 19.55 5.45 20 6 20H7.17C7.06 19.68 7 19.34 7 19V18Z",18)}${e("all_off")}
          </button>`:void 0)}
      ${s.length?a.map(t=>F`<div class="section">${t.name}</div><div class="grid" style="--min: 150px">${t.ids.map(t=>this.tile(t))}</div>`):F`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
    `}};$s.styles=[oe,gs,n`
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
    `],ys([ht({attribute:!1})],$s.prototype,"ctx",2),$s=ys([ct("sn-lights-page")],$s);var _s=Object.defineProperty,ws=Object.getOwnPropertyDescriptor,ks=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?ws(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&_s(e,s,n),n};let Cs=class extends ot{robot(t){const{hass:e,t:s}=this.ctx,i=e.states[t],a="lawn_mower"===Rt(t),n=ae(e,t),r=n.find(t=>"image"===Rt(t)||"camera"===Rt(t)),o=r?e.states[r].attributes.entity_picture:void 0,l=("number"==typeof i.attributes.battery_level?i.attributes.battery_level:void 0)??Wt(e.states[n.find(t=>"battery"===e.states[t]?.attributes.device_class)??""]),c=i.attributes.fan_speed_list??[],d=["cleaning","mowing","returning"].includes(i.state),p=`st_${i.state}`,h=["cleaning","docked","returning","idle","paused","error","mowing"].includes(i.state)?s(p):i.state,g=s=>()=>e.callService(a?"lawn_mower":"vacuum",s,{entity_id:t});return F`<div class="glass robot">
      <div class="top">
        <span class="avatar ${d?"busy":""}">${le(a?"M1 14V5H13C18.5 5 23 9.5 23 15V17H20.83C20.42 18.17 19.31 19 18 19C16.69 19 15.58 18.17 15.17 17H10C9.09 18.21 7.64 19 6 19C3.24 19 1 16.76 1 14M6 11C4.34 11 3 12.34 3 14C3 15.66 4.34 17 6 17C7.66 17 9 15.66 9 14C9 12.34 7.66 11 6 11M15 10V12H20.25C19.92 11.27 19.5 10.6 19 10H15Z":Mt,44)}</span>
        <div class="info">
          <h2>${Nt(e,t)}</h2>
          <span class="state ${i.state}">${h}</span>
        </div>
        ${void 0!==l?F`<span class="batt">${le(mt,16)}${s("battery",{n:Math.round(l)})}
              <span class="bar"><span style="width:${l}%"></span></span></span>`:B}
      </div>
      ${o?F`<button class="map" @click=${()=>Ce(this,r)}><img src=${o} alt=${s("map")} loading="lazy" /></button>`:B}
      ${c.length&&!a?F`<div class="speeds" role="group" aria-label=${s("fan_speed")}>
            <span>${s("fan_speed")}</span>
            ${c.map(s=>F`<button class=${s===i.attributes.fan_speed?"on":""} @click=${()=>e.callService("vacuum","set_fan_speed",{entity_id:t,fan_speed:s})}>${s}</button>`)}
          </div>`:B}
      <div class="controls">
        ${d?F`<button class="ctl primary" @click=${g("pause")}>${le(Ht)}${s("pause")}</button>`:F`<button class="ctl primary" @click=${g(a?"start_mowing":"start")}>${le(At)}${s("start")}</button>`}
        <button class="ctl" @click=${g(a?"dock":"return_to_base")}>${le("M15 13L11 17V14H2V12H11V9L15 13M5 20V16H7V18H17V10.19L12 5.69L7.21 10H4.22L12 3L22 12H19V20H5Z")}${s("dock")}</button>
        ${a?B:F`<button class="ctl" @click=${g("locate")}>${le("M12,1C7.59,1 4,4.59 4,9C4,14.57 10.96,22.34 11.26,22.67L12,23.5L12.74,22.67C13.04,22.34 20,14.57 20,9C20,4.59 16.41,1 12,1M12,20.47C9.82,17.86 6,12.54 6,9A6,6 0 0,1 12,3A6,6 0 0,1 18,9C18,12.83 13.75,18.36 12,20.47M11.13,14H12.88V15.75H11.13M12,5A3.5,3.5 0 0,0 8.5,8.5H10.25A1.75,1.75 0 0,1 12,6.75A1.75,1.75 0 0,1 13.75,8.5C13.75,10.26 11.13,10.04 11.13,12.88H12.88C12.88,10.91 15.5,10.69 15.5,8.5A3.5,3.5 0 0,0 12,5Z")}${s("locate")}</button>`}
      </div>
    </div>`}render(){const{hass:t,t:e}=this.ctx,s=[...se(t,"vacuum"),...se(t,"lawn_mower")];return F`
      ${hs(e("robot"))}
      ${s.length?F`<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 620px))">${s.map(t=>this.robot(t))}</div>`:F`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
    `}};Cs.styles=[oe,gs,n`
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
    `],ks([ht({attribute:!1})],Cs.prototype,"ctx",2),Cs=ks([ct("sn-robot-page")],Cs);var Hs=Object.defineProperty,As=Object.getOwnPropertyDescriptor,Vs=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?As(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&Hs(e,s,n),n};let Ms=class extends ot{battery(t){const{hass:e}=this.ctx,s=e.states[t],i=[].concat(s.attributes.source??[],s.attributes.device_trackers??[]);for(const a of i){const t=e.states[a]?.attributes.battery_level;if("number"==typeof t)return t;const s=ae(e,a).find(t=>"battery"===e.states[t]?.attributes.device_class&&t.startsWith("sensor.")),i=s?Wt(e.states[s]):void 0;if(void 0!==i)return i}}person(t){const{hass:e,t:s,lang:i}=this.ctx,a=e.states[t],n="home"===a.state,r=n?s("home_state"):"not_home"===a.state?s("away"):a.state,o=a.attributes.entity_picture,l=Nt(e,t),c=this.battery(t);return F`<button class="glass person ${n?"home":""}" @click=${()=>Ce(this,t)}>
      <span class="avatar">
        ${o?F`<img src=${o} alt="" />`:F`<span class="initials">${l.slice(0,1).toUpperCase()}</span>`}
        <span class="dot"></span>
      </span>
      <span class="name">${l}</span>
      <span class="where">${le(n?"M9,13H15V19H18V10L12,5.5L6,10V19H9V13M4,21V9L12,3L20,9V21H4Z":"M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z",15)}${r}</span>
      <span class="meta">
        <span>${ne(a.last_changed,i)}</span>
        ${void 0!==c?F`<span class=${c<20?"low":""}>${le(mt,14)}${Math.round(c)}%</span>`:B}
      </span>
    </button>`}render(){const{hass:t,t:e}=this.ctx,s=se(t,"person"),i=s.filter(e=>"home"===t.states[e].state).length;return F`
      ${hs(e("family"),[e("at_home",{n:i})])}
      ${s.length?F`<div class="grid" style="--min: 150px">${s.map(t=>this.person(t))}</div>`:F`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
    `}};Ms.styles=[oe,gs,n`
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
    `],Vs([ht({attribute:!1})],Ms.prototype,"ctx",2),Ms=Vs([ct("sn-family-page")],Ms);var Ls=Object.defineProperty,Ss=Object.getOwnPropertyDescriptor,zs=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?Ss(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&Ls(e,s,n),n};const Es=t=>`${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;let Os=class extends ot{updated(){const{energy:t,solar_energy:e}=this.ctx.config.home,s=[t,e].filter(Boolean),i=s.join();if(!s.length||i===this.loadedFor)return;this.loadedFor=i;const a=new Date,n=new Date(a.getFullYear(),a.getMonth(),Math.min(1,a.getDate()-6));(async function(t,e,s){const i=await t.hass.callWS({type:"recorder/statistics_during_period",start_time:s.toISOString(),end_time:(new Date).toISOString(),statistic_ids:e,period:"day",types:["change"],units:{energy:"kWh"}}),a={};for(const n of e){const t=new Map;for(const e of i[n]??[]){const s="number"==typeof e.start?e.start:Date.parse(e.start),i=Es(new Date(s));t.set(i,(t.get(i)??0)+(e.change??0))}a[n]=t}return a})(this.ctx,s,n).then(t=>this.days=t).catch(()=>this.days=void 0)}render(){const{hass:t,t:e,config:s,lang:i}=this.ctx,{energy:a,solar_energy:n,solar_power:r}=s.home,o=a?this.days?.[a]:void 0,l=n?this.days?.[n]:void 0,c=new Date,d=t=>{const e=new Date(c);return e.setDate(e.getDate()-t),e},p=(t,e)=>t?.get(Es(e)),h=o?[...o.entries()].filter(([t])=>t.startsWith(`${c.getFullYear()}-${c.getMonth()}-`)).reduce((t,[,e])=>t+e,0):void 0,g=Array.from({length:7},(t,e)=>d(6-e)),u=Math.max(.1,...g.map(t=>(p(o,t)??0)+(p(l,t)??0))),m=t=>void 0===t?"–":t.toFixed(1),f=se(t,"sensor").filter(e=>"power"===t.states[e].attributes.device_class&&e!==r).map(e=>({id:e,kw:Bt(t.states[e])??0})).filter(t=>t.kw>.001).sort((t,e)=>e.kw-t.kw).slice(0,8),v=f[0]?.kw??1,b=r?Bt(t.states[r]):void 0;return a?F`
      ${hs(e("energy"),[void 0!==b?F`${le(zt,16)}${e("eco_solar",{kw:b.toFixed(1)})}`:void 0])}
      <div class="stats">
        <div class="glass stat"><span>${e("today")}</span><b>${m(p(o,c))}<small>kWh</small></b></div>
        <div class="glass stat"><span>${e("yesterday")}</span><b>${m(p(o,d(1)))}<small>kWh</small></b></div>
        <div class="glass stat"><span>${e("this_month")}</span><b>${m(h)}<small>kWh</small></b></div>
        ${n?F`<div class="glass stat sun"><span>${e("solar_today")}</span><b>${m(p(l,c))}<small>kWh</small></b></div>`:B}
      </div>
      <div class="cols">
        <sn-energy-card .ctx=${this.ctx}></sn-energy-card>
        <div class="glass card week">
          <h3>${e("last_7_days")}</h3>
          <div class="bars">
            ${g.map(t=>{const e=p(o,t)??0,s=p(l,t)??0;return F`<div class="col">
                <span class="v">${(e+s).toFixed(0)}</span>
                <div class="stack" style="height:${(e+s)/u*100}%">
                  ${s?F`<span class="s" style="flex:${s}"></span>`:B}
                  <span class="g" style="flex:${e||1e-4}"></span>
                </div>
                <span class="d">${t.toLocaleDateString(i,{weekday:"short"})}</span>
              </div>`})}
          </div>
        </div>
      </div>
      ${f.length?F`<div class="section">${e("top_consumers")}</div>
            <div class="glass card list">
              ${f.map(e=>F`<div class="row">
                  <span class="ic">${le(yt,16)}</span>
                  <span class="name">${Nt(t,e.id)}</span>
                  <span class="bar"><span style="width:${e.kw/v*100}%"></span></span>
                  <span class="kw">${e.kw>=1?`${e.kw.toFixed(2)} kW`:`${Math.round(1e3*e.kw)} W`}</span>
                </div>`)}
            </div>`:B}
    `:F`${hs(e("energy"))}<div class="glass"><div class="empty">${e("no_energy")}</div></div>`}};Os.styles=[oe,gs,n`
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
    `],zs([ht({attribute:!1})],Os.prototype,"ctx",2),zs([gt()],Os.prototype,"days",2),Os=zs([ct("sn-energy-page")],Os);var Ps=Object.defineProperty,Ts=Object.getOwnPropertyDescriptor,js=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?Ts(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&Ps(e,s,n),n};const Ds=["door","window","garage_door","opening"];let Zs=class extends ot{constructor(){super(...arguments),this.tick=0}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.tick++,1e4)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.timer)}lock(t){const{hass:e,t:s}=this.ctx,i="locked"===e.states[t].state;return F`<button
      class="glass tile lock ${i?"ok":"warn"}"
      @click=${()=>i?this.ctx.toast(s("confirm_unlock")):e.callService("lock","lock",{entity_id:t})}
      @pointerdown=${s=>i&&be(s,()=>e.callService("lock","unlock",{entity_id:t}))}
      @contextmenu=${ye}
    >
      <span class="ic">${le(i?wt:"M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",24)}</span>
      <span class="name">${Nt(e,t)}</span>
      <span class="st">${s(i?"locked":"unlocked")}</span>
    </button>`}opening(t){const{hass:e,t:s,lang:i}=this.ctx,a=e.states[t],n="on"===a.state,r=a.attributes.device_class;return F`<button class="glass tile ${n?"warn":"ok"}" @click=${()=>Ce(this,t)}>
      <span class="ic">${le("window"===r?n?"M21 20V2H3V20H1V23H23V20M19 4V11H17V4M5 4H7V11H5M5 20V13H7V20M9 20V4H15V20M17 20V13H19V20Z":"M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z":"garage_door"===r?n?"M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12Z":"M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12M8,15H16V17H8V15M16,18V20H8V18H16Z":n?bt:"M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z",24)}</span>
      <span class="name">${Nt(e,t)}</span>
      <span class="st">${s(n?"st_open":"st_closed")} · ${ne(a.last_changed,i)}</span>
    </button>`}alarm(t){const{hass:e,t:s}=this.ctx,i=e.states[t],a=i.state.startsWith("armed"),n=!!i.attributes.code_format&&!1!==i.attributes.code_arm_required,r=s=>()=>n||"alarm_disarm"===s&&i.attributes.code_format?Ce(this,t):e.callService("alarm_control_panel",s,{entity_id:t});return F`<div class="glass alarm ${a?"armed":""} ${"triggered"===i.state?"triggered":""}">
      <span class="shield">${le(a?Lt:St,34)}</span>
      <div class="ainfo">
        <span class="name">${Nt(e,t)}</span>
        <span class="st">${i.state.replace(/_/g," ")}</span>
      </div>
      <div class="abtns">
        <button class=${"armed_home"===i.state?"on":""} @click=${r("alarm_arm_home")}>${le("M11,13H13V16H16V11H18L12,6L6,11H8V16H11V13M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1Z",18)}${s("arm_home")}</button>
        <button class=${"armed_away"===i.state?"on":""} @click=${r("alarm_arm_away")}>${le(Lt,18)}${s("arm_away")}</button>
        <button class=${"disarmed"===i.state?"on":""} @click=${r("alarm_disarm")}>${le(St,18)}${s("disarm")}</button>
      </div>
    </div>`}camera(t){const{hass:e}=this.ctx,s=e.states[t].attributes.entity_picture,i=ie(e,t);return F`<button class="glass cam" @click=${()=>Ce(this,t)}>
      ${s?F`<img src="${s}${s.includes("?")?"&":"?"}t=${this.tick}" alt="" loading="lazy" />`:B}
      <span class="cam-label">${Nt(e,t)}${i?F`<small>${i}</small>`:B}</span>
    </button>`}render(){const{hass:t,t:e}=this.ctx,s=se(t,"alarm_control_panel"),i=se(t,"lock"),a=se(t,"binary_sensor").filter(e=>Ds.includes(t.states[e].attributes.device_class)),n=se(t,"camera"),r=i.filter(e=>"locked"!==t.states[e].state),o=a.filter(e=>"on"===t.states[e].state),l=s.length+i.length+a.length+n.length;return F`
      ${hs(e("security"),[i.length?r.length?e("n_unlocked",{n:r.length}):e("all_locked"):void 0,a.length?o.length?e("n_open",{n:o.length}):e("all_closed"):void 0],r.length?F`<button class="action" @click=${()=>t.callService("lock","lock",{entity_id:r})}>${le(wt,18)}${e("lock_all")}</button>`:void 0)}
      ${l?B:F`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
      ${s.map(t=>this.alarm(t))}
      ${i.length?F`<div class="section">${e("locks")}</div><div class="grid" style="--min: 180px">${i.map(t=>this.lock(t))}</div>`:B}
      ${a.length?F`<div class="section">${e("doors_windows")}</div>
            <div class="grid" style="--min: 180px">${[...o,...a.filter(t=>!o.includes(t))].map(t=>this.opening(t))}</div>`:B}
      ${n.length?F`<div class="section">${e("cameras")}</div><div class="grid" style="--min: 280px">${n.map(t=>this.camera(t))}</div>`:B}
    `}};Zs.styles=[oe,gs,n`
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
      .cam img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
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
    `],js([ht({attribute:!1})],Zs.prototype,"ctx",2),js([gt()],Zs.prototype,"tick",2),Zs=js([ct("sn-security-page")],Zs);var Us=Object.defineProperty,Rs=Object.getOwnPropertyDescriptor,Ns=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?Rs(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&Us(e,s,n),n};let Fs=class extends ot{constructor(){super(...arguments),this.liveVol={}}volDrag(t,e){const s=t.currentTarget,i=s.getBoundingClientRect(),a=this.ctx.rtl,n=t=>{const e=Math.min(1,Math.max(0,(t.clientX-i.left)/i.width));return a?1-e:e};s.setPointerCapture(t.pointerId),this.liveVol={...this.liveVol,[e]:n(t)};const r=t=>this.liveVol={...this.liveVol,[e]:n(t)},o=()=>{s.removeEventListener("pointermove",r),s.removeEventListener("pointerup",o),s.removeEventListener("pointercancel",o),this.ctx.hass.callService("media_player","volume_set",{entity_id:e,volume_level:Math.round(100*this.liveVol[e])/100}),setTimeout(()=>{const{[e]:t,...s}=this.liveVol;this.liveVol=s},1500)};s.addEventListener("pointermove",r),s.addEventListener("pointerup",o),s.addEventListener("pointercancel",o)}player(t){const{hass:e,t:s}=this.ctx,i=e.states[t],a=i.attributes,n=a.supported_features??0,r=Ft(i),o="playing"===i.state,l=a.entity_picture,c=a.media_title,d=[a.media_artist,a.app_name??a.source].filter(Boolean).join(" · "),p=this.liveVol[t]??("number"==typeof a.volume_level?a.volume_level:void 0),h=s=>()=>e.callService("media_player",s,{entity_id:t});return F`<div class="glass player ${o?"playing":""}">
      <div class="art" style=${l&&r?`--art: url("${l}")`:""}>
        ${l&&r?F`<img src=${l} alt="" loading="lazy" />`:le(ce(t,i),46)}
      </div>
      <div class="body">
        <div class="head">
          <div class="titles">
            <span class="dev">${Nt(e,t)}${ie(e,t)?F` · ${ie(e,t)}`:B}</span>
            <span class="title">${r?c??i.state:s("off")}</span>
            ${r&&d?F`<span class="sub">${d}</span>`:B}
          </div>
          ${128&n||r?F`<button class="round small ${r?"lit":""}" aria-label=${s("on")} @click=${h(r?"turn_off":"turn_on")}>${le(Vt,18)}</button>`:B}
        </div>
        ${r?F`<div class="transport">
              ${16&n?F`<button class="round" aria-label="previous" @click=${h("media_previous_track")}>${le("M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z")}</button>`:B}
              ${16385&n?F`<button class="round big" aria-label=${o?"pause":"play"} @click=${h("media_play_pause")}>${le(o?Ht:At,26)}</button>`:B}
              ${32&n?F`<button class="round" aria-label="next" @click=${h("media_next_track")}>${le("M16,18H18V6H16M6,18L14.5,12L6,6V18Z")}</button>`:B}
            </div>
            ${4&n&&void 0!==p?F`<div class="vol">
                  ${le("M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",18)}
                  <div class="vtrack" @pointerdown=${e=>this.volDrag(e,t)}>
                    <span style="width:${100*p}%"></span>
                  </div>
                  <span class="vnum">${Math.round(100*p)}</span>
                </div>`:B}`:B}
      </div>
    </div>`}render(){const{hass:t,t:e}=this.ctx,s=se(t,"media_player"),i=e=>"playing"===t.states[e].state?0:Ft(t.states[e])?1:2,a=[...s].sort((t,e)=>i(t)-i(e)),n=s.filter(e=>"playing"===t.states[e].state).length;return F`
      ${hs(e("media"),[n?e("n_playing",{n:n}):e("nothing_playing")])}
      ${a.length?F`<div class="grid" style="--min: 340px">${a.map(t=>this.player(t))}</div>`:F`<div class="glass"><div class="empty">${e("not_configured")}</div></div>`}
    `}};Fs.styles=[oe,gs,n`
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
    `],Ns([ht({attribute:!1})],Fs.prototype,"ctx",2),Ns([gt()],Fs.prototype,"liveVol",2),Fs=Ns([ct("sn-media-page")],Fs);var Is=Object.defineProperty,Ws=Object.getOwnPropertyDescriptor,Bs=(t,e,s,i)=>{for(var a,n=i>1?void 0:i?Ws(e,s):e,r=t.length-1;r>=0;r--)(a=t[r])&&(n=(i?a(e,s,n):a(n))||n);return i&&n&&Is(e,s,n),n};!function(){if(document.getElementById("sn-pro-fonts"))return;const t=document.createElement("style");t.id="sn-pro-fonts",t.textContent='\n    @font-face { font-family: "SN Outfit"; font-style: normal; font-display: swap; font-weight: 100 900;\n      src: url(/smartnest_pro_static/assets/outfit-latin-wght-normal-Bc-8i84L.woff2) format("woff2-variations"); }\n    @font-face { font-family: "SN Alexandria"; font-style: normal; font-display: swap; font-weight: 100 900;\n      src: url(/smartnest_pro_static/assets/alexandria-arabic-wght-normal-BMWQQIfH.woff2) format("woff2-variations");\n      unicode-range: U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0898-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC; }\n  ',document.head.appendChild(t)}();const Ys=["home","rooms","climate","lights"];let qs=class extends ot{constructor(){super(...arguments),this.narrow=!1,this.page="home",this.width=1200,this.query="",this.resize=new ResizeObserver(([t])=>this.width=t.contentRect.width)}connectedCallback(){super.connectedCallback(),this.resize.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.resize.disconnect(),this.unsub?.(),this.unsub=void 0}willUpdate(t){t.has("hass")&&this.hass&&!this.config&&!this.loadError&&this.load()}async load(){const t=this.hass;this.loadError="";try{const e=await t.callWS({type:"smartnest_pro/config/get"});this.config=Tt(e.config),this.unsub=await t.connection.subscribeMessage(t=>{this.draft||(this.config=Tt(t.config))},{type:"smartnest_pro/config/subscribe"})}catch(e){this.loadError=e?.message??"SmartNest failed to load"}}get phone(){return this.width<760}get live(){return this.draft??this.config}defaultRoom(t){const e=this.hass;if(t.settings.default_room&&e.areas?.[t.settings.default_room])return t.settings.default_room;const s=Yt(e);return s.find(s=>Kt(e,s.area_id,t.rooms[s.area_id]).occupied)?.area_id??s[0]?.area_id}ctx(){const t=this.live,e=(s=t.settings.language,i=this.hass.language??"en","auto"===s?i.startsWith("ar")?"ar":"en":s);var s,i;const a=this.room&&this.hass.areas?.[this.room]?this.room:this.defaultRoom(t);return{hass:this.hass,config:t,t:Ut(e),lang:e,rtl:"ar"===e,phone:this.phone,isAdmin:!!this.hass.user?.is_admin,editing:!!this.draft,assetBase:this.panel?.config?.asset_base??"/smartnest_pro_static/static/",room:a,selectRoom:t=>{this.room=t,this.phone&&this.openRoomSheet(t)},update:t=>{const e=jt(this.draft??this.config);t(e),this.draft=e},showSheet:t=>this.sheet=t,closeSheet:()=>this.sheet=void 0,openLevel:t=>this.sheet={title:Nt(this.hass,t),render:e=>F`<sn-level .ctx=${e} .entity=${t}></sn-level>`,back:this.sheet},toast:t=>this.toast(t)}}openRoomSheet(t){this.sheet={title:this.hass.areas?.[t]?.name??t,half:!0,render:e=>F`<sn-room-panel bare .ctx=${e} .area=${t}></sn-room-panel>`}}toast(t){this.toastMsg=t,clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastMsg=void 0,2600)}startEdit(){this.draft=jt(this.config)}cancelEdit(){this.draft=void 0,this.sheet=void 0}async save(t){if(this.draft)try{await this.hass.callWS({type:"smartnest_pro/config/save",config:this.draft}),this.config=this.draft,this.draft=void 0,this.sheet=void 0,this.toast(t("saved"))}catch{this.toast(t("save_failed"))}}greeting(t){const e=(new Date).getHours(),s=e<12?t.t("good_morning"):e<18?t.t("good_afternoon"):t.t("good_evening"),i=this.hass.user?.name?.split(" ")[0]??t.config.settings.home_name;return F`<div class="greet"><span>${s}</span><strong>${i}</strong></div>`}ecoChip(t){const e=t.config.home.solar_power;if(!e)return B;const s=Bt(this.hass.states[e]);return void 0===s?B:F`<span class="eco ${s>.05?"lit":""}"
      ><span class="leaf">${le(_t,16)}</span>${t.t("eco_solar",{kw:s.toFixed(1)})}</span
    >`}search(t){const e=this.query.trim().toLowerCase(),s=e?[...Yt(t.hass).filter(t=>t.name.toLowerCase().includes(e)).map(e=>({key:e.area_id,label:e.name,icon:bt,go:()=>(t.selectRoom(e.area_id),this.page=this.phone?this.page:"rooms")})),...Object.keys(t.hass.states).filter(s=>Nt(t.hass,s).toLowerCase().includes(e)).slice(0,8).map(e=>({key:e,label:Nt(t.hass,e),icon:kt,go:()=>Ce(this,e)}))].slice(0,10):[];return F`<div class="search">
      ${le(kt,18)}
      <input
        .value=${this.query}
        placeholder=${t.t("search")}
        @input=${t=>this.query=t.target.value}
        @keydown=${t=>"Escape"===t.key&&(this.query="")}
      />
      ${s.length?F`<div class="results glass">
            ${s.map(t=>F`<button
                @click=${()=>{this.query="",t.go()}}
              >
                ${le(t.icon,16)}${t.label}
              </button>`)}
          </div>`:B}
    </div>`}editControls(t){return!t.isAdmin||this.phone?B:t.editing?F`<div class="edit-bar">
      <button class="pill" @click=${()=>{var e;(e=t).showSheet({title:e.t("settings"),render:t=>{const e=t.config.settings;return F`
        ${me(t.t("home_name"),e.home_name,e=>t.update(t=>t.settings.home_name=e))}
        ${ue(t.t("language"),e.language,[["auto",t.t("lang_auto")],["en","English"],["ar","العربية"]],e=>t.update(t=>t.settings.language=e))}
        ${ue(t.t("theme"),e.theme,[["auto",t.t("theme_auto")],["light",t.t("theme_light")],["dark",t.t("theme_dark")]],e=>t.update(t=>t.settings.theme=e))}
        ${ue(t.t("default_room"),e.default_room??"",[["",t.t("none")],...Yt(t.hass).map(t=>[t.area_id,t.name])],e=>t.update(t=>t.settings.default_room=e||void 0))}
        <label class="check">
          <input type="checkbox" .checked=${e.reduce_effects} @change=${e=>t.update(t=>t.settings.reduce_effects=e.target.checked)} />
          ${t.t("reduce_effects")}
        </label>
      `}})}}>${le(vt,18)}${t.t("settings")}</button>
      <button class="pill" @click=${this.cancelEdit}>${le(ft,18)}${t.t("cancel")}</button>
      <button class="pill primary" @click=${()=>this.save(t.t)}>${le("M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",18)}${t.t("save")}</button>
    </div>`:F`<button class="pill" @click=${this.startEdit}>${le("M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z",18)}${t.t("edit")}</button>`}navItems(t){const e=(...e)=>Object.keys(t.hass.states).some(t=>e.includes(t.split(".")[0]));return[{page:"home",icon:$t,label:t.t("home"),show:!0},{page:"rooms",icon:"M3 11H11V3H3M5 5H9V9H5M13 21H21V13H13M15 15H19V19H15M3 21H11V13H3M5 15H9V19H5M13 3V11H21V3M19 9H15V5H19Z",label:t.t("rooms"),show:!0},{page:"climate",icon:"M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z",label:t.t("climate"),show:e("climate","fan")},{page:"lights",icon:"M7 19A2.93 2.93 0 0 0 7.17 20H6A1 1 0 0 1 5 19V18H7M10 19A1 1 0 0 0 11 20H13A1 1 0 0 0 14 19V18H10M4 16A1 1 0 0 0 5 17H7V14.88A6.92 6.92 0 0 1 5 10A6.79 6.79 0 0 1 5.68 7A4 4 0 0 0 4 14.45M17 19A2.93 2.93 0 0 1 16.83 20H18A1 1 0 0 0 19 19V18H17M17 10A5 5 0 0 1 15 14V16A1 1 0 0 1 14 17H10A1 1 0 0 1 9 16V14A5 5 0 1 1 17 10M15 10A3 3 0 1 0 11 12.82V15H13V12.82A3 3 0 0 0 15 10M18.32 7A6.79 6.79 0 0 1 19 10A6.92 6.92 0 0 1 17 14.88V17H19A1 1 0 0 0 20 16V14.45A4 4 0 0 0 18.32 7Z",label:t.t("lights"),show:e("light")},{page:"robot",icon:Mt,label:t.t("robot"),show:e("vacuum","lawn_mower")},{page:"family",icon:ut,label:t.t("family"),show:e("person")},{page:"energy",icon:"M11 15H6L13 1V9H18L11 23V15Z",label:t.t("energy"),show:!0},{page:"security",icon:"M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M11,14H13V17H16V12H18L12,7L6,12H8V17H11V14",label:t.t("security"),show:e("lock","alarm_control_panel","camera","binary_sensor")},{page:"media",icon:"M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z",label:t.t("media"),show:e("media_player")}].filter(t=>t.show)}go(t){this.page=t,this.sheet=void 0,this.renderRoot.querySelector("main")?.scrollTo({top:0})}renderPage(t){switch(this.page){case"rooms":return F`<sn-rooms-page .ctx=${t}></sn-rooms-page>`;case"climate":return F`<sn-climate-page .ctx=${t}></sn-climate-page>`;case"lights":return F`<sn-lights-page .ctx=${t}></sn-lights-page>`;case"robot":return F`<sn-robot-page .ctx=${t}></sn-robot-page>`;case"family":return F`<sn-family-page .ctx=${t}></sn-family-page>`;case"energy":return F`<sn-energy-page .ctx=${t}></sn-energy-page>`;case"security":return F`<sn-security-page .ctx=${t}></sn-security-page>`;case"media":return F`<sn-media-page .ctx=${t}></sn-media-page>`;default:return this.phone?this.homePhone(t):this.homeWide(t)}}tabbar(t){const e=this.navItems(t),s=e.filter(t=>Ys.includes(t.page)),i=e.filter(t=>!Ys.includes(t.page)),a=i.some(t=>t.page===this.page);return F`<nav class="tabbar glass">
      ${s.map(t=>F`<button class=${this.page===t.page?"on":""} @click=${()=>this.go(t.page)}>${le(t.icon,22)}<span>${t.label}</span></button>`)}
      ${i.length?F`<button
            class=${a?"on":""}
            @click=${()=>this.sheet={title:t.t("more"),render:()=>F`<div class="more-grid">
                  ${i.map(t=>F`<button class=${this.page===t.page?"on":""} @click=${()=>this.go(t.page)}>
                      <span>${le(t.icon,26)}</span>${t.label}
                    </button>`)}
                </div>`}}
          >
            ${le(a?i.find(t=>t.page===this.page).icon:"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",22)}<span>${a?i.find(t=>t.page===this.page).label:t.t("more")}</span>
          </button>`:B}
    </nav>`}homeWide(t){return F`<div class="home">
      <div class="col-left">
        ${this.greeting(t)}
        <sn-energy-card .ctx=${t}></sn-energy-card>
      </div>
      <sn-house-hero class="hero" .ctx=${t}></sn-house-hero>
      <div class="col-side">
        <sn-room-panel .ctx=${t} .area=${t.room}></sn-room-panel>
        <sn-scenes-card .ctx=${t}></sn-scenes-card>
      </div>
      <sn-climate-card class="climate" .ctx=${t}></sn-climate-card>
      <sn-devices-card class="devices" .ctx=${t}></sn-devices-card>
    </div>`}homePhone(t){const e=Yt(t.hass);return F`<div class="home-phone">
      <sn-house-hero class="hero" .ctx=${t}></sn-house-hero>
      ${e.length?F`<div class="room-chips">
            ${e.map(e=>{const s=Kt(t.hass,e.area_id,t.config.rooms[e.area_id]);return F`<button class="room-chip ${s.occupied?"occ":""}" @click=${()=>t.selectRoom(e.area_id)}>
                <b>${e.name}</b>
                <span>${[void 0!==s.temperature?`${s.temperature.toFixed(1)}°`:"",s.people?`${s.people} 👤`:""].filter(Boolean).join(" · ")||"—"}</span>
              </button>`})}
          </div>`:B}
      <sn-energy-card .ctx=${t}></sn-energy-card>
      <sn-climate-card .ctx=${t}></sn-climate-card>
      <sn-devices-card .ctx=${t}></sn-devices-card>
      <sn-scenes-card .ctx=${t}></sn-scenes-card>
    </div>`}render(){if(this.loadError)return F`<div class="center">${this.loadError}<button class="pill" @click=${()=>this.load()}>↻</button></div>`;if(!this.hass||!this.live)return F`<div class="center"><div class="spinner"></div></div>`;const t=this.ctx(),e=t.config.settings,s="dark"===e.theme||"auto"===e.theme&&!!this.hass.themes?.darkMode;this.toggleAttribute("dark",s),this.toggleAttribute("lowfx",e.reduce_effects),this.toggleAttribute("phone",this.phone),this.dir=t.rtl?"rtl":"ltr",this.lang=t.lang,this.navItems(t).some(t=>t.page===this.page)||(this.page="home");const i=this.renderPage(t);return F`
      <div class="bg"></div>
      ${this.phone?F`<div class="shell-phone">
            <header class="top-phone">
              ${this.narrow?F`<button class="round" aria-label=${t.t("open_menu")} @click=${()=>this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))}>${le(Ct)}</button>`:B}
              ${this.greeting(t)} ${this.ecoChip(t)}
            </header>
            <main>${i}</main>
            ${this.tabbar(t)}
          </div>`:F`<div class="shell">
            <div class="brand">
              ${this.narrow?F`<button class="round" aria-label=${t.t("open_menu")} @click=${()=>this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))}>${le(Ct)}</button>`:F`<svg class="logo" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z"></path></svg>`}
              <span>SmartNest</span>
            </div>
            <header class="top">
              ${this.search(t)} ${this.ecoChip(t)}
              <span class="spacer"></span>
              ${this.editControls(t)}
            </header>
            <nav class="rail glass">
              ${this.navItems(t).map(t=>F`<button class=${this.page===t.page?"on":""} aria-label=${t.label} title=${t.label} @click=${()=>this.go(t.page)}>
                  ${le(t.icon,20)}
                </button>`)}
            </nav>
            <main>${i}</main>
          </div>`}
      <sn-sheet .spec=${this.sheet} .ctx=${t} ?phone=${this.phone} @close=${()=>this.sheet=this.sheet?.back}></sn-sheet>
      ${this.toastMsg?F`<div class="toast glass">${this.toastMsg}</div>`:B}
    `}};qs.styles=[re,oe,n`
      :host {
        display: block;
        position: relative;
        min-height: 100vh;
        height: 100vh;
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
      .rail {
        align-self: start;
        max-height: 100%;
        overflow-y: auto;
        scrollbar-width: none;
        display: grid;
        gap: 10px;
        justify-items: center;
        width: 64px;
        padding: 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 255, 255, 0.25);
      }
      .rail button {
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
        background: #fff;
        color: #1d1b19;
        box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.35);
      }
      main {
        position: relative;
        min-height: 0;
        min-width: 0;
      }
      .shell main {
        overflow: auto;
      }

      /* ---------- Home, wide ---------- */
      .shell main {
        container-type: inline-size;
      }
      .home {
        display: grid;
        grid-template-columns: minmax(300px, 340px) minmax(0, 1fr) minmax(330px, 380px);
        grid-template-rows: minmax(0, 1fr) auto;
        grid-template-areas:
          "left hero side"
          "climate devices side";
        gap: 20px;
        height: 100%;
        min-height: 640px;
      }
      .col-left {
        grid-area: left;
        display: flex;
        flex-direction: column;
        gap: 22px;
        min-height: 0;
        z-index: 1;
      }
      .greet {
        display: grid;
        gap: 4px;
        color: var(--sn-text-on-bg);
      }
      .greet span {
        font-size: 26px;
        font-weight: 300;
        color: var(--sn-text-on-bg-dim);
      }
      .greet strong {
        font-size: 44px;
        font-weight: 400;
        letter-spacing: -0.02em;
        line-height: 1.05;
      }
      .hero {
        grid-area: hero;
        min-height: 0;
        margin-inline: -70px -20px;
      }
      .col-side {
        grid-area: side;
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 0;
      }
      .col-side sn-room-panel {
        flex: 1;
        min-height: 0;
        overflow: auto;
        border-radius: var(--sn-radius);
      }
      .climate {
        grid-area: climate;
      }
      .devices {
        grid-area: devices;
      }
      @container (max-width: 1080px) {
        .home {
          grid-template-columns: minmax(290px, 310px) minmax(0, 1fr) minmax(300px, 330px);
          gap: 16px;
        }
      }
      /* Portrait tablets, or a landscape tablet with HA's sidebar open: two columns, the page scrolls. */
      @container (max-width: 940px) {
        .home {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          grid-template-rows: auto;
          grid-template-areas:
            "left hero"
            "climate side"
            "devices devices";
          height: auto;
          min-height: 0;
        }
        .hero {
          min-height: 380px;
          margin-inline: -20px 0;
        }
        .col-side sn-room-panel {
          flex: none;
          overflow: visible;
        }
        .climate {
          align-self: start;
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
      .home-phone .hero {
        height: 40vh;
        min-height: 240px;
        margin: 0 -16px;
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
      .tabbar button {
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
        background: rgba(255, 255, 255, 0.12);
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
    `],Bs([ht({attribute:!1})],qs.prototype,"hass",2),Bs([ht({type:Boolean})],qs.prototype,"narrow",2),Bs([ht({attribute:!1})],qs.prototype,"panel",2),Bs([gt()],qs.prototype,"config",2),Bs([gt()],qs.prototype,"draft",2),Bs([gt()],qs.prototype,"page",2),Bs([gt()],qs.prototype,"room",2),Bs([gt()],qs.prototype,"sheet",2),Bs([gt()],qs.prototype,"toastMsg",2),Bs([gt()],qs.prototype,"width",2),Bs([gt()],qs.prototype,"query",2),Bs([gt()],qs.prototype,"loadError",2),qs=Bs([ct("smartnest-pro-panel")],qs);export{qs as SmartNestProPanel};
