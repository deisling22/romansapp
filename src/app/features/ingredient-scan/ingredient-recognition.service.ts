import { Injectable } from '@angular/core';
import type { Tensor } from '@tensorflow/tfjs-core';

export interface RecognizedIngredientCandidate {
  name: string;
  confidence: number;
}

export interface RecognizedIngredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  confidence: number | null;
  candidates: RecognizedIngredientCandidate[];
}

interface Detection {
  class: string;
  score: number;
}

interface GraphModelLike {
  executeAsync(input: Tensor): Promise<Tensor[]>;
}

interface DetectionModel {
  detect(image: HTMLImageElement, maxNumBoxes?: number, minScore?: number): Promise<Detection[]>;
  // coco-ssd keeps this as a TS-private field, but it's a normal accessible property at runtime;
  // we need it to read per-class scores directly, since the public detect() API only returns the
  // single best class per box and discards the rest.
  model?: GraphModelLike;
}

interface RawDetection {
  candidates: { className: string; score: number }[];
}

// The 80 COCO object classes coco-ssd's bundled models were trained on, in the exact order the
// model's class-score tensor uses. Note "lemon"/"lion"/most fruit-but-not-these are simply not
// in this list — such objects can never be recognized correctly, no matter the confidence shown.
const COCO_CLASS_NAMES = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
  'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog',
  'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella',
  'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite',
  'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle',
  'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
  'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant',
  'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
  'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors',
  'teddy bear', 'hair drier', 'toothbrush',
];

const INGREDIENT_CLASSES: Record<string, string> = {
  apple: 'Apfel',
  banana: 'Banane',
  broccoli: 'Brokkoli',
  cake: 'Kuchen',
  carrot: 'Möhre',
  donut: 'Donut',
  'hot dog': 'Hotdog',
  orange: 'Orange',
  pizza: 'Pizza',
  sandwich: 'Sandwich',
};

const MAX_BOXES = 20;
const MIN_BOX_SCORE = 0.15;
const TOP_CANDIDATES = 5;

function displayNameFor(className: string): string {
  const known = INGREDIENT_CLASSES[className];
  if (known) {
    return known;
  }
  return className.charAt(0).toUpperCase() + className.slice(1);
}

@Injectable({ providedIn: 'root' })
export class IngredientRecognitionService {
  private modelPromise: Promise<DetectionModel> | null = null;
  private tfPromise: Promise<typeof import('@tensorflow/tfjs-core')> | null = null;
  private nextId = 1;

  async recognize(image: HTMLImageElement): Promise<RecognizedIngredient[]> {
    const model = await this.loadModel();
    const detections = await this.detectWithCandidates(model, image);
    const grouped = new Map<string, { count: number; confidence: number; candidates: RecognizedIngredientCandidate[] }>();

    for (const detection of detections) {
      const displayCandidates = detection.candidates.map((candidate) => ({
        name: displayNameFor(candidate.className),
        confidence: candidate.score,
      }));
      const bestFood = detection.candidates.find(
        (candidate) => INGREDIENT_CLASSES[candidate.className] && candidate.score >= MIN_BOX_SCORE,
      );
      if (!bestFood) {
        continue;
      }
      const name = INGREDIENT_CLASSES[bestFood.className];
      const existing = grouped.get(name);
      if (!existing || bestFood.score > existing.confidence) {
        grouped.set(name, {
          count: (existing?.count ?? 0) + 1,
          confidence: bestFood.score,
          candidates: displayCandidates,
        });
      } else {
        existing.count += 1;
      }
    }

    return [...grouped.entries()]
      .map(([name, result]) => ({
        id: this.nextId++,
        name,
        quantity: result.count,
        unit: 'Stk.',
        confidence: result.confidence,
        candidates: result.candidates,
      }))
      .sort((left, right) => right.confidence! - left.confidence!);
  }

  createEmpty(): RecognizedIngredient {
    return {
      id: this.nextId++,
      name: '',
      quantity: 1,
      unit: 'Stk.',
      confidence: null,
      candidates: [],
    };
  }

