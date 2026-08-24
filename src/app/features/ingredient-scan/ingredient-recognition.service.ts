import { Injectable } from '@angular/core';

export interface RecognizedIngredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  confidence: number | null;
}

interface Detection {
  class: string;
  score: number;
}

interface DetectionModel {
  detect(image: HTMLImageElement): Promise<Detection[]>;
}

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

@Injectable({ providedIn: 'root' })
export class IngredientRecognitionService {
  private modelPromise: Promise<DetectionModel> | null = null;
  private nextId = 1;

  async recognize(image: HTMLImageElement): Promise<RecognizedIngredient[]> {
    const model = await this.loadModel();
    const detections = await model.detect(image);
    const grouped = new Map<string, { count: number; confidence: number }>();

    for (const detection of detections) {
      const ingredientName = INGREDIENT_CLASSES[detection.class];
      if (!ingredientName || detection.score < 0.45) {
        continue;
      }
      const existing = grouped.get(ingredientName);
      grouped.set(ingredientName, {
        count: (existing?.count ?? 0) + 1,
        confidence: Math.max(existing?.confidence ?? 0, detection.score),
      });
    }

    return [...grouped.entries()]
      .map(([name, result]) => ({
        id: this.nextId++,
        name,
        quantity: result.count,
        unit: 'Stk.',
        confidence: result.confidence,
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
    };
  }

  private loadModel(): Promise<DetectionModel> {
    if (!this.modelPromise) {
      this.modelPromise = Promise.all([
        import('@tensorflow/tfjs-core'),
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
        return load({
          base: 'lite_mobilenet_v2',
          modelUrl: 'assets/models/coco-ssd/model.json',
        });
      }).catch((error: unknown) => {
        this.modelPromise = null;
        throw error;
      });
    }
    return this.modelPromise;
  }
}