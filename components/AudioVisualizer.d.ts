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