  private async detectWithCandidates(model: DetectionModel, image: HTMLImageElement): Promise<RawDetection[]> {
    const tf = model.model && (await this.loadTf());
    if (!tf || !model.model) {
      // Fallback if coco-ssd ever stops exposing its internal model: still works, just without alternatives.
      const detections = await model.detect(image, MAX_BOXES, MIN_BOX_SCORE);
      return detections.map((detection) => ({ candidates: [{ className: detection.class, score: detection.score }] }));
    }

    const batched = tf.tidy(() => tf.expandDims(tf.browser.fromPixels(image)));
    const result = await model.model.executeAsync(batched);
    const scoresTensor = result[0];
    const boxesTensor = result[1];
    const numBoxes = scoresTensor.shape[1] as number;
    const numClasses = scoresTensor.shape[2] as number;
    const scores = scoresTensor.dataSync();
    const boxesData = boxesTensor.dataSync();
    batched.dispose();
    tf.dispose(result);

    const maxScores = new Float32Array(numBoxes);
    for (let i = 0; i < numBoxes; i++) {
      let max = -Infinity;
      for (let c = 0; c < numClasses; c++) {
        const value = scores[i * numClasses + c];
        if (value > max) {
          max = value;
        }
      }
      maxScores[i] = max;
    }

    const previousBackend = tf.getBackend();
    if (previousBackend === 'webgl') {
      tf.setBackend('cpu');
    }
    const indexTensor = tf.tidy(() => {
      const boxes2d = tf.tensor2d(boxesData as Float32Array, [boxesTensor.shape[1] as number, boxesTensor.shape[3] as number]);
      return tf.image.nonMaxSuppression(boxes2d, maxScores, MAX_BOXES, MIN_BOX_SCORE, MIN_BOX_SCORE);
    });
    const indexes = indexTensor.dataSync();
    indexTensor.dispose();
    if (previousBackend !== tf.getBackend()) {
      tf.setBackend(previousBackend);
    }

    const detections: RawDetection[] = [];
    for (const boxIndex of Array.from(indexes)) {
      const candidates: { className: string; score: number }[] = [];
      for (let c = 0; c < numClasses; c++) {
        candidates.push({ className: COCO_CLASS_NAMES[c] ?? `class_${c}`, score: scores[boxIndex * numClasses + c] });
      }
      candidates.sort((left, right) => right.score - left.score);
      detections.push({ candidates: candidates.slice(0, TOP_CANDIDATES) });
    }
    return detections;
  }

  private loadTf(): Promise<typeof import('@tensorflow/tfjs-core')> {
    if (!this.tfPromise) {
      this.tfPromise = import('@tensorflow/tfjs-core');
    }
    return this.tfPromise;
  }

  private loadModel(): Promise<DetectionModel> {
    if (!this.modelPromise) {
      this.modelPromise = Promise.all([
        this.loadTf(),
        import('@tensorflow/tfjs-backend-cpu'),
        import('@tensorflow/tfjs-backend-webgl'),
        import('@tensorflow-models/coco-ssd'),
      ]).then(async ([tensorflow, _cpuBackend, _webglBackend, cocoSsd]) => {
          let webglReady = false;
          try {
            if (await tensorflow.setBackend('webgl')) {
              await tensorflow.ready();
              webglReady = true;
            }
          } catch {
            webglReady = false;
          }
          if (!webglReady) {
            if (!(await tensorflow.setBackend('cpu'))) {
              throw new Error('TensorFlow konnte kein unterstütztes Backend initialisieren.');
            }
            await tensorflow.ready();
          }
        // coco-ssd is CommonJS; production bundling can expose it either directly or under `.default`.
        const cocoSsdModule = cocoSsd as unknown as {
          load?: typeof cocoSsd.load;
          default?: { load: typeof cocoSsd.load };
        };
        const load = cocoSsdModule.load ?? cocoSsdModule.default?.load;
        if (!load) {
          throw new Error('coco-ssd Modul konnte nicht geladen werden.');
        }
        // 'mobilenet_v2' is the larger, more accurate coco-ssd base (vs. the previously
        // bundled 'lite_mobilenet_v2'); no local modelUrl override, so it downloads from
        // Google's tfjs-models CDN on first use and relies on normal HTTP caching afterwards.
        return (await load({ base: 'mobilenet_v2' })) as unknown as DetectionModel;
      }).catch((error: unknown) => {
        this.modelPromise = null;
        throw error;
      });
    }
    return this.modelPromise;
  }
}
