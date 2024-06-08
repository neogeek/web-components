declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['copy-to-clipboard']: CopyToClipboardAttributes;
    }

    interface CopyToClipboardAttributes {}
  }
}
