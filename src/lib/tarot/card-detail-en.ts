import { CARD_DETAIL_MAJOR_EN_A } from './card-detail-major-en-a';
import { CARD_DETAIL_MAJOR_EN_B } from './card-detail-major-en-b';
import { CARD_DETAIL_MINOR_WANDS_EN } from './card-detail-minor-wands-en';
import { CARD_DETAIL_MINOR_CUPS_EN } from './card-detail-minor-cups-en';
import { CARD_DETAIL_MINOR_SWORDS_EN } from './card-detail-minor-swords-en';
import { CARD_DETAIL_MINOR_PENTACLES_EN } from './card-detail-minor-pentacles-en';

export interface LocalizedCardDetail {
  keywords: string[];
  uprightKeywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  loveMeaning: string;
  careerMeaning: string;
  symbolism: string;
  advice: string;
}

export const CARD_DETAIL_EN: Record<string, LocalizedCardDetail> = {
  'the-fool': {
    keywords: ['New Beginnings', 'Spontaneity', 'Freedom', 'Innocence', 'Leap of Faith'],
    uprightKeywords: ['Pure Beginnings', 'Courageous Adventure', 'Boundless Potential', 'Trusting Intuition', 'Unbound Spirit'],
    reversedKeywords: ['Recklessness', 'Escapism', 'Blind Optimism', 'Lack of Preparation', 'Fear of the Unknown'],
    uprightMeaning:
      'The Fool embodies fresh beginnings, open-hearted innocence, and the bold spirit of exploration. Standing at the edge of the precipice does not signal peril, but the courage to step beyond familiar boundaries and embrace untamed possibilities. Trust your inner compass; life is unfolding an unwritten chapter.',
    reversedMeaning:
      'Reversed, The Fool asks whether haste, ungrounded impulsiveness, or avoidance of accountability is guiding your steps. Before leaping into the unknown, ensure your essential groundwork is intact to prevent setbacks borne of blind optimism.',
    loveMeaning:
      'Upright points to a lighthearted, refreshing connection unburdened by past baggage. Reversed cautions against fear of commitment, emotional escapism, or impulsive choices.',
    careerMeaning:
      'Upright favors pioneering ventures, creative departures, and cross-disciplinary leaps. Reversed cautions against depleted resources resulting from poor planning or unvetted risks.',
    symbolism:
      'The white rose signifies purity of purpose; the loyal white dog represents instinct and guardianship; the cliff edge symbolizes the limitless, uncharted threshold of the journey.',
    advice:
      'Release the weight of past expectations and step forward with untarnished curiosity. The world is waiting to meet you.'
  },
  'the-moon': {
    keywords: ['Illusion & Mist', 'Subconscious Shadows', 'Night Trial', 'Hidden Realities', 'Intuitive Perception'],
    uprightKeywords: ['Piercing the Veil', 'Seeing Deeper Truth', 'Facing Fear', 'Subconscious Tides', 'Vigilance Against Illusion'],
    reversedKeywords: ['Dispelling Mists', 'Emerging from the Shadows', 'Truth Unveiled', 'Easing Anxiety', 'Releasing Fear'],
    uprightMeaning:
      'Under the silver gaze of the Moon, a winding pathway snakes toward twin towers while hound and wolf howl into the night and the crayfish ascends from the primordial waters. This card marks a passage of uncertainty, shifting tides, and deep subconscious stirrings. Things are rarely as straightforward as they appear on the surface; honor your intuition and move with mindful awareness.',
    reversedMeaning:
      'Reversed, the lingering fog begins to dissolve. Long-standing anxieties, hidden motives, and ambiguities are finally exposed to the light of clarity, allowing you to walk out from under the emotional gloom.',
    loveMeaning:
      'Upright cautions against suspicion, unspoken secrets, or projection onto a partner. Reversed heralds cleared misunderstandings and a return to honest emotional ground.',
    careerMeaning:
      'Upright warns of opacity, murky terms, or unreliable impressions—pause before signing commitments. Reversed signals that hidden facts and tangled dynamics are at last resolved.',
    symbolism:
      'The contemplative face of the Moon reflects introspective depths; the crayfish rising from the pond marks the stir of deep subconscious impulses; the dog and wolf embody our tame and primal natures walking side by side.',
    advice:
      'When the road ahead seems obscured, do not let imagined ghosts overpower your clarity. Keep your feet firmly planted and navigate one steady step at a time.'
  },
  'the-sun': {
    keywords: ['Radiant Splendor', 'Joy & Vitality', 'Illumination & Success', 'Lively Abundance', 'Unveiled Truth'],
    uprightKeywords: ['Sunlit Clarity', 'Unclouded Joy', 'Fulfillment & Triumph', 'Boundless Vitality', 'Warm Authenticity'],
    reversedKeywords: ['Passing Clouds', 'Overextended Ego', 'Deferred Good Fortune', 'Temporary Hesitation', 'Low Vitality'],
    uprightMeaning:
      'A brilliant golden sun pours warmth across the land, sunflowers blossom over the garden wall, and an unburdened child rides open-armed atop a gentle white steed. As the most joyful and auspicious archetype in the deck, The Sun dispels every trace of gloom, ushering in vitality, celebrated success, and genuine heartfelt happiness.',
    reversedMeaning:
      'Even in reverse, the sun’s warmth remains ever-present, merely veiled by a passing cloud. Fulfillment may arrive slightly later than anticipated, or you may be invited to temper ego and savor your achievements with genuine humility.',
    loveMeaning:
      'Upright reflects a radiant, warm-hearted union filled with laughter, transparency, and reciprocal affection. Reversed advises checking self-absorption or unrealistic expectations so warmth can freely flow.',
    careerMeaning:
      'Upright heralds a signature milestone, celebrated visibility, and thriving momentum. Reversed indicates solid underlying progress that simply requires patience and measured consistency.',
    symbolism:
      'Blooming sunflowers herald vigorous life and fruitful expression; the naked child astride the white horse mirrors the unencumbered soul embracing total freedom without pretense.',
    advice:
      'Open your heart completely to the bounty of the present, and generously share your inner warmth and radiance with everyone around you.'
  }
};

export const ALL_CARD_DETAIL_EN: Record<string, LocalizedCardDetail> = {
  ...CARD_DETAIL_EN,
  ...CARD_DETAIL_MAJOR_EN_A,
  ...CARD_DETAIL_MAJOR_EN_B,
  ...CARD_DETAIL_MINOR_WANDS_EN,
  ...CARD_DETAIL_MINOR_CUPS_EN,
  ...CARD_DETAIL_MINOR_SWORDS_EN,
  ...CARD_DETAIL_MINOR_PENTACLES_EN
};

export function getLocalizedCardDetailEn(slug: string): LocalizedCardDetail | undefined {
  return ALL_CARD_DETAIL_EN[slug];
}
