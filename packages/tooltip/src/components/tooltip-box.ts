import { CSSResult, LitElement, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'

import { styles } from '../assets'

export const enum TooltipStyleVariables {
  TooltipBoxMinWidth = '--m2-tooltip-box-min-width',
  TooltipBoxMinHeight = '--m2-tooltip-box-min-height',
  TooltipBoxWidth = '--m2-tooltip-box-width',
  TooltipBoxHeight = '--m2-tooltip-box-height',
  TooltipBoxMaxWidth = '--m2-tooltip-box-max-width',
  TooltipBoxMaxHeight = '--m2-tooltip-box-max-height',
}

@customElement('tooltip-box')
class TooltipBox extends LitElement {
  @property({ type: String }) subject?: string
  @property({ type: String }) content?: string

  @property({ type: Number }) positionX: number = 0
  @property({ type: Number }) positionY: number = 0

  @property({ type: Number }) width?: number
  @property({ type: Number }) height?: number

  @property({ type: Boolean }) resizable: boolean = false

  @property({ type: Boolean, reflect: true }) show: boolean = false

  static get styles(): CSSResult[] {
    return [
      styles,
      css`
        :host {
          display: none;
          position: absolute;
          z-index: 100;
        }
        :host([show]) {
          display: initial;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <article tooltip-box ?resizable="${this.resizable}">
        ${this.subject ? html` <h1 subject>${this.subject}</h1> ` : ''}

        <section content>${this.content}</section>
      </article>
    `
  }

  updated(changedProps: PropertyValues): void {
    debugger
    if (changedProps.has('width') && this.width) this.setWidthProperty(this.width)
    if (changedProps.has('height') && this.height) this.setHeightProperty(this.height)

    if (changedProps.has('positionX')) this.setPositionX(this.positionX)
    if (changedProps.has('positionY')) this.setPositionY(this.positionY)
  }

  private setWidthProperty(width: number): void {
    if (width <= 0) throw new Error('width property should bigger than 0')
    this.style.setProperty(TooltipStyleVariables.TooltipBoxWidth, width + 'px')
    this.style.setProperty(TooltipStyleVariables.TooltipBoxMaxWidth, width * 10 + 'px')
  }

  private setHeightProperty(height: number): void {
    if (height <= 0) throw new Error('height property should bigger than 0')
    this.style.setProperty(TooltipStyleVariables.TooltipBoxHeight, height + 'px')
    this.style.setProperty(TooltipStyleVariables.TooltipBoxMaxHeight, height * 10 + 'px')
  }

  private setPositionX(positionX: number = 0): void {
    this.style.left = positionX + 'px'
  }
  private setPositionY(positionY: number = 0): void {
    this.style.top = positionY + 'px'
  }
}

export type TooltipOptions = { subject?: string; content: string }

export class Tooltip {
  static show(positionX: number = 0, positionY: number = 0, options: TooltipOptions): void {
    const tooltipBox: TooltipBox = document.createElement('tooltip-box') as TooltipBox
    tooltipBox.positionX = positionX
    tooltipBox.positionY = positionY
    if (options.subject) tooltipBox.subject = options.subject
    tooltipBox.content = options.content

    document.body.appendChild(tooltipBox)
    tooltipBox.show = true
  }
}