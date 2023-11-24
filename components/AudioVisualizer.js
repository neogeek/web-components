{
  const defaultWidth = '400';
  const defaultWidthScale = '100';
  const defaultHeight = '200';
  const defaultFill = '#f00';

  const styles = `
:host {
  --canvas-background-color: #eee;
}
canvas {
  background-color: var(--canvas-background-color);
}
`;

  class AudioVisualizer extends HTMLElement {
    constructor() {
      super();

      const src = this.getAttribute('src');

      if (!src) {
        throw new Error('Missing required src attribute.');
      }

      /**
       * @type {string}
       */
      this.src = src;
      /**
       * @type {string | null}
       */
      this.width = this.getAttribute('width');
      /**
       * @type {string | null}
       */
      this.widthScale = this.getAttribute('width-scale');
      /**
       * @type {string | null}
       */
      this.height = this.getAttribute('height');
      /**
       * @type {string}
       */
      this.fill = this.getAttribute('fill') || defaultFill;
    }

    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');

      style.appendChild(document.createTextNode(styles));

      shadow.appendChild(style);

      const canvas = document.createElement('canvas');

      canvas.setAttribute('width', this.width || defaultWidth);
      canvas.setAttribute('height', this.height || defaultHeight);

      shadow.appendChild(canvas);

      this.loadAudioFile(this.src);
    }

    static get observedAttributes() {
      return ['src', 'width', 'height', 'fill'];
    }

    /**
     * @param {string} name
     * @param {string} previousValue
     * @param {string} newValue
     */

    attributeChangedCallback(name, previousValue, newValue) {
      if (!this.shadowRoot) {
        return;
      }

      this[name] = newValue;

      if (['width', 'height'].includes(name)) {
        const canvas = this.shadowRoot.querySelector('canvas');

        if (!canvas) {
          throw new Error('Canvas not found!');
        }

        canvas.setAttribute(name, newValue);

        if (this.audioBuffer) {
          this.renderAudioBuffer(this.audioBuffer);
        }
      } else if (name === 'src') {
        this.loadAudioFile(newValue);
      } else if (name === 'fill') {
        if (this.audioBuffer) {
          this.renderAudioBuffer(this.audioBuffer);
        }
      }
    }

    /**
     * @param {string} src
     */
    loadAudioFile(src) {
      fetch(src)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();

          reader.onload = ({ target }) => {
            if (
              !target ||
              !target.result ||
              !(target.result instanceof ArrayBuffer)
            ) {
              throw new Error('Error loading audio.');
            }

            const audioContext = new AudioContext();

            audioContext.decodeAudioData(target.result, buffer => {
              const offlineContext = new OfflineAudioContext(
                1,
                buffer.length,
                buffer.sampleRate
              );

              const source = offlineContext.createBufferSource();
              source.buffer = buffer;
              source.connect(offlineContext.destination);
              source.start();

              offlineContext.startRendering().then(audioBuffer => {
                /**
                 * @type {AudioBuffer}
                 */
                this.audioBuffer = audioBuffer;

                this.renderAudioBuffer(this.audioBuffer);
              });
            });
          };

          reader.readAsArrayBuffer(blob);
        });
    }

    /**
     * @param {AudioBuffer} audioBuffer
     */
    renderAudioBuffer(audioBuffer) {
      if (!this.shadowRoot) {
        return;
      }

      const canvas = this.shadowRoot.querySelector('canvas');

      if (!canvas) {
        throw new Error('Canvas not found!');
      }

      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Canvas 2d context not available!');
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      const data = audioBuffer.getChannelData(0);

      if (!this.width) {
        // eslint-disable-next-line no-magic-numbers
        canvas.setAttribute(
          'width',
          String(
            audioBuffer.duration *
              parseFloat(this.widthScale || defaultWidthScale)
          )
        );
      }

      const step = Math.ceil(data.length / canvas.width);
      // eslint-disable-next-line no-magic-numbers
      const amp = canvas.height / 2;

      for (let i = 0, length = canvas.width; i < length; i += 1) {
        let min = 1.0;
        let max = -1.0;

        for (let j = 0; j < step; j += 1) {
          const datum = data[i * step + j];
          if (datum < min) {
            min = datum;
          }
          if (datum > max) {
            max = datum;
          }
        }

        context.fillStyle = this.fill;

        context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
      }
    }
  }

  customElements.define('audio-visualizer', AudioVisualizer);
}
