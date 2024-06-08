# @neogeek/web-components

## Demo

```bash
python3 -m http.server
```

## Components

### `<audio-visualizer>`

#### Usage

```html
<script
  src="http://unpkg.com/@neogeek/web-components@0.0.1/components/AudioVisualizer.js"
  defer
></script>

<audio-visualizer
  src="demo.mp3"
  width="1000"
  height="200"
  fill="#f00"
></audio-visualizer>
```

#### Custom Styles

```css
audio-visualizer {
  --canvas-background-color: #eee;
}
```

#### Type Definition

```typescript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['audio-visualizer']: AudioVisualizerAttributes;
    }

    interface AudioVisualizerAttributes {
      src: string;
      width: string;
      height: string;
      fill: string;
    }
  }
}
```

### `<copy-to-clipboard>`

#### Usage

```html
<script
  src="http://unpkg.com/@neogeek/web-components@0.0.1/components/CopyToClipboard.js"
  defer
></script>

<copy-to-clipboard><pre>Hello, World</pre></copy-to-clipboard>
```

#### Custom Styles

```css
copy-to-clipboard {
  --pre-background-color: #eee;
}
```

#### Type Definition

```typescript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['copy-to-clipboard']: CopyToClipboardAttributes;
    }

    interface CopyToClipboardAttributes {}
  }
}
```
