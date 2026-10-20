// Pieces every page shares: the header with title and summary chips, and the grid the cards sit in.
import { css, html, nothing, type TemplateResult } from "lit";

export const pageHead = (title: string, chips: (TemplateResult | string | false | undefined)[] = [], actions?: TemplateResult) =>
  html`<header class="page-head">
    <h1>${title}</h1>
    <div class="page-chips">${chips.filter(Boolean).map((c) => html`<span class="page-chip">${c}</span>`)}</div>
    ${actions ?? nothing}
  </header>`;

export const pageStyles = css`
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
`;
